const { io } = require("lastejobb");

let hovedtyper = io.readJson(
  "nin-data/Natur_i_Norge/Natursystem/Typeinndeling/hovedtype.json"
);

function fromCsv(csv) {
  csv = csv.trim();
  if (!csv) return [];
  return csv.split(",").map(kode => "NN-NA-LKM-" + kode);
}

const kode_kunnskap = "NN-NA-TI-HT-KG";
const kode_definisjonsgrunnlag = "NN-NA-TI-HT-DG";

r = {};
hovedtyper.forEach(ht => {
  let me = {};
  me.nivå = "hovedtype";
  const hg = parseInt(ht["Kunnskapsgrunnlag - Hovedtypen generelt"]);
  const gi = parseInt(ht["Kunnskapsgrunnlag - Grunntypeinndelingen"]);
  me.kunnskap = {
    inndeling: {
      kode: kode_kunnskap + "-GI" + gi,
      verdi: gi
    },
    generelt: { kode: kode_kunnskap + hg, verdi: hg }
  };
  me.lkm = {
    d: fromCsv(ht.dLKM),
    h: fromCsv(ht.hLKM),
    t: fromCsv(ht.tLKM),
    u: fromCsv(ht.uLKM)
  };
  me.definisjonsgrunnlag = {};
  me.definisjonsgrunnlag.kode =
    kode_definisjonsgrunnlag + "-" + ht["GrL"].trim();
  me.definisjonsgrunnlag.tittel = { nb: ht["Definisjonsgrunnlag-tekst"] };
  me.prosedyrekategori = {};
  me.prosedyrekategori.kode = "NN-NA-LKM-PRK-" + ht["PrK"].toUpperCase();
  me.prosedyrekategori.tittel = { nb: ht["PrK-tekst"].trim() };
  me.nin1 = ht["NiN[1] "];
  r["NN-NA-TI-" + ht.HTK] = me;
});

io.skrivDatafil(__filename, r);
