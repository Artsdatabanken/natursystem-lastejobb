const { io, url } = require("@artsdatabanken/lastejobb");

let tre = io.lesTempJson("indexed_raster_indices");

new url(tre).assignUrls();
io.skrivDatafil(__filename, tre);
