/* Partida automatizada con controles normales: sin teletransporte,
 * invulnerabilidad, eliminación de enemigos ni cambios de salud/energía. */
const { chromium } = require('./browser.cjs');
const fs = require('fs');
const path = require('path'); const assert = require('assert/strict'); const hero = process.argv[2] || 'marcelo';

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--mute-audio'] });
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4173/?qa=1');
  await page.waitForFunction(() => window.Magdaleno?.state === 'title');
  const result = await page.evaluate(hero => {
    const a = __magdaleno;
    const M = a.M;
    a.setManual();
    a.start(hero);
    a.dismiss();
    let deaths = 0;
    const respawn = M.respawn;
    M.respawn = () => { deaths++; return respawn(); };
    let jumping = 0;
    let frames = 0;
    let previous = '';
    const milestones = [];
    const recent = [];
    for (; frames < 18000 && M.state !== 'ending'; frames++) {
      if (M.state === 'dialogue') {
        M.nextDialogue();
        M.update(M.STEP);
        continue;
      }
      if (M.state !== 'play') break;
      const s = M.session;
      const p = s.player;
      const milestone = s.zone + ':' + s.fichas.length + ':' + (s.boss?.dead ? 'boss-done' : s.boss?.active ? 'boss' : 'route');
      if (milestone !== previous) {
        milestones.push({ frame: frames, milestone, hp: Math.round(p.hp), energy: Math.round(p.energy), x: Math.round(p.x), deaths });
        previous = milestone;
      }
      const rescue = s.rescues.find(r => !r.done);
      let target = rescue?.x ?? (s.boss && !s.boss.dead ? s.boss.x - 170 : (s.cols - 4) * M.T);
      let enemy = null;
      if (s.boss?.active) enemy = s.boss;
      else {
        const candidates = s.enemies.filter(e => !e.dead && Math.abs(e.x - p.x) < 245 && (!e.routeId || Math.abs(e.baseY - p.y) < 125) && (e.x > p.x - 150 || rescue?.started));
        candidates.sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x));
        enemy = candidates[0] || null;
      }
      let direction = Math.sign(target - p.x), dropThrough = false;
      if (enemy) {
        const distance = Math.abs(enemy.x - p.x);
        dropThrough = p.onGround && enemy.y - p.y > 65 && M.oneWayAt(Math.floor(p.x / M.T), Math.floor((p.y + .5) / M.T));
        direction = distance > 68 ? Math.sign(enemy.x - p.x) : distance < 44 ? -Math.sign(enemy.x - p.x) : 0;
        if (s.boss?.active && enemy.st === 'warn' && enemy.attack === 0 && enemy.id === 'matahombres') direction = -Math.sign(enemy.x - p.x);
        if (distance < 80 && !direction && p.face !== Math.sign(enemy.x - p.x)) direction = Math.sign(enemy.x - p.x);
        if (p.energy >= 100 && distance < 145 && p.onGround) M.input('KeyV', frames % 10 === 0);
        else M.input('KeyV', false);
        if (p.onGround && jumping === 0) {
          const highEnemy = !['carabinero','matahombres'].includes(enemy.id) && enemy.y < 390;
          const charge = s.boss?.active && enemy.id === 'carabinero' && enemy.st === 'warn' && enemy.attack === 0 && enemy.tm < .22;
          const wave = s.boss?.active && enemy.id === 'matahombres' && enemy.st === 'warn' && enemy.attack === 2 && enemy.tm < .12;
          if ((highEnemy && distance < 115) || charge || wave) jumping = 18;
        }
      } else M.input('KeyV', false);
      const moving = direction || p.face;
      const ahead = Math.floor((p.x + moving * 43) / M.T);
      const floorRow = Math.floor((p.y + .5) / M.T); const wallAhead = M.solidAt(ahead, floorRow - 1); let supportAhead = false; for(let r = floorRow; r < 12; r++) supportAhead ||= M.solidAt(ahead, r) || M.oneWayAt(ahead, r);
      const approachingShot = s.shots.some(shot => Math.abs(shot.x - p.x) < 95 && shot.y > p.y - 65 && shot.y < p.y + 10 && (shot.x - p.x) * shot.vx < 0);
      if (p.onGround && jumping === 0 && (((!supportAhead && Math.abs(p.vx) > 5) || wallAhead || p.hitWall) || approachingShot)) jumping = 18;
      M.input('ArrowDown', !!dropThrough);
      M.input('Space', dropThrough || jumping > 0);
      if (jumping > 0) jumping--;
      M.input('ArrowRight', direction > 0);
      M.input('ArrowLeft', direction < 0);
      M.input('KeyZ', true);
      const interact = frames % 20 === 0 && ((rescue && !rescue.started && Math.abs(rescue.x - p.x) < 85) || (!rescue && s.boss && !s.boss.active && !s.boss.dead && Math.abs(s.boss.x - p.x) < 215) || (!rescue && (!s.boss || s.boss.dead) && p.x > (s.cols - 5) * M.T));
      M.input('KeyE', !!interact);
      M.update(M.STEP);
      if (frames % 120 === 0) {
        recent.push({ frame: frames, zone: s.zone, x: Math.round(p.x), y: Math.round(p.y), hp: Math.round(p.hp), target: Math.round(target), enemy: enemy?.id, enemyHP: enemy?.hp });
        if (recent.length > 15) recent.shift();
      }
    }
    M.clearInput();
    M.render();
    return { completed: M.state === 'ending', frames, simulatedSeconds: Math.round(frames / 60), deaths, milestones, recent, final: a.snapshot(), combatAssists: false, navigationTeleports: false };
  }, hero);
  await page.screenshot({ path: path.join(__dirname, '../qa/09_partida_'+hero+'_sin_ayudas.png'), fullPage: true });
  fs.writeFileSync(path.join(__dirname, '../qa/'+(process.argv[2]?'partida_'+hero+'_sin_ayudas.json':'partida_sin_ayudas.json')), JSON.stringify({ ...result, errors }, null, 2));
  assert(result.completed, 'La partida con '+hero+' no llegó al final'); assert.deepEqual(errors, []); console.log(JSON.stringify({hero,completed:result.completed,simulatedSeconds:result.simulatedSeconds,deaths:result.deaths,health:result.final.player.hp,errors},null,2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });



