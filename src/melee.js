/* Armas de ataque básico: agarre compartido con el cuerpo, barrido físico
 * de la herramienta y un solo impacto por objetivo en cada ejecución. */
(() => {
  'use strict';
  const M=window.Magdaleno,g=M.ctx,{F,line,circle}=M.draw;
  const duration=.30,rest={front:[.12,.20],psi:.77};
  M.weapons={
    marcelo:{name:'Llave tecnológica',kind:'wrench',length:29,radius:6,color:'#7ab8f0',swing:.78},
    ruzio:{name:'Martillo de campo',kind:'field-hammer',length:30,radius:8,color:'#dfab6c',swing:.72},
    pulga:{name:'Bastón de cancha',kind:'court-stick',length:38,radius:5,color:'#e57985',swing:.67},
    tobi:{name:'Bomba de bicicleta',kind:'bike-pump',length:33,radius:7,color:'#97c3b0',swing:.77},
    pallo:{name:'Bastón médico arcano',kind:'medical-staff',length:37,radius:7,color:'#be9be8',swing:.65}
  };
  for(const [id,weapon]of Object.entries(M.weapons)){M.heroes[id].weapon=weapon.name;M.heroes[id].description=weapon.name+' para el ataque básico. '+M.heroes[id].description;}
  M.melee={duration,cooldown:.32,damage:10,activeStart:.07,activeEnd:.23};
  const ease=v=>{v=M.clamp(v,0,1);return v*v*(3-2*v);};
  M.meleePose=function(id,elapsed=-1){
    const weapon=M.weapons[id];if(!weapon)return null;
    const attacking=elapsed>=0&&elapsed<duration,t=M.clamp(elapsed,0,duration);
    const keys=[
      [0,...rest.front,rest.psi,0],
      [.06,-.40,1.02,.82,-.035],
      [.10,1.20,.30,-.28,-.02],
      [.14,weapon.swing,.12,Math.PI/2-weapon.swing-.12,.055],
      [.20,.32,.18,.95,.035],
      [.30,...rest.front,rest.psi,0]
    ];
    let front=rest.front,psi=rest.psi,lean=0;
    if(attacking){let i=1;while(i<keys.length-1&&t>keys[i][0])i++;const a=keys[i-1],b=keys[i],u=ease((t-a[0])/(b[0]-a[0]));front=[M.lerp(a[1],b[1],u),M.lerp(a[2],b[2],u)];psi=M.lerp(a[3],b[3],u);lean=M.lerp(a[4],b[4],u);}
    const phase=!attacking?'reposo':t<.07?'preparación':t<.18?'acción':'recuperación';
    return{id,variant:'melee',elapsed:attacking?t:-1,duration,phase,front,back:null,crouch:0,lean,jump:0,lift:0,scale:1,
      tool:{kind:'melee',weapon:id,psi,show:1},attacking};
  };

  // La física reproduce las mismas transformaciones de hombro, codo y mano
  // del renderizador. No depende de que se haya dibujado un cuadro antes.
  M.meleeGeometry=function(id,p,elapsed){
    const rig=M.meleePose(id,elapsed),weapon=M.weapons[id],dir=p.face||1,height=94,b=M.bounds[id],width=b.w*height/b.h;
    const speed=p.onGround?Math.min(1,Math.abs(p.vx||0)/220):0,time=p.animT||0;
    const left=dir<0,shoulder=[left?.24:.76,.315],elbow=[left?.14:.86,.50];
    const bounce=p.onGround?-Math.abs(Math.sin(time*12))*1.5*speed:0;
    const matrix=new DOMMatrix().translate(Math.round(p.x-M.cam)+M.cam,Math.round(p.y))
      .scale(1,1-M.clamp((p.landing||0)/.14,0,1)*.045)
      .rotate((p.hurt?-.075*dir:.028*dir*speed+rig.lean*dir)*180/Math.PI)
      .translate(0,bounce)
      .translate((shoulder[0]-.5)*width,(shoulder[1]-1)*height)
      .rotate(-dir*rig.front[0]*180/Math.PI)
      .translate((elbow[0]-shoulder[0])*width,(elbow[1]-shoulder[1])*height)
      .rotate(-dir*rig.front[1]*180/Math.PI)
      .translate(((left?.13:.87)-elbow[0])*width,(.70-elbow[1])*height)
      .scale(dir,1).rotate(-rig.tool.psi*180/Math.PI);
    const point=(x,y)=>{const q=matrix.transformPoint(new DOMPoint(x,y));return{x:q.x,y:q.y};};
    return{grip:point(0,0),tip:point(0,weapon.length),radius:weapon.radius,weapon:id};
  };
  function segmentBox(a,b,box,radius){
    const minX=box.x-radius,maxX=box.x+box.w+radius,minY=box.y-radius,maxY=box.y+box.h+radius;
    let enter=0,leave=1;const dx=b.x-a.x,dy=b.y-a.y;
    for(const [origin,delta,min,max]of [[a.x,dx,minX,maxX],[a.y,dy,minY,maxY]]){
      if(Math.abs(delta)<1e-8){if(origin<min||origin>max)return false;continue;}
      let lo=(min-origin)/delta,hi=(max-origin)/delta;if(lo>hi)[lo,hi]=[hi,lo];enter=Math.max(enter,lo);leave=Math.min(leave,hi);if(enter>leave)return false;
    }
    return true;
  }
  M.meleeHits=function(p,box){
    const elapsed=duration-p.attack;if(elapsed<M.melee.activeStart||elapsed>M.melee.activeEnd)return false;
    if((box.x+box.w/2-p.x)*p.face< -box.w/2)return false;
    const id=M.session.hero,current=M.meleeGeometry(id,p,elapsed),previous=M.meleeGeometry(id,p,Math.max(0,elapsed-M.STEP));
    return segmentBox(current.grip,current.tip,box,current.radius)||segmentBox(previous.grip,previous.tip,box,current.radius)||segmentBox(previous.tip,current.tip,box,current.radius);
  };

  const drawTool=M.drawTool;
  M.drawTool=function(tool,k,mark){
    if(tool.kind!=='melee')return drawTool(tool,k,mark);
    const w=M.weapons[tool.weapon],length=w.length;
    g.save();g.rotate(-tool.psi);g.scale(k,k);
    // Mango cerrado bajo la palma, con las mismas coordenadas que usa el golpe.
    if(w.kind==='wrench'){
      F(-3,-5,6,29,'#253b4e');F(-2,-3,4,24,'#8babc1');F(-1,0,2,12,'#4c76a2');
      F(-8,20,16,13,'#4b6475');F(-7,20,5,8,'#c0d1d6');F(3,20,5,8,'#c0d1d6');F(-3,25,7,5,'#a4bbc3');
      F(-2,14,4,5,'#7ddfe1');
    }else if(w.kind==='field-hammer'){
      F(-3,-6,6,32,'#563d2a');F(-1,-4,2,28,'#ac8150');
      for(let y=1;y<15;y+=5)F(-3,y,6,2,'#392f29');
      F(-12,23,24,13,'#233545');F(-11,23,22,4,'#b1bec2');F(-12,31,24,5,'#536774');F(-13,25,3,9,'#d1d5cd');
    }else if(w.kind==='court-stick'){
      F(-3,-9,6,49,'#27303b');F(-2,-8,2,46,'#8b6553');
      for(let y=-2;y<16;y+=5){F(-3,y,6,2,'#e7bd80');F(-3,y+2,6,1,'#9e6552');}
      F(-4,32,8,8,'#d99b54');F(-4,35,8,2,'#5f3e32');F(-1,32,2,8,'#5f3e32');
    }else if(w.kind==='bike-pump'){
      F(-5,5,10,27,'#263c45');F(-4,6,7,25,'#9ab9b6');F(-2,7,2,23,'#d2ded1');
      F(-2,-8,4,14,'#5c7880');F(-8,-10,16,5,'#29343b');F(-6,-9,12,2,'#8eaaa7');
      F(-8,30,16,6,'#354951');F(-7,30,14,2,'#a5c2b3');line(5,8,10,18,'#344149',2);line(10,18,8,30,'#344149',2);
    }else{
      F(-3,-9,6,45,'#453c56');F(-2,-8,2,43,'#9c83b7');
      for(let y=0;y<13;y+=4)F(-3,y,6,1,'#ddcbaa');
      circle(0,35,9,'#3c3b52');circle(0,35,7,'#ab93c4');circle(0,35,5,'#243e46');
      F(-1,31,3,9,'#8fe1b7');F(-4,34,9,3,'#8fe1b7');F(-5,28,3,2,'#e9ddc8');
    }
    mark('grip',0,0);mark('tip',0,length);mark('head',0,length);
    g.restore();
  };
  const afterRig=M.afterRig;
  M.afterRig=function(id,rig,out){
    if(rig.variant!=='melee')return afterRig(id,rig,out);
    if(!rig.attacking||rig.elapsed<.08||rig.elapsed>.22||!out?.front||!out.tool.tip)return;
    g.save();g.globalAlpha=.22;line(out.front.x,out.front.y,out.tool.tip.x,out.tool.tip.y,M.weapons[id].color,3);g.restore();
  };
  M.audio.melee=function(id,moment){
    if(moment==='start')this.tone(id==='ruzio'?170:id==='pallo'?440:260,90,.055,'triangle',.018);
    else{this.tone(id==='ruzio'?125:190,55,.065,'triangle',.03);if(id==='marcelo')this.tone(900,450,.04,'square',.012);if(id==='pallo')this.tone(660,880,.06,'triangle',.012);}
  };
})();
