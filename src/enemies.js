/* Patrulleros de masilla: silueta humana articulada y emblemas de las responsabilidades.
 * Raster de 80×62: trazos enteros, paleta limitada y escalado sin suavizado. */
(() => {
  'use strict';
  const M=window.Magdaleno,g=M.ctx;
  const canvas=document.createElement('canvas');canvas.width=80;canvas.height=62;
  const p=canvas.getContext('2d');p.imageSmoothingEnabled=false;
  const sprites=new Map(),spriteLimit=192;
  M.enemySprites={clear:()=>sprites.clear(),info:()=>({count:sprites.size,limit:spriteLimit,maxBytes:spriteLimit*80*62*4})};
  const styles={
    bill:{accent:'#d8c595',light:'#f2e5c5',dark:'#8b7956'},
    phone:{accent:'#6cabc0',light:'#aee4df',dark:'#386477'},
    folder:{accent:'#c49c64',light:'#f0cf90',dark:'#7c5d43'},
    coin:{accent:'#c8a04c',light:'#ffe09a',dark:'#876231'},
    mail:{accent:'#a795bf',light:'#dfc9ea',dark:'#67577c'},
    clock:{accent:'#80afa5',light:'#c8e1ce',dark:'#486d70'},
    alarm:{accent:'#c18779',light:'#f0bc92',dark:'#7b5559'}
  };
  const ease=t=>{t=M.clamp(t,0,1);return t*t*(3-2*t);};
  const mix=(a,b,t)=>[M.lerp(a[0],b[0],t),M.lerp(a[1],b[1],t)];
  M.enemyPose=function(e){
    const speed=M.clamp(e.gaitSpeed??Math.abs(e.vx||0)/100,0,1),phase=(e.walkT||0)*10;
    const gait=Math.sin(phase)*speed,bob=e.onGround===false?0:-Math.abs(Math.sin(phase))*speed;
    const airborne=e.onGround===false,warning=e.warn?ease(1-e.cd/.55):0;
    const elapsed=.32-(e.action||0),active=e.action>0;
    const extend=active?(elapsed<.09?ease(elapsed/.09):elapsed<.17?1:1-ease((elapsed-.17)/.15)):0;
    const guard=[14,-28],windup=[5,-36],punch=[28,-27];
    const start=active&&elapsed<.09?windup:mix(guard,windup,warning);
    const fist=mix(start,punch,extend),backLift=active?1-ease(elapsed/.32):warning;
    const pose={bob,lean:(e.charge>0?3:0)+(e.hurt>0?-2:0),fist,elbow:mix([14,-22],[19,-29],extend),
      backFist:[-13-gait*2,-22+gait*2-backLift*9],
      leftKnee:[-5+gait*3,-9-(airborne?3:0)],rightKnee:[5-gait*3,-9-(airborne?1:0)],
      leftFoot:[-5+gait*6,airborne?-4:-Math.max(0,gait)*3],rightFoot:[5-gait*6,airborne?-1:-Math.max(0,-gait)*3],
      strikeActive:e.type==='folder'&&active&&elapsed>=.07&&elapsed<=.17};
    // Las articulaciones se mueven sobre la cuadrícula del sprite. La física de
    // la mano usa esta misma pose y cada postura rasterizada se comparte.
    for(const key of ['fist','elbow','backFist','leftKnee','rightKnee','leftFoot','rightFoot'])pose[key]=pose[key].map(Math.round);
    pose.bob=Math.round(pose.bob);return pose;
  };
  M.enemyHand=function(e){const pose=M.enemyPose(e),k=e.h/48,dir=e.face||e.dir||1;return{x:e.x+dir*(pose.fist[0]+pose.lean)*k,y:e.y+(pose.fist[1]+pose.bob)*k,r:4*k};};
  M.enemyStrikeBox=function(e){if(!M.enemyPose(e).strikeActive)return null;const hand=M.enemyHand(e);return{x:hand.x-hand.r,y:hand.y-hand.r,w:hand.r*2,h:hand.r*2};};
  const F=(x,y,w,h,c)=>{p.fillStyle=c;p.fillRect(Math.round(x)+40,Math.round(y)+56,w,h);};
  // Pincel cuadrado sobre puntos enteros: no genera bordes suavizados al articular.
  function stroke(a,b,width,color){const dx=b[0]-a[0],dy=b[1]-a[1],steps=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))));for(let i=0;i<=steps;i++)F(a[0]+dx*i/steps-width/2,a[1]+dy*i/steps-width/2,width,width,color);}
  function limb(a,b,c,width,body,light,ink){stroke(a,b,width+2,ink);stroke(b,c,width+1,ink);stroke(a,b,width,body);stroke(b,c,width-1,body);stroke([a[0]-1,a[1]],[b[0]-1,b[1]],2,light);F(b[0]-2,b[1],4,1,'#687475');F(b[0],b[1]+1,1,2,'#687475');F(b[0]-2,b[1]-1,2,1,light);}
  function emblem(type,s){
    if(type==='bill'){
      F(-6,-31,12,12,'#26313d');F(-5,-31,10,11,s.light);F(2,-31,3,3,s.accent);
      for(let i=0;i<3;i++)F(-3,-28+i*3,6-i,1,s.dark);F(1,-21,3,1,s.dark);
    }else if(type==='mail'){
      F(-8,-30,16,10,'#27303d');F(-7,-29,14,8,s.light);
      stroke([-6,-28],[0,-24],1,s.dark);stroke([0,-24],[6,-28],1,s.dark);stroke([-6,-22],[-3,-25],1,s.accent);stroke([3,-25],[6,-22],1,s.accent);
    }else if(type==='phone'){
      F(-5,-32,10,14,'#192b3b');F(-4,-31,8,11,s.accent);F(-3,-30,6,5,s.light);F(-2,-24,4,1,s.dark);F(-1,-20,2,1,s.light);
    }else if(type==='folder'){
      F(-8,-30,16,11,'#3b3435');F(-8,-32,7,4,s.light);F(-7,-29,14,9,s.accent);F(-6,-28,12,2,s.light);
      F(-5,-24,10,3,'#51423c');for(let i=0;i<4;i++)F(-5+i*3,-24,2,1,s.light);
    }else{
      const money=type==='coin';F(-5,-32,10,2,s.dark);F(-7,-30,14,8,s.dark);F(-5,-22,10,2,s.dark);F(-5,-31,10,10,s.accent);F(-6,-29,12,6,s.accent);F(-4,-30,8,8,money?s.light:'#293e4d');
      if(money){F(-1,-30,1,9,s.dark);F(-3,-28,5,1,s.dark);F(-3,-27,1,2,s.dark);F(-3,-25,5,1,s.dark);F(1,-24,1,2,s.dark);F(-3,-22,5,1,s.dark);}
      else{stroke([0,-26],[0,-29],1,s.light);stroke([0,-26],[3,-25],1,s.light);F(-1,-27,2,2,s.light);F(-1,-31,2,1,s.accent);}
    }
  }
  M.enemy=function(e,cam){
    if(e.dead)return;
    const s=styles[e.type]||styles.folder,pose=M.enemyPose(e),k=e.h/48,dir=e.face||e.dir||-1;
    const ink='#182332',joint='#596365',body=e.hurt>0?'#e9d3ad':'#afb4b2',light=e.hurt>0?'#fff1ce':'#d1d4ca',shade='#7b8485';
    const key=e.type+'|'+(e.hurt>0)+'|'+!!e.warn+'|'+JSON.stringify([pose.bob,pose.lean,pose.fist,pose.elbow,pose.backFist,pose.leftKnee,pose.rightKnee,pose.leftFoot,pose.rightFoot]);
    let sprite=sprites.get(key);
    if(!sprite){
    p.clearRect(0,0,80,62);
    // Sombra, botas y rodillas sostienen la silueta; brazos al frente en guardia.
    F(-13,0,26,2,'#10202a');F(-9,2,18,1,'#142833');
    const foot=(which,shading)=>{const knee=pose[which+'Knee'],end=pose[which+'Foot'],hip=[which==='left'?-4:4,-18];limb(hip,knee,[end[0],end[1]-3],7,shading,light,ink);F(end[0]-4,end[1]-4,9,4,ink);F(end[0]-3,end[1]-4,8,2,joint);F(end[0]-3,end[1]-4,3,1,light);};
    foot('left',shade);foot('right',body);
    const bob=pose.bob,lean=pose.lean;
    const point=([x,y])=>[x+lean,y+bob];
    const backElbow=point([-15,-27]);limb(point([-9,-32]),backElbow,point(pose.backFist),7,shade,body,ink);
    const back=point(pose.backFist);F(back[0]-4,back[1]-3,7,6,ink);F(back[0]-3,back[1]-3,5,4,shade);
    p.save();p.translate(Math.round(lean),Math.round(bob));
    F(-9,-34,18,3,ink);F(-11,-31,22,10,ink);F(-8,-21,16,6,ink);F(-7,-16,14,3,ink);
    F(-9,-32,18,4,body);F(-9,-28,18,7,body);F(-6,-21,12,6,shade);F(-6,-15,12,2,joint);
    F(-8,-32,6,2,light);F(3,-32,5,2,light);F(-8,-29,2,6,light);F(7,-28,2,7,shade);
    // Arcilla agrietada y protecciones, sin uniformes ni logotipos de una franquicia.
    F(-12,-33,5,4,ink);F(-11,-33,4,2,s.accent);F(8,-33,5,4,ink);F(8,-33,4,2,s.accent);
    F(-6,-20,12,2,joint);F(-2,-20,4,2,s.accent);F(4,-22,2,1,light);F(-6,-24,1,2,shade);
    emblem(e.type,s);
    F(-3,-37,6,4,joint);F(-2,-37,3,3,body);
    // Máscara humanoide de masilla, ojos hundidos, mandíbula y surcos asimétricos.
    F(-4,-48,8,1,ink);F(-6,-47,12,2,ink);F(-7,-45,14,7,ink);F(-5,-38,10,2,ink);F(-3,-36,6,1,ink);
    F(-4,-47,8,2,light);F(-6,-45,12,6,body);F(-4,-39,8,2,shade);F(-2,-37,4,1,body);F(4,-44,2,5,shade);
    F(-5,-44,2,1,ink);F(-3,-43,2,1,ink);F(-5,-43,3,2,ink);F(4,-44,2,1,ink);F(2,-43,2,1,ink);F(3,-43,3,2,ink);
    if(e.warn){F(-4,-43,1,1,'#f3bf77');F(4,-43,1,1,'#f3bf77');}
    F(0,-42,1,3,shade);F(-2,-39,5,1,ink);F(-2,-38,1,1,ink);F(2,-38,1,1,ink);F(-3,-46,1,2,shade);F(-4,-45,1,1,shade);F(4,-40,1,2,light);F(-5,-41,1,2,shade);F(-4,-40,1,1,shade);
    if(e.type==='phone'){F(-8,-44,2,7,s.dark);F(6,-44,2,7,s.dark);stroke([7,-38],[4,-37],1,s.light);}
    if(e.type==='alarm'){F(-9,-49,6,3,ink);F(4,-49,6,3,ink);F(-8,-49,4,2,s.accent);F(5,-49,4,2,s.accent);}
    p.restore();
    limb(point([9,-31]),point(pose.elbow),point(pose.fist),7,body,light,ink);
    const front=point(pose.fist);F(front[0]-4,front[1]-3,8,7,ink);F(front[0]-3,front[1]-3,6,5,body);F(front[0]-3,front[1]-3,5,1,light);F(front[0],front[1],2,2,shade);
    if(e.warn){F(-2,-58,4,7,ink);F(-1,-57,2,5,'#ffce81');F(-1,-50,2,2,'#ffce81');}
    sprite=document.createElement('canvas');sprite.width=80;sprite.height=62;sprite.getContext('2d').drawImage(canvas,0,0);
    if(sprites.size>=spriteLimit)sprites.delete(sprites.keys().next().value);sprites.set(key,sprite);
    }
    g.save();g.imageSmoothingEnabled=false;g.translate(Math.round(e.x-cam),Math.round(e.y));g.scale(dir,1);
    if(e.stun>0)g.globalAlpha=.75;
    g.drawImage(sprite,-40*k,-56*k,80*k,62*k);g.restore();
  };
  M.enemyStyles=styles;
})();
