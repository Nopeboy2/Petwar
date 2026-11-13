// Âm thanh tổng hợp bằng WebAudio (không cần file). Chỉ phát được sau lần chạm đầu tiên → unlock().
let ctx, vol = 1, vib = true;
export const setAudio = (v, b) => { vol = v; vib = b; };
export function unlock() {
  try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); ctx.resume && ctx.resume(); } catch { /* không có âm thanh */ }
}
const SEQ = {
  swap: [[300, .06]], bad: [[150, .12]], hit: [[220, .1]], boss: [[110, .22]], heal: [[660, .08], [880, .08]],
  stun: [[600, .1], [800, .15]], ult: [[500, .1], [700, .1], [900, .2]],
  win: [[523, .15], [659, .15], [784, .3]], lose: [[300, .2], [220, .2], [150, .4]],
};
export function sfx(name, n = 0) {
  if (!ctx || !vol) return;
  const seq = name === 'pop' ? [[420 + n * 90, .09]] : SEQ[name] || [];
  let t = ctx.currentTime;
  for (const [f, d] of seq) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = f;
    g.gain.setValueAtTime(0.15 * vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + d); t += d;
  }
}
export const vibrate = ms => { if (vib) try { navigator.vibrate && navigator.vibrate(ms); } catch { /* iOS không hỗ trợ */ } };
