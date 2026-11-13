# Prompt — Hổ Lửa (các phần còn lại)

Ảnh gốc đã có: `design/source/pet_ho-lua_idle.png` (tư thế Đứng).
**Mọi lệnh dưới đây đều phải đính kèm ảnh gốc này.** Dán nguyên văn, chỉ đổi phần trong `{ }` nếu cần.

---

## 0. Các khối dùng chung (đã viết sẵn theo đúng ảnh gốc)

**[THAM CHIẾU]** — luôn đặt đầu lệnh:
```
Use the attached image as the exact character reference. Keep the same character design:
same species, same colors, same armor pieces, same markings, same proportions, same art style.
Do not redesign, add or remove any armor piece.
```

**[NHÂN VẬT]** — mô tả chi tiết để AI không vẽ lệch giáp:
```
The character: a small white tiger cub with flame-shaped orange-red stripes on its fur and face,
bright green eyes, small fangs; a golden and red flame crown-helmet with a red diamond gem on the forehead
and a tall burning flame crest; golden-red shoulder armor with swirl patterns;
a round golden chest medallion with a fire emblem and a small yellow gem below it;
golden leg cuffs with red diamond gems on all four legs; a big flaming tail with a golden gem ring near its base;
small floating flame embers around the body.
```

**[STYLE]**:
```
2D mobile game character art, cute chibi fantasy creature, thick clean dark-brown outlines,
soft cel shading, vibrant saturated colors, crisp edges, high detail
```

**[KHUNG]**:
```
Square 1:1 canvas, single character, full body fully visible including the whole tail and all flames,
3/4 view facing right, character centered horizontally, feet touching a ground line near the bottom edge,
plain pure white background, no shadow under the feet, no ground, no text, no logo, no frame.
```

Lệnh hoàn chỉnh = **[THAM CHIẾU] + [NHÂN VẬT] + [TƯ THẾ] + [STYLE] + [KHUNG]**.

---

## 1. Cách nhanh và đồng nhất nhất — cả bộ tư thế trong một ảnh (khuyên dùng)

```
Use the attached image as the exact character reference. Keep the same character design:
same species, same colors, same armor pieces, same markings, same proportions, same art style.
Do not redesign, add or remove any armor piece.

The character: a small white tiger cub with flame-shaped orange-red stripes on its fur and face,
bright green eyes, small fangs; a golden and red flame crown-helmet with a red diamond gem on the forehead
and a tall burning flame crest; golden-red shoulder armor with swirl patterns;
a round golden chest medallion with a fire emblem and a small yellow gem below it;
golden leg cuffs with red diamond gems on all four legs; a big flaming tail with a golden gem ring near its base.

Character pose sheet: the SAME character drawn five times in a single row, evenly spaced,
each pose the same size, all facing right, full body, nothing overlapping:
1) lunging forward to the right with claws out, flames trailing behind, fierce determined expression;
2) recoiling backward from a hit, eyes squeezed shut, small impact stars, flames flickering;
3) roaring with a powerful special move, surrounded by a blazing orange-red fire aura, crest flames huge;
4) knocked out lying on its side on the ground, dizzy swirl eyes, tail flame reduced to a small ember;
5) jumping happily with a big smile and closed happy eyes, celebrating, sparks of fire around.

2D mobile game character art, cute chibi fantasy creature, thick clean dark-brown outlines,
soft cel shading, vibrant saturated colors, crisp edges.
Plain pure white background, no shadows, no ground, no text, no numbers, no labels, no grid lines. --ar 5:1
```
- Cần ảnh rộng **≥ 2500 px** (mỗi tư thế ≥ 500 px). Nếu công cụ không cho tỉ lệ 5:1, dùng lưới 3×2 (ô thứ 6 để trống) với `--ar 3:2`.
- Gửi ảnh cho mình → mình cắt và chuẩn hoá từng tư thế.

---

## 2. Từng tư thế riêng (khi cần làm lại một tư thế)

Ghép **[THAM CHIẾU] + [NHÂN VẬT] + dòng [TƯ THẾ] bên dưới + [STYLE] + [KHUNG]**.

| Tư thế | File | [TƯ THẾ] |
|---|---|---|
| Tấn công | `pet_ho-lua_attack` | `Attack pose: lunging forward to the right with front claws out, body low and stretched, flames trailing behind like a comet, fierce determined expression, mouth open showing fangs.` |
| Bị đánh | `pet_ho-lua_hurt` | `Hurt pose: recoiling backward to the left from a hit, head tilted back, eyes squeezed shut, small white impact stars near the face, flames flickering and smaller.` |
| ULT | `pet_ho-lua_ult` | `Ultimate move pose: standing tall on hind legs and roaring, chest medallion glowing bright, surrounded by a blazing orange-red fire aura, crest and tail flames twice as big, intense glowing green eyes.` |
| Gục | `pet_ho-lua_down` | `Defeated pose: knocked out lying on its side on the ground, eyes as dizzy swirls, tongue slightly out, crest flame and tail flame reduced to small dim embers, armor still on.` |
| Ăn mừng | `pet_ho-lua_happy` | `Victory pose: jumping happily in the air with all four paws off the ground, big open smile, happy closed eyes, small fire sparks and stars bursting around.` |

Lưu ý riêng:
- **Tấn công** và **Ăn mừng** có thân lệch/nhảy lên → vẫn giữ **chân sau** chạm vạch đất gần đáy (Ăn mừng: điểm thấp nhất của thân cách vạch một chút là được, mình sẽ căn).
- **Gục**: nằm ngang nên ảnh rộng hơn cao — vẫn dùng khung vuông, để trống phía trên.

---

## 3. Chân dung (tuỳ chọn — mình đã tự cắt tạm từ ảnh gốc)

```
Use the attached image as the exact character reference. Keep the same character design.
Head-and-shoulders portrait of the white fire tiger cub: golden-red flame crown-helmet with the red diamond gem,
bright green eyes, orange-red face stripes, golden shoulder armor visible at the bottom,
confident friendly smile, 3/4 view facing right, head centered, eyes at about 40% from the top,
simple bold shapes readable at small size, fewer floating flames.
2D mobile game character art, thick clean dark-brown outlines, soft cel shading, vibrant colors.
Square 1:1 canvas, plain pure white background, no text, no frame.
```

---

## 4. Hiệu ứng ULT loại "sát thương lớn" (dùng chung cho cả 3 pet Sát thương)

Không đính kèm ảnh pet. Màu sẽ được code nhuộm theo từng pet.
```
2D mobile game VFX sprite sheet, a fiery claw-slash explosion effect, 8 frames in a single row,
equal frame size, evenly spaced, from a small spark (frame 1) growing into three big flaming claw slashes
with a burst of embers (frames 4-5) then fading into smoke wisps (frame 8),
orange, red and yellow fire colors, bright glowing core, thick clean outlines, cel shaded,
on a pure black background, no text, no grid lines --ar 8:1
```
Nền đen để mình tách bằng chế độ hoà trộn sáng (không cần tách nền).

---

## 5. Kiểm khi nhận ảnh từ AI
- [ ] Giáp đủ và đúng chỗ: mũ lửa + đá đỏ trán, giáp vai, huy hiệu ngực có biểu tượng lửa, vòng chân có đá đỏ ×4, vòng vàng ở đuôi.
- [ ] Mắt xanh lá, lông trắng, vằn cam đỏ.
- [ ] Quay phải; đuôi và lửa không bị cắt mép.
- [ ] Nền trắng tinh, không bóng, không chữ/số.
- [ ] Cỡ nhân vật giữa các tư thế tương đương nhau (không con to con nhỏ).

## 6. Dữ liệu còn thiếu (điền giúp mình)
| Mục | Đề xuất | Của bạn |
|---|---|---|
| Màu chủ đạo | `#f05a28` (đỏ cam) | |
| Mô tả ngắn | "Hổ trắng khoác giáp lửa, càng đánh càng hăng." | |
| Tên chiêu ULT | "Vuốt Hoả Diệm" | |
