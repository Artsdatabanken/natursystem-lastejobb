const { io, log, json } = require("lastejobb");

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

let tre = io.lesDatafil("flett");
Object.keys(tre).forEach(kode => oppdaterNivå(kode));
io.skrivBuildfil(__filename, json.objectToArray(tre, "kode"));

function oppdaterNivå(kode) {
  const forf = getStack(kode);
  tre[kode].nivå = hentNivå(forf, nivåer);
}

function hentNivå(forf, nivåer) {
  if (forf.length === 0) return nivåer.nivå && nivåer.nivå[0];
  const subnivåer = nivåer[forf[0]];
  if (subnivåer) return hentNivå(forf.slice(1), subnivåer);

  if (!nivåer.nivå) return log.warn("Mangler nivå for " + forf[0]);
  const index = forf.length;
  if (index >= nivåer.nivå.length)
    return log.warn("Mangler dypere nivå " + forf[0]);
  return nivåer.nivå[index];
}

function getStack(kode) {
  const node = tre[kode];
  if (node.foreldre.length <= 0) return [node.tittel.nb];
  return [...getStack(node.foreldre[0]), node.tittel.nb];
}
