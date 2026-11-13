// Cắt asset từ ảnh thiết kế. Chạy: node design/tools/extract.mjs [trang cắt=extract.html] [thư mục ra=assets/ui]
// Sửa toạ độ cắt trong extract.html (mảng RECTS). Cần Google Chrome.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const [page = 'extract.html', dest = 'assets/ui'] = process.argv.slice(2), out = path.join(here, '../..', dest);
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome']
  .find(p => fs.existsSync(p));
const html = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files', `--user-data-dir=${path.join(os.tmpdir(), 'pw-extract')}`,
  '--virtual-time-budget=10000', '--dump-dom', pathToFileURL(path.join(here, page)).href], { maxBuffer: 1 << 28 }).toString();
const json = html.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
fs.mkdirSync(out, { recursive: true });
for (const [name, url] of Object.entries(JSON.parse(json))) {
  const [, ext, b64] = url.match(/^data:image\/(\w+);base64,(.*)$/);
  fs.writeFileSync(path.join(out, `${name}.${ext}`), Buffer.from(b64, 'base64'));
  console.log(`${name}.${ext}`);
}
