const { io, log, json } = require("lastejobb");

// Setter nivå og målestokk

const hierarki = {
  "Natur i Norge": {
    Natursystem: {
      Beskrivelsessystem: {
        målestokk: [20000, 20000, 20000, 20000, 20000, 20000, 20000]
      },
      nivå: "Natursystem",
      Miljøvariabler: {
        nivå: ["Lokal kompleks miljøvariabel", "Miljøvariabel", "Basistrinn"],
        målestokk: [5000, 5000, 5000],
        "Definisjonsgrunnlag for hovedtypen": {
          målestokk: [5000, 5000, 5000],
          nivå: [
            "Definisjonsgrunnlag for hovedtypen",
            "Definisjonsgrunnlag for hovedtypen",
            "Definisjonsgrunnlag for hovedtypen"
          ]
        }
      },
      Typeinndeling: {
        nivå: [
          "Naturtype",
          "Hovedtypegruppe",
          "Hovedtype",
          "Kartleggingsenhet 1:20000",
          "Kartleggingsenhet 1:5000",
          "Grunntype"
        ],
        målestokk: [20000, 20000, 20000, 20000, 5000, 5000]
      },
      nivå: ["Naturmangfoldnivå"],
      målestokk: [20000]
    }
  }
};

let tre = io.lesDatafil("url");
let kodehierarki = io.lesDatafil("kodehierarki");
const barnAv = kodehierarki.barn;
Object.keys(tre).forEach(kode => oppdaterNivå(kode));

io.skrivBuildfil(__filename, json.objectToArray(tre, "kode"));

function oppdaterNivå(kode) {
  const stack = getStack(kode);
  const node = tre[kode];
  node.nivå = hentNivå("nivå", stack, hierarki, kode);
  if (!node.nivå) throw new Error("Mangler nivå for " + kode);
  node.kart = node.kart || {};
  node.kart.målestokk = hentNivå("målestokk", stack, hierarki, kode);
}

function hentNivå(nøkkel, segmenter, hierarki, kode) {
  if (kode === "NN") return nøkkel == "nivå" ? "Natur i Norge" : 20000;
  if (kode.startsWith("NN-NA-BS"))
    if (segmenter.length === 0) return hierarki[nøkkel] && hierarki[nøkkel][0];
  if (nøkkel === "nivå" && segmenter[0] === "Beskrivelsessystem")
    return nivåBeskrivelsessystem(kode);
  const subnivåer = hierarki[segmenter[0]];
  if (subnivåer)
    // && segmenter.length > 1)
    return hentNivå(nøkkel, segmenter.slice(1), subnivåer, kode);

  if (!hierarki[nøkkel]) {
    return log.warn("Mangler " + nøkkel + " for " + segmenter[0]);
  }
  const index = segmenter.length;
  if (index >= hierarki[nøkkel].length)
    return log.warn("Mangler dypere nivå " + segmenter[0]);
  return hierarki[nøkkel][index];
}

function getStack(kode) {
  const node = tre[kode];
  if (node.foreldre.length <= 0) return [node.tittel.nb];
  const stack = [...getStack(node.foreldre[0]), node.tittel.nb];
  return stack;
}

function nivåBeskrivelsessystem(kode) {
  if (kode === "NN-NA-BS") return "Beskrivelsesystem";

  let undernivå = 0;
  while (barnAv[kode]) {
    kode = barnAv[kode][0];
    undernivå++;
  }
  const nivå = ["Verdi", "Variabel", "Kilde til variasjon"];
  if (undernivå > 2) undernivå = 2;
  return nivå[undernivå];
}
