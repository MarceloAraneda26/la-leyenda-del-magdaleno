/* Montaje de escenas del motor real. No usa vídeo generado ni música externa. */
const {chromium}=require('./browser.cjs');
const fs=require('fs'),path=require('path'),{spawn}=require('child_process'),{once}=require('events');
const OUT=path.resolve(__dirname,'../../trailer_magdaleno'),FPS=30,DURATION=30;
fs.mkdirSync(OUT,{recursive:true});
function music(){
  const rate=44100,n=rate*DURATION,pcm=new Float32Array(n),beat=60/140;
  function note(start,duration,freq,vol,wave='triangle'){
    const first=Math.floor(start*rate),len=Math.floor(duration*rate);
    for(let j=0;j<len&&first+j<n;j++){const t=j/rate,phase=t*freq%1,osc=wave==='square'?(phase<.5?1:-1):wave==='sine'?Math.sin(t*freq*Math.PI*2):1-4*Math.abs(phase-.5);const env=Math.min(1,j/(rate*.006))*Math.pow(1-j/len,1.8);pcm[first+j]+=osc*env*vol;}
  }
  const melody=[0,3,7,12,10,7,3,7,5,8,12,15,12,8,5,3,3,7,10,14,12,10,7,3,7,11,14,19,14,11,7,2];
  const chords=[0,5,3,7],root=130.8128;
  for(let i=0;i*beat/2<DURATION;i++){
    const t=i*beat/2,chord=chords[Math.floor(i/8)%4],r=root*Math.pow(2,chord/12),build=t<3?.6:t>27?.8:1;
    note(t,beat*.4,root*Math.pow(2,melody[i%32]/12),.105*build,t>18?'square':'triangle');
    if(i%2===0)note(t,beat*.75,r/2,.18,'triangle');
    if(i%2)note(t,beat*.25,r*Math.pow(2,[0,7,12,7][i%4]/12),.055,'triangle');
    if(i%4===0){note(t,.10,62,.2,'sine');note(t,.05,95,.08,'sine');}
    if(i%4===2)note(t,.055,183,.06,'square');
    if(t>8&&i%2===1)note(t,.025,1563,.022,'square');
  }
  for(const t of [3,6,9.5,12,14.5,17,19.5,22.5,25.5,28]){note(t,.25,65.4,.18,'sine');note(t,.12,261.63,.08,'triangle');}
  const header=Buffer.alloc(44),data=Buffer.alloc(n*4);header.write('RIFF');header.writeUInt32LE(36+data.length,4);header.write('WAVEfmt ',8);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(2,22);header.writeUInt32LE(rate,24);header.writeUInt32LE(rate*4,28);header.writeUInt16LE(4,32);header.writeUInt16LE(16,34);header.write('data',36);header.writeUInt32LE(data.length,40);
  for(let i=0;i<n;i++){const t=i/rate,fade=Math.min(1,t/.3,(DURATION-t)/.8),v=Math.max(-1,Math.min(1,Math.tanh(pcm[i]*1.2)*.8*fade));const sample=Math.round(v*32767);data.writeInt16LE(sample,i*4);data.writeInt16LE(sample,i*4+2);}
  const file=path.join(OUT,'banda_sonora_original.wav');fs.writeFileSync(file,Buffer.concat([header,data]));return file;
}
function encoder(name,size,audio){
  const child=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-framerate',String(FPS),'-i','pipe:0','-i',audio,'-vf','scale='+size+':flags=neighbor','-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:a','aac','-b:a','192k','-ar','44100','-movflags','+faststart','-t',String(DURATION),path.join(OUT,name)],{windowsHide:true,stdio:['pipe','ignore','pipe']});
  let errors='';child.stderr.on('data',chunk=>errors+=chunk);child.stdin.on('error',()=>{});child.done=new Promise((resolve,reject)=>child.on('close',code=>code===0?resolve():reject(new Error(errors||'FFmpeg '+code))));return child;
}
(async()=>{
  const audio=music(),wide=encoder('Magdaleno_trailer_16x9.mp4','1920:1080',audio),vertical=encoder('Magdaleno_trailer_9x16.mp4','1080:1920',audio);
  const browser=await chromium.launch({headless:true,channel:'chrome',args:['--mute-audio']});
  const page=await browser.newPage({viewport:{width:1280,height:900}});await page.goto('http://127.0.0.1:4173/?qa=1');await page.waitForFunction(()=>window.Magdaleno?.state==='title');
  await page.evaluate(()=>{
    const M=Magdaleno,a=__magdaleno;a.setManual();M.audio.muted=true;
    const game=document.getElementById('game'),wide=document.createElement('canvas'),vertical=document.createElement('canvas');wide.width=960;wide.height=540;vertical.width=540;vertical.height=960;
    const scenes=[
      {start:0,end:3,id:'intro',title:['UNA NOCHE.','LOS CINCO.'],sub:'Los pendientes pueden esperar.'},
      {start:3,end:6,id:'roster',title:['ELIGE A TU AMIGO.'],sub:'Cinco maneras de salvar la junta.'},
      {start:6,end:9.5,id:'city',hero:'marcelo',zone:0,col:7,title:['LOS PENDIENTES','COBRARON VIDA.'],sub:'Y vienen a arruinarte la noche.'},
      {start:9.5,end:12,id:'ruzio',hero:'ruzio',zone:1,col:59,title:['SI NO ABRE,','LE FALTA MARTILLO.'],sub:'Ruzio · Martillo del Cerro'},
      {start:12,end:14.5,id:'pulga',hero:'pulga',zone:2,col:65,title:['LA CALMA','TIENE UN LÍMITE.'],sub:'Pulga · Clavada del Desquite'},
      {start:14.5,end:17,id:'tobi',hero:'tobi',zone:1,col:59,title:['UN AMIGO.','TAMAÑO BESTIAL.'],sub:'Tobi · Coloso de la Ruta'},
      {start:17,end:19.5,id:'pallo',hero:'pallo',zone:2,col:65,title:['LA JUNTA','TAMBIÉN TE CUIDA.'],sub:'Pallo · Sutura Arcana'},
      {start:19.5,end:22.5,id:'police',hero:'marcelo',zone:1,col:108,title:['¿PERMISO PARA','TENER VIDA?'],sub:'El papeleo acaba de subir de nivel.'},
      {start:22.5,end:25.5,id:'road',hero:'ruzio',zone:1,col:85,title:['LA RUTINA','NO SE VA A RENDIR.'],sub:'El camino también tiene asuntos pendientes.'},
      {start:25.5,end:28,id:'mystery',hero:'marcelo',zone:2,col:35,title:['¿QUÉ NOS ESPERA','EN LA MONTAÑA?'],sub:'Llega para descubrirlo.'},
      {start:28,end:30,id:'end',title:['LA LEYENDA','DEL MAGDALENO'],sub:'JUEGA EN PC Y CELULAR'}
    ];let previous=-1;
    function setup(scene){
      M.clearInput();M.notice=null;M.banner=0;M.shake=0;
      if(['intro','roster','end'].includes(scene.id)){M.session=null;M.setState('title');M.time=0;return;}
      a.start(scene.hero);a.dismiss();M.loadZone(scene.zone,scene.col);M.setState('play');const s=M.session,p=s.player;
      s.enemies=[];s.hazards=[];s.cans=[];s.rescues.forEach(r=>{r.done=true;r.open=1;r.aidFinished=true;});p.energy=100;
      M.progress.flags.tutorial_escalones=true;M.progress.flags.tutorial_plataforma=true;M.banner=0;M.notice=null;
      if(scene.id==='city')s.enemies=[M.makeEnemy('bill','trailer-bill',10),M.makeEnemy('folder','trailer-folder',13)];
      else if(['ruzio','pulga','tobi','pallo'].includes(scene.id)){s.enemies=[M.makeEnemy('folder','trailer-hit',scene.col+1.7),M.makeEnemy('bill','trailer-hit-2',scene.col+3.1)];if(scene.id==='pallo')p.hp=45;}
      if(scene.id==='road')s.enemies=[M.makeEnemy('clock','trailer-clock',88),M.makeEnemy('alarm','trailer-alarm',90)];
      if(scene.id==='police'){
        const b=s.boss;b.active=true;b.st='idle';b.tm=.15;b.hp=190;b.pattern=0;p.x=b.x-135;
        s.friends=['marcelo','ruzio','pulga','tobi'];s.fichas=[...s.friends];
      }else s.boss=null;
      for(const id of s.friends)if(id!==s.hero)s.followers[id]={x:p.x-60-s.friends.indexOf(id)*30,y:450,vx:0};
      M.cam=M.clamp(p.x-350,0,s.cols*M.T-M.W);
    }
    function text(g,value,x,y,size,color='#f0e5d0',align='left'){g.fillStyle=color;g.font='900 '+size+'px monospace';g.textAlign=align;g.fillText(value,x,y);}
    function team(g,x,y,gap,height,labels=true){
      M.order.forEach((id,i)=>{const image=M.images[id],b=M.bounds[id],width=b.w/b.h*height;g.drawImage(image,b.x,b.y,b.w,b.h,x+i*gap-width/2,y-height,width,height);if(labels)text(g,M.heroes[id].name.toUpperCase(),x+i*gap,y+24,12,M.heroes[id].color,'center');});
    }
    window.trailerFrame=(frame)=>{
      const time=frame/30,index=scenes.findIndex(s=>time>=s.start&&time<s.end),scene=scenes[index],local=time-scene.start;
      if(index!==previous){setup(scene);previous=index;}
      if(M.session&&!M.celebrating){
        a.key('KeyZ',!['pallo','pulga','tobi','ruzio'].includes(scene.id));a.key('ArrowRight',scene.id==='city'||scene.id==='mystery'||scene.id==='road'||(scene.id==='police'&&local<.25));
        a.key('Space',scene.id==='city'&&((local>.28&&local<.58)||(local>1.03&&local<1.36)||(local>2.3&&local<2.62)));
        a.key('KeyV',local>.3&&local<.4&&scene.id!=='city');a.step(2);if(M.state==='dialogue')a.dismiss();
      }else{M.time+=1/30;M.render();}
      if(M.celebrating||M.state==='ending'||M.session?.boss?.id==='matahombres'||M.progress?.flags.completed)throw new Error('El tráiler intentó mostrar el desenlace.');
      if(M.session?.zone===2&&M.cam+M.W>=(M.session.cols-15)*M.T)throw new Error('El tráiler intentó mostrar la localización final.');
      M.notice=null;M.prompt='';M.render();
      const g=wide.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(game,0,0);
      if(scene.id==='roster'){g.fillStyle='#091626';g.fillRect(0,0,960,540);team(g,230,422,125,204);}
      const shade=g.createLinearGradient(0,0,0,230);shade.addColorStop(0,'#07111f');shade.addColorStop(.5,'#07111fee');shade.addColorStop(1,'#07111f00');g.fillStyle=shade;g.fillRect(0,0,960,245);
      if(scene.id==='intro'||scene.id==='end'){
        g.fillStyle='#0813209e';g.fillRect(0,0,960,540);text(g,'UNA AVENTURA DE AMISTAD Y PENDIENTES VIVIENTES',480,100,13,'#70cbb7','center');
        scene.title.forEach((line,i)=>text(g,line,480,206+i*66,scene.id==='end'?53:64,i?'#edb55b':'#f0e5d0','center'));
        text(g,scene.sub,480,365,18,scene.id==='end'?'#70cbb7':'#bdcede','center');if(scene.id==='end')text(g,'ELIGE A UNO. REÚNE A LOS CINCO.',480,407,13,'#bdcede','center');
      }else{
        text(g,'LA LEYENDA DEL MAGDALENO',35,30,10,'#70cbb7');scene.title.forEach((line,i)=>text(g,line,35,72+i*36,31,i?'#edb55b':'#f0e5d0'));
        g.fillStyle='#071421ea';g.fillRect(0,492,960,48);text(g,scene.sub,480,523,15,'#d3e0e8','center');
      }
      const edge=Math.min(1,local/.13,(scene.end-time)/.13);if(edge<1){g.fillStyle='rgba(5,12,22,'+(1-edge)+')';g.fillRect(0,0,960,540);}
      const v=vertical.getContext('2d');v.imageSmoothingEnabled=false;v.fillStyle='#091525';v.fillRect(0,0,540,960);
      for(let i=0;i<28;i++){v.fillStyle=i%2?'#345164':'#426777';v.fillRect((i*79+frame*.06)%540,88+(i*47)%820,i%3?1:2,2);}
      v.fillStyle='#1d3a45';v.beginPath();v.moveTo(0,930);v.lineTo(95,800);v.lineTo(156,858);v.lineTo(300,700);v.lineTo(435,865);v.lineTo(540,773);v.lineTo(540,960);v.fill();
      text(v,'LA LEYENDA DEL',270,76,18,'#d2e0e8','center');text(v,'MAGDALENO',270,118,36,'#edb55b','center');
      scene.title.forEach((line,i)=>text(v,line,270,218+i*36,line.length>23?21:27,i?'#edb55b':'#f0e5d0','center'));
      v.strokeStyle='#486676';v.lineWidth=2;v.strokeRect(13,314,514,291);v.drawImage(game,0,0,960,540,14,315,512,288);
      text(v,scene.sub,270,655,scene.sub.length>38?13:15,'#bbd0dd','center');
      team(v,70,835,100,138);text(v,scene.id==='end'?'JUEGA EN PC Y CELULAR':'CINCO AMIGOS. UNA MONTAÑA.',270,915,18,scene.id==='end'?'#edb55b':'#70cbb7','center');
      if(scene.id==='end'){v.fillStyle='#081320db';v.fillRect(14,315,512,288);text(v,'LA LEYENDA',270,422,34,'#f0e5d0','center');text(v,'DEL MAGDALENO',270,470,34,'#edb55b','center');text(v,'POR LA JUNTA.',270,536,20,'#70cbb7','center');}
      if(edge<1){v.fillStyle='rgba(5,12,22,'+(1-edge)+')';v.fillRect(0,0,540,960);}
      return [wide.toDataURL('image/png').split(',')[1],vertical.toDataURL('image/png').split(',')[1]];
    };window.trailerScenes=scenes;
  });
  for(let frame=0;frame<FPS*DURATION;frame++){
    const images=await page.evaluate(frame=>window.trailerFrame(frame),frame);
    if(!wide.stdin.write(Buffer.from(images[0],'base64')))await once(wide.stdin,'drain');
    if(!vertical.stdin.write(Buffer.from(images[1],'base64')))await once(vertical.stdin,'drain');
    // Muestras de revisión, incluidos los cuadros de impacto de las cuatro definitivas.
    if([45,120,225,313,318,393,399,468,474,534,543,633,723,813,870].includes(frame)){fs.writeFileSync(path.join(OUT,'muestra_'+frame+'_horizontal.png'),Buffer.from(images[0],'base64'));if(frame===225||frame===870)fs.writeFileSync(path.join(OUT,'muestra_'+frame+'_vertical.png'),Buffer.from(images[1],'base64'));}
    if(frame%150===0)console.log('Tráiler: '+Math.round(frame/(FPS*DURATION)*100)+'%');
  }
  const scenes=await page.evaluate(()=>window.trailerScenes);wide.stdin.end();vertical.stdin.end();await Promise.all([wide.done,vertical.done]);await browser.close();
  fs.writeFileSync(path.join(OUT,'montaje.json'),JSON.stringify({duration:DURATION,fps:FPS,noEndingSpoilers:true,footage:'Escenas preparadas dentro del motor del juego, con sus sprites y animaciones reales.',music:'Chiptune original sintetizado para este montaje.',scenes},null,2));console.log('Tráileres sin desenlace exportados en '+OUT);
})().catch(error=>{console.error(error);process.exit(1);});
