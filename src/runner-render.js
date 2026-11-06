/* Parral ficticio de noche: perspectiva frontal, cortinas cerradas y niebla por capas. */
(() => {'use strict';
const M=window.Magdaleno,P=window.Parral,g=M.ctx,{F,line,circle,text,poly}=M.draw;
const colors=['#626569','#665c53','#536570','#696759','#635b68'];
P.project=(lane,z)=>{const k=35/(35+Math.max(-8,z));return{x:P.center+lane*P.half*k,y:P.horizon+(P.ground-P.horizon)*k,k};};
function sky(W,H,t){F(0,0,W,H,'#10213a');const glow=g.createLinearGradient(0,0,0,H*.58);glow.addColorStop(0,'#0b1630');glow.addColorStop(1,'#294658');g.fillStyle=glow;g.fillRect(0,0,W,H*.58);
 for(let i=0;i<42;i++){const x=(i*157+51)%W,y=18+(i*43)%Math.max(20,Math.round(H*.29));F(x,y,i%5?1:2,1,i%3?'#627d96':'#a8a994');}circle(W*.79,H*.13,14,'#c6d2c9');circle(W*.79-6,H*.13-4,12,'#182b43');
 for(let i=0;i<24;i++){const x=i*49-10,h=24+(i*37)%47;F(x,P.horizon-h,43,h+32,'#20384b');F(x+4,P.horizon-h+5,36,3,'#3a4c57');if(i%3===0)F(x+14,P.horizon-h+14,3,7,'#ad9366');}
 F(W*.48,P.horizon-80,10,78,'#20394a');poly([[W*.48-6,P.horizon-79],[W*.48+5,P.horizon-96],[W*.48+17,P.horizon-79]],'#405360');F(W*.48+3,P.horizon-70,3,8,'#cfad70');
}
function road(W,H,distance){const h=P.horizon,b=P.ground,half=P.half,c=P.center;
 F(0,h,W,H-h,'#394b54');poly([[c,h],[c+half*1.7,b+70],[c-half*1.7,b+70]],'#536368');
 poly([[c,h],[c-half*.33,b+70],[c-half*.33*1.7,b+70]],'#5c686a');
 poly([[c,h],[c-half*.55,b+100],[c+half*.55,b+100]],'#303e4b');
 // Los carriles laterales son veredas; la calle central queda libre para cruzar.
 for(const edge of [-.33,.33,-1,1]){const a=P.project(edge,200),z=P.project(edge,-8);line(a.x,a.y,z.x,z.y,Math.abs(edge)===1?'#9c9d83':'#899388',Math.abs(edge)===1?3:2);}
 for(let i=0;i<23;i++){const z=i*14-distance%14;if(z<1)continue;const a=P.project(-1,z),b=P.project(1,z);line(a.x,a.y,b.x,b.y,'#465760',Math.max(1,a.k));}
 for(let i=0;i<17;i++){const z=i*18-distance%18;if(z<0)continue;for(const lane of [-.33,.33]){const a=P.project(lane-.009,z),b=P.project(lane+.009,z+7);poly([[a.x,a.y],[a.x+4*a.k,a.y],[b.x+2*b.k,b.y],[b.x,b.y]],'#b7aa76');}}
 // Cruces peatonales que pasan bajo los pies, sin cambiar la colisión.
 const cross=300-distance%420;if(cross>0&&cross<190){for(let i=-4;i<=4;i++){const a=P.project(i*.18-.05,cross),b=P.project(i*.18+.05,cross+5);poly([[a.x,a.y],[P.project(i*.18+.05,cross).x,a.y],[b.x,b.y],[P.project(i*.18-.05,cross+5).x,b.y]],'#aeb3a4');}}
}
function building(side,z,index,shop){const near=P.project(side*1.03,z),outer=P.project(side*3.2,z),back=P.project(side*1.03,z+22),k=near.k,height=(142+(index%3)*31)*k,roof=near.y-height;
 const left=Math.min(near.x,outer.x),width=Math.abs(near.x-outer.x),body=colors[(index+9)%colors.length];
 poly([[near.x,roof],[back.x,back.y-height*.82],[back.x,back.y],[near.x,near.y]],'#303f4b');F(left,roof,width,near.y-roof,body);F(left,roof+2,width,4*k,'#91958c');
 poly([[left-4*k,roof],[left+width*.13,roof-15*k],[left+width*.92,roof-15*k],[left+width+4*k,roof]],index%2?'#76614f':'#6d6359');
 const center=near.x+side*49*k,windowWidth=Math.min(width*.25,36*k);for(const offset of [-.24,.24]){const x=center+90*k*offset-windowWidth/2,y=roof+21*k;F(x-2*k,y-2*k,windowWidth+4*k,31*k,'#293544');F(x,y,windowWidth,27*k,index%4===0?'#bc9d67':'#3d5260');F(x+windowWidth/2,y,1*k,27*k,'#756e5d');}
 const doorW=Math.min(width*.55,90*k),doorX=center-doorW/2,doorY=near.y-69*k;
 F(doorX-3*k,doorY-3*k,doorW+6*k,72*k,'#253441');F(doorX,doorY,doorW,69*k,shop?'#526367':'#4f5a60');
 for(let i=0;i<10;i++)F(doorX,doorY+i*7*k,doorW,1*k,'#334551');F(doorX+2*k,near.y-3*k,doorW-4*k,2*k,'#8d927f');
 if(shop){F(center-width*.37,doorY-24*k,width*.74,20*k,'#173831');if(k>.2){text(shop.name,center,doorY-10*k,Math.max(6,10*k),'#d4c89d','center');F(center-23*k,doorY+23*k,46*k,15*k,'#312c2c');text('CERRADO',center,doorY+34*k,Math.max(6,8*k),'#e3b18a','center');}}
 else if(index%3===0&&k>.35){F(doorX,doorY-15*k,doorW,11*k,'#2c433f');text(index%2?'ALMACÉN':'PARRAL',center,doorY-7*k,Math.max(6,7*k),'#bbc9ab','center');}
 if(index%2===0){const pole=P.project(side*.98,z+5),poleH=155*pole.k;F(pole.x-2*pole.k,pole.y-poleH,4*pole.k,poleH,'#56636a');F(pole.x-side*24*pole.k,pole.y-poleH,side*24*pole.k,3*pole.k,'#647478');const lx=pole.x-side*23*pole.k,ly=pole.y-poleH+4;F(lx-8*pole.k,ly,16*pole.k,4*pole.k,'#f1cf8f');g.globalAlpha=.06;poly([[lx-9*pole.k,ly],[lx+9*pole.k,ly],[pole.x+48*pole.k,pole.y],[pole.x-48*pole.k,pole.y]],'#ffdc99');g.globalAlpha=1;}
}
function city(distance){for(let i=14;i>=0;i--){const z=i*24-distance%24;if(z< -7)continue;const absolute=Math.floor(distance/24)+i;for(const side of [-1,1]){const nearestShop=P.shops.find(shop=>Math.abs(shop.at-(distance+z))<14&&side===(P.shops.indexOf(shop)%2?-1:1));building(side,z,absolute+(side>0?3:0),nearestShop);}}
}
function fog(W,H,t,gap,relief){const front=P.project(0,gap),edge=front.y,fade=relief>0?.34:.78;
 const gradient=g.createLinearGradient(0,Math.max(0,P.horizon-70),0,edge+16);gradient.addColorStop(0,'#344c61dd');gradient.addColorStop(.45,'#6b8796db');gradient.addColorStop(.87,'#a2b4bdbd');gradient.addColorStop(1,'#8fa6b500');g.fillStyle=gradient;g.globalAlpha=fade;g.fillRect(0,P.horizon-70,W,edge-P.horizon+90);
 for(let layer=0;layer<3;layer++){g.globalAlpha=(relief>0?.08:.18)+layer*.025;for(let i=-1;i<18;i++){const x=i*69+(Math.sin(t*.4+layer)*36),y=edge-14-layer*22+Math.sin(i*.9+t*.8+layer)*9;F(x,y,82,8,'#c7d1d1');F(x+12,y-10,54,12,'#bac8cd');F(x+25,y-16,28,9,'#bdcbd0');}}
 g.globalAlpha=1;if(gap<27&&relief<=0){g.globalAlpha=(27-gap)/27*.17;F(0,0,W,H,'#b3c6cd');g.globalAlpha=1;}
}
function obstacle(o,distance){const z=o.at-distance;if(z< -7||z>210)return;const p=P.project(o.lane*.64,z),k=p.k,x=p.x,y=p.y;
 if(o.kind==='hole'){poly([[x-58*k,y-4*k],[x-43*k,y-14*k],[x+35*k,y-16*k],[x+63*k,y-5*k],[x+48*k,y+12*k],[x-33*k,y+13*k]],'#af9c75');poly([[x-50*k,y-3*k],[x-36*k,y-10*k],[x+32*k,y-11*k],[x+53*k,y-3*k],[x+38*k,y+8*k],[x-30*k,y+8*k]],'#0a1422');line(x-44*k,y+8*k,x-26*k,y+10*k,'#4e6570',2*k);F(x+31*k,y-11*k,9*k,3*k,'#f1cf86');F(x-52*k,y-4*k,7*k,3*k,'#f1cf86');}
 else if(o.kind==='poop'){F(x-15*k,y+2*k,30*k,4*k,'#25333c');F(x-13*k,y-5*k,26*k,8*k,'#543a2f');F(x-9*k,y-11*k,18*k,8*k,'#88603f');F(x-5*k,y-18*k,10*k,9*k,'#a57449');F(x-2*k,y-21*k,5*k,5*k,'#92633e');F(x-8*k,y-8*k,9*k,2*k,'#c29864');F(x+6*k,y-4*k,4*k,2*k,'#a6794e');}
 else{F(x-53*k,y+2*k,106*k,5*k,'#25363e');F(x-48*k,y-14*k,92*k,17*k,'#655456');F(x-47*k,y-17*k,78*k,15*k,'#8a7e79');F(x-34*k,y-17*k,7*k,15*k,'#aaa08c');F(x+5*k,y-17*k,8*k,15*k,'#aaa08c');F(x+35*k,y-13*k,16*k,13*k,'#b79372');F(x+40*k,y-16*k,10*k,4*k,'#4d4039');F(x-54*k,y-9*k,15*k,9*k,'#3c3d42');if(k>.45)text('z',x+45*k,y-24*k,10*k,'#b6c9c9','center');}
 if(z>12&&z<64&&!o.checked){const iconY=y-(o.kind==='sleeper'?42:36)*k;poly([[x,iconY-10*k],[x-7*k,iconY+2*k],[x+7*k,iconY+2*k]],o.kind==='sleeper'?'#b9b9d5':'#edbf77');F(x-1*k,iconY-5*k,2*k,4*k,'#243447');}
}
function scream(W,H,s,origin){if(s.shoutAge>2.4)return;const t=s.shoutAge;for(let i=0;i<4;i++){const age=t-i*.18;if(age<0)continue;g.globalAlpha=Math.max(0,1-age/2.1)*.5;g.strokeStyle=i%2?'#f6d2a1':'#f0a19c';g.lineWidth=2;g.beginPath();g.ellipse(origin.x,origin.y,20+age*340,12+age*160,0,0,Math.PI*2);g.stroke();}g.globalAlpha=1;if(t<1.2)text(P.cote.phrase,origin.x-24,origin.y-18,17,'#ffe0b7','center');}
function hideout(W,H,s){sky(W,H,P.anim);F(0,H*.5,W,H*.5,'#354955');const scale=Math.min(W/960,H/540);g.save();g.translate((W-960*scale)/2,(H-540*scale)/2);g.scale(scale,scale);
 // Al otro lado de la calle: una luz discreta, sin mostrar compra ni botella.
 F(615,103,297,256,'#3d4650');poly([[601,106],[638,74],[890,74],[925,106]],'#665e55');F(633,117,260,40,'#263e3a');text('EL VECINO',762,144,23,'#ecd1a0','center');F(672,175,177,178,'#24313b');F(680,179,160,174,'#5b6669');for(let i=0;i<18;i++)F(680,182+i*9,160,2,'#394b57');F(684,348,152,5,'#e3b779');F(874,163,5,161,'#35434d');circle(877,161,6,'#ecd29b');g.globalAlpha=.07;poly([[872,168],[883,168],[934,357],[822,357]],'#f6d190');g.globalAlpha=1;
 F(0,360,960,180,'#2a3d49');for(let i=0;i<12;i++)F(i*90,413+(i%3)*22,36,2,'#485965');
 // Acoplado articulado: caja larga, bogie trasero y enganche independiente del tractocamión.
 F(108,159,650,159,'#233b4b');F(113,164,640,145,'#536c79');F(123,173,620,4,'#8b9b9f');for(let i=0;i<11;i++)F(124+i*57,181,3,119,'#415b69');F(114,303,638,9,'#a2a08a');
 F(111,318,646,15,'#152d3d');F(265,333,423,11,'#1b303c');line(285,343,660,343,'#425a65',3);F(114,310,7,6,'#d49c79');F(740,310,8,6,'#d9c39b');
 // Patas recogidas y quinta rueda: se distingue el semirremolque de la cabina.
 F(675,334,8,36,'#50646d');F(671,366,17,5,'#142b37');F(727,333,6,28,'#50646d');F(724,358,13,5,'#142b37');
 F(748,325,13,23,'#293e4a');F(739,344,53,7,'#88918c');F(768,351,105,13,'#172e3c');circle(769,344,5,'#c0c4b2');
 line(769,288,784,300,'#a28b72',3);line(784,300,776,315,'#7e9b9c',3);line(775,287,792,300,'#6e8795',2);
 // La cabina está unida a otro chasis, a la derecha del acoplado.
 F(795,226,112,124,'#304b5c');poly([[800,231],[867,231],[902,279],[902,326],[800,326]],'#597887');poly([[808,240],[858,240],[885,276],[808,276]],'#193247');F(812,244,42,27,'#93afb8');F(800,282,99,6,'#7c939b');F(809,294,52,42,'#486a7c');F(851,302,10,4,'#c3c4af');F(889,311,12,9,'#efd397');F(898,336,16,10,'#a9afa3');F(803,212,51,14,'#415e6f');
 for(const [x,r]of [[170,38],[228,38],[800,43],[891,43]]){circle(x,412,r,'#0c1b29');circle(x,412,r*.69,'#394e5d');circle(x,412,r*.34,'#72818a');circle(x,412,5,'#203746');}
 const others=M.order.filter(id=>id!==s.hero),ids=[...others.slice(0,2),s.hero,'cote',...others.slice(2)];
 for(let i=0;i<ids.length;i++)M.character(ids[i],292+i*67,447,92,{time:P.anim+i*.2,armed:false,rig:{crouch:.8,lift:0,lean:0,front:[.2,.55],back:[-.2,.45]}});
 F(290,468,396,22,'#0d2533');text('LOS SEIS. POR FIN EN EL MISMO LADO.',488,483,11,'#c1d8ce','center');text('UNA LUZ SIGUE ENCENDIDA.',766,67,11,'#c9c7b1','center');g.restore();
}
P.render=function(){const W=P.width||960,H=P.height||540,s=P.session,t=P.anim||0;g.setTransform(1,0,0,1,0,0);g.imageSmoothingEnabled=false;P.center=W/2-(s?.lane||0)*13;P.horizon=Math.round(H*.25);P.ground=H-43;P.half=M.clamp(H*.9,300,425);
 if(P.state==='ending'&&s){hideout(W,H,s);return;}const distance=s?.distance||t*3;sky(W,H,t);road(W,H,distance);city(distance);fog(W,H,t,s?.gap||85,s?.relief||0);
 const obstacles=s?.obstacles||P.makeObstacles();for(const o of [...obstacles].reverse())if(o.at-distance>0)obstacle(o,distance);
 if(s?.coteJoined){const helper=P.project(1.13,17),helperHeight=Math.min(114,H*.28)*helper.k;M.character('cote',helper.x,helper.y,helperHeight,{time:t,walk:s.relief<=0&&P.state==='play',speed:.75,cast:s.relief>0,armed:false});scream(W,H,s,{x:helper.x,y:helper.y-helperHeight*.82});}
 const hero=s?.hero||M.order[0],height=M.clamp(H*.29,92,138),x=P.center+(s?.lane||0)*P.half*.64,y=P.ground-(s?.jumpY||0);
 M.character(hero,x,y,height,{time:s?.runTime||t,walk:P.state==='play'&&!s?.jumpLeft,speed:s?.slow>0?.35:1,air:s?.jumpLeft>0,rising:(s?.jumpLeft||0)>.43,hurt:s?.stumble>0,armed:false,dir:1});
 for(const o of obstacles)if(o.at-distance<=0)obstacle(o,distance);
 if(s?.inv>0){g.globalAlpha=Math.min(.15,s.inv*.12);F(0,0,W,H,'#cfa06c');g.globalAlpha=1;}
 const vignette=g.createLinearGradient(0,H-15,0,H-110);vignette.addColorStop(0,'#071726a6');vignette.addColorStop(1,'#07172600');g.fillStyle=vignette;g.fillRect(0,H-110,W,110);
};
})();
