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
// En los recuerdos del colegio los amigos tienen su misma cara, pero sin barba (decisión del usuario, 2026-11-09).
// Zona de barba en coordenadas del recorte de la cabeza: fila inicial, columnas y, si hace falta, una boca simple [fila, desde, hasta].
const BEARD={marcelo:{y:27,x:[10,37],mouth:[30,20,28]},ruzio:{y:27,x:[9,37],mouth:[30,21,31],k:.97},pulga:{y:27,x:[6,28]},tobi:{y:23,x:[8,38]},pallo:{y:26,x:[9,29],mouth:[30,15,21],k:.97}};
const heads={};
function headCrop(id){const img=M.images?.[id],b=M.bounds?.[id];if(!img||!b||!img.complete||!img.naturalWidth)return null;if(heads[id])return heads[id];
 const sw=Math.ceil(b.w*.62),sh=Math.round(b.h*.25),sx=Math.round(b.x+(b.w-b.w*.62)/2),sy=b.y,cv=document.createElement('canvas');cv.width=sw;cv.height=sh;const c=cv.getContext('2d');c.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);
 const skin=skinOf(c,sw,sh),cfg=BEARD[id];if(cfg)try{shave(c,sw,sh,cfg);}catch{}return heads[id]={cv,sw,sh,...skin};}
// Piel de la cara: percentil 40 de los pixeles de tono piel en el centro del rostro.
function skinOf(c,w,h){try{const d=c.getImageData(0,0,w,h).data,px=[];for(let y=Math.round(h*.4);y<h*.75;y++)for(let x=Math.round(w*.3);x<w*.7;x++){const i=(y*w+x)*4;if(d[i+3]>200&&d[i]>d[i+1]&&d[i+1]>d[i+2]&&d[i]>150)px.push([.3*d[i]+.59*d[i+1]+.11*d[i+2],d[i],d[i+1],d[i+2]]);}
 if(px.length<8)return{};px.sort((a,b)=>a[0]-b[0]);const [,r,g,b]=px[Math.floor(px.length*.4)],hex=(r,g,b)=>'#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');return{skin:hex(r,g,b),skinDark:hex(r*.86,g*.84,b*.84)};}catch{return{};}}
// Contextura escolar de cada amigo según su ficha y su sprite: ancho de tronco (w), de hombros (sh), guata, grosor de brazos y piernas.
// Marcelo robusto, Tobi de hombros anchos, Ruzio de rostro y cuerpo redondeado, Pallo intermedio, Pulga delgado. Coté conserva su figura.
const KID_BUILD={_:{w:30,sh:30,belly:0,arm:7,leg:9},marcelo:{w:36,sh:36,belly:3,arm:8,leg:10},tobi:{w:31,sh:38,belly:0,arm:8,leg:10},ruzio:{w:34,sh:33,belly:2,arm:8,leg:10},pallo:{w:28,sh:29,belly:0,arm:7,leg:9},pulga:{w:24,sh:26,belly:0,arm:6,leg:7},cote:{w:30,sh:30,belly:0,arm:7,leg:9}};
function shave(c,w,h,cfg){const im=c.getImageData(0,0,w,h),d=im.data,at=(x,y)=>(y*w+x)*4,lum=i=>.3*d[i]+.59*d[i+1]+.11*d[i+2],alpha=(x,y)=>x<0||x>=w||y<0||y>=h?0:d[at(x,y)+3];
 // Piel de referencia: mejillas sobre la barba.
 const cand=[];for(let y=Math.max(0,cfg.y-7);y<cfg.y-1;y++)for(let x=cfg.x[0];x<=cfg.x[1];x++){const i=at(x,y);if(d[i+3]>200&&d[i]>d[i+1]&&d[i+1]>d[i+2]&&d[i]>150)cand.push([lum(i),d[i],d[i+1],d[i+2]]);}
 if(!cand.length)return;cand.sort((a,b)=>a[0]-b[0]);const skin=cand[Math.floor(cand.length*.6)],sl=skin[0],k=cfg.k||.8;
 const teeth=i=>lum(i)>200&&Math.abs(d[i]-d[i+2])<40,red=i=>d[i]>d[i+1]+55&&d[i]>130,dark=i=>lum(i)<sl*k;
 const near=(x,y,fn)=>{for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const X=x+dx,Y=y+dy;if(X>=0&&X<w&&Y>=0&&Y<h&&d[at(X,Y)+3]>0&&fn(at(X,Y)))return true;}return false;};
 const out=[];for(let y=cfg.y;y<h;y++)for(let x=cfg.x[0];x<=cfg.x[1];x++){const i=at(x,y);if(d[i+3]<40||teeth(i)||red(i)||!dark(i)||near(x,y,teeth))continue;
  const edge=!alpha(x-1,y)||!alpha(x+1,y)||!alpha(x,y+1);const low=!alpha(x,y+2)||y>=h-2;out.push([i,edge?[43,26,18]:low?[skin[1]*.86,skin[2]*.84,skin[3]*.84]:[skin[1],skin[2],skin[3]]]);}
 for(const [i,col] of out){d[i]=col[0];d[i+1]=col[1];d[i+2]=col[2];d[i+3]=255;}
 if(cfg.mouth){const [y,x0,x1]=cfg.mouth;for(let x=x0;x<=x1;x++){const i=at(x,y);if(d[i+3]>0){d[i]=122;d[i+1]=58;d[i+2]=46;}}}
 c.putImageData(im,0,0);}
D.headCrop=headCrop;
function spriteHead(g,id,w,dir){const hc=headCrop(id);if(!hc)return false;const dh=w*hc.sh/hc.sw;g.save();if(dir<0)g.scale(-1,1);g.drawImage(hc.cv,0,0,hc.sw,hc.sh,-w/2,-dh,w,dh);g.restore();return dh;}
const generic=[['#c99c7c','#2d2420'],['#b58468','#191512'],['#d7ae8e','#5a3b24'],['#a8775c','#2a1f1a'],['#cfa184','#7a5233']];
/* Figura de 100 unidades de alto con los pies en (0,0). o: id, h, dir, t, walk, rot, outfit, collar, bandage, armUp, run, stiff, seed */
D.kid=function(g,x,y,o={}){const k=(o.h||100)/100,dir=o.dir||1,t=o.t||0,outfit=o.outfit||'uniform';const sp=o.run?16:9,sw=o.walk||o.run?Math.sin(t*sp+(o.seed||0)):0,swing=o.stiff?0:sw;
 g.save();g.translate(Math.round(x),Math.round(y));if(o.rot)g.rotate(o.rot);g.scale(k,k);
 const B=KID_BUILD[o.id]||KID_BUILD._,hw=B.w/2,sh2=B.sh/2,hc=o.id?headCrop(o.id):null,sk=hc?.skin||C.skin,skD=hc?.skinDark||C.skinDark,lg=B.leg;
 const leg=outfit==='huaso'?'#1d1b1d':outfit==='china'?C.skin:outfit==='teacher'?'#5d5145':C.pants,legD=outfit==='huaso'?'#141214':outfit==='china'?C.skinDark:outfit==='teacher'?'#4b4137':C.pantsDark;
 // Piernas y zapatos.
 R(g,-2-lg+swing*4,-40,lg,34,leg);R(g,2-swing*4,-40,lg,34,legD);
 if(outfit==='skirt'){R(g,-2-lg+swing*4,-24,lg,18,'#1b2238');R(g,2-swing*4,-24,lg,18,'#1b2238');}
 R(g,-4-lg+swing*4,-7,lg+4,7,C.shoe);R(g,1-swing*4,-7,lg+4,7,C.shoe);
 if(outfit==='huaso'){R(g,-12+swing*4,-20,11,14,'#2a2522');R(g,1-swing*4,-20,11,14,'#2a2522');R(g,-3+swing*4,-6,3,3,'#b9b4a6');}
 // Tronco según vestimenta.
 if(outfit==='huaso'){R(g,-hw,-72,B.w,34,'#efe9db');P(g,[[-sh2-4,-71],[sh2+4,-71],[hw+8,-44],[-hw-8,-44]],'#9a2b2b');for(let i=0;i<4;i++)R(g,-hw-6,-66+i*6,B.w+12,2,i%2?'#e2c98a':'#3c4b7a');R(g,-hw-1,-42,B.w+2,4,'#2b2724');}
 else if(outfit==='china'){P(g,[[-14,-72],[14,-72],[16,-52],[-16,-52]],'#c5476a');P(g,[[-16,-52],[16,-52],[26,-30],[-26,-30]],'#e6c34f');for(let i=0;i<5;i++)R(g,-20+i*9,-44+(i%2)*6,4,4,'#c5476a');R(g,-15,-56,30,3,'#ffffff');}
 else if(outfit==='skirt'){R(g,-hw,-72,B.w,32,C.blazer);P(g,[[-5,-72],[5,-72],[0,-58]],C.shirt);R(g,-1,-64,2,8,C.burdeo);P(g,[[-16,-42],[16,-42],[20,-24],[-20,-24]],C.burdeo);R(g,-18,-27,36,2,C.burdeoLight);}
 else if(outfit==='teacher'){R(g,-17,-76,34,38,'#6a4f3a');P(g,[[-6,-76],[6,-76],[0,-60]],'#e3ddce');R(g,-1,-70,2,10,'#3c4f6a');}
 else{const bl=B.belly;P(g,[[-sh2,-72],[sh2,-72],[hw+bl,-54],[hw+bl,-46],[hw,-40],[-hw,-40],[-hw-bl,-46],[-hw-bl,-54]],C.sweater);P(g,[[-sh2,-72],[-sh2+4,-72],[-hw-bl+4,-50],[-hw+3,-40],[-hw,-40],[-hw-bl,-46],[-hw-bl,-54]],C.sweaterDark);R(g,-hw,-44,B.w,4,C.sweaterDark);P(g,[[-6,-72],[6,-72],[0,-61]],C.shirt);}
 // Brazos.
 const sleeve=outfit==='huaso'?'#9a2b2b':outfit==='skirt'?C.blazer:outfit==='teacher'?'#6a4f3a':outfit==='china'?'#c5476a':C.sweater,top=outfit==='teacher'?-74:-70;
 const aw=B.arm,ax=outfit==='teacher'?15:Math.max(sh2,hw+B.belly-2);
 g.save();g.translate(-ax,top);g.rotate(o.armUp?-2.6:o.stiff?0:swing*.5);R(g,1-aw,0,aw,26,sleeve);R(g,1-aw,26,aw,6,sk);if(o.id==='ruzio'){R(g,1-aw,24,aw,2,'#2b2b2b');R(g,1-aw,22,aw,1,'#8a5a3a');}g.restore();
 g.save();g.translate(ax,top);g.rotate(o.armUp?-2.4:o.armOut?-1.2:o.stiff?0:-swing*.5);R(g,-1,0,aw,26,sleeve);R(g,-1,26,aw,6,sk);if(o.bandage){R(g,-2,24,9,9,'#f1eee6');R(g,0,27,5,2,'#b23a3a');}if(o.hanky)R(g,-1,31,10,7,'#ffffff');g.restore();
 // Cuello ortopédico, bien notorio.
 let neck=-72;if(o.collar){R(g,-13,-86,26,15,'#e8dcc2');R(g,-13,-86,26,3,'#c9b994');R(g,-13,-74,26,3,'#c9b994');R(g,-2,-84,4,10,'#d6c6a3');neck=-85;}else R(g,-4,-76,8,5,o.id?skD:C.skin);
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
 // Reja y salto dimensionados para que Marcelo quede dentro del cuadro en todo el salto.
 const fx=230;for(let i=0;i<9;i++){R(g,fx-60+i*15,floor-90,4,90,'#8d949c');P(g,[[fx-62+i*15,floor-90],[fx-54+i*15,floor-90],[fx-58+i*15,floor-100]],'#8d949c');}R(g,fx-62,floor-88,124,4,'#6e757d');R(g,fx-62,floor-46,124,4,'#6e757d');
 let x,y,rot=0,armUp=false,band=false;if(p<1.2){x=60+p*80;y=floor;}else if(p<2.7){x=fx-70;y=floor-(p-1.2)/1.5*88;armUp=true;}else if(p<3.3){const q=(p-2.7)/.6;x=fx-70+q*140;y=floor-88-Math.sin(q*Math.PI)*18;armUp=true;}else if(p<3.6){const q=(p-3.3)/.3;x=fx+70;y=floor-88+q*88;}else{x=fx+70;y=floor;band=true;}
 D.kid(g,x,y,{id:'marcelo',h:104,t,walk:p<1.2,dir:1,armUp,bandage:band||p>3.3,rot});
 if(p>3.3&&p<4.3){for(let i=0;i<3;i++)R(g,x+16+i*6,y-40+((p-3.3)*60+i*9)%40,4,5,'#b4232f');T(g,'¡AU!',x+34,y-120,22,'#ffe39a');}};
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
// Se dibujan dos veces: primero la silueta en tinta desplazada 2 px (contorno, como los sprites de los amigos) y luego los colores con su sombra.
const INK='#15121b';
function outlined(g,draw){for(const [dx,dy] of [[-2,0],[2,0],[0,-2],[0,2]]){g.save();g.translate(dx,dy);draw(()=>INK);g.restore();}draw(c=>c);}
function limb(g,x,y,ang,draw){g.save();g.translate(x,y);g.rotate(ang);draw();g.restore();}
// Pastero: polerón gris con capucha, jeans gastados y zapatillas. Al preparar el golpe echa el brazo atrás; al golpear lo lanza al frente.
D.pastero=function(g,x,y,o){const t=o.t||0,dir=o.dir||1,sw=o.walk?Math.sin(t*9):0,bob=o.walk?Math.abs(Math.sin(t*9))*2:Math.sin(t*2)*.8;
 g.save();g.translate(Math.round(x),Math.round(y));g.scale(dir,1);if(o.hurt)g.globalAlpha=.6+Math.sin(t*60)*.4;
 const front=o.wind?2.5:o.strike?-1.55:sw*.45+.15,back=o.strike?.5:-sw*.45+.1;
 outlined(g,c=>{
  // Brazo de atrás.
  limb(g,-8,-86+bob,back,()=>{R(g,-4,0,8,28,c('#55595e'));R(g,-4,28,8,7,c('#a3826f'));});
  // Piernas y zapatillas.
  for(const [lx,col,sh] of [[1-sw*4,'#3f4a5c','#36404f'],[-10+sw*4,'#4e5a6b','#434e5d']]){R(g,lx,-48,10,42,c(col));R(g,lx+7,-48,3,42,c(sh));R(g,lx-2,-8,14,6,c('#e2ddd2'));R(g,lx-2,-2,14,2,c('#8a8780'));}
  // Polerón.
  g.save();g.translate(0,bob);
  P(g,[[-15,-92],[14,-92],[17,-46],[-17,-46]],c('#6a6e73'));P(g,[[-15,-92],[-8,-92],[-10,-46],[-17,-46]],c('#55595e'));
  R(g,-17,-50,34,4,c('#4b4f54'));R(g,-9,-66,20,10,c('#5d6166'));R(g,-9,-66,20,2,c('#4b4f54'));R(g,0,-90,2,12,c('#d6d2c8'));R(g,5,-90,2,10,c('#d6d2c8'));
  // Capucha y cara en sombra.
  R(g,-13,-120,28,32,c('#62666b'));R(g,-10,-123,22,4,c('#62666b'));R(g,-13,-120,6,32,c('#4f5358'));
  R(g,-1,-114,15,22,c('#b99a86'));R(g,-1,-114,15,5,c('#7d6658'));R(g,12,-116,4,26,c('#4b4f54'));
  R(g,7,-107,3,3,c('#1d1d1d'));R(g,3,-108,7,1,c('#4a3a33'));R(g,4,-98,8,2,c('#6d4a43'));R(g,2,-101,3,4,c('#a3826f'));
  g.restore();
  // Brazo de adelante con puño.
  limb(g,9,-86+bob,front,()=>{R(g,-4,0,9,30,c('#6a6e73'));R(g,3,0,2,30,c('#575b60'));R(g,-4,26,9,4,c('#4b4f54'));R(g,-4,30,9,8,c('#b99a86'));R(g,-4,36,9,2,c('#a3826f'));});
 });
 if(o.strike){g.globalAlpha=.8;for(let i=0;i<3;i++)R(g,40+i*4,-92+i*8,14-i*3,2,'#ffe9b0');g.globalAlpha=1;}
 if(o.wind)T(g,'!',2,-132,20,'#ffe39a');g.restore();};
// Vieja sapa: bata celeste con lunares, delantal, rulos de colores, lentes y cartera. Al preparar el chisme echa el brazo atrás con el papel.
D.sapa=function(g,x,y,o){const t=o.t||0,dir=o.dir||1,sw=o.walk?Math.sin(t*8):0,bob=o.walk?Math.abs(Math.sin(t*8))*1.5:Math.sin(t*2.4)*.8;
 g.save();g.translate(Math.round(x),Math.round(y));g.scale(dir,1);if(o.hurt)g.globalAlpha=.6+Math.sin(t*60)*.4;
 const front=o.wind?2.7:o.throw?-2.1:sw*.3+.25,talk=o.wind||o.throw||Math.sin(t*7)>.6;
 outlined(g,c=>{
  // Brazo de atrás con la cartera.
  limb(g,-12,-80+bob,sw*.3-.05,()=>{R(g,-3,0,8,24,c('#7aa3c4'));R(g,-3,24,8,5,c('#b88a6c'));R(g,-9,25,16,13,c('#8a5a3a'));R(g,-9,25,16,3,c('#6a4028'));R(g,-1,30,3,3,c('#d6b45f'));});
  // Piernas con medias y zapatos.
  for(const [lx,sk] of [[2-sw*3,'#c8a68a'],[-9+sw*3,'#d8b89a']]){R(g,lx,-28,8,22,c(sk));R(g,lx-2,-6,12,6,c('#7a3b4f'));R(g,lx-2,-1,12,1,c('#4e2433'));}
  g.save();g.translate(0,bob);
  // Bata, lunares y delantal.
  P(g,[[-15,-86],[15,-86],[22,-26],[-22,-26]],c('#8fb7d6'));P(g,[[-15,-86],[-8,-86],[-13,-26],[-22,-26]],c('#7aa3c4'));R(g,-22,-30,44,4,c('#6f97b8'));
  for(let i=0;i<7;i++)R(g,-14+i*5,-80+(i%3)*16,3,3,c('#e6eef4'));
  P(g,[[-11,-64],[12,-64],[15,-33],[-14,-33]],c('#efe8d8'));P(g,[[-11,-64],[-6,-64],[-8,-33],[-14,-33]],c('#ddd3bf'));R(g,-6,-50,13,8,c('#ddd3bf'));R(g,-8,-84,3,20,c('#efe8d8'));R(g,6,-84,3,20,c('#efe8d8'));
  // Cabeza: rulos, pelo canoso, lentes y boca.
  R(g,-4,-91,8,6,c('#b88a6c'));R(g,-11,-112,22,23,c('#c99c7c'));R(g,-11,-112,5,23,c('#ad8063'));R(g,5,-99,5,3,c('#d98a8a'));
  R(g,-13,-118,26,9,c('#b3b0ab'));R(g,-13,-112,6,15,c('#b3b0ab'));R(g,-13,-118,26,2,c('#d0cdc8'));
  ['#e57b9b','#7bc1e5','#e5d27b','#9be57b'].forEach((col,i)=>{R(g,-13+i*7,-125,6,8,c(col));R(g,-12+i*7,-124,2,6,c('#ffffff88'));});
  R(g,1,-105,10,7,c('#3a3030'));R(g,2,-104,8,5,c('#cfe3ef'));R(g,5,-103,2,3,c('#1d1d1d'));R(g,-2,-103,3,1,c('#3a3030'));
  if(talk)R(g,3,-95,7,4,c('#5a1f26'));else R(g,3,-94,8,2,c('#8a3d3d'));
  g.restore();
  // Brazo de adelante: en la preparación sostiene el papel del chisme.
  limb(g,12,-80+bob,front,()=>{R(g,-3,0,8,24,c('#8fb7d6'));R(g,3,0,2,24,c('#7aa3c4'));R(g,-3,24,8,6,c('#c99c7c'));if(o.wind){R(g,-6,27,14,10,c('#f4efe2'));R(g,-4,30,10,1,c('#9a8f80'));R(g,-4,33,8,1,c('#9a8f80'));}});
 });
 if(o.wind)T(g,'!',0,-136,20,'#ffe39a');g.restore();};
// Hitos de la calle de la parte 4: cada tramo tiene sus lugares (barrio, plaza y avenida) para que se sienta el trayecto.
// x es la posición en pantalla del borde izquierdo, G el suelo y t el tiempo de la escena.
const PROP_W={almacen:240,paradero:200,plaza:520,kiosco:120,auto:170,fuente:260,schop:200};D.PROP_W=PROP_W;
const neonBox=(g,x,y,w,h,col,a)=>{g.save();g.globalAlpha=a*.18;R(g,x-3,y-3,w+6,4,col);R(g,x-3,y+h-1,w+6,4,col);R(g,x-3,y,4,h,col);R(g,x+w-1,y,4,h,col);g.globalAlpha=a;R(g,x,y,w,2,col);R(g,x,y+h-2,w,2,col);R(g,x,y,2,h,col);R(g,x+w-2,y,2,h,col);g.restore();};
D.prop=function(g,kind,x,G,t){
 if(kind==='almacen'){R(g,x,200,240,G-200,'#7d5c4a');R(g,x,200,14,G-200,'#6a4d3e');R(g,x-6,192,252,12,'#4a3530');R(g,x+30,206,180,34,'#efe2c0');R(g,x+30,236,180,4,'#c9b48a');T(g,'ALMACÉN',x+120,231,22,'#8a2b2b');
  for(let i=0;i<10;i++){R(g,x+10+i*22,250,22,20,i%2?'#e9e2d0':'#b8323a');R(g,x+10+i*22,270,22,4,i%2?'#c9c2b0':'#8a2228');}
  R(g,x+20,284,120,88,'#2b2a33');R(g,x+24,288,112,80,'#d9a85a40');R(g,x+24,316,112,3,'#5a4030');R(g,x+24,346,112,3,'#5a4030');
  const bot=['#5a2a18','#2e6b4a','#d6b45f','#7a3b4f','#3c6e9a','#c98a3a'];for(let j=0;j<8;j++){R(g,x+30+j*13,296,7,20,bot[j%6]);R(g,x+30+j*13,328,8,18,bot[(j+3)%6]);}
  R(g,x+160,288,56,G-288,'#3a2a24');R(g,x+164,292,48,60,'#d9a85a30');R(g,x+204,G-80,4,4,'#d6b45f');R(g,x+166,298,44,14,'#2e6b4a');T(g,'ABIERTO',x+188,309,9,'#e8f4ff');return;}
 if(kind==='paradero'){R(g,x+30,282,100,18,'#2f5d7c');T(g,'PARADERO',x+80,295,11,'#e8f4ff');R(g,x,300,160,10,'#2f5d7c');R(g,x,308,160,3,'#24485f');
  R(g,x+6,310,6,G-310,'#5b6670');R(g,x+148,310,6,G-310,'#5b6670');g.save();g.globalAlpha=.35;R(g,x+12,316,136,74,'#a9d3e8');g.restore();
  R(g,x+24,G-40,110,8,'#7b5c3a');R(g,x+30,G-32,5,32,'#3a3a3a');R(g,x+124,G-32,5,32,'#3a3a3a');
  R(g,x+180,272,5,G-272,'#5b6670');R(g,x+166,252,34,26,'#2f5d7c');R(g,x+170,258,26,12,'#e8f4ff');R(g,x+172,260,6,4,'#2f5d7c');R(g,x+180,260,6,4,'#2f5d7c');R(g,x+188,260,6,4,'#2f5d7c');R(g,x+172,270,5,4,'#15171c');R(g,x+189,270,5,4,'#15171c');return;}
 if(kind==='plaza'){R(g,x,G-26,520,26,'#2f5a3a');R(g,x,G-28,520,4,'#3f7a4c');for(let i=0;i<26;i++)R(g,x+6+i*20,G-30-(i%3)*2,4,4,'#4c9a66');
  for(const tx of [x+70,x+300,x+460]){const s=Math.sin(t*1.3+tx*.01)*2;R(g,tx-7,G-150,14,128,'#5a4030');R(g,tx-7,G-150,4,128,'#4a3426');
   R(g,tx-62+s,G-206,124,44,'#2a5e3f');R(g,tx-52+s,G-236,104,40,'#2f6b46');R(g,tx-38+s,G-258,76,30,'#3a7d52');R(g,tx-30+s,G-246,22,12,'#4c9a66');R(g,tx+8+s,G-222,18,10,'#4c9a66');}
  R(g,x+160,G-62,110,6,'#8a6a48');R(g,x+160,G-42,110,8,'#8a6a48');R(g,x+166,G-34,6,34,'#3a3a3a');R(g,x+258,G-34,6,34,'#3a3a3a');R(g,x+166,G-62,4,22,'#3a3a3a');R(g,x+260,G-62,4,22,'#3a3a3a');
  R(g,x+392,G-82,5,82,'#3a4048');R(g,x+366,G-104,58,24,'#2e6b4a');R(g,x+366,G-104,58,3,'#3f8a62');T(g,'PLAZA',x+395,G-87,12,'#e8f4ff');return;}
 if(kind==='kiosco'){R(g,x,300,120,G-300,'#2e7a5a');R(g,x,300,10,G-300,'#256449');R(g,x-8,286,136,16,'#1f5a42');T(g,'KIOSCO',x+60,299,13,'#f0e3b8');R(g,x+10,318,100,48,'#f0e3b8');
  const mag=['#e05050','#3c6e9a','#d6b45f','#7a3b4f','#2e6b4a','#e57b9b'];for(let k=0;k<6;k++){R(g,x+14+k*16,324,12,18,mag[k]);R(g,x+16+k*16,328,8,2,'#ffffff');}R(g,x+6,366,108,6,'#1f5a42');return;}
 if(kind==='auto'){P(g,[[x+34,G-40],[x+52,G-66],[x+124,G-66],[x+144,G-40]],'#8a2f2f');P(g,[[x+44,G-42],[x+56,G-61],[x+86,G-61],[x+86,G-42]],'#9fc3d6');P(g,[[x+92,G-42],[x+92,G-61],[x+120,G-61],[x+134,G-42]],'#9fc3d6');
  R(g,x,G-42,172,26,'#8a2f2f');R(g,x,G-42,172,4,'#a84040');R(g,x,G-20,172,4,'#5e1f1f');R(g,x+166,G-36,6,6,'#ffe39a');R(g,x,G-36,5,6,'#e05050');R(g,x+88,G-34,10,2,'#5e1f1f');
  for(const wx of [x+24,x+120]){R(g,wx,G-20,28,20,'#15171c');R(g,wx+8,G-14,12,8,'#8a8f84');}return;}
 if(kind==='fuente'){R(g,x,190,260,G-190,'#3a2f4a');R(g,x,190,12,G-190,'#2f263d');const f=.75+Math.sin(t*9)*.08+(Math.sin(t*23)>.94?-.4:0);
  R(g,x+10,200,240,48,'#1b1626');neonBox(g,x+10,200,240,48,'#ff4fa3',f);g.save();g.globalAlpha=f;T(g,'FUENTE DE SODA',x+130,233,20,'#ff8fd0');g.restore();
  R(g,x+20,270,220,104,'#1b1626');g.save();g.globalAlpha=.3;R(g,x+24,274,212,96,'#f0a25a');g.restore();R(g,x+30,330,200,8,'#d8cfb7');for(let i=0;i<5;i++){R(g,x+44+i*40,338,10,30,'#c8323a');R(g,x+40+i*40,334,18,5,'#e05050');}
  R(g,x+24,380,212,4,'#5be3ff');return;}
 if(kind==='schop'){R(g,x,210,200,G-210,'#2a3a4a');R(g,x,210,12,G-210,'#223040');const f=.8+Math.sin(t*7+1)*.1;R(g,x+14,220,172,46,'#1a2028');neonBox(g,x+14,220,172,46,'#ffd94f',f);g.save();g.globalAlpha=f;T(g,'SCHOP',x+90,256,30,'#ffd94f');
  R(g,x+150,228,20,28,'#ffd94f');R(g,x+170,234,6,14,'#ffd94f');R(g,x+150,228,20,6,'#fff3d6');g.restore();R(g,x+20,286,74,62,'#1a2028');g.save();g.globalAlpha=.6;R(g,x+24,290,66,54,'#e0b05a');g.restore();R(g,x+55,290,2,54,'#1a2028');R(g,x+120,300,54,G-300,'#1a2028');R(g,x+124,304,46,50,'#e0b05a30');return;}};
// Farol con cono de luz.
D.lamp=function(g,x,G,t){R(g,x,250,6,G-250,'#3a4048');R(g,x,250,30,5,'#3a4048');R(g,x+22,253,16,7,'#ffe39a');g.save();g.globalAlpha=.1+Math.sin(t*3+x)*.01;P(g,[[x+24,260],[x+36,260],[x+76,G],[x-16,G]],'#ffe39a');g.restore();};
// Don Mario: unos 60 años, melena larga y ondulada hasta los hombros, castaño oscuro bien canoso; barba gris oscura;
// polera gris sin mangas, short rojo y zapatillas blancas. Se dibuja con contorno como los enemigos.
const MARIO={skin:'#c49473',skinSh:'#a97c5f',hair:'#463a33',hairHi:'#62554b',gray:'#a39d96',grayLt:'#bdb8b2',beard:'#5e5b57',beardHi:'#8a8682',beardDk:'#45423f'};
// Melena ondulada que cae hasta los hombros: filas que forman el contorno (con un leve vaivén) y puntas al final.
const MARIO_BACK=[[-185,10],[-180,16],[-175,19],[-170,21],[-164,22],[-158,23],[-152,24],[-146,25],[-140,26],[-134,27],[-128,28],[-122,28],[-116,27]].map(([y,hw],i)=>{const j=Math.round(Math.sin(i*1.3)*1.5);return[-hw+j,y,hw*2+j,7];}).concat([[-27,-112,10,8],[-15,-110,9,6],[6,-110,9,6],[17,-112,10,8]]);
const MARIO_FRONT=[[-15,-178,14,10],[1,-178,14,10],[-18,-170,7,10],[11,-170,7,10],[-18,-162,6,36],[12,-162,6,36],[-24,-128,10,22],[14,-128,10,22]];
// Mechones ondulados: hebras verticales que serpentean; algunas son canas (grey de cada 16).
function waves(g,c,list,sw,grey){const ink=c('x')===INK;for(const [x0,y0,w,h] of list){const x=x0+(x0<-10?-sw:x0>4?sw:0);R(g,x,y0,w,h,c(MARIO.hair));if(ink)continue;
 for(let xx=x+1;xx<x+w-1;xx+=3){const n=((Math.round(xx)*37+11)%16+16)%16,col=n<grey?MARIO.gray:n<grey+2?MARIO.grayLt:n<grey+7?MARIO.hairHi:'#2f2621';for(let yy=y0;yy<y0+h-1;yy+=2){const ox=Math.round(Math.sin(yy*.24+xx*.15)*2);if(xx+ox>x&&xx+ox<x+w-1)R(g,xx+ox,yy,1,2,col);}}}}
D.mario=function(g,x,y,o={}){const k=(o.h||150)/150,t=o.t||0,S=MARIO;g.save();g.translate(Math.round(x),Math.round(y));g.scale(k*(o.dir||1),k);
 const sw=Math.round(Math.sin(t*2)*1.2),arm=o.give!=null?-1.35*o.give:o.wave?Math.sin(t*6)*.5-1.4:0;
 outlined(g,c=>{
  // Melena por detrás de la espalda.
  waves(g,c,MARIO_BACK,sw,5);
  // Brazo de atrás.
  R(g,-28,-120,8,40,c(S.skin));R(g,-28,-120,3,40,c(S.skinSh));R(g,-28,-80,8,8,c('#b4846a'));
  // Piernas, calcetines y zapatillas blancas.
  for(const lx of [-13,3]){R(g,lx,-50,10,40,c(S.skin));R(g,lx,-50,3,40,c(S.skinSh));R(g,lx+3,-32,5,2,c(S.skinSh));R(g,lx,-14,10,5,c('#f0ede6'));
   R(g,lx-2,-10,16,7,c('#f2efe8'));R(g,lx+10,-8,4,5,c('#e4e0d6'));R(g,lx+3,-8,6,2,c('#9aa0a8'));R(g,lx-2,-3,16,3,c('#c9c3b6'));}
  // Short rojo.
  P(g,[[-18,-78],[19,-78],[21,-48],[2,-48],[1,-58],[-1,-58],[-2,-48],[-19,-48]],c('#c8323a'));P(g,[[-18,-78],[-11,-78],[-12,-48],[-19,-48]],c('#a8282f'));R(g,-18,-78,37,4,c('#a8282f'));R(g,10,-70,6,1,c('#8f2128'));
  // Hombros y polera gris sin mangas, con algo de guata.
  R(g,-21,-126,9,10,c(S.skin));R(g,13,-126,9,10,c(S.skin));
  P(g,[[-12,-130],[12,-130],[15,-118],[20,-110],[22,-92],[23,-80],[21,-74],[-21,-74],[-23,-80],[-22,-92],[-20,-110],[-15,-118]],c('#8d9196'));
  P(g,[[-12,-130],[-7,-130],[-12,-112],[-15,-92],[-15,-74],[-21,-74],[-23,-80],[-22,-92],[-20,-110],[-15,-118]],c('#777b80'));
  R(g,-21,-77,42,3,c('#6f7378'));R(g,4,-96,12,1,c('#7c8085'));R(g,-6,-130,12,6,c(S.skin));R(g,-7,-125,14,2,c('#7c8085'));
  // Cuello y cara.
  R(g,-6,-136,12,8,c(S.skinSh));R(g,-13,-166,26,34,c(S.skin));R(g,-13,-166,4,34,c('#b0805f'));
  R(g,-6,-159,12,1,c(S.skinSh));
  R(g,-10,-155,8,2,c('#3f3a36'));R(g,2,-155,8,2,c('#3f3a36'));R(g,-9,-151,6,3,c('#efe8de'));R(g,3,-151,6,3,c('#efe8de'));R(g,-7,-151,3,3,c('#1d1d1d'));R(g,5,-151,3,3,c('#1d1d1d'));
  R(g,-11,-149,2,1,c(S.skinSh));R(g,10,-149,2,1,c(S.skinSh));R(g,-1,-149,4,9,c('#ad8064'));R(g,2,-142,2,2,c('#94694f'));
  // Barba gris oscura con bigote.
  P(g,[[-14,-143],[14,-143],[14,-130],[9,-121],[3,-117],[-3,-117],[-9,-121],[-14,-130]],c(S.beard));R(g,-10,-142,20,4,c(S.beardDk));
  if(c('x')!==INK){for(let yy=-138,r=0;yy<-121;yy+=3,r++)for(let xx=-12+(r&1)*3;xx<11;xx+=5)if(Math.abs(xx+1)<13-(yy>-130?(yy+130)*1.2:0)){const n=((xx*31+yy*17)%8+8)%8;R(g,xx,yy,n<3?2:1,2,n<3?S.beardHi:S.beardDk);}}
  R(g,-4,-135,8,2,c('#6e3e38'));
  // Melena por delante: chasquilla partida al medio y mechones que caen sobre los hombros.
  waves(g,c,MARIO_FRONT,sw,6);R(g,-1,-178,2,10,c('#2f2621'));
  // Brazo de adelante (gira para saludar o entregar la botella).
  g.save();g.translate(20,-120);g.rotate(arm);R(g,0,0,8,40,c(S.skin));R(g,5,0,3,40,c(S.skinSh));R(g,0,40,8,8,c('#b4846a'));
  if(o.bottle){R(g,-2,44,12,26,c('#5a2a18'));R(g,1,36,6,10,c('#5a2a18'));R(g,0,52,10,8,c('#e6d29a'));}g.restore();
 });
 g.restore();};
// Mano del brazo que entrega (misma transformación que D.mario), para pasar la botella de mano en mano.
D.marioHand=(x,y,o={})=>{const k=(o.h||150)/150,dir=o.dir||1,a=-1.35*(o.give||0),lx=20+4*Math.cos(a)-44*Math.sin(a),ly=-120+4*Math.sin(a)+44*Math.cos(a);return{x:x+lx*k*dir,y:y+ly*k};};
// Retrato de diálogo de 96 px.
D.portrait=function(c,id){const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.clearRect(0,0,96,96);g.fillStyle='#203748';g.fillRect(0,0,96,96);const img=M.images[id],b=M.bounds[id];
 if(img&&b){const sw=b.w*.64,sh=b.h*.34,k=Math.min(88/sw,90/sh);g.drawImage(img,b.x+(b.w-sw)/2,b.y,sw,sh,(96-sw*k)/2,96-sh*k,sw*k,sh*k);return;}
 if(id==='mario'){g.save();g.translate(48,234);g.scale(1.25,1.25);D.mario(g,0,0,{h:150});g.restore();return;}
 if(id==='camanchaca'){for(let i=0;i<7;i++){g.fillStyle=['#82979d','#9daaad','#aeb8b6'][i%3];g.fillRect(6+i%3*3,12+i*9,75-i%2*12,12);}g.fillStyle='#dce0cc';g.fillRect(21,30,9,6);g.fillRect(63,30,9,6);}};
})();
