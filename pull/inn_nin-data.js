const { git } = require("lastejobb");

// Download "Natur i Norge" data kildedata
git.clone("https://github.com/Artsdatabanken/nin-kildedata.git", "nin-data");
