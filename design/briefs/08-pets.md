# Brief — Trang Pet (08 Bộ sưu tập · 09 Chi tiết pet)

Gửi file này + 2 ảnh khung cho AI:
- `08-pet-list-wireframe.png` — màn Bộ sưu tập
- `09-pet-detail-wireframe.png` — màn Chi tiết pet

Phong cách phải **khớp bộ khung sảnh đã có** (`design/source/home-kit.png`): đính kèm ảnh đó làm tham chiếu ở mọi lệnh.

---

## A. Các bước

| Bước | Việc | Kết quả |
|---|---|---|
| 1 | Điền mục B (vài quyết định nhỏ) | |
| 2 | Tạo asset theo **Lệnh 1–6** (mục E), mỗi lệnh đính kèm `home-kit.png` | Khung thẻ, icon hệ/vai/chỉ số, khung bảng, nền |
| 3 | (Tuỳ chọn) Ảnh màn thử bằng **Lệnh 7**, đính kèm wireframe + `home-kit.png` | Xem cảm giác tổng thể |
| 4 | Ghép trong Figma theo toạ độ mục C, D — **gõ chữ trong Figma** | Thiết kế 2 màn |
| 5 | Kiểm mục F → gửi mình (asset rời + ảnh màn ghép) | Mình dựng vào game |

Ảnh pet **đã có** (`assets/pets/`), không cần vẽ lại — trong Figma đặt ảnh `pet_<id>_idle_L.webp` vào ô pet.

---

## B. Quyết định (đã chốt theo bản đang chạy)

| # | Mục | Đã chốt |
|---|---|---|
| B1 | Nền | `bg_pet` cho cả 2 màn, **làm mờ 5px + tối 80%** (`bg_pet_detail` không dùng vì có bệ đá vẽ sẵn bị chồng bệ) |
| B2 | Pet trong đội | Khung `card_pet_selected` (có khiên vẽ sẵn) + **số ô 1/2/3 viết lên khiên** — không chồng thêm huy hiệu |
| B3 | Cấp/EXP | Chỉ có nút "Lên cấp (sau)" mờ ở màn Chi tiết; thẻ không có thanh EXP |
| B4 | Màn Chi tiết | Không có nút chọn tư thế; pet có **hoạt ảnh đứng yên** (thở + nhún, 2.6s) |
| B5 | Thẻ | **Không** có icon vai / hệ trên thẻ — chỉ pet + tên. Vai/hệ lọc bằng thanh lọc |
| B6 | Icon vai | Huy hiệu tròn `icon_role_t/s/d_round` (khiên · tim+ · kiếm chéo), cùng kiểu icon hệ |

---

## C. Màn 08 — Bộ sưu tập pet

Khung 844×390, ngang. Nút ← / chip vàng neo mép cách vùng an toàn 12 pt; khối giữa (lọc, thẻ, trang) căn giữa màn. Toạ độ theo khung tai thỏ (wireframe `08-pet-list.svg`).

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền | 0 | 0 | 844 | 390 | `bg_pet` mờ 5px, tối 80% |
| Nút ← | 60 | 8 | 44 | 40 | `btn_back` → sảnh |
| Tiêu đề | 292 | 8 | 260 | 40 | `title_pet`, chữ "PET" 18pt trắng |
| Chip vàng | 672 | 12 | 112 | 32 | `chip_coin` |
| **Thanh lọc** | 222 | 56 | 400 | 38 | Dải kính mờ bo 19: "Hệ" + 6 nút tròn 32 (Tất cả = bàn chân, Kim, Mộc, Thủy, Hỏa, Thổ) · vạch ngăn · "Vai" + 4 nút (Tất cả, Tanker, Hỗ trợ, Sát thương). Chỉ icon (24px) |
| Mũi tên trang | 12 / 796 | 192 | 36 | 52 | `btn_back` (lật cho "sau"); mờ 35% khi hết trang |
| **Thẻ pet ×5/trang** | 60 + 147·i | 114 | 136 | 208 | Khe 11; ít thẻ → căn giữa |
| · Pet trên bệ | +1 | +10 | 134 | 134 | Bệ `pedestal` 112×47 tại (+12,+116); pet thở |
| · Tên (thẻ thường) | +8 | +174 | 120 | 26 | 15pt trắng giữa dải tím (dải tím: y 174–197) |
| · Tên (thẻ trong đội) | +17 | +161 | 103 | 26 | dải tím của `card_pet_selected` cao hơn: y 163–185 |
| · Số ô (trong đội) | +17 | +8 | 30 | 30 | Số 16pt nâu trên khiên vẽ sẵn (tâm khiên 32,23) |
| Chỉ báo trang | 382 | 332 | 80 | 18 | Viên nền tối mờ: chấm trang (trang hiện tại = vạch vàng 14px) + "1/1" 10pt |

**Trạng thái thẻ:** thường (`card_pet`) · nhấn (`card_pet_pressed`, thu 97%) · trong đội (`card_pet_selected` + số) · khoá (`card_pet_locked`, để sau).
**Trạng thái nút lọc:** thường (icon giảm bão hoà, mờ 75%) · chọn (vòng vàng 2px + quầng sáng, icon 108%). Bấm lại nút đang chọn = bỏ lọc. Lọc/trang giữ khi vào Chi tiết rồi quay lại.

---

## D. Màn 09 — Chi tiết pet

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền | 0 | 0 | 844 | 390 | `bg_pet` mờ 5px, tối 80% |
| Nút ← | 60 | 8 | 44 | 40 | → Bộ sưu tập |
| Tiêu đề | 292 | 8 | 260 | 40 | `title_pet` + tên pet |
| **Pet lớn** | giữa vùng trái | giữa dọc | 300 | 300 | Căn giữa vùng trống bên trái cột thông tin. Quầng `fx_light`, vòng `fx_circle` (nhấp nháy), bệ `pedestal_large` 300×99, pet 246×246 có hoạt ảnh đứng yên |
| **Cột thông tin** | sát phải (cách 12) | 56 | 440 | 322 | 4 khối cách đều theo chiều dọc ↓ |
| · Dòng tên | | 56 | 440 | 44 | `panel_title_row`: tên 20pt · huy hiệu vai 30 · huy hiệu hệ 28 · chip "Lv 1" sát phải (`chip_level`) |
| · Bảng chỉ số | | 112 | 440 | 150 | Khung `panel_detail_back` dạng 9-slice (viền 16). 4 dòng cao 26: icon `icon_stat_*` 26 · nhãn 14pt (52) · thanh cao 14 (`bar_*`, độ dài so với pet cao nhất) · số 17pt (48) |
| · Khung ULT | | 274 | 440 | 56 | `panel_ult`: `icon_ult` 40 · tên chiêu 15pt · mô tả 12pt |
| · Hàng nút | | 342 | 440 | 36 | Sát phải: "Lên cấp (sau)" `btn_secondary` 140 (mờ) · "Chọn vào đội" `btn_primary` 180 → "Trong đội · ô N" khi đã ở đội |

Bỏ so với bản trước: hàng nút tư thế, chip hệ góc phải, khung Ngũ hành.

---

## E. Câu lệnh tạo asset

Mọi lệnh: **đính kèm `home-kit.png`** + bắt đầu bằng:
```
Use the attached image as the exact UI art style reference: same glossy gold rims, cream parchment fills,
purple and gold palette, thick dark-brown outlines, soft cel shading, cute fantasy adventure mobile game.
Plain pure white background, no text, no letters, no numbers.
```

**Lệnh 1 — Khung thẻ pet (3 trạng thái)**
```
Mobile game UI: three tall vertical pet card frames side by side, each the same size with 2:3 aspect ratio,
rounded corners, ornate gold rim, soft cream-to-light-purple inner background, empty inside.
1) normal, 2) selected: brighter glowing golden rim with a small round number badge slot at the top-left,
3) locked: darkened grey card with a golden padlock in the center. --ar 3:2
```
Xuất mỗi thẻ ≥ 272×416 px.

**Lệnh 2 — 5 huy hiệu hệ Ngũ hành**
```
Mobile game icon set: five round gem badges with gold rims, same size, evenly spaced in one row:
1) Metal: silver-white badge with a gear and blade symbol,
2) Wood: green badge with a sprouting leaf symbol,
3) Water: blue badge with a water drop symbol,
4) Fire: red-orange badge with a flame symbol,
5) Earth: brown badge with a mountain rock symbol.
Symbols bold and readable at 24 pixels. --ar 5:1
```

**Lệnh 3 — 3 icon vai trò**
```
Mobile game icon set: three icons in one row, same size, gold-rimmed:
1) Tank: big sturdy shield, 2) Support: glowing heart with a small plus sign, 3) Damage: crossed sharp swords.
--ar 3:1
```

**Lệnh 4 — 4 icon chỉ số**
```
Mobile game icon set: four small stat icons in one row, same size:
1) HP: red heart, 2) ATK: orange sword, 3) DEF: blue shield, 4) Aggro: red-and-white target bullseye.
Simple bold shapes readable at 18 pixels. --ar 4:1
```

**Lệnh 5 — Khung bảng thông tin + thanh chỉ số + nút tư thế**
```
Mobile game UI kit pieces, front view, evenly spaced:
1) a wide horizontal info panel with thin gold rim and cream parchment fill, rounded corners (aspect 10:1),
2) a medium info panel same style (aspect 4:1),
3) an empty horizontal stat bar frame with gold rim and dark inner track,
4) a small round gold-rimmed button slot with a dark purple center, plus the same slot glowing (selected).
```

**Lệnh 6 — Nền trang Pet**
```
Mobile game background: cozy interior of an adventurer camp tent, warm lantern light, wooden shelves
with small trophies and scrolls, soft blur, slightly darkened, calm center area,
no characters, no text --ar 21:9
```
Cần rộng ≥ 1920 px; chi tiết quan trọng dồn vào giữa.

**Lệnh 7 — Ảnh màn thử (tuỳ chọn, chỉ để xem cảm giác)**
Đính kèm wireframe (`08-...png` hoặc `09-...png`) + `home-kit.png`:
```
Redesign this wireframe as a finished mobile game screen in the art style of the second image.
Keep every element at exactly the same position and size as the wireframe. Landscape 844x390.
Cute chibi pets stand on stone pedestals inside the card/pet areas. Leave all labels blank (no text).
```
AI sẽ lệch vị trí và viết sai chữ → chỉ tham khảo; bản chính ghép trong Figma.

---

## F. Kiểm trước khi gửi
- [ ] Đúng khung 844×390; các ô khớp toạ độ mục C/D (lệch ≤ 4 pt).
- [ ] Phong cách khớp `home-kit.png` (viền vàng, nền kem, tím–vàng).
- [ ] 5 huy hiệu hệ phân biệt được khi chuyển đen trắng (khác hình biểu tượng).
- [ ] Chữ gõ trong Figma, đúng dấu tiếng Việt, ≥ 12 pt (số trên thanh chỉ số ≥ 11 pt).
- [ ] Thẻ có đủ 3 trạng thái (thường, trong đội, khoá).
- [ ] Asset rời, nền trắng tinh (hoặc trong suốt), các phần cách nhau ≥ 20 px nếu gộp một ảnh.
- [ ] Đặt tên gợi ý: `card_pet`, `card_pet_selected`, `card_pet_locked`, `icon_el_kim` … `icon_el_tho`, `icon_role_t/s/d`, `icon_stat_hp/atk/def/aggro`, `panel_info_wide`, `panel_info_mid`, `bar_stat`, `btn_pose`, `bg_pet`.
