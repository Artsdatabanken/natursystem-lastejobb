const { io, log } = require("@artsdatabanken/lastejobb");

// Lager liste av natursystemtyper og miljøvariabler

let typeinndeling = io.lesTempJson("typeinndeling");
let variasjon = io.lesTempJson("mi_variasjon");
let overrides = io.lesTempJson("na_overstyr_hierarki");

const alle = Object.assign({}, typeinndeling, variasjon);

let noder = {};
let fjernet = [];

function skalMedISystemet(kode) {
  // Kartleggingsenheter B og D utgår, men blir fjernet automatisk siden vi ikke har data der
  if (kode.match(/NN-NA-.*-B-/g) || kode.match(/NN-NA-.*-D-/g)) return false;
  return true;
}

for (let kode of Object.keys(alle))
  if (!skalMedISystemet(kode)) {
    fjernet.push(kode);
    delete alle[kode];
  }

for (let kode of Object.keys(alle)) {
  const node = alle[kode];

  var parts = kode.split("_");
  if (parts[1] & !node.infoUrl)
    node.infoUrl = "https://www.artsdatabanken.no/NiN2.0/" + parts[1];

  kode = kode.replace("LKM-S3-", "LKM-S3");
  if (overrides[kode]) node.foreldre = overrides[kode];
  noder[kode] = node;
}

fjernet.length > 0 &&
  log.debug(
    "Koder som ble fjernet fordi det er definert at de ikke skal med: " +
    fjernet.length
  );

io.skrivDatafil(__filename, noder);
