# Kế hoạch thiết kế Pet — hình, hoạt ảnh, kích thước, dữ liệu

> **Đã chốt (thay cho danh sách 9 pet bên dưới):** 5 pet theo Ngũ hành, có tương sinh/tương khắc (luật ở `engine.js`, hệ số ở `data/config.js` → `elem`).
> | id / Tên | Hệ | Vai |
> |---|---|---|
> | `rockmane` Rockmane | Thổ | Tanker |
> | `tidewisp` Tidewisp | Thủy | Hỗ trợ |
> | `leafkit` Leafkit | Mộc | Hỗ trợ |
> | `blazefang` Blazefang | Hỏa | Sát thương |
> | `steelclaw` Steelclaw | Kim | Sát thương |
> Cả 5 đã có đủ 6 tư thế + chân dung trong `assets/pets/`. Các mục 4–6 bên dưới (9 pet, id cũ) giữ lại làm tham khảo quy trình.

Đọc cùng: `UI-SPEC.md` (quy chuẩn chung), `AI-PROMPTS.md` (lệnh tạo hình), `data/pets.js` (chỉ số hiện có).

---

## 1. Pet xuất hiện ở đâu, to bao nhiêu

Kích thước tính bằng pt trên khung 844×390. Ảnh xuất ra phải gấp 2–3 lần số này để nét.

| Màn | Vị trí | Kích thước hiển thị | Dùng ảnh | Hoạt ảnh |
|---|---|---|---|---|
| Trang chủ | 3 pet đứng trên bệ | ~110 × 120 | Toàn thân | Đứng thở, chạm vào thì vui |
| Chiến đấu | Thẻ pet cột trái | 64 × 64 (màn nhỏ 55) | Toàn thân hoặc chân dung | Đứng, tấn công, bị đánh, ULT, gục |
| Đội hình | Thẻ chọn | ~48 × 48 | **Chân dung** | Không |
| Danh sách pet | Thẻ pet | ~80 × 80 | Toàn thân | Không (hoặc đứng thở) |
| Chi tiết pet | Ảnh lớn | 280 × 280 | Toàn thân | Đứng thở, khi lên cấp thì vui |
| Kết quả | Thẻ EXP | ~48 × 48 | Chân dung | Thắng: ăn mừng · Thua: gục |
| Avatar | Khung tròn | 48 × 48 | Chân dung | Không |

**Hệ quả:** mỗi pet cần **2 loại ảnh**:
- **Toàn thân** (nhiều tư thế) — dùng ở sảnh, trận, chi tiết.
- **Chân dung** (đầu + vai, 1 ảnh) — dùng ở chỗ nhỏ ≤ 48 pt, vì toàn thân thu nhỏ quá sẽ không nhận ra.

---

## 2. Khung vẽ và quy tắc căn chỉnh

### Kích thước file
| Loại | Vẽ gốc (master) | Xuất cho game |
|---|---|---|
| Toàn thân | **1024 × 1024 px** | `L` 560 px (chi tiết pet @2x) · `M` 256 px (sảnh, trận, danh sách) |
| Chân dung | 512 × 512 px | 144 px (48 pt @3x) |
| Khung hoạt ảnh | Mỗi khung 1024 × 1024 khi vẽ | Mỗi khung **256 × 256** khi xuất |

Lưu file gốc riêng (PSD/Figma/PNG lớn) để sau này xuất lại cỡ khác.

### Căn chỉnh (quan trọng — sai là pet đứng lệch bệ, nhảy vị trí khi đổi tư thế)
```
┌───────────── 1024 ─────────────┐
│          lề trên ≥ 6%           │
│                                 │
│        ┌─────────────┐          │
│        │   PET       │ ← chiếm 70–85% chiều cao (theo vai)
│        │  quay phải  │          │
│        └──────●──────┘ ← ĐIỂM NEO: giữa-dưới, chân chạm vạch 92%
│─────────────────────────────────│ ← vạch đất 92% (y = 942 px)
│          lề dưới 8%             │ (chỗ cho bóng đổ)
└─────────────────────────────────┘
```
- Nền **trong suốt**, không có bóng đổ dưới chân (game tự vẽ bóng/bệ).
- **Quay sang phải**, góc 3/4. Boss quay sang trái.
- Điểm neo **giữa-dưới**: chân pet luôn ở giữa chiều ngang, chạm vạch đất 92%. Áp dụng cho **mọi tư thế, mọi khung** — để khi đổi từ đứng sang tấn công, chân không bị nhảy.
- Chiều cao pet theo vai (để nhìn là biết vai):
  | Vai | Chiếm chiều cao khung | Dáng |
  |---|---|---|
  | Tanker | 80–85% | To, tròn, nặng, màu đất/kim loại |
  | Hỗ trợ | 65–70% | Nhỏ, mềm, pastel, có vật phát sáng |
  | Sát thương | 72–78% | Thon, góc cạnh, màu nóng/sắc |
- Đuôi, cánh, hiệu ứng được tràn ra ngoài vùng pet nhưng **không vượt mép khung**.

### Chân dung
Đầu + vai, mặt hướng 3/4 sang phải, mắt nằm khoảng 40% từ trên xuống, nền trong suốt. Phải nhận ra pet ở cỡ 48 × 48 pt.

---

## 3. Hoạt ảnh

### Danh sách tư thế
| Tư thế | Khi nào | Lặp? | Bản tối thiểu (MVP) | Bản đầy đủ (sprite) | Ưu tiên |
|---|---|---|---|---|---|
| **Đứng (idle)** | Mọi lúc | Lặp | 1 ảnh tĩnh, game làm hiệu ứng thở bằng CSS | 6 khung · 8 fps | ⭐ Bắt buộc |
| **Tấn công** | Ăn viên Kiếm | 1 lần | 1 ảnh tư thế lao tới, game đẩy về phía boss | 6 khung · 12 fps | ⭐ Bắt buộc |
| **Bị đánh** | Boss đánh trúng | 1 lần | 1 ảnh nhăn mặt/giật lùi, game rung + nháy đỏ | 3 khung · 12 fps | ⭐ Bắt buộc |
| **ULT** | Bấm ULT | 1 lần | 1 ảnh tư thế mạnh, game phóng to + phát sáng | 8 khung · 12 fps | ⭐ Bắt buộc |
| **Gục** | Pet chết | Giữ khung cuối | 1 ảnh nằm/ngất, game làm xám | 4 khung · 8 fps | ⭐ Bắt buộc |
| **Ăn mừng** | Thắng trận, lên cấp | 1 lần rồi về đứng | 1 ảnh vui | 6 khung · 10 fps | Nên có |
| **Được chạm** | Chạm vào pet ở sảnh/đội hình | 1 lần | Dùng lại ảnh Ăn mừng | 4 khung · 10 fps | Tuỳ chọn |

### Ba mức làm hoạt ảnh — chọn mức phù hợp ngân sách
| Mức | Cần vẽ mỗi pet | Cảm giác | Khi nào chọn |
|---|---|---|---|
| **1. Ảnh tĩnh + CSS** | 6 ảnh (6 tư thế) + 1 chân dung = **7 ảnh** | Sống động vừa phải: thở, lao, rung, phát sáng do code làm | **MVP — đề xuất bắt đầu ở đây**; làm được bằng AI |
| 2. Sprite sheet | ~33 khung + 1 chân dung | Mượt như game thật | Khi có hoạ sĩ hoặc công cụ tạo khung |
| 3. Hoạt hình xương (Spine/DragonBones) | 1 bộ bộ phận rời + file hoạt ảnh | Mượt nhất, file nhẹ | Khi có ngân sách và người làm Spine |

Mức 1 lên mức 2 **không phải sửa code giao diện** — chỉ đổi khai báo trong dữ liệu (mục 5).

### Hiệu ứng code tự làm (mức 1) — để bạn không phải vẽ
| Tư thế | Code làm gì với ảnh tĩnh |
|---|---|
| Đứng | Co giãn nhẹ theo chiều dọc (thở), chu kỳ 2.4 s |
| Tấn công | Lao 20 pt về phía boss rồi quay lại (350 ms) |
| Bị đánh | Rung ngang + nháy đỏ (300 ms) |
| ULT | Phóng to 1.2×, hào quang màu chủ đạo của pet, rung màn nhẹ (600 ms) |
| Gục | Ngả xuống, xám màu, mờ 50% |
| Ăn mừng | Nhảy lên 2 lần (500 ms) |

### Sprite sheet (mức 2)
- Mọi khung cùng cỡ 256 × 256, **xếp ngang một hàng**, không khoảng cách.
- Điểm neo giữa-dưới giống nhau ở mọi khung.
- Tên file: `pet_<id>_<tư thế>_<số khung>f@2x.webp`, ví dụ `pet_rua-da_attack_6f@2x.webp`.
- Khung đầu của Tấn công/Bị đánh/ULT nên gần giống tư thế Đứng để chuyển mượt.

### Hiệu ứng ULT (vẽ riêng, không dính vào pet)
Mỗi **loại** ULT một hiệu ứng (không phải mỗi pet): khiên (xanh dương), hồi máu (xanh lá), sát thương lớn (cam/vàng). Sprite sheet 8 khung, nền đen hoặc trong suốt. Màu có thể nhuộm theo màu chủ đạo của từng pet bằng code.

---

## 4. Danh sách cần giao (mức 1)

Mỗi pet **7 file** (+ bản `L` cho tư thế Đứng):
| File | Kích thước |
|---|---|
| `pet_<id>_idle.png` | 256 × 256 (+ `pet_<id>_idle_L.png` 560 × 560) |
| `pet_<id>_attack.png` | 256 × 256 |
| `pet_<id>_hurt.png` | 256 × 256 |
| `pet_<id>_ult.png` | 256 × 256 |
| `pet_<id>_down.png` | 256 × 256 |
| `pet_<id>_happy.png` | 256 × 256 |
| `pet_<id>_portrait.png` | 144 × 144 |

Tổng: 9 pet × 8 file = **72 file**, cộng 3 hiệu ứng ULT.
**Đợt 1** (đủ để thay hình sảnh + trận): 3 pet đội mặc định × 8 file = 24 file.

`<id>` không dấu, gạch nối:
| Pet | id |
|---|---|
| Rùa Đá | `rua-da` |
| Tê Giáp | `te-giap` |
| Gấu Sắt | `gau-sat` |
| Mèo Tiên | `meo-tien` |
| Thỏ Ngọc | `tho-ngoc` |
| Nai Rừng | `nai-rung` |
| Hổ Lửa | `ho-lua` |
| Sói Bạc | `soi-bac` |
| Đại Bàng | `dai-bang` |

---

## 5. Dữ liệu cần cho mỗi pet

### Hiện có (`data/pets.js`)
Tên, vai, HP, ATK, DEF, Aggro, loại + sức mạnh ULT, emoji tạm.

### Cần bổ sung
| Trường | Ví dụ | Dùng cho | Ai điền |
|---|---|---|---|
| `id` | `rua-da` | Tên file ảnh, lưu tiến độ | Có sẵn ở bảng mục 4 |
| `desc` | "Rùa già canh giữ suối đá, chậm mà chắc." | Màn chi tiết pet | **Bạn** |
| `look` | `sturdy turtle with a mossy stone shell…` | Lệnh tạo hình AI | **Bạn** (nháp ở mục 6) |
| `color` | `#7cae5a` | Hào quang ULT, viền thẻ, số bay | **Bạn** (lấy từ hình) |
| `ultName` | "Mai Đá Bất Động" | Tên chiêu khi tung ULT, màn chi tiết | **Bạn** |
| `art` | đường dẫn từng tư thế | Code tìm ảnh | Mình (theo tên file) |
| `anim` | số khung + fps mỗi tư thế (mức 2) | Chạy sprite | Mình (theo file bạn giao) |
| `fit` | `{ scale: 1, dy: 0 }` | Chỉnh tay nếu một pet trông to/nhỏ hoặc lơ lửng | Mình (sau khi xem thử) |
| `unlock` | `"1-3"` | Mở khoá theo màn (PLAN-V2) | Theo plan, bạn xác nhận |
| `sfx` | `attack`, `hurt` | Âm thanh riêng (để sau) | Để sau |

### Mẫu một pet sau khi bổ sung
```js
{ id: 'rua-da', n: 'Rùa Đá', e: '🐢', r: 'T', hp: 1600, atk: 30, def: 50, ag: 200,
  ult: { k: 'shield', v: 0.25 }, ultName: 'Mai Đá Bất Động',
  desc: 'Rùa già canh giữ suối đá, chậm mà chắc.', color: '#7cae5a', unlock: null,
  look: 'sturdy turtle with a mossy stone shell, calm eyes, small crystal on shell',
  fit: { scale: 1, dy: 0 } }
```
Ảnh được tìm theo quy tắc `assets/pets/pet_<id>_<tư thế>.png`; thiếu tư thế nào thì dùng ảnh Đứng, thiếu cả Đứng thì dùng emoji — game không bao giờ trống hình.

---

## 6. Bảng nhân vật (nháp — bạn sửa)

| Pet | Vai | Ngoại hình (cho lệnh AI) | Màu chủ đạo | Tên ULT gợi ý | Tư thế ULT gợi ý |
|---|---|---|---|---|---|
| Rùa Đá | Tanker | Rùa mai đá phủ rêu, mắt hiền, tinh thể nhỏ trên mai | Xanh rêu `#7cae5a` | Mai Đá Bất Động | Rụt vào mai, mai phát sáng |
| Tê Giáp | Tanker | Tê giác con mặc giáp thép, sừng ngắn, mặt dũng cảm | Xám thép `#8a9bb0` | Tường Thép | Dậm chân, giơ khiên giáp |
| Gấu Sắt | Tanker | Gấu tròn mặc mảnh giáp sắt, chân to, mặt hiền | Nâu đồng `#a0703c` | Ôm Sắt | Dang tay ôm cả đội |
| Mèo Tiên | Hỗ trợ | Mèo có cánh trong suốt, bông hoa phát sáng trên đầu | Hồng `#f29ac2` | Phấn Hoa Chữa Lành | Bay lên, rắc phấn hoa |
| Thỏ Ngọc | Hỗ trợ | Thỏ trắng tai dài, đeo mặt ngọc phát sáng | Ngọc `#7fd6c2` | Ánh Trăng Ngọc | Giơ mặt ngọc lên trời |
| Nai Rừng | Hỗ trợ | Nai con sừng là cành lá, quấn dây hoa | Xanh lá `#5fbf6a` | Suối Lá Xanh | Ngẩng đầu, sừng nở hoa |
| Hổ Lửa | Sát thương | Hổ con vằn lửa, chóp đuôi có than hồng | Cam lửa `#f07a2a` | Vuốt Hoả Diệm | Vồ tới, vuốt bốc lửa |
| Sói Bạc | Sát thương | Sói con lông bạc ánh trăng, mắt xanh sắc | Bạc xanh `#9fc4e8` | Nanh Trăng | Tru lên, bóng trăng phía sau |
| Đại Bàng | Sát thương | Đại bàng non lông vàng, cánh như lưỡi dao | Vàng kim `#e8b923` | Cánh Gió Cắt | Bổ nhào, cánh xẻ gió |

Quy tắc giữ nhận diện: nhìn **bóng đen (silhouette)** của 9 pet cạnh nhau vẫn phải phân biệt được từng con và đoán được vai.

---

## 7. Quy trình làm

1. **Chốt bảng nhân vật** (mục 6): ngoại hình, màu, tên ULT.
2. **Vẽ/tạo 3 pet đợt 1** (Rùa Đá, Mèo Tiên, Hổ Lửa), tư thế **Đứng** trước. Lệnh AI: `AI-PROMPTS.md` mục 4.2, thêm câu căn chỉnh:
   `square canvas, character centered, feet touching a ground line near the bottom, transparent background, facing right`
   Chuẩn hoá ảnh (tách nền, căn chân, xuất 560/256/chân dung):
   `node design/tools/pet.mjs design/source/pet_<id>_idle.png <id> <T|S|D> [x,y,cạnh vùng chân dung]`
   rồi thêm `<id>` vào `PET_HAS` trong `data/art.js`.
3. **Gửi 3 ảnh Đứng cho mình** → mình đặt vào sảnh + trận để kiểm cỡ, căn chân, độ rõ ở 64 pt. Sửa lệch trước khi làm tiếp.
4. Làm 5 tư thế còn lại + chân dung cho 3 pet (dùng ảnh Đứng làm tham chiếu để giữ đúng nhân vật).
5. Làm 6 pet còn lại theo cùng quy trình.
6. 3 hiệu ứng ULT.

## 8. Câu lệnh (prompt) mẫu

Viết bằng tiếng Anh. Mỗi lệnh = **[STYLE] + [NHÂN VẬT] + [TƯ THẾ] + [KHUNG]**. Giữ nguyên STYLE và KHUNG cho mọi pet.

### Các khối dùng chung
**[STYLE]** — khớp bộ khung sảnh đã có:
```
2D mobile game character art, cute chibi fantasy creature, thick clean dark-brown outlines,
soft cel shading, vibrant saturated colors, warm forest-adventure style, high detail, crisp edges
```
**[KHUNG]** — quy tắc căn chỉnh mục 2:
```
square 1:1 canvas, single character, full body fully visible, 3/4 view facing right,
character centered horizontally, feet touching a ground line near the bottom edge,
plain pure white background, no shadow under the feet, no ground, no text, no logo, no frame
```
(Nền trắng tinh thay vì "trong suốt" vì đa số công cụ AI không xuất được nền trong suốt — mình tách nền sau.)

**[TƯ THẾ]**:
| Tư thế | Đoạn lệnh |
|---|---|
| idle | `standing idle pose, relaxed, friendly expression` |
| attack | `lunging forward to the right in an attack pose, determined expression, motion lines` |
| hurt | `recoiling backward from a hit, eyes squeezed shut, small impact stars` |
| ult | `powerful special-move pose, glowing {MÀU} aura around the body, intense expression` |
| down | `knocked out lying on the ground, dizzy swirl eyes, exhausted` |
| happy | `jumping happily with a big smile, celebrating victory` |
| portrait | thay [KHUNG] bằng: `head and shoulders portrait, 3/4 view facing right, centered, plain pure white background, no text` |

### Bước 1 — Tạo ảnh gốc (idle), ví dụ Rùa Đá
```
2D mobile game character art, cute chibi fantasy creature, thick clean dark-brown outlines,
soft cel shading, vibrant saturated colors, warm forest-adventure style, high detail, crisp edges.
A sturdy chubby turtle with a mossy stone shell, calm kind eyes, a small glowing green crystal
on top of the shell, earthy green and stone-gray colors, big and round body (tank role).
Standing idle pose, relaxed, friendly expression.
Square 1:1 canvas, single character, full body fully visible, 3/4 view facing right,
character centered horizontally, feet touching a ground line near the bottom edge,
plain pure white background, no shadow under the feet, no ground, no text, no logo, no frame.
```
Chạy 4–8 lần, chọn 1 ảnh đẹp nhất → đây là **ảnh gốc của pet**, lưu lại.

### Bước 2 — Các tư thế khác (đính kèm ảnh gốc)
```
Use the attached image as the exact character reference: same species, same colors, same markings,
same proportions, same art style. Do not redesign the character.
{TƯ THẾ}.
Square 1:1 canvas, single character, full body fully visible, 3/4 view facing right,
character centered horizontally, feet touching a ground line near the bottom edge,
plain pure white background, no shadow under the feet, no ground, no text, no logo, no frame.
```
Ví dụ ULT của Rùa Đá: `{TƯ THẾ}` = `pulled halfway into its shell, the stone shell glowing with a bright green protective aura, intense expression`.

### Cách khác — cả bộ tư thế trong một ảnh (giữ nhân vật đồng nhất hơn)
```
{STYLE}. Character pose sheet of {NHÂN VẬT}: six poses of the SAME character in a 3x2 grid,
evenly spaced, each pose the same size, all facing right, full body:
1 standing idle, 2 lunging attack, 3 recoiling hurt, 4 special move with glowing {MÀU} aura,
5 knocked out lying down, 6 jumping happily.
Plain pure white background, no shadows, no text, no labels, no grid lines. --ar 3:2
```
Gửi ảnh này cho mình — cắt bằng công cụ có sẵn (`design/tools/extract.mjs`) như bộ khung sảnh. Ảnh cần đủ lớn (≥ 1536 px chiều ngang).

### [NHÂN VẬT] cho 3 pet đợt 1
| Pet | Đoạn mô tả | {MÀU} |
|---|---|---|
| Rùa Đá | `a sturdy chubby turtle with a mossy stone shell, calm kind eyes, a small glowing green crystal on top of the shell, earthy green and stone-gray colors, big and round body (tank role)` | green |
| Mèo Tiên | `a small fairy cat with tiny translucent butterfly wings, a glowing pink flower on its head, soft pastel pink and cream fur, big sparkling eyes, small and delicate body (healer role)` | soft pink |
| Hổ Lửa | `a fierce tiger cub with flame-shaped orange and red stripes, an ember glowing at the tip of its tail, sharp confident eyes, slim agile body (attacker role)` | fiery orange |

6 pet còn lại: dịch cột "Ngoại hình" ở mục 6 theo cùng cách viết (loài + đặc điểm + màu + dáng theo vai).

### Mẹo theo công cụ
| Công cụ | Cách giữ đúng nhân vật & phong cách |
|---|---|
| ChatGPT / Gemini | Một cuộc trò chuyện cho **một pet**; đính kèm ảnh gốc ở mỗi lệnh tư thế |
| Midjourney | Thêm `--ar 1:1 --cref <link ảnh gốc> --cw 100 --sref <link ảnh bộ khung sảnh>`; giữ `--seed` cố định |
| Stable Diffusion | Cùng model + IP-Adapter với ảnh gốc; negative prompt: `text, watermark, shadow, ground, multiple characters, cropped, blurry, background scenery` |

### Lỗi hay gặp & cách sửa lệnh
| AI làm sai | Thêm vào lệnh |
|---|---|
| Quay sang trái | `facing right, looking to the right side of the image` |
| Bị cắt chân/đuôi | `entire body including tail and feet fully inside the frame, generous margin` |
| Có nền cảnh/bóng | `isolated on plain pure white background, nothing else` |
| Mỗi tư thế ra con khác | Dùng ảnh gốc làm tham chiếu + câu "Do not redesign the character", hoặc dùng cách "pose sheet" |
| Quá chi tiết, thu nhỏ không rõ | `simple bold shapes, readable at small size, minimal tiny details` |

## 9. Kiểm trước khi giao
- [ ] Khung vuông, nền trong suốt, không bóng dưới chân.
- [ ] Quay phải, chân ở giữa và chạm vạch 92% — **giống nhau ở mọi tư thế**.
- [ ] Chiều cao đúng tỉ lệ theo vai (mục 2).
- [ ] Thu về 64 × 64 vẫn nhận ra pet; chân dung 48 × 48 vẫn nhận ra.
- [ ] 9 bóng đen phân biệt được.
- [ ] Cùng phong cách với bộ khung sảnh (viền đậm, màu bão hoà).
- [ ] Đặt tên file đúng mục 4.
