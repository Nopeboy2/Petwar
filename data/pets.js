// r: T tanker / S hỗ trợ / D sát thương.  el: hệ Ngũ hành.  ult: shield|heal (tỉ lệ maxHP cả đội) | nuke (ATK × v)
// id = tên file ảnh (assets/pets/pet_<id>_*.webp)
// cap = chỉ số boss (BOSSES): pet chỉ có sau khi thắng boss đó 3⭐ (thu phục). Không có cap = có sẵn từ đầu.
export const ROLE = { T: 'Tanker', S: 'Hỗ trợ', D: 'Sát thương' };
export const ULT_NAME = { shield: 'Khiên hộ đội', heal: 'Hồi phục đội', nuke: 'Đòn huỷ diệt' };
export const ULT_TEXT = {
  shield: v => `Khiên cả đội +${Math.round(v * 100)}% HP`,
  heal: v => `Hồi cả đội ${Math.round(v * 100)}% HP`,
  nuke: v => `Gây sát thương lớn (ATK × ${v})`,
};
export const PETS = [
  { id: 'rockmane',  n: 'Gorran',    el: 'tho',  e: '🦁', r: 'T', hp: 1760, atk: 33, def: 55, ag: 200, ult: { k: 'shield', v: 0.25 } },
  { id: 'tidewisp',  n: 'Nerys',     el: 'thuy', e: '💧', r: 'S', hp: 1080, atk: 42, def: 22, ag: 100, ult: { k: 'heal', v: 0.35 } },
  { id: 'leafkit',   n: 'Sylfi',     el: 'moc',  e: '🌿', r: 'S', hp: 1260, atk: 54, def: 22, ag: 100, ult: { k: 'heal', v: 0.35 } },
  { id: 'blazefang', n: 'Ignar',     el: 'hoa',  e: '🐯', r: 'D', hp: 960,  atk: 84, def: 17, ag: 75,  ult: { k: 'nuke', v: 12 } },
  { id: 'steelclaw', n: 'Kaelor',    el: 'kim',  e: '🐺', r: 'D', hp: 1080, atk: 67, def: 22, ag: 75,  ult: { k: 'nuke', v: 12 } },
  // Pet thu phục từ boss (design/briefs/boss-art.md mục 3): ~+10% so với pet cùng vai — phần thưởng 3⭐. ponytail: số ước lượng, cân lại bằng node sim.js
  { id: 'gearhorn',  n: 'Ferrox',    el: 'kim',  e: '🦏', r: 'T', hp: 1930, atk: 36, def: 60, ag: 200, ult: { k: 'shield', v: 0.28 }, cap: 0 },
  { id: 'elderoot',  n: 'Ylvar',     el: 'moc',  e: '🦌', r: 'S', hp: 1380, atk: 58, def: 24, ag: 100, ult: { k: 'heal', v: 0.38 }, cap: 1 },
  { id: 'pearlwyrm', n: 'Maeris',    el: 'thuy', e: '🐉', r: 'S', hp: 1200, atk: 48, def: 24, ag: 100, ult: { k: 'heal', v: 0.38 }, cap: 2 },
  { id: 'magmaw',    n: 'Pyrrak',    el: 'hoa',  e: '🦎', r: 'D', hp: 1060, atk: 92, def: 19, ag: 75,  ult: { k: 'nuke', v: 13 }, cap: 3 },
  { id: 'duneshell', n: 'Sahrun',    el: 'tho',  e: '🐢', r: 'T', hp: 1980, atk: 33, def: 64, ag: 200, ult: { k: 'shield', v: 0.28 }, cap: 4 },
];
