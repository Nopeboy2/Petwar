// Sinh wireframe SVG + LAYOUT.md cho mọi màn từ MỘT nguồn bố cục.  Chạy: node design/gen-wireframes.mjs
// Đơn vị: pt (= CSS px). Khung chính 844×390 (ngang). Sửa số ở đây rồi chạy lại.
import fs from 'node:fs';
const OUT = new URL('./wireframes/', import.meta.url);
fs.mkdirSync(OUT, { recursive: true });

// ───────── khung thiết bị ─────────
const DEV = {
  main:  { W: 844, H: 390, safe: { l: 48, r: 48, t: 8, b: 20 }, name: 'iPhone 12–15 (19.5:9) — KHUNG CHÍNH' },
  wide:  { W: 932, H: 430, safe: { l: 59, r: 59, t: 8, b: 21 }, name: 'iPhone Pro Max (19.5:9)' },
  std:   { W: 667, H: 375, safe: { l: 16, r: 16, t: 8, b: 8 },  name: 'Màn 16:9 / Android phổ thông' },
  small: { W: 568, H: 320, safe: { l: 16, r: 16, t: 8, b: 8 },  name: 'Nhỏ nhất (iPhone SE 1)' },
};
const box = (x, y, w, h, k, l, id) => ({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h), k, l, id });

// thanh trên chung (mọi màn trừ chiến đấu/bắt đầu)
const E = 12; // lề trong vùng an toàn cho thành phần neo mép (code: 12px + env(safe-area-inset-*))
function topBar(d, title, { back = true, currency = true } = {}) {
  const { W, safe } = d, R = W - safe.r - E, y = safe.t, out = [];
  if (back) out.push(box(safe.l + E, y, 44, 40, 'btn', '←', 'topbar.back'));
  out.push(box(W / 2 - 130, y, 260, 40, 'text', title, 'topbar.title'));
  if (currency) out.push(
    box(R - 40, y, 40, 40, 'btn', '⚙', 'topbar.settings'),
    box(R - 40 - 8 - 104, y + 4, 104, 32, 'chip', '💎 Sao', 'topbar.stars'),
    box(R - 40 - 8 - 104 - 8 - 112, y + 4, 112, 32, 'chip', '◎ Vàng', 'topbar.gold'));
  return out;
}

// ───────── màn chiến đấu: tính theo thiết bị ─────────
function battle(d) {
  const { W, H, safe } = d, L = safe.l, R = W - safe.r, top = safe.t, gap = 12, minPanel = 130;
  const mainY = top + 40, mainH = H - safe.b - mainY;
  const bs = Math.floor(Math.min(mainH, R - L - 2 * gap - 2 * minPanel) / 6) * 6;  // bàn vuông, chia hết 6
  const bx = Math.round((W - bs) / 2), panelW = bx - gap - L, cell = bs / 6;
  const out = [
    box(L, top, 44, 32, 'btn', '⏸', 'battle.pause'),
    box(L + 52, top, 110, 32, 'text', 'Nước 6/50', 'battle.moves'),
    box(L + 170, top, R - L - 170 - 150, 32, 'text', 'Tóm tắt nước vừa đi', 'battle.summary'),
    box(R - 142, top, 142, 32, 'text', 'Tên màn', 'battle.stage'),
    box(bx, mainY, bs, bs, 'board', `Bàn 6×6 · ô ${cell}`, 'battle.board'),
  ];
  const ch = (bs - 2 * 8) / 3;
  for (let i = 0; i < 3; i++) {
    const x = L, y = mainY + i * (ch + 8), w = panelW, a = Math.min(64, ch - 24), ix = x + 8 + a + 8, iw = w - (ix - x) - 8;
    out.push(box(x, y, w, ch, 'panel', '', `battle.pet${i + 1}`));
    out.push(box(x + 8, y + (ch - a) / 2, a, a, 'img', 'Ảnh pet', `battle.pet${i + 1}.art`));
    const narrow = iw < 112; // màn nhỏ: gộp % bị nhắm vào dòng tên, ULT xuống góc dưới
    out.push(box(ix, y + 6, narrow ? iw : iw - 52, 14, 'text', narrow ? 'Tên·🎯%' : 'Tên', `battle.pet${i + 1}.name`));
    out.push(narrow ? box(x + 8, y + ch - 24, a, 20, 'primary', 'ULT', `battle.pet${i + 1}.ult`) : box(x + w - 8 - 48, y + 6, 48, 22, 'primary', 'ULT', `battle.pet${i + 1}.ult`));
    out.push(box(ix, y + 30, iw, 8, 'bar-hp', '', `battle.pet${i + 1}.hp`));
    out.push(box(ix, y + 42, iw, 4, 'bar-sh', '', `battle.pet${i + 1}.shield`));
    out.push(box(ix, y + 50, iw, 6, 'bar-rage', '', `battle.pet${i + 1}.rage`));
    if (!narrow) out.push(box(ix, y + ch - 24, 60, 18, 'chip', '🎯 53%', `battle.pet${i + 1}.aggro`));
  }
  const px = bx + bs + gap, pw = R - px, img = Math.min(pw - 32, bs * 0.42);
  out.push(
    box(px, mainY, pw, bs, 'panel', '', 'battle.boss'),
    box(px + (pw - img) / 2, mainY + 12, img, img, 'img', 'Ảnh boss', 'battle.boss.art'),
    box(px + 8, mainY + 20 + img, pw - 16, 18, 'text', 'Tên boss', 'battle.boss.name'),
    box(px + 8, mainY + 44 + img, pw - 16, 12, 'bar-boss', '', 'battle.boss.hp'),
    box(px + 8, mainY + 60 + img, pw - 16, 14, 'text', 'HP số', 'battle.boss.hpText'),
    box(px + 8, mainY + 80 + img, pw - 16, 8, 'bar-stun', 'Choáng (n ô)', 'battle.boss.stun'),
    box(px + 8, mainY + 96 + img, pw - 16, 28, 'chip', 'Đòn kế: 💥 Lan', 'battle.boss.next'),
    box(px + 8, mainY + 130 + img, pw - 16, 20, 'text', 'Trạng thái (choáng…)', 'battle.boss.status'),
  );
  return out;
}

// ───────── các màn (khung chính 844×390) ─────────
const M = DEV.main, L = M.safe.l, R = M.W - M.safe.r, T = M.safe.t, B = M.H - M.safe.b, CW = R - L, CX = M.W / 2;
const overlay = box(0, 0, M.W, M.H, 'overlay', '', 'overlay');
const BM = battle(M), bp = BM.find(b => b.id === 'battle.pet1'), bb = BM.find(b => b.id === 'battle.board'), CELL = bb.w / 6;
const SCREENS = [
  { id: '00-components', dev: M, title: 'Thành phần dùng chung (kích thước chuẩn)', boxes: [
    box(L, 24, 160, 48, 'primary', 'Nút chính 160×48', 'btn.primary'),
    box(L + 176, 24, 160, 48, 'btn', 'Nút phụ 160×48', 'btn.secondary'),
    box(L + 352, 24, 96, 32, 'btn', 'Nút nhỏ 96×32', 'btn.small'),
    box(L + 464, 24, 44, 44, 'btn', '44', 'btn.icon'),
    box(L + 524, 24, 112, 32, 'chip', 'Chip 32 cao', 'chip'),
    box(L, 96, bp.w, bp.h, 'panel', `Thẻ pet trận ${bp.w}×${bp.h}`, 'card.battlePet'),
    box(L + 222, 96, 136, 120, 'panel', 'Thẻ pet 136×120', 'card.pet'),
    box(L + 374, 96, 96, 88, 'panel', 'Thẻ chọn 96×88', 'card.pick'),
    box(L + 486, 96, CELL, CELL, 'cell', 'Ô ' + CELL, 'gem.cell'),
    box(L + 488 + CELL + 16, 98, CELL - 4, CELL - 4, 'gem', 'Viên ' + (CELL - 4), 'gem'),
    box(L + 618, 96, 56, 56, 'node', 'Nút màn 56', 'map.node'),
    box(L, 232, 160, 8, 'bar-hp', '', 'bar.hp'), box(L + 170, 228, 120, 16, 'text', 'HP 8 cao', ''),
    box(L, 252, 160, 4, 'bar-sh', '', 'bar.shield'), box(L + 170, 246, 120, 16, 'text', 'Khiên 4 cao', ''),
    box(L, 268, 160, 6, 'bar-rage', '', 'bar.rage'), box(L + 170, 262, 120, 16, 'text', 'Nộ 6 cao', ''),
    box(L, 286, 160, 12, 'bar-boss', '', 'bar.boss'), box(L + 170, 284, 120, 16, 'text', 'HP boss 12 cao', ''),
    box(L, 310, 160, 8, 'bar-stun', '', 'bar.stun'), box(L + 170, 306, 120, 16, 'text', 'Choáng 8 cao', ''),
    box(L + 320, 232, 320, 120, 'modal', 'Hộp thoại (≥ 320 rộng)', 'modal'),
    box(L + 656, 232, 92, 40, 'toast', 'Thông báo', 'toast'),
    box(L + 656, 284, 92, 28, 'text', '-405 (số bay)', 'float'),
  ] },
  { id: '01-start', dev: M, title: 'Bắt đầu / Tải', boxes: [
    box(0, 0, M.W, M.H, 'img', 'Nền toàn màn (tràn cả vùng tai thỏ)', 'start.bg'),
    box(CX - 200, 70, 400, 120, 'img', 'Logo 400×120', 'start.logo'),
    box(CX - 160, 214, 320, 8, 'bar-hp', '', 'start.loading'),
    box(CX - 120, 246, 240, 56, 'primary', 'Chạm để chơi', 'start.tap'),
    box(R - 120, B - 20, 120, 16, 'text', 'phiên bản', 'start.version'),
  ] },
  { id: '02-home', dev: M, title: 'Trang chủ (sảnh) — khung giãn theo màn hình, neo mép', boxes: [
    box(0, 0, M.W, M.H, 'img', 'Nền sảnh (phủ kín)', 'home.bg'),
    box(L + E, 4, 48, 48, 'img', 'Avatar', 'home.avatar'),
    box(L + E + 52, T, 160, 40, 'text', 'Tên người chơi (khung lá)', 'home.name'),
    ...topBar(M, '', { back: false }).filter(b => b.id !== 'topbar.title'),
    ...[0, 1, 2].map(i => box(80 + i * 136, 100 - M.safe.b, 120, 176, 'img', `Pet ${i + 1} trên bệ`, `home.pet${i + 1}`)),
    box(80, 282 - M.safe.b, 392, 20, 'text', 'Đội hình hiện tại · chạm để sửa', 'home.teamLabel'),
    box(L + E, B - 20 - 56, 152, 56, 'btn', '🐾 Pet', 'home.pets'),
    box(L + E + 168, B - 20 - 56, 152, 56, 'btn', '👥 Đội hình', 'home.team'),
    box(L + E + 136, B - 20 - 60, 16, 16, 'badge', '', 'home.pets.badge'),
    box(R - E - 240, B - 16 - 64, 240, 64, 'primary', '⚔ CHIẾN DỊCH · Màn kế', 'home.campaign'),
  ] },
  { id: '03-campaign-map', dev: M, title: 'Bản đồ chương', boxes: [
    box(0, 0, M.W, M.H, 'img', 'Nền chương (cuộn ngang)', 'map.bg'),
    box(L, T, 44, 40, 'btn', '←', 'topbar.back'),
    box(L + 56, T, 240, 40, 'text', 'Chương 1: Rừng Xanh', 'map.title'),
    box(R - 3 * 52 - 96, T + 4, 88, 32, 'chip', '⭐ 14/30', 'map.stars'),
    ...[0, 1, 2].map(i => box(R - (3 - i) * 52 + 4, T, 44, 44, 'btn', '🎁', `map.chest${i + 1}`)),
    ...Array.from({ length: 10 }, (_, i) => box(L + 24 + i * 72, 150 + (i % 2 ? -48 : 48), i === 9 ? 72 : 56, i === 9 ? 72 : 56, 'node', i === 9 ? 'Boss' : String(i + 1), `map.node${i + 1}`)),
    box(L, B - 44, 140, 44, 'btn', '◀ Chương trước', 'map.prev'),
    box(R - 140, B - 44, 140, 44, 'btn', 'Chương sau ▶', 'map.next'),
  ] },
  { id: '04-stage-info', dev: M, title: 'Thông tin màn (hộp thoại)', boxes: [
    overlay,
    box(CX - 250, 36, 500, 318, 'modal', '', 'stage.modal'),
    box(CX - 250, 36, 500, 40, 'text', 'Màn 1-4', 'stage.title'),
    box(CX - 234, 84, 160, 160, 'img', 'Ảnh kẻ địch', 'stage.enemy'),
    box(CX - 58, 84, 292, 22, 'text', 'HP 4,200 · ATK 370', 'stage.stats'),
    box(CX - 58, 112, 292, 22, 'text', 'Đòn: 🎯 → 🎯 → 💥', 'stage.pattern'),
    box(CX - 58, 140, 292, 22, 'text', 'Choáng: 6 viên', 'stage.stun'),
    box(CX - 58, 172, 292, 72, 'panel', '3 điều kiện sao', 'stage.starRules'),
    box(CX - 234, 254, 468, 28, 'text', 'Thưởng: ◎ 120 · EXP 60 · Lực chiến đề xuất', 'stage.reward'),
    box(CX - 234, 294, 220, 48, 'btn', 'Đổi đội', 'stage.team'),
    box(CX + 14, 294, 220, 48, 'primary', '▶ Đánh', 'stage.fight'),
    box(CX + 250 - 40, 36, 40, 40, 'btn', '✕', 'stage.close'),
  ] },
  { id: '05-team', dev: M, title: 'Đội hình — trái: 3 ô cột (trên→dưới) · phải: kho pet + boss', boxes: [
    box(0, 0, M.W, M.H, 'img', 'Nền bg_pet (mờ 5px, tối 80%)', 'team.bg'),
    box(L + E, T, 44, 40, 'btn', '←', 'topbar.back'),
    box(CX - 130, T, 260, 40, 'text', 'Băng tiêu đề "ĐỘI HÌNH"', 'team.title'),
    box(R - E - 168, T, 168, 40, 'chip', 'Boss: ảnh · tên · ◉hệ', 'team.boss'),
    // cột đội hình
    ...[0, 1, 2].map(k => {
      const y = 56 + k * 92;
      return [
        box(L + E, y, 300, 84, 'panel', '', `team.slot${k + 1}`),
        box(L + E + 6, y + 6, 26, 26, 'badge', String(k + 1), `team.slot${k + 1}.no`),
        box(L + E + 10, y + 10, 64, 64, 'img', 'Chân dung', `team.slot${k + 1}.art`),
        box(L + E + 82, y + 8, 150, 20, 'text', 'Tên · ◉vai ◉hệ', `team.slot${k + 1}.name`),
        box(L + E + 238, y + 6, 56, 22, 'chip', '▲/▼', `team.slot${k + 1}.adv`),
        box(L + E + 82, y + 34, 210, 18, 'text', '🎯 53%  ·  💥 80%', `team.slot${k + 1}.aggro`),
        box(L + E + 82, y + 56, 210, 20, 'text', 'Hệ số: gây ×1.5 · nhận ×0.75', `team.slot${k + 1}.mods`),
        ...(k < 2 ? [box(L + E + 136, y + 82, 28, 14, 'chip', '🌱', `team.link${k + 1}`)] : []),
      ];
    }).flat(),
    // kho pet
    box(R - E - 408, 56, 408, 34, 'chip', 'Lọc: Hệ ●●●●●● | Vai ●●●●', 'team.filter'),
    ...Array.from({ length: 5 }, (_, i) => box(R - E - 408 + i * 83, 98, 76, 104, 'panel', i < 3 ? `Pet (đã chọn ${i + 1})` : 'Pet', `team.pool${i + 1}`)),
    box(R - E - 408, 212, 408, 110, 'panel', 'Khắc chế boss: hệ boss · khắc bởi · gợi ý + mẹo sinh/đòn lan', 'team.hint'),
    box(R - E - 408, 334, 120, 40, 'btn', 'Gợi ý đội', 'team.auto'),
    box(R - E - 180, 334, 180, 40, 'primary', '⚔ ĐÁNH!', 'team.fight'),
  ] },
  { id: '06-battle', dev: M, title: 'Chiến đấu — khung chính', boxes: BM },
  { id: '06b-battle-16x9', dev: DEV.std, title: 'Chiến đấu — 667×375 (16:9)', boxes: battle(DEV.std) },
  { id: '06c-battle-small', dev: DEV.small, title: 'Chiến đấu — 568×320 (nhỏ nhất)', boxes: battle(DEV.small) },
  { id: '06d-battle-wide', dev: DEV.wide, title: 'Chiến đấu — 932×430 (Pro Max)', boxes: battle(DEV.wide) },
  { id: '07-result', dev: M, title: 'Kết quả', boxes: [
    overlay,
    box(CX - 200, 16, 400, 56, 'text', '🏆 CHIẾN THẮNG', 'result.title'),
    ...[0, 1, 2].map(i => box(CX - 104 + i * 72, 76, 64, 56, 'img', '⭐', `result.star${i + 1}`)),
    box(CX - 160, 140, 320, 28, 'text', '◎ +360 · EXP +80', 'result.reward'),
    ...[0, 1, 2].map(i => box(CX - 316 + i * 216, 176, 200, 64, 'panel', `Pet ${i + 1} · Lv · thanh EXP`, `result.pet${i + 1}`)),
    box(CX - 200, 248, 400, 28, 'chip', '🐾 Mở khoá: Thỏ Ngọc!', 'result.unlock'),
    box(CX - 256, 296, 160, 48, 'btn', 'Chơi lại', 'result.retry'),
    box(CX - 80, 296, 160, 48, 'primary', 'Màn kế ▶', 'result.next'),
    box(CX + 96, 296, 160, 48, 'btn', 'Bản đồ', 'result.map'),
  ] },
  { id: '08-pet-list', dev: M, title: 'Bộ sưu tập pet — nền mờ, lọc Hệ/Vai, phân trang 5/trang', boxes: [
    box(0, 0, M.W, M.H, 'img', 'Nền bg_pet (làm mờ 5px, tối 80%)', 'pets.bg'),
    box(L + E, T, 44, 40, 'btn', '←', 'topbar.back'),
    box(CX - 130, T, 260, 40, 'text', 'Băng tiêu đề "PET"', 'pets.title'),
    box(R - E - 112, T + 4, 112, 32, 'chip', '◎ Vàng', 'topbar.gold'),
    box(CX - 200, 56, 400, 38, 'chip', 'Thanh lọc kính mờ: Hệ ●●●●●● | Vai ●●●●', 'pets.filter'),
    box(CX - 410, 192, 36, 52, 'btn', '◀', 'pets.prev'),
    ...Array.from({ length: 5 }, (_, i) => {
      const x = CX - 362 + i * 147, y = 114;
      return [
        box(x, y, 136, 208, 'panel', '', `pets.card${i + 1}`),
        box(x + 1, y + 10, 134, 134, 'img', 'Pet trên bệ (thở)', `pets.card${i + 1}.art`),
        box(x + 8, y + 174, 120, 26, 'text', 'Tên (dải tím)', `pets.card${i + 1}.name`),
        ...(i < 3 ? [box(x + 17, y + 8, 30, 30, 'badge', String(i + 1), `pets.card${i + 1}.slot`)] : []),
      ];
    }).flat(),
    box(CX + 374, 192, 36, 52, 'btn', '▶', 'pets.next'),
    box(CX - 40, 332, 80, 18, 'chip', '▬ • 1/1', 'pets.pager'),
  ] },
  { id: '09-pet-detail', dev: M, title: 'Chi tiết pet — nền mờ, pet giữa vùng trái, cột thông tin sát phải', boxes: [
    box(0, 0, M.W, M.H, 'img', 'Nền bg_pet (làm mờ 5px, tối 80%)', 'pet.bg'),
    box(L + E, T, 44, 40, 'btn', '←', 'topbar.back'),
    box(CX - 130, T, 260, 40, 'text', 'Băng tiêu đề: tên pet', 'pet.title'),
    box(CX - 376, 65, 290, 290, 'img', 'Pet lớn trên bệ lớn + quầng sáng (hoạt ảnh đứng yên)', 'pet.art'),
    box(R - E - 440, 56, 440, 44, 'panel', 'Tên 20pt · ◉ vai · ◉ hệ ········ Lv 1', 'pet.header'),
    box(R - E - 440, 112, 440, 150, 'panel', '', 'pet.stats'),
    ...['HP', 'ATK', 'DEF', 'Aggro'].map((s, i) => box(R - E - 440 + 22, 128 + i * 30, 396, 26, 'text', `icon 26 · ${s} · thanh 14 cao · số 17pt`, `pet.stat${i + 1}`)),
    box(R - E - 440, 274, 440, 56, 'panel', 'ULT: icon 40 · tên chiêu · mô tả', 'pet.ult'),
    box(R - E - 180 - 12 - 140, 342, 140, 36, 'btn', 'Lên cấp (sau)', 'pet.levelUp'),
    box(R - E - 180, 342, 180, 36, 'primary', 'Chọn vào đội / Trong đội · ô N', 'pet.toTeam'),
  ] },
  { id: '10-settings', dev: M, title: 'Cài đặt (toàn màn)', boxes: [
    box(L + E, T, 44, 40, 'btn', '←', 'topbar.back'),
    box(CX - 130, T, 260, 40, 'text', 'Cài đặt', 'settings.title'),
    ...['Âm thanh', 'Rung khi bị đánh'].map((t, i) => box(L + E + 4, 64 + i * 40, 420, 30, 'text', t + '  ·  [điều khiển]', `settings.row${i + 1}`)),
    box(CX - 80, B - E - 36, 160, 36, 'btn', 'Xoá dữ liệu', 'settings.reset'),
  ] },
];

// ───────── vẽ SVG ─────────
const FILL = { panel: '#e8e4f3', btn: '#cfc8e6', primary: '#ffcf70', text: 'none', img: '#f3f3f3', chip: '#ddd6f0', board: '#d9d4ea', cell: '#ffffff', gem: '#ffe08a',
  'bar-hp': '#3fb950', 'bar-sh': '#58a6ff', 'bar-rage': '#f0883e', 'bar-boss': '#e5484d', 'bar-stun': '#9aa4b8', 'bar-exp': '#a371f7',
  modal: '#f6f4fb', overlay: '#00000055', node: '#cfc8e6', toast: '#333', badge: '#e5484d' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function svg(sc) {
  const { W, H, safe, name } = sc.dev, CAP = 30, o = [];
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + CAP}" viewBox="0 -${CAP} ${W} ${H + CAP}" font-family="Arial, sans-serif">`);
  o.push(`<rect x="0" y="-${CAP}" width="${W}" height="${CAP}" fill="#1b1230"/><text x="8" y="-10" fill="#fff" font-size="13" font-weight="bold">${esc(sc.id + ' · ' + sc.title)}</text><text x="${W - 8}" y="-10" fill="#bbb" font-size="11" text-anchor="end">${W}×${H} pt · ${esc(name)}</text>`);
  o.push(`<rect width="${W}" height="${H}" fill="#fff"/>`);
  o.push(`<g stroke="#000" stroke-opacity=".05">${Array.from({ length: Math.floor(W / 8) }, (_, i) => `<line x1="${i * 8}" y1="0" x2="${i * 8}" y2="${H}"/>`).join('')}${Array.from({ length: Math.floor(H / 8) }, (_, i) => `<line x1="0" y1="${i * 8}" x2="${W}" y2="${i * 8}"/>`).join('')}</g>`);
  o.push(`<g fill="#e5484d" fill-opacity=".08"><rect width="${safe.l}" height="${H}"/><rect x="${W - safe.r}" width="${safe.r}" height="${H}"/><rect y="${H - safe.b}" width="${W}" height="${safe.b}"/><rect width="${W}" height="${safe.t}"/></g>`);
  for (const b of sc.boxes) {
    const f = FILL[b.k] || '#eee';
    if (b.k === 'overlay') { o.push(`<rect width="${W}" height="${H}" fill="${f}"/>`); continue; }
    const r = ['btn', 'primary', 'chip', 'modal', 'panel', 'node', 'gem', 'toast'].includes(b.k) ? (b.k === 'chip' ? b.h / 2 : b.k === 'node' ? b.w / 2 : 8) : b.k.startsWith('bar') ? b.h / 2 : 0;
    o.push(`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${r}" fill="${f}" stroke="${b.k === 'text' ? '#7a6fa8' : '#6a5f96'}" stroke-dasharray="${b.k === 'text' ? '3 3' : ''}" stroke-width="1"/>`);
    if (b.k === 'img') o.push(`<path d="M${b.x} ${b.y}L${b.x + b.w} ${b.y + b.h}M${b.x + b.w} ${b.y}L${b.x} ${b.y + b.h}" stroke="#bbb"/>`);
    if (b.k === 'board') for (let i = 1; i < 6; i++) { const c = b.w / 6 * i; o.push(`<path d="M${b.x + c} ${b.y}V${b.y + b.h}M${b.x} ${b.y + c}H${b.x + b.w}" stroke="#fff" stroke-width="2"/>`); }
    if (b.k === 'board') for (let i = 0; i < 36; i++) { const c = b.w / 6, gx = b.x + (i % 6) * c + 2, gy = b.y + Math.floor(i / 6) * c + 2; o.push(`<rect x="${gx}" y="${gy}" width="${c - 4}" height="${c - 4}" rx="${(c - 4) * .24}" fill="${['#e8b923', '#3fb950', '#8a94a6', '#8957e5', '#e5484d'][(i * 7 + Math.floor(i / 6)) % 5]}" fill-opacity=".35"/>`); }
    if (b.l && b.h >= 12) o.push(`<text x="${b.x + b.w / 2}" y="${b.y + b.h / 2 + 4}" font-size="${Math.min(12, b.h - 2)}" text-anchor="middle" fill="${b.k === 'toast' ? '#fff' : '#222'}">${esc(b.l)}</text>`);
    if (b.w >= 40 && b.h >= 28 && !['text', 'board'].includes(b.k)) o.push(`<text x="${b.x + b.w - 3}" y="${b.y + b.h - 3}" font-size="8" text-anchor="end" fill="#6a5f96">${b.w}×${b.h}</text>`);
  }
  o.push(`<rect x="${safe.l}" y="${safe.t}" width="${W - safe.l - safe.r}" height="${H - safe.t - safe.b}" fill="none" stroke="#e5484d" stroke-dasharray="6 4"/>`);
  o.push('</svg>');
  return o.join('\n');
}

// ───────── LAYOUT.md (bảng toạ độ) + trang xem nhanh ─────────
const md = ['# Bảng toạ độ các màn (tự sinh — đừng sửa tay, sửa `gen-wireframes.mjs`)', '',
  'Đơn vị pt (= CSS px), gốc (0,0) góc trên-trái khung. Vùng an toàn = khung đỏ nét đứt trong SVG.', ''];
for (const sc of SCREENS) {
  fs.writeFileSync(new URL(sc.id + '.svg', OUT), svg(sc));
  const { W, H, safe } = sc.dev;
  md.push(`## ${sc.id} — ${sc.title}`, `Khung ${W}×${H} · an toàn trái ${safe.l} phải ${safe.r} trên ${safe.t} dưới ${safe.b} · ![](wireframes/${sc.id}.svg)`, '',
    '| id | x | y | w | h | loại | nội dung |', '|---|---|---|---|---|---|---|',
    ...sc.boxes.filter(b => b.id && b.k !== 'overlay').map(b => `| ${b.id} | ${b.x} | ${b.y} | ${b.w} | ${b.h} | ${b.k} | ${b.l || ''} |`), '');
}
fs.writeFileSync(new URL('./LAYOUT.md', import.meta.url), md.join('\n'));
fs.writeFileSync(new URL('./index.html', import.meta.url), `<!doctype html><meta charset="utf-8"><title>Wireframes</title>
<style>body{background:#1b1230;color:#fff;font-family:sans-serif;margin:16px}img{display:block;max-width:100%;margin:0 0 24px;box-shadow:0 2px 12px #0008}</style>
<h1>Pokiwar Lite — Wireframes</h1><p>Mở từng file SVG trong Figma/Illustrator/Photoshop để vẽ đè. Quy chuẩn: UI-SPEC.md · Toạ độ: LAYOUT.md</p>
${SCREENS.map(s => `<img src="wireframes/${s.id}.svg" alt="${s.id}">`).join('\n')}`);
console.log(SCREENS.length + ' màn → design/wireframes/*.svg, design/LAYOUT.md, design/index.html');
