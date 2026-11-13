# Brief — Màn 05 Đội hình

Gửi cho AI: file này + `05-team-wireframe.png` + ảnh tham chiếu phong cách **`design/source/pet-ui-kit/asset_contact_sheet.jpg`** (bộ trang Pet đã chốt).
Phong cách theo **UI-SPEC mục 0** — màn này là "màn danh sách": nền `bg_pet` làm mờ 5px, tối 80%.

---

## A. Màn này làm gì

Người chơi xếp **3 pet theo thứ tự cột (trên → dưới)** trước khi đánh một boss. Thứ tự quan trọng vì:
- **Aggro:** boss nhắm pet theo tỉ lệ (Tanker 200 · Hỗ trợ 100 · Sát thương 75).
- **Đòn lan 💥:** trúng pet bị nhắm + pet kề trên/dưới → ô giữa dễ trúng nhất.
- **Ngũ hành – khắc:** pet khắc hệ boss gây ×1.5, nhận ×0.75; bị khắc thì gây ×0.75, nhận ×1.3.
- **Ngũ hành – sinh:** pet đứng **cạnh** pet sinh ra hệ của mình được +15% ATK (Mộc→Hỏa→Thổ→Kim→Thủy→Mộc).

Màn phải cho thấy các con số này **ngay khi xếp**, để người chơi tự thử thứ tự.

---

## B. Các bước

| Bước | Việc |
|---|---|
| 1 | Đọc mục C (bố cục) và D (danh sách asset) |
| 2 | Tạo asset **mới** bằng lệnh mục E (đính kèm `asset_contact_sheet.jpg` mỗi lệnh) |
| 3 | Tái sử dụng asset đã có (mục D, cột "Có sẵn") — không vẽ lại |
| 4 | (Tuỳ chọn) ảnh màn thử bằng lệnh E7 |
| 5 | Ghép Figma theo toạ độ mục C, gõ chữ trong Figma → kiểm mục F → gửi mình |

---

## C. Bố cục (844×390, toạ độ theo khung tai thỏ — wireframe `05-team.svg`)

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền | 0 | 0 | 844 | 390 | `bg_pet` mờ 5px, tối 80% |
| Nút ← | 60 | 8 | 44 | 40 | `btn_back` → Chọn boss |
| Tiêu đề | 292 | 8 | 260 | 40 | `title_pet` + "ĐỘI HÌNH" |
| **Chip boss** | 616 | 8 | 168 | 40 | Chân dung boss tròn 32 · tên boss 13pt · huy hiệu hệ boss 24 |
| **Ô đội ×3** | 60 | 56 + 92·k | 300 | 84 | Xếp dọc = thứ tự cột trong trận. Khung ô (asset mới) |
| · Số ô | +6 | +6 | 26 | 26 | Khiên số 1/2/3 (`badge_team_1/2/3` có sẵn) đè góc chân dung |
| · Chân dung | +10 | +10 | 64 | 64 | `pet_<id>_portrait` trong khung tròn/vuông bo |
| · Tên + icon | +82 | +8 | 150 | 20 | Tên 15pt · huy hiệu vai 18 · huy hiệu hệ 18 |
| · Tag khắc | +238 | +6 | 56 | 22 | ▲ xanh "Khắc" / ▼ đỏ "Bị khắc" (ẩn nếu trung tính) |
| · Dòng aggro | +82 | +34 | 210 | 18 | 🎯 % bị nhắm · 💥 % trúng đòn lan (icon asset mới) 13pt |
| · Dòng hệ số | +82 | +56 | 210 | 20 | "Gây ×1.5 · Nhận ×0.75" 12pt; xanh nếu lợi, đỏ nếu bất lợi |
| **Nối "sinh"** | 196 | 138 / 230 | 28 | 14 | Mầm 🌱 vàng giữa 2 ô kề nhau khi có quan hệ sinh (asset mới); mũi tên chỉ hướng pet được +15% |
| Ô trống | | | 300 | 84 | Khung mờ, dấu "+" lớn, chữ "Chọn pet" |
| **Thanh lọc** | 376 | 56 | 408 | 34 | Giống trang Pet: kính mờ, Hệ ●●●●●● · Vai ●●●● |
| **Kho pet ×5** | 376 + 83·i | 98 | 76 | 104 | Thẻ nhỏ `card_pet` thu nhỏ: chân dung + tên 12pt. Đã ở đội → `card_pet_selected` + số ô; ▲/▼ góc phải trên theo boss |
| **Khung khắc chế** | 376 | 212 | 408 | 110 | `panel_detail_back` 9-slice: "Boss hệ ◉Kim · Khắc bởi ◉Hỏa" · 1 dòng gợi ý (VD "Đặt Tanker ở giữa để đỡ đòn lan") |
| Nút Gợi ý đội | 376 | 334 | 120 | 40 | `btn_secondary` + `icon_auto_team` — **đã chạy**: xếp đội có tỉ lệ thắng mô phỏng cao nhất (`data/suggest.js`); khi đang dùng đội gợi ý, khung khắc chế hiện "✨ Đội gợi ý · thắng ~X%" |
| **Nút ĐÁNH!** | 604 | 334 | 180 | 40 | `btn_primary` + icon kiếm; mờ khi chưa đủ 3 pet |

**Tương tác (để thiết kế trạng thái):**
- Chạm thẻ kho → thêm vào ô trống đầu tiên (hoặc thay ô đang chọn).
- Chạm ô đội → ô sáng viền vàng (đang chọn); chạm ô khác → **đổi chỗ** 2 ô; chạm lại → bỏ pet khỏi đội.
- Mọi số (🎯, 💥, hệ số, nối sinh, ▲▼) cập nhật ngay khi đổi.

---

## D. Danh sách asset

| Asset | Có sẵn? | Ghi chú |
|---|---|---|
| `bg_pet`, `title_pet`, `btn_back`, `btn_primary`, `btn_secondary` | ✅ | `assets/pet-ui/` |
| `card_pet`, `card_pet_selected`, `badge_team_1/2/3` | ✅ | Thẻ kho dùng thu nhỏ |
| `icon_el_*`, `icon_role_*_round`, `panel_detail_back` | ✅ | |
| Chân dung pet `pet_<id>_portrait` | ✅ | `assets/pets/` |
| **Khung ô đội** `slot_team` · `slot_team_active` · `slot_team_empty` | ❌ mới | Ngang 300×84 (xuất 600×168) |
| **Khung chân dung** `frame_portrait` | ❌ mới | 64×64 (xuất 128) |
| **Icon** `icon_aggro_target` (🎯), `icon_blast` (💥) | ❌ mới | 18×18 (xuất 64) |
| **Tag** `tag_adv` (▲ xanh) · `tag_dis` (▼ đỏ) | ❌ mới | 56×22 (xuất 112×44) |
| **Nối sinh** `link_sinh` | ❌ mới | 28×14 (xuất 84×42), mầm + mũi tên xuống, có bản lật mũi tên lên |
| **Chip boss** `chip_boss` | ❌ mới | 168×40 (xuất 336×80), có ô tròn trái cho chân dung |
| **Icon nút** `icon_auto_team` | ❌ mới | 24×24 (xuất 72) — đũa phép / ngôi sao |

---

## E. Câu lệnh tạo asset

Mọi lệnh: **đính kèm `asset_contact_sheet.jpg`** + mở đầu bằng:
```
Use the attached image as the exact UI art style reference: same glossy gold rims, cream parchment fills,
deep purple accents, thick dark-brown outlines, soft cel shading, cute fantasy adventure mobile game.
Plain pure white background, no text, no letters, no numbers.
```

**E1 — Khung ô đội (3 trạng thái)**
```
Mobile game UI: three wide horizontal team slot frames stacked vertically, each the same size, aspect ratio 25:7,
rounded corners, gold rim, cream parchment inner area, a round empty socket on the left side for a portrait.
1) normal, 2) active: brighter glowing gold rim with soft yellow outer glow,
3) empty: faded translucent frame with dashed gold border and a big soft plus sign in the center. --ar 3:4
```

**E2 — Khung chân dung**
```
Mobile game UI: a single round portrait frame with thick gold rim and a small purple gem at the bottom,
empty transparent center, front view. --ar 1:1
```

**E3 — Icon aggro, đòn lan, gợi ý đội**
```
Mobile game icon set, three icons in one row, same size, bold simple shapes readable at 18 pixels:
1) a red and white archery target with an arrow (being targeted),
2) an orange explosion burst with small debris (splash damage),
3) a golden magic wand with sparkles (auto arrange team). --ar 3:1
```

**E4 — Tag khắc / bị khắc**
```
Mobile game UI: two small pill-shaped tags side by side, same size, aspect ratio 5:2, gold rim:
1) green tag with a bold upward triangle arrow on the left (advantage),
2) red tag with a bold downward triangle arrow on the left (disadvantage). Empty space on the right for text. --ar 4:1
```

**E5 — Nối "sinh"**
```
Mobile game UI: a small connector badge, a golden sprouting seedling with two leaves on a tiny rounded gold plate,
with a small downward arrow under it, glowing softly, front view. --ar 2:1
```

**E6 — Chip boss**
```
Mobile game UI: a horizontal pill-shaped info chip, aspect ratio 21:5, dark purple fill with gold rim,
a round empty socket with gold ring on the left end for a portrait, a small round socket on the right end for an element badge. --ar 4:1
```

**E7 — Ảnh màn thử (tuỳ chọn)** — đính kèm `05-team-wireframe.png` + `asset_contact_sheet.jpg`:
```
Redesign this wireframe as a finished mobile game team formation screen in the art style of the second image.
Keep every element at exactly the same position and size. Landscape 844x390, blurred forest camp background.
Left: three stacked team slots with chibi creature portraits. Right: filter bar, five small creature cards, an info panel,
two buttons at the bottom right. Leave all labels blank (no text).
```

---

## F. Kiểm trước khi gửi
- [ ] Toạ độ khớp mục C (lệch ≤ 4 pt); khung 844×390.
- [ ] Phong cách khớp `asset_contact_sheet.jpg` (vàng · kem · tím).
- [ ] Khung ô đội có đủ 3 trạng thái: thường · đang chọn · trống.
- [ ] Icon 🎯 💥 đọc được ở 18 px; tag ▲▼ phân biệt được cả khi chuyển đen trắng (khác hướng mũi tên).
- [ ] Không có chữ trong asset; chữ gõ ở Figma (tiếng Việt có dấu, ≥ 12 pt).
- [ ] Asset rời, nền trắng tinh hoặc trong suốt, cách nhau ≥ 20 px nếu gộp một ảnh. Tên file theo cột "Asset" mục D.
