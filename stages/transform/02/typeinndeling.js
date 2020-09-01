const { io } = require("lastejobb");

let alleKoder = io.readJson("./temp/natursystem-ubehandlet/kodeliste_v2b.json")
  .data;
let ingress = io.readJson(
  "./temp/natursystem-ubehandlet/Typeinndeling/beskrivelse.json"
);

function kodefix(kode) {
  if (!kode) return kode;
  const frags = kode.toUpperCase().split(" ");
  if (frags.length < 2) return "NN-NA-TI";
  return "NN-NA-TI-" + frags.pop();
}

function importerKoder() {
  const mineKoder = {};
  for (let node of alleKoder) {
    const kode = kodefix(node.Kode.Id);
    const ingresskode = node.Kode.Id.replace(" ", "-");
    let o = { tittel: { nb: node.Navn }, altkode: node.Kode.Id.replace("NA ", "") };
    if (ingress[ingresskode]) o.ingress = { nb: ingress[ingresskode] };
    mineKoder[kode] = o;
  }
  return mineKoder;
}

const koder = importerKoder();
io.skrivDatafil(__filename, koder);
