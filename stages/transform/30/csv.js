const { io, log, json } = require("@artsdatabanken/lastejobb");
const fs = require('fs')

let tre = JSON.parse(fs.readFileSync("build/type.json"))
var lines = ""
var altkodemap = {}
const dupes = {}
tre.items.forEach(item => printKode(item.kode, item.altkode));

fs.writeFileSync('csv.sql', lines)
io.skrivDatafil('altkode.json', altkodemap)

function printKode(kode, altkode) {
    if (!altkode) return
    if (dupes[altkode]) console.warn(altkode)
    dupes[altkode] = true
    const line = "INSERT INTO import.type VALUES ('" + kode + "', '" + altkode + "'); \n"
    altkodemap[altkode] = kode
    lines += line
}