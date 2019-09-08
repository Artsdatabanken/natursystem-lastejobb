const { io, log, json } = require("lastejobb");

// Setter nivå og målestokk

const hierarki = {
  Natursystem: {
    Beskrivelsessystem: {
      nivå: ["Beskrivelsesystem", "Kilde til variasjon", "Variabel", "Verdi"],
      målestokk: [5000, 5000, 5000, 5000]
    },
    Miljøvariabler: {
      nivå: ["Lokal kompleks miljøvariabel", "Miljøvariabel", "Basistrinn"],
      målestokk: [5000, 5000, 5000]
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
    nivå: ["Natursystem"],
    målestokk: [20000]
  }
};

let tre = io.lesDatafil("flett");
Object.keys(tre).forEach(kode => oppdaterNivå(kode));

io.skrivBuildfil(__filename, json.objectToArray(tre, "kode"));

function oppdaterNivå(kode) {
  const segmenter = getStack(kode);
  const node = tre[kode];
  node.nivå = hentNivå("nivå", segmenter, hierarki);
  //  if (node.nivå === undefined) log.warn(node);
  node.kart = node.kart || {};
  node.kart.målestokk = hentNivå("målestokk", segmenter, hierarki);
}

function hentNivå(nøkkel, segmenter, nivåer) {
  if (segmenter.length === 0) return nivåer[nøkkel] && nivåer[nøkkel][0];
  const subnivåer = nivåer[segmenter[0]];
  if (subnivåer) return hentNivå(nøkkel, segmenter.slice(1), subnivåer);

  if (!nivåer[nøkkel]) return log.warn("Mangler nivå for " + segmenter[0]);
  const index = segmenter.length;
  if (index >= nivåer[nøkkel].length)
    return log.warn("Mangler dypere nivå " + segmenter[0]);
  return nivåer[nøkkel][index];
}

function getStack(kode) {
  const node = tre[kode];
  if (node.foreldre.length <= 0) return [node.tittel.nb];
  return [...getStack(node.foreldre[0]), node.tittel.nb];
}
