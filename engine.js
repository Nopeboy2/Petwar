// LUẬT GAME — dùng chung cho sim.js (Node) và giao diện web. Không đụng DOM ở đây.
// Giao diện chỉ phát lại danh sách sự kiện (ev) mà step()/useUlt() ghi ra.

// ───────────── RNG (có seed → lặp lại được) ─────────────
let _s = 1;
export const seed = n => { _s = (n >>> 0) || 1; };
export function rnd() {
  _s = (_s + 0x6D2B79F5) >>> 0; let t = _s;
  t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function pickW(w) { let r = rnd() * w.reduce((a, b) => a + b, 0); for (let i = 0; i < w.length; i++) if ((r -= w[i]) < 0) return i; return w.length - 1; }

// ───────────── BÀN MATCH-3 ─────────────
const rg = cfg => pickW(cfg.weights);
export function matches(g, R, C) {
  const m = new Uint8Array(R * C);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const i = r * C + c, t = g[i]; if (t < 0) continue;
    if (c <= C - 3 && g[i + 1] === t && g[i + 2] === t) m[i] = m[i + 1] = m[i + 2] = 1;
    if (r <= R - 3 && g[i + C] === t && g[i + 2 * C] === t) m[i] = m[i + C] = m[i + 2 * C] = 1;
  }
  return m;
}
// mu (tuỳ chọn): hệ số viên song song với g (1 | 2 | 3), rơi theo viên; mf() = hệ số cho viên mới
function drop(g, R, C, cfg, refill, mu, mf) {
  for (let c = 0; c < C; c++) {
    let w = R - 1;
    for (let r = R - 1; r >= 0; r--) { const i = r * C + c, v = g[i]; if (v >= 0) { g[i] = -1; g[w * C + c] = v; if (mu) { const k = mu[i]; mu[i] = 1; mu[w * C + c] = k; } w--; } }
    for (; w >= 0; w--) { g[w * C + c] = refill ? rg(cfg) : -1; if (mu) mu[w * C + c] = refill && mf ? mf() : 1; }
  }
}
// Ăn hết dây chuyền; trả về mảng đợt, mỗi đợt = số viên theo loại.
// rec (tuỳ chọn): mảng nhận {cleared, after} mỗi đợt để giao diện hoạt ảnh.
// mu/mf (tuỳ chọn): viên x2/x3 tính 2/3 viên khi ăn (xem mulRoll)
export function resolve(g, cfg, refill, rec, mu, mf) {
  const R = cfg.rows, C = cfg.cols, waves = [];
  for (;;) {
    const m = matches(g, R, C), cnt = [0, 0, 0, 0, 0], cleared = [];
    for (let i = 0; i < m.length; i++) if (m[i]) { cnt[g[i]] += mu ? mu[i] : 1; g[i] = -1; if (mu) mu[i] = 1; cleared.push(i); }
    if (!cleared.length) return waves;
    waves.push(cnt); drop(g, R, C, cfg, refill, mu, mf);
    if (rec) rec.push({ cleared, after: Int8Array.from(g), mul: mu ? Uint8Array.from(mu) : null });
  }
}
// Viên x2/x3 (cfg.mulGem): trận càng dài, viên mới rơi xuống càng hay mang hệ số — giúp kết thúc trận kéo dài
export function mulRoll(s) {
  const M = s.cfg.mulGem; if (!M) return 1;
  const n = s.moves, p3 = Math.min(M.max3, Math.max(0, (n - M.from3) * M.step3)), p2 = Math.min(M.max2, Math.max(0, (n - M.from2) * M.step2));
  const r = rnd(); return r < p3 ? 3 : r < p3 + p2 ? 2 : 1;
}
export function legalMoves(g, cfg) {
  const R = cfg.rows, C = cfg.cols, out = [];
  const test = (a, b) => {
    [g[a], g[b]] = [g[b], g[a]];
    const ok = matches(g, R, C).some(x => x);
    [g[a], g[b]] = [g[b], g[a]];
    if (ok) out.push([a, b]);
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const i = r * C + c;
    if (c < C - 1) test(i, i + 1);
    if (r < R - 1) test(i, i + C);
  }
  return out;
}
export function newBoard(cfg) {
  const R = cfg.rows, C = cfg.cols;
  for (;;) {
    const g = Int8Array.from({ length: R * C }, () => rg(cfg));
    if (!matches(g, R, C).some(x => x) && legalMoves(g, cfg).length) return g;
  }
}
export const evalMove = (g, mv, cfg) => {
  const h = Int8Array.from(g); [h[mv[0]], h[mv[1]]] = [h[mv[1]], h[mv[0]]];
  return resolve(h, cfg, false);
};
export const chainAt = (cfg, w) => cfg.chain[Math.min(w, cfg.chain.length - 1)];

// ───────────── TRẠNG THÁI & CHIẾN ĐẤU ─────────────
export const alive = s => s.pets.filter(p => p.hp > 0);
const on = (cfg, k) => !cfg.off.includes(k);
export const nextAttack = s => s.boss.pat[s.idx % s.boss.pat.length];
export const snapshot = s => ({
  hp: s.hp, bar: s.bar, moves: s.moves, vuln: s.vuln, immune: s.immune, next: nextAttack(s),
  pets: s.pets.map(p => ({ hp: Math.max(0, p.hp), max: p.max, sh: p.sh, rage: p.rage })),
});

// ───────────── NGŨ HÀNH ─────────────
export const KHAC = { kim: 'moc', moc: 'tho', tho: 'thuy', thuy: 'hoa', hoa: 'kim' }; // A khắc KHAC[A]
export const SINH = { moc: 'hoa', hoa: 'tho', tho: 'kim', kim: 'thuy', thuy: 'moc' }; // A sinh SINH[A]
// Hệ số theo hệ cho từng pet trong đội (theo thứ tự cột) khi đánh boss. Pet/boss không có hệ → 1.
export function elemMods(cfg, team, boss) {
  const E = cfg.elem;
  return team.map((p, i) => {
    const e = p.el, b = boss.el, adv = !!(e && b && KHAC[e] === b), dis = !!(e && b && KHAC[b] === e);
    const sinh = [i - 1, i + 1].filter(j => team[j] && team[j].el && SINH[team[j].el] === e).length;
    return { adv, dis, sinh, atkM: (adv ? E.adv : dis ? E.dis : 1) * (1 + E.sinh * sinh), defM: dis ? E.hurtUp : adv ? E.hurtDown : 1 };
  });
}

export function createGame(cfg, team, boss, sd) {
  seed(sd);
  const mods = elemMods(cfg, team, boss);
  const s = { cfg, boss, hp: boss.hp, bar: 0, skip: false, vuln: false, immune: false, idx: 0, moves: 0, ults: 0, stuns: 0, taken: 0,
    gems: [0, 0, 0, 0, 0], over: null, ev: null, next: null,
    pets: team.map((p, i) => ({ ...p, max: p.hp, sh: 0, rage: 0, ...mods[i] })) };
  s.g = newBoard(cfg); s.mu = new Uint8Array(s.g.length).fill(1);
  return s;
}
// Gọi trước mỗi nước đi: đảm bảo bàn còn nước hợp lệ (xáo nếu hết), trả về danh sách nước.
export function ready(s) {
  let mv = legalMoves(s.g, s.cfg);
  while (!mv.length) { s.g = newBoard(s.cfg); s.mu.fill(1); mv = legalMoves(s.g, s.cfg); if (s.ev) s.ev.push({ t: 'reshuffle' }); }
  s.next = nextAttack(s);
  return mv;
}
// Thắng khi HP boss ≤ 0 (gọi sau ult). Trả true nếu đã thắng.
export function checkEnd(s) { if (s.hp <= 0) s.over = 'win'; return s.over === 'win'; }

function hit(s, i, raw, hits) {
  const p = s.pets[i], cfg = s.cfg;
  let d = raw * p.defM * 100 / (100 + p.def); s.taken += d;
  const blocked = Math.min(p.sh, d); p.sh -= blocked; d -= blocked;
  p.hp -= d;
  p.rage = Math.min(cfg.rageMax, p.rage + cfg.ragePerHit); // trúng đòn (kể cả khiên đỡ hết) vẫn +nộ
  if (hits) hits.push({ i, dmg: d, blocked });
}
function bossAttack(s) {
  const { cfg, boss } = s, type = boss.pat[s.idx++ % boss.pat.length], hits = s.ev ? [] : null;
  const A = alive(s), tot = A.reduce((a, p) => a + p.ag, 0);
  let r = rnd() * tot, t = A[A.length - 1];
  for (const p of A) if ((r -= p.ag) < 0) { t = p; break; }
  const slot = s.pets.indexOf(t);
  if (type === 'single') hit(s, slot, boss.atk * cfg.mult.single, hits);
  else if (type === 'aoe') A.forEach(p => hit(s, s.pets.indexOf(p), boss.atk * cfg.mult.aoe, hits));
  else { // blast: mục tiêu + pet liền kề (theo ô cột), pet chết thì bỏ qua
    hit(s, slot, boss.atk * cfg.mult.blastMain, hits);
    for (const k of [slot - 1, slot + 1]) { const q = s.pets[k]; if (q && q.hp > 0) hit(s, k, boss.atk * cfg.mult.blastSide, hits); }
  }
  if (s.ev) s.ev.push({ t: 'bossAtk', type, target: slot, hits });
}
export function useUlt(s, p) {
  const { k, v } = p.ult; p.rage = 0; s.ults++;
  let dmg = 0;
  if (k === 'nuke') { dmg = p.atk * p.atkM * v * (s.vuln ? 1 + s.cfg.stunBonus : 1); s.hp -= dmg; }
  else for (const q of alive(s)) { if (k === 'heal') q.hp = Math.min(q.max, q.hp + v * q.max); else q.sh += v * q.max; }
  if (s.ev) s.ev.push({ t: 'ult', i: s.pets.indexOf(p), k, v, dmg }, { t: 'snap', snap: snapshot(s) });
}

// Một nước đi của người chơi + phản ứng của boss. ev (tuỳ chọn) nhận danh sách sự kiện.
export function step(s, m, ev) {
  const cfg = s.cfg, g = s.g; s.ev = ev || null;
  [g[m[0]], g[m[1]]] = [g[m[1]], g[m[0]]]; [s.mu[m[0]], s.mu[m[1]]] = [s.mu[m[1]], s.mu[m[0]]];
  if (ev) ev.push({ t: 'swap', a: m[0], b: m[1] });
  const rec = ev ? [] : null;
  const waves = resolve(g, cfg, true, rec, s.mu, () => mulRoll(s)); s.moves++;
  const cnt = [0, 0, 0, 0, 0]; let sw = 0;
  waves.forEach((c, w) => {
    for (let k = 0; k < 5; k++) cnt[k] += c[k];
    sw += c[0] * chainAt(cfg, w);
    if (ev) ev.push({ t: 'wave', w, cnt: c, mult: chainAt(cfg, w), cleared: rec[w].cleared, after: rec[w].after, mul: rec[w].mul });
  });
  cnt.forEach((c, k) => s.gems[k] += c);
  const A = alive(s);
  let dmg = 0;
  if (on(cfg, 0)) {
    dmg = sw * A.reduce((a, p) => a + p.atk * p.atkM, 0) * (s.vuln ? 1 + cfg.stunBonus : 1);
    s.hp -= dmg; if (ev && dmg) ev.push({ t: 'dmg', amount: dmg, vuln: s.vuln });
  }
  if (ev) ev.push({ t: 'sum', cnt, dmg, mult: chainAt(cfg, waves.length - 1), waves: waves.length });
  if (on(cfg, 1) && cnt[1]) {
    const w = A.reduce((a, b) => a.hp / a.max <= b.hp / b.max ? a : b), before = w.hp;
    w.hp = Math.min(w.max, w.hp + cnt[1] * cfg.heartPct * w.max);
    if (ev) ev.push({ t: 'heal', i: s.pets.indexOf(w), amount: w.hp - before });
  }
  if (on(cfg, 3) && cnt[3]) {
    const add = A.map(p => { const b = p.sh; p.sh = Math.min(cfg.shieldCap * p.max, p.sh + cnt[3] * cfg.shieldPct * p.max); return { i: s.pets.indexOf(p), amount: p.sh - b }; });
    if (ev) ev.push({ t: 'shield', n: cnt[3], add });
  }
  if (on(cfg, 4) && cnt[4]) {
    const add = A.map(p => { const b = p.rage; p.rage = Math.min(cfg.rageMax, p.rage + cnt[4] * cfg.firePerGem); return { i: s.pets.indexOf(p), amount: p.rage - b }; });
    if (ev) ev.push({ t: 'rage', n: cnt[4], add });
  }
  if (on(cfg, 2) && cnt[2]) {
    if (!s.immune) { s.bar += cnt[2]; if (s.bar >= s.boss.stun) { s.skip = true; s.bar = 0; } }
    if (ev) ev.push({ t: 'stun', n: cnt[2], immune: s.immune, full: s.skip });
  }
  if (s.hp <= 0) { s.over = 'win'; if (ev) ev.push({ t: 'snap', snap: snapshot(s) }, { t: 'end', win: true }); s.ev = null; return; }
  if (ev) ev.push({ t: 'snap', snap: snapshot(s) });
  s.vuln = s.immune = false;                         // hết hiệu lực sau nước đi này
  if (s.skip) { s.skip = false; s.vuln = s.immune = true; s.stuns++; if (ev) ev.push({ t: 'bossSkip' }); } // boss bỏ lượt; nước kế: +50% dame & miễn nhiễm
  else bossAttack(s);
  if (!alive(s).length || s.moves >= cfg.maxMoves) s.over = 'lose';
  if (ev) { ev.push({ t: 'snap', snap: snapshot(s) }); if (s.over) ev.push({ t: 'end', win: false }); }
  s.ev = null;
}

// ───────────── Nâng cấp pet (số ở cfg.up) ─────────────
// Pet ở cấp lv: HP/ATK/DEF × (1 + grow × (lv − 1)); aggro, hệ, ULT giữ nguyên.
export const lvPet = (cfg, p, lv) => { const k = 1 + cfg.up.grow * (lv - 1); return { ...p, lv, hp: Math.round(p.hp * k), atk: Math.round(p.atk * k), def: Math.round(p.def * k) }; };
// Tỉ lệ thành công khi dùng đá cấp tier (0|1|2) cho pet cấp lv, sau `fails` lần trượt liên tiếp.
// tỉ lệ 1 viên đá cấp tier (0..2) khi lên từ lv: đá I cần 1 + cost·(lv−1)² viên cho 100%; II = tierMul đá I, III = tierMul² (node sim.js --rates)
export const upRate = (cfg, tier, lv, fails = 0) => { const u = cfg.up; return Math.min(1, u.tierMul ** tier / (1 + u.cost * (lv - 1) ** 2) + u.pity * fails); };
export const upGold = (cfg, lv) => cfg.up.gold * (lv + 1); // vàng mỗi lần thử lên từ lv → lv+1 (trả cả khi thất bại)
// Tỉ lệ khi bỏ nhiều đá cùng lúc: cộng tỉ lệ từng viên (theo cấp đá) + may mắn, tối đa 100%. picks = [{ t, n }]
export const upTotal = (cfg, picks, lv, fails = 0) => { const s = picks.reduce((a, p) => a + p.n * upRate(cfg, p.t, lv), 0); return s ? Math.min(1, s + cfg.up.pity * fails) : 0; };
// Boss lên cùng cấp trung bình của đội (làm tròn); HP/ATK tăng bossGrow/cấp — chậm hơn pet (grow) nên lên cấp vẫn có lợi (node sim.js --bosslv)
export const teamLv = lvs => Math.max(1, Math.round(lvs.reduce((a, b) => a + b, 0) / (lvs.length || 1)));
export const lvBoss = (cfg, b, lv) => { const k = 1 + cfg.up.bossGrow * (lv - 1); return { ...b, lv, hp: Math.round(b.hp * k), atk: Math.round(b.atk * k) }; };
// Cấp người chơi: thưởng toàn đội (nhân sau cấp pet) · XP cần để lên từ cấp lv
export const plBonus = (cfg, lv) => cfg.player.bonus * (Math.min(lv, cfg.player.maxLv) - 1);
export const xpNeed = (cfg, lv) => cfg.player.xpBase + cfg.player.xpStep * (lv - 1);
export const buffPet = (p, k) => k ? { ...p, hp: Math.round(p.hp * (1 + k)), atk: Math.round(p.atk * (1 + k)), def: Math.round(p.def * (1 + k)) } : p;
