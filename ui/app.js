// Điều hướng, lưu dữ liệu và các màn ngoài chiến đấu.
import { CFG } from '../data/config.js';
import { ELEM } from '../data/elements.js';
import { SUGGEST } from '../data/suggest.js';
import { elemMods, KHAC, SINH, lvPet, upRate, upGold, upTotal, teamLv, lvBoss, plBonus, xpNeed, buffPet } from '../engine.js';
import { PETS, ROLE, ULT_TEXT } from '../data/pets.js';
import { BOSSES, ISLANDS, ATK_NAME } from '../data/bosses.js';
import { startBattle } from './battle.js';
import { ART, petImg, petIcon, pui, mui, uui, bui, bossArt } from '../data/art.js';
import { ITEMS, RARITY, TABS, EL_ORDER } from '../data/items.js';
import { today, shopStock, shopLeft } from '../data/shop.js';
import { unlock, setAudio, sfx } from './audio.js';

// ───────────── lưu dữ liệu (localStorage có thể bị chặn/xoá → luôn try/catch) ─────────────
const KEY = 'pokiwar-lite-v1';
const DEF = { version: 1, cleared: 0, plv: 1, xp: 0, gold: 0, gem: 0, stars: {}, lv: {}, fail: {}, stones: {}, items: {}, seen: {}, shop: { day: '', bought: {}, seen: '' }, lastTeam: [PETS[0].n, PETS[1].n, PETS[3].n], settings: { sfx: 1, vibrate: true }, stats: { battles: 0, wins: 0 } };
let save = load();
function load() {
  try {
    const o = JSON.parse(localStorage.getItem(KEY));
    if (o && o.version === 1) return { ...DEF, ...o, stars: { ...o.stars }, lv: { ...o.lv }, fail: { ...o.fail }, stones: { ...o.stones }, items: { ...o.items }, seen: { ...o.seen }, shop: { ...DEF.shop, ...o.shop, bought: { ...(o.shop || {}).bought } }, settings: { ...DEF.settings, ...o.settings }, stats: { ...DEF.stats, ...o.stats } };
  } catch { /* dùng mặc định */ }
  return JSON.parse(JSON.stringify(DEF));
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch { /* chấp nhận mất dữ liệu */ } }
// Nâng cấp: cấp pet, trần cấp theo tiến độ, kho đá [I, II, III] theo hệ (design/UPGRADE.md)
const lvOf = p => save.lv[p.id] || 1;
const owned = p => p.cap == null || save.stars[p.cap] >= 3; // pet boss: thu phục khi thắng boss đó 3⭐
const bossLv = () => teamLv(pick.map(i => lvOf(PETS[i]))); // cấp boss = cấp trung bình đội đang chọn
const stonesOf = el => (save.stones[el] = save.stones[el] || [0, 0, 0]);
const TIER = ['I', 'II', 'III'];
const devQ = new URLSearchParams(location.search); // dữ liệu mẫu (lưu luôn vào máy): ?all=9999 = mọi tài nguyên · hoặc riêng ?stones= &gold= &gem= &items=
if (['all', 'stones', 'gold', 'gem', 'items'].some(k => devQ.has(k))) {
  const v = k => devQ.has(k) ? +devQ.get(k) || 0 : devQ.has('all') ? +devQ.get('all') || 0 : null;
  if (v('stones') != null) for (const el of Object.keys(ELEM)) save.stones[el] = [0, 1, 2].map(() => v('stones'));
  if (v('gold') != null) save.gold = v('gold');
  if (v('gem') != null) save.gem = v('gem');
  if (v('items') != null) for (const it of ITEMS) if (it.cat !== 'stone') save.items[it.id] = v('items');
  persist();
}
const applySettings = () => setAudio(save.settings.sfx, save.settings.vibrate);
applySettings();

// ───────────── trợ giúp ─────────────
const view = document.getElementById('view');
// khung thiết kế 844×390 phóng theo màn hình (dùng cho các màn dựng theo LAYOUT)
const fit = () => {
  const k = Math.min(innerWidth / 844, innerHeight / 390), r = document.documentElement.style;
  r.setProperty('--k', k); r.setProperty('--sw', Math.max(844, innerWidth / k) + 'px'); r.setProperty('--sh', Math.max(390, innerHeight / k) + 'px'); // sảnh giãn theo chiều ngang thật → mép trái/phải bám sát màn hình
};
addEventListener('resize', fit); fit();
// Vị trí trong khung giãn (.stage): neo mép trái/phải/dưới cách 12pt + vùng tai thỏ; atM = giữa dọc; atC = khối 844 căn giữa
const at = (x, y, w, h) => `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
const atL = (x, y, w, h) => `left:calc(${x}px + env(safe-area-inset-left));top:${y}px;width:${w}px;height:${h}px`;
const atR = (x, y, w, h) => `right:calc(${x}px + env(safe-area-inset-right));top:${y}px;width:${w}px;height:${h}px`;
const atBL = (x, b, w, h) => `left:calc(${x}px + env(safe-area-inset-left));bottom:calc(${b}px + env(safe-area-inset-bottom));width:${w}px;height:${h}px`;
const atBR = (x, b, w, h) => `right:calc(${x}px + env(safe-area-inset-right));bottom:calc(${b}px + env(safe-area-inset-bottom));width:${w}px;height:${h}px`;
const atM = (x, y, w, h) => `left:${x}px;top:calc(${y}px + (var(--sh, 390px) - 390px) / 2 - env(safe-area-inset-bottom));width:${w}px;height:${h}px`;
const tflt = { el: '', r: '', page: 0 }; const TPAGE = 10; let teamSel = null; // kho pet 2 hàng × 5 · ô đang chọn ở màn Đội hình
const tui = n => `assets/team-ui/${n}.webp`, boi = n => `assets/boss-ui/${n}.webp`;
const bossAva = b => { const id = (b.img || '').match(/boss_([a-z]+)_idle/); return id ? `<img src="assets/pets/pet_${id[1]}_portrait.webp" alt="${b.n}">` : bossArt(b); }; // avatar = portrait của pet thu phục cùng loài
// Nút quay lại DUY NHẤT cho mọi màn: về màn gần nhất (lịch sử điều hướng)
const backBtn = (style = atL(12, 10, 48, 34)) => `<button class="bk"${style ? ` style="${style}"` : ''} data-act="back" aria-label="Quay lại" title="Quay lại"><img src="${boi('btn_back')}" alt=""></button>`;
const PAGE = 5; const flt = { el: '', r: '', page: 0 }; // bộ lọc + trang của Bộ sưu tập
const BLOCK = 'left:calc(50% - 422px);top:calc((var(--sh, 390px) - 390px) / 2);width:844px;height:390px'; // toạ độ bên trong = layout 844×390
const params = new URLSearchParams(location.search);
let bossIdx = 0, islIdx = 0, bossSel = null, pick = save.lastTeam.map(n => PETS.findIndex(p => p.n === n)).filter(i => i >= 0 && owned(PETS[i])).slice(0, 3);
if (pick.length < 3) pick = [0, 1, 3]; // dữ liệu lưu cũ (tên pet cũ) → đội mặc định
let battle = null, installEvt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; });

const STAR_MOVES = 30; // sao thứ 2: thắng trong ≤ số nước này
const statRow = p => `❤️${p.hp} ⚔️${p.atk} 🛡${p.def}`;
// Ngũ hành: nhãn hệ, hệ khắc được boss, mô tả hệ số trong trận
const elTag = el => el ? `<span class="el" style="color:${ELEM[el].c}">${ELEM[el].i} ${ELEM[el].n}</span>` : '';
const counterOf = el => Object.keys(KHAC).find(e => KHAC[e] === el);
const modText = m => [m.adv ? `<span class="up">▲ Khắc boss: gây ×${CFG.elem.adv}, nhận ×${CFG.elem.hurtDown}</span>` : '', m.dis ? `<span class="down">▼ Bị khắc: gây ×${CFG.elem.dis}, nhận ×${CFG.elem.hurtUp}</span>` : '',
  m.sinh ? `<span class="up">🌱 Được sinh: +${Math.round(CFG.elem.sinh * m.sinh * 100)}% ATK</span>` : ''].filter(Boolean).join(' · ');
const elChip = el => `<span class="pc-el" style="--c:${ELEM[el].c}"><img src="${pui('icon_el_' + el)}" alt="">${ELEM[el].n}</span>`;
const ULT_NAME = { shield: 'Khiên hộ đội', heal: 'Hồi phục đội', nuke: 'Đòn huỷ diệt' };
const markOf = m => m.adv ? '<span class="up">▲</span>' : m.dis ? '<span class="down">▼</span>' : '';

// ───────────── điều hướng ─────────────
const screens = {
  start() {
    view.innerHTML = `<div class="screen"><div class="logo">POKIWAR LITE</div><p class="dim">Ghép viên · Hạ boss</p><button class="primary" data-act="begin">Chạm để chơi</button></div>`;
  },
  // Trang chủ: toạ độ theo design/briefs/02-home.md (khung 844×390, phóng theo màn hình)
  home() {
    const next = BOSSES[Math.min(save.cleared, BOSSES.length - 1)], done = save.cleared >= BOSSES.length;
    const slot = (k, x) => {
      const p = PETS[pick[k]];
      return `<button class="h-pet" style="${atM(x, 100, 120, 176)}" data-act="formation">
        ${p ? `${petImg(p) ? `<img class="h-pimg" src="${petImg(p, 'idle', true)}" alt="">` : `<span class="h-pe">${p.e}</span>`}<img class="h-ped" src="${ART.pedestal}" alt=""><span class="h-pn${petImg(p) ? " hi" : ""}">${p.n}</span>` : '<span class="h-empty">+</span>'}</button>`;
    };
    const navBtn = (x, icon, label, act, dot = false) => `<button class="h-btn" style="${atBL(x, 20, 128, 56)}" data-act="${act}"><img src="${ART[icon]}" alt=""><span>${label}</span>${dot ? `<img class="h-dot" src="${pui('dot_notify')}" alt="Có hàng mới">` : ''}</button>`;
    view.innerHTML = `<div class="stage-wrap blur blur-soft" style="background-image:url(${ART.bg_sanh})"><div class="stage home">
      <div class="h-avatar" style="${atL(10, 4, 54, 54)}"><span>${PETS[pick[0]] ? petIcon(PETS[pick[0]], 34, 'portrait') : '🙂'}</span><img src="${ART.avatar_frame}" alt=""></div>
      <div class="h-name" style="${atL(68, 4, 160, 38)}" title="Cấp ${save.plv}: toàn đội +${(plBonus(CFG, save.plv) * 100).toFixed(1)}% HP/ATK/DEF"><span>Người chơi</span></div>
      <div class="h-plv" style="${atL(76, 44, 146, 14)}"><b>Lv ${save.plv}</b><i><s style="width:${save.plv >= CFG.player.maxLv ? 100 : Math.round(100 * save.xp / xpNeed(CFG, save.plv))}%"></s></i><small>+${(plBonus(CFG, save.plv) * 100).toFixed(1)}%</small></div>
      ${coin(save.gold, atR(184, 12, 112, 32))}
      ${gem(save.gem, atR(60, 12, 104, 32))}
      ${installEvt ? `<button class="h-icon" style="${atR(308, 8, 40, 40)}" data-act="install" aria-label="Cài app" title="Cài app"><img src="${ART.icon_shop}" alt=""></button>` : ''}
      <button class="h-icon" style="${atR(12, 8, 40, 40)}" data-act="settings" aria-label="Cài đặt"><img src="${ART.icon_gear}" alt=""></button>
      ${slot(0, 80)}${slot(1, 216)}${slot(2, 352)}
      <button class="h-team" style="${atM(80, 282, 392, 20)}" data-act="formation">Đội hình hiện tại · chạm để sửa</button>
      <button class="h-camp" style="${atBR(12, 16, 240, 64)}" data-act="islands">
        <img src="${ART.icon_swords}" alt=""><span class="h-ct"><b>CHIẾN DỊCH</b><small>${done ? 'Đã phá đảo · chơi lại màn bất kỳ' : 'Màn kế: ' + next.n}</small></span></button>
      ${navBtn(12, 'icon_paw', 'Pet', 'pets')}${navBtn(148, 'icon_shield', 'Đội hình', 'formation')}
      ${navBtn(284, 'icon_bag', 'Túi đồ', 'bag')}${navBtn(420, 'icon_shop', 'Cửa hàng', 'shop', save.shop.seen !== today())}
    </div></div>`;
  },
  // 03 Chọn đảo — design/briefs/03-islands.md (bộ asset assets/map-ui). Đảo mở khi boss đầu của đảo đã mở khoá.
  islands() {
    const POS = [[64, 196], [212, 80], [352, 200], [496, 80], [636, 196]]; // góc trái-trên ô đảo 150×120 trong khối 844×390
    const st = ISLANDS.map(s => {
      const open = s.bosses.length > 0 && s.bosses[0] <= save.cleared;
      return { open, done: open && s.bosses.every(i => i < save.cleared), got: s.bosses.reduce((a, i) => a + (i < save.cleared ? save.stars[i] || 1 : 0), 0) }; // tổng sao (mỗi boss tối đa 3)
    });
    const curI = st.findIndex(t => t.open && !t.done);
    const route = k => { // đường biển đảo k → k+1: ảnh route_* kéo dài và xoay nối tâm 2 đảo
      const [x0, y0] = POS[k], [x1, y1] = POS[k + 1], ax = x0 + 75, ay = y0 + 60, bx = x1 + 75, by = y1 + 60, len = Math.hypot(bx - ax, by - ay);
      return `<img class="il-route" src="${mui(st[k + 1].open ? 'route_on' : 'route_off')}" alt="" style="left:${(ax + bx - len) / 2}px;top:${(ay + by) / 2 - 12}px;width:${len}px;transform:rotate(${Math.atan2(by - ay, bx - ax)}rad)">`;
    };
    const isl = (s, k) => {
      const [x, y] = POS[k], t = st[k], sub = !s.bosses.length ? 'Sắp ra mắt' : !t.open ? 'Hạ boss đảo trước' : `★ ${t.got}/${3 * s.bosses.length}`;
      return `<button class="il${t.open ? '' : ' lock'}${t.done ? ' done' : ''}" style="left:${x}px;top:${y}px" ${t.open ? `data-act="isl" data-i="${k}"` : 'aria-disabled="true"'} aria-label="${s.n}: ${sub}">
        ${k === curI ? `<img class="il-fx" src="${mui('fx_portal_gold')}" alt="">` : ''}<img class="il-img" src="${mui('island_' + s.id)}" alt="">
        ${t.open ? '' : `<img class="il-fog" src="${mui('fog_lock')}" alt=""><img class="il-lock" src="${mui('icon_lock_gold')}" alt="">`}
        ${t.done ? `<img class="il-flag" src="${mui('flag_cleared')}" alt="">` : ''}${k === curI ? `<img class="il-pin" src="${mui('marker_current')}" alt="">` : ''}
        <span class="il-pl" style="background-image:url(${mui('plaque_' + s.id)})"><b>${s.n}</b><small>${sub}</small></span></button>`;
    };
    view.innerHTML = `<div class="stage-wrap" style="background-image:url(${mui('bg_sea_map')})"><div class="stage pg">
      ${backBtn()}
      <div class="pg-title" style="left:calc(50% - 150px);top:8px;width:300px;height:40px">CHỌN ĐẢO</div>
      <div class="il-prog" style="${atR(12, 6, 132, 46)}"><img src="${mui('icon_boss_mini')}" alt=""><span>Đã hạ <b>${Math.min(save.cleared, BOSSES.length)}/${BOSSES.length}</b></span></div>
      <div class="il-map" style="${BLOCK}">${POS.slice(1).map((_, k) => route(k)).join('')}${ISLANDS.map(isl).join('')}</div>
    </div></div>`;
  },
  // 04 Chọn boss trong đảo — design/briefs/04-boss.md (bộ asset assets/boss-ui; card_boss/panel_boss_detail chưa có → tạm card_team + khung CSS)
  boss() {
    const s = ISLANDS[islIdx], mid = '(var(--sh, 390px) - 390px) / 2', lv = bossLv();
    const ids = s.bosses.filter(i => i <= save.cleared);
    if (bossSel == null || !s.bosses.includes(bossSel) || bossSel > save.cleared) bossSel = ids.length ? ids[ids.length - 1] : null; // mặc định: boss đang cần đánh (hoặc boss cuối đã hạ)
    const got = s.bosses.reduce((n, i) => n + (i < save.cleared ? save.stars[i] || 1 : 0), 0);
    const stars = n => [0, 1, 2].map(k => `<img src="${boi(k < n ? 'icon_star_on' : 'icon_star_off')}" alt="">`).join('');
    const card = k => {
      const i = s.bosses[k];
      if (i == null) return `<div class="bsc soon" style="left:${164 * k}px"><img class="bsc-art" src="${mui('boss_unknown')}" alt=""><span class="bsc-n">Sắp ra mắt</span></div>`;
      const b = lvBoss(CFG, BOSSES[i], lv), lock = i > save.cleared, done = i < save.cleared;
      if (lock) return `<div class="bsc lock" style="left:${164 * k}px"><img class="bsc-art" src="${mui('boss_unknown')}" alt=""><img class="bsc-lock" src="${mui('icon_lock_gold')}" alt=""><span class="bsc-n">???</span><span class="bsc-sub">Hạ boss trước để mở</span></div>`;
      return `<button class="bsc${i === bossSel ? ' on' : ''}${done ? '' : ' cur'}" style="left:${164 * k}px" data-act="bSel" data-i="${i}" aria-label="${b.n}">
        <img class="bsc-el" src="${pui('icon_el_' + b.el)}" alt="Hệ ${ELEM[b.el].n}"><span class="bsc-lv">Lv ${b.lv}</span>
        <img class="bsc-art${b.img ? ' face-r' : ''}" src="${b.img || mui('boss_unknown')}" alt=""><span class="bsc-n">${b.n}</span>
        ${done ? `<img class="bsc-stamp" src="${boi('stamp_cleared')}" alt="Đã hạ">` : ''}<span class="bsc-stars">${stars(done ? save.stars[i] || 1 : 0)}</span></button>`;
    };
    let det = '';
    if (bossSel != null) {
      const i = bossSel, b = lvBoss(CFG, BOSSES[i], lv), first = i >= save.cleared, ce = counterOf(b.el), cap = PETS.find(p => p.cap === i);
      det = `<div class="bsd-head"><span class="bsd-ava">${bossAva(b)}</span><b>${b.n}</b><span class="bsd-lv">Lv ${b.lv}</span></div>
        <div class="bsd-row"><img src="${pui('icon_stat_hp')}" alt="">HP <b>${b.hp}</b><img src="${pui('icon_stat_atk')}" alt="" style="margin-left:18px">ATK <b>${b.atk}</b></div>
        <div class="bsd-row">Đòn:${b.pat.map(t => `<img src="${boi('icon_atk_' + t)}" alt="${ATK_NAME[t]}" title="${ATK_NAME[t]}">`).join('<i>›</i>')}</div>
        <div class="bsd-row"><img src="${pui('icon_el_' + b.el)}" alt=""><b class="bsd-el" style="color:${ELEM[b.el].c}">${ELEM[b.el].n}</b><span class="bsd-dim">· Khắc bởi</span><img src="${pui('icon_el_' + ce)}" alt=""><b class="bsd-el" style="color:${ELEM[ce].c}">${ELEM[ce].n}</b></div>
        <div class="bsd-row"><img src="${boi('icon_spiral')}" alt=""><b>${b.stun}</b> viên Xoắn để choáng</div>
        <div class="bsd-rw"><span class="bsd-lb">Thưởng</span><img src="${bui('item_gold')}" alt="Vàng"><b>${b.gold * (first ? 3 : 1)}</b><img src="${boi('icon_xp')}" alt="XP"><b>${Math.round((b.xp || 0) * (first ? CFG.player.first : 1))}</b>${first ? '<span class="bsd-first">Lần đầu</span>' : ''}</div>
        ${cap ? `<div class="bsd-cap" title="${owned(cap) ? 'Đã thu phục' : 'Thắng 3⭐ để thu phục'}"><img class="bsd-capf" src="${boi('frame_capture')}" alt=""><img class="bsd-capp" src="${petImg(cap, 'portrait')}" alt="${cap.n}"><small>${owned(cap) ? '✓ Đã có' : '3⭐ thu phục'}</small></div>` : ''}`;
    }
    view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(assets/battle/bg_${s.id}.webp)"><div class="stage pg bs">
      ${backBtn()}
      <div class="pg-title" style="left:calc(50% - 190px);top:7px;width:380px;height:44px">${s.n.toUpperCase()}</div>
      <div class="il-prog bs-prog" style="${atR(12, 6, 132, 46)}"><img src="${boi('icon_star_on')}" alt=""><span>Sao <b>${got}/${s.bosses.length * 3}</b></span></div>
      <div class="bs-l" style="left:calc(12px + env(safe-area-inset-left));top:calc(${mid});width:480px;height:390px">${[0, 1, 2].map(card).join('')}</div>
      <div class="bs-r" style="right:calc(12px + env(safe-area-inset-right));top:calc(${mid});width:316px;height:390px">
        <div class="bsd">${det}</div>
        <button class="bs-go" data-act="team" data-i="${bossSel}" ${bossSel == null ? 'disabled' : ''}><img src="${boi('icon_swords')}" alt="">CHỌN ĐỘI</button>
      </div>
    </div></div>`;
  },
  // 05 Đội hình — design/briefs/05-team.md (bộ asset assets/team-ui + assets/pet-ui)
  // arg 'battle': mở từ Chọn boss → có chip boss, ▲▼ khắc, Gợi ý đội, ĐÁNH!. Mặc định (từ sảnh): chỉ xếp 3 pet ra sân.
  team(arg) {
    const prep = arg === 'battle', STEP = 118, PER = prep ? TPAGE : 8, boss = prep ? lvBoss(CFG, BOSSES[bossIdx], bossLv()) : {}, team = pick.map(i => PETS[i]), mods = elemMods(CFG, team, boss); // aggro / đòn lan: chỉ tính ngầm trong trận, không hiện
    const full = pick.length === 3, sug = SUGGEST[bossIdx], isSug = !!sug && sug.ids.join() === team.map(p => p.id).join();
    const mid = '(var(--sh, 390px) - 390px) / 2';
    const x2 = v => (Math.round(v * 100) / 100).toString();
    const modLine = m => {
      const gay = (m.adv ? CFG.elem.adv : m.dis ? CFG.elem.dis : 1) * (1 + CFG.elem.sinh * m.sinh), nhan = m.dis ? CFG.elem.hurtUp : m.adv ? CFG.elem.hurtDown : 1;
      const cg = gay > 1 ? 'up' : gay < 1 ? 'down' : '', cn = nhan < 1 ? 'up' : nhan > 1 ? 'down' : '';
      return `<span class="${cg}" title="Hệ số sát thương GÂY ra (khắc, bị khắc, sinh)">Gây ×${x2(gay)}</span><span class="${cn}" title="Hệ số sát thương NHẬN vào">Nhận ×${x2(nhan)}</span>`;
    };
    const slot = k => {
      const i = pick[k], y = 56 + STEP * k;
      if (i == null) return `<button class="ts empty" style="top:${y}px" data-act="tSlot" data-k="${k}"><b class="ts-no">${k + 1}</b><span class="ts-plus">Ô ${k + 1} · chọn pet bên phải</span></button>`;
      const p = PETS[i], m = mods[k];
      return `<button class="ts${teamSel === k ? ' on' : ''}" style="top:${y}px" data-act="tSlot" data-k="${k}" aria-label="Ô ${k + 1}: ${p.n}">
        <span class="ts-art">${petIcon(p, 54, 'portrait')}</span><b class="ts-no">${k + 1}</b>
        <span class="ts-info"><span class="ts-name">${p.n}</span>
          ${m.adv ? `<b class="ts-tag up"><img src="${tui('tag_adv')}" alt="">Khắc chế boss</b>` : m.dis ? `<b class="ts-tag down"><img src="${tui('tag_dis')}" alt="">Boss khắc chế</b>` : ''}
          ${m.adv || m.dis || m.sinh ? `<span class="ts-mod">${modLine(m)}</span>` : ''}</span>
        <span class="ts-ic"><img src="${pui('icon_el_' + p.el)}" alt="${ELEM[p.el].n}" title="Hệ ${ELEM[p.el].n}"><img src="${pui('icon_role_' + p.r.toLowerCase() + '_round')}" alt="${ROLE[p.r]}" title="${ROLE[p.r]}"></span></button>`;
    };
    // nối "sinh" giữa 2 ô kề: mũi tên chỉ pet được +ATK
    const link = k => {
      const a = team[k], b = team[k + 1]; if (!a || !b) return '';
      const down = SINH[a.el] === b.el, up = SINH[b.el] === a.el; if (!down && !up) return '';
      return `<img class="ts-link" style="top:${56 + STEP * k + 88 + (STEP - 88 - 28) / 2}px" src="${tui('link_sinh')}" alt="Sinh" title="${down ? b.n : a.n} được +${Math.round(CFG.elem.sinh * 100)}% ATK">`;
    };
    const plist = PETS.map((p, i) => i).filter(i => owned(PETS[i]) && (!tflt.el || PETS[i].el === tflt.el) && (!tflt.r || PETS[i].r === tflt.r));
    const tpages = Math.max(1, Math.ceil(plist.length / PER)); tflt.page = Math.min(tflt.page, tpages - 1);
    const pool = plist.slice(tflt.page * PER, tflt.page * PER + PER).map(i => {
      const p = PETS[i], k = pick.indexOf(i), m = elemMods(CFG, [p], boss)[0];
      return `<button class="tp${k >= 0 ? ' on' : ''}" data-act="tPool" data-i="${i}" aria-label="${p.n}">${petIcon(p, 60, 'portrait')}
        ${k >= 0 ? `<span class="tp-no">${k + 1}</span>` : ''}${m.adv ? '<b class="tp-m up">▲</b>' : m.dis ? '<b class="tp-m down">▼</b>' : ''}<span class="tp-n">${p.n}</span></button>`;
    }).join('') || '<span class="tp-none">Không có pet phù hợp</span>';
    const pill = (act, v, on, src, title) => `<button class="pf${on ? ' on' : ''}" data-act="${act}" data-v="${v}" title="${title}" aria-label="${title}" aria-pressed="${on}"><img src="${src}" alt=""></button>`;
    const pills = '<span class="pf-lb">Hệ</span>' + pill('tfEl', '', !tflt.el, pui('btn_pose_stand'), 'Mọi hệ') + Object.keys(ELEM).map(el => pill('tfEl', el, tflt.el === el, pui('icon_el_' + el), 'Hệ ' + ELEM[el].n)).join('')
      + '<i class="pf-sep"></i><span class="pf-lb">Vai</span>' + pill('tfRole', '', !tflt.r, pui('btn_pose_stand'), 'Mọi vai') + ['T', 'S', 'D'].map(r => pill('tfRole', r, tflt.r === r, pui('icon_role_' + r.toLowerCase() + '_round'), ROLE[r])).join('');
    view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(${tui('bg_team')})"><div class="stage pg tm${prep ? '' : ' form'}">
      ${backBtn()}
      <div class="pg-title" style="left:calc(50% - 150px);top:8px;width:300px;height:40px">ĐỘI HÌNH</div>
      ${prep ? `<div class="tb" style="${atR(12, 6, 200, 48)}"><span class="tb-art">${bossAva(boss)}</span><span class="tb-n">${boss.n}<small>Lv ${boss.lv}</small></span><img class="tb-el" src="${pui('icon_el_' + boss.el)}" alt="Hệ ${ELEM[boss.el].n}" title="Boss hệ ${ELEM[boss.el].n}"></div>` : ''}
      <div class="tm-left" style="left:calc(12px + env(safe-area-inset-left));top:calc(${mid});width:300px;height:390px">${[0, 1, 2].map(slot).join('')}${link(0)}${link(1)}</div>
      <div class="tm-right" style="right:calc(12px + env(safe-area-inset-right));top:calc(${mid});width:408px;height:390px">
        <div class="pf-bar" style="top:56px;width:408px;height:34px">${pills}</div>
        <div class="tp-row">${pool}</div>
        <div class="tp-pager"><button class="pg-arrow" data-act="tPg" data-v="-1" ${tflt.page ? '' : 'disabled'} aria-label="Trang trước"><img src="${boi('btn_back')}" alt=""></button><span>${tflt.page + 1}/${tpages}</span><button class="pg-arrow next" data-act="tPg" data-v="1" ${tflt.page < tpages - 1 ? '' : 'disabled'} aria-label="Trang sau"><img src="${boi('btn_back')}" alt=""></button></div>
        ${prep ? `<button class="tm-auto" data-act="autoTeam" title="Xếp đội có tỉ lệ thắng mô phỏng cao nhất">Gợi ý đội</button>
        <button class="tm-fight" data-act="fight" ${full ? '' : 'disabled'}>ĐÁNH!</button>` : ''}
      </div>
    </div></div>`;
  },
  // 08 Bộ sưu tập — lọc theo hệ / vai, phân trang PAGE thẻ mỗi trang
  pets() {
    const list = PETS.map((p, i) => i).filter(i => (!flt.el || PETS[i].el === flt.el) && (!flt.r || PETS[i].r === flt.r));
    const pages = Math.max(1, Math.ceil(list.length / PAGE));
    flt.page = Math.min(flt.page, pages - 1);
    const shown = list.slice(flt.page * PAGE, flt.page * PAGE + PAGE);
    const card = i => {
      const p = PETS[i], k = pick.indexOf(i), img = petImg(p, 'idle', true);
      if (!owned(p)) return `<button class="pc lock" disabled aria-label="${p.n}: chưa thu phục" title="Thắng ${BOSSES[p.cap].n} 3⭐ để thu phục">
        ${img ? `<img class="pc-pet" src="${img}" alt="">` : `<span class="pc-pet pc-emo">${p.e}</span>`}<span class="pc-lock">🔒 3⭐ Boss ${p.cap + 1}</span><span class="pc-n">???</span></button>`;
      return `<button class="pc${k >= 0 ? ' on' : ''}" data-act="pet" data-i="${i}" aria-label="${p.n}">
        ${img ? `<img class="pc-pet" src="${img}" alt="">` : `<span class="pc-pet pc-emo">${p.e}</span>`}
        ${k >= 0 ? `<span class="pc-no" aria-label="Ô ${k + 1}">${k + 1}</span>` : ''}
        <span class="pc-lv" style="background-image:url(${uui('badge_level')})" aria-label="Cấp ${lvOf(p)}">Lv ${lvOf(p)}</span><span class="pc-n">${p.n}</span></button>`;
    };
    const pill = (act, v, on, src, title) => `<button class="pf${on ? ' on' : ''}" data-act="${act}" data-v="${v}" title="${title}" aria-label="${title}" aria-pressed="${on}"><img src="${src}" alt=""></button>`;
    const elPills = pill('fEl', '', !flt.el, pui('btn_pose_stand'), 'Mọi hệ') + Object.keys(ELEM).map(el => pill('fEl', el, flt.el === el, pui('icon_el_' + el), 'Hệ ' + ELEM[el].n)).join('');
    const rPills = pill('fRole', '', !flt.r, pui('btn_pose_stand'), 'Mọi vai') + ['T', 'S', 'D'].map(r => pill('fRole', r, flt.r === r, pui('icon_role_' + r.toLowerCase() + '_round'), ROLE[r])).join('');
    const mid = '(var(--sh, 390px) - 390px) / 2';
    view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(${pui('bg_pet')})"><div class="stage pg">
      ${backBtn()}
      <div class="pg-title" style="left:calc(50% - 150px);top:8px;width:300px;height:40px">PET</div>
      ${coin(save.gold, atR(12, 12, 112, 32))}
      <div class="pf-bar" style="left:calc(50% - 200px);top:calc(56px + ${mid});width:400px;height:38px">
        <span class="pf-lb">Hệ</span>${elPills}<i class="pf-sep"></i><span class="pf-lb">Vai</span>${rPills}</div>
      <button class="pg-arrow" style="left:calc(50% - 412px);top:calc(204px + ${mid});width:40px;height:28px" data-act="pg" data-v="-1" ${flt.page ? '' : 'disabled'} aria-label="Trang trước"><img src="${boi('btn_back')}" alt=""></button>
      <div class="pc-row" style="left:calc(50% - 362px);top:calc(114px + ${mid});width:724px;height:208px">${shown.length ? shown.map(card).join('') : '<div class="pc-empty">Không có pet phù hợp bộ lọc</div>'}</div>
      <button class="pg-arrow next" style="left:calc(50% + 372px);top:calc(204px + ${mid});width:40px;height:28px" data-act="pg" data-v="1" ${flt.page < pages - 1 ? '' : 'disabled'} aria-label="Trang sau"><img src="${boi('btn_back')}" alt=""></button>
      <div class="pg-dots" style="left:calc(50% - 40px);top:calc(332px + ${mid});width:80px;height:18px" aria-label="Trang ${flt.page + 1}/${pages}">${Array.from({ length: pages }, (_, j) => `<i class="${j === flt.page ? 'on' : ''}"></i>`).join('')}<b>${flt.page + 1}/${pages}</b></div>
    </div></div>`;
  },
  // 09 Chi tiết pet (toàn màn)
  pet(i) {
    const p0 = PETS[i], lv = lvOf(p0), p = lvPet(CFG, p0, lv), k = pick.indexOf(i);
    const max = key => Math.max(...PETS.map(q => q[key])) * (key === 'ag' ? 1 : 1 + CFG.up.grow * (CFG.up.maxLv - 1)); // thanh = so với pet mạnh nhất ở cấp tối đa
    const stat = (key, bar, icon, lab) => `<div class="pd-st"><img src="${pui('icon_stat_' + icon)}" alt=""><span class="pd-sl">${lab}</span><span class="pd-bar"><i style="width:${Math.round(100 * p[key] / max(key))}%;background-image:url(${pui(bar)})"></i></span><b>${p[key]}</b></div>`;
    view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(${pui('bg_pet')})"><div class="stage pg">
      ${backBtn()}
      <div class="pg-title" style="left:calc(50% - 150px);top:8px;width:300px;height:40px">${p.n}</div>
      <!-- cột trái: pet + tư thế, sát mép trái -->
      <div class="pd-left" style="left:calc(50% - 226px - 150px);top:calc(65px + (var(--sh, 390px) - 390px) / 2);width:300px;height:300px">
        <div class="pd-art" style="--c:${ELEM[p.el].c}">
          <img class="pd-light" src="${pui('fx_light')}" alt=""><img class="pd-circle" src="${pui('fx_circle')}" alt="">
          <img class="pd-ped" src="${pui('pedestal_large')}" alt="">
          ${petImg(p) ? `<img class="pd-pet" id="pd-pet" src="${petImg(p, 'idle', true)}" alt="${p.n}">` : `<span class="pd-pet pc-emo">${p.e}</span>`}
        </div>
      </div>
      <!-- cột phải: thông tin, sát mép phải, các khung cách đều theo chiều cao -->
      <div class="pd-right" style="right:calc(12px + env(safe-area-inset-right));top:calc(56px + (var(--sh, 390px) - 390px) / 2);height:calc(322px - env(safe-area-inset-bottom));width:440px">
        <div class="pd-head"><b>${p.n}</b><img class="pd-roleic" src="${pui('icon_role_' + p.r.toLowerCase() + '_round')}" alt="${ROLE[p.r]}" title="${ROLE[p.r]}"><img class="pd-elic" src="${pui('icon_el_' + p.el)}" alt="${ELEM[p.el].n}" title="Hệ ${ELEM[p.el].n}"><span class="pd-lv">Lv ${lv}</span></div>
        <div class="pd-stats">${stat('hp', 'bar_hp', 'hp', 'HP')}${stat('atk', 'bar_atk', 'atk', 'ATK')}${stat('def', 'bar_def', 'def', 'DEF')}${stat('ag', 'bar_aggro', 'aggro', 'Aggro')}</div>
        <div class="pd-ult"><img src="${pui('icon_ult')}" alt=""><span><b>${ULT_NAME[p.ult.k]}</b><small>${ULT_TEXT[p.ult.k](p.ult.v)}</small></span></div>
        <div class="pd-btns"><button class="pd-btn sec pd-up" data-act="upOpen" data-i="${i}"><img src="${uui('icon_upgrade')}" alt="">Lên cấp${canUp(p0) ? `<img class="pd-dot" src="${pui('dot_notify')}" alt="Nâng được">` : ''}</button><button class="pd-btn" data-act="toTeam" data-i="${i}" ${k >= 0 ? 'disabled' : ''}>${k >= 0 ? `Trong đội · ô ${k + 1}` : 'Chọn vào đội'}</button></div>
      </div>
      ${upUI.open ? `<div class="up-dim"></div><div class="up-dlg${upUI.msg === 'fail' ? ' fail' : ''}" style="${BLOCK}">${upDialog(i)}${upUI.pick ? pickDialog(p0) : ''}${upUI.msg === 'ok' ? okDialog(p0) : upUI.msg === 'fail' ? failDialog(p0) : ''}</div>` : ''}
    </div></div>`;
  },
  settings() {
    // nút ← góc trên trái · các mục căn trái · "Xoá dữ liệu" giữa đáy màn hình
    view.innerHTML = `<div class="screen top"><div class="head">${backBtn('')}<h2>Cài đặt</h2><span style="width:50px"></span></div>
      <div class="set-list">
        <label class="set-row"><span class="set-lb">Âm thanh</span><input type="range" min="0" max="1" step="0.1" value="${save.settings.sfx}" id="s-sfx"></label>
        <label class="set-row"><span class="set-lb">Rung khi bị đánh</span><input type="checkbox" id="s-vib" ${save.settings.vibrate ? 'checked' : ''}><span class="dim small">(Android)</span></label>
      </div>
      <button class="set-reset" data-act="reset">Xoá dữ liệu</button></div>`;
    document.getElementById('s-sfx').oninput = e => { save.settings.sfx = +e.target.value; applySettings(); persist(); sfx('swap'); };
    document.getElementById('s-vib').onchange = e => { save.settings.vibrate = e.target.checked; applySettings(); persist(); };
  },
  // 07 Kết quả / Thưởng — toạ độ theo design/LAYOUT.md mục 07-result (khối 844×390). r: kết quả trận + thưởng (tính ở fight → onEnd)
  result(r) {
    const nx = bossIdx + 1, canNext = r.win && nx < BOSSES.length && nx <= save.cleared;
    const star = (k, lb, ok) => `<div class="rs-star${ok ? ' on' : ''}" style="left:${278 + 96 * k}px;animation-delay:${0.3 + 0.25 * k}s"><b>⭐</b><small>${lb}</small></div>`;
    const pet = (p, k) => `<div class="rs-pet" style="left:${232 + 130 * k}px;top:120px">
      <img class="rs-ped" src="${pui('pedestal')}" alt="">${petImg(p) ? `<img class="rs-pimg${r.win ? '' : ' down'}" src="${petImg(p, r.win ? 'happy' : 'down', true)}" alt="">` : `<span class="rs-pimg pc-emo">${p.e}</span>`}<span class="rs-pn">${p.n}</span></div>`;
    const unl = (r.unlock ? `<span class="rs-unl">🔓 Mở khoá: ${r.unlock}</span>` : '') + (r.cap ? `<span class="rs-unl rs-cap">${petIcon(r.cap, 18, 'portrait')}Thu phục ${r.cap.n}!</span>` : '');
    view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(${mui('bg_sea_map')})"><div class="stage pg rs${r.win ? ' win' : ''}">
      <div class="rs-block" style="${BLOCK}">
        ${r.win ? '<img class="rs-twin" src="assets/result-ui/title_win.webp" alt="CHIẾN THẮNG" style="left:267px;top:8px;width:310px;height:50px">' : '<div class="pg-title rs-title" style="left:252px;top:8px;width:340px;height:50px">THẤT BẠI</div>'}
        ${star(0, 'Thắng', r.stars >= 1)}${star(1, `≤${STAR_MOVES} lượt`, r.win && r.moves <= STAR_MOVES)}${star(2, 'Không pet chết', r.win && r.dead === 0)}
        ${pick.map(i => PETS[i]).map(pet).join('')}
        <div class="rs-row" style="left:122px;top:258px;width:600px;height:40px">${r.win
          ? `<span class="rs-rw rs-gold"><img src="${ART.icon_coin}" alt="Vàng">+${r.gold}</span><span class="rs-rw rs-xp"><b>XP</b>+${r.xp}</span>${r.stone ? `<span class="rs-rw rs-stone" title="Đá ${ELEM[r.stone.el].n} ${TIER[r.stone.t]}"><i style="background-image:url(${uui('slot_stone_' + (r.stone.t + 1))})"><img src="${uui(`stone_${r.stone.el}_${r.stone.t + 1}`)}" alt=""></i>×${r.stone.n}</span>` : ''}${r.chests.length ? `<span class="rs-rw rs-chests">${r.chests.map(k => `<span class="rs-ck" title="${ITEMS.find(x => x.id === 'chest_' + k).n} + ${ITEMS.find(x => x.id === 'key_' + k).n}"><img class="rs-ci" src="${bui('item_chest_' + k)}" alt="${ITEMS.find(x => x.id === 'chest_' + k).n}"><img class="rs-key" src="${bui('item_key_' + k)}" alt="${ITEMS.find(x => x.id === 'key_' + k).n}"></span>`).join('')}</span>` : ''}`
          : `<span class="rs-rw rs-xp"><b>XP</b>+${r.xp}</span><span class="rs-tip">Thử “Gợi ý đội” hoặc đặt pet khắc hệ boss lên đầu</span>`}</div>
        <div class="rs-row rs-tags" style="left:72px;top:300px;width:700px;height:22px">${r.first ? '<span class="rs-tag">Lần đầu ×3</span>' : ''}${save.plv > r.plv0 ? `<span class="rs-lvup">LÊN CẤP ${save.plv} · Toàn đội +${(plBonus(CFG, save.plv) * 100).toFixed(1)}%</span>` : ''}${unl}</div>
        <button class="rs-btn ib" style="left:180px;top:330px;width:152px;background-image:url(assets/result-ui/btn_replay.webp)" data-act="fight" aria-label="Chơi lại"></button>
        ${canNext ? `<button class="rs-btn ib" style="left:340px;top:330px;width:164px;background-image:url(assets/result-ui/btn_next.webp)" data-act="team" data-i="${nx}" aria-label="Boss kế"></button>`
          : `<button class="rs-btn main" style="left:340px;top:330px;width:164px" data-act="back">Đổi đội</button>`}
        <button class="rs-btn ib" style="left:512px;top:330px;width:152px;background-image:url(assets/result-ui/btn_map.webp)" data-act="islands" aria-label="Bản đồ"></button>
      </div>
    </div></div>`;
  },
};

const saveTeam = () => { save.lastTeam = pick.map(i => PETS[i].n); persist(); };
// Lịch sử: mỗi lần sang màn KHÁC thì lưu màn hiện tại; về Trang chủ thì xoá lịch sử (gốc).
// Màn Kết quả không vào lịch sử; sang màn đã có trong lịch sử thì cắt lịch sử về đó (không vòng lặp ←).
let cur = null; const hist = [];
function go(name, arg, push = true) {
  if (battle) { battle.destroy(); battle = null; }
  const seen = hist.findIndex(h => h.name === name && h.arg === arg);
  if (name === 'home' || name === 'start') hist.length = 0;
  else if (seen >= 0) hist.length = seen;
  else if (push && cur && cur.name !== 'result' && (cur.name !== name || cur.arg !== arg)) hist.push(cur);
  cur = { name, arg }; screens[name](arg);
}
function back() { const p = hist.pop(); if (p) go(p.name, p.arg, false); else go('home'); }

function fight() {
  save.lastTeam = pick.map(i => PETS[i].n); persist();
  view.innerHTML = '';
  const run = () => {
    battle = startBattle({
      root: view, cfg: CFG, team: pick.map(i => buffPet(lvPet(CFG, PETS[i], lvOf(PETS[i])), plBonus(CFG, save.plv))), boss: lvBoss(CFG, BOSSES[bossIdx], bossLv()), seedVal: params.has('seed') ? +params.get('seed') : undefined,
      onExit: () => cur && cur.name === 'result' ? back() : go(cur ? cur.name : 'team', cur && cur.arg, false), // bỏ cuộc → về màn trước trận (Đội hình; "Chơi lại" từ Kết quả cũng về Đội hình)
      onEnd: r => {
        r.bossLv = bossLv();
        // thưởng (PLAN-V2 §3): sao = thắng + ≤STAR_MOVES nước + không pet chết; vàng lần đầu ×3; lưu sao cao nhất mỗi boss
        const first = r.win && bossIdx >= save.cleared, best = save.stars[bossIdx] || 0;
        r.stars = r.win ? 1 + (r.moves <= STAR_MOVES) + (r.dead === 0) : 0;
        r.gold = r.win ? BOSSES[bossIdx].gold * (first ? 3 : 1) : 0;
        r.first = first; r.newStar = !first && r.stars > best;
        const nx = BOSSES[bossIdx + 1], nIsl = nx && ISLANDS.find(s => s.bosses[0] === bossIdx + 1);
        r.unlock = first && nx ? nx.n + (nIsl ? ' · ' + nIsl.n : '') : '';
        // đá hệ boss; cấp đá = vị trí boss trong đảo (1/2/3); lần đầu 3 · đánh lại 2 · đạt 3★ +1
        const isl = ISLANDS.find(s => s.bosses.includes(bossIdx)), D = CFG.up.drop;
        r.stone = r.win ? { el: BOSSES[bossIdx].el, t: Math.min(2, isl ? isl.bosses.indexOf(bossIdx) : 0), n: (first ? D.first : D.replay) + (r.stars === 3 ? D.star3 : 0) } : null;
        if (r.stone) stonesOf(r.stone.el)[r.stone.t] += r.stone.n;
        // rương + chìa cùng cấp chỉ rơi 1 lần: LẦN ĐẦU đạt mốc sao ở boss này — 1★ Gỗ · 2★ Lục Bảo · 3★ Lam Ngọc (đánh lại không có). Cấp 4–5: rương sự kiện (chưa làm)
        r.chests = []; for (let k = best + 1; k <= r.stars; k++) { for (const id of ['chest_' + k, 'key_' + k]) save.items[id] = (save.items[id] || 0) + 1; r.chests.push(k); }
        const P = CFG.player, bx = BOSSES[bossIdx].xp || 0; r.xp = Math.round(r.win ? bx * (first ? P.first : 1) : bx * P.lose); r.plv0 = save.plv;
        if (save.plv < P.maxLv) { save.xp += r.xp; while (save.plv < P.maxLv && save.xp >= xpNeed(CFG, save.plv)) { save.xp -= xpNeed(CFG, save.plv); save.plv++; } if (save.plv >= P.maxLv) save.xp = 0; }
        r.cap = r.stars === 3 && best < 3 ? PETS.find(p => p.cap === bossIdx) : null; // lần đầu 3⭐ → nhận boss làm pet
        save.gold += r.gold; save.stars[bossIdx] = Math.max(best, r.stars);
        save.stats.battles++; if (r.win) { save.stats.wins++; save.cleared = Math.max(save.cleared, bossIdx + 1); } persist();
        go('result', r);
      },
    });
    window.__battle = battle; // phục vụ autotest
  };
  run();
}

// ───────────── 09b Nâng cấp — design/briefs/09b-upgrade.md (toạ độ trong khối 844×390) ─────────────
// upUI.slots: 3 ô đá [{ t, n } | null] (mặc định trống) · upUI.pick: hộp chọn đá đang mở cho ô k { k, t, n }
const upUI = { open: false, slots: [null, null, null], pick: null, msg: '' };
const canUp = p => lvOf(p) < CFG.up.maxLv && save.gold >= upGold(CFG, lvOf(p)) && stonesOf(p.el).some(n => n > 0);
const stoneImg = (el, t) => `<img src="${uui(`stone_${el}_${t + 1}`)}" alt="Đá ${ELEM[el].n} ${TIER[t]}">`;
const dlgFrame = title => `<div class="up-panel full" style="left:142px;top:34px;width:560px;height:336px"></div>
  <div class="pg-title" style="left:272px;top:14px;width:300px;height:44px">${title}</div>`;
// tỉ lệ: mỗi viên cộng upRate(cấp đá) · may mắn cộng 1 lần · tối đa 100%
const upPer = (p, t) => upRate(CFG, t, lvOf(p));
const upPicks = (skip = -1) => upUI.slots.filter((s, j) => s && j !== skip);
const upPct = (p, picks) => upTotal(CFG, picks, lvOf(p), save.fail[p.id] || 0);
// số viên tối đa của cấp t cho ô k: đủ chạm 100% thì dừng (viên cuối được phép vượt)
const upMax = (p, k, t) => { const others = upPicks(k), other = others.reduce((a, s) => a + s.n * upPer(p, s.t), 0) + CFG.up.pity * (save.fail[p.id] || 0);
  return Math.min(stonesOf(p.el)[t], Math.max(others.length ? 0 : 1, Math.ceil((1 - other) / upPer(p, t) - 1e-9))); };
const upClamp = p => { upUI.slots = upUI.slots.map((s, k) => { if (!s) return null; const n = Math.min(s.n, stonesOf(p.el)[s.t]); return n > 0 ? { t: s.t, n } : null; }); };
const chip = (icon, v, style, short = false) => `<div class="h-chip${short ? ' short' : ''}" style="${style}"><img src="${ART[icon]}" alt="">${fmtN(v)}</div>`;
const coin = (v, style, short = false) => chip('icon_coin', v, style, short); // ô vàng dùng chung mọi màn
const gem = (v, style) => chip('icon_gem', v, style);
function upDialog(i) {
  const p0 = PETS[i], lv = lvOf(p0), maxed = lv >= CFG.up.maxLv, a = lvPet(CFG, p0, lv), b = lvPet(CFG, p0, Math.min(lv + 1, CFG.up.maxLv));
  upClamp(p0); // đá có thể đã đổi trong Túi đồ
  const fails = save.fail[p0.id] || 0, gold = upGold(CFG, lv), picks = upPicks(), total = upPct(p0, picks), full = total >= 1;
  const row = (icon, lab, x, y) => `<div class="up-row"><img src="${pui(icon)}" alt=""><span class="up-l">${lab}</span><b class="up-a">${x}</b>${maxed ? '' : `<img class="up-ar" src="${uui('arrow_upgrade')}" alt="→"><b class="up-b">${y}</b><small>(+${y - x})</small>`}</div>`;
  const nuke = q => Math.round(q.atk * q.ult.v);
  const slot = k => { const s = upUI.slots[k];
    return s ? `<button class="up-slot" data-act="upSlot" data-k="${k}" style="background-image:url(${uui('slot_stone_' + (s.t + 1))})" aria-label="Ô ${k + 1}: ${s.n} đá ${TIER[s.t]}">${stoneImg(p0.el, s.t)}<b>×${s.n}</b></button>`
      : `<button class="up-slot empty" data-act="upSlot" data-k="${k}" ${full ? 'disabled' : ''} style="background-image:url(${bui('slot_item_empty')})" aria-label="Ô ${k + 1}: trống, chạm để chọn đá"><span>+</span></button>`; };
  const info = maxed ? 'Đã đạt cấp tối đa ' + CFG.up.maxLv
    : upUI.msg === 'fail' ? `<span class="up-bad">Thất bại — mất đá và vàng · lần sau +${Math.round(CFG.up.pity * 100)}%</span>`
    : !stonesOf(p0.el).some(n => n) && !picks.length ? `<span class="up-bad">Hết đá ${ELEM[p0.el].n}</span> — đổi trong Túi đồ hoặc <button class="up-link" data-act="shopUp">mua ở Cửa hàng</button>`
    : save.gold < gold ? `<span class="up-bad">Thiếu ${gold - save.gold} vàng</span>`
    : !picks.length ? 'Chạm ô trống để chọn đá' : '';
  return `${dlgFrame('NÂNG CẤP')}
    ${petImg(p0) ? `<img class="${upUI.msg === 'fail' ? 'up-hurt' : ''}" style="left:184px;top:86px;width:112px;height:112px" src="${petImg(p0, 'portrait')}" alt="${p0.n}">` : `<span class="pc-emo" style="left:184px;top:86px;width:112px;height:112px">${p0.e}</span>`}
    <img style="left:170px;top:72px;width:140px;height:140px" src="${uui('frame_upgrade')}" alt="">
    ${upUI.msg === 'fail' ? `<div class="up-flash" style="left:142px;top:34px;width:560px;height:336px"></div>` : ''}
    <div class="up-lvrow" style="left:166px;top:222px;width:148px;height:44px">${maxed ? `<span class="up-badge" style="background-image:url(${uui('badge_level_new')})">Lv ${lv}</span>`
      : `<span class="up-badge" style="background-image:url(${uui('badge_level')})">Lv ${lv}</span><img src="${uui('arrow_upgrade')}" alt="→"><span class="up-badge${upUI.msg === 'ok' ? ' pop' : ''}" style="background-image:url(${uui('badge_level_new')})">Lv ${lv + 1}</span>`}</div>
    <button class="up-bagbtn" style="left:176px;top:272px;width:128px;height:36px" data-act="bagOpen"><img src="${uui('icon_bag_stone')}" alt="">Túi đồ</button>
    ${coin(save.gold, 'left:176px;top:317px;width:128px;height:32px')}
    <div class="up-rows" style="left:330px;top:80px;width:348px">${row('icon_stat_hp', 'HP', a.hp, b.hp)}${row('icon_stat_atk', 'ATK', a.atk, b.atk)}${row('icon_stat_def', 'DEF', a.def, b.def)}
      ${p0.ult.k === 'nuke' ? row('icon_ult', 'ULT', nuke(a), nuke(b)) : `<div class="up-row"><img src="${pui('icon_ult')}" alt=""><span class="up-l">ULT</span><span class="up-note">${ULT_TEXT[p0.ult.k](p0.ult.v)} · theo HP từng pet</span></div>`}</div>
    ${maxed ? '' : `<div class="up-pick" style="left:330px;top:236px;width:348px;height:48px">${[0, 1, 2].map(slot).join('')}
      <span class="up-rate"><small>Đá ${ELEM[p0.el].n}</small><b>Tỉ lệ ${Math.round(100 * total)}%</b>${fails && picks.length && !full ? `<i>+${Math.round(CFG.up.pity * fails * 100)}% may mắn</i>` : ''}</span>
      ${coin(gold, 'width:96px;height:30px;position:static;flex:none', save.gold < gold)}</div>`}
    <div class="up-info" style="left:330px;top:290px;width:348px;height:16px">${info}</div>
    ${maxed ? `<div class="up-maxed" style="left:330px;top:310px;width:184px;height:46px;background-image:url(${uui('plate_maxed')})">Đạt cấp tối đa</div>`
      : `<button class="rs-btn main up-go" style="left:330px;top:310px;width:184px;height:46px" data-act="upDo" ${!picks.length || save.gold < gold ? 'disabled' : ''}><img src="${uui('icon_upgrade')}" alt="">NÂNG CẤP</button>`}
    <button class="rs-btn" style="left:528px;top:310px;width:150px;height:46px" data-act="upClose">Đóng</button>`;
}
// Hộp thông báo nâng cấp thành công: quầng sáng xoay sau khung · Lv cũ → Lv mới · chỉ số tăng
function okDialog(p0) {
  const lv = lvOf(p0), a = lvPet(CFG, p0, lv - 1), b = lvPet(CFG, p0, lv);
  const gain = (lab, k) => `<span><small>${lab}</small>${a[k]} → <b>${b[k]}</b><i>+${b[k] - a[k]}</i></span>`;
  return `<div class="pk-dim"></div>
    <div class="up-panel full ok-pop" style="left:242px;top:98px;width:360px;height:216px"></div>
    <div class="pg-title ok-pop" style="left:307px;top:80px;width:230px;height:40px">THÀNH CÔNG!</div>
    <img class="ok-fx" style="left:241px;top:97px;width:170px;height:170px" src="${uui('fx_levelup')}" alt="">
    <span class="ok-pet ok-pop" style="left:276px;top:132px;width:100px;height:100px">${petImg(p0) ? `<img src="${petImg(p0, 'portrait')}" alt="${p0.n}">` : p0.e}<img src="${uui('frame_upgrade')}" alt=""></span>
    <img class="ok-up" style="left:296px;top:112px;width:60px;height:60px" src="${uui('fx_stat_up')}" alt="">
    <div class="up-lvrow ok-pop" style="left:392px;top:128px;width:176px;height:44px"><span class="up-badge" style="background-image:url(${uui('badge_level')})">Lv ${lv - 1}</span><img src="${uui('arrow_upgrade')}" alt="→"><span class="up-badge pop" style="background-image:url(${uui('badge_level_new')})">Lv ${lv}</span></div>
    <div class="ok-gain ok-pop" style="left:392px;top:176px;width:176px;height:58px">${gain('HP', 'hp')}${gain('ATK', 'atk')}${gain('DEF', 'def')}</div>
    <button class="rs-btn main ok-pop" style="left:352px;top:248px;width:140px;height:40px" data-act="upOk">Tiếp tục</button>`;
}
// Hộp thông báo thất bại: khung rung + đá vỡ rơi · liệt kê đá và vàng đã mất · may mắn cộng dồn cho lần sau
function failDialog(p0) {
  const L = upUI.last || { picks: [], gold: 0 }, luck = Math.round(100 * CFG.up.pity * (save.fail[p0.id] || 0));
  return `<div class="pk-dim"></div>
    <div class="up-panel full ok-pop fl-shake" style="left:242px;top:98px;width:360px;height:216px"></div>
    <div class="pg-title ok-pop fl-title" style="left:307px;top:80px;width:230px;height:40px">THẤT BẠI</div>
    <span class="ok-pet ok-pop fl-pet" style="left:276px;top:132px;width:100px;height:100px">${petImg(p0) ? `<img src="${petImg(p0, 'portrait')}" alt="${p0.n}">` : p0.e}<img src="${uui('frame_upgrade')}" alt=""></span>
    ${L.picks.map((s, j) => `<img class="fl-drop" style="left:${300 + 22 * j}px;top:150px;width:40px;height:40px;animation-delay:${0.15 * j}s" src="${uui('stone_' + p0.el + '_' + (s.t + 1))}" alt="">`).join('')}
    <div class="fl-lost ok-pop" style="left:392px;top:130px;width:176px;height:56px"><small>Đã mất</small>
      <span>${L.picks.map(s => `<i>${stoneImg(p0.el, s.t)}×${s.n}</i>`).join('')}<i class="fl-gold"><img src="${ART.icon_coin}" alt="">${fmtN(L.gold)}</i></span></div>
    <div class="fl-luck ok-pop" style="left:392px;top:190px;width:176px;height:44px">Cấp giữ nguyên <b>Lv ${lvOf(p0)}</b><br>May mắn lần sau <b class="up-good">+${luck}%</b></div>
    <button class="rs-btn main ok-pop" style="left:352px;top:248px;width:140px;height:40px" data-act="upOk">Thử lại</button>`;
}
// Hộp chọn đá cho 1 ô: chọn cấp I/II/III (cấp đã ở ô khác thì khoá) + số lượng; tổng chạm 100% thì không thêm được
function pickDialog(p0) {
  const { k, t, n } = upUI.pick, st = stonesOf(p0.el), used = upPicks(k).map(s => s.t), mx = upMax(p0, k, t);
  const before = upPct(p0, upPicks(k)), after = upPct(p0, [...upPicks(k), ...(n ? [{ t, n }] : [])]);
  const card = j => { const lock = used.includes(j), m = upMax(p0, k, j);
    return `<button class="pk-card${j === t ? ' on' : ''}" style="left:${260 + 112 * j}px" data-act="pkT" data-v="${j}" ${lock || !m ? 'disabled' : ''} aria-pressed="${j === t}">
      <i style="background-image:url(${uui('slot_stone_' + (j + 1))})">${stoneImg(p0.el, j)}${j === t ? `<img class="up-sel" src="${uui('slot_stone_sel')}" alt="">` : ''}</i>
      <b>Có: ${fmtN(st[j])}</b><small>${lock ? 'Đang ở ô khác' : `+${Math.round(100 * upPer(p0, j))}% / viên`}</small></button>`; };
  return `<div class="pk-dim"></div>
    <div class="up-panel full pk" style="left:212px;top:92px;width:420px;height:252px"></div>
    <div class="pg-title pk" style="left:322px;top:72px;width:200px;height:40px">CHỌN ĐÁ</div>
    ${[0, 1, 2].map(card).join('')}
    <div class="cv-qty pk" style="left:250px;top:228px;width:344px;height:34px">
      <button data-act="pkN" data-v="-1" ${n > 1 ? '' : 'disabled'} aria-label="Bớt">−</button><b>×${n}</b><button data-act="pkN" data-v="1" ${n < mx ? '' : 'disabled'} aria-label="Thêm">+</button><button class="cv-max" data-act="pkN" data-v="max" ${n < mx ? '' : 'disabled'}>Tối đa</button>
      <span class="cv-sum">Tỉ lệ ${Math.round(100 * before)}% → <b>${Math.round(100 * after)}%</b></span></div>
    <button class="rs-btn pk" style="left:262px;top:272px;width:140px;height:40px" data-act="${upUI.slots[k] ? 'pkDel' : 'pkClose'}">${upUI.slots[k] ? 'Bỏ ra' : 'Huỷ'}</button>
    <button class="rs-btn main pk" style="left:442px;top:272px;width:140px;height:40px" data-act="pkOk" ${n ? '' : 'disabled'}>Xác nhận</button>`;
}
// ───────────── 11 Túi đồ — design/briefs/11-bag.md · bố cục co giãn: tab trái | lưới giữa (4 hàng, cuộn) | chi tiết phải, sát lề 12 + tai thỏ ─────────────
const bagUI = { tab: 'all', sel: null, fx: null }; // fx: id ô vừa nhận đá (hợp nhất / chuyển hệ) → hiệu ứng 1 lần
const itemCount = it => it.cat === 'stone' ? stonesOf(it.el)[it.t] : save.items[it.id] || 0;
const isNew = it => itemCount(it) > (save.seen[it.id] || 0);
const itemIcon = it => it.cat === 'stone' ? uui(`stone_${it.el}_${it.t + 1}`) : bui(it.icon);
const rarFrame = r => bui('slot_item_' + r); // 5 khung cùng tâm theo RARITY (design/tools/frames.html)
const tabItems = tab => tab === 'stone' ? ITEMS.filter(it => it.cat === 'stone')
  : ITEMS.filter(it => (tab === 'all' || it.cat === tab) && itemCount(it) > 0);
const fmtN = n => n >= 1e5 ? (Math.floor(n / 100) / 10).toLocaleString('vi-VN') + 'K' : n.toLocaleString('vi-VN'); // 99.999 · 126,5K
screens.bag = () => {
  const list = tabItems(bagUI.tab);
  const sel = list.find(it => it.id === bagUI.sel) || list[0] || null;
  if (sel && isNew(sel)) { save.seen[sel.id] = itemCount(sel); persist(); }
  bagUI.sel = sel && sel.id;
  const fx = bagUI.fx; bagUI.fx = null;
  const tab = ([id, n]) => { const items = tabItems(id);
    return `<button class="bt${bagUI.tab === id ? ' on' : ''}${items.length ? '' : ' none'}" data-act="bagTab" data-v="${id}" aria-pressed="${bagUI.tab === id}">
      <img src="${bui(id === 'stone' ? 'item_gem' : 'icon_tab_' + id)}" alt="">${n}${items.some(isNew) ? `<img class="bt-dot" src="${pui('dot_notify')}" alt="Có đồ mới">` : ''}</button>`; };
  const cell = it => { const n = itemCount(it);
    return `<button class="bc${it.cat === 'chest' ? ' chest' : ''}${n ? '' : ' none'}${fx === it.id ? ' got' : ''}" style="background-image:url(${rarFrame(it.rar)})" data-act="bagSel" data-v="${it.id}" aria-label="${it.n}: ${n}">
      <img src="${itemIcon(it)}" alt=""><b>${fmtN(n)}</b>
      ${isNew(it) ? '<span class="bc-new" aria-label="Mới">MỚI</span>' : ''}${sel === it ? `<img class="up-sel" src="${bui('slot_sel')}" alt="">` : ''}
      ${fx === it.id ? `<img class="bc-fx" src="${uui('fx_stat_up')}" alt="">` : ''}</button>`; };
  let body;
  if (bagUI.tab === 'stone') { // bảng 5 hệ (vòng Sinh) × 3 cấp
    body = `<div class="bs">${EL_ORDER.map((el, c) => `<span class="bs-h"><img src="${pui('icon_el_' + el)}" alt="${ELEM[el].n}" title="Hệ ${ELEM[el].n}">${c < 4 ? `<img class="bs-ar" src="${uui('arrow_sinh')}" alt="sinh">` : ''}</span>`).join('')}
      ${TIER.map((r, t) => EL_ORDER.map(el => cell(list.find(it => it.el === el && it.t === t))).join('')).join('')}</div>`;
  } else { // lưới: lấp ô trống cho đủ ít nhất 4 hàng; số cột theo bề ngang màn (2 cột bên 210 + khe 6 + viền lưới 16)
    const sw = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sw')) || 844;
    const cols = Math.max(5, Math.floor((sw - 24 - 420 - 12 - 32 + 6) / 72)), total = Math.max(4 * cols, Math.ceil(list.length / cols) * cols);
    body = `<div class="bg-cells">${list.map(cell).join('')}${`<img class="bc-empty" src="${bui('slot_item_empty')}" alt="">`.repeat(total - list.length)}</div>`;
  }
  view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(${pui('bg_pet')})"><div class="stage pg">
    ${backBtn()}
    <div class="pg-title" style="left:calc(50% - 150px);top:8px;width:300px;height:40px">TÚI ĐỒ</div>
    ${coin(save.gold, atR(128, 12, 112, 32))}${gem(save.gem, atR(12, 12, 104, 32))}
    <div class="bg-main" style="left:calc(12px + env(safe-area-inset-left));right:calc(12px + env(safe-area-inset-right));top:calc(56px + (var(--sh, 390px) - 390px) / 2);height:calc(322px - env(safe-area-inset-bottom))">
      <nav class="bg-tabs">${TABS.map(tab).join('')}</nav>
      <div class="bg-grid">${body}</div>
      ${bagDetail(sel)}
    </div>
    ${(bagUI.cv || bagUI.mg) && sel && sel.cat === 'stone' ? `<div class="up-dim"></div><div class="up-dlg" style="${BLOCK}">${bagUI.cv ? convDialog(sel) : mergeDialog(sel)}</div>` : ''}
  </div></div>`;
};
// khung chi tiết + thao tác (Đá: nâng cấp 3→1 · chuyển hoá mở hộp thoại)
function bagDetail(it) {
  if (!it) return `<div class="bd"><span class="bd-desc bd-none">Chưa có vật phẩm<br>Thắng boss để nhận</span></div>`;
  const n = itemCount(it), R = RARITY[it.rar];
  let btns, why = '';
  if (it.cat === 'stone') {
    const { t } = it, M = CFG.up.merge, canM = t < 2 && n >= M;
    why = !n ? '' : t === 2 ? 'Đá III là cấp cao nhất' : n < M ? `Cần ${M} đá để nâng cấp` : '';
    btns = `<button class="rs-btn bd-btn" data-act="mgOpen" ${canM ? '' : 'disabled'} title="${M} đá ${TIER[t]} → 1 đá ${TIER[Math.min(2, t + 1)]} cùng hệ"><img src="${uui('icon_merge')}" alt="">Nâng cấp</button>
      <button class="rs-btn main bd-btn" data-act="cvOpen" ${n ? '' : 'disabled'} title="Đổi sang đá hệ khác"><img src="${uui('icon_convert')}" alt="">Chuyển hoá</button>`;
  } else btns = `<button class="rs-btn bd-btn wide" disabled>Sắp có</button>`;
  return `<div class="bd" style="--rc:${R.c}">
    <span class="bd-icon${it.cat === 'chest' ? ' chest' : ''}" style="background-image:url(${rarFrame(it.rar)})">${it.rar >= 4 ? `<img class="bd-fx r${it.rar}" src="${bui('fx_rarity')}" alt="">` : ''}<img src="${itemIcon(it)}" alt=""></span>
    <b class="bd-name">${it.n}</b>
    <span class="bd-rar" style="background:${R.c}">${R.n}</span>
    <span class="bd-n">Có: <b>${n.toLocaleString('vi-VN')}</b></span>
    <span class="bd-desc">${it.desc}</span>
    <span class="bd-src"><b>Nguồn</b>${[].concat(it.src).map(s => `<span><img src="${bui('icon_source')}" alt="">${s}</span>`).join('')}</span>
    <span class="bd-why">${why}</span>
    <span class="bd-btns">${btns}</span></div>`;
}
// Hộp thoại Chuyển hoá đá — design/UPGRADE.md §4c. Tỉ lệ theo số bước vòng Sinh từ hệ nguồn → hệ đích (CFG.up.conv), vàng / viên nhận
const REL = ['Sinh', 'Khắc', 'Bị khắc', 'Được sinh'];
const sinhStep = (a, b) => (EL_ORDER.indexOf(b) - EL_ORDER.indexOf(a) + 5) % 5; // 1..4
const convPlan = (it, to, k) => { const [i, o] = CFG.up.conv[sinhStep(it.el, to) - 1]; return { i, o, use: i * k, get: o * k, gold: o * k * CFG.up.convert[it.t] }; };
const convMax = (it, to) => { const p = convPlan(it, to, 1); return Math.min(Math.floor(itemCount(it) / p.i), Math.floor(save.gold / p.gold)); };
// Hộp thoại Nâng cấp đá (hàng loạt): đá cấp t → cấp cao hơn, mỗi bậc 3 → 1 (I → III = 9 → 1), miễn phí, chọn số lượng
const mergeNeed = (it, to) => CFG.up.merge ** (to - it.t);
function mergeDialog(it) {
  const mg = bagUI.mg, need = mergeNeed(it, mg.to), mx = Math.floor(itemCount(it) / need), k = Math.max(1, Math.min(mg.k, mx)), ok = mx >= 1;
  // hàng trên căn giữa khung (tâm 422): thẻ đá gốc · mũi tên · 1–2 thẻ đá đích, cùng kiểu thẻ 104 px
  const tos = [it.t + 1, it.t + 2].filter(t => t <= 2), W = 104, G = 8, AR = 30, GAP = 20;
  const total = W + GAP + AR + GAP + tos.length * W + (tos.length - 1) * G, x0 = 422 - total / 2, xt = x0 + W + GAP + AR + GAP;
  const cardBody = (t, sel) => `<i style="background-image:url(${uui('slot_stone_' + (t + 1))})">${stoneImg(it.el, t)}${sel ? `<img class="up-sel" src="${uui('slot_stone_sel')}" alt="">` : ''}</i>
      <b>Đá ${ELEM[it.el].n} ${TIER[t]}</b><small>Có: ${stonesOf(it.el)[t].toLocaleString('vi-VN')}</small>`;
  const card = (to, j) => `<button class="mg-card${to === mg.to ? ' on' : ''}" style="left:${xt + (W + G) * j}px" data-act="mgTo" data-v="${to}" aria-pressed="${to === mg.to}">${cardBody(to, to === mg.to && tos.length > 1)}</button>`;
  return `${dlgFrame('NÂNG CẤP ĐÁ')}
    <span class="mg-card src" style="left:${x0}px">${cardBody(it.t, false)}</span>
    <img class="cv-ar" style="left:${x0 + W + GAP}px;top:114px" src="${uui('arrow_upgrade')}" alt="→">
    ${tos.map(card).join('')}
    <div class="cv-qty mg-qty" style="left:196px;top:212px;width:452px;height:36px">
      <button data-act="mgK" data-v="-1" ${k > 1 ? '' : 'disabled'} aria-label="Bớt">−</button><input class="mg-in" type="number" inputmode="numeric" min="1" max="${mx}" value="${ok ? k : 0}" data-in="mgK" ${ok ? '' : 'disabled'} aria-label="Số lượng (tối đa ${mx})" title="Tối đa ${mx}"><button data-act="mgK" data-v="1" ${k < mx ? '' : 'disabled'} aria-label="Thêm">+</button>
      <span class="cv-sum">Dùng <b>${(ok ? k : 1) * need}</b> ${stoneImg(it.el, it.t)} → nhận <b>${ok ? k : 0}</b> ${stoneImg(it.el, mg.to)}</span></div>
    <div class="up-info mg-info" style="left:196px;top:256px;width:452px;height:28px">${mg.msg ? `<span class="up-good">${mg.msg}</span>` : ok ? '' : `<span class="up-bad">Cần ít nhất ${need} đá ${TIER[it.t]}</span>`}</div>
    <button class="rs-btn main up-go" style="left:254px;top:296px;width:160px;height:46px" data-act="mgDo" ${ok ? '' : 'disabled'}><img src="${uui('icon_merge')}" alt="">NÂNG CẤP</button>
    <button class="rs-btn" style="left:430px;top:296px;width:160px;height:46px" data-act="mgClose">Đóng</button>`;
}
function convDialog(it) {
  const cv = bagUI.cv, mx = convMax(it, cv.to), k = Math.max(1, Math.min(cv.k, mx)), p = convPlan(it, cv.to, k), ok = mx >= 1;
  const card = (to, j) => { const [i, o] = CFG.up.conv[sinhStep(it.el, to) - 1];
    return `<button class="cv-card${to === cv.to ? ' on' : ''}" style="left:${362 + 78 * j}px" data-act="cvTo" data-v="${to}" aria-pressed="${to === cv.to}">
      <span class="cv-rel">${REL[sinhStep(it.el, to) - 1]}</span><i style="background-image:url(${uui('slot_stone_' + (it.t + 1))})">${stoneImg(to, it.t)}${to === cv.to ? `<img class="up-sel" src="${uui('slot_stone_sel')}" alt="">` : ''}</i><b>${i} → ${o}</b></button>`; };
  const why = !ok ? (itemCount(it) < p.i ? `Cần ít nhất ${p.i} đá` : `Thiếu ${p.gold - save.gold} vàng`) : '';
  return `${dlgFrame('CHUYỂN HOÁ ĐÁ')}
    <span class="cv-src" style="left:182px;top:76px;width:132px;height:118px"><i style="background-image:url(${uui('slot_stone_' + (it.t + 1))})">${stoneImg(it.el, it.t)}</i><b>${it.n}</b><small>Có: ${itemCount(it).toLocaleString('vi-VN')}</small></span>
    <img class="cv-ar" style="left:322px;top:112px" src="${uui('arrow_upgrade')}" alt="→">
    ${EL_ORDER.filter(e => e !== it.el).map(card).join('')}
    <div class="cv-qty" style="left:182px;top:208px;width:484px;height:36px">
      <button data-act="cvK" data-v="-1" ${k > 1 ? '' : 'disabled'} aria-label="Bớt">−</button><b>×${ok ? k : 0}</b><button data-act="cvK" data-v="1" ${k < mx ? '' : 'disabled'} aria-label="Thêm">+</button><button class="cv-max" data-act="cvK" data-v="max" ${ok ? '' : 'disabled'}>Tối đa</button>
      <span class="cv-sum">Dùng <b>${p.use}</b> ${stoneImg(it.el, it.t)} → nhận <b>${p.get}</b> ${stoneImg(cv.to, it.t)}</span>
      ${coin(p.gold, 'width:92px;height:28px;position:static;flex:none', !ok)}</div>
    <div class="up-info" style="left:182px;top:256px;width:484px;height:28px">${cv.msg ? `<span class="up-good">${cv.msg}</span>` : why ? `<span class="up-bad">${why}</span>` : `Tỉ lệ theo vòng Sinh: ${REL.map((r, j) => `${r} ${CFG.up.conv[j][0]}→${CFG.up.conv[j][1]}`).join(' · ')}`}</div>
    <button class="rs-btn" style="left:516px;top:300px;width:150px;height:46px" data-act="cvClose">Đóng</button>
    <button class="rs-btn main up-go" style="left:330px;top:300px;width:172px;height:46px" data-act="cvDo" ${ok ? '' : 'disabled'}><img src="${uui('icon_convert')}" alt="">CHUYỂN HOÁ</button>`;
}
// ───────────── 12 Cửa hàng — data/shop.js · cùng bố cục Túi đồ: tab trái | lưới hàng giữa | chi tiết phải ─────────────
// Chỉ bán đá bằng vàng (nạp tiền / kim cương để sau). Quầy làm mới 00:00 giờ máy.
const shopUI = { tab: 'daily', sel: null, fx: null, msg: '' };
const SHOP_TABS = [['daily', 'Hằng ngày', 'icon_tab_chest'], ['fixed', 'Đá thường', 'item_gem'], ['other', 'Khác', 'icon_tab_item']]; // Khác: chừa chỗ (vật phẩm / rương sau này)
const shopSync = () => { const d = today(); if (save.shop.day !== d) { save.shop.day = d; save.shop.bought = {}; persist(); } return shopStock(CFG, d); };
const slotItem = s => ITEMS.find(it => it.id === `stone_${s.el}_${s.t}`);
const untilMidnight = () => { const n = new Date(), m = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1), s = Math.floor((m - n) / 1000);
  return `${Math.floor(s / 3600)} giờ ${String(Math.floor(s / 60) % 60).padStart(2, '0')} phút`; };
screens.shop = () => {
  const stock = shopSync(), list = stock[shopUI.tab] || [];
  if (save.shop.seen !== save.shop.day) { save.shop.seen = save.shop.day; persist(); }
  const sel = list.find(s => s.id === shopUI.sel) || list[0];
  shopUI.sel = sel && sel.id;
  const fx = shopUI.fx; shopUI.fx = null;
  const tab = ([id, n, icon]) => `<button class="bt${shopUI.tab === id ? ' on' : ''}" data-act="shopTab" data-v="${id}" aria-pressed="${shopUI.tab === id}"><img src="${bui(icon)}" alt="">${n}</button>`;
  const card = s => { const it = slotItem(s), left = shopLeft(save.shop, s), out = left <= 0;
    return `<button class="sc${out ? ' out' : ''}${sel === s ? ' on' : ''}${fx === s.id ? ' got' : ''}" data-act="shopSel" data-v="${s.id}" aria-label="${it.n} ×${s.n}, ${s.cost} vàng${out ? ', đã bán' : ''}">
      <span class="bc" style="background-image:url(${rarFrame(it.rar)})"><img src="${itemIcon(it)}" alt=""><b>×${s.n}</b>${sel === s ? `<img class="up-sel" src="${bui('slot_sel')}" alt="">` : ''}
        ${fx === s.id ? `<img class="bc-fx" src="${uui('fx_stat_up')}" alt="">` : ''}</span>
      ${s.off ? `<i class="sc-off">−${Math.round(s.off * 100)}%</i>` : ''}
      <small class="sc-left">${out ? 'Đã bán' : s.limit > 1 ? `Còn ${left}/${s.limit}` : '&nbsp;'}</small>
      <span class="sc-cost${save.gold < s.cost && !out ? ' short' : ''}"><img src="${ART.icon_coin}" alt="vàng">${fmtN(s.cost)}</span>
      ${out ? '<span class="sc-sold">ĐÃ BÁN</span>' : ''}</button>`; };
  view.innerHTML = `<div class="stage-wrap blur" style="background-image:url(${pui('bg_pet')})"><div class="stage pg">
    ${backBtn()}
    <div class="sh-timer" style="left:calc(64px + env(safe-area-inset-left));right:calc(50% + 156px);top:12px;height:32px">⟳ Làm mới sau <b>${untilMidnight()}</b></div>
    <div class="pg-title" style="left:calc(50% - 150px);top:8px;width:300px;height:40px">CỬA HÀNG</div>
    ${coin(save.gold, atR(128, 12, 112, 32))}${gem(save.gem, atR(12, 12, 104, 32))}
    <div class="bg-main" style="left:calc(12px + env(safe-area-inset-left));right:calc(12px + env(safe-area-inset-right));top:calc(56px + (var(--sh, 390px) - 390px) / 2);height:calc(322px - env(safe-area-inset-bottom))">
      <nav class="bg-tabs sh-tabs">${SHOP_TABS.map(tab).join('')}</nav>
      <div class="bg-grid">${list.length ? `<div class="sh-cells">${list.map(card).join('')}</div>` : `<div class="sh-empty"><img src="${bui('empty_bag')}" alt="">Sắp có hàng mới</div>`}</div>
      ${sel ? shopDetail(sel) : '<div class="bd"><span class="bd-desc bd-none" style="margin:130px 14px 0;text-align:center;justify-content:center">Chưa có hàng<br>Quay lại sau nhé</span></div>'}
    </div>
  </div></div>`;
};
function shopDetail(s) {
  const it = slotItem(s), R = RARITY[it.rar], left = shopLeft(save.shop, s);
  const why = shopUI.msg ? `<span class="up-good">${shopUI.msg}</span>` : left <= 0 ? 'Hết lượt hôm nay' : save.gold < s.cost ? `Thiếu ${fmtN(s.cost - save.gold)} vàng` : '';
  return `<div class="bd" style="--rc:${R.c}">
    <span class="bd-icon" style="background-image:url(${rarFrame(it.rar)})">${it.rar >= 4 ? `<img class="bd-fx r${it.rar}" src="${bui('fx_rarity')}" alt="">` : ''}<img src="${itemIcon(it)}" alt=""></span>
    <b class="bd-name">${it.n} ×${s.n}</b>
    <span class="bd-rar" style="background:${R.c}">${R.n}</span>
    <span class="bd-n">Đang có: <b>${itemCount(it).toLocaleString('vi-VN')}</b></span>
    <span class="bd-desc">${it.desc}${s.off ? ` Giảm ${Math.round(s.off * 100)}% (giá gốc ${fmtN(s.full)}).` : ''}</span>
    <span class="bd-n">Lượt mua: <b>${Math.max(0, left)}/${s.limit}</b> hôm nay</span>
    <span class="bd-why">${why}</span>
    <span class="bd-btns"><button class="rs-btn main bd-btn wide" data-act="shopBuy" ${left > 0 && save.gold >= s.cost ? '' : 'disabled'}><img src="${ART.icon_coin}" alt="">Mua ${fmtN(s.cost)}</button></span></div>`;
}
const acts = {
  begin() { unlock(); try { document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {}); } catch { /* iOS không hỗ trợ */ } go('home'); },
  back,
  home: () => go('home'), islands: () => go('islands'), pets: () => go('pets'), settings: () => go('settings'),
  team(d) { bossIdx = d.i != null ? +d.i : Math.min(save.cleared, BOSSES.length - 1); teamSel = null; go('team', 'battle'); }, // từ Chọn boss
  formation() { teamSel = null; go('team'); }, // từ sảnh
  isl(d) { islIdx = +d.i; bossSel = null; go('boss'); },
  bSel(d) { bossSel = +d.i; go('boss'); }, // từ Chọn đảo
  boss() { islIdx = Math.max(0, ISLANDS.findIndex(s => s.bosses.includes(bossIdx))); bossSel = bossIdx; go('boss'); }, // từ Kết quả: về đảo của boss vừa đánh
  // kho: đã trong đội → bỏ; có ô đang chọn → đặt vào ô đó; còn ô trống → thêm; đủ 3 → thay pet cùng vai (không có thì ô 3)
  tPool(d) {
    const i = +d.i, k = pick.indexOf(i);
    if (teamSel != null && pick[teamSel] != null) { if (k >= 0) [pick[k], pick[teamSel]] = [pick[teamSel], pick[k]]; else pick[teamSel] = i; }
    else if (k >= 0) pick.splice(k, 1);
    else if (pick.length < 3) pick.push(i);
    else { const same = pick.findIndex(j => PETS[j].r === PETS[i].r); pick[same >= 0 ? same : 2] = i; }
    teamSel = null; saveTeam(); go('team', cur && cur.arg);
  },
  // ô: chạm chọn → chạm ô khác đổi chỗ → chạm lại ô đang chọn bỏ pet
  tSlot(d) {
    const k = +d.k;
    if (pick[k] == null) { teamSel = null; go('team', cur && cur.arg); return; }
    if (teamSel == null) teamSel = k;
    else if (teamSel === k) { pick.splice(k, 1); teamSel = null; }
    else { [pick[k], pick[teamSel]] = [pick[teamSel], pick[k]]; teamSel = null; }
    saveTeam(); go('team', cur && cur.arg);
  },
  tfEl(d) { tflt.el = tflt.el === d.v ? '' : d.v; tflt.page = 0; go('team', cur && cur.arg); },
  tfRole(d) { tflt.r = tflt.r === d.v ? '' : d.v; tflt.page = 0; go('team', cur && cur.arg); },
  tPg(d) { tflt.page = Math.max(0, tflt.page + +d.v); go('team', cur && cur.arg); },
  fight,
  autoTeam() { teamSel = null; const s = SUGGEST[bossIdx]; if (!s) return; pick = s.ids.map(id => PETS.findIndex(p => p.id === id)).filter(i => i >= 0); save.lastTeam = pick.map(i => PETS[i].n); persist(); go('team', 'battle'); },
  pet(d) { upUI.open = false; go('pet', +d.i); },
  upOpen(d) { Object.assign(upUI, { open: true, msg: '', slots: [null, null, null], pick: null }); go('pet', +d.i); },
  upClose() { Object.assign(upUI, { open: false, pick: null }); go('pet', cur.arg); },
  upDo() { // 1 lần thử: mất hết đá trong 3 ô + vàng dù thành công hay thất bại; trượt thì cộng dồn may mắn cho lần sau
    const p = PETS[cur.arg], lv = lvOf(p), g = upGold(CFG, lv), picks = upPicks(), st = stonesOf(p.el);
    if (lv >= CFG.up.maxLv || !picks.length || picks.some(s => st[s.t] < s.n) || save.gold < g) return;
    const rate = upPct(p, picks); upUI.last = { picks: picks.map(s => ({ ...s })), gold: g }; for (const s of picks) st[s.t] -= s.n; save.gold -= g;
    const ok = Math.random() < rate;
    if (ok) { save.lv[p.id] = lv + 1; save.fail[p.id] = 0; } else save.fail[p.id] = (save.fail[p.id] || 0) + 1;
    upClamp(p); upUI.msg = ok ? 'ok' : 'fail'; sfx(ok ? 'win' : 'lose'); persist(); go('pet', cur.arg);
  },
  upSlot(d) { // mở hộp chọn đá cho ô k: ô đã có đá → sửa; ô trống → cấp đầu tiên còn chọn được
    const p = PETS[cur.arg], k = +d.k, s = upUI.slots[k], used = upPicks(k).map(x => x.t);
    const t = s ? s.t : [0, 1, 2].find(j => !used.includes(j) && upMax(p, k, j) > 0) ?? 0;
    upUI.pick = { k, t, n: s ? s.n : Math.min(1, upMax(p, k, t)) }; upUI.msg = ''; go('pet', cur.arg);
  },
  pkT(d) { const p = PETS[cur.arg], t = +d.v; Object.assign(upUI.pick, { t, n: Math.min(1, upMax(p, upUI.pick.k, t)) }); go('pet', cur.arg); },
  pkN(d) { const p = PETS[cur.arg], pk = upUI.pick, mx = upMax(p, pk.k, pk.t); pk.n = d.v === 'max' ? mx : Math.max(1, Math.min(mx, pk.n + +d.v)); go('pet', cur.arg); },
  pkOk() { const { k, t, n } = upUI.pick; upUI.slots[k] = n ? { t, n } : null; upUI.pick = null; go('pet', cur.arg); },
  pkDel() { upUI.slots[upUI.pick.k] = null; upUI.pick = null; go('pet', cur.arg); },
  pkClose() { upUI.pick = null; go('pet', cur.arg); },
  upOk() { upUI.msg = ''; go('pet', cur.arg); },
  bagOpen() { const p = PETS[cur.arg]; Object.assign(bagUI, { tab: 'stone', sel: `stone_${p.el}_${(upPicks()[0] || { t: 0 }).t}`, cv: null, mg: null }); go('bag'); }, // từ Nâng cấp: ← quay lại hộp thoại
  bag() { bagUI.cv = bagUI.mg = null; go('bag'); }, // từ sảnh: giữ tab lần trước
  shop() { shopUI.msg = ''; go('shop'); },
  shopUp() { const p = PETS[cur.arg], st = shopSync(), d = st.daily.find(s => s.el === p.el && shopLeft(save.shop, s) > 0); // từ Nâng cấp: ô ngày cùng hệ nếu còn, không thì quầy cố định
    Object.assign(shopUI, { tab: d ? 'daily' : 'fixed', sel: d ? d.id : 'f_' + p.el, msg: '' }); go('shop'); },
  shopTab(d) { Object.assign(shopUI, { tab: d.v, sel: null, msg: '' }); go('shop'); },
  shopSel(d) { shopUI.sel = d.v; shopUI.msg = ''; go('shop'); },
  shopBuy() { // 1 lượt: trừ vàng, cộng đá (có tem MỚI ở Túi đồ)
    const s = (shopSync()[shopUI.tab] || []).find(x => x.id === shopUI.sel);
    if (!s || shopLeft(save.shop, s) <= 0 || save.gold < s.cost) { shopUI.msg = ''; go('shop'); return; }
    save.gold -= s.cost; stonesOf(s.el)[s.t] += s.n; save.shop.bought[s.id] = (save.shop.bought[s.id] || 0) + 1;
    shopUI.msg = `Đã nhận ${s.n} ${slotItem(s).n}`; shopUI.fx = s.id; sfx('win'); persist(); go('shop');
  },
  bagTab(d) { Object.assign(bagUI, { tab: d.v, sel: null, cv: null, mg: null }); go('bag'); },
  bagSel(d) { bagUI.sel = d.v; bagUI.cv = bagUI.mg = null; go('bag'); },
  mgOpen() { const it = ITEMS.find(x => x.id === bagUI.sel); bagUI.mg = { to: it.t + 1, k: 1, msg: '' }; go('bag'); },
  mgClose() { bagUI.mg = null; go('bag'); },
  mgTo(d) { Object.assign(bagUI.mg, { to: +d.v, k: 1, msg: '' }); go('bag'); },
  mgK(d) { const it = ITEMS.find(x => x.id === bagUI.sel), mx = Math.floor(itemCount(it) / mergeNeed(it, bagUI.mg.to)); bagUI.mg.k = d.v === 'set' ? Math.max(1, Math.min(mx, Math.floor(+d.n) || 1)) : Math.max(1, Math.min(mx, bagUI.mg.k + +d.v)); bagUI.mg.msg = ''; go('bag'); },
  mgDo() { // dùng need·k đá cấp t → k đá cấp đích
    const it = ITEMS.find(x => x.id === bagUI.sel), mg = bagUI.mg, need = mergeNeed(it, mg.to), st = stonesOf(it.el), k = Math.min(mg.k, Math.floor(st[it.t] / need)); if (k < 1) return;
    st[it.t] -= need * k; st[mg.to] += k; mg.msg = `Đã nhận ${k} Đá ${ELEM[it.el].n} ${TIER[mg.to]}`; mg.k = 1; bagUI.fx = `stone_${it.el}_${mg.to}`; sfx('win'); persist(); go('bag');
  },
  cvOpen() { const it = ITEMS.find(x => x.id === bagUI.sel); bagUI.cv = { to: SINH[it.el], k: 1, msg: '' }; go('bag'); },
  cvClose() { bagUI.cv = null; go('bag'); },
  cvTo(d) { Object.assign(bagUI.cv, { to: d.v, k: 1, msg: '' }); go('bag'); },
  cvK(d) { const it = ITEMS.find(x => x.id === bagUI.sel), mx = convMax(it, bagUI.cv.to); bagUI.cv.k = d.v === 'max' ? mx : Math.max(1, Math.min(mx, bagUI.cv.k + +d.v)); bagUI.cv.msg = ''; go('bag'); },
  cvDo() { // dùng i·k đá nguồn + vàng → o·k đá hệ đích cùng cấp
    const it = ITEMS.find(x => x.id === bagUI.sel), cv = bagUI.cv, k = Math.min(cv.k, convMax(it, cv.to)); if (k < 1) return;
    const p = convPlan(it, cv.to, k); stonesOf(it.el)[it.t] -= p.use; stonesOf(cv.to)[it.t] += p.get; save.gold -= p.gold;
    cv.msg = `Đã nhận ${p.get} Đá ${ELEM[cv.to].n} ${TIER[it.t]}`; cv.k = 1; bagUI.fx = `stone_${cv.to}_${it.t}`; sfx('win'); persist(); go('bag');
  },

  fEl(d) { flt.el = flt.el === d.v ? '' : d.v; flt.page = 0; go('pets'); },
  fRole(d) { flt.r = flt.r === d.v ? '' : d.v; flt.page = 0; go('pets'); },
  pg(d) { flt.page = Math.max(0, flt.page + +d.v); go('pets'); },
  // đưa pet vào đội: thay pet cùng vai nếu có, không thì ô trống / ô 3
  toTeam(d) {
    const i = +d.i; if (pick.includes(i)) return;
    const same = pick.findIndex(j => PETS[j].r === PETS[i].r);
    if (same >= 0) pick[same] = i; else if (pick.length < 3) pick.push(i); else pick[2] = i;
    save.lastTeam = pick.map(j => PETS[j].n); persist(); go('pet', i);
  },
  install() { if (installEvt) { installEvt.prompt(); installEvt = null; go('home'); } },
  reset() { if (confirm('Xoá toàn bộ tiến độ?')) { try { localStorage.removeItem(KEY); } catch { /* bỏ qua */ } save = load(); go('home'); } },
};
// ô nhập số: đổi giá trị (Enter / rời ô) → gọi act với { v: 'set', n }
view.addEventListener('change', e => { const el = e.target.closest('[data-in]'); if (el && acts[el.dataset.in]) acts[el.dataset.in]({ v: 'set', n: el.value }); });
view.addEventListener('click', e => { const b = e.target.closest('[data-act]'); if (b && b.dataset.act && acts[b.dataset.act]) acts[b.dataset.act](b.dataset); });

// ───────────── khởi động ─────────────
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
if (params.has('autotest')) { // chơi tự động bằng nước hợp lệ đầu tiên, ghi kết quả vào title (kiểm thử giao diện)
  bossIdx = +(params.get('boss') || 0); pick = [0, 1, 3]; fight();
  (async () => {
    const b = window.__battle;
    const stop = +params.get('stop') || Infinity;
    while (!b.s.over && b.s.moves < stop) {
      for (let i = 0; i < 3; i++) await b.ult(i);
      if (!b.s.over && !b.isBusy()) { const m = b.getLegal()[0]; await b.play(m[0], m[1]); } else await new Promise(r => setTimeout(r, 5));
    }
    await new Promise(r => setTimeout(r, 100));
    document.title = 'AUTOTEST ' + b.s.over + ' moves=' + b.s.moves;
  })();
} else if (params.get('go') === 'team' && params.has('empty')) { pick = []; screens.team(); }
else if (params.get('go') === 'team' && params.has('auto')) { bossIdx = +params.get('boss') || 0; cur = { name: 'team', arg: 'battle' }; acts.autoTeam(); }
else if (params.get('go') === 'battle') { bossIdx = +params.get('boss') || 0; pick = params.has('team') ? params.get('team').split(',').map(Number) : [0, 1, 3]; fight(); } // ?go=battle|boss|team|pets|settings|home: nhảy thẳng tới màn (dev)
else if (params.get('go') === 'result') screens.result({ win: !params.has('lose'), stars: params.has('lose') ? 0 : 3, moves: 20, dead: 0, gold: 300, xp: 80, first: !params.has('lose'), chests: [], plv0: save.plv }); // dev: xem màn Kết quả (?lose = thua)
else if (screens[params.get('go')]) screens[params.get('go')](+params.get('i') || 0);
else screens.start();
