const { io, json, log } = require("lastejobb");
const typesystem = require("@artsdatabanken/typesystem");

const r = {};

flett("ar_diagnostisk_art");
flett("na_med_basistrinn_relasjon");
flett("na_mi_liste");
flett("mi_variasjon");
flett("na_prosedyrekategori");
flett("na_definisjonsgrunnlag");
flettKildedata("data/nin-egenskapsdata/Natur_i_Norge/Natursystem/type");
flettKildedata(
  "data/nin-egenskapsdata/Natur_i_Norge/Natursystem/Miljøvariabler/type"
);
flettKildedata(
  "data/nin-egenskapsdata/Natur_i_Norge/Natursystem/Beskrivelsessystem/Regional_naturvariasjon/type"
);
flett("farger");

fjernCrap();
sjekkAtTitlerEksisterer();
capsTitler();
typesystem.kobleForeldre(r);
overrideDefects();
propagerNedFlaggAttributt();

function fjernCrap() {
  delete r["NN-NA-BS-2FO-X"];
}

// På sedimentsortering er det innført et ekstra tullenivå som bryter med systemet
// For å unngå en heap av trøbbel justerer vi kodene inn rett under LKM og dropper
// mellomnivået
function overrideDefects() {
  splittTitlerMed2Språk("NN-NA-BS-2BE", "en");
  splittTitlerMed2Språk("NN-NA-BS-1AR", "la");
  splittTitlerMed2Språk("NN-NA-LKM-SA", "la");
  splittTitlerMed2Språk("NN-NA-LKM-DM", "la");
  //  splittTitlerMed2Språk("", "la");
  const koder = ["NN-NA-LKM-S3-E", "NN-NA-LKM-S3-F", "NN-NA-LKM-S3-S"];
  Object.keys(r).forEach(kode => {
    const node = r[kode];
    koder.forEach(m => {
      if (node.relasjon) {
        const node = r[kode];
        node.relasjon.forEach(rel => {
          rel.kode = rel.kode.replace("NN-NA-LKM-S3-", "NN-NA-LKM-S3");
        });
      }
      if (!kode.startsWith(m)) return;
      const destKode = kode.replace("S3-", "S3");
      node.foreldre[0] = kode === m ? "NN-NA-LKM" : m.replace("S3-", "S3");
      json.moveKey(r, kode, destKode);
    });
  });
  delete r["NN-NA-LKM-S3"];
}

function splittTitlerMed2Språk(kodeprefix, språkkode) {
  Object.keys(r).forEach(kode => {
    if (!kode.startsWith(kodeprefix)) return;
    const node = r[kode];
    const tittel = node.tittel;
    // 'Vulkansk bergart (volcanic rock)' =>  nb: vulkansk, en: volcanic
    const parts = tittel.nb.split("(");
    if (parts.length !== 2) return;
    if (kodeprefix === "") log.warn(kode, tittel);
    tittel.nb = parts[0].trim();
    const utlandsk = parts[1].replace(")", "");
    tittel[språkkode] = utlandsk[0].toUpperCase() + utlandsk.substring(1);
  });
}

function flettAttributter(o) {
  for (let key of Object.keys(o)) {
    let kode = key.replace("_", "-");
    kode = kode.toUpperCase();
    const src = o[key];
    r[kode] = Object.assign({}, r[kode], src);
  }
}

function flett(filename) {
  var data = io.lesDatafil(filename);
  let o = data;
  if (o.items) o = json.arrayToObject(data.items, { uniqueKey: "kode" });
  flettAttributter(o);
}

function flettKildedata(filename) {
  var data = io.readJson(filename + ".json");
  let o = data;
  if (o.items) o = json.arrayToObject(data.items, { uniqueKey: "kode" });
  flettAttributter(o);
}

function propagerNedFlaggAttributt() {
  for (let kode of Object.keys(r)) {
    const node = r[kode];
    for (const fkode of node.foreldre) {
      const foreldernode = r[fkode];
      if (!foreldernode)
        throw new Error(`Forelderen ${fkode} til ${kode} mangler.`);
      if (r[fkode].type === "flagg") node.type = "flagg";
      if (r[fkode].type === "gradient") node.type = "gradientverdi";
    }
    if (kode.startsWith("NN-NA-LKM"))
      if (!node.type) log.warn("Missing type attribute on: " + kode);
  }
}

function capsTitler() {
  for (let key of Object.keys(r)) {
    const tittel = r[key].tittel;
    Object.keys(tittel).forEach(lang => {
      let tit = tittel[lang].replace(/\s+/g, " "); // Fix double space issues in source data
      if (tit) tittel[lang] = tit.replace(tit[0], tit[0].toUpperCase());
      else log.warn("Mangler tittel: ", key);
    });
  }
}

function sjekkAtTitlerEksisterer() {
  const notitle = [];
  for (let key of Object.keys(r)) {
    const node = r[key];
    if (!node.se) {
      if (!node.tittel) {
        log.warn(`Mangler tittel for ${key}: ${JSON.stringify(node)}`);
        notitle.push(key);
      } else {
        node.tittel = Object.entries(node.tittel).reduce((acc, e) => {
          if (!e[1])
            log.warn(`Mangler tittel for ${key}: ${JSON.stringify(node)}`);
          acc[e[0]] = e[1].trim();
          return acc;
        }, {});
        if (r[key].kode) {
          debugger;
          log.warn("Har allerede unødig kode property: ", key);
        }
      }
    }
  }

  if (notitle.length > 0) {
    log.warn("Mangler tittel: " + notitle.join(", "));
    notitle.forEach(key => delete r[key]);
  }
}

io.skrivDatafil(__filename, r);
