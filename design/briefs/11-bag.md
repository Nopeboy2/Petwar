# Brief — Màn 11 Túi đồ (tài nguyên)

Gửi cho AI: file này + ảnh tham chiếu phong cách **`design/source/upgrade-ui-kit/contact_sheet_assets.jpg`** (bộ gần nhất: đá, ô theo cấp) và **`design/source/pet-ui-kit/asset_contact_sheet.jpg`** (khung vàng · kem · tím).
Phong cách theo **UI-SPEC mục 0**. Đây là **"màn danh sách"**: nền `bg_pet` làm mờ 5px, tối 80%.

---

## A. Màn này làm gì

**Túi đồ thay hộp thoại "Túi đá".** Đây là một trang riêng, gom **mọi tài nguyên** người chơi có:

| Nhóm (tab) | Có bây giờ | Thêm sau này (đã chừa chỗ) |
|---|---|---|
| Tiền tệ | 🪙 Vàng · 💎 Kim cương | Vé đấu / năng lượng |
| Đá nâng cấp | 15 loại: 5 hệ × cấp I/II/III | — |
| Vật phẩm | — | Mảnh pet, chìa khoá, sách kỹ năng… |
| Rương | — | Rương gỗ / bạc / vàng |

Người chơi vào đây để:
1. **Xem mình có gì, bao nhiêu.**
2. **Biết món đó dùng làm gì và lấy ở đâu** ("Nguồn: thắng boss hệ Kim").
3. **Dùng ngay:** đá thì Hợp nhất / Chuyển hệ (chuyển từ hộp thoại Túi đá cũ sang), rương thì Mở, vật phẩm thì Dùng.

**Lối vào:**
- **Sảnh:** nút "Túi đồ" (`icon_bag` có sẵn) ở hàng nút dưới, cạnh Pet và Đội hình.
- **Hộp thoại Nâng cấp:** nút "Túi đá" đổi thành "Túi đồ". Nút này mở thẳng **tab Đá, chọn sẵn đá hệ của pet**, và ← quay lại hộp thoại Nâng cấp.

**Quy tắc mở rộng:** mọi tài nguyên là **một dòng dữ liệu** (mục G). Thêm tài nguyên mới = thêm 1 dòng + 1 icon 192 px, không phải sửa giao diện.

---

## B. Các bước

| Bước | Việc |
|---|---|
| 1 | Đọc mục C (bố cục), D (trạng thái), E (danh sách asset) |
| 2 | Tạo asset **mới** bằng lệnh mục F. Cách nhanh: **ảnh gộp F0** trên nền đen |
| 3 | Tái sử dụng asset có sẵn (mục E cột "Có sẵn") — không vẽ lại |
| 4 | (Tuỳ chọn) ảnh màn thử F9 |
| 5 | Gửi ảnh gộp / thư mục PNG cho mình cắt và nhập vào game |

---

## C. Bố cục (844×390, toạ độ theo khung tai thỏ, an toàn trái/phải 48 · trên 8 · dưới 20)

### C1. Khung chung
| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền | 0 | 0 | 844 | 390 | `bg_pet` mờ 5px, tối 80% |
| Nút ← | 60 | 8 | 44 | 40 | `btn_back` → màn trước (Sảnh hoặc hộp thoại Nâng cấp) |
| Tiêu đề | 292 | 8 | 260 | 40 | `title_pet` + "TÚI ĐỒ" |
| Chip Vàng | 560 | 12 | 112 | 32 | `chip_coin` (assets/ui) + số 14pt, rút gọn khi lớn: 99.999 → "99,9K" |
| Chip Kim cương | 680 | 12 | 104 | 32 | `chip_gem` (assets/ui) + số 14pt |

### C2. Cột tab (trái)
| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Tab ×5 | 60 | 56 + 50·k | 116 | 44 | `tab_bag` / `tab_bag_active` · icon tab 26 bên trái · chữ 13pt. Thứ tự: **Tất cả · Đá · Vật phẩm · Rương** (đã bỏ tab Tiền tệ — Vàng/Kim cương nằm trong Tất cả). Bản code: tab 150×56, lưới co giãn hiện 4 hàng + cuộn, sát lề 12 |
| · Chấm mới | +100 | +2 | 14 | 14 | `dot_notify` (có sẵn) khi tab có đồ mới nhận chưa xem |
| · Tab trống | | | | | Tab chưa có món nào: mờ 50%, vẫn bấm được (hiện trạng thái trống) |

### C3. Lưới đồ (giữa)
| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Khung lưới | 184 | 56 | 380 | 314 | `panel_detail_back` 9-slice (có sẵn) |
| **Ô đồ 5×3** | 192 + 74·c | 64 + 74·r | 68 | 68 | Khung theo **độ hiếm** `slot_item_<1..4>` · icon đồ 52 ở giữa · nhãn số lượng tối giữa đáy 11pt (giống Túi đá hiện tại) |
| · Ô đang chọn | | | | | `slot_stone_sel` (có sẵn) đè lên, viền vàng phát sáng |
| · Ô trống | | | | | `slot_item_empty` (lòng tối, viền mảnh) lấp đủ 15 ô để lưới không bị hở |
| · Tem "MỚI" | +40 | -4 | 32 | 16 | `tag_new` khi món vừa nhận, mất khi đã chọn xem |
| Dòng trang | 192 | 296 | 364 | 32 | `btn_back` nhỏ ◀ · "1/2" 13pt · ▶ (như trang Pet). Ẩn nếu chỉ 1 trang |
| Dòng sắp xếp | 192 | 334 | 364 | 26 | Chữ 11pt: "Sắp xếp: Loại · Độ hiếm · Số lượng" (chạm để đổi) |

### C4. Khung chi tiết (phải)
| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Khung | 572 | 56 | 212 | 314 | `panel_item_detail` (mới): như `panel_detail_back` nhưng có **dải đầu** màu theo độ hiếm, cao 112 |
| Icon lớn | 630 | 64 | 96 | 96 | `slot_item_<độ hiếm>` 96 + icon 76 + quầng sáng `fx_rarity` phía sau (Sử thi trở lên) |
| Tên | 580 | 166 | 196 | 22 | 16pt nâu, giữa |
| Tag độ hiếm | 640 | 190 | 76 | 20 | Viên thuốc màu theo độ hiếm + chữ 11pt trắng (CSS, không cần ảnh) |
| Số lượng | 580 | 214 | 196 | 18 | "Có: 9.999" 13pt |
| Mô tả | 584 | 236 | 188 | 48 | 12pt, tối đa 3 dòng |
| Nguồn | 584 | 286 | 188 | 18 | `icon_source` 16 + "Thắng boss hệ Kim" 11pt |
| **Nút thao tác** | 580 / 678 | 314 | 96 | 44 | Tối đa 2 nút: `btn_secondary` (phụ) + `btn_primary` (chính). Một nút thì rộng 196 |

**Nút thao tác theo loại:**
| Loại | Nút |
|---|---|
| Vàng, Kim cương | 1 nút "Nâng cấp pet" → trang Pet (gợi ý chỗ dùng) |
| Đá | `icon_merge` "3 → 1 II" · `icon_convert` "→ Thổ 10🪙" (luật cũ của Túi đá) |
| Rương (sau) | "Mở" · "Mở ×10" |
| Vật phẩm (sau) | "Dùng" |

### C5. Tab Đá — dạng bảng (thay cho lưới khi ở tab Đá)
Đá có cấu trúc 5 hệ × 3 cấp nên hiện **bảng** như Túi đá hiện tại, đặt trong khung lưới:
| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Đầu cột | 235 + 70·c | 66 | 22 | 22 | `icon_el_*` theo vòng Sinh Mộc·Hỏa·Thổ·Kim·Thủy + `arrow_sinh` giữa các cột |
| Nhãn hàng | 194 | 92 + 70·r | 18 | 64 | "I" "II" "III" |
| Ô đá | 214 + 70·c | 92 + 70·r | 64 | 64 | `slot_stone_<cấp>` + đá 40 + nhãn số |
| Gợi ý | 192 | 312 | 364 | 18 | "Đá rơi khi thắng boss cùng hệ · Chuyển hệ theo mũi tên vòng Sinh" |

---

## D. Trạng thái (cần thiết kế đủ)
| Trạng thái | Hiển thị |
|---|---|
| Có đồ, đã chọn 1 món | Như mục C, khung chi tiết đầy đủ |
| Tab trống | Lưới 15 ô trống + hình `empty_bag` 160×120 giữa lưới + chữ "Chưa có vật phẩm · Thắng boss để nhận" |
| Chưa chọn món nào | Khung chi tiết hiện `empty_bag` nhỏ + "Chạm một món để xem" |
| Món số lượng 0 (đá) | Ô vẫn hiện, icon xám mờ 35%, nhãn "0" |
| Thao tác thành công | Số nhảy, `fx_stat_up` (có sẵn) bay lên trên ô đích |
| Không đủ để thao tác | Nút xám + dòng lý do đỏ dưới nút ("Cần 3 đá", "Thiếu 10 vàng") |

---

## E. Danh sách asset

Hiển thị = kích thước trong khung 844×390. **Xuất ×3** (icon đồ ×~2.5 cho đủ nét ở ô 96).

| Asset | Có sẵn? | Hiển thị → Xuất | Ghi chú |
|---|---|---|---|
| `bg_pet`, `title_pet`, `btn_back`, `btn_primary`, `btn_secondary`, `panel_detail_back`, `dot_notify`, `icon_el_*` | ✅ | | `assets/pet-ui/` |
| `chip_coin`, `chip_gem`, `icon_bag` | ✅ | | `assets/ui/` |
| `slot_stone_1/2/3`, `slot_stone_sel`, 15 `stone_*`, `icon_merge`, `icon_convert`, `arrow_sinh`, `fx_stat_up` | ✅ | | `assets/upgrade-ui/`. **slot_stone_1/2/3 dùng luôn làm khung độ hiếm 1–3** |
| **Tab** `tab_bag` · `tab_bag_active` | ❌ mới | 116×44 → **348×132** | Thường: nền tím đậm mờ, viền vàng xỉn. Đang chọn: nền kem sáng, viền vàng bóng, mép phải nhô ra nối vào khung lưới |
| **Icon tab ×5** `icon_tab_all` · `icon_tab_currency` · `icon_tab_stone` · `icon_tab_item` · `icon_tab_chest` | ❌ mới | 26×26 → **96×96** | Túi · chồng xu · viên đá · bình thuốc · rương nhỏ |
| **Khung huyền thoại** `slot_item_4` | ❌ mới | 68×68 → **192×192** | Cùng dáng `slot_stone_1/2/3`, viền **vàng cam rực + tia sáng**, lòng đỏ cam tối |
| **Ô trống** `slot_item_empty` | ❌ mới | 68×68 → **192×192** | Cùng dáng, viền nâu xám mảnh, lòng tối mờ, không trang trí |
| **Khung chi tiết** `panel_item_detail` | ❌ mới | 212×314 → **636×942** | 9-slice dọc: viền vàng, lòng kem; **dải đầu cao 112 (xuất 336) để trống, màu trung tính** (tô màu độ hiếm bằng CSS) |
| **Quầng độ hiếm** `fx_rarity` | ❌ mới | 120×120 → **360×360** | Tia sáng xoay + lấp lánh, **nền đen** (screen), tô màu bằng CSS hue |
| **Icon Vàng** `item_gold` | ❌ mới | 52–96 → **192×192** | Đống xu vàng có dấu chân pet |
| **Icon Kim cương** `item_gem` | ❌ mới | 52–96 → **192×192** | Cụm kim cương xanh lam |
| **Tem mới** `tag_new` | ❌ mới | 32×16 → **96×48** | Dải ruy băng đỏ nhỏ, lòng trống (chữ "MỚI" bằng code) |
| **Icon nguồn** `icon_source` | ❌ mới | 16×16 → **64×64** | Ghim bản đồ nhỏ vàng |
| **Túi rỗng** `empty_bag` | ❌ mới | 160×120 → **480×360** | Túi da mở miệng, trống, một chú bướm/đom đóm bay ra — dễ thương |
| *(sau này)* `item_chest_1/2/3` · `item_shard` · `item_ticket` · `item_key` | ⏳ tuỳ chọn | **192×192** | Tạo sẵn để thấy cả bộ; chưa dùng cho đến khi có tính năng |

**Độ hiếm (dùng chung cho mọi tài nguyên):**
| Độ hiếm | Khung ô | Màu tag / dải đầu | Ví dụ |
|---|---|---|---|
| 1 Thường | `slot_stone_1` nâu đồng | `#8a6a4a` | Đá I, Vàng |
| 2 Hiếm | `slot_stone_2` xanh bạc | `#3a7bd5` | Đá II, Kim cương |
| 3 Sử thi | `slot_stone_3` tím | `#9b4dca` | Đá III |
| 4 Huyền thoại | `slot_item_4` vàng cam | `#e8891a` | Rương vàng (sau) |

---

## F. Câu lệnh tạo asset

Mọi lệnh: **đính kèm 2 ảnh tham chiếu** (đầu file) và mở đầu bằng:
```
Use the attached images as the exact UI art style reference: same glossy gold rims, cream parchment fills,
deep purple accents, thick dark-brown outlines, soft cel shading, cute fantasy adventure mobile game.
No text, no letters, no numbers, no watermark.
```

**F0 — Ảnh gộp cả bộ** (nền đen, các món cách nhau ≥ 30 px)
```
Mobile game UI asset sheet for an inventory bag screen, all items clearly separated on a pure solid black background, front view:
1) a vertical tab button, aspect 8:3, dim deep-purple fill with a muted gold rim;
2) the same tab in active state: bright cream fill, glossy gold rim, the right edge slightly extended;
3) five small round icons in a row: a leather bag, a stack of gold coins, a faceted gemstone, a potion bottle, a small treasure chest;
4) a rounded-square item slot frame with an ornate bright orange-gold rim, light rays and a dark red-orange inner area (legendary);
5) the same slot shape with a thin plain gray-brown rim and a dark empty inner area (empty slot);
6) a tall vertical panel, aspect 2:3, gold rim, cream parchment body, with an empty neutral header band across the top third, plain edges for 9-slice;
7) a radiant rotating light-ray burst with sparkles (glow effect);
8) a pile of shiny gold coins with a paw print emblem; 9) a cluster of sparkling blue diamonds;
10) a small red ribbon tag with empty center; 11) a small golden map pin icon;
12) an open empty leather bag with a tiny firefly flying out, cute. --ar 16:9
```

**F1 — Tab** `tab_bag` + `tab_bag_active`
```
Mobile game UI: two vertical-menu tab buttons stacked, same size, aspect ratio 8:3, rounded corners:
1) normal: dim deep-purple fill, muted gold rim, slightly transparent look;
2) active: bright cream parchment fill, glossy gold rim, soft golden glow, the right edge extends a little as if connected to a panel.
Empty center for an icon and text. On a pure solid black background. --ar 4:3
```

**F2 — Icon tab** (×5)
```
Mobile game icon set, five icons in a row, same size, bold simple shapes readable at 26 pixels, thick dark-brown outline:
1) a brown leather bag tied with a string (all items), 2) a short stack of gold coins (currency),
3) a single faceted gemstone in purple (upgrade stones), 4) a round potion bottle with pink liquid (items),
5) a small wooden treasure chest with gold trim (chests). On a pure solid black background. --ar 5:1
```

**F3 — Khung huyền thoại + ô trống** `slot_item_4` + `slot_item_empty`
Đính kèm thêm `slot_stone_1/2/3` để giữ **đúng dáng và kích thước**.
```
Mobile game UI: two rounded-square item slot frames, exactly the same shape and size as the attached slot frames:
1) legendary: ornate bright orange-gold rim with small gem studs on the corners, subtle light rays, dark red-orange inner area;
2) empty: thin plain gray-brown rim, dark translucent inner area, no decoration.
Empty center. On a pure solid black background. --ar 2:1
```

**F4 — Khung chi tiết** `panel_item_detail`
```
Mobile game UI: a tall vertical information panel, aspect ratio 2:3, thick glossy gold rim with rounded corners,
cream parchment body, a separate empty header band across the top third with a thin gold divider below it,
header band in a neutral light gray (it will be recolored in code), plain straight edges for 9-slice stretching.
On a pure solid black background. --ar 2:3
```

**F5 — Quầng độ hiếm** `fx_rarity`
```
Mobile game VFX: a soft radiant burst of white-gold light rays from the center with small sparkles and a gentle glow ring,
centered, on a pure solid black background. --ar 1:1
```

**F6 — Icon tiền tệ** `item_gold` + `item_gem` (cùng dáng với 15 viên đá đã có)
```
Mobile game item icons, two icons side by side, same size, same style as the attached gemstones, readable at 52 pixels:
1) a generous pile of shiny gold coins, the top coin shows a paw print emblem;
2) a cluster of three sparkling sapphire-blue diamonds with white highlights.
On a pure solid black background. --ar 2:1
```

**F7 — Tem mới · icon nguồn · túi rỗng** `tag_new` · `icon_source` · `empty_bag`
```
Mobile game UI, three items in a row on a pure solid black background:
1) a small red ribbon tag with folded ends and an empty center;
2) a small golden map pin icon, readable at 16 pixels;
3) an open empty brown leather bag lying down, nothing inside, a tiny glowing firefly flying out, cute and a little funny. --ar 3:1
```

**F8 — (Tuỳ chọn) Tài nguyên sau này** `item_chest_1/2/3` · `item_shard` · `item_ticket` · `item_key`
```
Mobile game item icons, six icons in a row, same size, same style as the attached gemstones, readable at 52 pixels:
1) a small wooden treasure chest, 2) a silver-trimmed treasure chest, 3) an ornate golden treasure chest glowing,
4) a glowing crystal shard with a paw print inside (pet shard), 5) a purple battle ticket with a gold border,
6) an ornate golden key. On a pure solid black background. --ar 6:1
```

**F9 — Ảnh màn thử (tuỳ chọn, chỉ để xem cảm giác)**
```
Finished mobile game inventory screen in the art style of the attached images, landscape 844x390.
Blurred forest camp background. Top bar: back button left, purple winged title ribbon center, gold coin chip and blue gem chip right.
Left: five stacked vertical tabs with small icons, the second tab highlighted.
Center: a cream-and-gold panel with a 5x3 grid of rounded item slots (bronze, blue, purple, orange-gold frames) holding gemstones, coins and diamonds, small dark count labels under each.
Right: a tall detail panel with a big gemstone icon in a glowing frame on top, blank text lines, and two buttons at the bottom.
Leave all labels blank (no text). --ar 13:6
```

---

## G. Ghi chú cho phần code (sau khi có asset)
- **Bảng tài nguyên** `data/items.js`: mỗi món một dòng
  `{ id, n, cat: 'currency'|'stone'|'item'|'chest', rar: 1–4, icon, desc, src, acts }`.
  15 đá sinh tự động từ 5 hệ × 3 cấp.
- **Số lượng** đọc qua một hàm `count(id)`: vàng → `save.gold`, kim cương → `save.gem` (mới, mặc định 0), đá → `save.stones[hệ][cấp]`, món khác → `save.items[id]`. **Không cần đổi cấu trúc save hiện tại.**
- **Hộp thoại Túi đá (09c) bỏ đi**. Hợp nhất / Chuyển hệ chuyển sang khung chi tiết của Túi đồ, dùng lại đúng luật trong `CFG.up`.
- **Tem "MỚI"**: lưu `save.seen[id]` = số lượng lúc xem gần nhất; khác số hiện tại thì hiện tem.
- **Kim cương** chưa có nguồn: tạm hiện 0 và mô tả "Sắp có: cửa hàng". Đây là chỗ cần thiết kế tiếp (cửa hàng / nhiệm vụ).

---

## H. Kiểm trước khi gửi
- [ ] Phong cách khớp bộ tham chiếu (vàng · kem · tím, viền nâu đậm).
- [ ] `slot_item_4`, `slot_item_empty` **cùng dáng, cùng cỡ** `slot_stone_1/2/3` (đặt cạnh nhau so).
- [ ] `panel_item_detail`: cạnh **trơn** để kéo giãn; dải đầu màu trung tính (code tô màu).
- [ ] Icon tab đọc được ở 26 px; `icon_source` đọc được ở 16 px.
- [ ] `item_gold`, `item_gem` cùng phong cách, cùng độ lớn khối với 15 viên đá.
- [ ] Hiệu ứng `fx_rarity` trên **nền đen tuyền**; asset khác nền đen hoặc trong suốt.
- [ ] Không có chữ / số trong asset. Đặt tên file theo cột "Asset" mục E.
