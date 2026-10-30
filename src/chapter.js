/* Capítulo 0.3: rutas opcionales, módulos de plataformas, peligros
 * anunciados y ayudas guionizadas. Mantiene los cinco protagonistas. */
(() => {
  'use strict';
  const M=window.Magdaleno,T=M.T;
  const {F,line,circle,text,poly}=M.draw;
  const g=M.ctx;
  M.chapterVersion='0.3';
  const definitions=[
    {
      steps:[[20,1],[21,2],[22,1],[80,1],[81,2],[82,1]],
      routes:[
        {id:'azoteas',name:'AZOTEAS DEL VUELTO',platforms:[[30,33,8],[35,38,6],[40,43,8]],reward:[36,37,6],guard:['bill',36,6]},
        {id:'pasaje',name:'PASAJE DE LOS TRÁMITES',platforms:[[101,104,8],[106,109,6],[111,113,8]],reward:[107,108,6],guard:['phone',108,6]}
      ],
      extras:[['folder',123]],
      hazards:[{id:'cable',kind:'pulse',col:128,offset:0,period:5,warn:1,active:.8,damage:10}]
    },
    {
      steps:[[19,1],[20,2],[21,1],[81,1],[82,1]],
      routes:[
        {id:'paradero',name:'TECHO DEL PARADERO',platforms:[[13,16,8],[18,21,7]],reward:[19,20,7],guard:['bill',19,7]},
        {id:'cerco',name:'POR SOBRE EL CERCO',platforms:[[57,60,8],[62,65,6],[67,69,8]],reward:[63,64,6],guard:['phone',64,6]}
      ],
      extras:[],
      hazards:[{id:'cruce',kind:'traffic',col:84,width:7*T,offset:1.2,period:6.2,warn:1,active:2.2,damage:12}]
    },
    {
      steps:[[18,1],[19,2],[20,1],[79,1],[80,2],[81,1]],
      routes:[
        {id:'mirador',name:'MIRADOR DE LA JUNTA',platforms:[[29,32,8],[34,37,6],[39,42,8]],reward:[35,36,6],guard:['bill',35,6]},
        {id:'pinos',name:'SENDERO DE LOS PINOS',platforms:[[62,65,8],[67,70,6],[72,75,8]],reward:[68,69,6],guard:['phone',69,6]}
      ],
      extras:[['folder',31],['bill',98]],
      hazards:[
        {id:'roca1',kind:'rock',col:91,offset:.4,period:5.5,warn:1.2,active:1.1,damage:10},
        {id:'roca2',kind:'rock',col:98,offset:2.5,period:5.5,warn:1.2,active:1.1,damage:10}
      ]
    }
  ];
  M.routeDefinitions=definitions;
  const buildZone=M.buildZone;
  M.buildZone=function(zone,hero,progress){
    const s=buildZone(zone,hero,progress),definition=definitions[zone];
    for(const row of s.grid)for(let col=0;col<row.length;col++)if(row[col]==='=')row[col]=' ';
    for(const [col,height] of definition.steps)for(let k=1;k<=height;k++)s.grid[10-k][col]='#';
    s.routes=definition.routes.map(route=>({...route,key:'desvio_'+zone+'_'+route.id,done:!!progress.flags['desvio_'+zone+'_'+route.id]}));
    for(const route of s.routes){
      for(const [start,end,row] of route.platforms)for(let col=start;col<=end;col++)s.grid[row][col]='=';
      const [first,last,row]=route.reward;
      for(let col=first;col<=last;col++)for(let k=0;k<2;k++)s.cans.push({id:'route:'+route.key+':'+col+':'+k,x:col*T+12+k*20,y:row*T-5});
      const [kind,col,enemyRow]=route.guard;
      const enemy=M.makeEnemy(kind,'route-guard:'+route.key,col,enemyRow);
      enemy.routeId=route.key;enemy.dead=s.killed.has(enemy.id);s.enemies.push(enemy);
    }
    for(const [kind,col] of definition.extras){const enemy=M.makeEnemy(kind,'extra:'+zone+':'+col,col);enemy.dead=s.killed.has(enemy.id);s.enemies.push(enemy);}
    // Ground pickups stay on the main route; elevated pickups align with real ledges.
    const optional=s.cans.filter(item=>!item.id.startsWith('route:')&&item.y<420);
    const ledges=s.routes.flatMap(route=>route.platforms);
    optional.forEach((item,index)=>{const [start,end,row]=ledges[index%ledges.length];item.x=(start+Math.floor((end-start)/2))*T+T/2;item.y=row*T-5;});
    s.hazards=definition.hazards.map(hazard=>({...hazard,x:hazard.col*T+T/2}));
    s.sections=zone===0?[{col:20,name:'LA CUADRA'},{col:80,name:'LOS ESCALONES'},{col:126,name:'EL ÚLTIMO PASAJE'}]:zone===1?[{col:19,name:'EL PARADERO'},{col:58,name:'POR EL CAMINO VIEJO'},{col:84,name:'CRUCE NOCTURNO'}]:[{col:18,name:'PRIMER ASCENSO'},{col:63,name:'ENTRE LOS PINOS'},{col:89,name:'PIEDRA SUELTA'}];
    for(const rescue of s.rescues){rescue.open=rescue.done?1:0;rescue.aidFinished=rescue.done;}
    return s;
  };

  M.hazardState=function(hazard,elapsed){
    const time=((elapsed+hazard.offset)%hazard.period+hazard.period)%hazard.period;
    const warning=time<hazard.warn,active=time>=hazard.warn&&time<hazard.warn+hazard.active;
    const progress=M.clamp((time-hazard.warn)/hazard.active,0,1);
    let box;
    if(hazard.kind==='pulse')box={x:hazard.x-20,y:382,w:40,h:68};
    else if(hazard.kind==='traffic')box={x:M.lerp(hazard.x+hazard.width,hazard.x,progress)-47,y:414,w:94,h:36};
    else box={x:hazard.x-13,y:170+280*progress*progress-13,w:26,h:26};
    return {warning,active,progress,box,time};
  };

  // A closed rescue passage is taller than a normal jump. Completed passages
  // remain closed only during the one-second aid animation, then stay open.
  const solidAt=M.solidAt;
  M.solidAt=function(col,row){
    if(row>=6&&row<=9&&M.session?.rescues.some(rescue=>(!rescue.done||(rescue.open??1)<1)&&col===rescue.col+3))return true;
    return solidAt(col,row);
  };
  const character=M.character;
  M.character=function(id,x,y,height,pose={}){
    const aid=M.session?.rescues?.find(rescue=>rescue.hero===id&&rescue.done&&rescue.open<1);
    if(aid&&!M.celebrating&&['play','dialogue'].includes(M.state)){
      x=(aid.col+3)*T-44-M.cam;y=450;
      pose={...pose,walk:false,speed:0,dir:1,cast:id==='marcelo'||id==='pallo',attack:id==='ruzio'||id==='tobi'?aid.open:-1};
      if(id==='pulga'){y-=Math.sin(aid.open*Math.PI)*110;pose.air=true;pose.rising=aid.open<.5;pose.cast=true;}
    }
    character(id,x,y,height,pose);
  };

  function gate(rescue,cam){
    if(rescue.open>=1)return;
    const x=(rescue.col+3)*T-cam,opening=rescue.open||0;
    if(x< -100||x>M.W+100)return;
    F(x-4,270,53,180,'#172b38');
    if(rescue.hero==='tobi'){
      const dx=opening*65;g.globalAlpha=1-opening*.65;
      poly([[x+dx,450],[x+dx-2,300],[x+dx+12,274],[x+dx+40,280],[x+dx+48,310],[x+dx+45,450]],'#63727b');
      line(x+12+dx,289,x+18+dx,424,'#96a3a1',3);g.globalAlpha=1;
    }else if(rescue.hero==='ruzio'){
      g.globalAlpha=1-opening*.8;
      F(x,276+opening*40,45,174,'#6c543e');
      for(let i=0;i<3;i++)F(x+5+i*14,279+opening*40,4,168,'#a38659');
      line(x,292+opening*40,x+45,429+opening*40,'#b29566',7);line(x+45,292+opening*40,x,429+opening*40,'#b29566',7);g.globalAlpha=1;
    }else if(rescue.hero==='pallo'){
      g.globalAlpha=.8*(1-opening);
      for(let k=0;k<11;k++){const yy=279+k*15;F(x+8+(k%2)*5,yy,25,4,'#bda5e5');F(x+19,yy-4,4,12,'#d3c5e9');}
      g.globalAlpha=1;
    }else{
      const h=180*(1-opening);
      F(x,270,45,h,rescue.hero==='marcelo'?'#416e7a':'#77694f');
      for(let yy=277;yy<270+h;yy+=13)F(x+3,yy,39,4,rescue.hero==='marcelo'?'#7ca4a9':'#b09a70');
      if(rescue.hero==='pulga'){F(x-18,274,13,17,'#d2aa6c');line(x-11,280,x+20,270,'#a2a294',2);}
    }
    if(!rescue.done){F(x+14,339,16,18,'#e4bd78');F(x+18,332,8,10,'#e4bd78');}
    if(rescue.done&&rescue.hero==='marcelo'){F(x-46,383,14,18,'#182c40');F(x-43,387,8,8,'#91d6d0');}
  }
  function hazard(h,elapsed,cam){
    const state=M.hazardState(h,elapsed),x=h.x-cam;
    if(x+(h.width||60)<-180||x>M.W+180)return;
    if(h.kind==='pulse'){
      F(x-5,355,10,95,'#46535c');F(x-12,361,24,26,'#354c54');F(x-8,366,16,4,state.warning?'#e0ba71':'#839a8e');
      line(x,376,x+11,401,'#c0aa75',2);F(x-28,443,56,7,'#b8a77a');
      if(state.active){for(let k=0;k<6;k++){const xx=x+(k%2?10:-10);line(xx,385+k*10,x-xx+x,395+k*10,'#f3d98d',3);}F(x-26,446,52,3,'#edca79');}
      if(state.warning){text('⚡',x,345,17,'#efcc7e','center');F(x-25,446,50,3,'#e6b77a');}
    }else if(h.kind==='traffic'){
      F(x-22,354,4,96,'#70817b');poly([[x-20,348],[x-40,381],[x,381]],'#b5b080');poly([[x-20,354],[x-35,377],[x-5,377]],'#c9b276');
      F(x-24,363,8,8,'#4b5e64');
      for(let j=0;j<5;j++)F(x+j*22,447,12,3,'#c7b373');
      if(state.warning){text('CRUCE',x+70,396,11,'#edc786','center');F(x+20,444,h.width-10,3,'#c79a61');poly([[x+60,435],[x+46,429],[x+46,441]],'#e4be80');}
      if(state.active){const cx=state.box.x-cam;
        F(cx,420,94,23,'#305865');F(cx+18,407,48,16,'#396775');F(cx+21,410,17,10,'#a4c3ba');F(cx+42,410,20,10,'#8daaa8');
        F(cx-3,428,8,6,'#f5dfa5');F(cx+90,426,5,5,'#c27f66');F(cx+7,442,18,8,'#142535');F(cx+69,442,18,8,'#142535');F(cx+12,444,8,3,'#7e8f92');F(cx+74,444,8,3,'#7e8f92');
      }
    }else{
      poly([[x-38,414],[x-16,402],[x+24,407],[x+40,419],[x+31,428],[x-29,428]],'#3d544c');
      if(state.warning||state.active){F(x-20,446,40,3,'#d8b47a');poly([[x,429],[x-6,419],[x+6,419]],'#e6c88d');}
      if(state.warning)text('PIEDRA SUELTA',x,388,10,'#d4b781','center');
      if(state.active){const cy=state.box.y+13;poly([[x-13,cy-7],[x-5,cy-14],[x+8,cy-10],[x+14,cy+4],[x+4,cy+14],[x-11,cy+8]],'#7e8c8a');F(x-5,cy-8,9,3,'#bbc0a6');line(x+5,cy-3,x+8,cy+8,'#425b61',2);}
    }
  }
  const props=M.props;
  M.props=function(session,cam,time){
    props(session,cam,time);
    for(const rescue of session.rescues)gate(rescue,cam);
    for(const route of session.routes||[]){
      const [start,,row]=route.platforms[0],x=start*T-cam;
      if(x< -160||x>M.W+80)continue;
      F(x-19,row*T+5,3,68,'#647d74');F(x-53,row*T-23,94,21,'#1b3940');
      text(route.done?'DESVÍO VISTO':'DESVÍO ↑',x-5,row*T-8,9,route.done?'#8caf9d':'#dec58c','center');
    }
    for(const h of session.hazards||[])hazard(h,M.progress.elapsed,cam);
  };

  const update=M.update;
  M.update=function(dt){
    const active=M.state==='play',s=M.session;
    update(dt);
    if(!active||M.state!=='play'||M.session!==s)return;
    const p=s.player;
    if(!M.progress.flags.tutorial_escalones&&s.zone===0&&p.x>17*T&&p.x<20*T){M.progress.flags.tutorial_escalones=true;M.notify('ESPACIO: SALTA LOS ESCALONES');}
    if(!M.progress.flags.tutorial_plataforma&&p.onGround&&p.y<410&&M.oneWayAt(Math.floor(p.x/T),Math.floor(p.y/T))){M.progress.flags.tutorial_plataforma=true;M.notify('↓ + ESPACIO: BAJA DE UNA PLATAFORMA','#b3d0c4');}
    for(const rescue of s.rescues){
      if(rescue.done&&rescue.open<1){
        rescue.open=Math.min(1,rescue.open+dt);
        if(rescue.open>=1&&!rescue.aidFinished){rescue.aidFinished=true;M.burst((rescue.col+3)*T+20,360,M.heroes[rescue.hero].color,14);M.audio.sfx('token');}
      }
    }
    for(const route of s.routes||[]){
      if(route.done)continue;
      const [first,last,row]=route.reward;
      if(p.x>(first-.5)*T&&p.x<(last+1.5)*T&&Math.abs(p.y-row*T)<27&&p.onGround){route.done=true;M.progress.flags[route.key]=true;M.notify('DESVÍO: '+route.name,'#9fcfba');}
    }
    for(const h of s.hazards||[]){const state=M.hazardState(h,M.progress.elapsed);if(state.active&&M.overlap(M.box(p),state.box)){M.hurtPlayer(h.damage,h.x);if(M.session!==s)return;}}
  };

  const render=M.render;
  M.render=function(){
    render();
    const s=M.session;
    if(!s||!['play','paused'].includes(M.state)||M.celebrating)return;
    const routes=Object.keys(M.progress.flags).filter(key=>key.startsWith('desvio_')&&M.progress.flags[key]).length;
    text('DESVÍOS '+routes+'/6',480,66,9,'#93b8ab','center');
  };
})();
