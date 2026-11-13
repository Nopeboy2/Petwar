// Chuẩn hoá ảnh pet (tách nền trắng, căn chân, đặt cỡ theo vai) → assets/pets/
// Chạy lại toàn bộ theo design/tools/pets.json:   node design/tools/pet.mjs --all [id]
// Chạy lẻ: node design/tools/pet.mjs <ảnh gốc> <id> <T|S|D> [chân dung x,y,cạnh | ""] [tư thế=idle] [crop x,y,w,h] [ref chiều cao chung] [iso=1 khi các tư thế chồng lên nhau]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '../..'), out = path.join(root, 'assets/pets');
const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome'].find(p => fs.existsSync(p));

function run(src, id, role = 'D', portrait = '', pose = 'idle', crop = '', ref = '', iso = '', scale = 1, flip = '') {
  const url = pathToFileURL(path.join(here, 'pet.html')).href + '?' + new URLSearchParams({ src: pathToFileURL(path.resolve(root, src)).href, role, portrait, pose, crop, ref: String(ref || ''), iso: iso && iso !== '0' ? '1' : '', scale: String(scale || 1), flip: flip ? '1' : '' });
  const html = execFileSync(chrome, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files', `--user-data-dir=${path.join(os.tmpdir(), 'pw-pet')}`,
    '--virtual-time-budget=15000', '--dump-dom', url], { maxBuffer: 1 << 28 }).toString();
  const res = JSON.parse(html.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  fs.mkdirSync(out, { recursive: true });
  const h = res.h; delete res.h; const names = [];
  for (const [k, dataUrl] of Object.entries(res)) {
    const name = k === 'portrait' ? `pet_${id}_portrait.webp` : `pet_${id}_${pose}${k.endsWith('_L') ? '_L' : ''}.webp`;
    fs.writeFileSync(path.join(out, name), Buffer.from(dataUrl.split(',')[1], 'base64')); names.push(name);
  }
  console.log(`${id} ${pose}: cao ${h}px → ${names.join(', ')}`);
  return h;
}

const args = process.argv.slice(2);
if (args[0] === '--all') {
  const { pets } = JSON.parse(fs.readFileSync(path.join(here, 'pets.json'), 'utf8'));
  for (const p of pets.filter(p => !args[1] || p.id === args[1])) {
    if (p.files) { // pet thu phục từ boss: mỗi tư thế 1 file, lật ngang; mọi tư thế dùng chiều cao idle làm ref → cùng tỉ lệ
      const ref = run(p.files.idle, p.id, p.role, p.portrait, 'idle', '', '', '', p.scale, 1);
      for (const [pose, src] of Object.entries(p.files)) if (pose !== 'idle') run(src, p.id, p.role, '', pose, '', ref, '', p.scale, 1);
      continue;
    }
    run(p.idle.src, p.id, p.role, p.idle.portrait, 'idle', '', p.idle.ref, '', p.scale);
    for (const [pose, cell] of Object.entries(p.poses.cells)) run(p.poses.src, p.id, p.role, '', pose, cell, p.poses.ref, p.poses.iso, p.scale);
  }
} else if (args.length >= 2) run(...args);
else console.log('Cách dùng: node design/tools/pet.mjs --all [id]   hoặc   node design/tools/pet.mjs <ảnh> <id> <T|S|D> [x,y,cạnh] [tư thế] [crop] [ref] [iso]');
