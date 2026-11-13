// Mô phỏng cân bằng Pokiwar-lite.  Chạy: node sim.js [N=200]   (N = số trận / ô thống kê)
// Luật ở engine.js, số cân bằng ở data/*. File này chỉ có bot + báo cáo.
import fs from 'node:fs';
import { CFG, GEM } from './data/config.js';
import { PETS } from './data/pets.js';
import { BOSSES } from './data/bosses.js';
import { lvPet, upRate, upGold, elemMods, seed, rnd, matches, legalMoves as validMoves, newBoard, evalMove, chainAt, alive, createGame, ready, step, useUlt, checkEnd } from './engine.js';
const N = +process.argv[2] || 200;
const DEFAULT_TEAM = [PETS[0], PETS[1], PETS[3]]; // thứ tự cột: Tanker, Hỗ trợ, AD (Rockmane, Tidewisp, Blazefang)

// Một trận do bot chơi, dùng đúng hàm của engine như giao diện web.
function play(cfg, team, boss, pol, sd) {
  const s = createGame(cfg, team, boss, sd);
  while (!s.over) {
    for (const p of s.pets) if (p.hp > 0 && p.rage >= cfg.rageMax && pol.ult(s, p)) useUlt(s, p);
    if (checkEnd(s)) break;
    const mv = ready(s);
    step(s, mv[pol.pick(s, s.g, mv)]);
  }
  const win = s.over === 'win';
  const hpLeft = win ? s.pets.reduce((a, p) => a + Math.max(0, p.hp), 0) / s.pets.reduce((a, p) => a + p.max, 0) : 0;
  return { win, moves: s.moves, hpLeft, dead: s.pets.filter(p => p.hp <= 0).length, ults: s.ults, stuns: s.stuns, taken: s.taken, gems: s.gems };
}

// ───────────── BOT ─────────────
const sumW = (cfg, w) => { const c = [0, 0, 0, 0, 0]; let sw = 0; w.forEach((x, i) => { for (let k = 0; k < 5; k++) c[k] += x[k]; sw += x[0] * chainAt(cfg, i); }); return { c, sw }; };
const alwaysUlt = () => true;
const POL = {
  random: { pick: (s, g, mv) => Math.floor(rnd() * mv.length), ult: alwaysUlt },
  greedy: { // chỉ chọn nước nhiều kiếm nhất
    pick(s, g, mv) { let b = 0, bs = -1; mv.forEach((m, i) => { const { c, sw } = sumW(s.cfg, evalMove(g, m, s.cfg)); const v = sw * 10 + c.reduce((a, x) => a + x, 0); if (v > bs) { bs = v; b = i; } }); return b; },
    ult: alwaysUlt,
  },
  smart: { // heuristic: cân nhắc máu, khiên, thanh choáng, nộ, đòn kế tiếp
    pick(s, g, mv) {
      const A = alive(s), cfg = s.cfg;
      const miss = Math.max(...A.map(p => 1 - p.hp / p.max));
      const shFill = A.reduce((a, p) => a + p.sh / (cfg.shieldCap * p.max), 0) / A.length;
      const heartV = Math.max(0, Math.min(2.5, miss * 3 - 0.3));
      const shV = (1 - Math.min(1, shFill)) * 0.8 * (s.next === 'single' ? 0.7 : 1.2);
      const nearUlt = A.some(p => p.rage >= 100 - 3 * cfg.firePerGem);
      let b = 0, bs = -1e9;
      mv.forEach((m, i) => {
        const { c, sw } = sumW(cfg, evalMove(g, m, cfg));
        let v = sw * (s.vuln ? 1.5 : 1) + c[1] * heartV + c[3] * shV + c[4] * (nearUlt ? 0.9 : 0.3);
        if (!s.immune) v += c[2] * 0.6 + (s.bar + c[2] >= s.boss.stun ? 5 : 0);
        if (v > bs) { bs = v; b = i; }
      });
      return b;
    },
    ult(s, p) {
      const A = alive(s);
      if (p.ult.k === 'nuke') return true;
      if (p.ult.k === 'heal') return A.some(q => q.hp / q.max < 0.55);
      return A.reduce((a, q) => a + q.sh / q.max, 0) / A.length < 0.15;
    },
  },
};

// ───────────── THỐNG KÊ ─────────────
function runMany(cfg, team, boss, pol, n, base = 1) {
  const r = { win: 0, moves: 0, hpLeft: 0, dead: 0, ults: 0, stuns: 0, taken: 0, gems: [0, 0, 0, 0, 0], n };
  for (let i = 0; i < n; i++) {
    const x = play(cfg, team, boss, pol, base * 100003 + i + 1);
    r.win += x.win; r.moves += x.moves; r.dead += x.dead; r.ults += x.ults; r.stuns += x.stuns; r.taken += x.taken;
    if (x.win) r.hpLeft += x.hpLeft; x.gems.forEach((v, k) => r.gems[k] += v);
  }
  const w = r.win || 1;
  return { win: r.win / n, moves: r.moves / n, hpLeft: r.hpLeft / w, dead: r.dead / n, ults: r.ults / n, stuns: r.stuns / n, taken: r.taken / n, gpm: r.gems.map(v => v / r.moves) };
}
const pct = x => (100 * x).toFixed(0).padStart(3) + '%';
const f1 = x => x.toFixed(1).padStart(5);
const H = t => console.log('\n' + '═'.repeat(72) + '\n' + t + '\n' + '═'.repeat(72));

// ───────────── NÂNG CẤP: node sim.js --upgrade [số người chơi ảo = 4000] ─────────────
// 15 boss tương lai (3 boss/đảo, đá rơi cấp = vị trí boss trong đảo), trần cấp = 1 + số boss đã hạ.
// Đội 3 pet; coi đá đã chuyển đúng hệ. Người chơi dùng đá cấp thấp nhất có tỉ lệ ≥ 50%, không có thì cấp cao nhất đang có.
// Đo: số lần ĐÁNH LẠI mỗi boss để cả đội chạm trần (mục tiêu PLAN-V2: mỗi màn 1–2 lần chơi).
if (process.argv.includes('--upgrade')) {
  const P = +process.argv[process.argv.indexOf('--upgrade') + 1] || 4000, U = CFG.up, B = U.maxLv - 1;
  seed(7);
  const run = () => {
    const inv = [0, 0, 0], lv = [1, 1, 1], fail = [0, 0, 0], rep = [];
    for (let k = 1; k <= B; k++) {
      const tier = (k - 1) % 3; inv[tier] += U.drop.first; let r = 0;
      for (;;) {
        for (let i = 0; i < 3; i++) while (lv[i] < k + 1) {
          const own = [0, 1, 2].filter(t => inv[t] > 0); if (!own.length) break;
          const t = own.find(t => upRate(CFG, t, lv[i], fail[i]) >= 0.5) ?? own[own.length - 1];
          inv[t]--; if (rnd() < upRate(CFG, t, lv[i], fail[i])) { lv[i]++; fail[i] = 0; } else fail[i]++;
        }
        if (lv.every(l => l > k) || r > 50) break;
        inv[tier] += U.drop.replay; r++;
      }
      rep.push(r);
    }
    return rep;
  };
  const L = [1, 3, 5, 7, 9, 11, 13, 14];
  console.log('Tỉ lệ thành công (chưa cộng may mắn)\n  cấp pet   ' + L.map(l => ('L' + l).padStart(5)).join(''));
  ['I  ', 'II ', 'III'].forEach((n, t) => console.log(`  đá ${n}    ` + L.map(l => (Math.round(100 * upRate(CFG, t, l)) + '%').padStart(5)).join('')));
  const all = Array.from({ length: P }, run), q = (v, f) => v.slice().sort((a, b) => a - b)[Math.floor(v.length * f)];
  console.log(`\nĐánh lại mỗi boss (${P} người chơi ảo, may mắn +${U.pity * 100}%/lần trượt)\n  boss      ` + Array.from({ length: B }, (_, k) => String(k + 1).padStart(5)).join(''));
  console.log('  TB        ' + Array.from({ length: B }, (_, k) => (all.reduce((a, r) => a + r[k], 0) / P).toFixed(1).padStart(5)).join(''));
  console.log('  90% ≤     ' + Array.from({ length: B }, (_, k) => String(q(all.map(r => r[k]), 0.9)).padStart(5)).join(''));
  const tot = all.map(r => r.reduce((a, b) => a + b, 0));
  console.log(`  cả game: TB ${(tot.reduce((a, b) => a + b, 0) / P).toFixed(1)} · 90% ≤ ${q(tot, 0.9)} · xui nhất ${Math.max(...tot)}`);
  process.exit(0);
}

// ───────────── CHUYỂN HOÁ ĐÁ: node sim.js --convert [người chơi ảo = 3000] ─────────────
// 15 boss tương lai, 5 đảo theo thứ tự Kim·Mộc·Thủy·Hỏa·Thổ (3 boss/đảo, cấp đá = vị trí boss). Đội Thổ·Thủy·Hỏa (đội mặc định).
// Đánh lại: chọn boss đã hạ có lợi nhất cho pet chậm nhất. Pet thiếu đá đúng hệ thì chuyển hoá từ hệ khác theo tỉ lệ R[d] (d = số bước theo vòng Sinh từ hệ nguồn tới hệ đích).
// Bảng "chống lách": R[a+b] ≤ R[a]·R[b] → chuyển 1 lần luôn rẻ hơn hoặc bằng chuyển nối nhiều lần.
if (process.argv.includes('--convert')) {
  const P = +process.argv[process.argv.indexOf('--convert') + 1] || 3000, U = CFG.up, B = U.maxLv - 1;
  const EL = ['moc', 'hoa', 'tho', 'kim', 'thuy'], ISL = ['kim', 'moc', 'thuy', 'hoa', 'tho'], TEAM = ['tho', 'thuy', 'hoa'];
  const dist = (a, b) => (EL.indexOf(b) - EL.indexOf(a) + 5) % 5;
  const run = R => {
    const inv = Object.fromEntries(EL.map(e => [e, [0, 0, 0]])), lv = [1, 1, 1], fail = [0, 0, 0], rep = []; let conv = 0, used = 0, gold = 0;
    for (let k = 1; k <= B; k++) {
      const el = ISL[Math.floor((k - 1) / 3)], tier = (k - 1) % 3; inv[el][tier] += U.drop.first; let r = 0;
      for (;;) {
        for (let i = 0; i < 3; i++) while (lv[i] < k + 1) {
          const me = TEAM[i];
          // nguồn rẻ nhất cho từng cấp: đá đúng hệ (giá 1) hoặc hệ khác (giá R[d])
          const src = [0, 1, 2].map(t => EL.map(e => ({ e, t, c: e === me ? 1 : R[dist(e, me) - 1] })).filter(o => inv[o.e][t] >= o.c).sort((a, b) => a.c - b.c)[0]).filter(Boolean);
          if (!src.length) break;
          const o = src.find(o => upRate(CFG, o.t, lv[i], fail[i]) >= 0.5) ?? src[src.length - 1];
          inv[o.e][o.t] -= o.c; used += o.c; if (o.e !== me) { conv++; gold += U.convert[o.t]; }
          if (rnd() < upRate(CFG, o.t, lv[i], fail[i])) { lv[i]++; fail[i] = 0; } else fail[i]++;
        }
        if (lv.every(l => l > k) || r > 80) break;
        // đánh lại boss đã hạ có lợi nhất cho pet đang chậm nhất: số đá quy đổi × tỉ lệ thành công của cấp đá đó
        const i = lv.indexOf(Math.min(...lv)), me = TEAM[i]; let best = k - 1, bv = -1;
        for (let j = 0; j < k; j++) { const e = ISL[Math.floor(j / 3)], t = j % 3, v = upRate(CFG, t, lv[i]) / (e === me ? 1 : R[dist(e, me) - 1]); if (v > bv) { bv = v; best = j; } }
        inv[ISL[Math.floor(best / 3)]][best % 3] += U.drop.replay; r++;
      }
      rep.push(r);
    }
    return { tot: rep.reduce((a, b) => a + b, 0), conv, used, gold };
  };
  const q = (v, f) => v.slice().sort((a, b) => a - b)[Math.floor(v.length * f)];
  console.log('Bảng (d=1·2·3·4)          đánh lại cả game TB · 90%   đá chuyển/đá dùng   vàng chuyển TB');
  for (const [name, R] of [['1:1 mọi hướng (chuỗi Sinh)', [1, 1, 1, 1]], ['A 1.5·2·2·3', [1.5, 2, 2, 3]], ['B 1.5·2·3·4', [1.5, 2, 3, 4]], ['C 2·3·4·5', [2, 3, 4, 5]], ['D 2·4·6·8', [2, 4, 6, 8]], ['E 4→3·3→2·2→1·2→1', [4 / 3, 1.5, 2, 2]], ['F 1.25·1.5·1.75·2', [1.25, 1.5, 1.75, 2]]]) {
    seed(11); const all = Array.from({ length: P }, () => run(R)), t = all.map(x => x.tot);
    const avg = f => all.reduce((a, x) => a + f(x), 0) / P;
    console.log(`  ${name.padEnd(26)} ${avg(x => x.tot).toFixed(1).padStart(6)} · ${String(q(t, 0.9)).padEnd(6)}  ${(100 * avg(x => x.conv) / avg(x => x.used)).toFixed(0).padStart(5)}% số lần     ${avg(x => x.gold).toFixed(0).padStart(6)}`);
  }
  process.exit(0);
}

// ───────────── CỬA HÀNG: node sim.js --shop [người chơi ảo = 2000] ─────────────
// Như --upgrade (15 boss, đá coi như đúng hệ) + có vàng: thắng boss k nhận 100+50(k−1) vàng (lần đầu ×3), mỗi lần thử nâng cấp trả upGold.
// Mỗi "ngày" = D trận: quầy mới (shopStock thật). Người chơi mua đá cho 3 hệ trong đội (quầy cố định + ô ngày cùng hệ),
// chỉ mua khi còn đủ vàng cho lần nâng cấp kế. Đo: số lần đánh lại cả game so với không có shop, % vàng tiêu ở shop.
// Mục tiêu: shop rút ngắn ≤ ~35% số lần đánh lại (vẫn phải đánh), chuyển hoá vẫn rẻ hơn mua (CFG.up.convert < giá shop).
if (process.argv.includes('--shop')) {
  const { shopStock, shopLeft } = await import('./data/shop.js');
  const P = +process.argv[process.argv.indexOf('--shop') + 1] || 2000, U = CFG.up, B = U.maxLv - 1, TEAM = ['tho', 'thuy', 'hoa'];
  { // kiểm tra logic: cùng ngày → cùng hàng; ngày khác → khác; không trùng hệ+cấp; giá ≥ chuyển hoá; đếm lượt đúng
    const a = shopStock(CFG, '2026-11-09'), b = shopStock(CFG, '2026-11-09'), c = shopStock(CFG, '2026-11-10');
    console.assert(JSON.stringify(a) === JSON.stringify(b), 'cùng ngày phải cùng hàng');
    console.assert(JSON.stringify(a.daily) !== JSON.stringify(c.daily), 'ngày khác phải khác hàng');
    console.assert(a.daily.length === CFG.shop.slots && new Set(a.daily.map(s => s.el + s.t)).size === CFG.shop.slots, 'quầy ngày đủ ô, không trùng');
    console.assert(CFG.shop.price.every((p, t) => p > U.convert[t]), 'mua phải đắt hơn chuyển hoá');
    const sh = { bought: { f_moc: CFG.shop.fixed } };
    console.assert(shopLeft(sh, a.fixed[0]) === 0 && shopLeft(sh, a.fixed[1]) === CFG.shop.fixed, 'đếm lượt sai');
  }
  const bossGold = k => 100 + 50 * (k - 1);
  const run = (D, useShop) => {
    const inv = [0, 0, 0], lv = [1, 1, 1], fail = [0, 0, 0]; let rep = 0, gold = 0, spent = 0, earned = 0, battles = 0, day = -1, shop = null, stock = null;
    const win = (k, first) => { const g = bossGold(k) * (first ? 3 : 1); gold += g; earned += g; battles++; };
    const buy = k => {
      const d = Math.floor(battles / D); if (d !== day) { day = d; shop = { bought: {} }; stock = shopStock(CFG, 'sim-' + d); }
      const reserve = upGold(CFG, Math.min(...lv));
      for (const s of [...stock.daily, ...stock.fixed]) if (TEAM.includes(s.el))
        while (shopLeft(shop, s) > 0 && gold - s.cost >= reserve) { gold -= s.cost; spent += s.cost; inv[s.t] += s.n; shop.bought[s.id] = (shop.bought[s.id] || 0) + 1; }
    };
    for (let k = 1; k <= B; k++) {
      inv[(k - 1) % 3] += U.drop.first; win(k, true); let r = 0;
      for (;;) {
        if (useShop) buy(k);
        for (let i = 0; i < 3; i++) while (lv[i] < k + 1) {
          const own = [0, 1, 2].filter(t => inv[t] > 0); if (!own.length || gold < upGold(CFG, lv[i])) break;
          const t = own.find(t => upRate(CFG, t, lv[i], fail[i]) >= 0.5) ?? own[own.length - 1];
          inv[t]--; gold -= upGold(CFG, lv[i]); if (rnd() < upRate(CFG, t, lv[i], fail[i])) { lv[i]++; fail[i] = 0; } else fail[i]++;
        }
        if (lv.every(l => l > k) || r > 80) break;
        inv[(k - 1) % 3] += U.drop.replay; win(k, false); r++;
      }
      rep += r;
    }
    return { rep, spent, earned, battles };
  };
  console.log(`Giá đá I·II·III: ${CFG.shop.price.join(' · ')} vàng (chuyển hoá: ${U.convert.join(' · ')} / viên)`);
  console.log('Trận/ngày   đánh lại TB (không shop → có shop)   giảm    vàng tiêu ở shop   số ngày chơi');
  for (const D of [4, 8, 16, 32]) {
    seed(5); const a = Array.from({ length: P }, () => run(D, false));
    seed(5); const b = Array.from({ length: P }, () => run(D, true));
    const avg = (v, f) => v.reduce((s, x) => s + f(x), 0) / P, r0 = avg(a, x => x.rep), r1 = avg(b, x => x.rep);
    console.log(`  ${String(D).padStart(3)}        ${r0.toFixed(1).padStart(6)} → ${r1.toFixed(1).padEnd(6)}                  ${(100 * (1 - r1 / r0)).toFixed(0).padStart(3)}%    ${(100 * avg(b, x => x.spent) / avg(b, x => x.earned)).toFixed(0).padStart(3)}%              ${(avg(b, x => x.battles) / D).toFixed(1)}`);
  }
  process.exit(0);
}

// ───────────── BOSS THEO CẤP ĐỘI: node sim.js --bosslv [trận/ô = 150] ─────────────
// Boss lên cùng cấp trung bình của đội; HP/ATK boss tăng g%/cấp (pet tăng CFG.up.grow). Đo tỉ lệ thắng đội mặc định (bot smart).
if (process.argv.includes('--bosslv')) {
  const G = +process.argv[process.argv.indexOf('--bosslv') + 1] || 150, LV = [1, 3, 5, 8, 11, 15];
  const bossAt = (b, lv, g) => { const k = 1 + g * (lv - 1); return { ...b, hp: Math.round(b.hp * k), atk: Math.round(b.atk * k) }; };
  for (const g of [0, 0.02, 0.03, 0.04, 0.06]) {
    console.log(`\nBoss +${(g * 100).toFixed(0)}%/cấp (pet +${CFG.up.grow * 100}%/cấp)      cấp đội ` + LV.map(l => ('L' + l).padStart(6)).join(''));
    BOSSES.forEach((b, bi) => {
      const row = LV.map(l => { const team = DEFAULT_TEAM.map(p => lvPet(CFG, p, l)); return runMany(CFG, team, bossAt(b, l, g), POL.smart, G, 500 + bi * 31 + l).win; });
      console.log(`  ${b.n.padEnd(36)}` + row.map(w => (Math.round(w * 100) + '%').padStart(6)).join(''));
    });
  }
  process.exit(0);
}

// ───────────── TỈ LỆ ĐÁ: node sim.js --rates ─────────────
// c(L) = số đá I để chắc 100% ở cấp L; đá cấp t = m^t đá I; may mắn +p mỗi lần trượt. So "chắc ăn" (bỏ đủ 100%) với "liều 1 viên".
// Quy đổi: đá I = 1 điểm, II = 3, III = 9 (hợp nhất 3→1 trung tính). Vàng mỗi lần thử = 50 × (L + 1). Đã chọn: C + may mắn 3% (data/config.js).
if (process.argv.includes('--rates')) {
  const LV = Array.from({ length: 14 }, (_, i) => i + 1);
  const gold = L => 50 * (L + 1);
  const curves = {
    'A tuyến tính 1+0.75(L-1)': L => 1 + 0.75 * (L - 1),
    'B mũ 1.2^(L-1)': L => 1.2 ** (L - 1),
    'C bậc hai 1+0.08(L-1)²': L => 1 + 0.08 * (L - 1) ** 2,
    'D mũ 1.25^(L-1)': L => 1.25 ** (L - 1),
  };
  const rate = (c, m, t, L) => Math.min(1, m ** t / c(L));
  // kỳ vọng số lần thử khi mỗi lần bỏ 1 viên tỉ lệ r, may mắn +p mỗi lần trượt
  const tries = (r, p) => { let e = 0, alive = 1; for (let k = 0; alive > 1e-9; k++) { e += alive; alive *= 1 - Math.min(1, r + p * k); } return e; };
  // chắc ăn: tổ hợp rẻ nhất (theo điểm) đạt ≥ 100%
  const sure = (c, m, L) => { let best = Infinity; for (let a = 0; a <= 40; a++) for (let b = 0; b <= 15; b++) for (let d = 0; d <= 6; d++) {
    const r = a * rate(c, m, 0, L) + b * rate(c, m, 1, L) + d * rate(c, m, 2, L); if (r >= 1 - 1e-9) best = Math.min(best, a + b * m + d * m * m); } return best; };
  const m = 3;
  for (const p of [0.10, 0.05, 0.03]) {
    console.log(`\n══ may mắn +${p * 100}%/lần trượt · đá II = ${m} đá I, III = ${m * m} đá I`);
    for (const [name, c] of Object.entries(curves)) {
      let sumSure = 0, sumGam = 0, sumGold = 0, sumGoldG = 0; const worst = [];
      for (const L of LV) {
        const s = sure(c, m, L), g = [0, 1, 2].map(t => tries(rate(c, m, t, L), p) * m ** t), gi = g.indexOf(Math.min(...g));
        sumSure += s; sumGam += g[gi]; sumGold += gold(L); sumGoldG += tries(rate(c, m, gi, L), p) * gold(L);
        worst.push(s / g[gi]);
      }
      console.log(`  ${name.padEnd(26)} 1→15: chắc ăn ${sumSure.toFixed(0).padStart(4)} điểm + ${sumGold} vàng · liều ${sumGam.toFixed(0).padStart(4)} điểm + ${sumGoldG.toFixed(0)} vàng · liều rẻ hơn tối đa ×${Math.max(...worst).toFixed(2)}`);
    }
  }
  // chi tiết 1 bảng ứng viên
  const pick = 'C bậc hai 1+0.08(L-1)²', P = CFG.up.pity, c = curves[pick];
  console.log(`\n── Chi tiết "${pick}", may mắn +${P * 100}% ──\n  cấp   đá I   đá II  đá III │ chắc ăn (điểm) │ liều tốt nhất (điểm · vàng)`);
  for (const L of LV) {
    const g = [0, 1, 2].map(t => tries(rate(c, m, t, L), P) * m ** t), gi = g.indexOf(Math.min(...g));
    console.log(`  L${String(L).padEnd(3)} ${[0, 1, 2].map(t => (Math.round(rate(c, m, t, L) * 100) + '%').padStart(6)).join(' ')} │ ${String(sure(c, m, L)).padStart(8)}       │ ${g[gi].toFixed(1).padStart(5)} (đá ${['I', 'II', 'III'][gi]}) · ${(tries(rate(c, m, gi, L), P) * gold(L)).toFixed(0)}`);
  }

  process.exit(0);
}

// ───────────── CẤP NGƯỜI CHƠI: node sim.js --playerlv [trận/ô = 150] ─────────────
// Thưởng toàn đội +b HP/ATK/DEF (nhân sau cấp pet). Boss theo cấp đội (lvBoss). Đội mặc định, bot smart.
if (process.argv.includes('--playerlv')) {
  const G = +process.argv[process.argv.indexOf('--playerlv') + 1] || 150;
  const buff = (p, b) => ({ ...p, hp: Math.round(p.hp * (1 + b)), atk: Math.round(p.atk * (1 + b)), def: Math.round(p.def * (1 + b)) });
  const bossAt = (b, lv) => { const k = 1 + CFG.up.bossGrow * (lv - 1); return { ...b, hp: Math.round(b.hp * k), atk: Math.round(b.atk * k) }; };
  for (const L of [1, 5, 10]) {
    console.log(`\nPet + boss cùng Lv${L}          thưởng ` + [0, 0.05, 0.1, 0.15, 0.2, 0.3].map(b => ('+' + b * 100 + '%').padStart(6)).join(''));
    BOSSES.forEach((b, bi) => console.log(`  ${b.n.padEnd(30)}` + [0, 0.05, 0.1, 0.15, 0.2, 0.3].map(x => (Math.round(100 * runMany(CFG, DEFAULT_TEAM.map(p => buff(lvPet(CFG, p, L), x)), bossAt(b, L), POL.smart, G, 700 + bi * 13 + L).win) + '%').padStart(6)).join('')));
  }
  process.exit(0);
}

// ───────────── ĐƯỜNG CONG ĐỘ KHÓ: node sim.js --curve [trận/đội = 30]   (thử boss mới: CAND='[{...}]' node sim.js --curve) ─────────────
// Mỗi boss: tỉ lệ thắng của ĐỘI TỐT NHẤT (60 cách xếp) và đội mặc định, pet & boss cùng Lv1, bot smart. Mục tiêu xem design/BOSS.md.
if (process.argv.includes('--curve')) {
  const G = +process.argv[process.argv.indexOf('--curve') + 1] || 30;
  const list = [...BOSSES, ...JSON.parse(process.env.CAND || '[]')];
  const perms = a => a.length < 2 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
  const teams = []; for (let i = 0; i < PETS.length; i++) for (let j = i + 1; j < PETS.length; j++) for (let k = j + 1; k < PETS.length; k++) teams.push(...perms([PETS[i], PETS[j], PETS[k]]));
  console.log('boss'.padEnd(26) + 'tốt nhất  nước  máu còn | đội mặc định | đội tốt nhất');
  list.forEach((b, bi) => {
    const rows = teams.map(t => ({ t, ...runMany(CFG, t, b, POL.smart, G, 3000 + bi) })).sort((x, y) => y.win - x.win || x.moves - y.moves);
    const best = { t: rows[0].t, ...runMany(CFG, rows[0].t, b, POL.smart, G * 5, 4000 + bi) }, def = runMany(CFG, DEFAULT_TEAM, b, POL.smart, G * 3, 5000 + bi);
    console.log(b.n.padEnd(26) + pct(best.win).padStart(8) + f1(best.moves).padStart(6) + pct(best.hpLeft).padStart(9) + ' |' + pct(def.win).padStart(13) + ' | ' + best.t.map(p => p.n).join('/'));
  });
  process.exit(0);
}

// ───────────── GỢI Ý ĐỘI: node sim.js --suggest [số trận/đội = 40] → data/suggest.js ─────────────
if (process.argv.includes('--suggest')) {
  const G = +process.argv[process.argv.indexOf('--suggest') + 1] || 40;
  const perms = a => a.length < 2 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]));
  const out = BOSSES.map((b, bi) => {
    const rows = [];
    for (let i = 0; i < PETS.length; i++) for (let j = i + 1; j < PETS.length; j++) for (let k = j + 1; k < PETS.length; k++)
      for (const team of perms([PETS[i], PETS[j], PETS[k]])) { const x = runMany(CFG, team, b, POL.smart, G, 900 + bi); rows.push({ team, win: x.win, moves: x.moves }); }
    rows.sort((x, y) => y.win - x.win || x.moves - y.moves);
    // vòng 2: kiểm lại 5 đội đầu với nhiều trận hơn để bớt nhiễu
    const top = rows.slice(0, 5).map(x => ({ ...x, ...runMany(CFG, x.team, b, POL.smart, G * 5, 1900 + bi) })).sort((x, y) => y.win - x.win || x.moves - y.moves);
    const best = top[0];
    console.log(b.n, '→', best.team.map(p => p.n).join(' / '), (best.win * 100).toFixed(0) + '%', best.moves.toFixed(1), 'nước');
    return { ids: best.team.map(p => p.id), win: +best.win.toFixed(3), moves: +best.moves.toFixed(1) };
  });
  fs.writeFileSync(new URL('./data/suggest.js', import.meta.url), `// TỰ SINH bởi: node sim.js --suggest ${G}  (bot smart; đổi chỉ số/boss thì chạy lại)
// Đội tốt nhất cho từng boss, theo thứ tự cột trên → dưới; win = tỉ lệ thắng mô phỏng.
export const SUGGEST = ${JSON.stringify(out, null, 2)};
`);
  process.exit(0);
}

// ───────────── BÁO CÁO ─────────────
// Tự kiểm: xác suất aggro tổng = 1 và bàn mới không có sẵn match
(function selfCheck() {
  seed(7); const g = newBoard(CFG);
  console.assert(!matches(g, 6, 6).some(x => x), 'bàn mới không được có match sẵn');
  console.assert(validMoves(g, CFG).length > 0, 'bàn mới phải có nước đi');
  const ag = DEFAULT_TEAM.reduce((a, p) => a + p.ag, 0);
  console.assert(Math.abs(DEFAULT_TEAM.reduce((a, p) => a + p.ag / ag, 0) - 1) < 1e-9);
  // Ngũ hành: Hỏa khắc Kim; Mộc khắc Thổ; Mộc đứng cạnh Hỏa → Hỏa +sinh
  const fire = PETS.find(p => p.el === 'hoa'), earth = PETS.find(p => p.el === 'tho'), wood = PETS.find(p => p.el === 'moc');
  console.assert(elemMods(CFG, [fire], { el: 'kim' })[0].atkM === CFG.elem.adv, 'Hỏa khắc Kim');
  console.assert(elemMods(CFG, [earth], { el: 'moc' })[0].defM === CFG.elem.hurtUp, 'Mộc khắc Thổ');
  console.assert(Math.abs(elemMods(CFG, [wood, fire], { el: 'tho' })[1].atkM - (1 + CFG.elem.sinh)) < 1e-9, 'Mộc sinh Hỏa');
})();

H('1. BẢNG CHỈ SỐ');
console.log('Pet        vai hệ     HP   ATK DEF Aggro  Ult');
PETS.forEach(p => console.log(`${p.n.padEnd(10)} ${p.r}   ${p.el.padEnd(4)} ${String(p.hp).padStart(5)} ${String(p.atk).padStart(4)} ${String(p.def).padStart(3)} ${String(p.ag).padStart(5)}  ${p.ult.k} ${p.ult.v}`));
console.log('\nBoss          hệ      HP     ATK  Ngưỡng choáng  Mẫu đòn');
BOSSES.forEach(b => console.log(`${b.n.padEnd(13)} ${b.el.padEnd(4)} ${String(b.hp).padStart(6)} ${String(b.atk).padStart(5)} ${String(b.stun).padStart(8)}      ${b.pat.join('→')}`));

H('2. XÁC SUẤT BỊ NHẮM (đội Tanker+Hỗ trợ+AD)');
{
  const t = DEFAULT_TEAM, tot = t.reduce((a, p) => a + p.ag, 0);
  console.log('Đủ 3 pet :', t.map(p => `${p.r}=${pct(p.ag / tot)}`).join('  '));
  const t2 = t.slice(1), tot2 = t2.reduce((a, p) => a + p.ag, 0);
  console.log('Tanker chết:', t2.map(p => `${p.r}=${pct(p.ag / tot2)}`).join('  '));
  const hitsTank = t.map((p, i) => { // xác suất mỗi pet trúng ≥1 phần của đòn lan
    const sl = [i - 1, i, i + 1].filter(k => k >= 0 && k < 3); return sl.reduce((a, k) => a + t[k].ag / tot, 0); });
  console.log('Trúng đòn lan:', t.map((p, i) => `${p.r}=${pct(hitsTank[i])}`).join('  '), ' (pet giữa dễ trúng lan nhất)');
}

H('3. BÀN CỜ: số viên ăn được MỖI NƯỚC ĐI (đội mặc định vs Boss 2)');
for (const k of ['random', 'greedy', 'smart']) {
  const r = runMany(CFG, DEFAULT_TEAM, BOSSES[1], POL[k], Math.max(40, N / 4), 11);
  console.log(`${k.padEnd(7)}`, GEM.map((g, i) => `${g} ${r.gpm[i].toFixed(2)}`).join(' | '), ` | tổng ${r.gpm.reduce((a, b) => a + b, 0).toFixed(2)}`);
}

H('4. TỈ LỆ THẮNG theo bot (đội mặc định)  — random=sàn, smart≈trần');
console.log('Boss          bot      thắng  nước TB  máu còn  pet chết  ult  choáng');
for (const b of BOSSES) for (const k of ['random', 'greedy', 'smart']) {
  const r = runMany(CFG, DEFAULT_TEAM, b, POL[k], N, 21);
  console.log(`${b.n.padEnd(13)} ${k.padEnd(7)} ${pct(r.win)}  ${f1(r.moves)}   ${pct(r.hpLeft)}     ${r.dead.toFixed(2)}    ${r.ults.toFixed(1)}  ${r.stuns.toFixed(1)}`);
}
console.log('Mục tiêu gợi ý (smart): Boss1 ~90%, Boss2 ~70%, Boss3 ~50%; greedy thấp hơn smart 10-25 điểm để "chọn viên khôn" có giá trị.');

H('5. CÂN BẰNG PET & NGŨ HÀNH (smart bot, đủ 10 đội 3 pet, thứ tự cột theo danh sách)');
{
  const TEAMS = []; for (let i = 0; i < PETS.length; i++) for (let j = i + 1; j < PETS.length; j++) for (let k = j + 1; k < PETS.length; k++) TEAMS.push([PETS[i], PETS[j], PETS[k]]);
  const g = Math.max(10, Math.round(N / 8)), per = {}, byBoss = BOSSES.map(() => []);
  PETS.forEach(p => per[p.n] = { w: 0, n: 0 });
  let bi = 0;
  for (const t of TEAMS) BOSSES.forEach((b, bix) => {
    const r = runMany(CFG, t, b, POL.smart, g, 31 + bi++);
    t.forEach(p => { per[p.n].w += r.win * g; per[p.n].n += g; });
    byBoss[bix].push({ t, win: r.win, mods: elemMods(CFG, t, b) });
  });
  const avg = Object.values(per).reduce((a, x) => a + x.w / x.n, 0) / PETS.length;
  console.log('Pet        vai hệ    thắng TB  lệch');
  PETS.forEach(p => { const x = per[p.n], w = x.w / x.n, d = w - avg; console.log(`${p.n.padEnd(10)} ${p.r}   ${p.el.padEnd(4)}  ${pct(w)}    ${(d >= 0 ? '+' : '') + (100 * d).toFixed(0)}đ${Math.abs(d) > 0.08 ? ' ⚠' : ''}`); });
  const tag = m => m.adv ? '▲' : m.dis ? '▼' : '·';
  BOSSES.forEach((b, bix) => {
    const rows = byBoss[bix].sort((x, y) => y.win - x.win);
    console.log(`\n${b.n} (hệ ${b.el})  — ▲ khắc boss · ▼ bị boss khắc · +s được sinh`);
    rows.forEach(x => console.log('  ' + pct(x.win) + '  ' + x.t.map((p, i) => (p.n + tag(x.mods[i]) + (x.mods[i].sinh ? '+s' : '')).padEnd(14)).join(' ')));
  });
}

H('6. THỨ TỰ CỘT (đội mặc định, smart, Boss 2) — đòn lan phụ thuộc vị trí');
{
  const [T, S, D] = DEFAULT_TEAM, perms = [[T, S, D], [T, D, S], [S, T, D], [D, T, S], [S, D, T], [D, S, T]];
  perms.forEach((t, i) => { const r = runMany(CFG, t, BOSSES[1], POL.smart, N, 41); console.log(t.map(p => p.r).join('-'), ` thắng ${pct(r.win)}  máu còn ${pct(r.hpLeft)}  pet chết ${r.dead.toFixed(2)}`); });
}

H('7. GIÁ TRỊ TỪNG LOẠI VIÊN: vô hiệu hoá hiệu ứng viên đó (smart, đội mặc định)');
{
  console.log('Viên tắt     Boss1   Boss2   Boss3   (thắng; càng tụt nhiều = viên càng đáng giá)');
  const row = (lab, cfg) => console.log(lab.padEnd(12), BOSSES.map(b => pct(runMany(cfg, DEFAULT_TEAM, b, POL.smart, N, 51).win).padStart(5) + '  ').join(' '));
  row('(không tắt)', CFG);
  [1, 2, 3, 4].forEach(k => row(GEM[k], { ...CFG, off: [k] }));
}

H('8. ĐỘ NHẠY THAM SỐ (smart, đội mặc định, Boss 2): thắng% | nước TB');
{
  const sw = (lab, vals, mk) => console.log(lab.padEnd(22), vals.map(v => { const [cfg, boss] = mk(v); const r = runMany(cfg, DEFAULT_TEAM, boss, POL.smart, N, 61); return `${String(v).padStart(5)}: ${pct(r.win)}|${r.moves.toFixed(0).padStart(2)}`; }).join('   '));
  const b2 = BOSSES[1];
  sw('Tim hồi %HP/viên', [0.04, 0.06, 0.08, 0.10, 0.12], v => [{ ...CFG, heartPct: v }, b2]);
  sw('Khiên %HP/viên', [0.03, 0.04, 0.05, 0.06, 0.08], v => [{ ...CFG, shieldPct: v }, b2]);
  sw('Trần khiên', [0.15, 0.20, 0.30, 0.40, 0.50], v => [{ ...CFG, shieldCap: v }, b2]);
  sw('Ngưỡng choáng (viên)', [4, 6, 8, 10, 12], v => [CFG, { ...b2, stun: v }]);
  sw('Nộ mỗi viên lửa', [0, 3, 5, 8, 12], v => [{ ...CFG, firePerGem: v }, b2]);
  sw('Nộ mỗi lần trúng đòn', [10, 15, 20, 25, 30], v => [{ ...CFG, ragePerHit: v }, b2]);
  sw('Tỉ lệ rơi Kiếm', [16, 20, 24, 28, 32], v => [{ ...CFG, weights: [v, ...[1, 2, 3, 4].map(() => (100 - v) / 4)] }, b2]);
  sw('ATK boss', [500, 560, 620, 680, 740], v => [CFG, { ...b2, atk: v }]);
  sw('HP boss', [8000, 9000, 10000, 11000, 12000], v => [CFG, { ...b2, hp: v }]);
}
