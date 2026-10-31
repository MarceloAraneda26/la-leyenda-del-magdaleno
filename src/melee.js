/* Armas de ataque básico: agarre compartido con el cuerpo, barrido físico
 * de la herramienta y un solo impacto por objetivo en cada ejecución. */
(() => {
  'use strict';
  const M=window.Magdaleno,g=M.ctx,{F,line,circle,poly}=M.draw;
  const duration=.30,rest={front:[.12,.20],psi:.77};
  M.weapons={
    marcelo:{name:'PC notebook',kind:'notebook',length:29,radius:13,color:'#7ab8f0',swing:.72},
    ruzio:{name:'Martillo de campo',kind:'field-hammer',length:30,radius:8,color:'#dfab6c',swing:.72},
    pulga:{name:'Regla de profesor',kind:'teacher-ruler',length:38,radius:5,color:'#e57985',swing:.67},
    tobi:{name:'Taladro minero',kind:'mining-drill',length:33,radius:8,color:'#97c3b0',swing:.77},
    pallo:{name:'Fonendoscopio',kind:'stethoscope',length:37,radius:6,color:'#be9be8',swing:.65}
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
      tool:{kind:'melee',weapon:id,psi,show:1,motion:attacking?t:0},attacking};
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
    if(w.kind==='notebook'){
      // Pantalla, bisagra y teclado: se sostiene del borde superior.
      F(-16,-2,32,25,'#162332');F(-15,-1,30,23,'#617b91');
      F(-13,2,26,17,'#173d61');F(-12,3,24,3,'#3977a5');
      F(-10,8,12,2,'#8ccee0');F(-10,12,18,1,'#5f9cba');F(-10,15,14,1,'#5f9cba');F(-1,-1,2,1,'#afc3cb');
      line(-15,22,15,22,'#0c1722',2);
      poly([[-16,23],[16,23],[20,30],[-12,30]],'#a4b7c2');
      poly([[-11,24],[13,24],[16,28],[-9,28]],'#354b60');
      for(let y=24;y<=27;y+=2)for(let x=-9;x<=11;x+=4)F(x,y,2,1,'#91a8b8');
      F(-3,28,8,1,'#e0e5dc');line(-12,31,20,31,'#26394c',2);
    }else if(w.kind==='field-hammer'){
      F(-3,-6,6,32,'#563d2a');F(-1,-4,2,28,'#ac8150');
      for(let y=1;y<15;y+=5)F(-3,y,6,2,'#392f29');
      F(-12,23,24,13,'#233545');F(-11,23,22,4,'#b1bec2');F(-12,31,24,5,'#536774');F(-13,25,3,9,'#d1d5cd');
    }else if(w.kind==='teacher-ruler'){
      F(-5,-9,10,49,'#85673c');F(-4,-8,8,47,'#e1c583');F(-4,-8,2,47,'#fae5ae');F(3,-8,1,47,'#bc9759');
      for(let y=-5;y<=37;y+=3)F(-3,y,y%9===4?5:3,1,'#665137');
      // Dígitos de la escala dibujados con píxeles, sin tipografía suavizada.
      F(1,3,1,4,'#665137');F(0,6,3,1,'#665137');
      F(0,13,3,1,'#665137');F(2,14,1,1,'#665137');F(0,15,3,1,'#665137');F(0,16,1,1,'#665137');F(0,17,3,1,'#665137');
      F(0,25,3,1,'#665137');F(2,26,1,3,'#665137');F(0,27,3,1,'#665137');F(0,29,3,1,'#665137');
      circle(0,-5,1,'#9b7a48');
    }else if(w.kind==='mining-drill'){
      // Taladro neumático amarillo, empuñadura lateral y broca de acero.
      F(-8,-5,16,5,'#253845');F(-5,-4,10,2,'#a4b6bc');F(-3,0,6,6,'#354754');
      F(-9,4,18,16,'#443d2e');F(-8,5,16,13,'#d5a039');F(-7,5,4,11,'#f5ca69');F(5,6,3,11,'#a6712c');
      F(-7,9,10,3,'#3d4850');F(-7,10,3,1,'#a7b1ab');
      line(-9,6,-13,9,'#263944',3);line(-13,9,-13,16,'#263944',3);line(-13,16,-8,17,'#263944',3);
      F(-5,19,10,4,'#516873');F(-3,22,6,8,'#b3c2c6');F(-2,30,4,3,'#8a9ea7');
      const shift=tool.motion>0?Math.floor(tool.motion*60)%2:0;
      for(let y=23+shift;y<31;y+=3)line(-3,y,3,y-2,'#526876',1);
      poly([[-2,32],[2,32],[0,35]],'#c9d3d2');
    }else if(w.kind==='stethoscope'){
      // Olivas y arcos metálicos, tubo flexible y diafragma de auscultación.
      line(-7,-7,-7,-2,'#b5c8ce',2);line(7,-7,7,-2,'#b5c8ce',2);
      line(-7,-2,-3,5,'#9cbbc2',2);line(7,-2,3,5,'#9cbbc2',2);
      F(-9,-9,4,4,'#243944');F(5,-9,4,4,'#243944');
      line(-3,5,0,9,'#355f6b',3);line(3,5,0,9,'#355f6b',3);
      const flex=tool.motion>0?Math.sin(tool.motion/duration*Math.PI*2)*4:0;
      const tube=[[0,9],[-8+flex,15],[-10+flex,25],[-5+flex,30],[5+flex,29],[9+flex,24],[8,32],[0,37]];
      for(let i=1;i<tube.length;i++){line(...tube[i-1],...tube[i],'#142d39',4);line(...tube[i-1],...tube[i],'#59909b',2);}
      circle(0,37,6,'#1d3442');circle(0,37,5,'#b5cbd1');circle(0,37,3,'#6e99a7');F(-2,34,3,1,'#e1e9df');
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
