# Brief — Hộp thoại 09b Nâng cấp pet

Gửi cho AI: file này + ảnh tham chiếu phong cách **`design/source/pet-ui-kit/asset_contact_sheet.jpg`** và **`design/source/map-ui-kit.png`** (bộ gần nhất, cùng chất liệu).
Logic & con số: **`design/UPGRADE.md`**. Phong cách theo **UI-SPEC mục 0**.

---

## A. Màn này làm gì

Mở khi chạm nút **"Lên cấp"** ở màn 09 Chi tiết pet. Đây là **hộp thoại nổi** đè lên màn 09 (nền phía sau tối 60%), không phải trang riêng, để người chơi vẫn thấy pet đang nâng.

Hộp thoại phải trả lời ngay 4 câu:
1. **Lên từ cấp mấy lên cấp mấy?** (Lv 3 ➜ Lv 4)
2. **Mạnh thêm bao nhiêu?** HP / ATK / DEF hiện tại ➜ sau khi nâng, phần tăng màu xanh. ULT mạnh thêm bao nhiêu.
3. **Tốn bao nhiêu vàng, mình đang có bao nhiêu?**
4. **Vì sao không nâng được?** Thiếu vàng, hoặc đã chạm trần cấp (= 1 + số boss đã hạ → "Hạ Boss X để mở cấp N").

Nâng xong: hiệu ứng lên cấp trên chân dung, số nhảy, **hộp thoại giữ nguyên** để nâng tiếp. Đóng bằng ✕ hoặc "Đóng".

---

## B. Bố cục (844×390, toạ độ theo khung tai thỏ)

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Lớp tối | 0 | 0 | 844 | 390 | Đen 60% đè màn 09 |
| **Khung hộp thoại** | 142 | 34 | 560 | 336 | `panel_upgrade` 9-slice: viền vàng, lòng kem |
| Băng tiêu đề | 272 | 14 | 300 | 44 | `title_island` có sẵn + chữ "NÂNG CẤP" |
| Nút ✕ | 670 | 30 | 32 | 32 | `btn_close` (dời khỏi ngọc góc khung) |
| **Chân dung** | 170 | 72 | 140 | 140 | `frame_upgrade` + `pet_<id>_portrait` (có sẵn) bên trong 112×112 |
| · Hiệu ứng lên cấp | 140 | 42 | 200 | 200 | `fx_levelup` (chỉ hiện lúc vừa nâng, ~0.8 s) |
| **Dòng cấp** | 166 | 222 | 148 | 44 | `badge_level` (Lv 3) · `arrow_upgrade` · `badge_level` sáng (Lv 4); số gõ bằng code 16pt |
| Nút Túi đá | 166 | 272 | 148 | 36 | `btn_secondary` nhỏ + `icon_bag_stone` 24 + "Túi đá" 13pt → mở 09c |
| Vàng đang có | 166 | 314 | 148 | 34 | `chip_coin` có sẵn (`assets/ui/`) + số 15pt |
| **Dòng chỉ số ×3** | 330 | 72 + 42·k | 348 | 36 | `row_compare`: icon `icon_stat_hp/atk/def` 26 (có sẵn) · tên 13pt · **hiện tại** 15pt · `arrow_upgrade` nhỏ 16 · **mới** 17pt xanh `#2e9e3e` · "(+38)" 11pt |
| Dòng ULT | 330 | 198 | 348 | 36 | `row_compare` + `icon_ult` 26 (có sẵn) · "Huỷ diệt 1044 ➜ 1092" / "Khiên 25% HP: 496 ➜ 520" |
| **Dòng chi phí** | 330 | 240 | 348 | 40 | `row_compare`: `slot_stone_<cấp>` 36 chứa `stone_<hệ>_<cấp>` 30 · "Đá Hỏa I" 13pt · **có/cần** "2/3" 15pt (đỏ nếu thiếu) · ┆ · `chip_coin` nhỏ + "200" |
| Dòng trần cấp | 330 | 282 | 348 | 16 | Chữ 11pt nâu. Thường: "Cấp tối đa hiện tại: 4". Chạm trần: `icon_lock_gold` 14 + "Hạ **Boss 3** để mở cấp 5" |
| Nút Đóng | 330 | 304 | 150 | 48 | `btn_secondary` có sẵn |
| **Nút Nâng cấp** | 494 | 304 | 184 | 48 | `btn_primary` có sẵn + `icon_upgrade` 24 + "NÂNG CẤP" 15pt |

**Trạng thái (cần thiết kế đủ):**
| Trạng thái | Hiển thị |
|---|---|
| Nâng được | Nút vàng sáng, giá màu nâu; `icon_upgrade` nhún nhẹ |
| Thiếu vàng / thiếu đá | Nút xám (CSS grayscale); số thiếu **đỏ** trong dòng chi phí; dòng trần cấp đổi thành "Thiếu 1 đá Hỏa I — đổi trong Túi đá" (chạm được) |
| Chạm trần cấp | Nút thay bằng `plate_maxed` (biển khoá) + chữ "Đạt cấp tối đa"; dòng chỉ số chỉ hiện số hiện tại, không có mũi tên |
| Vừa nâng | `fx_levelup` bung trên chân dung; `badge_level` mới phóng to 1.3 → 1; số mới nháy xanh; `fx_stat_up` bay lên cạnh từng số |

**Ngoài hộp thoại (màn 08, 09, sảnh):** nút "Lên cấp" ở 09 thêm `icon_upgrade`; chấm đỏ `dot_notify` (có sẵn) trên nút Lên cấp / thẻ pet / nút Pet ở sảnh khi có pet nâng được. Màn 07 Kết quả: thêm ô đá nhận được (`slot_stone` 40 + `stone` + "×3") cạnh chip vàng.

---

## B2. Hộp thoại 09c Túi đá (mở từ nút "Túi đá")

Cùng khung `panel_upgrade`, cùng vị trí, đè lên 09b. Luật đổi đá: `design/UPGRADE.md` mục 4b.

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Khung + tiêu đề + ✕ | | | | | Như 09b, chữ "TÚI ĐÁ" |
| Hàng đầu cột | 182 + 72·c | 66 | 64 | 24 | Huy hiệu hệ `icon_el_*` 22 (có sẵn), 5 cột theo vòng Sinh: Mộc · Hỏa · Thổ · Kim · Thủy |
| Nhãn hàng | 156 | 102 + 72·r | 22 | 64 | "I" "II" "III" 13pt |
| **Ô đá 5×3** | 182 + 72·c | 96 + 72·r | 64 | 64 | `slot_stone_<cấp>` + `stone_<hệ>_<cấp>` 48 + số lượng góc phải dưới 13pt viền tối. Số 0 → đá mờ 40% |
| · Ô đang chọn | | | | | Viền vàng sáng `slot_stone_sel` đè lên |
| Mũi tên vòng Sinh | 236 + 72·c | 72 | 16 | 12 | `arrow_sinh` nhỏ giữa 2 huy hiệu hệ: gợi ý chiều chuyển hệ |
| **Ô chi tiết** | 552 | 96 | 134 | 112 | `row_compare` dọc / lòng kem đậm: đá lớn 56 · tên "Đá Hỏa II" 13pt · "Có: 7" 12pt |
| Nút Hợp nhất | 552 | 218 | 134 | 40 | `btn_secondary` + `icon_merge` 20 + "3 → 1" (mờ nếu < 3 hoặc đá cấp III) |
| Nút Chuyển hệ | 552 | 266 | 134 | 40 | `btn_secondary` + `icon_convert` 20 + "→ Thổ 🪙30" (hệ đích theo vòng Sinh) |
| Gợi ý | 182 + 0 | 318 | 496 | 18 | 11pt: "Đá rơi khi thắng boss cùng hệ · Chuyển hệ theo vòng Sinh Mộc→Hỏa→Thổ→Kim→Thủy" |

Bấm Hợp nhất / Chuyển hệ: đá nguồn bay vào đá đích (CSS), số cập nhật; hiệu ứng `fx_stat_up` nhỏ trên ô đích.

---

## C. Danh sách asset

Hiển thị = kích thước trong khung 844×390. **Xuất = gấp 2–3 lần** (ghi trong bảng).

| Asset | Có sẵn? | Hiển thị → Xuất | Ghi chú |
|---|---|---|---|
| `title_island`, `btn_primary`, `btn_secondary`, `chip_coin`, `icon_stat_hp/atk/def`, `icon_ult`, `icon_lock_gold`, `dot_notify`, `pet_<id>_portrait` | ✅ | | Dùng lại, không vẽ |
| **Khung hộp thoại** `panel_upgrade` | ❌ mới | 560×336 → **1120×672** | 9-slice: góc ≥ 48 px (bản xuất), cạnh trơn để kéo giãn. Viền vàng dày, lòng kem, góc trên có 2 đinh/ngọc tím nhỏ |
| **Khung chân dung** `frame_upgrade` | ❌ mới | 140×140 → **420×420** | Vuông bo góc, viền vàng, lòng **trong suốt** (ảnh pet đặt dưới), chân khung có ô trống cho huy hiệu cấp |
| **Huy hiệu cấp** `badge_level` | ❌ mới | 48×44 → **144×132** | Khiên tím viền vàng, lòng trống (gõ số). Thêm bản `badge_level_new` sáng hơn, có quầng vàng |
| **Mũi tên tăng** `arrow_upgrade` | ❌ mới | 28×20 → **112×80** | Mũi tên vàng chỉ phải, dày, có vệt sáng |
| **Dòng so sánh** `row_compare` | ❌ mới | 348×36 → **1044×108** | Dải kem đậm hơn lòng hộp thoại, bo tròn, viền vàng mảnh, ô tròn nhỏ bên trái cho icon. 9-slice ngang |
| **Icon nâng cấp** `icon_upgrade` | ❌ mới | 24×24 → **96×96** | Mũi tên lên xanh lá viền vàng + lấp lánh |
| **Nút đóng** `btn_close` | ❌ mới | 32×32 → **128×128** | Tròn đỏ viền vàng, dấu ✕ trắng |
| **Biển đạt trần** `plate_maxed` | ❌ mới | 184×48 → **552×144** | Biển đá/kim loại xám tím, viền vàng xỉn, ổ khoá nhỏ bên trái, lòng trống cho chữ |
| **Hiệu ứng lên cấp** `fx_levelup` | ❌ mới | 200×200 → **600×600** | Vòng sáng vàng + tia toả + lấp lánh, **trên nền đen** (hoà trộn screen) |
| **Hiệu ứng tăng chỉ số** `fx_stat_up` | ❌ mới | 24×32 → **96×128** | 3 mũi tên nhỏ xanh lá bay lên + đốm sáng, trên nền đen |
| **15 viên đá** `stone_<hệ>_<cấp>` (hệ: `moc hoa tho kim thuy`, cấp: `1 2 3`) | ❌ mới | 48×48 (lưới) · 30 (dòng chi phí) · 56 (chi tiết) → **192×192** | Xem quy tắc hình bên dưới |
| **Ô đá theo cấp** `slot_stone_1/2/3` + `slot_stone_sel` | ❌ mới | 64×64 → **192×192** | Ô vuông bo góc, lòng tối: I đồng nâu · II bạc xanh · III vàng tím, có góc trang trí tăng dần. `_sel` = viền vàng sáng phát quang, lòng trống trong suốt |
| **Icon** `icon_merge` · `icon_convert` · `icon_bag_stone` | ❌ mới | 20–24 → **96×96** | Hợp nhất: 3 viên nhỏ chụm thành 1 · Chuyển hệ: 2 mũi tên vòng tròn · Túi đá: túi da buộc dây, lộ viên đá |
| **Mũi tên vòng Sinh** `arrow_sinh` | ❌ mới | 16×12 → **64×48** | Mũi tên nhỏ vàng chỉ phải, mảnh hơn `arrow_upgrade` |

**Quy tắc hình 15 viên đá** (để nhìn là biết hệ + cấp, kể cả khi nhỏ 30 px):
| | Cấp I | Cấp II | Cấp III |
|---|---|---|---|
| Hình khối | Mảnh tinh thể thô, nhỏ, 1 khối | Đá cắt mài hình thoi/lục giác, có khung vàng mảnh ôm đáy | Đá lớn cắt nhiều mặt, khung vàng chạm trổ, có "vương miện" nhỏ trên đỉnh, quầng sáng |
| Độ sáng | Hơi đục | Trong, có vệt sáng | Rực, phát sáng, lấp lánh |

| Hệ | Màu | Biểu tượng mờ bên trong đá |
|---|---|---|
| Mộc | Xanh lá ngọc lục bảo | Chiếc lá |
| Hỏa | Đỏ cam ruby | Ngọn lửa |
| Thổ | Hổ phách nâu vàng | Hình núi |
| Kim | Bạc trắng ánh vàng nhạt | Bánh răng |
| Thủy | Xanh dương sapphire | Giọt nước |
Biểu tượng trùng với huy hiệu hệ `icon_el_*` có sẵn, nên người chơi nhận ra ngay.

---

## D. Câu lệnh tạo asset

**Cách nhanh nhất (như bộ đảo):** tạo **một ảnh gộp** bằng lệnh D0, gửi mình, mình cắt bằng công cụ có sẵn (`design/tools/extract.mjs`). Nếu một asset ra xấu thì tạo lại riêng asset đó bằng lệnh D1–D10.

Mọi lệnh: **đính kèm `asset_contact_sheet.jpg` + `map-ui-kit.png`** và mở đầu bằng:
```
Use the attached images as the exact UI art style reference: same glossy gold rims, cream parchment fills,
deep purple accents, thick dark-brown outlines, soft cel shading, cute fantasy adventure mobile game.
No text, no letters, no numbers, no watermark.
```

**D0 — Ảnh gộp cả bộ** (nền đen, các asset cách nhau rõ ràng)
```
Mobile game UI asset sheet for a pet level-up dialog, all items separated with generous spacing on a pure solid black background, front view:
1) a large horizontal dialog window frame, aspect 5:3, thick glossy gold rim, cream parchment inner area, two small purple gems on the top corners, plain flat edges suitable for 9-slice stretching;
2) a rounded-square portrait frame with gold rim and fully empty transparent center, a small empty socket at the bottom center;
3) a purple shield-shaped level badge with gold rim and empty center; 4) the same badge brighter with a golden glow;
5) a thick golden arrow pointing right with a shine streak;
6) a long thin horizontal stat row strip, aspect 10:1, slightly darker cream with a thin gold rim and a small round socket on the left end;
7) a green upward arrow icon with gold rim and sparkles;
8) a round red close button with gold rim and a white X mark;
9) a dull gray-purple stone plaque, aspect 4:1, worn gold rim, a small padlock on the left, empty center;
10) a golden level-up burst effect: glowing ring, radiating light rays and sparkles;
11) three small green upward arrows rising with tiny light particles. --ar 16:9
```

**D1 — Khung hộp thoại** `panel_upgrade`
```
Mobile game UI: a large horizontal dialog window frame, aspect ratio 5:3, thick glossy gold rim with rounded corners,
cream parchment inner area with a very subtle paper texture, two small purple gems on the top corners,
straight plain edges between corners so it can be 9-slice stretched, plain pure white background. --ar 5:3
```

**D2 — Khung chân dung** `frame_upgrade`
```
Mobile game UI: a rounded-square portrait frame, thick glossy gold rim with small purple gem accents on the corners,
fully empty center (nothing inside), a small empty rounded socket at the bottom center of the rim, plain pure white background. --ar 1:1
```

**D3 — Huy hiệu cấp** `badge_level` + `badge_level_new`
```
Mobile game UI: two shield-shaped level badges side by side, same size, deep purple fill with glossy gold rim, empty center for a number:
1) normal, 2) brighter and glowing with a soft golden aura and tiny sparkles. Plain pure white background. --ar 2:1
```

**D4 — Mũi tên tăng** `arrow_upgrade`
```
Mobile game UI: a thick chunky golden arrow pointing right, glossy with a white shine streak, thick dark-brown outline,
plain pure white background. --ar 3:2
```

**D5 — Dòng so sánh chỉ số** `row_compare`
```
Mobile game UI: a long thin horizontal rounded strip, aspect ratio 10:1, cream color slightly darker than parchment,
thin gold rim, a small round empty socket with gold ring at the left end, plain flat middle for 9-slice stretching,
plain pure white background. --ar 10:1
```

**D6 — Icon nâng cấp** `icon_upgrade`
```
Mobile game icon: a bold green upward arrow with a gold rim and thick dark-brown outline, two small white sparkles beside it,
readable at 24 pixels, plain pure white background. --ar 1:1
```

**D7 — Nút đóng** `btn_close`
```
Mobile game UI: a round close button, glossy red fill with a gold rim and a bold white X mark in the center,
thick dark-brown outline, plain pure white background. --ar 1:1
```

**D8 — Biển đạt trần** `plate_maxed`
```
Mobile game UI: a horizontal button-shaped plaque, aspect ratio 4:1, dull gray-purple stone surface, worn muted gold rim,
a small golden padlock on the left end, empty center for text, looks disabled but still pretty, plain pure white background. --ar 4:1
```

**D9 — Hiệu ứng lên cấp** `fx_levelup`
```
Mobile game VFX: a golden level-up burst, bright glowing ring in the center, radiating light rays, floating sparkles and small stars,
centered, on a pure solid black background. --ar 1:1
```

**D10 — Hiệu ứng tăng chỉ số** `fx_stat_up`
```
Mobile game VFX: three small bright green upward arrows rising at different heights with tiny glowing light particles,
on a pure solid black background. --ar 3:4
```

**D12 — 15 viên đá: tạo theo từng CẤP (3 lệnh), mỗi lệnh ra 5 viên cùng dáng, khác màu**
Tạo cấp I trước. Ở lệnh cấp II, III đính kèm thêm ảnh cấp trước và thêm câu "same five colors and inner symbols as the previous image, upgraded tier".
```
Mobile game item icons: five upgrade gemstones in one row, evenly spaced, identical shape and size, only color and inner symbol differ,
on a pure solid black background, front view, readable at 30 pixels:
1) emerald green with a faint leaf symbol inside, 2) ruby red-orange with a faint flame symbol inside,
3) amber brown-gold with a faint mountain symbol inside, 4) silver-white with pale gold tint and a faint gear symbol inside,
5) sapphire blue with a faint water drop symbol inside.
{CẤP} --ar 5:1
```
`{CẤP}`:
- **Cấp I:** `Tier 1: small rough raw crystal shards, single chunk, slightly cloudy, simple shape, no metal setting.`
- **Cấp II:** `Tier 2: polished cut gems in a rhombus/hexagon shape, clear with a white shine streak, a thin gold setting hugging the bottom.`
- **Cấp III:** `Tier 3: large brilliant multi-faceted gems in an ornate engraved gold setting with a small crown on top, strong inner glow, sparkles and a soft aura of the gem color.`

**D13 — Ô đá theo cấp** `slot_stone_1/2/3` + `slot_stone_sel`
```
Mobile game UI: four rounded-square item slot frames in a row, same size, dark inner area, empty center:
1) bronze-brown rim, plain; 2) silver rim with a blue tint and small corner studs; 3) ornate gold rim with purple gems on the corners;
4) a bright glowing golden selection outline only, fully empty transparent inside. On a pure solid black background. --ar 4:1
```

**D14 — Icon đá** `icon_merge` · `icon_convert` · `icon_bag_stone` · `arrow_sinh`
```
Mobile game icon set, four icons in a row, same height, thick dark-brown outline, readable at 20 pixels, on a pure solid black background:
1) three small colorful gems merging into one bigger glowing gem with a tiny plus sparkle,
2) two curved golden arrows forming a circle (convert / cycle),
3) a small brown leather pouch tied with a string, with colorful gems peeking out,
4) a slim small golden arrow pointing right. --ar 4:1
```

Nếu dùng **D0 ảnh gộp**: tạo đá (D12) và ô/icon (D13, D14) thành **ảnh gộp thứ hai** riêng, đừng nhồi chung với D0 (quá nhiều món thì AI vẽ lệch phong cách).

**D11 — Ảnh màn thử (tuỳ chọn, chỉ để xem cảm giác)**
```
Finished mobile game pet level-up dialog in the art style of the attached images, landscape 844x390.
A dimmed fantasy camp background with a large cream-and-gold dialog window in the center and a purple winged title ribbon on top.
Left side of the dialog: a chibi fire tiger creature portrait in a gold frame, below it two purple level badges with a gold arrow between them, and a gold coin chip.
Right side: three stat rows with small icons and arrows, one skill row, a gray close button and a big yellow upgrade button at the bottom.
A red round close button at the top right corner. Leave all labels blank (no text). --ar 13:6
```

---

## E. Kiểm trước khi gửi
- [ ] Phong cách khớp bộ tham chiếu (vàng · kem · tím, viền nâu đậm).
- [ ] `panel_upgrade`, `row_compare`: cạnh giữa **trơn** (không hoa văn) để kéo giãn 9-slice không méo.
- [ ] `frame_upgrade`: lòng **trống hoàn toàn**; ô huy hiệu ở chân khung đủ chỗ cho `badge_level` 48×44.
- [ ] `badge_level` và `badge_level_new` cùng cỡ, cùng dáng; chỉ khác độ sáng.
- [ ] Hiệu ứng (`fx_*`) trên **nền đen tuyền**; asset còn lại nền đen hoặc trắng tinh, không bóng đổ ra nền.
- [ ] `icon_upgrade` đọc được ở 24 px; ✕ đọc được ở 32 px.
- [ ] Không có chữ / số trong asset (chữ "Lv", số, giá… gõ bằng code).
- [ ] Ảnh gộp: các asset cách nhau ≥ 30 px, không chạm nhau (để cắt tự động).
- [ ] 15 viên đá: **cùng cấp thì cùng dáng**, **cùng hệ thì cùng màu + biểu tượng** qua 3 cấp; ở 30 px vẫn phân biệt được cả hệ lẫn cấp; chuyển đen trắng vẫn phân biệt được cấp (nhờ hình khối).
- [ ] Đặt tên: `stone_moc_1` … `stone_thuy_3`.

---

## F. Đã nhận asset (2026-11-05)
- Bộ gốc: `design/source/upgrade-ui-kit/` (PNG, đúng kích thước xuất mục C) → WebP ở `assets/upgrade-ui/` bằng `node design/tools/extract.mjs upgrade.html assets/upgrade-ui`; trong code dùng `uui('<tên>')` (`data/art.js`).
- 9-slice: `panel_upgrade` cắt 72 px (hiển thị 36 px); `row_compare` cắt 24 × 66 px (hiển thị 12 × 33 px). Dùng `border-image`.
- `fx_levelup`, `fx_stat_up`: tách lại từ bản `*_screen` (nền đen) vì bản trong suốt gốc bị nhạt quầng.
- Nút ✕: dời lên **x 670 · y 30** (toạ độ cũ đè viên ngọc góc khung).
- Đá ở 30 px: cấp I và II khó phân biệt nếu đứng riêng → **luôn đặt đá trong `slot_stone_<cấp>`** + chữ "I/II/III".
- Không dùng: `divider_gold`, `plate_info` (thêm ngoài brief), `preview_upgrade_dialog.png` (ảnh minh hoạ có chữ, chỉ tham khảo).
