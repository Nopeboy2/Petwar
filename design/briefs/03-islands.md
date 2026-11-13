# Brief — Màn 03 Chọn đảo (khu vực đánh boss)

Gửi cho AI: file này + ảnh tham chiếu phong cách **`design/source/pet-ui-kit/asset_contact_sheet.jpg`** (khung UI) và **`design/source/bg_sanh.png`** (phong cách nền/phong cảnh).
Phong cách theo **UI-SPEC mục 0**. Riêng màn này nền **rõ, không làm mờ** (giống sảnh) — bản đồ chính là "sân khấu".

---

## A. Màn này làm gì

Luồng mới: **Sảnh → Chọn đảo → Chọn boss (trang hiện tại, lọc theo đảo) → Đội hình → Trận**.

- **5 đảo = 5 hệ Ngũ hành.** Boss trên đảo mang hệ của đảo → người chơi học khắc chế tự nhiên ("đi đảo Mộc thì mang pet Kim").
- **Thứ tự mở khoá theo vòng Sinh:** Mộc → Hỏa → Thổ → Kim → Thủy. Hạ boss cuối đảo trước thì mở đảo sau.
- **Mỗi đảo 3 boss** (dễ → khó). Trang Chọn boss giữ nguyên bố cục, chỉ hiện boss của đảo đã chọn + tên đảo trên tiêu đề.
- Màn chỉ cần trả lời 3 câu: *đảo nào mở? đã hạ mấy boss? đảo nào đang cần đánh?*

| # | Đảo | Hệ | Chủ đề hình | Màu chủ đạo |
|---|---|---|---|---|
| 1 | Đảo Rừng Ngàn | Mộc | rừng cổ thụ khổng lồ, nấm phát sáng, thác nhỏ | xanh lá |
| 2 | Đảo Hỏa Sơn | Hỏa | núi lửa, dòng dung nham, đá đen | đỏ cam |
| 3 | Đảo Hoàng Thổ | Thổ | cao nguyên đá đỏ, mesa, đền đá cổ | nâu vàng đất |
| 4 | Đảo Thiết Nham | Kim | vách đá kim loại, tinh thể bạc, bánh răng cổ | bạc xám ánh vàng |
| 5 | Đảo Thủy Cung | Thủy | đảo san hô, cung điện vỏ sò, xoáy nước | xanh dương ngọc |

---

## B. Các bước

| Bước | Việc |
|---|---|
| 1 | Đọc mục C (bố cục) và D (danh sách asset) |
| 2 | Tạo asset **mới** bằng lệnh mục E (đính kèm ảnh tham chiếu mỗi lệnh) |
| 3 | Tái sử dụng asset đã có (mục D, cột "Có sẵn") — không vẽ lại |
| 4 | (Tuỳ chọn) ảnh màn thử bằng lệnh E8 |
| 5 | Ghép Figma theo toạ độ mục C, gõ chữ trong Figma → kiểm mục F → gửi mình |

---

## C. Bố cục (844×390, toạ độ theo khung tai thỏ, an toàn trái/phải 48 · trên 8 · dưới 20)

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền biển | 0 | 0 | 844 | 390 | `bg_sea_map` — biển, **không có đảo** (đảo là lớp riêng để đổi trạng thái khoá) |
| Đường biển | — | — | — | — | Nét chấm trắng/vàng nối 5 đảo theo thứ tự; đoạn chưa mở thì mờ (vẽ bằng SVG/CSS, không cần asset) |
| Nút ← | 60 | 8 | 44 | 40 | `btn_back` → Sảnh |
| Tiêu đề | 292 | 8 | 260 | 40 | `title_pet` + "CHỌN ĐẢO" |
| Chip tiến độ | 616 | 8 | 168 | 40 | `chip_boss` + `icon_boss_mini` + "Đã hạ 4/15" |
| **Đảo 1 Mộc** | 64 | 196 | 150 | 120 | `island_moc` |
| **Đảo 2 Hỏa** | 212 | 72 | 150 | 120 | `island_hoa` |
| **Đảo 3 Thổ** | 352 | 200 | 150 | 120 | `island_tho` |
| **Đảo 4 Kim** | 496 | 72 | 150 | 120 | `island_kim` |
| **Đảo 5 Thủy** | 636 | 196 | 150 | 120 | `island_thuy` |
| · Bảng tên | đảo.x + 10 | đảo.y + 104 | 130 | 40 | `plaque_island`: huy hiệu hệ `icon_el_*` 24 bên trái · tên đảo 14pt · dòng phụ "★ 2/3" 12pt |
| · Mây khoá | đảo.x − 6 | đảo.y − 6 | 162 | 132 | `fog_lock` phủ đảo chưa mở + `icon_lock` 32 giữa |
| · Mốc hiện tại | đảo.x + 59 | đảo.y − 28 | 32 | 40 | `marker_current` nhún lên xuống trên đảo đang cần đánh |
| · Cờ đã chinh phục | đảo.x + 118 | đảo.y + 4 | 28 | 32 | `flag_cleared` khi hạ đủ 3 boss |

**Trạng thái đảo (để thiết kế):**
| Trạng thái | Hiển thị |
|---|---|
| Khoá | Đảo giảm bão hoà 60% + `fog_lock` + `icon_lock`; bảng tên mờ, dòng phụ "Hạ boss đảo trước" |
| Đang mở (chưa xong) | Đảo màu đủ + quầng sáng nhẹ màu hệ + `marker_current` |
| Đã chinh phục | Màu đủ + `flag_cleared`, dòng phụ "★ 3/3" màu vàng |
| Nhấn | Đảo phóng 1.05, quầng sáng mạnh hơn (CSS) |

**Tương tác:** chạm đảo mở → sang Chọn boss của đảo đó. Chạm đảo khoá → rung nhẹ + toast "Hạ boss cuối Đảo X để mở".

---

## D. Danh sách asset

| Asset | Có sẵn? | Ghi chú |
|---|---|---|
| `btn_back`, `title_pet`, `icon_el_*`, `icon_lock` | ✅ | `assets/pet-ui/` |
| `chip_boss` | ✅ | `assets/team-ui/` — dùng làm chip tiến độ |
| **Nền biển** `bg_sea_map` | ❌ mới | 844×390 → xuất **1864×860** (đủ cho Pro Max 932×430 @2x), vùng an toàn giữa |
| **5 đảo** `island_moc/hoa/tho/kim/thuy` | ❌ mới | 150×120 → xuất 450×360, nền trong suốt, cùng góc nhìn & cùng tỉ lệ mặt nước |
| **Bảng tên** `plaque_island` | ❌ mới | 130×40 → xuất 390×120, 9-slice ngang |
| **Mây khoá** `fog_lock` | ❌ mới | 162×132 → xuất 486×396 |
| **Mốc hiện tại** `marker_current` | ❌ mới | 32×40 → xuất 96×120 |
| **Cờ chinh phục** `flag_cleared` | ❌ mới | 28×32 → xuất 84×96 |
| **Icon boss nhỏ** `icon_boss_mini` | ❌ mới | 18×18 → xuất 64 (dùng cả ở chip và trang Chọn boss) |
| **Boss bí ẩn** `boss_unknown` | ❌ mới | Ảnh tạm cho **mọi boss** khi chưa có hình riêng: bóng đen + "?" giữa. 134×134 → xuất 512×512, nền trong suốt. Dùng ở trang Chọn boss, chip boss (Đội hình) và màn trận. Dấu "?" **gắn bằng code** (chữ vàng, viền tím) để nét sắc và đổi được sau |

---

## E. Câu lệnh tạo asset

Mọi lệnh UI: **đính kèm `asset_contact_sheet.jpg`** + mở đầu bằng:
```
Use the attached image as the exact UI art style reference: same glossy gold rims, cream parchment fills,
deep purple accents, thick dark-brown outlines, soft cel shading, cute fantasy adventure mobile game.
Plain pure white background, no text, no letters, no numbers.
```

Lệnh nền & đảo (E1, E2): **đính kèm thêm `bg_sanh.png`** + mở đầu bằng:
```
Use the attached images as the exact art style reference: cute fantasy adventure mobile game, 2D painted,
thick dark-brown outlines, soft cel shading, vibrant but soft colors, warm top-left lighting.
No text, no letters, no numbers, no characters, no watermark.
```

**E1 — Nền biển** `bg_sea_map`
```
Top-down 3/4 view fantasy ocean map background for a mobile game world map, wide landscape.
Calm turquoise sea with gentle stylized waves and soft foam lines, deeper blue toward the edges,
a few tiny decorative details only near the borders (small rocks, seagulls, a distant sailboat, swirling clouds in the corners).
The whole central area is open water with NO islands and no large objects, so islands can be placed on top later.
Slightly lower contrast in the middle so UI stays readable. --ar 13:6
```

**E2 — 5 đảo** (tạo **từng đảo một**, cùng một cuộc trò chuyện; sau đảo đầu tiên đính kèm luôn đảo đó và thêm "same view angle, same size, same water rim as the previous island")
```
A single floating-on-water fantasy island for a mobile game world map, 3/4 top-down view, centered,
compact rounded shape, a thin ring of shallow water and white foam around the base, whole island visible,
plain pure white background. {CHỦ ĐỀ}. Clear readable silhouette at small size. --ar 5:4
```
`{CHỦ ĐỀ}`:
- **Mộc** `island_moc`: `lush green forest island with one giant ancient tree in the center, glowing mushrooms, a tiny waterfall, vines and flowers`
- **Hỏa** `island_hoa`: `volcanic island with a small active volcano in the center, glowing orange lava streams, black rocks, gentle smoke`
- **Thổ** `island_tho`: `earthy highland island with red-brown mesa cliffs, layered rock, an ancient stone temple on top, a few dry shrubs`
- **Kim** `island_kim`: `metallic rocky island with silver cliffs, shining crystal spires, ancient golden gears half-buried in the rock`
- **Thủy** `island_thuy`: `coral reef island with a pearl-white seashell palace, pink corals, a glowing water whirlpool beside it`

**E3 — Bảng tên đảo** `plaque_island`
```
Mobile game UI: a small horizontal name plaque, aspect ratio 13:4, cream parchment fill with glossy gold rim,
slightly curved ribbon ends on both sides, a round empty socket on the left end for an element badge,
empty space for text in the middle, front view. --ar 3:1
```

**E4 — Mây khoá** `fog_lock`
```
Mobile game UI effect: a soft fluffy gray-purple cloud cluster shaped to cover a small island,
dense in the center and wispy at the edges, slightly dark and mysterious, cel shaded with dark-brown outline,
empty center area for a lock icon. --ar 5:4
```

**E5 — Mốc hiện tại** `marker_current`
```
Mobile game UI: a map location marker pin, golden teardrop pin with a purple gem in the center and a small paw print on the gem,
glossy, thick dark-brown outline, pointing down, front view. --ar 4:5
```

**E6 — Cờ chinh phục** `flag_cleared`
```
Mobile game UI: a small victory flag on a short golden pole, purple pennant with a gold star emblem,
waving to the right, glossy, thick dark-brown outline. --ar 7:8
```

**E7 — Icon boss nhỏ** `icon_boss_mini`
```
Mobile game icon: a cute horned monster skull head, ivory color with two small purple horns and a gold rim outline,
bold simple shape readable at 18 pixels, front view. --ar 1:1
```

**E9 — Boss bí ẩn** `boss_unknown` (không cần đính kèm ảnh tham chiếu; chỉ cần nền trong suốt hoặc trắng tinh)
```
A mysterious boss monster silhouette for a cute fantasy mobile game, pure solid black-purple shadow shape (#1a1026),
no inner details, no face, no eyes, bulky creature with two curved horns, broad shoulders and small claws,
3/4 view facing left, whole body visible, centered, soft faint purple rim light around the edges,
large empty center on the chest area, plain pure white background, no text, no question mark. --ar 1:1
```
Ghi chú: một bóng dùng chung cho cả 3 boss là đủ; muốn mỗi boss khác dáng thì code có thể làm đen emoji hiện tại (`filter: brightness(0)`) thay cho ảnh này.

**E8 — Ảnh màn thử (tuỳ chọn, chỉ để xem cảm giác)** — đính kèm `asset_contact_sheet.jpg` + `bg_sanh.png`:
```
Finished mobile game world map screen in the art style of the attached images, landscape 844x390.
Turquoise ocean background, five small fantasy islands arranged in a zigzag from left to right connected by a dotted sea route:
green forest island, volcano island, red mesa island, silver crystal island, coral seashell palace island.
The last two islands are covered by gray clouds with a gold lock icon. A golden map pin floats above the second island.
Small cream-and-gold name plaques under each island. Top bar: back button on the left, gold title banner in the center,
dark purple info chip on the right. Leave all labels blank (no text). --ar 13:6
```

---

## F. Kiểm trước khi gửi
- [ ] Toạ độ khớp mục C (lệch ≤ 4 pt); khung 844×390; bảng tên không chồng đảo khác.
- [ ] 5 đảo **cùng góc nhìn, cùng cỡ, cùng viền nước** — đặt cạnh nhau như một bộ.
- [ ] Mỗi đảo nhận ra hệ ngay ở cỡ 150×120, kể cả khi chuyển đen trắng (khác hình khối: cây · núi lửa · mesa · tinh thể · vỏ sò).
- [ ] `bg_sea_map` không có đảo/vật lớn ở giữa; đủ rộng 1864×860.
- [ ] Đảo khoá vẫn thấy lờ mờ hình dạng dưới `fog_lock` (để người chơi tò mò).
- [ ] Không có chữ trong asset; chữ gõ ở Figma (tiếng Việt có dấu, ≥ 12 pt).
- [ ] Asset rời, nền trắng tinh hoặc trong suốt, cách nhau ≥ 20 px nếu gộp một ảnh. Tên file theo cột "Asset" mục D.

---

## G. Ghi chú cho phần code (sau khi có asset)
- `data/bosses.js` thêm `ISLANDS = [{ id:'moc', n:'Đảo Rừng Ngàn', el:'moc', bosses:[...] }, …]`; 3 boss hiện có (Kim/Mộc/Thủy) chuyển vào đảo cùng hệ, các đảo còn lại cần thêm boss (5 × 3 = 15).
- Tiến độ lưu theo đảo (`save.cleared` → `save.islands[id]`), di trú: boss cũ đã hạ → tính cho đảo tương ứng.
- Trang Chọn boss nhận `islandId`, tiêu đề đổi thành tên đảo; nút ← quay về Chọn đảo.
- PLAN-V2 dự định thay Chọn boss bằng Bản đồ chương — 5 đảo này chính là 5 "chương", nên khớp hướng đó.

---

## H. Đã làm (2026-11-05)
- Bộ asset gốc: `design/source/map-ui-kit.png` (nền đen) → cắt bằng `node design/tools/extract.mjs map.html assets/map-ui` (toạ độ cắt trong `design/tools/map.html`).
- Tên thực tế: `title_island`, `chip_progress`, `plaque_<hệ>` (huy hiệu hệ vẽ sẵn), `plaque_plain`, `icon_lock_gold`, `route_on/off`, `fx_portal_gold/blue` (blue chưa dùng), `boss_unknown` (dấu "?" vẽ sẵn).
- Màn `islands` trong `ui/app.js`; dữ liệu đảo `ISLANDS` trong `data/bosses.js`. Thứ tự đảo tạm theo boss hiện có: Kim → Mộc → Thủy → Hỏa → Thổ (Hỏa, Thổ "Sắp ra mắt").
