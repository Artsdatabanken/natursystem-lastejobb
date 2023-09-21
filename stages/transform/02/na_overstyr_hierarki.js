const { io } = require("@artsdatabanken/lastejobb");

// Grunntyper (eksempel NA_T1-1) henger i kodelista på hovedtypen (NA_T)
// Vi ønsker følgende struktur NA_T -> NA_T1 -> NA_T1-E-1 -> NA_T1-C-1 -> NA_T1-1
// Dette for at grovere nivåer da tar med seg mer spesifikke data og viser også disse dataene.

let grunntyper = io.readJson(
  "temp/natursystem-ubehandlet/Typeinndeling/kartleggingsenhet.json"
);

let foreldre = {};

function slåOppHovedtype(subkode) {
  const ofs = subkode.indexOf("-", 9); //NN-NA-TI-V1-1
  if (ofs < 0) return subkode;
  return subkode.substring(0, ofs);
}

function harSammeGrunntyper(ckode, ekode) {
  let cgt = grunntyper[ckode].sort();
  let egt = grunntyper[ekode].sort();
  for (let kode of cgt) if (!egt.includes(kode)) return false;
  return true;
}

function link(ckode) {
  let ekoder = [];
  for (ekode of Object.keys(grunntyper)) {
    if (ekode.match(/-E-/gi))
      if (harSammeGrunntyper(ckode, ekode)) {
        ekoder.push(ekode);
      }
  }

  if (ekoder.length === 0) {
    ekoder = [slåOppHovedtype(ckode)];
  }
  foreldre[ckode] = ekoder;
}

for (let ckode of Object.keys(grunntyper)) {
  if (ckode.match(/-C-/gi)) {
    link(ckode);
    for (let grunntype of grunntyper[ckode]) {
      if (slåOppHovedtype(grunntype) !== grunntype) {
        foreldre[grunntype] = [ckode];
      }
    }
  }
  if (ckode.match(/-E-/gi)) {
    foreldre[ckode] = [slåOppHovedtype(ckode)];
  }
}

io.skrivDatafil(__filename, foreldre);
