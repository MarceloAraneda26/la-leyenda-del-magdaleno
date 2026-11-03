const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),source=path.resolve(process.argv[2]||process.env.MAGDALENO_TRAILER_OUTPUT||path.resolve(root,'../trailer_magdaleno')),media=path.join(root,'media');
const montage=JSON.parse(fs.readFileSync(path.join(source,'montaje.json'),'utf8'));
const version=montage.mediaVersion||JSON.parse(fs.readFileSync(path.join(root,'VERSION.json'),'utf8')).gameVersion;
const duration=montage.duration;
assert.equal(montage.noEndingSpoilers,true,'El generador debe haber validado cada cuadro.');
assert(!montage.scenes.some(scene=>['shop','friends'].includes(scene.id)));
assert(!/Matahombres|ÚLTIMA PRUEBA|EL COÑAC ES LEYENDA|Por la junta/i.test(JSON.stringify([montage.scenes,montage.narrationCaptions])));
const stamp=time=>'00:'+String(Math.floor(time/60)).padStart(2,'0')+':'+(time%60).toFixed(3).padStart(6,'0');
const cues=montage.narrationCaptions||montage.scenes.map(scene=>({...scene,text:scene.title.join(' ')+'\n'+scene.sub}));
cues.forEach((cue,i)=>{assert(cue.start>=0&&cue.end>cue.start&&cue.end<=duration);assert(i===0||cue.start>=cues[i-1].end);});
const captions='WEBVTT\n\n'+cues.map((cue,index)=>(index+1)+'\n'+stamp(cue.start)+' --> '+stamp(cue.end)+'\n'+cue.text+'\n').join('\n');
fs.writeFileSync(path.join(media,'trailer.vtt'),captions);
const videos=[];
for(const [shape,poster]of [['16x9','trailer-poster.jpg'],['9x16','trailer-vertical-poster.jpg']]){
  const file='Magdaleno_trailer_'+shape+'.mp4',input='Magdaleno_trailer_'+shape+(montage.audioMix?'_narrado':'')+'.mp4';fs.copyFileSync(path.join(source,input),path.join(media,file));
  const data=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate','-of','json',path.join(media,file)],{encoding:'utf8',windowsHide:true}));
  assert(Math.abs(Number(data.format.duration)-duration)<.05);assert(data.streams.some(stream=>stream.codec_name==='h264'));assert(data.streams.some(stream=>stream.codec_name==='aac'));
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','1.5','-i',path.join(media,file),'-frames:v','1','-update','1',path.join(media,poster)],{windowsHide:true});videos.push({file,...data});
}
let page=fs.readFileSync(path.join(root,'trailer.html'),'utf8');
page=page.replace(/(media\/[^"?]+\.(?:mp4|jpg|vtt))(?:\?v=[^" ]+)?/g,'$1?v='+version);
page=page.replace(/\d+ SEGUNDOS (?:PARA SALVAR LA JUNTA|DE AVENTURA · SIN REVELAR EL DESENLACE)/,duration+' SEGUNDOS DE AVENTURA · SIN REVELAR EL DESENLACE');
if(montage.audioMix)page=page.replace(/<p class="credits">[\s\S]*?<\/p>/,'<p class="credits">Escenas preparadas dentro del motor del juego con sus sprites, animaciones y efectos reales. Narración y música aportadas para el tráiler, con la voz al frente y el fondo musical suave. Subtítulos en español disponibles en el reproductor.</p>');
fs.writeFileSync(path.join(root,'trailer.html'),page);
fs.mkdirSync(path.join(root,'qa'),{recursive:true});
fs.writeFileSync(path.join(root,'qa/trailer_sin_spoilers.json'),JSON.stringify({status:'passed',version,duration,narrated:!!montage.audioMix,captionCount:cues.length,noEndingSpoilers:montage.noEndingSpoilers,frameGuards:['No celebración','No estado final','No prueba final','No localización final'],textAndCaptionsChecked:true,videos},null,2));
console.log(JSON.stringify({status:'passed',version,scenes:montage.scenes.map(scene=>scene.id),videos:videos.map(({file,format})=>({file,duration:format.duration}))},null,2));
