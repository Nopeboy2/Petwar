// img = ảnh boss quay TRÁI, tư thế idle (đủ 5 tư thế idle/attack/hurt/stun/down cùng tên đổi đuôi) (design/tools/boss.html; thiết kế: design/briefs/boss-art.md). gold = vàng mỗi lần thắng (lần đầu ×3). xp = kinh nghiệm người chơi (lần đầu ×2).  stun = số viên Xoắn để đầy thanh Choáng.  pat = mẫu xoay vòng kiểu đòn.  el = hệ Ngũ hành
export const ATK_NAME = { single: 'Đơn mục tiêu', blast: 'Đòn lan', aoe: 'Toàn đội' };
export const BOSSES = [
  { n: 'Boss 1 (dễ)', img: 'assets/bosses/boss_gearhorn_idle.webp',  el: 'kim',  e: '👹', gold: 100, xp: 40, hp: 7000,  atk: 580, stun: 6,  pat: ['single', 'single', 'blast'] },
  { n: 'Boss 2 (vừa)', img: 'assets/bosses/boss_elderoot_idle.webp', el: 'moc',  e: '🐲', gold: 150, xp: 60, hp: 11000, atk: 620, stun: 8,  pat: ['single', 'blast', 'aoe'] },
  { n: 'Boss 3 (khó)', img: 'assets/bosses/boss_pearlwyrm_idle.webp', el: 'thuy', e: '💀', gold: 200, xp: 80, hp: 13500, atk: 650, stun: 10, pat: ['aoe', 'blast', 'single', 'aoe'] },
  // Boss 4–5: thiết kế + số mô phỏng ở design/BOSS.md (node sim.js --curve)
  { n: 'Boss 4 (rất khó)', img: 'assets/bosses/boss_magmaw_idle.webp', el: 'hoa', e: '🌋', gold: 250, xp: 100, hp: 16000, atk: 810, stun: 7,  pat: ['blast', 'aoe', 'blast', 'aoe'] }, // Bùng nổ: đánh lan liên tục, dễ choáng
  { n: 'Boss 5 (cực khó)', img: 'assets/bosses/boss_duneshell_idle.webp', el: 'tho', e: '🗿', gold: 300, xp: 120, hp: 23500, atk: 690, stun: 13, pat: ['single', 'single', 'aoe'] },        // Pháo đài: máu trâu, khó choáng, dồn đòn vào ô đầu
];
// Đảo = khu vực đánh boss (màn 03, design/briefs/03-islands.md). id = hệ của đảo; bosses = chỉ số trong BOSSES, [] = sắp ra mắt.
// ponytail: thứ tự đảo đi theo thứ tự mở khoá boss hiện có (Kim→Mộc→Thủy); chuyển sang vòng Sinh khi đủ 3 boss/đảo.
export const ISLANDS = [
  { id: 'kim', n: 'Đảo Thiết Nham', bosses: [0] },
  { id: 'moc', n: 'Đảo Rừng Ngàn', bosses: [1] },
  { id: 'thuy', n: 'Đảo Thủy Cung', bosses: [2] },
  { id: 'hoa', n: 'Đảo Hỏa Sơn', bosses: [3] },
  { id: 'tho', n: 'Đảo Hoàng Thổ', bosses: [4] },
];
