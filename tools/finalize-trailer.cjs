const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),source=path.resolve(root,'../trailer_magdaleno'),media=path.join(root,'media');
const montage=JSON.parse(fs.readFileSync(path.join(source,'montaje.json'),'utf8'));
const version=JSON.parse(fs.readFileSync(path.join(root,'VERSION.json'),'utf8')).gameVersion;
assert.equal(montage.noEndingSpoilers,true,'El generador debe haber validado cada cuadro.');
assert(!montage.scenes.some(scene=>['shop','friends'].includes(scene.id)));
assert(!/Matahombres|ÚLTIMA PRUEBA|EL COÑAC ES LEYENDA|Por la junta/i.test(JSON.stringify(montage.scenes)));
const stamp=time=>'00:'+String(Math.floor(time/60)).padStart(2,'0')+':'+(time%60).toFixed(3).padStart(6,'0');
const captions='WEBVTT\n\n'+montage.scenes.map((scene,index)=>(index+1)+'\n'+stamp(scene.start)+' --> '+stamp(scene.end)+'\n'+scene.title.join(' ')+'\n'+scene.sub+'\n').join('\n');
fs.writeFileSync(path.join(media,'trailer.vtt'),captions);
const videos=[];
for(const [shape,poster]of [['16x9','trailer-poster.jpg'],['9x16','trailer-vertical-poster.jpg']]){
  const file='Magdaleno_trailer_'+shape+'.mp4';fs.copyFileSync(path.join(source,file),path.join(media,file));
  const data=JSON.parse(execFileSync('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate','-of','json',path.join(media,file)],{encoding:'utf8',windowsHide:true}));
  assert.equal(Number(data.format.duration),30);assert(data.streams.some(stream=>stream.codec_name==='h264'));assert(data.streams.some(stream=>stream.codec_name==='aac'));
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss','1.5','-i',path.join(media,file),'-frames:v','1','-update','1',path.join(media,poster)],{windowsHide:true});videos.push({file,...data});
}
let page=fs.readFileSync(path.join(root,'trailer.html'),'utf8');
page=page.replace(/(media\/[^"?]+\.(?:mp4|jpg|vtt))(?:\?v=[^" ]+)?/g,'$1?v='+version);
page=page.replace('30 SEGUNDOS PARA SALVAR LA JUNTA','30 SEGUNDOS DE AVENTURA · SIN REVELAR EL DESENLACE');
fs.writeFileSync(path.join(root,'trailer.html'),page);
fs.writeFileSync(path.join(root,'qa/trailer_sin_spoilers.json'),JSON.stringify({status:'passed',version,noEndingSpoilers:montage.noEndingSpoilers,frameGuards:['No celebración','No estado final','No prueba final','No localización final'],textAndCaptionsChecked:true,videos},null,2));
console.log(JSON.stringify({status:'passed',version,scenes:montage.scenes.map(scene=>scene.id),videos:videos.map(({file,format})=>({file,duration:format.duration}))},null,2));
