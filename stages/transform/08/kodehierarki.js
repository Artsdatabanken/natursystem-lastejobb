const { io } = require("lastejobb");
const typesystem = require("@artsdatabanken/typesystem");

let data = io.lesTempJson("flett");
const hierarki = typesystem.lagHierarki(data);
io.skrivDatafil(__filename, hierarki);
