/* Ayudas pequeñas, automáticas y distintas: solo actúan los dos amigos rescatados. */
(() => {'use strict';
const M=window.Magdaleno,S=window.Scooter;
S.helpRules={marcelo:{name:'RUTA SEGURA',cooldown:26,copy:'MARCELO: POR ESE CARRIL. LO TENGO CALCULADO.'},ruzio:{name:'AGUANTE',cooldown:30,copy:'RUZIO: CHALE. ESTE GOLPE LO AGUANTO YO.'},pulga:{name:'MÁS SALTO',cooldown:24,copy:'PULGA: ARRIBA. ESA LA ALCANZAMOS.'},tobi:{name:'EQUILIBRIO',cooldown:26,copy:'TOBI: YAAAA. AFÍRMATE, QUE SEGUIMOS.'},pallo:{name:'RESPIRO',cooldown:34,copy:'PALLO: RESPIRA. TE RECUPERÉ UN POCO.'},cote:{name:'ABRAN PASO',cooldown:32,copy:'COTÉ: CORREEEE!! ¡DÉJENNOS PASAR!'}};
S.canAssist=id=>{const s=S.session;return S.state==='play'&&s&&s.waiting===null&&s.rescued.includes(id)&&s.helpLock<=0&&(s.helpCooldowns[id]||0)<=0;};
S.useAssist=id=>{if(!S.canAssist(id))return false;const s=S.session,rule=S.helpRules[id];s.helpCooldowns[id]=rule.cooldown;s.helpLock=2.4;s.helpUses[id]=(s.helpUses[id]||0)+1;s.assist={id,until:s.rideTime+3};S.notice(rule.copy,3.5);if(id==='cote'){M.audio.tone(280,900,.24,'sawtooth',.024);M.audio.tone(760,340,.65,'triangle',.035,.12);}else{M.audio.tone(440,660,.13,'triangle',.025);M.audio.tone(660,880,.18,'triangle',.02,.1);}S.save();return true;};
S.updateAssists=dt=>{const s=S.session;s.helpLock=Math.max(0,s.helpLock-dt);for(const id of s.roster)s.helpCooldowns[id]=Math.max(0,(s.helpCooldowns[id]||0)-dt);
 for(const o of s.obstacles)if(o.clearedBy)o.evadeAge=(o.evadeAge||0)+dt;
 if(s.health===1&&S.useAssist('pallo')){s.health=2;return;}
 const car=s.obstacles.find(o=>!o.checked&&o.kind==='car'&&o.at-s.distance>48&&o.at-s.distance<125&&Math.abs(o.lane-s.targetLane)<.1);
 if(car&&S.useAssist('cote')){car.checked=true;car.clearedBy='cote';car.evadeAge=0;return;}
 const next=s.obstacles.find(o=>!o.checked&&!o.hinted&&o.at-s.distance>145&&o.at-s.distance<230&&Math.abs(o.lane-s.targetLane)<.1);
 if(next&&S.canAssist('marcelo')){const blocked=s.obstacles.filter(o=>!o.checked&&o.at===next.at).map(o=>o.lane),lane=[-1,0,1].filter(l=>!blocked.includes(l)).sort((a,b)=>Math.abs(a-s.lane)-Math.abs(b-s.lane))[0];if(lane!==undefined&&S.useAssist('marcelo')){s.routeHint={lane,until:s.rideTime+4};next.hinted=true;}}
};
})();
