# Tạo hình & màn bằng AI — Cách ra lệnh và những gì cần bổ sung

Đọc cùng: `UI-SPEC.md` (quy chuẩn), `wireframes/*.svg` (bố cục), `LAYOUT.md` (toạ độ).

---

## 1. Thực tế: AI làm được gì, không làm được gì

| Việc | AI tạo ảnh (Midjourney, DALL·E/ChatGPT, Gemini, Stable Diffusion, Leonardo…) | Ghi chú |
|---|---|---|
| Ý tưởng phong cách, bảng màu, mood | ✅ Rất tốt | Dùng đầu tiên để chốt phong cách |
| Từng asset riêng lẻ (1 viên, 1 pet, 1 nền) | ✅ Tốt | Cách dùng chính |
| Giữ **cùng một phong cách** qua 50+ ảnh | ⚠️ Khó | Cần "style bible" + ảnh tham chiếu (mục 3) |
| Giữ **cùng một nhân vật** qua nhiều tư thế | ⚠️ Khó | Cần ảnh nhân vật gốc làm tham chiếu |
| Màn hoàn chỉnh **đúng toạ độ** wireframe | ❌ Không đáng tin | AI không đo pixel; chỉ dùng để xem thử cảm giác |
| Chữ tiếng Việt có dấu trong ảnh | ❌ Hay sai dấu | **Luôn thêm chữ trong Figma**, không để AI vẽ chữ |
| Nền trong suốt (PNG alpha) | ⚠️ Tuỳ công cụ | Thường phải tách nền sau (mục 6) |
| Sprite sheet hoạt ảnh nhiều khung đều nhau | ❌ Kém | Dùng ảnh tĩnh + hoạt ảnh CSS, hoặc tạo từng tư thế rồi ghép |
| 9-slice khung nút/bảng chuẩn | ⚠️ | AI tạo mẫu, cắt và chỉnh lề trong Figma |

**Kết luận:** dùng AI để tạo **asset rời** theo một phong cách thống nhất, rồi **ghép màn trong Figma** trên wireframe. Đừng bắt AI vẽ nguyên màn đúng bố cục.

Có một lối khác cho phần **khung giao diện** (nút, bảng, thanh, bố cục): AI viết code (Claude, v0, Figma Make…) làm đúng toạ độ vì nó đọc được `LAYOUT.md`. Xem mục 5.

---

## 2. Quy trình đề xuất

1. **Chốt phong cách** (1–2 ngày): tạo 10–20 ảnh thử với style bible → chọn 1 hướng → lưu 3–5 ảnh làm **ảnh tham chiếu phong cách**.
2. **Asset theo thứ tự ưu tiên**: 5 viên → 3 pet đầu (T/S/D) → boss 1 → nền chiến đấu chương 1 → bộ khung UI. Đủ những thứ này là ghép được màn chiến đấu.
3. **Ghép màn chiến đấu trong Figma** trên `06-battle.svg`, kiểm ở 568×320. Nếu hình không đọc được ở cỡ nhỏ → sửa prompt rồi tạo lại *trước khi* làm tiếp.
4. Làm nốt: 6 pet còn lại, quái thường, boss 2–3, nền chương 2–3, sảnh, bản đồ.
5. **Hậu kỳ** (mục 6): tách nền, cắt, đặt tên, xuất @2x/@3x.

---

## 3. Style bible — đoạn đầu dán vào MỌI prompt

Prompt viết bằng **tiếng Anh** (các mô hình ảnh hiểu tốt hơn). Đổi phần trong `[ ]` theo phong cách bạn chọn, rồi **giữ nguyên** cho mọi ảnh.

```
[STYLE] 2D mobile game art, cute chibi fantasy creatures, thick clean dark outlines,
soft cel shading, vibrant saturated colors, readable at small size, simple shapes,
consistent top-left lighting, no text, no watermark, no logo
```

Mẹo giữ thống nhất:
- **Midjourney:** thêm `--sref <link ảnh tham chiếu>` (giữ phong cách) và `--cref <link ảnh nhân vật>` (giữ nhân vật); cố định `--seed`.
- **ChatGPT/Gemini:** dùng **một cuộc trò chuyện duy nhất** cho cả bộ, gửi kèm ảnh tham chiếu, nói "same style as the reference image".
- **Stable Diffusion:** dùng cùng model + LoRA phong cách; IP-Adapter cho nhân vật; ControlNet (Canny/Lineart) với wireframe nếu muốn ảnh màn thử theo bố cục.
- **Tránh** ghi tên game/thương hiệu có thật (Pokémon, Pokiwar…) trong prompt — vừa rủi ro bản quyền vừa ra hình giống hàng có sẵn.

---

## 4. Prompt mẫu theo nhóm asset

### 4.1 Viên (5 viên, cùng một lần nếu được)
```
[STYLE] game icon set, five rounded-square gems, each a glossy jewel tile with a centered emblem,
front view, evenly spaced on plain white background, same size and same bevel:
1) yellow tile with a pale-yellow sword emblem,
2) green tile with a pink heart emblem,
3) gray tile with a gray spiral emblem,
4) purple tile with a blue shield emblem,
5) red tile with a red-and-yellow flame emblem.
Emblem shapes must be distinct in silhouette. --ar 5:1
```
Kiểm: chuyển ảnh sang đen trắng, 5 viên vẫn phân biệt được (yêu cầu ở UI-SPEC mục 6).
Hiệu ứng nổ: `... same yellow sword gem shattering into sparkles, 4 stages from intact to dust, side by side`.

### 4.2 Pet — mỗi pet một "character sheet"
Bước 1, tạo nhân vật gốc:
```
[STYLE] character design of {MÔ TẢ PET}, full body, 3/4 view facing right,
standing idle pose, plain white background, centered, whole body visible
```
Bước 2, cùng nhân vật, các tư thế (gửi kèm ảnh bước 1 làm tham chiếu):
```
[STYLE] same character as reference, {TƯ THẾ}, facing right, plain white background, whole body visible
```
`{TƯ THẾ}` = `idle breathing pose` · `lunging forward attack pose` · `recoiling hurt pose, eyes closed` · `powerful special attack pose with glowing aura`

`{MÔ TẢ PET}` — xem bảng mục 7.1 (**cần bổ sung**: hiện plan chỉ có tên).

### 4.3 Boss / quái
```
[STYLE] menacing but cute boss monster, {MÔ TẢ BOSS}, large, 3/4 view facing left,
idle pose, plain white background, whole body visible
```
Thêm tư thế: `attacking pose` · `hurt pose` · `stunned pose with stars circling its head`.
Pet quay **phải**, boss quay **trái** (đối mặt nhau trên màn chiến đấu).

### 4.4 Nền
```
[STYLE] game battle background, {CHỦ ĐỀ CHƯƠNG}, wide landscape, soft depth of field,
low contrast and slightly darkened so foreground UI stays readable,
important details in the center, empty middle area, no characters --ar 16:9
```
Chủ đề gợi ý: `lush green forest clearing` · `volcanic mountain with lava rivers` · `dark gothic castle hall`.
Sảnh: `cozy fantasy camp with tents and campfire, room for three creatures in the left half`.
Bản đồ chương: `top-down winding path map through {CHỦ ĐỀ}, wide panoramic --ar 3:1`.

### 4.5 Bộ khung UI
```
[STYLE] mobile game UI kit, flat front view on plain background, no text:
rounded rectangle orange primary button, purple secondary button, round icon button,
dark purple panel with thin light border, pill-shaped chip, horizontal progress bar frame,
modal window frame with close button, star icon, coin icon
```
Sau đó cắt từng phần trong Figma, chỉnh lề 9-slice (UI-SPEC mục 9).

### 4.6 Hiệu ứng
`[STYLE] VFX sprite, {HIỆU ỨNG}, on pure black background` — dễ tách nền bằng chế độ hoà trộn *screen/add*.
`{HIỆU ỨNG}` = `sword slash arc` · `green healing sparkles` · `blue shield bubble` · `gray dizzy spiral stars` · `orange combo burst` · `golden explosion`.

### 4.7 Ảnh màn thử (chỉ để xem cảm giác, KHÔNG dùng làm bản cuối)
```
[STYLE] mobile game screenshot, landscape 844x390, match-3 puzzle RPG battle:
left column three creature cards with health bars, center 6x6 grid of colorful gems,
right side a boss monster with red health bar, dark fantasy forest background --ar 13:6
```
Với Stable Diffusion có thể dùng `06-battle.svg` (xuất PNG) làm ảnh ControlNet để AI theo đúng bố cục.

---

## 5. Lối khác: dùng AI viết code để dựng màn đúng toạ độ

Khung giao diện (bố cục, nút, thanh, chữ) làm bằng AI code chính xác hơn AI ảnh. Mẫu lệnh:

```
Dựng màn {MÃ MÀN, ví dụ 02-home} cho game Pokiwar Lite.
- Đọc design/UI-SPEC.md (quy chuẩn) và mục {MÃ MÀN} trong design/LAYOUT.md (toạ độ).
- Dùng đúng toạ độ trong LAYOUT.md ở khung 844×390; co giãn theo UI-SPEC mục 10.
- Ảnh lấy qua data/art.js; chưa có ảnh thì dùng emoji hiện tại.
- Không đổi engine.js và data/*. Màn nối vào điều hướng trong ui/app.js.
- Kiểm: chụp màn ở 844×390 và 568×320, không có chữ/nút nằm ngoài vùng an toàn.
```
Cách này dùng được ngay trong dự án (Claude Code) và cho kết quả khớp code thật.

---

## 6. Hậu kỳ sau khi AI tạo ảnh
| Việc | Công cụ gợi ý |
|---|---|
| Tách nền | remove.bg, Photoshop "Remove Background", Figma plugin, `rembg` |
| Phóng lớn đủ @3x | Upscayl, Topaz, Real-ESRGAN (tạo ở cỡ lớn ngay từ đầu thì tốt hơn) |
| Đồng bộ màu cả bộ | Chỉnh Hue/Saturation cùng thông số cho cả nhóm |
| Căn chân nhân vật | Đặt điểm neo giữa-dưới, cùng khoảng trống dưới chân |
| Cắt, đặt tên, xuất | Figma Export, đặt tên theo UI-SPEC mục 9 |
| Nén | Squoosh → WebP chất lượng 80–85 |

---

## 7. Cần bổ sung so với plan hiện tại

Plan và wireframe đủ cho **bố cục**, nhưng thiếu các thứ sau để AI tạo **hình**:

### 7.1 Mô tả ngoại hình 9 pet (bản nháp — sửa theo ý bạn)
| Pet | Vai | Mô tả gợi ý cho prompt |
|---|---|---|
| Rùa Đá | Tanker | `sturdy turtle with a mossy stone shell, calm eyes, small crystal on shell` |
| Tê Giáp | Tanker | `armored baby rhino with steel plates and a short horn, brave expression` |
| Gấu Sắt | Tanker | `chubby bear wearing iron armor pieces, big paws, gentle face` |
| Mèo Tiên | Hỗ trợ | `fairy cat with tiny translucent wings and a glowing flower on its head` |
| Thỏ Ngọc | Hỗ trợ | `white jade rabbit with long ears, glowing jade pendant, soft pastel colors` |
| Nai Rừng | Hỗ trợ | `young forest deer with leafy antlers and flower vines` |
| Hổ Lửa | Sát thương | `fierce tiger cub with flaming stripes and ember tail tip` |
| Sói Bạc | Sát thương | `silver wolf pup with moonlight glow and sharp blue eyes` |
| Đại Bàng | Sát thương | `young eagle with golden feathers and sharp wing blades` |

Gợi ý giữ nhận diện vai: Tanker to, tròn, màu đất/kim loại · Hỗ trợ nhỏ, màu pastel, có vật phát sáng · Sát thương thon, màu nóng/sắc.

### 7.2 Kẻ địch
Plan V2 có ~10 quái thường + 3 boss nhưng **chưa có danh sách**. Cần: tên, hình dạng, chương, kiểu đòn đặc trưng (để hình gợi được đòn 🎯/💥/🌊). Boss hiện có chỉ có emoji 👹 🐲 💀 → cần mô tả, ví dụ:
- Boss 1 `forest ogre with a wooden club and mossy skin`
- Boss 2 `young dragon with ember scales`
- Boss 3 `skeleton lich king with a glowing staff`

### 7.3 Các thứ khác còn thiếu
| Thiếu | Vì sao cần |
|---|---|
| Tên chính thức + logo | "Pokiwar Lite" là tên tạm; logo nên vẽ tay/Figma vì AI viết chữ kém |
| Chủ đề & màu chủ đạo từng chương | Để nền, quái, bản đồ cùng tông |
| Ảnh tham chiếu phong cách đã chốt | Không có thì 50 ảnh sẽ lệch phong cách |
| Quyết định hoạt ảnh | AI không làm sprite sheet tốt → chọn: (a) ảnh tĩnh 4 tư thế + hoạt ảnh CSS (rẻ, đủ dùng) hoặc (b) thuê làm hoạt ảnh |
| Avatar người chơi, icon tiền tệ, rương | Có trong wireframe nhưng chưa có mô tả |
| Kiểm tra bản quyền công cụ AI | Đọc điều khoản dùng thương mại của công cụ bạn chọn trước khi phát hành |
| `data/art.js` trong code | Bảng tên → đường dẫn ảnh, để thay hình không phải sửa giao diện (PLAN-V2 mục 4) |

---

## 8. Danh sách kiểm cho mỗi ảnh AI trước khi dùng
- [ ] Đúng phong cách ảnh tham chiếu (đặt cạnh nhau so).
- [ ] Không có chữ, logo, chữ ký lạ trong ảnh.
- [ ] Hướng nhân vật đúng (pet → phải, boss → trái).
- [ ] Nhìn rõ ở cỡ thật trên màn (pet 64 pt, viên 49 pt).
- [ ] Nền đã tách sạch, không viền trắng.
- [ ] Đặt tên & kích thước đúng UI-SPEC mục 9.
