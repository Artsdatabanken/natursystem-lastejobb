const lastejobb = require("lastejobb");

const scripPath = process.argv[2] || "steg";
lastejobb.kjørLastejobberUnder(scripPath);
