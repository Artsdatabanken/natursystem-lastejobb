const { io } = require("@artsdatabanken/lastejobb");
const tinycolor = require("tinycolor2");

let r = {};

function settFarger(kilde, mapper) {
  Object.keys(kilde).forEach(kode => {
    let farge = mapper(kilde[kode]);
    r[kode] = { farge: farge.toHexString() };
  });
}

const lighten = node => tinycolor(node).lighten(20);

settFarger(
  io.readJson("temp/natursystem-ubehandlet/Typeinndeling/farger_dominant.json"),
  lighten
);

io.skrivDatafil(__filename, r);
