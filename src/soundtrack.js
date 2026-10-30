/* Variaciones chiptune por zona y por jefe, sintetizadas localmente. */
(() => {
  'use strict';
  const M=window.Magdaleno;
  const profiles=[
    {tempo:112,root:146.83,chords:[0,5,3,7],melody:[0,3,7,10,7,3,2,0,5,8,12,8,7,5,3,-1,3,7,10,12,10,7,5,3,7,11,14,11,7,5,2,-1],wave:'triangle'},
    {tempo:128,root:164.81,chords:[0,7,5,3],melody:[0,7,12,7,10,7,3,2,7,14,19,14,12,10,7,-1,5,12,17,12,10,8,5,3,3,10,15,10,7,5,3,-1],wave:'square'},
    {tempo:104,root:130.81,chords:[0,3,5,7],melody:[0,3,7,12,10,7,5,3,3,7,10,15,12,10,7,-1,5,8,12,17,15,12,8,5,7,11,14,19,14,11,7,-1],wave:'triangle'}
  ];
  M.audio.update=function(dt){
    if(this.muted||!this.ctx||this.ctx.state!=='running')return;
    const boss=M.session?.boss?.active&&!M.session.boss.dead;
    const mode=(boss?M.session.boss.id:'zone')+':'+this.zone;
    if(this.musicMode!==mode){this.musicMode=mode;this.tick=0;this.timer=0;}
    this.timer-=dt;if(this.timer>0)return;
    const p=profiles[this.zone],tempo=boss?(M.session.boss.phase===2?156:144):p.tempo;
    this.timer=60/tempo/2;
    const i=this.tick++,step=i%32,chord=p.chords[Math.floor(step/8)],root=p.root*Math.pow(2,chord/12),note=p.melody[step];
    if(note>=0){const f=p.root*Math.pow(2,(note+(boss?12:0))/12);this.tone(f,f,this.timer*.78,boss?'square':p.wave,boss?.022:.020);if(this.zone===2&&!boss)this.tone(f*2,f*1.998,this.timer*.3,'triangle',.006);}
    if(i%2===0)this.tone(root/2,root/2,this.timer*1.25,'triangle',.035);
    const arp=[0,7,12,7][i%4],a=root*Math.pow(2,arp/12);if(i%2===1||this.zone===2)this.tone(a,a*.999,this.timer*.48,'triangle',.010);
    if(i%4===0)this.tone(95,35,.08,'sine',.035);
    if(i%4===2)this.tone(180,65,.045,'triangle',.016);
    if(boss&&i%2===1)this.tone(1200,500,.025,'square',.004);
  };
})();
