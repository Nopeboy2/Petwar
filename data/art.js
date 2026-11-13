// Tên asset → đường dẫn ảnh. Thay bộ hình = sửa file này, không sửa giao diện.
// Nguồn: design/source/home-kit.png (`node design/tools/extract.mjs`) + home-kit-v2/ (`node design/tools/extract.mjs home2.html`).
const UI = 'assets/ui/';
export const ART = {
  bg_sanh: UI + 'bg_sanh.webp',
  btn_gold: UI + 'btn_gold.webp', btn_purple: UI + 'btn_purple.webp', badge_lv: UI + 'badge_lv.webp', bar_track: UI + 'bar_track.webp', bar_fill: UI + 'bar_fill.webp',
  chip_bar: UI + 'chip_bar.webp', icon_coin: UI + 'icon_coin.webp', icon_gem: 'assets/bag-ui/item_gem.webp',
  panel_leaf: UI + 'panel_leaf.webp',
  avatar_frame: UI + 'avatar_frame.webp', pedestal: UI + 'pedestal.png',
  icon_gear: UI + 'icon_gear.webp', icon_swords: UI + 'icon_swords.png',
  icon_paw: UI + 'icon_paw.png', icon_shield: UI + 'icon_shield.png', icon_shop: UI + 'icon_shop.webp', icon_bag: UI + 'icon_bag.png',
};

// Bộ UI trang Pet (design/source/pet-ui-kit, đã chuyển WebP)
export const pui = n => `assets/pet-ui/${n}.webp`;
// Bộ màn Chọn đảo (design/source/map-ui-kit.png, cắt bằng `node design/tools/extract.mjs map.html assets/map-ui`)
export const mui = n => `assets/map-ui/${n}.webp`;
// Bộ Nâng cấp + Túi đá (design/source/upgrade-ui-kit → `node design/tools/extract.mjs upgrade.html assets/upgrade-ui`). Đá: stone_<hệ>_<1|2|3>
export const uui = n => `assets/upgrade-ui/${n}.webp`;
// Bộ Túi đồ (design/source/bag-ui-kit → `node design/tools/extract.mjs bag.html assets/bag-ui`)
export const bui = n => `assets/bag-ui/${n}.webp`;
// Ảnh boss (tư thế idle) lấy từ b.img; boss không có img dùng bóng "?". Đổi tư thế trong trận: ui/battle.js bpose()
export const bossArt = b => `<img class="ba" src="${b.img || mui('boss_unknown')}" alt="${b.n}">`;

// Ảnh pet: assets/pets/pet_<id>_<tư thế>[_L].webp (tạo bằng design/tools/pet.mjs).
// Khai báo tư thế đã có ảnh; thiếu tư thế → dùng idle; pet không có trong bảng → dùng emoji.
const ALL_POSES = ['idle', 'portrait', 'attack', 'hurt', 'ult', 'down', 'happy'];
const BOSS_PET = ['idle', 'portrait', 'attack', 'hurt', 'down']; // pet thu phục: ảnh boss lật ngang (pets.json → files); ult/happy dùng idle
const PET_HAS = { rockmane: ALL_POSES, tidewisp: ALL_POSES, leafkit: ALL_POSES, blazefang: ALL_POSES, steelclaw: ALL_POSES,
  gearhorn: BOSS_PET, elderoot: BOSS_PET, pearlwyrm: BOSS_PET, magmaw: BOSS_PET, duneshell: BOSS_PET };
export function petImg(p, pose = 'idle', big = false) {
  const has = PET_HAS[p && p.id]; if (!has) return null;
  if (!has.includes(pose)) pose = 'idle';
  return `assets/pets/pet_${p.id}_${pose}${big && pose !== 'portrait' ? '_L' : ''}.webp`;
}
// <img> nếu có ảnh, ngược lại emoji. size = cạnh hiển thị (px)
export const petIcon = (p, size, pose = 'idle', big = false) => {
  const src = petImg(p, pose, big);
  return src ? `<img class="pimg" src="${src}" alt="${p.n}" style="width:${size}px;height:${size}px">`
    : `<span style="font-size:${Math.round(size * 0.7)}px;line-height:1">${p.e}</span>`;
};
