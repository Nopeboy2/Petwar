# Brief màn 01: Đăng nhập (màn đầu vào)

Màn đầu tiên khi mở game. Hiện chỉ có nút **CHƠI NGAY** (chơi bằng tài khoản khách). Khi có liên kết tài khoản thì thêm nút **Google** và **Apple** (xem `design/GUEST.md`).
Code: `screens.start()` trong `ui/app.js` và khối CSS `.login` trong `style.css`.

---

## 1. Bố cục (đã dựng)

```
┌──────────────────────────────────────────────┐
│                                              │
│                  PETWARS                     │  ← logo (chữ CSS, sau thay bằng ảnh)
│              Thu phục linh thú               │
│                                              │
│              [ ▶ CHƠI NGAY ]                 │  ← nút chính (btn_gold)
│           [ Google ]  [ Apple ]              │  ← nút phụ, đang khoá "Sắp có"
│                                              │
│                     Dữ liệu lưu trên máy này │
└──────────────────────────────────────────────┘
```

Nguyên tắc: **một nút chính duy nhất**. Không đặt pet, tiến độ hay tin tức ở màn này.

---

## 2. Yêu cầu ảnh nền `bg_login.webp`

| Mục | Yêu cầu |
|---|---|
| **Tên file và vị trí** | `assets/ui/bg_login.webp`. Chép vào đúng chỗ này là game tự dùng, không cần sửa code |
| **Kích thước** | **2400 × 1080 px**, màn ngang |
| **Định dạng** | WebP, chất lượng 80–85, **≤ 350 KB** |
| **Chữ trong ảnh** | **Không có chữ nào**: logo, tên game và chữ trên nút đều do game vẽ |
| **Phong cách** | Giống sảnh (`bg_sanh.webp`): 2D, chibi fantasy, viền đậm sạch, đổ bóng cel mềm, màu tươi bão hoà |

### Vùng an toàn
Ảnh phủ kín màn hình (`cover`), nên điện thoại có tỉ lệ khác nhau sẽ bị cắt mép khác nhau.

```
 0                 240                                  2160               2400
 ┌──────────────────┬──────────────────────────────────────┬──────────────────┐
 │  có thể bị cắt   │                                      │  có thể bị cắt   │
 │  (máy 16:9)      │        VÙNG AN TOÀN 1920 × 1000      │  (máy 16:9)      │
 │                  │   (mọi chi tiết quan trọng nằm đây)  │                  │
 └──────────────────┴──────────────────────────────────────┴──────────────────┘
```

- **Máy 16:9:** mất khoảng 240 px ở mỗi bên trái và phải.
- **Máy 21:9:** mất khoảng 25 px ở mép trên và mép dưới.

### Chỗ trống cho giao diện (tính trên ảnh 2400 × 1080)

| Vùng | Toạ độ gần đúng | Yêu cầu |
|---|---|---|
| **Logo** | giữa ngang, y 180–480 | Ít chi tiết, tương phản thấp (trời, sương, ánh sáng dịu). Logo chữ vàng phải đọc rõ |
| **Nút** | giữa ngang (rộng ~900), y 560–880 | Mặt đất hoặc nền phẳng, hơi tối. Không đặt nhân vật hay vật nổi bật ở đây |
| **Chân trang** | góc phải dưới, ~500 × 80 | Tối, đơn giản (chữ nhỏ màu sáng) |
| **Chủ thể nổi bật** | 1/3 trái và 1/3 phải của vùng an toàn | Pet, boss hoặc cảnh đẹp đặt ở hai bên, **hướng mắt người xem vào giữa** |

Ánh sáng: **sáng ở giữa trên, tối dần xuống dưới và ra hai mép**. Game đã phủ thêm một lớp tím mờ dần xuống dưới, nên ảnh không cần tự làm quá tối.

### Gợi ý nội dung (tuỳ bạn chọn)
- **Phương án A, Quần đảo:** nhìn từ trên vách đá ra biển. Xa xa là các hòn đảo, mỗi đảo một màu Ngũ hành (rừng xanh, núi lửa đỏ, băng xanh dương, núi đá vàng nâu, kim loại bạc). Hai bên là bóng lưng 2–3 pet đang nhìn ra. Hợp với bản đồ chọn đảo.
- **Phương án B, Đối đầu:** bên trái là đội pet trong tư thế sẵn sàng, bên phải là bóng một boss khổng lồ mờ trong sương. Giữa là khoảng trống sáng cho logo. Nói rõ "đánh boss" nhưng dễ bị rối.
- **Phương án C, Cổng trại:** lối vào trại phiêu lưu (cùng bối cảnh với sảnh). Chuyển từ màn đầu sang sảnh liền mạch nhất, nhưng ít ấn tượng nhất.

Khuyến nghị: **A**. Phương án này rõ chủ đề, nhiều khoảng trống, và khớp với hành trình qua các đảo.

### Lệnh mẫu cho AI tạo ảnh (phương án A)
```
2D mobile game title screen background, landscape 2400x1080, cute chibi fantasy art,
thick clean dark outlines, soft cel shading, vibrant saturated colors.
View from a grassy cliff over a calm sea at golden hour; five distant floating-style islands,
each themed: green forest, red volcano, blue ice, golden-brown rocky mountain, silver metal spires.
Two or three small cute creatures seen from behind on the left and right edges, looking toward the islands.
Bright soft sky in the upper center, darker foreground at the bottom and edges,
large calm empty area in the center for a logo and buttons.
No text, no letters, no logo, no UI, no watermark.
```

---

## 3. Kiểm tra trước khi gửi
- [ ] Mở game ở cửa sổ **844×390** và **640×360**: logo và nút đọc rõ, không đè lên chi tiết rối.
- [ ] Không có chữ nào trong ảnh.
- [ ] File ≤ 350 KB.
- [ ] Phong cách đặt cạnh `bg_sanh.webp` trông cùng một game.

Khi đã có `bg_login.webp`: xoá lớp `url(assets/ui/bg_sanh.webp)` (nền tạm) trong `.login` ở `style.css`.

## 4. Sau này: ảnh logo `logo.webp` (tuỳ chọn)
Khoảng 1200 × 360 px, nền trong suốt, chữ "PETWARS" có thể kèm một pet nhỏ hoặc chân thú. Có ảnh này thì thay khối chữ `.logo` trong màn đăng nhập.
