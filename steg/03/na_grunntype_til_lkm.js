//var JSONStream = require("JSONStream");
//var csv = require("csv");
//const fs = require("fs");
//const log = require("log-less-fancy")();
//const config = require("../../config");
const { csv, io } = require("lastejobb");

const kildefil =
  "./nin-data/Natur_i_Norge/Natursystem/Typeinndeling/basistrinn_per_grunntype.csv";
const json = csv.les(kildefil, { from_line: 1 });
io.skrivDatafil("na_grunntype_til_lkm.csv.json", json);
