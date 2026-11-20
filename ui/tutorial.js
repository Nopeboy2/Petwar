// Lớp phủ hướng dẫn: làm sáng một vùng, bong bóng chữ, bàn tay chỉ, nút Bỏ qua. Kịch bản: data/tutorial.js.
// tip() trả { wait, close }: wait → 'next' (chạm để tiếp) | 'skip' (Bỏ qua) | undefined (bị đóng do chuyển màn).
// force = chỉ vùng sáng nhận thao tác (vuốt/chạm thật), phần còn lại bị chặn; người gọi tự close() khi xong.
let live = [];
export const clearTips = () => { [...live].forEach(t => t.close()); };
const FAST = new URLSearchParams(location.search).has('fast');
const sleep = ms => new Promise(r => setTimeout(r, FAST ? 0 : ms));
const k = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--k')) || 1;
const div = cls => Object.assign(document.createElement('div'), { className: cls });
const put = (el, x, y, w, h) => Object.assign(el.style, { left: x + 'px', top: y + 'px', ...(w != null && { width: w + 'px', height: h + 'px' }) });

function bounds(els, pad) {
  const rs = els.map(e => e.getBoundingClientRect()).filter(r => r.width || r.height);
  if (!rs.length) return null;
  const l = Math.min(...rs.map(r => r.left)) - pad, t = Math.min(...rs.map(r => r.top)) - pad;
  const r = Math.max(...rs.map(r => r.right)) + pad, b = Math.max(...rs.map(r => r.bottom)) + pad;
  return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
}
const mid = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

export function tip({ target, text, hand, force = false }) {
  const els = [].concat(target || []).filter(Boolean);
  const root = div('tut' + (force ? ' force' : '') + (els.length ? '' : ' dim'));
  // 4 tấm tối quanh vùng sáng (box-shadow khổng lồ không được vẽ trong lớp fixed) · force: chỉ vùng sáng nhận thao tác
  const sp = els.length ? div('tut-spot') : null, blk = els.length ? [0, 1, 2, 3].map(() => div('tut-blk')) : [];
  const bub = div('tut-bub'); bub.innerHTML = text + (force ? '' : '<small>Chạm để tiếp tục</small>');
  const skip = Object.assign(document.createElement('button'), { className: 'tut-skip', textContent: 'Bỏ qua hướng dẫn' });
  const h = hand ? div('tut-hand ' + (hand.to ? 'swipe' : 'tap')) : null; if (h) h.textContent = '👆';
  root.append(...[sp, ...blk, bub, skip, h].filter(Boolean));
  document.body.appendChild(root);

  // Tính lại vị trí mỗi khi màn đổi cỡ (vào/thoát toàn màn hình, xoay máy): mọi toạ độ lấy từ phần tử thật lúc đó
  const layout = () => {
    const u = k(), r = bounds(els, 6 * u), W = innerWidth, H = innerHeight;
    if (r) {
      put(sp, r.left, r.top, r.width, r.height);
      [[0, 0, W, r.top], [0, r.bottom, W, H - r.bottom], [0, r.top, r.left, r.height], [r.right, r.top, W - r.right, r.height]]
        .forEach(([x, y, w, hh], i) => put(blk[i], x, y, Math.max(0, w), Math.max(0, hh)));
    }
    if (h) {
      const [x, y] = mid(hand.from || hand.at); put(h, x - 12 * u, y);
      if (hand.to) { const [x2, y2] = mid(hand.to); h.style.setProperty('--dx', x2 - x + 'px'); h.style.setProperty('--dy', y2 - y + 'px'); }
    }
    // bong bóng: dưới vùng sáng → trên → bên cạnh; không có vùng sáng thì giữa màn
    const bw = bub.offsetWidth, bh = bub.offsetHeight, m = 8 * u, gap = (hand ? 44 : 12) * u;
    let x = (W - bw) / 2, y = (H - bh) / 2;
    if (r) {
      x = Math.min(W - bw - m, Math.max(m, r.left + r.width / 2 - bw / 2));
      if (r.bottom + gap + bh <= H - m) y = r.bottom + gap;
      else if (r.top - gap - bh >= m) y = r.top - gap - bh;
      else { y = Math.min(H - bh - m, Math.max(m, r.top + r.height / 2 - bh / 2)); x = r.right + gap + bw <= W - m ? r.right + gap : Math.max(m, r.left - gap - bw); }
    }
    put(bub, x, y);
  };
  layout();
  const onResize = () => requestAnimationFrame(layout); // chờ khung giãn (fit) xong mới đo
  addEventListener('resize', onResize); document.addEventListener('fullscreenchange', onResize);

  let done; const wait = new Promise(res => { done = res; });
  const t = { wait, close(v) {
    if (!root.isConnected) return;
    root.remove(); removeEventListener('resize', onResize); document.removeEventListener('fullscreenchange', onResize);
    live = live.filter(o => o !== t); done(v);
  } };
  if (!force) root.addEventListener('click', () => t.close('next'));
  skip.addEventListener('click', e => { e.stopPropagation(); t.close('skip'); });
  live.push(t);
  return t;
}

// Chuỗi bong bóng (chạm để tiếp). Trả 'done' | 'skip' | undefined (bị đóng do chuyển màn).
export async function tour(steps, q) {
  for (const s of steps) {
    const v = await tip({ target: s.sel ? q(s.sel) : null, text: s.text }).wait;
    if (v !== 'next') return v;
  }
  return 'done';
}

// Trận mẫu: b = đối tượng trả về từ startBattle. Mỗi bước: đặt bàn → khoá đúng nước (hoặc đúng pet ULT) → chờ → các ghi chú.
export async function battleTour(b, root, steps) {
  const q = sel => [...root.querySelectorAll(sel)], cell = i => root.querySelector(`.cell[data-i="${i}"]`);
  const end = v => { b.setAllow(null); b.setUltAllow(null); return v; };
  const lock = () => { b.setAllow(() => false); b.setUltAllow(-1); }; // giữa các bước: không nước nào lọt qua
  lock();
  for (const s of steps) {
    if (s.board) { b.setBoard(s.board); await sleep(450); }
    if (s.rage != null) b.mutate(st => st.pets.forEach(p => { if (p.hp > 0) p.rage = s.rage; }));
    if (s.stun) b.mutate(st => { st.bar = Math.max(0, st.boss.stun - 3); st.immune = false; });
    const pv = await tour(s.pre || [], q); // giải thích viên/kỹ năng TRƯỚC khi cho làm
    if (pv !== 'done') return end(pv);
    let t = null;
    if (s.move) {
      const [a, c] = s.move;
      b.setAllow((x, y) => (x === a && y === c) || (x === c && y === a));
      t = tip({ target: [cell(a), cell(c)], text: s.text, hand: { from: cell(a), to: cell(c) }, force: true });
    } else if (s.ult) {
      const P = b.s.pets; let u = P.findIndex(p => p.hp > 0 && p.ult.k === 'nuke'); if (u < 0) u = P.findIndex(p => p.hp > 0); // ưu tiên pet Sát thương
      b.setUltAllow(u);
      const pe = root.querySelector(`.pet.p${u}`);
      t = tip({ target: pe, text: s.text.replace('{pet}', P[u].n), hand: { at: pe.querySelector('.pe') || pe }, force: true });
    }
    if (t) {
      const v = await Promise.race([t.wait, b.waitAccept().then(() => 'ok')]);
      t.close(); // tắt ngay khi nước được nhận, không chờ hoạt ảnh
      if (v !== 'ok') return end(v);
      lock();
      await b.waitTurn(); // chờ hết lượt (ăn viên, boss đánh) rồi mới giải thích
      await sleep(300);
    }
    const v = await tour(s.notes || [], q);
    if (v !== 'done') return end(v);
  }
  return end('done');
}
