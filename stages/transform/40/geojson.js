const { io, log, json } = require("lastejobb");
const fs = require('fs');
const readline = require('readline');

let altkoder = io.lesDatafil('altkode.json')
const kodemap = Object.values(altkoder).reduce((acc, kode) => {
    acc[kode] = true
    return acc
}, {})

const stats = { mangler_koder: 0, ukjent: {} }
const header = '{"type": "FeatureCollection","name": "sql_statement","crs":{ "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },"features": ['
// +'{ "type":"Feature","properties":{"koder":["junk"]},"geometry":{"type":"Point","coordinates":[0,0]}}'

var writeStream = fs.createWriteStream('temp/natok3.geojson');
//writeStream.write(header)

const readInterface = readline.createInterface({
    input: fs.createReadStream('./temp/natok.json'),
    _output: process.stdout,
    console: false
});

var firstline = true
readInterface.on('line', function (line) {
    if (line.length === 0) return
    if (line.indexOf('"Feature"') <= 0) { console.log('skip', line); return }
    line = line.replace(/,$/, "")
    line = line.replace(" ", "");
    const feature = JSON.parse(line)
    var koder = fixKoder(feature.properties)
    feature.properties.koder = koder
    var sol = "\n"
    //    if (!firstline)
    //        sol = "," + sol
    //    firstline = false
    writeStream.write(sol + JSON.stringify(feature));
});

readInterface.on('close', function () {
    console.log(JSON.stringify(stats))
    fs.writeFileSync('summary.json', JSON.stringify(stats))
});

function fixKoder(props) {
    if (!props.koder) { stats.mangler_koder++; return [] }
    const koder = props.koder.map(k => {
        if (!k) return null
        k = k.toUpperCase()
        if (k.indexOf('L4-C') == 0)
            k = k.replace('-C-', '-')
        if (altkoder[k]) return altkoder[k]
        var ninkode = 'NN-NA-TI-' + k.replace(/_/g, "-")
        if (kodemap[ninkode])
            return ninkode
        ninkode = 'NN-NA-BS-' + k.replace(/_/g, "-")
        if (kodemap[ninkode])
            return ninkode
        if (k.indexOf('LKM') === 0)
            k = k.replace('LKM', '')
        ninkode = 'NN-NA-LKM-' + k.replace(/_/g, "-")
        if (kodemap[ninkode])
            return ninkode

        stats.ukjent[k] = stats.ukjent[k] || 0
        stats.ukjent[k]++
    })
    return koder.filter(x => !!x)
}


// find -type d -execdir node ~/geojson-subset-kart-lastejobb/geojson-subset-kart-lastejobb.js ~/natok3.geojson {} \;
