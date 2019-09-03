const { io } = require("lastejobb");

const r = {};

const nivåer = {
  Natursystem: {
    Beskrivelsessystem: {
      nivå: ["Beskrivelsesystem", "Kilde til variasjon", "Variabel", "Verdi"]
    },
    Miljøvariabler: {
      nivå: ["Lokal kompleks miljøvariabel", "Miljøvariabel", "Basistrinn"]
    },
    Typeinndeling: {
      nivå: [
        "Naturtype",
        "Hovedtypegruppe",
        "Hovedtype",
        "Kartleggingsenhet 1:20000",
        "Kartleggingsenhet 1:5000",
        "Grunntype"
      ]
    },
    nivå: ["Natursystem"]
  }
};

// node.undernivå

let tre = io.lesDatafil("na_mi_liste");
Object.keys(tre).forEach(kode => oppdaterNivå(kode));
io.skrivDatafil(__filename, r);

function oppdaterNivå(kode) {
  const forf = getStack(kode);
  debugger;
  //  node.nivå = node.nivå || typesystem.hentNivaa(node.url)[0];
}

function getStack(kode) {
  debugger;
  const node = tre[kode];
  if (!node.foreldre) return [node.tittel.nb];
  return [...getStack(node.foreldre[0]), node.tittel.nb];
}
