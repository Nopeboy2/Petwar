// Màn chiến đấu. KHÔNG tự tính luật: chỉ gọi engine rồi phát lại danh sách sự kiện (ev).
import { createGame, ready, step, useUlt, checkEnd, snapshot } from '../engine.js';
import { ATK_NAME } from '../data/bosses.js';
const atkImg = t => `assets/boss-ui/icon_atk_${t}.webp`;
import { sfx, vibrate } from './audio.js';
import { petImg, bossArt, pui } from '../data/art.js';
import { ELEM } from '../data/elements.js';
import { ROLE } from '../data/pets.js';

const EMOJI = ['⚔️', '💗', '🌀', '🛡️', '🔥'];
const FAST = new URLSearchParams(location.search).has('fast'); // bỏ chờ hoạt ảnh (dùng cho autotest)
const sleep = ms => new Promise(r => setTimeout(r, FAST ? 0 : ms));

export function startBattle({ root, cfg, team, boss, onEnd, onExit, seedVal }) {
  const R = cfg.rows, C = cfg.cols;
  const s = createGame(cfg, team, boss, seedVal ?? Date.now());
  let view = Int8Array.from(s.g), vmul = Uint8Array.from(s.mu), legal = ready(s), busy = false, paused = false, sel = null, down = null, hintT = 0, dead = false;

  // Bố cục: design/briefs/06-battle.md — khung 844×390 (phóng theo màn như các màn khác): trái = 3 pet, giữa = bàn cờ, phải = boss. Chạm pet khi nộ đầy = ULT.
  root.innerHTML = `
  <div class="stage-wrap"${boss.el ? ` style="background-image:url(assets/battle/bg_${boss.el}.webp)"` : ''}><div class="stage"><div class="battle">
      <button id="b-pause" aria-label="Tạm dừng">⏸</button><span id="b-moves"></span><span id="b-sum"></span>
      ${team.map((p, i) => `
      <div class="pet p${i}" data-i="${i}">
        <div class="pe">${petImg(p) ? `<img src="${petImg(p, 'idle', true)}" alt="${p.n}">` : p.e}<button class="ult" aria-label="ULT ${p.n}">ULT</button><span class="ag" title="Tỉ lệ bị boss nhắm"></span></div>
        <div class="pi"><div class="pn">${p.el ? `<img src="${pui('icon_el_' + p.el)}" alt="${ELEM[p.el].n}" title="Hệ ${ELEM[p.el].n}">` : ''}${p.r ? `<img src="${pui('icon_role_' + p.r.toLowerCase() + '_round')}" alt="${ROLE[p.r]}" title="${ROLE[p.r]}">` : ''}<span class="nm">${p.n}</span><span class="tg">${s.pets[i].adv ? '<b class="up" title="Khắc boss">▲</b>' : s.pets[i].dis ? '<b class="down" title="Bị boss khắc">▼</b>' : ''}${s.pets[i].sinh ? '<i title="Được pet cạnh tương sinh">🌱</i>' : ''}</span></div>
          <div class="bar hp" title="Máu"><i></i><span class="hpv"></span></div>
          <div class="bar sh" title="Khiên: chặn sát thương trước khi trừ máu"><i></i><span class="shv"></span></div>
          <div class="bar rg" title="Nộ: đầy thì chạm pet để dùng ULT"><i></i><span class="rgv"></span></div></div>
      </div>`).join('')}
      <div class="board-wrap"><div id="board">${Array.from({ length: R * C }, (_, i) => `<div class="cell" data-i="${i}"><div class="gem"></div></div>`).join('')}</div></div>
      <div class="bossp">
        <div class="bh"><div class="bn">${boss.el ? `<img src="${pui('icon_el_' + boss.el)}" alt="Hệ ${ELEM[boss.el].n}" title="Hệ ${ELEM[boss.el].n}">` : ''}${boss.n}${boss.lv ? ` · Lv ${boss.lv}` : ''}</div>
          <div class="bar"><i></i><span id="b-hp"></span></div><div class="stun" title="Choáng">${'<u></u>'.repeat(boss.stun)}</div></div>
        <div class="be">${bossArt(boss)}</div>
        <div class="status" id="b-status"></div><div class="next" id="b-next"></div>
      </div>
  </div></div></div>`;
  const $ = q => root.querySelector(q), board = $("#board"), wrap = $(".board-wrap");
  const cells = [...board.children], petEls = [...root.querySelectorAll('.pet')], bossEl = $('.bossp');

  // ── vẽ ──
  function renderBoard(grid, fall) {
    cells.forEach((c, i) => {
      const gem = c.firstChild, t = grid[i], k = vmul[i] || 1, key = t + ':' + k; // k = hệ số viên (x2/x3)
      if (gem.dataset.t !== key) { gem.dataset.t = key; gem.className = 'gem g' + t; gem.innerHTML = `<span class="em">${EMOJI[t]}</span>${k > 1 ? `<b class="mx m${k}">x${k}</b>` : ''}`; }
      else gem.className = 'gem g' + t;
      if (fall && fall.has(i)) { void gem.offsetWidth; gem.classList.add('fall'); }
    });
  }
  function hud(sn) {
    sn.pets.forEach((p, i) => { if (p.hp <= 0 && !(lastSnap && lastSnap.pets[i].hp <= 0)) pose(i, 'down'); });
    lastSnap = sn;
    const alive = sn.pets.filter(p => p.hp > 0), tot = alive.reduce((a, p, k) => a + team[sn.pets.indexOf(p)].ag, 0);
    sn.pets.forEach((p, i) => {
      const el = petEls[i];
      el.classList.toggle('dead', p.hp <= 0);
      el.querySelector('.hp i').style.width = (100 * p.hp / p.max) + '%';
      el.querySelector('.sh i').style.width = Math.min(100, 100 * p.sh / (cfg.shieldCap * p.max)) + '%';
      el.querySelector('.rg i').style.width = (100 * p.rage / cfg.rageMax) + '%';
      el.querySelector('.hpv').textContent = Math.ceil(p.hp) + ' / ' + p.max;
      el.querySelector('.shv').textContent = '🛡 ' + Math.round(p.sh);
      el.querySelector('.rgv').textContent = '🔥 ' + Math.round(p.rage) + ' / ' + cfg.rageMax;
      el.querySelector('.ag').textContent = p.hp > 0 ? '🎯' + Math.round(100 * team[i].ag / tot) + '%' : '✖';
    });
    bossEl.querySelector('.bar i').style.width = (100 * Math.max(0, sn.hp) / boss.hp) + '%';
    $('#b-hp').textContent = Math.max(0, Math.round(sn.hp)).toLocaleString('vi-VN') + ' / ' + boss.hp.toLocaleString('vi-VN');
    [...bossEl.querySelectorAll('.stun u')].forEach((u, k) => u.classList.toggle('f', k < sn.bar));
    $('#b-next').innerHTML = `Đòn kế: <img class="atk-ic" src="${atkImg(sn.next)}" alt="">${ATK_NAME[sn.next]}`;
    $('#b-status').textContent = sn.vuln ? '💫 CHOÁNG +50% dame' : '';
    $('#b-moves').textContent = `Lượt ${sn.moves}/${cfg.maxMoves}`;
    updateUlt(sn);
  }
  function updateUlt(sn = snapshot(s)) {
    sn.pets.forEach((p, i) => { const r = p.hp > 0 && p.rage >= cfg.rageMax && !busy && !s.over && !paused; petEls[i].querySelector('.ult').className = 'ult' + (r ? ' ready' : ''); petEls[i].classList.toggle('rdy', r); });
  }
  // số bay lên; nhiều số cùng lúc trên một ô thì xếp chồng xuống dưới để không đè nhau
  // tư thế pet (ảnh): đổi ảnh + hiệu ứng CSS, tự về đứng/gục sau ms. Pet chưa có ảnh thì bỏ qua.
  let lastSnap = null; const poseT = [];
  function pose(i, name, ms) {
    const img = petEls[i].querySelector('.pe img'); if (!img) return;
    clearTimeout(poseT[i]); img.src = petImg(team[i], name, true); img.className = 'ps-' + name;
    if (ms) poseT[i] = setTimeout(() => pose(i, lastSnap && lastSnap.pets[i].hp <= 0 ? 'down' : 'idle'), ms);
  }
  // Tư thế boss: idle | attack | hurt | stun | down (assets/bosses/boss_<id>_<tư thế>.webp). bBase = tư thế nền sau khi hết tư thế tạm.
  const bImg = bossEl.querySelector('.ba'); let bBase = 'idle', bT = 0;
  function bpose(name, ms) {
    if (!boss.img || bBase === 'down') return;
    clearTimeout(bT); bImg.src = boss.img.replace('_idle.', '_' + name + '.'); bImg.classList.toggle('bp-down', name === 'down');
    if (ms) bT = setTimeout(() => bpose(bBase), ms);
  }
  const bset = name => { bpose(name); bBase = name; };
  if (boss.img) ['attack', 'hurt', 'stun', 'down'].forEach(k => { new Image().src = boss.img.replace('_idle.', '_' + k + '.'); });
  team.forEach(p => ['attack', 'hurt', 'ult', 'down', 'happy'].forEach(k => { const src = petImg(p, k, true); if (src) new Image().src = src; })); // tải trước

  const float = (el, text, cls) => {
    const f = document.createElement('div'); f.className = 'float ' + cls; f.textContent = text;
    const n = el.querySelectorAll('.float').length; // nhiều số cùng lúc: boss xếp xuống dưới, pet xếp lên trên (sát mép trên ô chỉ số, top 14 = mép trên ô 76 trong hàng 104)
    f.style.top = el.classList.contains('pet') ? (-4 - 17 * n) + 'px' : (12 + 22 * n) + '%';
    el.appendChild(f); setTimeout(() => f.remove(), 1300);
  };
  const toast = (t, img) => { const e = document.createElement('div'); e.className = 'toast'; e.textContent = t; if (img) e.prepend(Object.assign(new Image(), { src: img, alt: '', className: 'atk-ic' })); wrap.appendChild(e); setTimeout(() => e.remove(), 1150); };
  const setBusy = b => { busy = b; updateUlt(); };

  // ── hoạt ảnh đổi chỗ: keep=true thì đổi thật dữ liệu hiển thị ──
  async function swapAnim(a, b, keep) {
    const ga = cells[a].firstChild, gb = cells[b].firstChild;
    const dx = (b % C) - (a % C), dy = Math.floor(b / C) - Math.floor(a / C);
    ga.classList.add('sw'); gb.classList.add('sw');
    ga.style.transform = `translate(${dx * 100}%,${dy * 100}%)`; gb.style.transform = `translate(${-dx * 100}%,${-dy * 100}%)`;
    await sleep(160);
    if (keep) { ga.classList.remove('sw'); gb.classList.remove('sw'); }
    ga.style.transform = gb.style.transform = '';
    if (keep) { [view[a], view[b]] = [view[b], view[a]]; [vmul[a], vmul[b]] = [vmul[b], vmul[a]]; renderBoard(view); }
    else { await sleep(160); ga.classList.remove('sw'); gb.classList.remove('sw'); }
  }

  // ── phát lại sự kiện từ engine ──
  async function playEvents(ev) {
    for (const e of ev) {
      switch (e.t) {
        case 'swap': await swapAnim(e.a, e.b, true); sfx('swap'); break;
        case 'wave': {
          e.cleared.forEach(i => cells[i].firstChild.classList.add('pop'));
          if (e.w > 0) toast('COMBO x' + e.mult);
          sfx('pop', e.w); await sleep(220);
          const fall = new Set(); for (let i = 0; i < view.length; i++) if (view[i] !== e.after[i] || vmul[i] !== e.mul[i]) fall.add(i);
          view = Int8Array.from(e.after); vmul = Uint8Array.from(e.mul); renderBoard(view, fall); await sleep(300); break;
        }
        case 'dmg': lastSnap.pets.forEach((p, i) => p.hp > 0 && pose(i, 'attack', 450)); float(bossEl, '-' + Math.round(e.amount), e.vuln ? 'crit' : 'dmg'); bossEl.classList.add('hurt'); setTimeout(() => bossEl.classList.remove('hurt'), 260); bpose('hurt', 400); sfx('hit'); await sleep(250); break;
        case 'sum': {
          const c = e.cnt, part = (k, t) => c[k] ? `${EMOJI[k]}${c[k]}${t ? ' ' + t : ''}` : '';
          $('#b-sum').textContent = [part(0, e.dmg ? '-' + Math.round(e.dmg) : ''), part(1), part(3), part(2), part(4), e.waves > 1 ? `combo x${e.mult}` : ''].filter(Boolean).join(' · ');
          break;
        }
        case 'heal': float(petEls[e.i], '💗+' + Math.round(e.amount), 'heal'); sfx('heal'); await sleep(120); break;
        case 'shield': e.add.forEach(a => float(petEls[a.i], a.amount >= 1 ? '🛡️+' + Math.round(a.amount) : '🛡️ đầy', 'info')); await sleep(120); break;
        case 'rage': e.add.forEach(a => float(petEls[a.i], a.amount >= 1 ? '🔥+' + Math.round(a.amount) : '🔥 đầy', 'rage')); await sleep(120); break;
        case 'stun': float(bossEl, e.immune ? '🌀 miễn nhiễm' : e.full ? '🌀 ĐẦY!' : '🌀+' + e.n, 'stunf'); if (e.full) bset('stun'); await sleep(120); break;
        case 'snap': hud(e.snap); await sleep(150); break;
        case 'bossSkip': toast('💫 Boss bị choáng!'); sfx('stun'); await sleep(700); bset('idle'); break;
        case 'bossAtk':
          toast(ATK_NAME[e.type], atkImg(e.type)); bossEl.classList.add('atk'); bpose('attack', 700); await sleep(350); bossEl.classList.remove('atk');
          e.hits.forEach(h => { const el = petEls[h.i]; float(el, h.dmg < 1 ? '🛡️ chặn' : '-' + Math.round(h.dmg), 'hurtnum'); el.classList.add('shake', 'hurt'); if (lastSnap.pets[h.i].hp > 0) pose(h.i, 'hurt', 450); setTimeout(() => el.classList.remove('shake', 'hurt'), 320); });
          sfx('boss'); vibrate(40); await sleep(550); break;
      }
    }
  }

  // ── một nước đi ──
  async function play(a, b) {
    if (busy || paused || s.over || dead) return false;
    clearSel(); clearHint(); setBusy(true);
    const ok = legal.some(m => (m[0] === a && m[1] === b) || (m[0] === b && m[1] === a));
    if (!ok) { sfx('bad'); await swapAnim(a, b, false); setBusy(false); armHint(); return false; }
    const ev = []; step(s, [a, b], ev);
    await playEvents(ev);
    if (s.over) { finish(); return true; }
    const ev2 = []; s.ev = ev2; legal = ready(s); s.ev = null;
    if (ev2.length) { toast('Xáo bàn'); view = Int8Array.from(s.g); vmul = Uint8Array.from(s.mu); renderBoard(view); }
    setBusy(false); armHint(); return true;
  }
  async function ult(i) {
    const p = s.pets[i];
    if (busy || paused || s.over || p.hp <= 0 || p.rage < cfg.rageMax) return;
    clearHint(); setBusy(true);
    const ev = []; s.ev = ev; useUlt(s, p); s.ev = null; checkEnd(s);
    for (const e of ev) {
      if (e.t === 'ult') {
        sfx('ult'); pose(e.i, 'ult', 800);
        if (e.k === 'nuke') { float(bossEl, '-' + Math.round(e.dmg), 'crit'); bossEl.classList.add('hurt'); setTimeout(() => bossEl.classList.remove('hurt'), 260); bpose('hurt', 400); }
        else petEls.forEach((el, k) => s.pets[k].hp > 0 && float(el, e.k === 'heal' ? '💚' : '🛡️', e.k === 'heal' ? 'heal' : 'info'));
        toast(p.e + ' ' + p.n + '!'); await sleep(500);
      } else if (e.t === 'snap') hud(e.snap);
    }
    if (s.over) { finish(); return; }
    setBusy(false); armHint();
  }
  function finish() {
    const win = s.over === 'win';
    sfx(win ? 'win' : 'lose'); setBusy(true);
    if (win) bset('down');
    if (win) s.pets.forEach((p, i) => p.hp > 0 && pose(i, 'happy'));
    setTimeout(() => !dead && onEnd({ win, moves: s.moves, hpLeft: s.pets.reduce((a, p) => a + Math.max(0, p.hp), 0) / s.pets.reduce((a, p) => a + p.max, 0), dead: s.pets.filter(p => p.hp <= 0).length, ults: s.ults, stuns: s.stuns }), FAST ? 0 : 900);
  }

  // ── gợi ý & chọn ô ──
  function clearHint() { clearTimeout(hintT); cells.forEach(c => c.firstChild.classList.remove('hint')); }
  function armHint() { clearHint(); hintT = setTimeout(() => { if (busy || paused || s.over || !legal.length) return; const m = legal[(Math.random() * legal.length) | 0]; m.forEach(i => cells[i].firstChild.classList.add('hint')); }, 5000); }
  function clearSel() { if (sel != null) cells[sel].classList.remove('sel'); sel = null; }
  const adj = (a, b) => Math.abs((a % C) - (b % C)) + Math.abs(Math.floor(a / C) - Math.floor(b / C)) === 1;

  // ── vuốt / chạm ──
  function idxAt(e) {
    const r = board.getBoundingClientRect(), c = Math.floor((e.clientX - r.left) / (r.width / C)), rw = Math.floor((e.clientY - r.top) / (r.height / R));
    return c < 0 || c >= C || rw < 0 || rw >= R ? -1 : rw * C + c;
  }
  board.addEventListener('pointerdown', e => {
    if (busy || paused || s.over) return; const i = idxAt(e); if (i < 0) return;
    down = { i, x: e.clientX, y: e.clientY, moved: false }; try { board.setPointerCapture(e.pointerId); } catch { /* bỏ qua */ } clearHint();
  });
  board.addEventListener('pointermove', e => {
    if (!down || down.moved) return;
    const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.hypot(dx, dy) < board.clientWidth / C * 0.35) return;
    down.moved = true;
    let c = down.i % C, r = Math.floor(down.i / C);
    if (Math.abs(dx) > Math.abs(dy)) c += dx > 0 ? 1 : -1; else r += dy > 0 ? 1 : -1;
    if (c < 0 || c >= C || r < 0 || r >= R) return;
    play(down.i, r * C + c);
  });
  board.addEventListener('pointerup', () => {
    if (!down) return; const d = down; down = null; if (d.moved || busy) return;
    if (sel == null) { sel = d.i; cells[sel].classList.add('sel'); }
    else if (sel === d.i) clearSel();
    else if (adj(sel, d.i)) { const a = sel; clearSel(); play(a, d.i); }
    else { clearSel(); sel = d.i; cells[sel].classList.add('sel'); }
  });
  board.addEventListener('pointercancel', () => { down = null; });
  petEls.forEach((el, i) => el.addEventListener('click', () => ult(i))); // chạm cả pet (nhãn ULT chỉ để báo)

  // ── tạm dừng ──
  $('#b-pause').addEventListener('click', () => {
    if (paused || s.over) return; paused = true; clearHint(); updateUlt();
    const m = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<div class="box"><h3>Tạm dừng</h3><button class="primary" data-r>Tiếp tục</button><button data-q>Bỏ cuộc</button></div>`;
    m.querySelector('[data-r]').onclick = () => { m.remove(); paused = false; updateUlt(); armHint(); };
    m.querySelector('[data-q]').onclick = () => { dead = true; clearHint(); onExit(); };
    root.querySelector('.battle').appendChild(m);
  });

  renderBoard(view); hud(snapshot(s)); armHint();
  return { s, play, ult, getLegal: () => legal, isBusy: () => busy, destroy() { dead = true; clearHint(); } };
}
