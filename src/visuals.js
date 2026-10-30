/* Pulido visual 0.2. Articulaciones y escenarios procedurales.
 * Conserva los PNG, límites físicos, mapa y reglas de combate. */
(() => {
  'use strict';
  const M = window.Magdaleno;
  const { F, line, circle, text, poly } = M.draw;
  const g = M.ctx;
  const { W, H, T } = M;
  const smooth = value => {
    const v = M.clamp(value, 0, 1);
    return v * v * (3 - 2 * v);
  };

  M.rigOut = {};
  M.character = function (id, x, y, height, pose = {}) {
    const image = M.images?.[id];
    const bounds = M.bounds?.[id];
    if (!image || !bounds) return;
    const boss = id === 'carabinero' || id === 'matahombres';
    const scale = height / bounds.h;
    const width = bounds.w * scale;
    const direction = pose.dir || 1;
    const time = pose.time || 0;
    const speed = M.clamp(pose.speed ?? (pose.walk ? 1 : 0), 0, 1);
    const cycle = time * 12;
    const stride = Math.sin(cycle) * speed;
    const size = pose.giant || 1;
    // Pose de definitiva (src/powers.js). Registra manos y herramienta en coordenadas de pantalla.
    const rig = pose.rig || null;
    const crouch = rig ? rig.crouch : 0;
    const splay = .7 * crouch;
    const base = g.getTransform();
    const out = rig ? (M.rigOut[id] = { front: null, back: null, tool: {}, head: null }) : null;
    const toBase = (lx, ly) => { const p = base.inverse().multiply(g.getTransform()).transformPoint(new DOMPoint(lx, ly)); return { x: p.x, y: p.y }; };
    const attack = pose.attack ?? (pose.punch ? .45 : -1);
    const extension = attack < 0 ? 0 : attack < .2 ? -.15 * smooth(attack / .2) : attack < .5 ? smooth((attack - .2) / .3) : 1 - smooth((attack - .5) / .5);

    g.save();
    g.globalAlpha = (pose.alpha ?? 1) * .28;
    if (!pose.air) {
      F(x - width * .38 * size, y + 2, width * .76 * size, 3, '#050c16');
      F(x - width * .25 * size, y + 5, width * .50 * size, 2, '#050c16');
    }
    g.restore();
    g.save();
    g.globalAlpha = pose.alpha ?? 1;
    g.translate(Math.round(x), Math.round(y - (rig ? rig.lift : 0)));
    g.scale(size, size * (1 - M.clamp(pose.landing || 0, 0, 1) * .045 - crouch * .04));
    g.rotate(pose.hurt ? -.075 * direction : .028 * direction * speed + .035 * direction * Math.max(0, extension) + (rig ? rig.lean * direction : 0));
    const bounce = pose.air ? 0 : -Math.abs(Math.sin(cycle)) * 1.5 * speed;
    // Al flexionar, las piernas se acortan: el cuerpo baja lo mismo para que los pies sigan en el suelo.
    const drop = pose.air ? 0 : (.18 + .13) * height * (1 - Math.cos(splay));
    g.translate(0, bounce + drop);

    if (boss) {
      const compression = pose.punch ? .985 : 1 + Math.sin(time * 2) * .002;
      g.drawImage(image, bounds.x, bounds.y, bounds.w, bounds.h, Math.round(-width / 2), -height * compression, Math.round(width), height * compression);
      g.restore();
      return;
    }

    // All source regions are expressed relative to the original opaque bounds.
    function piece(rect, pivot, mask) {
      const [x0, y0, x1, y1] = rect;
      const [px, py] = pivot;
      const sx = Math.floor(bounds.x + x0 * bounds.w);
      const sy = Math.floor(bounds.y + y0 * bounds.h);
      const sw = Math.ceil((x1 - x0) * bounds.w);
      const sh = Math.ceil((y1 - y0) * bounds.h);
      g.save();
      if (mask) {
        g.beginPath();
        mask.forEach(([mx, my], index) => {
          const xx = (mx - px) * width;
          const yy = (my - py) * height;
          if (index) g.lineTo(xx, yy); else g.moveTo(xx, yy);
        });
        g.closePath();
        g.clip();
      }
      g.drawImage(image, sx, sy, sw, sh, Math.round((x0 - px) * width), Math.round((y0 - py) * height), Math.ceil(sw * scale), Math.ceil(sh * scale));
      g.restore();
    }
    function joint(point, parent, angle, draw) {
      g.save();
      g.translate((point[0] - parent[0]) * width, (point[1] - parent[1]) * height);
      g.rotate(angle);
      draw();
      g.restore();
    }
    const root = [.5, 1];
    function leg(left) {
      const sign = left ? 1 : -1;
      const swing = stride * sign;
      const hip = [left ? .37 : .63, .63];
      const knee = [left ? .35 : .65, .81];
      const ankle = [left ? .34 : .66, .94];
      let hipAngle = swing * .23;
      let kneeAngle = -sign * Math.max(0, swing) * .36;
      if (pose.air) {
        hipAngle = left ? -.24 : .31;
        kneeAngle = left ? -.35 : .22;
        if (pose.rising === false) { hipAngle *= .55; kneeAngle *= .5; }
      }
      if (attack >= 0) hipAngle *= .35;
      if (crouch && !pose.air) { hipAngle += sign * splay; kneeAngle -= sign * 2 * splay; }
      const upper = left ? [.18, .62, .51, .835] : [.49, .62, .82, .835];
      const upperMask = left ? [[.22,.62],[.51,.62],[.51,.835],[.18,.835]] : [[.49,.62],[.78,.62],[.82,.835],[.49,.835]];
      joint(hip, root, hipAngle, () => {
        piece(upper, hip, upperMask);
        joint(knee, hip, kneeAngle, () => {
          piece(left ? [0,.79,.51,.955] : [.49,.79,1,.955], knee);
          joint(ankle, knee, pose.air ? .08 * sign : -(hipAngle + kneeAngle) * (crouch ? 1 : .8), () => {
            piece(left ? [0,.925,.51,1] : [.49,.925,1,1], ankle);
          });
        });
      });
    }
    leg(true);
    leg(false);

    function arm(left, front) {
      const sign = left ? 1 : -1;
      const shoulder = [left ? .24 : .76, .315];
      const elbow = [left ? .14 : .86, .50];
      let shoulderAngle = -sign * stride * .28;
      let elbowAngle = sign * (.07 + Math.max(0, -stride * sign) * .20);
      if (pose.air) { shoulderAngle = sign * .32; elbowAngle = sign * .25; }
      if (front && attack >= 0) {
        shoulderAngle = -direction * 1.05 * extension;
        elbowAngle = direction * .65 * (1 - Math.max(0, extension));
      }
      if (pose.cast) { shoulderAngle = sign * .95; elbowAngle = sign * .38; }
      if (pose.win) { shoulderAngle = sign * (2.25 + Math.sin(time * 4) * .06); elbowAngle = -sign * .18; }
      if (pose.hurt) { shoulderAngle = sign * .18; elbowAngle = sign * .35; }
      if (rig) { const angles = front ? rig.front : rig.back; shoulderAngle = -direction * angles[0]; elbowAngle = -direction * angles[1]; }
      const upperMask = left ? [[0,.30],[.29,.30],[.26,.515],[0,.515]] : [[.71,.30],[1,.30],[1,.515],[.74,.515]];
      const lowerMask = left ? [[0,.48],[.255,.48],[.20,.72],[0,.72]] : [[.745,.48],[1,.48],[1,.72],[.80,.72]];
      joint(shoulder, root, shoulderAngle, () => {
        piece(left ? [0,.30,.29,.52] : [.71,.30,1,.52], shoulder, upperMask);
        joint(elbow, shoulder, elbowAngle, () => {
          piece(left ? [0,.48,.255,.72] : [.745,.48,1,.72], elbow, lowerMask);
          if (!rig) return;
          // La herramienta comparte la transformación de la mano: no puede separarse de ella.
          const hx = ((left ? .13 : .87) - elbow[0]) * width, hy = (.70 - elbow[1]) * height;
          out[front ? 'front' : 'back'] = toBase(hx, hy);
          if (rig.tool && front && M.drawTool) {
            g.save(); g.translate(hx, hy); g.scale(direction, 1);
            M.drawTool(rig.tool, height / 94, (name, lx, ly) => { out.tool[name] = toBase(lx, ly); });
            g.restore();
          }
        });
      });
    }
    const backIsLeft = direction > 0;
    arm(backIsLeft, false);
    g.save();
    g.translate(0, -Math.sin(time * 2) * .25 * (1 - speed));
    piece([.22,.29,.78,.65], root);
    g.restore();
    arm(!backIsLeft, true);
    joint([.5,.28], root, pose.hurt ? .055 * direction : .012 * stride, () => {
      piece([0,0,1,.31], [.5,.28]);
      if (out) out.head = toBase(0, -.13 * height);
    });
    g.restore();
    if (rig && M.afterRig) M.afterRig(id, rig, out);
    if (extension > .65) {
      const px = x + direction * (height * .33 + 12);
      F(px, y - height * .64, 8, 3, '#ffe8b4');
      F(px + direction * 6, y - height * .70, 3, 5, '#fff0d1');
    }
  };

  function pine(x, floor, height, color, detail = true) {
    F(x - 3, floor - height, 6, height, color);
    for (let level = 0; level < 6; level++) {
      const y = floor - height + level * height * .12;
      const w = height * (.09 + level * .025);
      poly([[x,y],[x-w*.6,y+height*.12],[x-w*.4,y+height*.12],[x-w,y+height*.24],[x+w,y+height*.24],[x+w*.4,y+height*.12],[x+w*.6,y+height*.12]], color);
      if (detail) line(x-w*.55, y+height*.2, x+w*.35, y+height*.2, '#284c46', 2);
    }
  }
  function ridge(x, y, width, height, color, snow = false) {
    const points = [[x-width*.52,y],[x-width*.36,y-height*.32],[x-width*.28,y-height*.25],[x-width*.14,y-height*.7],[x-width*.07,y-height*.59],[x,y-height],[x+width*.10,y-height*.67],[x+width*.15,y-height*.77],[x+width*.30,y-height*.30],[x+width*.37,y-height*.4],[x+width*.55,y]];
    poly(points, color);
    if (snow) poly([[x-width*.06,y-height*.73],[x,y-height],[x+width*.07,y-height*.77],[x+width*.035,y-height*.79],[x+width*.01,y-height*.76],[x-width*.012,y-height*.83],[x-width*.025,y-height*.77]], '#5d7690');
    line(x, y-height+8, x-width*.1, y-height*.50, snow ? '#3f5b78' : '#233b57', 3);
  }
  function litWindow(x, y, w, h, on, tint = '#bd9458') {
    F(x-3,y-3,w+6,h+6,'#14202b');
    F(x,y,w,h,on?tint:'#2b4255');
    if (on) { F(x+3,y+3,w-6,3,'#e4bf7a'); F(x+4,y+h-6,w-8,3,'#9e754c'); }
    F(x+w/2,y,3,h,'#51483d'); F(x,y+h*.55,w,3,'#51483d');
  }
  function pole(x, floor) {
    F(x-5,floor-244,10,244,'#333c40'); F(x-2,floor-244,3,244,'#88795e');
    F(x-14,floor-204,27,5,'#59615e'); F(x-10,floor-197,5,4,'#a7b7b1'); F(x+6,floor-197,5,4,'#a7b7b1');
    F(x,floor-242,47,5,'#6c695a'); F(x+41,floor-239,5,15,'#6c695a');
    F(x+26,floor-226,34,7,'#aa966d'); F(x+31,floor-223,23,4,'#ffe8a3');
    for (let i=3;i>0;i--) { g.globalAlpha=.025+i*.014; poly([[x+26,floor-218],[x+60,floor-218],[x+72+i*19,floor],[x+13-i*22,floor]],'#f4cb85'); }
    g.globalAlpha=1;
    F(x-10,floor-8,21,8,'#464c49');
  }
  function cityBuilding(x, seed) {
    const random=M.rng(seed*119+970),height=174+Math.floor(random()*78),top=450-height;
    const facade=seed%3===0?'#414c53':seed%3===1?'#4d4d48':'#3b4a55';
    F(x,top,282,height,'#222f3c');F(x+5,top+7,272,height-7,facade);
    F(x-7,top,296,7,'#6a7376');F(x-2,top+7,286,4,'#222e38');
    F(x+266,top+9,5,height-9,'#29323a');F(x+16,440,245,10,'#29343f');
    if(seed%2===0){litWindow(x+23,top+27,49,39,seed%4===0);litWindow(x+100,top+27,49,39,true);F(x+21,top+72,130,5,'#6b6c61');}
    else { litWindow(x+170,top+24,57,52,true);F(x+170,top+80,59,5,'#827563'); }
    // Corrugated storefront: the top surface is background, not a platform.
    F(x+15,342,133,108,'#122e33'); F(x+20,348,123,102,'#285a57');
    for(let y=350;y<449;y+=7){F(x+21,y,121,2,'#3b7369');F(x+21,y+3,121,1,'#20433f');}
    F(x+11,329,141,17,'#3c5751');F(x+15,332,132,3,'#638575');F(x+23,337,32,4,'#92cfb5');
    F(x+162,355,72,95,'#252d35');F(x+167,361,61,89,'#343a3e');F(x+174,368,45,42,'#425365');F(x+218,412,3,6,'#cbb477');
    F(x+151,438,88,6,'#7a7568'); F(x+243,top+17,7,height-17,'#283941');
    if(seed%3===0){F(x+31,300,93,22,'#213c40');text('ALMACÉN',x+77,315,10,'#b6c3ae','center');}
    if(seed%3===1){F(x+239,383,20,35,'#9b9273');F(x+243,388,12,2,'#615c4a');F(x+243,394,12,2,'#615c4a');F(x+243,408,9,4,'#687873');}
    F(x+159,426,26,24,'#4f4940');F(x+162,430,20,2,'#85765b');line(x+163,433,x+179,447,'#2f3639',2);
    F(x+3,top-7,45,7,'#2a3742');F(x+10,top-16,19,10,'#48555b');
    if(seed%2){F(x+188,top-37,3,37,'#273a49');line(x+171,top-29,x+206,top-29,'#273a49',2);}
  }

  M.background = function (zone, cam, time) {
    const random=M.rng(180+zone);
    F(0,0,W,H,zone===0?'#111f39':zone===1?'#101d34':'#0e1a34');
    F(0,210,W,190,zone===2?'#142e43':'#162c44');
    for(let i=0;i<84;i++){
      const x=((random()*1800-cam*.025)%W+W)%W,y=40+random()*205;
      F(x,y,i%9===0?2:1,i%9===0?2:1,i%4?'#6e91ab':'#b7c9d6');
    }
    if(zone===2){const mx=765-cam*.016%100;circle(mx,96,27,'#c0d0d7');F(mx-17,89,10,6,'#97b0c3');F(mx+4,102,13,5,'#9db7c7');}
    for(let layer=0;layer<2;layer++)for(let i=-1;i<6;i++){
      const px=i*330-(cam*(layer?.065:.035))%330;
      ridge(px,330+layer*31,490,140+((i+8)%3)*37,layer?'#203b54':'#1a304c',layer===0);
    }
    const distant=M.rng(339);
    for(let i=0;i<45;i++){
      const x=i*54-(cam*.11)%54;
      const h=(zone===0?35:14)+distant()*(zone===0?60:25);
      F(x,346-h,37,h,zone===0?'#26364c':'#233b4b');
      for(let yy=346-h+8;yy<343;yy+=12)for(let xx=x+5;xx<x+33;xx+=10)if(distant()>.45)F(xx,yy,3,3,zone===0?'#a88959':'#ae8c55');
    }
    for(let i=Math.floor(cam*.25/165)-2;i<Math.floor(cam*.25/165)+9;i++){
      const x=i*165-cam*.25;
      pine(x,410,130+(i%3)*22,zone===0?'#183d42':'#163c3d',false);
      if(zone!==0)pine(x+80,410,95,'#1d4541',false);
    }
    if(zone===0){
      for(let i=Math.floor(cam/310)-1;i<Math.floor(cam/310)+5;i++)cityBuilding(i*310-cam,i+100);
    }else if(zone===1){
      for(let i=Math.floor(cam/430)-1;i<Math.floor(cam/430)+4;i++){
        const x=i*430-cam;
        F(x,384,430,6,'#716751');F(x,417,430,5,'#5f5c4e');
        for(let j=0;j<6;j++){F(x+j*80,370,7,80,'#625e4d');F(x+j*80,370,3,80,'#878169');}
        if(i%3===1){
          F(x+122,283,174,8,'#6e7169');F(x+128,291,7,159,'#687977');F(x+281,291,7,159,'#687977');
          F(x+136,294,145,138,'#263e4a');F(x+139,296,139,2,'#7c979b');F(x+205,295,4,134,'#47616b');
          F(x+143,422,129,6,'#89775a');F(x+151,429,6,20,'#34434a');F(x+257,429,6,20,'#34434a');
          F(x+152,301,45,56,'#98a297');F(x+157,307,35,3,'#53685f');F(x+157,316,35,3,'#53685f');
          F(x+122,285,174,3,'#c5a36b');
        }
        F(x+345,404,34,46,'#59685e');F(x+348,407,28,4,'#94a184');F(x+353,414,5,30,'#394b43');
      }
    }else{
      for(let i=Math.floor(cam/390)-1;i<Math.floor(cam/390)+4;i++){
        const x=i*390-cam;
        pine(x+25,450,302,'#103334');pine(x+115,450,208,'#1d4740');
        poly([[x+170,450],[x+170,414],[x+194,376],[x+237,366],[x+280,400],[x+294,450]],'#405466');
        poly([[x+170,414],[x+194,376],[x+237,366],[x+224,389],[x+205,392],[x+190,417]],'#6d8291');
        line(x+237,378,x+251,407,'#263f51',3);F(x+185,427,70,6,'#4e765b');
        for(let j=0;j<7;j++)F(x+173+j*15,441-(j%3)*3,8,5,'#42694f');
      }
    }
    if(zone!==2)for(let i=Math.floor(cam/680)-1;i<Math.floor(cam/680)+3;i++){
      const x=i*680+100-cam;pole(x,450);
      line(x,228,x+340,244,'#111c29',2);line(x+340,244,x+680,228,'#111c29',2);
      line(x,238,x+340,252,'#162230',2);line(x+340,252,x+680,238,'#162230',2);
    }
  };

  M.terrain = function (session, cam) {
    const first=Math.max(0,Math.floor(cam/T)-1),last=Math.min(session.cols-1,Math.ceil((cam+W)/T)+1);
    for(let row=0;row<12;row++)for(let col=first;col<=last;col++){
      const tile=session.grid[row][col];
      if(tile!=='#'&&tile!=='=')continue;
      const x=col*T-cam,y=row*T,random=M.rng(col*239+row*47+1);
      if(tile==='='){
        F(x,y,T,7,'#ba9563');F(x,y+7,T,8,'#66523e');F(x+2,y+2,T-4,2,'#e1c18a');
        for(let j=0;j<3;j++){F(x+5+j*14,y+8,2,6,'#313438');F(x+7+j*14,y+3,2,2,'#5c5549');}
        F(x+4,y+14,4,11,'#3b3f3a');continue;
      }
      const top=!M.solidAt(col,row-1);
      F(x,y,T+1,T+1,session.zone===2?'#2b3c4b':'#293745');
      if(session.zone===2){
        for(let j=0;j<3;j++){
          const yy=y+j*15,offset=(row+j)%2?12:0;
          F(x+offset,yy,31,13,'#3c5060');F(x+offset+2,yy+2,25,2,'#526777');F(x+offset+1,yy+12,30,2,'#1b2c3b');
        }
      }else{
        const shift=(row%2)*T*.5;
        F(x+shift%T,y+7,2,25,'#15293b');F(x+3,y+5,T-6,2,'#455667');
        F(x+3,y+T-4,T-6,2,'#1c2d40');F(x+11,y+14,12,3,'#3c5061');
      }
      for(let j=0;j<5;j++)F(x+random()*T,y+8+random()*30,2,2,j%2?'#526473':'#182b3b');
      if(top){
        if(session.zone===2){
          F(x,y,T,5,'#8a9775');F(x,y+5,T,6,'#5b6e55');F(x,y+11,T,4,'#3b5545');
          for(let j=0;j<6;j++){const xx=x+random()*T;F(xx,y-3-random()*3,2,8,'#5e895b');F(xx+1,y-2,4,2,'#8ca26d');}
        }else if(session.zone===1){
          F(x,y,T,5,'#91928a');F(x,y+5,T,10,'#515d64');F(x+9,y+7,25,3,'#ccb77c');F(x,y+15,T,2,'#293b4a');
        }else{
          F(x,y,T,6,'#b2ac94');F(x,y+6,T,5,'#6c777c');F(x,y+11,T,2,'#273d4b');
          F(x+T-2,y,2,10,'#555e61');if(col%4===0){F(x+4,y+1,T-9,2,'#d0c9ad');F(x+T-4,y+7,3,4,'#394c59');}
        }
      }
    }
  };

  const drawEnemy=M.enemy;
  M.enemy=function(enemy,cam,time){
    drawEnemy(enemy,cam,time);
    if(!(enemy.reveal>0)||enemy.dead)return;
    const x=enemy.x-cam,y=enemy.y-enemy.h-13;
    F(x-16,y-1,32,6,'#102333');
    F(x-14,y+1,28*Math.max(0,enemy.hp)/enemy.max,2,'#d9b373');
    if(enemy.reveal>.9&&enemy.lastDamage)text('-'+enemy.lastDamage,x,y-5-(1.2-enemy.reveal)*20,10,'#f4d9a5','center');
  };
  const renderGame=M.render;
  M.render=function(){
    renderGame();
    const session=M.session;
    if(M.state!=='play'||!session||M.celebrating||session.friends.length<2)return;
    const p=session.player;
    const lift=94*(p.rig?.scale||1)+(p.rig?.lift||0);
    const x=p.x-M.cam,y=p.y-lift-11;
    poly([[x-5,y-5],[x+5,y-5],[x,y]],'#64d5be');
  };
})();


