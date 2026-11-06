/* Mini tráiler de 10 segundos de la etapa 2: motor real, carrera guionizada y música sintetizada. No muestra el cierre. */
const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path'),{spawn,spawnSync}=require('child_process'),{once}=require('events');
const root=path.resolve(__dirname,'..'),OUT=path.resolve(process.env.MAGDALENO_TRAILER_OUTPUT||path.join(root,'media')),SAMPLES=path.join(root,'qa/trailer_etapa2'),base=process.env.MAGDALENO_BASE_URL||'http://127.0.0.1:4173/';
const FPS=30,DURATION=10,RATE=48000,BEAT=.4;
// Compases de 0,4 s: los cambios de escena caen sobre el pulso de la música.
const TIMES={jump:.55,right:1.6,center:2.85,drop:4.4,cote:6.1,shout:6.4,end:8};
const SCENES=[
 {start:0,end:TIMES.right+.4,title:['PARRAL, DE NOCHE.','TODO CERRADO.']},
 {start:TIMES.right+.4,end:TIMES.drop,title:['Y LA CAMANCHACA','VIENE BAJANDO.']},
 {start:TIMES.drop,end:TIMES.shout,title:['YA LA TIENES','ENCIMA.'],alert:true},
 {start:TIMES.shout,end:TIMES.end,shout:'CORREEEE!!',sub:'COTÉ · SEIS SEGUNDOS DE RESPIRO'},
 {start:TIMES.end,end:DURATION,card:true}
];
if(/Matahombres|Coñac|El Vecino|botella/i.test(JSON.stringify(SCENES)))throw new Error('El texto del tráiler revela el cierre.');
fs.mkdirSync(OUT,{recursive:true});fs.mkdirSync(SAMPLES,{recursive:true});

function soundtrack(){
 const n=RATE*DURATION,pcm=new Float32Array(n);
 const wave=(kind,phase)=>{const p=phase%1;return kind==='square'?(p<.5?1:-1):kind==='saw'?2*p-1:kind==='sine'?Math.sin(p*Math.PI*2):1-4*Math.abs(p-.5);};
 function note(start,duration,from,to,vol,kind='triangle',decay=1.8){const first=Math.floor(start*RATE),len=Math.floor(duration*RATE);let phase=0;for(let j=0;j<len&&first+j<n;j++){const u=j/len,f=from*Math.pow(to/from,u);phase+=f/RATE;pcm[first+j]+=wave(kind,phase)*Math.min(1,j/(RATE*.004))*Math.pow(1-u,decay)*vol;}}
 let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647*2-1;
 function noise(start,duration,vol,decay=2){const first=Math.floor(start*RATE),len=Math.floor(duration*RATE);let last=0;for(let j=0;j<len&&first+j<n;j++){last=last*.72+rnd()*.28;pcm[first+j]+=last*Math.pow(1-j/len,decay)*vol;}}
 const A=110,semi=s=>A*Math.pow(2,s/12),chords=[0,0,-4,-2],arp=[12,15,19,24,19,15,12,10];
 for(let i=0;i*BEAT/2<DURATION;i++){const t=i*BEAT/2,beat=i/2,chord=chords[Math.floor(beat/4)%4];
  if(t<TIMES.drop||(t>=TIMES.shout&&t<TIMES.end)){const lift=t>=TIMES.shout?1.25:Math.min(1,.55+t/TIMES.drop*.45);
   note(t,BEAT*.45,semi(chord-12),semi(chord-12),.2*lift);note(t,BEAT*.3,semi(chord+arp[i%8]),semi(chord+arp[i%8]),.075*lift,t>=TIMES.shout?'square':'triangle');
   if(i%2===0)note(t,.11,120,48,.3*lift,'sine');if(i%4===2)noise(t,.09,.2*lift);if(i%2)noise(t,.03,.07*lift);
   if(t>=TIMES.shout)note(t,BEAT*.42,semi(chord+[24,27,31,27][Math.floor(i/2)%4]),semi(chord+[24,27,31,27][Math.floor(i/2)%4]),.06,'square');
  }else if(t>=TIMES.drop&&t<TIMES.shout){const u=(t-TIMES.drop)/(TIMES.shout-TIMES.drop);if(i%2===0)note(t,.16,70,44,.32,'sine');note(t,BEAT*.5,semi(-12)*(1+u*.5),semi(-12)*(1+u*.5),.09+.08*u,'saw',1);if(i%2)note(t,.05,semi(24+u*7),semi(24+u*7),.03+.03*u,'square');}
 }
 // Niebla: soplido grave que crece hasta el grito.
 noise(TIMES.drop,TIMES.shout-TIMES.drop,.1,.2);
 note(TIMES.jump,.14,320,740,.14,'square');note(TIMES.right,.06,500,720,.07,'square');note(TIMES.center,.06,720,500,.07,'square');
 note(TIMES.drop-.08,.26,170,58,.3,'square');noise(TIMES.drop-.08,.22,.34);
 // El grito usa los mismos barridos que el juego, con un golpe grave debajo.
 note(TIMES.shout,.24,280,900,.26,'saw');note(TIMES.shout+.12,.65,760,340,.3,'triangle');note(TIMES.shout+.2,.9,510,230,.26,'sine');note(TIMES.shout,.5,95,38,.5,'sine',1.2);noise(TIMES.shout,.55,.34,1.4);
 // Remate del título: acorde abierto que se apaga antes del final.
 for(const [semiTone,vol]of [[-24,.26],[-12,.2],[3,.13],[7,.12],[12,.11],[19,.07]])note(TIMES.end,DURATION-TIMES.end,semi(semiTone),semi(semiTone),vol,'triangle',1.15);note(TIMES.end,.5,110,40,.42,'sine',1.2);noise(TIMES.end,.4,.18);
 const header=Buffer.alloc(44),data=Buffer.alloc(n*4);header.write('RIFF');header.writeUInt32LE(36+data.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(RATE,24);header.writeUInt32LE(RATE*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(data.length,40);
 for(let i=0;i<n;i++){const t=i/RATE,fade=Math.min(1,t/.05,(DURATION-t)/.5),sample=Math.round(Math.max(-1,Math.min(1,Math.tanh(pcm[i]*1.25)*.82*fade))*32767);data.writeInt16LE(sample,i*4);data.writeInt16LE(sample,i*4+2);}
 const file=path.join(SAMPLES,'musica_etapa2.wav');fs.writeFileSync(file,Buffer.concat([header,data]));return file;
}
// Dos pasadas: en un clip tan corto, loudnorm en una sola pasada no alcanza el objetivo.
function loudness(audio){
 const target='I=-16:TP=-2:LRA=11',result=spawnSync('ffmpeg',['-hide_banner','-nostdin','-i',audio,'-af','loudnorm='+target+':print_format=json','-f','null','-'],{encoding:'utf8',windowsHide:true});
 if(result.status!==0)throw new Error(result.stderr);
 const m=JSON.parse(result.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)[0]);
 return `loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`;
}
function encoder(name,size,audio,filter){
 const child=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','pipe:0','-i',audio,'-vf','scale='+size+':flags=neighbor','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-af',filter,'-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart','-t',String(DURATION),path.join(OUT,name)],{windowsHide:true,stdio:['pipe','ignore','pipe']});
 let errors='';child.stderr.on('data',chunk=>errors+=chunk);child.stdin.on('error',()=>{});child.done=new Promise((resolve,reject)=>child.on('close',code=>code===0?resolve():reject(new Error(errors||'FFmpeg '+code))));return child;
}
(async()=>{
 const audio=soundtrack(),filter=loudness(audio),wide=encoder('Magdaleno_etapa2_10s_16x9.mp4','1920:1080',audio,filter),vertical=encoder('Magdaleno_etapa2_10s_9x16.mp4','1080:1920',audio,filter);
 const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
 const page=await browser.newPage({viewport:{width:1280,height:768}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'etapa2.html?qa=1&hero=marcelo');await page.waitForFunction(()=>window.Parral?.loaded);
 await page.evaluate(({TIMES,SCENES,DURATION,FPS})=>{
  const a=__parral,P=a.P,M=a.M,game=document.getElementById('game'),outWide=document.createElement('canvas'),outTall=document.createElement('canvas');a.setManual();M.audio.muted=true;
  outWide.width=960;outWide.height=540;outTall.width=720;outTall.height=1280;
  P.memorySave=null;P.start('marcelo');const s=P.session;s.distance=115;s.gap=30;s.seenShops=new Set(P.shops.map(b=>b.at));
  // Solo el patinazo de los 198 m alcanza al protagonista; el resto se esquiva con las entradas del guion.
  s.obstacles=[[134,0,'hole'],[157,0,'sleeper'],[157,-1,'poop'],[180,1,'hole'],[198,0,'poop'],[222,-1,'sleeper'],[240,1,'hole'],[262,-1,'hole'],[285,1,'sleeper']].map(([at,lane,kind],i)=>({id:'trailer-'+i,at,lane,kind,checked:false}));
  const character=M.character;let coteFrom=-1,shown=s.gap,done=new Set();
  const once=(key,time,now,fn)=>{if(now>=time&&!done.has(key)){done.add(key);fn();}};
  const text=(g,value,x,y,size,color='#f0e5d0',align='center',outline=true)=>{g.font='900 '+size+'px monospace';g.textAlign=align;g.lineJoin='round';if(outline){g.lineWidth=Math.max(3,size/7);g.strokeStyle='#071421';g.strokeText(value,x,y);}g.fillStyle=color;g.fillText(value,x,y);};
  function fogBar(g,x,y,w){g.fillStyle='#071421d8';g.fillRect(x-8,y-22,w+16,38);text(g,s.relief>0?'NIEBLA FRENADA':shown<28?'¡LA NIEBLA ESTÁ CERCA!':'DISTANCIA DE LA NIEBLA',x,y-8,11,shown<28&&s.relief<=0?'#de9b82':'#bcd3da','left',false);g.fillStyle='#263f50';g.fillRect(x,y,w,6);g.fillStyle=shown<28&&s.relief<=0?'#de9b82':'#88c6cc';g.fillRect(x,y,w*Math.min(1,shown/125),6);}
  function cast(g,W,y,height,gap){const ids=[...M.order,'cote'],left=W/2-gap*(ids.length-1)/2;ids.forEach((id,i)=>{const image=M.images[id],b=M.bounds[id],w=b.w/b.h*height;g.drawImage(image,b.x,b.y,b.w,b.h,left+i*gap-w/2,y-height,w,height);});}
  function overlay(g,W,H,time,tall){const scene=SCENES.find(x=>time>=x.start&&time<x.end)||SCENES[SCENES.length-1],local=time-scene.start;g.imageSmoothingEnabled=false;
   if(!scene.card){const top=tall?360:150,shade=g.createLinearGradient(0,0,0,top);shade.addColorStop(0,'#071421f2');shade.addColorStop(.6,'#07142199');shade.addColorStop(1,'#07142100');g.fillStyle=shade;g.fillRect(0,0,W,top);text(g,'LA LEYENDA DEL MAGDALENO · ETAPA 2',W/2,tall?64:26,tall?20:12,'#70cbb7','center',false);if(!tall)fogBar(g,24,520,190);else fogBar(g,W/2-130,300,260);}
   if(scene.title)scene.title.forEach((line,i)=>{const size=tall?56:40,pop=Math.min(1,local/.14);g.globalAlpha=pop;text(g,line,W/2,(tall?150:72)+i*(tall?66:46),size,i||scene.alert?'#edb55b':'#f0e5d0');g.globalAlpha=1;});
   if(scene.shout){const pop=1+Math.max(0,.3-local)*.7,size=(tall?60:68)*pop;text(g,scene.shout,W/2,tall?190:94,size,'#ffd68f');text(g,scene.sub,W/2,tall?246:128,tall?22:15,'#f0a19c');if(local<.28){g.globalAlpha=(.28-local)/.28*.42;g.fillStyle='#ffe9c9';g.fillRect(0,0,W,H);g.globalAlpha=1;}}
   if(scene.card){const fade=Math.min(1,local/.2);g.globalAlpha=.92*fade;g.fillStyle='#07131f';g.fillRect(0,0,W,H);g.globalAlpha=fade;
    if(tall){text(g,'LA LEYENDA DEL MAGDALENO',W/2,250,28,'#70cbb7');text(g,'ETAPA 2',W/2,350,44,'#f0e5d0');text(g,'LA CAMANCHACA',W/2,480,76,'#f0e5d0');text(g,'DE PARRAL',W/2,570,76,'#edb55b');cast(g,W,860,190,112);text(g,'CINCO AMIGOS, COTÉ Y LA NIEBLA.',W/2,960,26,'#bcd3da');text(g,'JUEGA EN TU CELULAR',W/2,1060,36,'#edb55b');}
    else{text(g,'LA LEYENDA DEL MAGDALENO · ETAPA 2',W/2,76,16,'#70cbb7');text(g,'LA CAMANCHACA',W/2,158,66,'#f0e5d0');text(g,'DE PARRAL',W/2,226,66,'#edb55b');cast(g,W,420,140,112);text(g,'JUEGA EN TU CELULAR',W/2,486,24,'#edb55b');}
    g.globalAlpha=1;}
   const edge=Math.min(1,time/.2,(DURATION-time)/.35);if(edge<1){g.fillStyle='rgba(5,12,22,'+(1-edge)+')';g.fillRect(0,0,W,H);}}
  function draw(W,H,out,time,tall,shake){game.width=W;game.height=H;P.width=W;P.height=H;const real=s.gap;s.gap=shown;
   // Ambos actores comparten escala; Coté se acerca al centro en vertical y conserva espacio para sus brazos.
   const actorHeight=P.actorHeight;if(tall)P.actorHeight=H=>actorHeight(H)*1.55;
   M.character=(id,x,y,height,pose)=>{const offset=id==='cote'&&coteFrom>=0?Math.max(0,1-(time-coteFrom)/.26)*(tall?220:320):0;return character(id,x+offset,y,height,pose);};P.render();M.character=character;P.actorHeight=actorHeight;s.gap=real;
   const g=out.getContext('2d');g.imageSmoothingEnabled=false;g.setTransform(1,0,0,1,0,0);g.fillStyle='#07131f';g.fillRect(0,0,W,H);g.drawImage(game,shake?(Math.random()-.5)*shake:0,shake?(Math.random()-.5)*shake:0);overlay(g,W,H,time,tall);}
  window.trailerFrame=frame=>{const time=frame/FPS;
   once('jump',TIMES.jump,time,()=>P.jump());once('right',TIMES.right,time,()=>P.shift(1));once('center',TIMES.center,time,()=>P.shift(-1));
   once('cote',TIMES.cote,time,()=>{s.coteJoined=true;coteFrom=time;});once('shout',TIMES.shout,time,()=>{s.cooldown=0;P.shout();});
   a.step(2);if(P.state!=='play')throw new Error('El tráiler salió de la carrera: '+P.state);
   shown+=(s.gap-shown)*.2;const shake=time>=TIMES.shout&&time<TIMES.shout+.3?10*(1-(time-TIMES.shout)/.3):time>=TIMES.drop-.08&&time<TIMES.drop+.12?5:0;
   draw(960,540,outWide,time,false,shake);draw(720,1280,outTall,time,true,shake);
   return{images:[outWide.toDataURL('image/png').split(',')[1],outTall.toDataURL('image/png').split(',')[1]],state:{time,distance:s.distance,gap:s.gap,health:s.health,lane:s.targetLane}};};
 },{TIMES,SCENES,DURATION,FPS});
 const log=[];
 for(let frame=0;frame<FPS*DURATION;frame++){
  const {images,state}=await page.evaluate(frame=>window.trailerFrame(frame),frame);
  if(!wide.stdin.write(Buffer.from(images[0],'base64')))await once(wide.stdin,'drain');
  if(!vertical.stdin.write(Buffer.from(images[1],'base64')))await once(vertical.stdin,'drain');
  if(frame%15===0){log.push(state);}
  if([20,29,48,75,100,135,175,195,200,225,260,285].includes(frame)){fs.writeFileSync(path.join(SAMPLES,'h_'+frame+'.png'),Buffer.from(images[0],'base64'));fs.writeFileSync(path.join(SAMPLES,'v_'+frame+'.png'),Buffer.from(images[1],'base64'));}
 }
 wide.stdin.end();vertical.stdin.end();await Promise.all([wide.done,vertical.done]);await browser.close();
 if(errors.length)throw new Error(errors.join('\n'));
 const last=log[log.length-1];if(last.health!==2)throw new Error('Se esperaba un solo patinazo: resistencia '+last.health);
 fs.writeFileSync(path.join(SAMPLES,'montaje.json'),JSON.stringify({duration:DURATION,fps:FPS,noEndingSpoilers:true,footage:'Carrera guionizada dentro del motor real, sin escena de refugio.',music:'Chiptune original sintetizado para este montaje.',scenes:SCENES,log},null,2));
 console.log('Mini tráiler exportado en '+OUT);
})().catch(error=>{console.error(error);process.exit(1);});
