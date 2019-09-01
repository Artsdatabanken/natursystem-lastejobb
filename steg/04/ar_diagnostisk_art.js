const { io } = require("lastejobb");
const log = require("log-less-fancy")();

log.logLevel = 6;

let diagArt = io.readJson(
  "nin-data/Natur_i_Norge/Natursystem/Typeinndeling/diagnostisk_art.json"
);
let nin_liste = io.lesDatafil("na_kode");

let r = {};

// TODO:
const map = {
  mengdeart: true,
  kjennetegnende_tyngdepunktart: true,
  tyngdepunktart: true,
  vanlig_art: true,
  dominerende_mengdeart: true,
  absolutt_skilleart: true,
  "svak_relativ skilleart": true,
  "sterk_relativ skilleart": true,
  konstant_art: true,
  skilleart: true,
  "gradient-tyngdepunktart": true
};

function linkOne(kodeFra, kodeTil, funksjon, tag) {
  const variabel = tag;

  if (!kodeFra) throw new Error("Mangler kode: " + kodeFra);
  if (!kodeTil) throw new Error("Mangler kode: " + kodeTil);
  if (!r[kodeFra]) r[kodeFra] = { relasjon: [] };
  const relasjon = r[kodeFra].relasjon;
  if (relasjon[kodeTil]) throw new Error(".");
  relasjon.push({
    kode: kodeTil,
    kant: variabel,
    kantRetur: "Habitat"
  });
}

function linkBoth(node1, node2, funksjon, tag) {
  if (!tag) return;
  if (!funksjon) return;
  tag = tag.trim().replace(" ", "_");
  funksjon = funksjon.trim();
  linkOne(node1, node2, funksjon, tag);
}

let ukjenteKoder = {};
let ukjenteArter = {};

Object.keys(diagArt).forEach(key => {
  const art = diagArt[key];
  if (!art) throw new Error("Mangler art " + key);
  const hovedtype = "NN-NA-TI-" + art.Kartleggingsenhet.split("-")[0];
  const na_kode = "NN-NA-TI-" + art.Kartleggingsenhet.trim();

  if (!nin_liste[na_kode])
    ukjenteKoder[na_kode] = ukjenteKoder[na_kode]
      ? ukjenteKoder[na_kode] + 1
      : 1;
  else {
    const sciId = "AR-" + art.scientificNameID;
    linkBoth(na_kode, sciId, art["Funksjon1"], art["tags1"]);
    linkBoth(na_kode, sciId, art["Funksjon2"], art["tags2"]);
    linkBoth(na_kode, sciId, art["Funksjon3"], art["tags3"]);
    linkBoth(na_kode, sciId, art["Funksjon 4"], art["tags4"]);
  }
});

if (ukjenteKoder) log.warn("Ukjente naturtyper", ukjenteKoder);
if (Object.keys(ukjenteArter).length > 0)
  log.warn("Ukjente arter", Object.keys(ukjenteArter).length);
io.skrivDatafil(__filename, r);
