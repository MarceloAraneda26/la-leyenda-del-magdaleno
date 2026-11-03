/* Comprueba el máster y los dos vídeos finales; requiere FFmpeg y FFprobe. */
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{spawnSync,execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv[2]||path.resolve(root,'../trailer_narrado_20261103'));
const config=require('./trailer-narrado.json'),mix=JSON.parse(fs.readFileSync(path.join(out,'mezcla.json'),'utf8'));
const run=(tool,args)=>execFileSync(tool,args,{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
function loudness(file,range=[]){
  const result=spawnSync('ffmpeg',['-hide_banner','-nostdin',...range,'-i',file,'-vn','-af','loudnorm=I=-16:TP=-2:LRA=11:print_format=json','-f','null','-'],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
  assert.equal(result.status,0,result.stderr);
  const data=JSON.parse(result.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);
  return {lufs:Number(data.input_i),truePeakDb:Number(data.input_tp),lra:Number(data.input_lra)};
}
assert.equal(mix.voice.speed,1);assert.equal(mix.music.tempo,config.musicTempo);
assert(mix.voice.originalDuration+mix.voice.offsetSeconds<config.duration,'La locución no debe cortarse.');
const master=loudness(path.join(out,'narracion_y_musica.wav'));
assert(Math.abs(master.lufs+16)<.6);assert(master.truePeakDb<=-1.5);
const mp3=loudness(path.join(out,'narracion_y_musica.mp3'));assert(mp3.truePeakDb<=-1);
const voice=loudness(path.join(out,'voz_normalizada.wav'),['-ss','7.35','-t','3.9']);
const bed=loudness(path.join(out,'musica_bajo_la_voz.wav'),['-ss','7.35','-t','3.9']);
assert(voice.lufs-bed.lufs>=12,'El fondo no debe competir con la voz.');
const videos=[];
for(const [shape,width,height] of [['16x9',1920,1080],['9x16',1080,1920]]){
  const file=path.join(out,`Magdaleno_trailer_${shape}_narrado.mp4`);
  const metadata=JSON.parse(run('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels','-of','json',file]));
  const video=metadata.streams.find(s=>s.codec_name==='h264'),audio=metadata.streams.find(s=>s.codec_name==='aac');
  assert(video&&audio);assert.equal(video.width,width);assert.equal(video.height,height);assert.equal(video.r_frame_rate,'30/1');assert.equal(audio.channels,2);assert.equal(audio.sample_rate,'48000');assert(Math.abs(Number(metadata.format.duration)-config.duration)<.05);
  const level=loudness(file);assert(level.truePeakDb<=-1);assert(Math.abs(level.lufs+16)<.6);
  run('ffmpeg',['-hide_banner','-v','error','-nostdin','-i',file,'-f','null','-']);
  const audioHash=run('ffmpeg',['-hide_banner','-v','error','-i',file,'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-']).trim();
  videos.push({file:path.basename(file),duration:Number(metadata.format.duration),width,height,audioHash,...level});
}
assert.equal(videos[0].audioHash,videos[1].audioHash,'Ambos formatos deben usar la misma mezcla.');
const report={status:'passed',duration:config.duration,voiceSpeed:mix.voice.speed,musicTempo:mix.music.tempo,master,mp3,voiceOverMusicDb:Number((voice.lufs-bed.lufs).toFixed(2)),videos};
fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/trailer_audio.json'),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(out,'control_audio.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
