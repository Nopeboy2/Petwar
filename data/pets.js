// r: T tanker / S hỗ trợ / D sát thương.  el: hệ Ngũ hành.  ult: shield|heal (tỉ lệ maxHP cả đội) | nuke (ATK × v)
// id = tên file ảnh (assets/pets/pet_<id>_*.webp)
// cap = chỉ số boss (BOSSES): pet chỉ có sau khi thắng boss đó 3⭐ (thu phục). Không có cap = có sẵn từ đầu.
export const ROLE = { T: 'Tanker', S: 'Hỗ trợ', D: 'Sát thương' };
export const ULT_TEXT = {
  shield: v => `Khiên cả đội +${Math.round(v * 100)}% HP`,
  heal: v => `Hồi cả đội ${Math.round(v * 100)}% HP`,
  nuke: v => `Gây sát thương lớn (ATK × ${v})`,
};
export const PETS = [
  { id: 'rockmane',  n: 'Rockmane',  el: 'tho',  e: '🦁', r: 'T', hp: 1600, atk: 30, def: 50, ag: 200, ult: { k: 'shield', v: 0.25 } },
  { id: 'tidewisp',  n: 'Tidewisp',  el: 'thuy', e: '💧', r: 'S', hp: 900,  atk: 35, def: 20, ag: 100, ult: { k: 'heal', v: 0.35 } },
  { id: 'leafkit',   n: 'Leafkit',   el: 'moc',  e: '🌿', r: 'S', hp: 1050, atk: 45, def: 20, ag: 100, ult: { k: 'heal', v: 0.35 } },
  { id: 'blazefang', n: 'Blazefang', el: 'hoa',  e: '🐯', r: 'D', hp: 800,  atk: 70, def: 15, ag: 75,  ult: { k: 'nuke', v: 12 } },
  { id: 'steelclaw', n: 'Steelclaw', el: 'kim',  e: '🐺', r: 'D', hp: 900,  atk: 56, def: 20, ag: 75,  ult: { k: 'nuke', v: 12 } },
  // Pet thu phục từ boss (design/briefs/boss-art.md mục 3): ~+10% so với pet cùng vai — phần thưởng 3⭐. ponytail: số ước lượng, cân lại bằng node sim.js
  { id: 'gearhorn',  n: 'Gearhorn',  el: 'kim',  e: '🦏', r: 'T', hp: 1750, atk: 33, def: 55, ag: 200, ult: { k: 'shield', v: 0.28 }, cap: 0 },
  { id: 'elderoot',  n: 'Elderoot',  el: 'moc',  e: '🦌', r: 'S', hp: 1150, atk: 48, def: 22, ag: 100, ult: { k: 'heal', v: 0.38 }, cap: 1 },
  { id: 'pearlwyrm', n: 'Pearlwyrm', el: 'thuy', e: '🐉', r: 'S', hp: 1000, atk: 40, def: 22, ag: 100, ult: { k: 'heal', v: 0.38 }, cap: 2 },
  { id: 'magmaw',    n: 'Magmaw',    el: 'hoa',  e: '🦎', r: 'D', hp: 880,  atk: 77, def: 17, ag: 75,  ult: { k: 'nuke', v: 13 }, cap: 3 },
  { id: 'duneshell', n: 'Duneshell', el: 'tho',  e: '🐢', r: 'T', hp: 1800, atk: 30, def: 58, ag: 200, ult: { k: 'shield', v: 0.28 }, cap: 4 },
];
