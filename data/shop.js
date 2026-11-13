// Cửa hàng — logic thuần (dùng chung ui/app.js và sim.js). Số ở CFG.shop.
// Quầy ngày sinh từ chuỗi ngày → cùng ngày luôn ra cùng hàng, không cần máy chủ.
// ponytail: dựa vào đồng hồ máy, chỉnh giờ là được hàng mới; cần máy chủ thời gian nếu có xếp hạng / nạp tiền.
import { EL_ORDER } from './items.js';

export const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hash = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };
const rng = a => () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const r10 = v => Math.max(10, Math.round(v / 10) * 10);

// Một ô hàng: { id, el, t, n (số đá mỗi lượt), cost (vàng mỗi lượt), full (giá gốc), off, limit (lượt/ngày) }
export function shopStock(cfg, day) {
  const S = cfg.shop, R = rng(hash(day));
  const fixed = EL_ORDER.map(el => ({ id: 'f_' + el, el, t: 0, n: 1, cost: S.price[0], full: S.price[0], off: 0, limit: S.fixed }));
  const daily = [], used = new Set(), W = S.w.reduce((a, b) => a + b, 0);
  while (daily.length < S.slots) {
    let x = R() * W, t = 0; while (x >= S.w[t]) x -= S.w[t++];
    const el = EL_ORDER[Math.floor(R() * EL_ORDER.length)], off = S.off[Math.floor(R() * S.off.length)];
    if (used.has(el + t)) continue; // không trùng hệ + cấp trong 1 ngày
    used.add(el + t);
    const full = S.price[t] * S.n[t];
    daily.push({ id: 'd' + daily.length, el, t, n: S.n[t], cost: r10(full * (1 - off)), full, off, limit: 1 });
  }
  return { fixed, daily };
}

// shop = { day, bought: { id: số lượt } } — tự xoá khi sang ngày mới. Trả về số lượt còn lại.
export const shopLeft = (shop, slot) => slot.limit - (shop.bought[slot.id] || 0);
