// Số cân bằng toàn cục. Chỉ đổi sau khi chạy `node sim.js` để kiểm tra.
export const CFG = {
  rows: 6, cols: 6,
  weights: [24, 19, 19, 19, 19],      // tỉ lệ rơi: Kiếm, Tim, Xoắn(choáng), Khiên, Lửa(nộ)
  chain: [1, 1.3, 1.6, 1.9, 2.0],     // hệ số dây chuyền theo đợt (đợt cuối là trần)
  heartPct: 0.08,                     // mỗi tim hồi % maxHP cho pet yếu nhất
  shieldPct: 0.05, shieldCap: 0.30,   // mỗi khiên cho mỗi pet % maxHP, trần
  firePerGem: 5,                      // mỗi lửa +nộ cho cả đội
  ragePerHit: 20, rageMax: 100,
  stunBonus: 0.5,                     // +50% sát thương khi boss bị choáng
  mult: { single: 1, blastMain: 0.8, blastSide: 0.5, aoe: 0.5 },
  // Ngũ hành: pet khắc boss → gây ×adv, nhận ×hurtDown; boss khắc pet → gây ×dis, nhận ×hurtUp;
  // mỗi pet đứng cạnh (ô cột ±1) sinh ra hệ của mình → +sinh ATK
  elem: { adv: 1.5, dis: 0.75, hurtUp: 1.3, hurtDown: 0.75, sinh: 0.15 },
  maxMoves: 50,                       // quá số lượt này = thua
  // Viên x2/x3: viên MỚI rơi xuống có hệ số (ăn = tính 2/3 viên). Tỉ lệ tăng theo lượt: x2 từ lượt from2, +step2/lượt, trần max2; x3 tương tự
  mulGem: { from2: 8, step2: 0.006, max2: 0.15, from3: 20, step3: 0.004, max3: 0.08 },
  // Nâng cấp pet (design/UPGRADE.md; kiểm bằng `node sim.js --upgrade`). Mỗi lần thử tốn 1 đá cùng hệ pet; thành công mới trả vàng.
  // tỉ lệ = kẹp(base[cấp đá] − dec × (cấp pet − 1), floor[cấp đá], 1) + pity × số lần trượt liên tiếp
  // Cấp người chơi: XP thắng boss (lần đầu ×2, thua ×0.25); mỗi cấp +0.5% HP/ATK/DEF toàn đội, tối đa cấp 30 (= +14.5%). XP lên cấp L→L+1 = xpBase + xpStep·(L−1)
  player: { maxLv: 30, bonus: 0.005, xpBase: 60, xpStep: 40, first: 2, lose: 0.25 },
  up: { maxLv: 15, grow: 0.06, bossGrow: 0.04, gold: 50, cost: 0.08, tierMul: 3, pity: 0.03,
    drop: { first: 3, replay: 2, star3: 1 }, merge: 3, convert: [10, 30, 90], conv: [[4, 3], [3, 2], [2, 1], [2, 1]] },
  // Cửa hàng (data/shop.js; kiểm bằng `node sim.js --shop`). price = vàng / 1 đá theo cấp I·II·III.
  // Quầy cố định: đá I mỗi hệ, fixed lượt/ngày. Quầy ngày: slots ô, mỗi ô 1 lượt; cấp đá theo trọng số w, gói n[cấp] viên, giảm giá ngẫu nhiên trong off.
  shop: { price: [120, 330, 900], fixed: 3, slots: 6, w: [3, 5, 2], n: [5, 2, 1], off: [0, 0, 0.2, 0.3] },
  off: [],                            // chỉ số loại viên bị vô hiệu hoá (đo giá trị viên trong sim)
};
export const GEM = ['Kiếm', 'Tim', 'Xoắn', 'Khiên', 'Lửa'];
