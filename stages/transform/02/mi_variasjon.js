const { io } = require("lastejobb");

let koder = io.readJson(
  "temp/natursystem-ubehandlet/kodeliste_v2b_variasjon.json"
).data;
let banlist = io.readJson(
  "temp/natursystem-ubehandlet/kodeliste_v2b_variasjon.ignore.json"
);

function kodefix(kode) {
  if (!kode) return null;
  kode = kode.toUpperCase();
  kode = kode.replace("_", "-");
  kode = kode.replace("–", "-");

  if (kode.indexOf("BESYS") === 0)
    return kode.replace("BESYS", "NN-NA-BS-").replace("BS0", "BS");
  if (kode === "LKM") return "NN-NA-LKM";
  if ("0123456789".indexOf(kode[0]) < 0) return "NN-NA-LKM-" + kode;
  return "NN-NA-BS-" + kode;
}

function importerKoder() {
  const mineKoder = {};
  for (let key of Object.keys(koder)) {
    const node = koder[key];
    const kode = kodefix(node.Kode.Id);
    if (banlist[kode]) continue;
    const tittel = node.Navn;
    let o = {
      tittel: { nb: tittel },
      altkode: node.Kode.Id
    };
    mineKoder[kode] = o;
  }
  return mineKoder;
}
function merkGradienter(imp) {
  for (var kode of Object.keys(imp)) {
    const parts = kode.split('-')
    if (parts.length < 5) continue
    const key = parts.pop()
    if ("01234567890".indexOf(key) < 0) continue
    const parentkode = parts.join('-')
    const parent = imp[parentkode]
    if (parent)
      parent.type = "gradient"
  }
}

const imp = importerKoder();
merkGradienter(imp)
imp["NN-NA-LKM"].tittel.nb = "Miljøvariabler";

io.skrivDatafil(__filename, imp);
