const { io, url } = require("lastejobb");

let tre = io.lesDatafil("indexed_raster_indices");

new url(tre).assignUrls();
io.skrivDatafil(__filename, tre);
