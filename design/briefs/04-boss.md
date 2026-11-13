# Brief — Màn 04 Chọn boss (trong đảo)

Gửi cho AI: file này + ảnh tham chiếu phong cách **`design/source/pet-ui-kit/asset_contact_sheet.jpg`** (khung UI) và ảnh chụp màn **Đội hình** hiện tại (bộ `assets/team-ui` mới: khung kem viền vàng, thanh tím viền vàng).
Phong cách theo **UI-SPEC mục 0**. Nền làm mờ như màn Đội hình (`blur` 5px, tối 80%) để thẻ boss nổi lên.

---

## A. Màn này làm gì

Luồng: **Sảnh → Chọn đảo → Chọn boss (màn này) → Đội hình → Trận**.

Hiện tại màn này chỉ là một thẻ chữ trên nền tím trơn (emoji 🎯💥, sao ⭐ chữ). Màn mới phải trả lời 4 câu **trước khi** người chơi bấm vào:
1. **Đánh boss nào?** Boss nào đã mở, đã hạ, đang cần đánh (mỗi đảo tối đa 3 boss: dễ → khó).
2. **Boss mạnh cỡ nào?** Cấp, HP, ATK, kiểu đòn (🎯 đơn · 💥 lan · 🌊 toàn đội), số viên Xoắn để choáng.
3. **Nên mang pet gì?** Hệ boss + hệ **khắc** boss (đi đảo Kim thì mang pet Hỏa).
4. **Được gì?** Vàng, XP (lần đầu ×3 vàng, ×2 XP), sao đã đạt, và **thu phục pet boss khi đạt 3⭐**.

Dữ liệu có sẵn: `BOSSES` (n, img, el, hp, atk, stun, pat, gold, xp), `ISLANDS[i].bosses`, `save.cleared`, `save.stars[i]`, pet boss `cap` (thu phục khi 3⭐).

---

## B. Các bước

| Bước | Việc |
|---|---|
| 1 | Đọc mục C (bố cục) và D (danh sách asset) |
| 2 | Tạo asset **mới** bằng lệnh mục E (đính kèm ảnh tham chiếu mỗi lệnh) |
| 3 | Tái sử dụng asset đã có (mục D, cột "Có sẵn") — không vẽ lại |
| 4 | (Tuỳ chọn) ảnh màn thử bằng lệnh E9 |
| 5 | Ghép Figma theo toạ độ mục C, gõ chữ trong Figma → kiểm mục F → gửi mình |

---

## C. Bố cục (844×390, lề trái/phải 12 + safe-area, trên 8, dưới ≥ 20)

Chia 2 vùng giống màn Đội hình: **trái = danh sách boss**, **phải = chi tiết boss đang chọn + nút đi tiếp**.

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền | 0 | 0 | 844 | 390 | `assets/battle/bg_<hệ đảo>.webp` (có sẵn) — mờ 5px, tối 80%. Mỗi đảo tự đổi màu theo hệ |
| Nút ← | 12 | 8 | 56 | 40 | `team-ui/btn_back` → Chọn đảo |
| Tiêu đề | 272 | 8 | 300 | 41 | `team-ui/title_team` + **tên đảo** ("ĐẢO THIẾT NHAM") |
| Chip tiến độ | phải 12 | 8 | 150 | 40 | `map-ui/chip_progress` + `icon_star_on` + "4/9" (tổng sao đảo) |
| **Thẻ boss ×3** | 12 + 164·k | 58 | 152 | 260 | `card_boss` (mới). k = 0,1,2 theo độ khó. Đảo có < 3 boss → ô còn lại là thẻ "Sắp ra mắt" |
| **Bảng chi tiết** | 516 | 58 | 316 | 260 | `panel_boss_detail` (mới) — nội dung boss đang chọn |
| Nút đi tiếp | 516 | 326 | 316 | 44 | `team-ui/btn_fight` + "CHỌN ĐỘI" (chữ căn giữa nút, 17pt) |

**Bên trong thẻ boss (152×260):**

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Ruy băng độ khó | 26 | 6 | 100 | 24 | `tag_diff` (mới) + "DỄ" / "VỪA" / "KHÓ" — màu xanh / vàng / đỏ bằng CSS `hue-rotate` hoặc 3 file |
| Huy hiệu hệ | 8 | 8 | 28 | 28 | `pet-ui/icon_el_*` ở vòng tròn góc trái (giống thẻ pet) |
| Ảnh boss | 12 | 34 | 128 | 128 | `bosses/boss_*_idle.webp` đứng trên `pet-ui/pedestal.webp` |
| Thanh tên | 10 | 170 | 132 | 30 | Thanh tím dưới khung (vẽ sẵn trong `card_boss`) — tên 14pt trắng |
| Cấp | 10 | 204 | 132 | 20 | "Lv 6" 13pt nâu |
| Sao | 28 | 228 | 96 | 24 | 3 × `icon_star_on/off` (mới) 24px |

**Trạng thái thẻ:**

| Trạng thái | Hiển thị |
|---|---|
| Khoá | Ảnh `map-ui/boss_unknown` + `icon_lock_gold` 32 giữa; thanh tên "???"; dòng cấp "Hạ boss trước"; thẻ giảm bão hoà 60% |
| Đang cần đánh | Viền phát sáng vàng (CSS `drop-shadow`) + `map-ui/marker_current` nhún trên đầu thẻ |
| Đã hạ | Sao vàng theo `save.stars`; dấu `stamp_cleared` (mới) góc phải trên |
| Đang chọn | Phóng 1.04 + viền sáng mạnh; bảng chi tiết bên phải đổi theo |
| Sắp ra mắt | `card_boss` tối + bóng `boss_unknown` + chữ "Sắp ra mắt" |

**Bên trong bảng chi tiết (316×260)** — chữ trên nền kem, căn trái, lề 16:

| Dòng | y | Nội dung |
|---|---|---|
| Đầu bảng | 12 | Chân dung boss tròn 40 (`pet_<id>_portrait`, như chip boss màn Đội hình) · tên 18pt · "Lv 6" chip `pet-ui/chip_level` |
| Chỉ số | 64 | `pet-ui/icon_stat_hp` HP 8400 · `icon_stat_atk` ATK 696 (2 cột) |
| Kiểu đòn | 96 | "Đòn:" + chuỗi `icon_atk_single/blast/aoe` (mới) 24px nối bằng mũi tên nhỏ — thay emoji 🎯💥🌊; chạm giữ hiện tên đòn |
| Ngũ hành | 128 | `icon_el_<hệ boss>` "Kim" · "Khắc bởi" `icon_el_<hệ khắc>` "Hỏa" (chữ màu hệ) — gợi ý "Mang pet hệ Hỏa" |
| Choáng | 160 | `icon_spiral` (mới) "6 viên Xoắn để choáng" |
| Phần thưởng | 196 | `bag-ui/item_gold` "100" · `icon_xp` (mới) "40" · nhãn "Lần đầu ×3" nếu chưa hạ · ô pet thu phục: `pet_<id>_portrait` trong `frame_capture` (mới) + "3⭐ thu phục" (đã thu phục → dấu ✓) |

**Tương tác:** chạm thẻ mở → chọn (đổi bảng chi tiết). Chạm "CHỌN ĐỘI" → Đội hình (`team`, `arg='battle'`). Chạm thẻ khoá → rung nhẹ + toast "Hạ <boss trước> để mở". Mở màn: tự chọn boss **đang cần đánh** (hoặc boss cuối đã hạ nếu cả đảo đã xong).

---

## D. Danh sách asset

| Asset | Có sẵn? | Ghi chú |
|---|---|---|
| `btn_back`, `title_team`, `btn_fight` | ✅ | `assets/team-ui/` |
| `chip_progress`, `boss_unknown`, `icon_lock_gold`, `marker_current` | ✅ | `assets/map-ui/` |
| `icon_el_*`, `icon_stat_hp/atk`, `chip_level`, `pedestal` | ✅ | `assets/pet-ui/` |
| `item_gold` | ✅ | `assets/bag-ui/` |
| Nền theo đảo | ✅ | `assets/battle/bg_kim/moc/thuy/hoa/tho.webp` |
| Ảnh boss + chân dung | ✅ | `assets/bosses/boss_*_idle.webp`, `assets/pets/pet_*_portrait.webp` |
| **Khung thẻ boss** `card_boss` | ❌ mới | 152×260 → xuất 456×780. Cùng bộ với `card_team`: viền vàng, nền kem, vòng tròn góc trái cho huy hiệu hệ, thanh tím dưới cho tên |
| **Bảng chi tiết** `panel_boss_detail` | ❌ mới | 316×260 → xuất 948×780. Nền kem viền vàng, giống `slot_team` nhưng cao; 1 đường kẻ mảnh ngăn phần thưởng |
| **Ruy băng độ khó** `tag_diff` | ❌ mới | 100×24 → xuất 300×72, ruy băng nền trắng xám để CSS tô màu (hoặc 3 file `tag_diff_de/vua/kho`) |
| **Sao** `icon_star_on`, `icon_star_off` | ❌ mới | 24 → xuất 96. Sao vàng bóng / sao rỗng xám nâu |
| **Dấu đã hạ** `stamp_cleared` | ❌ mới | 44×44 → xuất 132. Con dấu tròn vàng có dấu ✓ |
| **Icon kiểu đòn** `icon_atk_single/blast/aoe` | ❌ mới | 24 → xuất 96. Tâm ngắm đỏ · vụ nổ cam · sóng xanh — cùng viền vàng tròn như `icon_el_*` |
| **Icon Xoắn** `icon_spiral` | ❌ mới | 24 → xuất 96. Viên ngọc xoắn tím (giống viên Xoắn trên bàn cờ trận) |
| **Icon XP** `icon_xp` | ❌ mới | 24 → xuất 96. Viên ngọc xanh lá có ngôi sao trắng nhỏ bên trong (không chữ "XP") |
| **Khung pet thu phục** `frame_capture` | ❌ mới | 48 → xuất 144. Khung tròn vàng có ruy băng nhỏ + dấu móng 🐾 |

---

## E. Câu lệnh tạo asset

Mọi lệnh: **đính kèm `asset_contact_sheet.jpg` + ảnh chụp màn Đội hình** + mở đầu bằng:
```
Use the attached images as the exact UI art style reference: same glossy gold rims, cream parchment fills,
deep purple accents, thick dark-brown outlines, soft cel shading, cute fantasy adventure mobile game.
Plain pure white background, no text, no letters, no numbers.
```

**E1 — Khung thẻ boss** `card_boss`
```
Mobile game UI: an empty vertical boss card frame, aspect ratio 152:260, glossy gold rim with dark-brown outline,
cream parchment inner area, a round gold socket on the top-left corner for an element badge,
a glossy purple name bar across the bottom inside the frame, small gold corner flourishes, front view. --ar 3:5
```

**E2 — Bảng chi tiết** `panel_boss_detail`
```
Mobile game UI: an empty large info panel, aspect ratio 316:260, cream parchment fill with glossy gold rim and dark-brown outer outline,
rounded corners, one thin faded gold divider line at about 75% height, subtle paper texture, front view. --ar 6:5
```

**E3 — Ruy băng độ khó** `tag_diff`
```
Mobile game UI: a small horizontal ribbon banner with folded ends, light gray-white fill (to be tinted later),
glossy gold edge and dark-brown outline, empty center for text, front view. --ar 4:1
```

**E4 — Sao** `icon_star_on` + `icon_star_off` (một ảnh, 2 sao cạnh nhau, cách ≥ 20px)
```
Mobile game icons, two stars side by side: left a glossy bright gold five-point star with soft highlight;
right the same star shape but empty, dull gray-brown, slightly transparent look. Thick dark-brown outline. --ar 2:1
```

**E5 — Dấu đã hạ** `stamp_cleared`
```
Mobile game UI: a round gold seal stamp with a bold check mark in the center and a small laurel ring,
slightly tilted, glossy, thick dark-brown outline. --ar 1:1
```

**E6 — Icon kiểu đòn** (một ảnh, 3 icon cách ≥ 20px)
```
Three round mobile game badge icons with glossy gold rims, side by side:
1) red target crosshair (single target attack), 2) orange burst explosion (splash attack), 3) blue wave (attack all).
Bold simple shapes readable at 24 pixels, thick dark-brown outline. --ar 3:1
```

**E7 — Icon Xoắn, XP** (một ảnh, 2 icon)
```
Two round mobile game icons with glossy gold rims, side by side:
1) a glowing purple spiral swirl gem, 2) a green orb with a small white star inside (experience points).
Bold simple shapes readable at 24 pixels, thick dark-brown outline. --ar 2:1
```

**E8 — Khung pet thu phục** `frame_capture`
```
Mobile game UI: an empty round portrait frame with glossy gold rim, a small purple ribbon at the bottom with a gold paw print,
cream inner circle left empty for a creature portrait, thick dark-brown outline. --ar 1:1
```

**E9 — Ảnh màn thử (tuỳ chọn)**
```
Finished mobile game "choose boss" screen, landscape 844x390, in the art style of the attached images.
Blurred metallic crystal island background. Top bar: purple back button left, gold-and-purple winged title banner center, small progress chip right.
Left: three vertical gold boss cards in a row, first one glowing with a monster on a pedestal and three gold stars,
second one normal, third one locked with a dark silhouette and gold lock.
Right: a cream parchment info panel with icon rows and a reward row, and a big yellow button with crossed swords below it.
Leave all labels blank (no text). --ar 13:6
```

---

## F. Kiểm trước khi gửi
- [ ] Toạ độ khớp mục C (lệch ≤ 4 pt); khung 844×390; nút đi tiếp cách đáy ≥ 20.
- [ ] `card_boss` cùng bộ với `card_team` (cùng độ dày viền, cùng màu kem/tím) — đặt cạnh nhau như một bộ.
- [ ] Vòng tròn góc trái `card_boss` và vòng ảnh của chip boss: **tâm rõ ràng** để code canh icon/số vào giữa.
- [ ] Icon 24px vẫn đọc được khi thu nhỏ; 3 icon đòn khác nhau cả về hình lẫn màu.
- [ ] Không có chữ trong asset; chữ gõ ở Figma (tiếng Việt có dấu, ≥ 12 pt).
- [ ] Asset rời, **nền trong suốt** (ưu tiên) hoặc trắng tinh, cách nhau ≥ 20 px nếu gộp một ảnh.

---

## G. Ghi chú cho phần code (sau khi có asset)
- Viết lại `screens.boss()` trong `ui/app.js`: bỏ khung `.screen/.card` cũ, dùng `stage-wrap blur` + `stage pg` như màn Đội hình; toạ độ tuyệt đối theo mục C.
- Thêm biến `bossSel` (boss đang chọn trong đảo); mặc định = `min(save.cleared, boss cuối của đảo)`.
- Avatar boss dùng lại `bossAva()` (chân dung pet thu phục cùng loài).
- `patIcons()` đổi từ emoji sang `<img>` `icon_atk_*`; sao đổi từ chữ ⭐☆ sang `icon_star_on/off` — dùng lại ở màn Kết quả.
- Phần thưởng lần đầu: `i >= save.cleared` → hiện "Lần đầu ×3 vàng · ×2 XP".
- Pet thu phục: pet có `cap === i`; `owned(p)` → hiện ✓ thay "3⭐ thu phục".
- Hiện mỗi đảo chỉ 1 boss → màn sẽ có 1 thẻ thật + 2 thẻ "Sắp ra mắt"; khi thêm boss vào `ISLANDS[i].bosses` thì tự lấp.

---

## H. Đã làm (2026-11-11)
- Asset nhận được → `assets/boss-ui/` (đã xoá nền trắng, cắt rời, xuất webp): `frame_capture`, `icon_spiral`, `icon_xp`, `icon_atk_single/blast/aoe`, `stamp_cleared`, `icon_star_on/off`, `tag_diff`.
- `tag_diff` có nền trắng xám giữa (đã giữ) — tô màu Dễ/Vừa/Khó bằng CSS hoặc dùng chữ màu.
- **Còn thiếu:** `card_boss` (E1), `panel_boss_detail` (E2).
- Màn đã dựng tạm (`screens.boss` trong `ui/app.js`, CSS khối "CHỌN BOSS (04)"): thẻ boss tạm dùng `team-ui/card_team`, bảng chi tiết tạm vẽ bằng CSS (nền kem viền vàng). Có `card_boss`/`panel_boss_detail` thì chỉ cần đổi `background` của `.bsc` và `.bsd`.
