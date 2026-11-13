# Brief màn 02 — Trang chủ (sảnh)

Gửi file này + `02-home-wireframe.png` cho AI. Phần **[ĐIỀN]** là chỗ bạn phải quyết trước, AI không tự đoán đúng được.

---

## A. Các bước làm (theo thứ tự)

| Bước | Việc | Kết quả |
|---|---|---|
| 1 | Điền các ô **[ĐIỀN]** ở mục B | Brief hoàn chỉnh |
| 2 | Chốt phong cách: tạo 10–20 ảnh thử bằng **Lệnh 1**, chọn 1 ảnh đẹp nhất làm **ảnh tham chiếu** | `style-ref.png` |
| 3 | Tạo từng asset của sảnh bằng **Lệnh 2a–2e**, luôn đính kèm `style-ref.png` | Nền, 3 pet, icon, nút |
| 4 | (Tuỳ chọn) Tạo ảnh màn thử bằng **Lệnh 3**, đính kèm `02-home-wireframe.png` — chỉ để xem cảm giác tổng thể | Ảnh concept |
| 5 | Ghép màn trong Figma: frame 844×390, đặt `02-home-wireframe.png` làm lớp dưới (khoá), đặt asset theo đúng ô, **gõ chữ trong Figma** | Thiết kế màn chính thức |
| 6 | Kiểm theo mục E, gửi lại thiết kế | Mình (hoặc AI code dùng **Lệnh 4**) dựng thành màn trong game |

---

## B. Quyết định cần điền trước

| # | Câu hỏi | Gợi ý mặc định |
|---|---|---|
| B1 | Phong cách tổng (dòng STYLE) | `2D mobile game art, cute chibi fantasy creatures, thick clean dark outlines, soft cel shading, vibrant saturated colors` |
| B2 | Chủ đề sảnh | Trại phiêu lưu giữa rừng, có lều và lửa trại, buổi chiều tà |
| B3 | Ngoại hình 3 pet trong đội mặc định | Rùa Đá / Mèo Tiên / Hổ Lửa — mô tả ở `AI-PROMPTS.md` mục 7.1 |
| B4 | Màu chủ đạo của giao diện | Tím đậm cho bảng/nút phụ, cam-vàng cho nút chính (như bản đang chạy) |
| B5 | Có tên người chơi + avatar không? | Game chưa có tài khoản → avatar mặc định + tên "Người chơi" (có thể bỏ ô này) |
| B6 | Tên game & logo có xuất hiện ở sảnh không? | Không (sảnh dành chỗ cho pet); logo chỉ ở màn Bắt đầu |

---

## C. Nội dung màn (đưa nguyên văn cho AI)

**Mục đích:** Màn người chơi thấy mỗi lần mở game. Việc chính là bấm **Chiến dịch** để vào màn kế tiếp nhanh nhất (≤ 2 chạm tới trận đấu). Phụ: vào Pet, Đội hình, Cài đặt; xem tiền tệ. (Đã bỏ Hướng dẫn.)

**Khung:** thiết kế ở 844×390 pt, màn ngang. Khung **giãn theo màn hình thật** (không đóng hộp): thành phần được **neo mép**, cách mép vùng an toàn 12 pt. Nền phủ kín.

**Bố cục (đúng như bản đang chạy — toạ độ chi tiết theo khung có tai thỏ ở `LAYOUT.md`):**

| Thành phần | Neo | Vị trí / cỡ (pt) | Mô tả |
|---|---|---|---|
| Nền sảnh | phủ kín | — | Ảnh trại phiêu lưu |
| Avatar | trên-trái | cách trái 12, trên 4 · 48×48 | Khung vàng, chân dung pet đầu đội |
| Tên người chơi | trên-trái | cách trái 64, trên 8 · 160×40 | Khung lá, chữ căn giữa phần nền kem |
| Nút Cài đặt | trên-phải | cách phải 12, trên 8 · 40×40 | Bánh răng |
| Chip Kim cương/Sao | trên-phải | cách phải 60, trên 12 · 104×32 | |
| Chip Vàng | trên-phải | cách phải 172, trên 12 · 112×32 | |
| Pet 1 / 2 / 3 | giữa dọc | x 80 / 216 / 352, y 100 · 120×176 | Tên trên đầu, pet đứng **giữa bệ** (căn theo bàn chân) |
| Nhãn đội hình | giữa dọc | x 80, y 282 · 392×20 | Chạm → màn Đội hình |
| Nút Pet | dưới-trái | cách trái 12, dưới 20 · 152×56 | Chấm đỏ khi có pet lên cấp được |
| Nút Đội hình | dưới-trái | cách trái 180, dưới 20 · 152×56 | |
| **Nút Chiến dịch** | dưới-phải | cách phải 12, dưới 16 · 240×64 | Cùng hàng nút dưới; icon kiếm + "CHIẾN DỊCH" + "Màn kế: …" căn giữa |

"Giữa dọc": khi màn cao hơn khung (16:9) khối pet trượt xuống giữa; trên máy có thanh home (chạy dạng app) khối pet lùi lên đúng bằng phần thanh home để không chạm hàng nút dưới.

**Trạng thái cần vẽ:**
- Nút Chiến dịch: thường · nhấn · khi đã phá đảo ("Chơi lại màn bất kỳ").
- Nút dưới: thường · nhấn · có chấm đỏ (chỉ nút Pet).
- Ô pet trống (đội chưa đủ 3): bóng mờ + dấu "+".

**Quy chuẩn:** lưới 8 pt; vùng chạm ≥ 44 pt; font hỗ trợ tiếng Việt có dấu; chi tiết ở `design/UI-SPEC.md`.

---

## D. Các lệnh cho AI

### Lệnh 1 — Chốt phong cách (AI tạo ảnh)
```
{B1}, mobile game lobby scene, {B2 dịch sang tiếng Anh, ví dụ: adventurer camp in a forest clearing
with tents and a campfire at sunset}, three cute creatures standing together on the left,
empty space on the right side, landscape, no text, no logo, no UI --ar 13:6
```
Chạy nhiều lần, chọn 1 ảnh → lưu `style-ref.png`.

### Lệnh 2 — Asset (đính kèm `style-ref.png`, nói "same art style as the reference")

**2a. Nền sảnh**
```
{B1}, game lobby background, {B2}, wide landscape, soft depth of field, slightly darkened,
left half open ground for three characters, right half calmer area for a big button,
no characters, no text --ar 13:6
```
Tạo ở cỡ lớn (≥ 1920 px ngang). Phần quan trọng nằm trong khung giữa.

**2b. Ba pet (mỗi pet một lệnh, dùng chung cho các màn khác)**
```
{B1}, character design of {mô tả pet B3}, full body, 3/4 view facing right,
idle standing pose, plain white background, centered, whole body visible
```

**2c. Icon (một lần cho cả bộ)**
```
{B1}, game icon set on plain white background, same size, no text:
gold coin, yellow star, gear settings, paw print, three-person team, open book
```

**2d. Khung nút và chip**
```
{B1}, mobile game UI kit, front view, plain white background, no text:
large rounded orange-gold primary button with a play arrow, three rounded purple secondary buttons,
pill-shaped dark purple chip, round purple icon button, small red notification dot
```

**2e. Khung avatar**
```
{B1}, round avatar frame with a gold rim, empty center, plain white background, no text
```

### Lệnh 3 — Ảnh màn thử (đính kèm `02-home-wireframe.png` + `style-ref.png`)
```
Redesign this wireframe as a finished mobile game lobby screen in the art style of the second image.
Keep every element at exactly the same position and size as the wireframe:
top-left avatar and player name; top-right coin counter, star counter, settings button;
three creatures standing on the left; a large orange "play campaign" button on the right;
three purple buttons along the bottom-left. Landscape 844x390. Do not add any other elements.
Leave all labels blank (no text).
```
Kết quả **chỉ để tham khảo cảm giác**: AI sẽ lệch vị trí vài chục pt và vẽ chữ sai. Bản chính ghép ở bước 5.

### Lệnh 4 — Dựng màn trong code (AI viết code, ví dụ Claude Code trong dự án này)
```
Dựng lại màn Trang chủ theo design/briefs/02-home.md (mục C) và design/UI-SPEC.md.
- Dùng đúng toạ độ mục C ở khung 844×390; co giãn theo UI-SPEC mục 10.
- Ảnh lấy qua data/art.js (tạo nếu chưa có); thiếu ảnh thì dùng emoji hiện tại.
- Chip Vàng/Sao hiện 0 cho tới khi có hệ thống tiền tệ.
- Nút Chiến dịch tạm dẫn tới màn Chọn boss hiện tại.
- Không đổi engine.js và data/pets.js, data/bosses.js.
- Kiểm: chụp ở 844×390 và 568×320, không có chữ/nút ngoài vùng an toàn.
```

---

## E. Kiểm trước khi gửi thiết kế
- [ ] Đúng frame 844×390, các ô khớp toạ độ mục C (sai lệch ≤ 4 pt).
- [ ] Nút Chiến dịch nổi bật nhất màn, nhìn là biết bấm vào đâu.
- [ ] 3 pet cùng phong cách, cùng hướng (quay phải), chân cùng một đường nền.
- [ ] Chữ gõ trong Figma, đúng dấu tiếng Việt, ≥ 12 pt (trừ số trên chip).
- [ ] Nền không làm chìm chữ/nút (thử nheo mắt nhìn).
- [ ] Đặt bản xem trước ở 568×320: vẫn đọc được, không chồng nhau.
- [ ] Asset tách nền, đặt tên theo UI-SPEC mục 9 (ví dụ `bg_sanh@2x.webp`, `pet_rua-da_idle@2x.webp`, `icon_coin.svg`).
