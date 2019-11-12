const { csv, io } = require("lastejobb");

const kildefil =
  "./temp/natursystem-ubehandlet/Typeinndeling/basistrinn_per_grunntype.csv";
const json = csv.les(kildefil, { from_line: 1 });

io.skrivDatafil("na_grunntype_til_lkm.csv.json", json);
