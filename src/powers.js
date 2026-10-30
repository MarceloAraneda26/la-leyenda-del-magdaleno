/* Definitivas 0.5: secuencias por fases, herramientas sujetas a la mano,
 * evento de impacto propio, efectos y sonido de cada poder.
 * Ángulos "hacia adelante": 0 es el brazo colgando, positivo gira hacia
 * donde mira el personaje y PI apunta hacia arriba. [hombro, codo]. */
(() => {
  'use strict';
  const M=window.Magdaleno;
  const {F,line,circle,text}=M.draw;
  const g=M.ctx;
  const PI=Math.PI;
  const curves={inOut:v=>v*v*(3-2*v),in:v=>v*v*v,out:v=>1-Math.pow(1-v,3),linear:v=>v};
  const PROPS=['f0','f1','b0','b1','crouch','lean','jump','lift','scale','psi','show','charge'];
  const REST={f:[0,.07],b:[0,-.07]};

  const defs={
    ruzio:{duration:1,impact:.56,tool:'hammer',keys:[
      {t:0},
      {t:.12,ease:'inOut',f:[.9,1.1],b:[-.15,-.2],psi:1.1,show:1},
      {t:.34,ease:'inOut',f:[PI+.3,.2],b:[-1.05,-.45],psi:.1,lean:-.07},
      {t:.45,ease:'out',f:[PI+.48,.25],b:[-1.2,-.5],psi:.05,lean:-.09},
      {t:.56,ease:'in',f:[.85,.08],b:[-.45,-.15],psi:.3,lean:.12,crouch:1},
      {t:.68,ease:'out',f:[.88,.1],psi:.32,lean:.1,crouch:.85},
      {t:.86,ease:'inOut',f:[.5,1],b:[-.15,-.2],psi:1,lean:0,crouch:0},
      {t:1,ease:'inOut',...REST,psi:1.1,show:0}
    ]},
    pulga:{duration:1.2,impact:.92,tool:'ball',jumpHeight:110,keys:[
      {t:0},
      {t:.08,ease:'inOut',f:[.45,.9],b:[-.3,-.5],show:1},
      {t:.22,ease:'inOut',f:[.35,.7],b:[-.4,-.6],crouch:1,lean:.06},
      {t:.62,ease:'out',jump:1,crouch:0,f:[PI-.12,.08],b:[-1.5,-.3],lean:-.04},
      {t:.72,ease:'inOut',jump:.97,f:[PI+.25,.35],b:[-1.7,-.35],lean:-.08},
      {t:.92,ease:'in',jump:0,f:[.35,.1],b:[-.6,-.3],crouch:1,lean:.24},
      {t:1.04,ease:'out',crouch:.55,f:[.45,.3],lean:.12},
      {t:1.2,ease:'inOut',...REST,crouch:0,lean:0,show:0}
    ]},
    tobi:{duration:1.5,impact:.92,tool:null,keys:[
      {t:0},
      {t:.22,ease:'inOut',f:[-.3,.6],b:[.3,-.6],crouch:.7,lean:.05},
      {t:.62,ease:'inOut',scale:2,crouch:0,f:[PI-.35,.25],b:[-(PI-.35),-.25],lean:-.04},
      {t:.76,ease:'out',lift:22,f:[PI-.15,.3],b:[-(PI-.15),-.3],lean:-.09},
      {t:.92,ease:'in',lift:0,f:[-.25,.15],b:[.25,-.15],crouch:1,lean:.16},
      {t:1.08,ease:'out',crouch:.8,f:[-.2,.2],b:[.2,-.2],lean:.12},
      {t:1.5,ease:'inOut',...REST,scale:1,crouch:0,lean:0}
    ]},
    marcelo:{duration:.8,impact:.42,tool:'device',keys:[
      {t:0},
      {t:.12,ease:'inOut',f:[.85,1],b:[-.5,.9],show:1},
      {t:.30,ease:'inOut',f:[1.3,.35],charge:.75},
      {t:.38,ease:'inOut',f:[1.2,.45],lean:-.03,charge:1},
      {t:.42,ease:'in',f:[1.5,.2],lean:.06,charge:1},
      {t:.58,ease:'out',f:[1.42,.28],lean:.03,charge:0},
      {t:.8,ease:'inOut',...REST,lean:0,show:0}
    ]},
    pallo:{duration:.9,impact:.44,tool:'palm',keys:[
      {t:0},
      {t:.26,ease:'inOut',f:[.45,.55],b:[-.45,-.55],crouch:.25,charge:.6,show:1},
      {t:.40,ease:'inOut',f:[1.52,.02],b:[-.55,-.35],crouch:.1,lean:.05,charge:1},
      {t:.44,ease:'out',f:[1.58,0],lean:.03,charge:1},
      {t:.66,ease:'inOut',f:[1.5,.05],charge:0},
      {t:.9,ease:'inOut',...REST,crouch:0,lean:0,show:0}
    ]}
  };
  // Ayudas de rescate: misma secuencia del poder, salvo Tobi, que empuja el bloque.
  const aid={tobi:{duration:1,impact:.6,tool:null,keys:[
    {t:0},
    {t:.3,ease:'inOut',f:[1.35,.35],b:[1.1,.5],crouch:.5,lean:.1},
    {t:.6,ease:'in',f:[1.55,.05],b:[1.3,.1],crouch:.7,lean:.22},
    {t:1,ease:'inOut',...REST,crouch:0,lean:0}
  ]}};

  function prepare(def){
    let prev={f0:0,f1:.07,b0:0,b1:-.07,crouch:0,lean:0,jump:0,lift:0,scale:1,psi:0,show:0,charge:0};
    def.frames=def.keys.map(k=>{
      const v={...prev};
      if(k.f){v.f0=k.f[0];v.f1=k.f[1];}
      if(k.b){v.b0=k.b[0];v.b1=k.b[1];}
      for(const p of PROPS)if(k[p]!==undefined)v[p]=k[p];
      v.t=k.t;v.ease=k.ease||'inOut';prev=v;return v;
    });
    const impactIndex=def.frames.findIndex(f=>Math.abs(f.t-def.impact)<1e-6);
    def.strikeStart=def.frames[Math.max(0,impactIndex-1)].t;
  }
  Object.values(defs).forEach(prepare);Object.values(aid).forEach(prepare);
  function sample(def,time){
    const fr=def.frames,t=M.clamp(time,0,def.duration);let i=1;
    while(i<fr.length-1&&t>fr[i].t)i++;
    const a=fr[i-1],b=fr[i],u=b.t>a.t?M.clamp((t-a.t)/(b.t-a.t),0,1):1,k=curves[b.ease](u),out={};
    for(const p of PROPS)out[p]=a[p]+(b[p]-a[p])*k;
    return out;
  }
  M.powers=defs;

  M.powerPose=function(id,elapsed,variant){
    const def=variant==='aid'&&aid[id]?aid[id]:defs[id];if(!def)return null;
    const v=sample(def,elapsed),next=sample(def,elapsed+1/60);
    const phase=elapsed<def.strikeStart?'preparación':elapsed<def.impact?'acción':elapsed<def.impact+.08?'impacto':'recuperación';
    // Tobi crece por pasos de 1/16 para conservar el pixel art.
    const scale=v.scale===1?1:1+Math.round((v.scale-1)*16)/16;
    return {id,elapsed,duration:def.duration,impact:def.impact,phase,front:[v.f0,v.f1],back:[v.b0,v.b1],crouch:v.crouch,lean:v.lean,jump:v.jump,lift:v.lift,scale,
      air:v.jump>.04,rising:next.jump>v.jump,
      tool:def.tool?{kind:def.tool,arm:'front',psi:v.psi,show:v.show,charge:v.charge,impactAge:elapsed-def.impact}:null};
  };

  // Espacio libre sobre la cabeza para que la clavada no atraviese techos.
  M.jumpRoom=function(p,max){
    const top=p.y-p.h,c0=Math.floor((p.x-p.hw+.5)/M.T),c1=Math.floor((p.x+p.hw-.5)/M.T);
    for(let h=0;h<=max;h+=3){const row=Math.floor((top-h-1)/M.T);for(let c=c0;c<=c1;c++)if(M.solidAt(c,row))return Math.max(0,h-3);}
    return max;
  };

  // Ángulo de giro de la transformación actual, válido también con espejo horizontal.
  const turn=()=>{const m=g.getTransform();return Math.atan2(-m.c,m.d);};

  // Se llama dentro del marco de la mano: +x apunta hacia adelante y +y sigue el antebrazo.
  M.drawTool=function(tool,k,mark){
    const s=tool.show;
    if(tool.kind==='hammer'){
      if(s<=0)return;
      g.save();g.rotate(-tool.psi);g.scale(s,s);
      F(-2.5*k,-6*k,5*k,46*k,'#5e3f26');F(-1.5*k,-6*k,2*k,46*k,'#a5794c');
      F(-14*k,33*k,28*k,14*k,'#2c3a4d');F(-13*k,34*k,26*k,4*k,'#94a9b5');F(-14*k,43*k,28*k,4*k,'#1b2533');F(-15*k,35*k,3*k,10*k,'#c9d4dc');
      mark('grip',0,0);mark('head',0,40*k);mark('tip',-15*k,40*k);
      g.restore();
    }else if(tool.kind==='ball'){
      if(s<=0)return;
      g.save();g.translate(3*k,14*k);g.rotate(-turn());
      const age=tool.impactAge,squash=age>=0&&age<.12?1-.28*(1-age/.12):1;
      g.translate(0,9*k*s*(1-squash));g.scale(s*(2-squash),s*squash);
      circle(0,0,9*k+1,'#181d2b');circle(0,0,9*k,'#d89c56');
      line(-8*k,0,8*k,0,'#744c37',2);line(0,-8*k,0,8*k,'#744c37',2);
      mark('center',0,0);mark('bottom',0,9*k);
      g.restore();mark('grip',0,0);
    }else if(tool.kind==='device'){
      if(s<=0)return;
      g.save();g.translate(0,-2*k);g.rotate(-turn());g.scale(s*1.25,s*1.25);
      const c=tool.charge,flash=tool.impactAge>=0&&tool.impactAge<.08;
      F(-8*k,-11*k,16*k,21*k,'#14202f');F(-6*k,-9*k,12*k,11*k,flash?'#ffffff':c>.5?'#c9f3ef':'#84d4d2');
      F(-5*k,4*k,10*k*Math.min(1,c),2*k,'#f1c675');F(-1.5*k,7*k,3*k,2*k,c>.9?'#ef806b':'#5b6e7c');
      if(c>.2&&!flash)for(let i=0;i<3;i++)F((-4+i*3)*k,(-6+((i+Math.floor(c*6))%3)*3)*k,2*k,2*k,'#ffffff');
      mark('center',0,-4*k);
      g.restore();mark('grip',0,0);
    }else if(tool.kind==='palm'){
      const c=tool.charge;mark('palm',0,4*k);mark('grip',0,0);
      if(c<=0)return;
      g.save();g.globalAlpha*=.35+.45*c;circle(0,4*k,(3+6*c)*k,'#be9be8');g.globalAlpha/=(.35+.45*c);
      circle(0,4*k,(1.5+2*c)*k,'#f1e6ff');g.restore();
    }
  };

  // Estela del punto que golpea durante la acción, dibujada en el espacio de pantalla.
  M.rigTrail={};
  const lead={ruzio:o=>o.tool.tip,pulga:o=>o.tool.bottom,tobi:o=>o.front};
  M.afterRig=function(id,rig,out){
    const pick=lead[id];if(!pick)return;
    const point=pick(out);let trail=M.rigTrail[id];
    if(!trail||rig.elapsed<trail.last)trail=M.rigTrail[id]={points:[],last:0};
    trail.last=rig.elapsed;
    if(rig.phase!=='acción'||!point){if(rig.phase!=='impacto')trail.points=[];return;}
    trail.points.push(point);if(trail.points.length>4)trail.points.shift();
    const pts=trail.points;
    for(let i=1;i<pts.length;i++){g.globalAlpha=.1+.08*i;line(pts[i-1].x,pts[i-1].y,pts[i].x,pts[i].y,M.heroes[id].color,4+2*i);}
    g.globalAlpha=1;
  };

  M.powerEffect=function(id,p,contact,heal){
    const col=M.heroes[id].color;
    // Ondas ancladas al punto real de contacto: cabeza del martillo y balón.
    if(id==='ruzio')return{kind:'quake',x:contact,y:p.y,range:285,col,life:.55,max:.55,anchor:{id,point:'tip'}};
    if(id==='pulga')return{kind:'slam',x:p.x+p.face*26,y:p.y,r:155,col,life:.5,max:.5,anchor:{id,point:'bottom'}};
    if(id==='tobi')return{kind:'stomp',x:p.x,y:p.y,r:170,col,life:.6,max:.6};
    if(id==='marcelo')return{kind:'pulse',x:p.x+p.face*30,y:p.y-62,r:155,col,life:.6,max:.6,anchor:{id,point:'center'}};
    return{kind:'suture',x:p.x+p.face*30,y:p.y-56,end:p.x+p.face*355,dir:p.face,heal,col,life:.55,max:.55,anchor:{id,point:'palm'}};
  };

  // Efectos propios. Devuelve true cuando reconoce el tipo.
  M.drawEffect=function(fx,cam){
    const life=M.clamp(fx.life/fx.max,0,1),age=1-life;
    if(fx.anchor&&fx.ox==null){const o=M.rigOut?.[fx.anchor.id]?.tool?.[fx.anchor.point];fx.ox=o?o.x+cam:fx.x;fx.oy=o?o.y:fx.y;}
    if(fx.kind==='quake'){
      const front=fx.range*curves.out(Math.min(1,age/.45)),x=fx.ox-cam;
      g.globalAlpha=life;F(x-front,fx.y-2,front*2,3,'#f3dfb0');
      for(const side of [-1,1])for(let j=0;j<4;j++){
        const d=front-j*16;if(d<0)continue;
        const hop=Math.abs(Math.sin(age*9+j))*12*life;
        F(x+side*d-5,fx.y-8-hop,10,8,j%2?'#8a6a48':'#c9a36b');F(x+side*d-2,fx.y-12-hop*1.4,4,4,'#f3dfb0');
      }
      if(age<.4){g.globalAlpha=(1-age/.4)*.6;for(let i=0;i<5;i++)F(x-14+i*6,fx.y-10-age*30-(i%2)*6,6,6,'#c9a36b');}
      g.globalAlpha=1;return true;
    }
    if(fx.kind==='slam'||fx.kind==='stomp'){
      const x=(fx.ox??fx.x)-cam,r=fx.r*curves.out(age);
      g.globalAlpha=life;g.strokeStyle=fx.col;g.lineWidth=fx.kind==='stomp'?6:4;
      g.beginPath();g.ellipse(x,fx.y-2,Math.max(1,r),Math.max(1,r*.2),0,0,PI*2);g.stroke();
      g.strokeStyle='#fff3d6';g.lineWidth=2;g.beginPath();g.ellipse(x,fx.y-2,Math.max(1,r*.7),Math.max(1,r*.14),0,0,PI*2);g.stroke();
      const rocks=fx.kind==='stomp'?8:5;
      for(let i=0;i<rocks;i++){const a=(i/rocks)*PI,dx=Math.cos(a)*r*.8,up=Math.sin(age*PI)*(26+i%3*10);F(x+dx-3,fx.y-6-up,6,6,i%2?'#8a8f84':'#c4b693');}
      g.globalAlpha=1;return true;
    }
    if(fx.kind==='pulse'){
      const x=fx.ox-cam,y=fx.oy;g.lineWidth=4;
      for(const delay of [0,.18]){const a=M.clamp((age-delay)/(1-delay),0,1);if(a<=0)continue;const r=fx.r*curves.out(a);
        g.globalAlpha=(1-a)*.9;g.strokeStyle=delay?'#ffffff':fx.col;g.beginPath();g.arc(x,y,Math.max(1,r),0,PI*2);g.stroke();
        for(let i=0;i<8;i++){const ang=i*PI/4+a;F(x+Math.cos(ang)*r-2,y+Math.sin(ang)*r-2,4,4,'#8cdbe2');}}
      g.globalAlpha=1;return true;
    }
    if(fx.kind==='suture'){
      const x0=fx.ox-cam,y=fx.oy,x1=fx.end-cam,len=x1-x0;
      if(age<.35){
        const reach=Math.min(1,age/.12),tip=x0+len*reach;
        g.globalAlpha=1;
        for(let i=0;i<14;i++){const u=(i/14+age*3)%1;const sx=x0+len*u*reach;if((sx-x0)*fx.dir<0)continue;F(sx-4,y-3,8,6,'#be9be8');}
        F(Math.min(x0,tip),y-1,Math.abs(tip-x0),2,'#f1e6ff');
      }else{
        const back=(age-.35)/.65,healed=fx.heal>0,col=healed?'#9fe3b8':'#8f8aa3';
        for(let i=0;i<6;i++){const u=M.clamp(back*1.3-i*.06,0,1);const sx=x1+(x0-x1)*u;g.globalAlpha=Math.max(0,1-back*.6);F(sx-3,y-3+Math.sin(u*PI*3)*4,6,6,col);}
        if(healed){g.globalAlpha=Math.min(1,back*2)*(1-back*.4);text('+'+fx.heal+' VIDA',x0-fx.dir*10,y-26-back*14,11,'#9fe3b8','center');}
      }
      g.globalAlpha=1;return true;
    }
    return false;
  };

  // Chispas sobre enemigos paralizados por el pulso.
  const drawEnemy=M.enemy;
  M.enemy=function(enemy,cam,time){
    drawEnemy(enemy,cam,time);
    if(enemy.dead||!(enemy.stun>0))return;
    const x=enemy.x-cam,y=enemy.y-enemy.h-8;
    for(let i=0;i<3;i++){const a=time*9+i*2.1;F(x+Math.cos(a)*14-2,y+Math.sin(a)*4-2,4,4,i%2?'#8cdbe2':'#ffffff');}
  };

  // Sonido propio de inicio, impacto y curación.
  const bank={
    start:{marcelo:[[880,880,.05,'square',.03],[880,880,.05,'square',.03,.09]],ruzio:[[110,220,.35,'sawtooth',.03]],pulga:[[200,140,.07,'triangle',.05],[200,140,.07,'triangle',.05,.12]],tobi:[[70,260,.6,'sawtooth',.035]],pallo:[[660,990,.3,'triangle',.022],[880,1320,.3,'triangle',.015,.08]]},
    impact:{marcelo:[[1400,300,.18,'square',.03],[700,200,.25,'triangle',.03,.02]],ruzio:[[90,35,.35,'square',.06],[160,40,.2,'sawtooth',.04]],pulga:[[150,45,.25,'square',.055],[900,300,.08,'triangle',.02]],tobi:[[60,25,.5,'square',.07],[120,30,.35,'sawtooth',.045,.03]],pallo:[[990,1480,.18,'triangle',.03],[1320,1980,.2,'triangle',.02,.06]]},
    heal:{pallo:[[523,784,.25,'triangle',.03,.12],[659,988,.3,'triangle',.025,.22]]}
  };
  M.audio.power=function(id,moment){for(const tone of bank[moment]?.[id]||[])this.tone(...tone);};
})();
