# Brief — Màn 06 Chiến đấu

Gửi cho AI hoặc designer: file này, ảnh tham chiếu phong cách **`design/source/pet-ui-kit/asset_contact_sheet.jpg`** và 5 ảnh nền ở **`design/source/battle_bg/`**.
Phong cách theo **UI-SPEC mục 0**. Code: `ui/battle.js` (dựng HTML, phát hoạt ảnh) và `style.css` (mục CHIẾN ĐẤU). Bản này thay cho bảng `06-battle` cũ trong `LAYOUT.md`.

---

## A. Màn này làm gì

Trận đánh boss kiểu xếp ngọc (match-3): **3 pet thẳng cột bên trái, bàn cờ ở giữa, boss bên phải**, cả ba đứng trên nền đảo của boss.

Trong lúc đánh, người chơi chỉ cần liếc là trả lời được 4 câu:
1. **Mình nên vuốt gì?** Bàn cờ ở giữa, to nhất, nằm dưới ngón tay.
2. **Pet nào sắp chết?** Thanh máu đặt ngay dưới chân từng pet.
3. **Có tung ULT được chưa?** Pet đầy nộ thì phát sáng tím, có nhãn ULT tím. Chạm vào pet để tung.
4. **Boss sắp làm gì?** Chip "Đòn kế" dưới chân boss và dải choáng trên đầu boss.

Nền trận là ảnh đảo đã được làm mờ 6px và giảm sáng còn 72% (`design/tools/battlebg.html`). Vì vậy không cần khung panel lớn: chỉ các ô chữ nhỏ có nền tím trong suốt (`#1b1230` alpha 0.78).

---

## B. Bố cục

Khung cao 390, **rộng theo màn thật** (tối thiểu 844). Bàn cờ luôn ở giữa. Nút và pet bám lề trái, boss bám lề phải, cách mép 12 (cộng thêm vùng tai thỏ nếu có).
Toạ độ dưới đây tính trên màn 844: L = mép trái + 12, R = mép phải − 12, bàn cờ x = 251.

```
 12                 251                     593              832
 ┌⏸┐┌Lượt 6/50┐       ⚔3 -361 · 🛡3 · combo x1.3                    8
                    ┌───────────────────────┐ ┌ ⚙ Boss 1 · Lv1  ┐ 28
 🐾  [tên     🎯%]  │                       │ │ ████████ HP     │
     [██ máu ████]  │                       │ │ ▮▮▮▯▯ choáng    │
 🐾  [tên     🎯%]  │    BÀN CỜ 6×6         │                    
     [██ máu ████]  │    342×342 · ô 57     │      ẢNH BOSS       
 🐾  [tên     🎯%]  │                       │  ( Đòn kế: 💥 Lan ) 
     [██ máu ████]  │                       │      💫 CHOÁNG      
                    └───────────────────────┘                     370
```

| Thành phần | x | y | w | h | Mô tả |
|---|---|---|---|---|---|
| Nền | 0 | 0 | phủ | phủ | `assets/battle/bg_<hệ boss>.webp`, mờ và tối sẵn |
| Nút tạm dừng / thoát | L | 8 | 40 | 32 | ⏸ nền **đỏ** (#f0646c → #c2313c), mở hộp Tạm dừng (Tiếp tục / Bỏ cuộc) |
| Chip **Lượt** | L + 46 | 8 | 104 | 32 | "Lượt 6/50", nền **vàng** (#ffe08a → #f2b630), chữ nâu #5a3412 14 đậm |
| Tóm tắt nước vừa đi | giữa | 6 | 400 | 30 | Chữ vàng **16 đậm**, ví dụ "⚔3 -762 · ❤3 · combo x1.3" |
| **Pet 1 / 2 / 3** (thẳng cột) | L | 48 / 156 / 264 | 236 | 104 | Mỗi hàng: ảnh trái, chỉ số phải |
| · Ảnh pet | 0 | giữa | 78 (ảnh 100) | 104 | Bản `_L`, quay mặt sang phải, bóng elip dưới chân. **Chip 🎯% (tỉ lệ bị nhắm) ở chân ảnh**, chữ 11 |
| · Ô chỉ số | 80 | 14 | 156 | 76 | Dòng 1 (cao 20): icon hệ + icon vai trò 19×19, tên 13 đậm; **▲▼ khắc hệ và 🌱 tương sinh sát lề phải**, thẳng mép phải các thanh. Dưới: Máu 12 "1600 / 1600", Khiên 10 "🛡 480", Nộ 10 "🔥 30 / 100" |
| · Nhãn ULT | góc trên phải ảnh | 6 | — | — | Chỉ hiện khi nộ đầy |
| **Bàn cờ** | giữa (251+6) | **40** | 330 | 330 | 6×6, ô 55, khe 2, viền trong 3, bo 12. Lùi xuống để dòng tóm tắt to hơn |
| **Boss** | R − 226 | 40 | 226 | 330 | Cao bằng bàn cờ, **cả khối căn giữa trên–dưới** |
| · Đầu boss | 0 | 0 | 226 | ~56 | Icon hệ `icon_el_*` 16, tên, cấp (12 đậm). Thanh máu 11 (có số). Dải choáng N vạch |
| · Ảnh boss | giữa | 60 | 226 | 184 | Ảnh 185, quay mặt sang **trái**, bóng dưới chân |
| · Đòn kế | giữa | **ngay dưới ảnh boss** | — | 32 | Chip "Đòn kế: 💥 Đòn lan", **chữ 15 đậm** |
| · Trạng thái | giữa | dưới chip Đòn kế | 226 | 16 | "💫 CHOÁNG +50% dame" chữ vàng, trống khi không choáng |

---

## C. Trạng thái

| Đối tượng | Trạng thái | Hiển thị |
|---|---|---|
| Pet | Bình thường | Ảnh `idle` thở nhẹ (2,4 giây/lần) |
| | Nộ đầy (ULT sẵn) | Ảnh viền sáng **tím**, nhãn ULT tím nhấp nháy, chạm cả pet là tung |
| | Bị đánh | Ảnh `hurt` rung 0,3 giây, ửng đỏ, số đỏ bay lên |
| | Có khiên chặn hết | Số "🛡️ chặn" màu xanh nhạt |
| | Tấn công (khi ăn ⚔) | Ảnh `attack` lao sang phải 18px |
| | Tung ULT | Ảnh `ult` phóng to 1,35 lần, viền cam |
| | Gục | Ảnh `down`, xám và mờ, 🎯 đổi thành ✖ |
| | Thắng trận | Ảnh `happy` nhảy 3 lần |
| Boss | Bình thường | Đứng yên |
| | Bị đánh | Rung 0,25 giây, số trắng bay lên (choáng thì số vàng to) |
| | Ra đòn | Lao sang trái 24px, phóng to 1,15 lần |
| | Choáng | Bỏ lượt, thông báo "💫 Boss bị choáng!", dòng trạng thái vàng |
| Bàn cờ | Chờ 5 giây | Gợi ý: 2 viên nhấp nháy co giãn |
| | Đang phát hoạt ảnh | Khoá vuốt, nhãn ULT ẩn |
| | Hết nước đi | Thông báo "Xáo bàn", vẽ lại bàn |

---

## D. Kịch bản một lượt

Code không tự tính luật. Engine trả về danh sách sự kiện, `battle.js` phát lại lần lượt theo bảng dưới (thời gian tính bằng ms, `?fast` bỏ hết thời gian chờ).

| # | Sự kiện | Hình | Âm thanh | Thời gian |
|---|---|---|---|---|
| 1 | Người chơi vuốt hoặc chạm 2 ô kề nhau | Đổi chỗ 2 viên | `swap` | 160 |
| 1b | Nước không hợp lệ | Đổi chỗ rồi trả về | `bad` | 320 |
| 2 | Mỗi đợt nổ (đợt 2 trở đi là combo) | Viên nổ thu nhỏ; từ đợt 2 hiện "COMBO xN" giữa bàn | `pop` (cao dần theo đợt) | 220 |
| 3 | Rơi viên mới | Viên rơi từ trên xuống | — | 300 mỗi đợt |
| 4 | Sát thương lên boss (ăn ⚔) | Pet còn sống tấn công, boss rung, số bay lên | `hit` | 250 |
| 5 | Hồi máu, khiên, nộ (ăn 💗 🛡 🔥) | Số bay lên từ **mép trên-phải ô chỉ số** của từng pet; nhiều số cùng lúc thì xếp chồng lên trên | `heal` | 120 mỗi loại |
| 6 | Choáng (ăn 🌀) | "🌀+n" trên boss, dải choáng đầy dần | — | 120 |
| 7 | Cập nhật thanh | Máu, khiên, nộ, HP boss chạy mượt 0,3 giây | — | 150 |
| 8a | Boss bị choáng | "💫 Boss bị choáng!" | `stun` | 700 |
| 8b | Boss ra đòn | Hiện tên đòn, boss lao tới, pet trúng đòn rung và hiện số | `boss`, rung máy 40ms | 350 + 550 |
| 9 | Hết trận | Thắng: pet `happy`; thua: im lặng | `win` hoặc `lose` | 900, rồi sang màn Kết quả |

Một lượt bình thường (1 đợt nổ, boss đánh) dài khoảng 2 giây. Mỗi đợt combo thêm khoảng 0,5 giây.

### Viên x2 / x3

Viên **mới rơi xuống** có thể mang hệ số. Khi ăn, viên x2 tính là 2 viên, x3 là 3 viên (cho mọi loại: ⚔ sát thương, 💗 hồi, 🌀 choáng, 🛡 khiên, 🔥 nộ). Trận càng dài thì càng hay xuất hiện, giúp kết thúc các trận kéo dài.

| Lượt | Tỉ lệ x2 mỗi viên mới | Tỉ lệ x3 |
|---|---|---|
| 1–8 | 0% | 0% |
| 20 | ~7% | 0% |
| 30 | ~13% | ~4% |
| 33+ | 15% (trần) | ~5% |
| 40+ | 15% | 8% (trần) |

- **Hiển thị:** nhãn nghiêng "x2" (xanh dương) hoặc "x3" (cam hồng, nhấp nháy) ở góc dưới phải viên. Nhãn rơi cùng viên.
- **Số liệu:** `CFG.mulGem` trong `data/config.js`. Khi thêm viên này, HP boss 3/4/5 đã tăng để giữ đường cong độ khó (`design/BOSS.md`).
- **Asset sau này:** huy hiệu x2 / x3 40×24 thay nhãn CSS.


**ULT** dùng bất cứ lúc nào, không mất nước đi: chạm pet → pet `ult` + `ult` sfx + thông báo tên pet (500 ms). Nếu là ULT sát thương (`nuke`) thì có số vàng to trên boss. Nếu là ULT hồi máu hoặc khiên thì có 💚 / 🛡️ trên cả đội.

---

## E. Asset

| Asset | Trạng thái | Ghi chú |
|---|---|---|
| Nền 5 đảo `bg_<hệ>` | **Có** | `assets/battle/`, ảnh gốc ở `design/source/battle_bg/` |
| Ảnh pet 7 tư thế (`idle attack hurt ult down happy`, bản `_L`) | **Có** cho 5 pet | `assets/pets/` |
| **Ảnh 5 boss** | **Cần làm** | 512×512 nền trong suốt, **quay mặt sang trái**, toàn thân, chân chạm đáy. Hiện đang dùng bóng "?" (`boss_unknown`) |
| Ô thông tin pet / đầu boss | Tạm bằng CSS | Nếu vẽ: khung 150×36 và 195×52, nền tối trong suốt, viền vàng mảnh |
| Khung thanh máu, nộ | Tạm bằng CSS | Nếu vẽ: dải 9-slice cao 10 |
| Nhãn ULT | Tạm bằng CSS | Nếu vẽ: huy hiệu 40×18 cam vàng |
| Ngọc 5 loại (⚔ 💗 🌀 🛡 🔥) | Tạm bằng emoji trên ô màu | Nếu vẽ: 5 viên 96×96, hình khối khác nhau để người mù màu vẫn phân biệt |
| Hiệu ứng nổ, combo | Tạm bằng CSS | Sau này |

**Lệnh vẽ ảnh boss (mẫu):**
> Chibi boss monster, [hệ: Kim/Mộc/Thủy/Hỏa/Thổ] theme, full body, facing LEFT, standing, bold outline, soft cel shading, vivid colors matching the pet-ui-kit style, transparent background, 512×512, no text.

---

## F. Kiểm tra

- [ ] Ở 844×390: không có gì đè lên bàn cờ, ô thông tin của 3 pet không chồng lên nhau.
- [ ] Ở 932×430 và 568×320: bố cục phóng đều, không bị cắt.
- [ ] 3 pet thẳng cột. Tên boss thẳng mép trên bàn cờ, chip Đòn kế sát dưới ảnh boss. Icon hệ/vai trò giống trang Pet.
- [ ] Chữ nhỏ nhất (8px, số máu) vẫn đọc được trên cả 5 nền.
- [ ] Chạy `?autotest&fast&boss=0&seed=4` → tiêu đề trang hiện `AUTOTEST win`.
