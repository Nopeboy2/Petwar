// Máy chủ tĩnh tối giản để chạy thử: node serve.js [port]  → http://localhost:8080
// (ES modules không chạy được khi mở file:// trực tiếp, nên cần máy chủ.)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';
const port = +process.argv[2] || 8080;
const root = fileURLToPath(new URL('.', import.meta.url));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
http.createServer(async (req, res) => {
  const p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '') || 'index.html';
  if (p.includes('..')) { res.writeHead(403).end(); return; }
  let body;
  try { body = await readFile(join(root, p)); } catch { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(body);
}).listen(port, () => {
  console.log('Máy tính:   http://localhost:' + port);
  for (const a of Object.values(networkInterfaces()).flat())
    if (a.family === 'IPv4' && !a.internal) console.log('Điện thoại: http://' + a.address + ':' + port);
  console.log('Tắt: Ctrl + C');
});
