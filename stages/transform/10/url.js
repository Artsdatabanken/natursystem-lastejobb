const { io, url } = require("lastejobb");

let tre = io.lesDatafil("indexed_raster_indices");

new url(tre, "Natur_i_Norge").assignUrls();
io.skrivDatafil(__filename, tre);
