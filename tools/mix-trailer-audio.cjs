/* Mezcla reproducible. Los originales se leen sin modificarlos ni publicarlos. */
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert/strict');
const {execFileSync}=require('child_process');
const config=require('./trailer-narrado.json');
const [mode,voiceArg,musicArg,outArg]=process.argv.slice(2);
if(!['audio','mux'].includes(mode)||!voiceArg||!musicArg||!outArg)throw new Error('Uso: node tools/mix-trailer-audio.cjs audio|mux <voz> <música> <carpeta de salida>');
const voice=path.resolve(voiceArg),music=path.resolve(musicArg),out=path.resolve(outArg),duration=config.duration;
for(const source of [voice,music])assert(fs.existsSync(source),'Falta el original: '+source);
fs.mkdirSync(out,{recursive:true});
const run=(tool,args)=>execFileSync(tool,args,{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
const ff=args=>run('ffmpeg',['-hide_banner','-nostdin','-y',...args]);
const probe=file=>JSON.parse(run('ffprobe',['-v','error','-show_entries','format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,channels','-of','json',file]));
function measured(file,filter,i=-17,tp=-3,lra=11){
  // FFmpeg imprime loudnorm en stderr; se conserva para medir la segunda pasada.
  const {spawnSync}=require('child_process');
  const result=spawnSync('ffmpeg',['-hide_banner','-nostdin','-i',file,'-af',filter+`,loudnorm=I=${i}:TP=${tp}:LRA=${lra}:print_format=json`,'-f','null','-'],{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});
  if(result.status!==0)throw new Error(result.stderr);
  return JSON.parse(result.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);
}
const norm=(stats,i,tp,lra)=>`loudnorm=I=${i}:TP=${tp}:LRA=${lra}:measured_I=${stats.input_i}:measured_TP=${stats.input_tp}:measured_LRA=${stats.input_lra}:measured_thresh=${stats.input_thresh}:offset=${stats.target_offset}:linear=true`;
const master=path.join(out,'narracion_y_musica.wav');
if(mode==='audio'){
  const voicePrep='highpass=f=70,lowpass=f=14000,aformat=sample_rates=48000:channel_layouts=stereo';
  const musicPrep=`atempo=${config.musicTempo},atrim=duration=${duration},highpass=f=45,lowpass=f=10500,aformat=sample_rates=48000:channel_layouts=stereo`;
  const voiceStats=measured(voice,voicePrep),musicStats=measured(music,musicPrep,-23,-6,9);
  const {spawnSync}=require('child_process');
  const voiceStem=path.join(out,'voz_normalizada.wav'),musicStem=path.join(out,'musica_suave.wav'),ducked=path.join(out,'musica_bajo_la_voz.wav');
  ff(['-loglevel','error','-i',voice,'-af',voicePrep+','+norm(voiceStats,-17,-3,11)+`,aresample=48000,adelay=${Math.round(config.voiceOffset*1000)}:all=1,apad,atrim=duration=${duration}`,'-c:a','pcm_s24le',voiceStem]);
  ff(['-loglevel','error','-i',music,'-af',musicPrep+','+norm(musicStats,-23,-6,9)+`,aresample=48000,volume=0.50,afade=t=in:st=0:d=1.25,afade=t=out:st=${duration-2}:d=2,apad,atrim=duration=${duration}`,'-c:a','pcm_s24le',musicStem]);
  ff(['-loglevel','error','-i',musicStem,'-i',voiceStem,'-filter_complex','[0:a][1:a]sidechaincompress=threshold=0.05:ratio=2:attack=12:release=450:makeup=1:link=average:detection=rms[m]','-map','[m]','-c:a','pcm_s24le',ducked]);
  const mix='[0:a][1:a]amix=inputs=2:duration=longest:normalize=0';
  const statsResult=spawnSync('ffmpeg',['-hide_banner','-nostdin','-i',voiceStem,'-i',ducked,'-filter_complex',mix+',loudnorm=I=-16:TP=-2:LRA=11:print_format=json','-f','null','-'],{encoding:'utf8',windowsHide:true});
  if(statsResult.status!==0)throw new Error(statsResult.stderr);
  const mixStats=JSON.parse(statsResult.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);
  ff(['-loglevel','error','-i',voiceStem,'-i',ducked,'-filter_complex',mix+','+norm(mixStats,-16,-2,11)+`,aresample=48000,atrim=duration=${duration}[mix]`,'-map','[mix]','-c:a','pcm_s24le',master]);
  ff(['-loglevel','error','-i',master,'-c:a','libmp3lame','-b:a','256k',path.join(out,'narracion_y_musica.mp3')]);
  const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  const info={duration,mediaVersion:config.mediaVersion,voice:{source:path.basename(voice),sha256:digest(voice),speed:1,offsetSeconds:config.voiceOffset,originalDuration:Number(probe(voice).format.duration)},music:{source:path.basename(music),sha256:digest(music),tempo:config.musicTempo,pitchPreserved:true,approximateBpm:config.musicApproximateBpm,bedTargetLufs:-29,ducking:{threshold:0.05,ratio:2,attackMs:12,releaseMs:450},fadeInSeconds:1.25,fadeOutSeconds:2},master:{targetLufs:-16,maxTruePeakDb:-2,sampleRate:48000,channels:2},sourceMeasurements:{voice:voiceStats,music:musicStats},mixMeasurements:mixStats};
  fs.writeFileSync(path.join(out,'mezcla.json'),JSON.stringify(info,null,2));
  console.log(JSON.stringify({status:'audio_ready',duration,voiceSpeed:1,musicTempo:config.musicTempo,output:master},null,2));
}else{
  assert(fs.existsSync(master),'Primero genera la mezcla con el modo audio.');
  const montageFile=path.join(out,'montaje.json'),montage=JSON.parse(fs.readFileSync(montageFile,'utf8'));
  assert.equal(montage.duration,duration);assert.equal(montage.noEndingSpoilers,true);
  const videos=[];
  for(const shape of ['16x9','9x16']){
    const source=path.join(out,`Magdaleno_trailer_${shape}.mp4`),file=path.join(out,`Magdaleno_trailer_${shape}_narrado.mp4`);
    assert(Math.abs(Number(probe(source).format.duration)-duration)<.05,'Captura incompleta.');
    ff(['-loglevel','error','-i',source,'-i',master,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-t',String(duration),'-movflags','+faststart',file]);
    const metadata=probe(file);assert(Math.abs(Number(metadata.format.duration)-duration)<.05);videos.push({file:path.basename(file),...metadata});
  }
  montage.audioMix=JSON.parse(fs.readFileSync(path.join(out,'mezcla.json'),'utf8'));
  montage.music='Música aportada por el usuario, a 0.92× con tono conservado y reducción automática bajo la narración.';
  fs.writeFileSync(montageFile,JSON.stringify(montage,null,2));
  console.log(JSON.stringify({status:'mux_ready',duration,videos:videos.map(v=>({file:v.file,duration:v.format.duration}))},null,2));
}
