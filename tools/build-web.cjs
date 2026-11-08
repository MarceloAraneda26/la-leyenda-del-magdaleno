/* Paquete estático limpio: sin herramientas de desarrollo ni QA. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),output=path.resolve(process.argv[2]||path.join(root,'dist'));
if(output===root||!output.startsWith(path.dirname(root)+path.sep))throw new Error('El destino debe estar dentro del espacio del proyecto.');
fs.mkdirSync(output,{recursive:true});
const files=['index.html','etapa2.html','etapa2.css','ETAPA_2.md','etapa3.html','etapa3.css','ETAPA_3.md','animaciones.html','ANIMACIONES.md','ARMAS.md','styles.css','mobile.css','campaign.css','story.css','manifest.webmanifest','sw.js','movil.html','trailer.html','TRAILER.md','README.md','ETAPAS.md','PUBLICAR.md','CAMBIOS.md','RECORRIDO.md','VERSION.json','ANALISIS_ANIMACIONES.md'];
for(const file of files)fs.copyFileSync(path.join(root,file),path.join(output,file));
for(const folder of ['src','assets','media','animaciones','auditoria_animaciones','auditoria_villanos'])fs.cpSync(path.join(root,folder),path.join(output,folder),{recursive:true});
fs.writeFileSync(path.join(output,'.nojekyll'),'');console.log('Web estática preparada en '+output);
