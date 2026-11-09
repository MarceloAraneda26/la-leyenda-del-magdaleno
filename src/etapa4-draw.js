/* Etapa 4: figuras escolares, escenas de recuerdos, enemigos y Don Mario. Todo dibujado por código. */
(() => {'use strict';
const M=window.Magdaleno,E=window.Etapa4,D=E.draw={};
const C={pants:'#6c717a',pantsDark:'#53585f',sweater:'#1e2c4f',sweaterDark:'#16213d',shirt:'#e9e4d6',shoe:'#15171c',skin:'#c99c7c',skinDark:'#ad8063',burdeo:'#6e1f33',burdeoLight:'#8f2b44',blazer:'#1b2647',gold:'#d6b45f'};
D.C=C;
const R=(g,x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));};
const P=(g,pts,c)=>{g.fillStyle=c;g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill();};
const T=(g,s,x,y,size,c,align='center')=>{g.font='bold '+size+'px monospace';g.textAlign=align;g.fillStyle=c;g.fillText(s,Math.round(x),Math.round(y));g.textAlign='left';};
D.R=R;D.P=P;D.T=T;
// Cabeza recortada del sprite real: conserva la cara de cada amigo.
function spriteHead(g,id,w,dir){const img=M.images?.[id],b=M.bounds?.[id];if(!img||!b)return false;const sw=b.w*.62,sh=b.h*.25,sx=b.x+(b.w-sw)/2,sy=b.y,dh=w*sh/sw;g.save();if(dir<0)g.scale(-1,1);g.drawImage(img,sx,sy,sw,sh,-w/2,-dh,w,dh);g.restore();return dh;}
const generic=[['#c99c7c','#2d2420'],['#b58468','#191512'],['#d7ae8e','#5a3b24'],['#a8775c','#2a1f1a'],['#cfa184','#7a5233']];
/* Figura de 100 unidades de alto con los pies en (0,0). o: id, h, dir, t, walk, rot, outfit, collar, bandage, armUp, run, stiff, seed */
D.kid=function(g,x,y,o={}){const k=(o.h||100)/100,dir=o.dir||1,t=o.t||0,outfit=o.outfit||'uniform';const sp=o.run?16:9,sw=o.walk||o.run?Math.sin(t*sp+(o.seed||0)):0,swing=o.stiff?0:sw;
 g.save();g.translate(Math.round(x),Math.round(y));if(o.rot)g.rotate(o.rot);g.scale(k,k);
 const leg=outfit==='huaso'?'#1d1b1d':outfit==='china'?C.skin:outfit==='teacher'?'#5d5145':C.pants,legD=outfit==='huaso'?'#141214':outfit==='china'?C.skinDark:outfit==='teacher'?'#4b4137':C.pantsDark;
 // Piernas y zapatos.
 R(g,-11+swing*4,-40,9,34,leg);R(g,2-swing*4,-40,9,34,legD);
 if(outfit==='skirt'){R(g,-11+swing*4,-24,9,18,'#1b2238');R(g,2-swing*4,-24,9,18,'#1b2238');}
 R(g,-13+swing*4,-7,13,7,C.shoe);R(g,1-swing*4,-7,13,7,C.shoe);
 if(outfit==='huaso'){R(g,-12+swing*4,-20,11,14,'#2a2522');R(g,1-swing*4,-20,11,14,'#2a2522');R(g,-3+swing*4,-6,3,3,'#b9b4a6');}
 // Tronco según vestimenta.
 if(outfit==='huaso'){R(g,-15,-72,30,34,'#efe9db');P(g,[[-19,-71],[19,-71],[23,-44],[-23,-44]],'#9a2b2b');for(let i=0;i<4;i++)R(g,-21,-66+i*6,42,2,i%2?'#e2c98a':'#3c4b7a');R(g,-16,-42,32,4,'#2b2724');}
 else if(outfit==='china'){P(g,[[-14,-72],[14,-72],[16,-52],[-16,-52]],'#c5476a');P(g,[[-16,-52],[16,-52],[26,-30],[-26,-30]],'#e6c34f');for(let i=0;i<5;i++)R(g,-20+i*9,-44+(i%2)*6,4,4,'#c5476a');R(g,-15,-56,30,3,'#ffffff');}
 else if(outfit==='skirt'){R(g,-15,-72,30,32,C.blazer);P(g,[[-5,-72],[5,-72],[0,-58]],C.shirt);R(g,-1,-64,2,8,C.burdeo);P(g,[[-16,-42],[16,-42],[20,-24],[-20,-24]],C.burdeo);R(g,-18,-27,36,2,C.burdeoLight);}
 else if(outfit==='teacher'){R(g,-17,-76,34,38,'#6a4f3a');P(g,[[-6,-76],[6,-76],[0,-60]],'#e3ddce');R(g,-1,-70,2,10,'#3c4f6a');}
 else{R(g,-15,-72,30,32,C.sweater);R(g,-15,-44,30,4,C.sweaterDark);P(g,[[-6,-72],[6,-72],[0,-61]],C.shirt);}
 // Brazos.
 const sleeve=outfit==='huaso'?'#9a2b2b':outfit==='skirt'?C.blazer:outfit==='teacher'?'#6a4f3a':outfit==='china'?'#c5476a':C.sweater,top=outfit==='teacher'?-74:-70;
 g.save();g.translate(-15,top);g.rotate(o.armUp?-2.6:o.stiff?0:swing*.5);R(g,-6,0,7,26,sleeve);R(g,-6,26,7,6,C.skin);g.restore();
 g.save();g.translate(15,top);g.rotate(o.armUp?-2.4:o.armOut?-1.2:o.stiff?0:-swing*.5);R(g,-1,0,7,26,sleeve);R(g,-1,26,7,6,C.skin);if(o.bandage){R(g,-2,24,9,9,'#f1eee6');R(g,0,27,5,2,'#b23a3a');}if(o.hanky)R(g,-1,31,10,7,'#ffffff');g.restore();
 // Cuello ortopédico, bien notorio.
 let neck=-72;if(o.collar){R(g,-13,-86,26,15,'#e8dcc2');R(g,-13,-86,26,3,'#c9b994');R(g,-13,-74,26,3,'#c9b994');R(g,-2,-84,4,10,'#d6c6a3');neck=-85;}else R(g,-4,-76,8,5,C.skin);
 // Cabeza.
 g.save();g.translate(0,neck+2);const real=o.id&&spriteHead(g,o.id,32,dir);
 if(!real){const [skin,hair]=generic[(o.seed||0)%generic.length],adult=outfit==='teacher';R(g,-12,-30,24,28,skin);R(g,-13,-33,26,9,adult?'#7d7a74':hair);if((o.seed||0)%2&&!adult)R(g,-13,-28,5,14,hair);R(g,dir>0?3:-7,-18,3,3,'#1e1f24');R(g,dir>0?-5:-1,-18,3,3,'#1e1f24');R(g,-4,-9,8,2,'#7c4c45');if(adult)R(g,-10,-20,20,2,'#2b2b2b');}
 if(outfit==='huaso'){R(g,-24,-34-(real?2:0),48,5,'#d9c27a');R(g,-12,-46-(real?2:0),24,13,'#cdb46a');R(g,-12,-36-(real?2:0),24,3,'#2b2724');}
 g.restore();
 g.restore();};
// Marco de película para cada recuerdo.
D.frame=function(g,x,y,w,h,active){R(g,x-14,y-28,w+28,h+56,'#0d0d10');for(let i=0;i<Math.floor((w+28)/26);i++){R(g,x-6+i*26,y-21,13,10,active?'#d8cfb7':'#5b5a55');R(g,x-6+i*26,y+h+12,13,10,active?'#d8cfb7':'#5b5a55');}};
// Escenas: w=440, h=250, suelo en h-28. t avanza mientras el recuerdo está activo.
const S={};
S.tobi=(g,t,w,h)=>{const p=t%7,floor=h-28;R(g,0,0,w,h,C.burdeo);for(let i=0;i<11;i++)R(g,i*42,0,20,h-40,i%2?'#5a1829':'#7a2338');R(g,0,0,w,22,'#4a1322');for(let i=0;i<16;i++)P(g,[[i*28,22],[i*28+24,22],[i*28+12,38]],['#d33a3a','#f2efe6','#2f4a9a'][i%3]);R(g,0,floor-6,w,h-floor+6,'#7a5a3a');for(let i=0;i<12;i++)R(g,i*38,floor-6,2,h,'#5f442b');
 const couples=[{cx:110,id:null,seed:1},{cx:250,id:'tobi',seed:2},{cx:370,id:null,seed:3}];
 for(const c of couples){const a=t*2.2+c.cx,dx=Math.cos(a)*34,fall=c.id==='tobi'&&p>4.2;const sz=.85+Math.sin(a)*.08;
  D.kid(g,c.cx-dx,floor,{h:118*sz,outfit:'china',seed:c.seed+4,t,walk:true,dir:dx>0?1:-1,hanky:true});
  if(fall){const q=Math.min(1,(p-4.2)/.3),rot=q*1.55,up=p>6.2?Math.min(1,(p-6.2)/.6):0;D.kid(g,c.cx+30,floor-q*4,{id:'tobi',h:120,outfit:'huaso',rot:rot*(1-up),t:0,dir:1});if(p<5.2){for(let i=0;i<4;i++)R(g,c.cx+10+i*22,floor-8-((p*30+i*7)%16),10,6,'#c9b48ec0');T(g,'¡PLAF!',c.cx+50,floor-110,20,'#ffe39a');}}
  else D.kid(g,c.cx+dx,floor,{id:c.id,h:(c.id?122:116)*sz,outfit:'huaso',seed:c.seed,t,walk:true,dir:dx>0?-1:1,hanky:true});}};
S.marcelo=(g,t,w,h)=>{const p=t%6.5,floor=h-28;R(g,0,0,w,h,'#18233a');for(let r=0;r<5;r++){R(g,0,40+r*22,w,20,r%2?'#2a3448':'#323d52');for(let i=0;i<40;i++)R(g,(i*37+r*13)%w,44+r*22,5,7,['#c94c4c','#e6e0cf','#3c6bb0','#d7b25a'][(i+r)%4]);}
 R(g,30,10,8,40,'#9aa3ad');R(g,14,4,40,12,'#f4f0d0');R(g,0,floor-4,w,h,'#3d6b3a');R(g,0,floor-4,w,4,'#e8e6dc');
 const fx=230;for(let i=0;i<9;i++){R(g,fx-60+i*15,floor-150,4,150,'#8d949c');P(g,[[fx-62+i*15,floor-150],[fx-54+i*15,floor-150],[fx-58+i*15,floor-162]],'#8d949c');}R(g,fx-62,floor-148,124,4,'#6e757d');R(g,fx-62,floor-80,124,4,'#6e757d');
 let x,y,rot=0,armUp=false,band=false;if(p<1.2){x=60+p*80;y=floor;}else if(p<2.7){x=fx-70;y=floor-(p-1.2)/1.5*130;armUp=true;}else if(p<3.3){const q=(p-2.7)/.6;x=fx-70+q*140;y=floor-130-Math.sin(q*Math.PI)*30+q*0;armUp=true;}else if(p<3.6){const q=(p-3.3)/.3;x=fx+70;y=floor-130+q*130;}else{x=fx+70;y=floor;band=true;}
 D.kid(g,x,y,{id:'marcelo',h:122,t,walk:p<1.2,dir:1,armUp,bandage:band||p>3.3,rot});
 if(p>3.3&&p<4.3){for(let i=0;i<3;i++)R(g,x+16+i*6,y-40+((p-3.3)*60+i*9)%40,4,5,'#b4232f');T(g,'¡AU!',x+30,y-140,22,'#ffe39a');}};
S.pallo=(g,t,w,h)=>{const p=t%5.5,floor=h-28,shake=p<4.6?Math.sin(t*46)*4:0;g.save();g.translate(shake,Math.cos(t*39)*2);
 R(g,-10,0,w+20,h,'#d8cfb8');R(g,-10,h-90,w+20,62,C.burdeo);R(g,70,30,220,90,'#2f4a3a');R(g,70,30,220,6,'#6b5a42');g.strokeStyle='#e9eadf';g.lineWidth=2;g.beginPath();g.moveTo(90,60);g.lineTo(150,58);g.moveTo(90,80);g.lineTo(190,84);g.stroke();T(g,'2 + 2 =',210,72,14,'#e9eadf');
 const lamp=Math.sin(t*6)*.4;g.save();g.translate(360,0);g.rotate(lamp);R(g,-1,0,3,40,'#3b3b3b');R(g,-14,40,28,10,'#e9d58f');g.restore();
 R(g,-10,floor-4,w+20,h,'#8a6f50');for(let i=0;i<3;i++){R(g,40+i*140,floor-46,90,8,'#9a7a52');R(g,48+i*140,floor-38,6,38,'#6f5536');R(g,122+i*140,floor-38,6,38,'#6f5536');}g.restore();
 D.kid(g,((p*120)%560)-40,floor,{seed:2,h:108,t,run:true,dir:1});D.kid(g,((p*120+180)%560)-40,floor,{seed:5,h:110,t,run:true,dir:1});
 D.kid(g,-60+p*105,floor,{id:'pallo',h:124,t,run:true,stiff:true,collar:true,dir:1});if(p<4.6)T(g,'¡TEMBLOR!',w/2,24,22,'#b4232f');};
S.ruzio=(g,t,w,h)=>{const p=t%6.5,floor=h-28;R(g,0,0,w,h,'#cfdccb');for(let i=0;i<14;i++)for(let j=0;j<6;j++)R(g,i*32+(j%2)*16,j*26,30,24,(i+j)%2?'#c3d2bf':'#d7e2d2');R(g,0,h-96,w,68,C.burdeo);T(g,'CASINO',w-70,28,14,'#6e1f33');
 R(g,0,floor-4,w,h,'#9b8a72');R(g,40,floor-62,300,10,'#b88d5c');R(g,50,floor-52,6,48,'#7b5c3a');R(g,324,floor-52,6,48,'#7b5c3a');for(let i=0;i<5;i++){R(g,60+i*56,floor-70,34,8,'#eeeeee');R(g,64+i*56,floor-72,26,4,'#7a4e2b');}
 const chairX=250,hitC=p>3.1;g.save();g.translate(chairX,floor);if(hitC)g.rotate(Math.min(1.3,(p-3.1)*4));R(g,-12,-40,24,6,'#7b5c3a');R(g,-12,-40,4,40,'#7b5c3a');R(g,8,-40,4,40,'#7b5c3a');R(g,-12,-70,4,34,'#7b5c3a');g.restore();
 const x=30+p*62,wob=Math.sin(t*3.2)*16,rot=Math.sin(t*4.1)*.28;D.kid(g,x,floor+wob*.15,{id:'ruzio',h:122,t,walk:true,rot,dir:Math.sin(t*1.7)>-.6?1:-1});
 T(g,'hic',x+40+Math.sin(t*5)*6,floor-150-(t*20%30),16,'#f0e6c8');if(p>3.1&&p<3.8)T(g,'¡CLONK!',chairX,floor-100,18,'#b4232f');};
S.pulga=(g,t,w,h)=>{const p=t%7,floor=h-28;R(g,0,0,w,h,'#8fb4cf');R(g,0,40,w,110,C.burdeo);for(let i=0;i<8;i++)R(g,20+i*55,60,30,34,'#e3d9c3');R(g,0,140,w,10,'#4d1424');R(g,370,20,14,120,'#5b4330');for(let i=0;i<5;i++)R(g,340+i*12,10+((i*17)%30),46,30,'#3f6b3b');R(g,0,floor-6,w,h,'#a7a39a');
 let x,rot=0,lie=false;if(p<2.4){x=40+p*90;}else{x=40+2.4*90+Math.min(.3,p-2.4)*60;const q=Math.min(1,(p-2.4)/.3);rot=-q*1.57;lie=true;}
 // Otros niños se cruzan justo en el momento del choque.
 const cx=p<2.4?420-p*100:180+Math.max(0,p-2.4)*-20;D.kid(g,p<2.4?20+p*90-70:150,floor,{seed:1,h:108,t,run:p<2.4,dir:1});D.kid(g,cx,floor,{seed:3,h:110,t,run:p<2.4,dir:-1,rot:p>2.4?.25:0});D.kid(g,cx+30,floor,{seed:4,h:104,t,run:p<2.4,dir:-1});
 D.kid(g,x,floor,{id:'pulga',h:120,t,run:!lie,dir:1,rot});
 if(p>2.35&&p<3)T(g,'¡PUM!',x+10,floor-140,24,'#ffe39a');if(lie){for(let i=0;i<3;i++){const a=t*4+i*2.1;T(g,'*',x+56+Math.cos(a)*22,floor-30+Math.sin(a)*8,18,'#ffe39a');}if(p>4)for(let i=0;i<3;i++)D.kid(g,x-30+i*55,floor,{seed:i+6,h:104,dir:i?-1:1});}};
S.cote=(g,t,w,h)=>{const floor=h-28;R(g,0,0,w,h,'#9cc0d8');R(g,0,70,w,80,'#c9c1ae');for(let i=0;i<9;i++)R(g,10+i*50,82,28,40,'#8fa6b8');R(g,0,150,w,10,'#9b9584');for(let i=0;i<30;i++)R(g,(i*16)%w,floor-60+(i%3)*4,10,14,['#3c4b6b','#7c3b3b','#5b6b4b'][i%3]);R(g,0,floor-6,w,h,'#7c7a75');for(let i=0;i<10;i++)R(g,i*48,floor+6,24,4,'#e8e3d4');
 const bob=Math.abs(Math.sin(t*5))*-4,x=170+Math.sin(t*.7)*10;
 for(let i=0;i<3;i++)D.kid(g,x-90-i*60,floor+bob,{seed:i+1,h:108,t,walk:true,dir:1});
 // Estandarte burdeo con flecos dorados, movido por el viento.
 const px=x+18,top=floor-210;R(g,px,top,4,170,'#c9b37a');R(g,px-2,top-8,8,8,C.gold);const wave=i=>Math.sin(t*4+i*.6)*6;const pts=[];for(let i=0;i<=8;i++)pts.push([px+4+i*11,top+6+wave(i)]);for(let i=8;i>=0;i--)pts.push([px+4+i*11,top+78+wave(i)]);P(g,pts,C.burdeo);for(let i=0;i<9;i++)R(g,px+4+i*11,top+78+wave(i),8,6,C.gold);T(g,'COLEGIO',px+48,top+42+wave(4),12,'#e8d9a8');
 D.kid(g,x,floor+bob,{id:'cote',h:124,t,walk:true,outfit:'skirt',dir:1,armOut:true});};
D.scene=function(g,id,t,x,y,w,h,active){g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.translate(x,y);S[id](g,t,w,h);
 // Tono de recuerdo: cálido y con viñeta.
 g.fillStyle=active?'#ffd9a014':'#0c1620a0';g.fillRect(0,0,w,h);const v=g.createRadialGradient(w/2,h/2,h*.35,w/2,h/2,w*.62);v.addColorStop(0,'#00000000');v.addColorStop(1,'#000000a0');g.fillStyle=v;g.fillRect(0,0,w,h);g.restore();};
// Enemigos de la parte 4: caricaturas que huyen al ser derrotadas.
D.pastero=function(g,x,y,o){const t=o.t||0,dir=o.dir||1,sw=o.walk?Math.sin(t*9):0;g.save();g.translate(Math.round(x),Math.round(y));g.scale(dir,1);if(o.hurt)g.globalAlpha=.6+Math.sin(t*60)*.4;
 R(g,-10+sw*4,-46,8,40,'#4e5a6b');R(g,2-sw*4,-46,8,40,'#465163');R(g,-12+sw*4,-7,12,7,'#d6d2c8');R(g,1-sw*4,-7,12,7,'#d6d2c8');
 g.save();g.rotate(.12);R(g,-14,-88,28,44,'#5d6166');R(g,-14,-60,28,4,'#4b4f54');R(g,-6,-70,12,8,'#4b4f54');g.restore();
 g.save();g.translate(12,-84);g.rotate(o.wind?-2.2:o.strike?-1.2:sw*.4+.2);R(g,-3,0,7,30,'#5d6166');R(g,-3,30,7,6,'#b99a86');g.restore();
 R(g,-10,-112,22,24,'#b99a86');R(g,-13,-118,28,14,'#55595e');R(g,-13,-108,6,20,'#55595e');R(g,4,-102,3,3,'#1d1d1d');R(g,0,-94,8,2,'#6d4a43');R(g,-4,-99,3,2,'#8d6d63');if(o.wind)T(g,'!',0,-128,20,'#ffe39a');g.restore();};
D.sapa=function(g,x,y,o){const t=o.t||0,dir=o.dir||1,sw=o.walk?Math.sin(t*8):0;g.save();g.translate(Math.round(x),Math.round(y));g.scale(dir,1);if(o.hurt)g.globalAlpha=.6+Math.sin(t*60)*.4;
 R(g,-10+sw*3,-26,8,20,'#c99c7c');R(g,2-sw*3,-26,8,20,'#c99c7c');R(g,-13+sw*3,-6,13,6,'#d985a8');R(g,1-sw*3,-6,13,6,'#d985a8');
 P(g,[[-16,-82],[16,-82],[22,-24],[-22,-24]],'#8fb7d6');for(let i=0;i<6;i++)R(g,-16+i*6,-74+(i%3)*14,4,4,'#e6eef4');R(g,-14,-56,28,22,'#e9e1d0');
 g.save();g.translate(14,-78);g.rotate(o.throw?-2:.3);R(g,-3,0,7,26,'#8fb7d6');R(g,-3,26,7,6,'#c99c7c');g.restore();R(g,-20,-78,7,24,'#8fb7d6');
 R(g,-11,-106,22,24,'#c99c7c');R(g,-13,-112,26,10,'#9b9895');for(let i=0;i<4;i++)R(g,-13+i*7,-118,6,7,['#e57b9b','#7bc1e5','#e5d27b','#9be57b'][i]);R(g,3,-98,3,3,'#1d1d1d');R(g,-4,-98,3,3,'#1d1d1d');R(g,-6,-102,6,1,'#5a4a42');R(g,-3,-89,10,3,'#8a3d3d');g.restore();};
// Don Mario: 50 a 60 años, pelo canoso largo y ondulado, barba gris, polera gris sin mangas y short rojo.
D.mario=function(g,x,y,o={}){const k=(o.h||150)/150,t=o.t||0;g.save();g.translate(Math.round(x),Math.round(y));g.scale(k*(o.dir||1),k);
 R(g,-14,-52,11,44,'#c49473');R(g,4,-52,11,44,'#c49473');R(g,-16,-8,15,8,'#3a3330');R(g,3,-8,15,8,'#3a3330');
 R(g,-18,-76,37,26,'#c8323a');R(g,-18,-60,37,4,'#a8282f');R(g,-2,-76,3,20,'#a8282f');
 R(g,-20,-124,40,50,'#8d9196');R(g,-20,-124,40,6,'#7c8085');R(g,-12,-124,24,8,'#c49473');
 const arm=o.wave?Math.sin(t*6)*.5-1.4:0;g.save();g.translate(-25,-120);R(g,0,0,8,40,'#c49473');R(g,0,40,8,8,'#b4846a');g.restore();g.save();g.translate(20,-120);g.rotate(arm);R(g,0,0,8,40,'#c49473');R(g,0,40,8,8,'#b4846a');if(o.bottle){R(g,-2,44,12,26,'#5a2a18');R(g,1,36,6,10,'#5a2a18');R(g,0,52,10,8,'#e6d29a');}g.restore();
 for(let i=0;i<7;i++){const wv=Math.sin(t*2+i*1.3)*1.5+(i%2?2:0);R(g,-21-wv,-160+i*7,8,9,i%2?'#cfccc6':'#dedcd7');R(g,13+wv,-160+i*7,8,9,i%2?'#dedcd7':'#cfccc6');}
 R(g,-14,-160,28,34,'#c49473');R(g,-16,-168,32,9,'#e0ded9');R(g,-12,-171,10,4,'#d3d0ca');R(g,2,-171,11,4,'#d3d0ca');R(g,-15,-160,6,6,'#d6d4cf');R(g,9,-160,6,6,'#d6d4cf');
 R(g,-9,-152,7,2,'#bdbab4');R(g,3,-152,7,2,'#bdbab4');R(g,-7,-148,4,4,'#1d1d1d');R(g,4,-148,4,4,'#1d1d1d');R(g,-1,-146,3,7,'#ad8064');
 R(g,-11,-139,22,4,'#a9a6a0');R(g,-13,-136,26,12,'#bcb9b3');R(g,-10,-124,20,6,'#bcb9b3');R(g,-6,-118,12,4,'#a9a6a0');R(g,-4,-134,8,3,'#7b4b45');g.restore();};
// Retrato de diálogo de 96 px.
D.portrait=function(c,id){const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,96,96);g.fillStyle='#203748';g.fillRect(0,0,96,96);const img=M.images[id],b=M.bounds[id];
 if(img&&b){const sw=b.w*.64,sh=b.h*.34,k=Math.min(88/sw,90/sh);g.drawImage(img,b.x+(b.w-sw)/2,b.y,sw,sh,(96-sw*k)/2,96-sh*k,sw*k,sh*k);return;}
 if(id==='mario'){g.save();g.translate(48,190);g.scale(1.25,1.25);D.mario(g,0,0,{h:150});g.restore();return;}
 if(id==='camanchaca'){for(let i=0;i<7;i++){g.fillStyle=['#82979d','#9daaad','#aeb8b6'][i%3];g.fillRect(6+i%3*3,12+i*9,75-i%2*12,12);}g.fillStyle='#dce0cc';g.fillRect(21,30,9,6);g.fillRect(63,30,9,6);}};
})();
