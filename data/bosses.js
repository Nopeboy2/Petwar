// img = ảnh boss quay TRÁI, tư thế idle (đủ 5 tư thế idle/attack/hurt/stun/down cùng tên đổi đuôi) (design/tools/boss.html; thiết kế: design/briefs/boss-art.md). gold = vàng mỗi lần thắng (lần đầu ×3). xp = kinh nghiệm người chơi (lần đầu ×2).  stun = số viên Xoắn để đầy thanh Choáng.  pat = mẫu xoay vòng kiểu đòn.  el = hệ Ngũ hành
export const ATK_NAME = { single: 'Đơn mục tiêu', blast: 'Đòn lan', aoe: 'Toàn đội' };
export const BOSSES = [
  // Boss hiện có = boss ĐẦU của mỗi đảo, cùng mức dễ (đội mặc định thắng ~85–100%). Đảo không chia độ khó; boss 2–3 trong cùng đảo mới mạnh dần. Số mô phỏng: design/BOSS.md (node sim.js --curve)
  { n: 'Ferrox', img: 'assets/bosses/boss_gearhorn_idle.webp',  el: 'kim',  e: '👹', gold: 100, xp: 40, hp: 7000, atk: 580, stun: 6, pat: ['single', 'single', 'blast'] },
  { n: 'Ylvar', img: 'assets/bosses/boss_elderoot_idle.webp', el: 'moc',  e: '🐲', gold: 150, xp: 60, hp: 7500, atk: 560, stun: 7, pat: ['single', 'blast', 'aoe'] },
  { n: 'Maeris', img: 'assets/bosses/boss_pearlwyrm_idle.webp', el: 'thuy', e: '💀', gold: 200, xp: 80, hp: 8000, atk: 520, stun: 8, pat: ['aoe', 'blast', 'single', 'aoe'] },
  { n: 'Pyrrak', img: 'assets/bosses/boss_magmaw_idle.webp', el: 'hoa', e: '🌋', gold: 250, xp: 100, hp: 7000, atk: 620, stun: 6, pat: ['blast', 'aoe', 'blast', 'aoe'] }, // Bùng nổ: ATK cao nhất, đánh lan liên tục, dễ choáng
  { n: 'Sahrun', img: 'assets/bosses/boss_duneshell_idle.webp', el: 'tho', e: '🗿', gold: 300, xp: 120, hp: 9500, atk: 540, stun: 9, pat: ['single', 'single', 'aoe'] },        // Pháo đài: máu trâu nhất, khó choáng nhất, dồn đòn vào ô đầu
  // Boss 2 mỗi đảo (chỉ số 5–9): mở sau khi hạ hết boss đầu. Chưa có ảnh → hiện bóng "?". Mục tiêu sim: design/BOSS.md
  { n: 'Ironvex', el: 'kim', e: '🤖', gold: 150, xp: 60, hp: 21000, atk: 760, stun: 7, pat: ['single', 'blast', 'aoe'] },
  { n: 'Thornwarden', el: 'moc', e: '🌳', gold: 220, xp: 90, hp: 15000, atk: 680, stun: 8, pat: ['single', 'blast', 'aoe'] },
  { n: 'Abyssia', el: 'thuy', e: '🦑', gold: 300, xp: 120, hp: 14000, atk: 620, stun: 9, pat: ['aoe', 'blast', 'single', 'aoe'] },
  { n: 'Cindrax', el: 'hoa', e: '🔥', gold: 380, xp: 150, hp: 16500, atk: 810, stun: 7, pat: ['blast', 'aoe', 'blast', 'aoe'] },
  { n: 'Quarrok', el: 'tho', e: '🪨', gold: 450, xp: 180, hp: 15000, atk: 610, stun: 10, pat: ['single', 'single', 'aoe'] },
  // Boss 3 mỗi đảo (chỉ số 10–14): mở sau khi hạ hết boss 2.
  { n: 'Chromaul', el: 'kim', e: '⚔️', gold: 200, xp: 80, hp: 25000, atk: 920, stun: 8, pat: ['single', 'blast', 'aoe', 'single'] },
  { n: 'Verdaxis', el: 'moc', e: '🐍', gold: 300, xp: 120, hp: 17000, atk: 740, stun: 9, pat: ['blast', 'aoe', 'single', 'aoe'] },
  { n: 'Tidecrown', el: 'thuy', e: '🐙', gold: 400, xp: 160, hp: 20000, atk: 720, stun: 10, pat: ['aoe', 'aoe', 'blast', 'single'] },
  { n: 'Infernox', el: 'hoa', e: '👺', gold: 500, xp: 200, hp: 22000, atk: 880, stun: 7, pat: ['blast', 'aoe', 'blast', 'aoe'] },
  { n: 'Terragon', el: 'tho', e: '🦕', gold: 600, xp: 240, hp: 21000, atk: 700, stun: 12, pat: ['single', 'single', 'aoe', 'blast'] },
];
// Đảo = khu vực đánh boss (màn 03, design/briefs/03-islands.md). id = hệ của đảo; bosses = chỉ số trong BOSSES, [] = sắp ra mắt.
// Thứ tự mở khoá theo chỉ số BOSSES: hết boss 1 của 5 đảo → boss 2 → boss 3 (thêm boss vào CUỐI mảng để dữ liệu lưu `cleared` cũ vẫn đúng).
export const ISLANDS = [
  { id: 'kim', n: 'Đảo Thiết Nham', bosses: [0, 5, 10] },
  { id: 'moc', n: 'Đảo Rừng Ngàn', bosses: [1, 6, 11] },
  { id: 'thuy', n: 'Đảo Thủy Cung', bosses: [2, 7, 12] },
  { id: 'hoa', n: 'Đảo Hỏa Sơn', bosses: [3, 8, 13] },
  { id: 'tho', n: 'Đảo Hoàng Thổ', bosses: [4, 9, 14] },
];
