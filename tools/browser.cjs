/* Dependencia de desarrollo. El juego no necesita Playwright. */
const path=require('path'),os=require('os');
const candidates=[process.env.MAGDALENO_PLAYWRIGHT,'playwright',path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')].filter(Boolean);
let library;
for(const candidate of candidates){try{library=require(candidate);break}catch{}}
if(!library)throw new Error('Las pruebas necesitan Playwright. Instálalo en el entorno de desarrollo o define MAGDALENO_PLAYWRIGHT con su ruta.');
module.exports=library;
