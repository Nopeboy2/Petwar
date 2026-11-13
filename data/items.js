// Bảng tài nguyên Túi đồ — design/briefs/11-bag.md mục G. Thêm tài nguyên mới = thêm 1 dòng + 1 icon 192px trong assets/bag-ui.
// Vàng / Kim cương KHÔNG nằm ở đây: chỉ hiện bằng chip góc trên phải (ART.chip_bar + icon_coin / icon_gem). rar: 1 Thường · 2 Khá · 3 Hiếm · 4 Sử thi · 5 Huyền thoại (khung assets/bag-ui/slot_item_<rar>, design/tools/slot4.html). Số lượng đọc ở ui/app.js (itemCount). src: 1 dòng hoặc mảng nhiều dòng nguồn.
import { ELEM } from './elements.js';
import { BOSSES } from './bosses.js';

export const RARITY = [null, { n: 'Thường', c: '#8a6a4a' }, { n: 'Khá', c: '#3fa34d' }, { n: 'Hiếm', c: '#3a7bd5' }, { n: 'Sử thi', c: '#9b4dca' }, { n: 'Huyền thoại', c: '#e8891a' }];
export const TABS = [['all', 'Tất cả'], ['stone', 'Đá'], ['item', 'Vật phẩm'], ['chest', 'Rương']];
export const EL_ORDER = ['moc', 'hoa', 'tho', 'kim', 'thuy']; // vòng Sinh
const TIER = ['I', 'II', 'III'];
const bossOf = el => `Đánh boss hệ ${ELEM[el].n}${BOSSES.some(b => b.el === el) ? '' : ' (sắp có)'}`;

const CHESTS = [ // [tên, mô tả, nguồn] theo cấp 1–5. Cấp 1–3: lần đầu đạt 1★/2★/3★ mỗi boss nhận 1 rương + 1 chìa cùng cấp (ui/app.js fight). Cấp 4–5: sự kiện
  ['Gỗ', 'Chứa vàng và đá cấp I. Sắp mở được.', 'Lần đầu đạt 1★ ở mỗi boss (kèm chìa)'],
  ['Lục Bảo', 'Chứa vàng và đá cấp II. Sắp mở được.', 'Lần đầu đạt 2★ ở mỗi boss (kèm chìa)'],
  ['Lam Ngọc', 'Chứa vàng và đá cấp III. Sắp mở được.', 'Lần đầu đạt 3★ ở mỗi boss (kèm chìa)'],
  ['Tử Ngọc', 'Rương sự kiện: chứa nhiều đá cấp III. Sắp có.', 'Sự kiện (sắp có)'],
  ['Huyền Thoại', 'Rương sự kiện: phần thưởng hiếm nhất. Sắp có.', 'Sự kiện (sắp có)'],
];
export const ITEMS = [
  ...EL_ORDER.flatMap(el => [0, 1, 2].map(t => ({ id: `stone_${el}_${t}`, n: `Đá ${ELEM[el].n} ${TIER[t]}`, cat: 'stone', rar: [1, 3, 4][t], el, t,
    desc: `Dùng để nâng cấp pet hệ ${ELEM[el].n}.`, src: [t ? 'Cửa hàng · nâng cấp · chuyển hoá' : 'Cửa hàng · chuyển hoá đá', bossOf(el)] }))),
  // chưa có tính năng — chỉ hiện khi save.items có (thử: ?items=5)
  { id: 'shard', n: 'Mảnh pet', cat: 'item', rar: 4, icon: 'item_shard', desc: 'Gom đủ mảnh để mở khoá pet. Sắp có.', src: 'Sắp có' },
  { id: 'ticket', n: 'Vé đấu', cat: 'item', rar: 3, icon: 'item_ticket', desc: 'Vé vào đấu trường. Sắp có.', src: 'Sắp có' },
  // 5 cấp rương + chìa cùng cấp (design/tools/keychest.html). Rương 1–3: thưởng lần đầu đạt 1★/2★/3★ mỗi boss.
  ...CHESTS.map(([n, desc, src], k) => ({ id: 'chest_' + (k + 1), n: 'Rương ' + n, cat: 'chest', rar: k + 1, icon: 'item_chest_' + (k + 1), desc, src })),
  ...CHESTS.map(([n], k) => ({ id: 'key_' + (k + 1), n: 'Chìa ' + n, cat: 'item', rar: k + 1, icon: 'item_key_' + (k + 1), desc: `Mở 1 Rương ${n}. Sắp có.`, src: k < 3 ? `Lần đầu đạt ${k + 1}★ ở mỗi boss` : 'Sự kiện (sắp có)' })),
];
