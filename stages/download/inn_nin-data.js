const { git, log } = require("lastejobb");


log.info('Cloning...')
git.clone(
  "https://github.com/Artsdatabanken/natursystem-ubehandlet.git",
  "temp/natursystem-ubehandlet"
);
