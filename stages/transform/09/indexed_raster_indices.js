const { io } = require("lastejobb");

let tre = io.lesDatafil("flett");
let hierarki = io.lesDatafil("kodehierarki");
const barnAv = hierarki.barn;

lagIndexerForRasterkart("NN-NA-BS-2BE");
io.skrivDatafil(__filename, tre);

function lagIndexerForRasterkart(kode) {
  let cursor = { index: 1 };
  traverser(tre, kode, cursor);
}

function traverser(r, kode, cursor) {
  const node = r[kode];
  const barna = barnAv[kode];

  if (!node.kart) node.kart = {};
  if (!node.kart.format) node.kart.format = {};
  if (!node.kart.format.raster_indexed) node.kart.format.raster_indexed = {};
  node.kart.format.raster_indexed.index = cursor.index;
  cursor.index++;
  if (barna) barna.forEach(barn => traverser(r, barn, cursor));
}
