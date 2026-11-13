# Pokiwar-lite — Kế hoạch triển khai bản mobile web (MVP)

Đọc cùng: `sim.js` (luật + số cân bằng đã mô phỏng), `balance-report.txt` (kết quả).
Nguyên tắc: **luật game chỉ có một nơi duy nhất** (`engine.js`), cả bản web lẫn `sim.js` dùng chung. Không viết lại luật trong code giao diện.

---

## 1. Quyết định kỹ thuật

| Mục | Chọn | Lý do |
|---|---|---|
| Nền tảng | Mobile web, PWA | Một codebase, chia sẻ bằng link, sửa số cân bằng không cần duyệt store |
| Ngôn ngữ | JavaScript thuần, ES modules, **không bundler, không framework** | Game 1 màn chiến đấu; DOM + CSS đủ dùng. Thêm Vite chỉ khi file quá nhiều |
| Vẽ bàn cờ | DOM lưới 6×6 + CSS `transform`/`transition` | Hoạt ảnh trượt/rơi bằng CSS, không cần Canvas |
| Hướng màn hình | **Ngang** (landscape), khoá bằng lớp phủ "hãy xoay ngang" khi đang dọc | Cột pet bên trái, bàn giữa, boss bên phải, như thiết kế |
| Lưu dữ liệu | `localStorage` (có try/catch) | MVP đủ dùng; iOS có thể xoá dữ liệu → bước sau thêm tài khoản/server |
| Ngôn ngữ giao diện | Tiếng Việt, chuỗi tập trung ở `data/strings.js` | Dễ thêm ngôn ngữ sau |
| Đồ hoạ tạm | Emoji + CSS cho viên và pet, thay bằng ảnh sau | Không chặn tiến độ vì chưa có art |

Khoảng thiết kế: màn hình mục tiêu **640×360 đến 915×412** (CSS px, ngang). Layout co theo `vh`, tối thiểu chạm 44px.

---

## 2. Cấu trúc file

```
index.html            một trang, các màn là <section> bật/tắt
style.css
manifest.webmanifest  sw.js   icons/
engine.js             LUẬT: bàn, dây chuyền, hiệu ứng viên, boss, aggro, choáng, nộ, ult
data/config.js        CFG (tỉ lệ rơi, hồi %, khiên %, ...)
data/pets.js          9 pet
data/bosses.js        3 boss
data/strings.js       chữ hiển thị
ui/app.js             điều hướng giữa các màn, lưu/tải
ui/battle.js          màn chiến đấu: vẽ, vuốt, hoạt ảnh, HUD
ui/screens.js         các màn còn lại (home, chọn đội, chọn boss, kết quả, pet, cài đặt)
ui/audio.js           âm thanh (tải lười, bật sau lần chạm đầu)
sim.js                chạy bằng Node, import engine.js + data/*
```

**Việc đầu tiên (M0):** tách `sim.js` hiện tại. Phần luật và dữ liệu chuyển sang `engine.js` và `data/*`, `sim.js` chỉ giữ bot và báo cáo. Sau khi tách, `node sim.js 300` phải cho **kết quả giống hệt** trước khi tách (cùng seed) để chứng minh không làm đổi luật.

---

## 3. Bản đồ màn hình

```
Tải ─► Chạm để bắt đầu ─► TRANG CHỦ ─┬─► Chọn boss ─► Chọn đội ─► CHIẾN ĐẤU ─► Kết quả ─┐
                                      ├─► Bộ sưu tập pet ─► Chi tiết pet                 │
                                      └─► Cài đặt                                        │
                                      ◄──────────────────────────────────────────────────┘
```

| # | Màn | Mục đích | Thành phần chính | Ghi chú MVP |
|---|---|---|---|---|
| 1 | Tải | Nạp tài nguyên | Thanh tiến độ | Rất nhẹ, dưới 2 MB |
| 2 | Chạm để bắt đầu | Mở khoá âm thanh trình duyệt, vào chế độ toàn màn hình | Logo, "Chạm để chơi" | Bắt buộc vì trình duyệt chặn tự phát tiếng |
| 3 | Trang chủ | Cổng vào | Nút Chơi, Pet, Cài đặt; hiển thị tiến độ (boss đã hạ) | |
| 4 | Chọn boss | Chọn 1 trong 3 boss | Thẻ boss: HP, mẫu đòn, cảnh báo ngưỡng choáng; khoá boss kế đến khi hạ boss trước | Mở tuần tự |
| 5 | Chọn đội | Chọn 3 pet và **thứ tự cột** | 9 pet, 3 ô cột trên xuống; hiện aggro %, xác suất trúng lan theo vị trí | Thứ tự quan trọng vì đòn lan |
| 6 | **Chiến đấu** | Lõi game | Xem mục 4 | Phần lớn công việc |
| 7 | Kết quả | Thắng/thua | Số nước, máu còn, pet chết; nút Chơi lại, Chọn boss, Trang chủ | Thắng thì mở boss kế |
| 8 | Bộ sưu tập pet | Xem 9 pet | Lưới 9 pet, lọc theo vai | |
| 9 | Chi tiết pet | Xem chỉ số | HP/ATK/DEF/Aggro, mô tả ult | |
| 10 | Cài đặt | Tuỳ chọn | Âm thanh, nhạc, rung, xoá dữ liệu | |
| 11 | Hướng dẫn | Dạy luật | Lớp phủ chỉ dẫn từng bước trong **trận đầu tiên** (không phải màn riêng) | Xem mục 6 |

Màn ngoài MVP, chỉ ghi nhận để không thiết kế chồng chéo: cửa hàng, nhiệm vụ hàng ngày, xếp hạng, đăng nhập, nâng cấp pet, gacha.

---

## 4. Màn chiến đấu

### Bố cục (ngang)
```
┌────────────────────────────────────────────────────────────┐
│ ⏸  Nước 12/50                       Boss: tên  [icon đòn kế] │
│ ┌─────┐                              HP ███████░░  7000    │
│ │Pet 1│   ┌──────────────────┐       Choáng ▮▮▯▯▯▯▯▯        │
│ │Pet 2│   │   Bàn 6×6        │       ┌──────────┐           │
│ │Pet 3│   │                  │       │  BOSS    │           │
│ └─────┘   └──────────────────┘       └──────────┘           │
└────────────────────────────────────────────────────────────┘
```
Mỗi pet (cột trái, trên xuống) gồm: hình, **HP** (thanh), **khiên** (phủ lên thanh HP), **Nộ** (thanh nhỏ), **tỉ lệ bị nhắm %** (cập nhật theo pet còn sống), nút **ULT** sáng khi nộ đủ 100.

### Máy trạng thái của một lượt
```
CHỜ ─(vuốt hợp lệ)─► ĐỔI CHỖ ─► ĂN & RƠI (lặp theo dây chuyền) ─► ÁP HIỆU ỨNG ─► KIỂM TRA THẮNG
  ▲                                                                               │ còn boss
  │                                                    ┌──── choáng? ◄───────────┘
  │                                                    ▼ không                  ▼ có
  └─ KIỂM TRA THUA ◄─ BOSS ĐÁNH (hiện đòn, trúng ai) ◄─ boss bỏ lượt (hiện "CHOÁNG")
```
- Khi **không ở trạng thái CHỜ**, mọi thao tác trên bàn bị bỏ qua (khoá đầu vào).
- Nút ULT bấm được ở **CHỜ** và là hành động miễn phí, không tốn nước đi.
- Bàn hết nước đi hợp lệ → hiện "Xáo bàn" rồi xáo lại, không tính nước.

### Danh sách cơ chế phải làm
| Cơ chế | Luật (theo `engine.js`) | Biểu hiện trên màn hình |
|---|---|---|
| Đổi chỗ hai viên kề | Chỉ chấp nhận nếu tạo ra ≥1 nhóm 3+ cùng loại; không hợp lệ thì **trượt về chỗ cũ** | Vuốt hoặc chạm-chạm; rung nhẹ khi sai |
| Ăn và rơi | Nhóm ≥3 theo hàng/cột bị xoá, viên trên rơi xuống, ô trống sinh viên mới theo tỉ lệ rơi | Hoạt ảnh nổ, rơi |
| Dây chuyền | Hệ số sát thương mỗi đợt: ×1, 1.3, 1.6, 1.9, 2.0 (trần) | Chữ "x1.3 COMBO" |
| Kiếm | Sát thương mỗi pet = ATK × số kiếm × hệ số đợt, cộng cho từng pet còn sống | Số sát thương bay lên boss |
| Tim | Mỗi viên hồi 8% HP tối đa cho pet có tỉ lệ HP thấp nhất | Số xanh trên pet được hồi |
| Khiên | Mỗi viên +5% HP tối đa cho từng pet, trần 30%; khiên hấp thụ trước HP | Lớp xanh dương phủ lên thanh HP |
| Xoắn (choáng) | Mỗi viên +1 vào thanh Choáng; đầy → boss bỏ lượt kế; nước đi sau **+50% sát thương** và **miễn nhiễm** choáng | Thanh dưới HP boss; biểu tượng "choáng" |
| Lửa (nộ) | Mỗi viên +5 nộ cho cả đội | Thanh nộ nhích lên |
| Nộ khi bị đánh | Mỗi lần trúng đòn +20 (kể cả khiên đỡ hết) | |
| Ult | Nộ ≥100 thì dùng được, về 0 sau khi dùng. Tanker: khiên cả đội; Hỗ trợ: hồi cả đội; AD: sát thương lớn lên boss | Nút sáng, hiệu ứng riêng cho từng loại |
| Aggro | Boss chọn mục tiêu theo xác suất ∝ aggro các pet còn sống (200/100/75) | Hiện % trên từng pet |
| 3 kiểu đòn boss | **Đơn** (hệ số 1.0), **lan** (chính 0.8, hai pet kề 0.5), **toàn đội** (0.5 mỗi pet); xoay vòng theo mẫu của boss | Biểu tượng đòn kế tiếp trên boss, báo trước |
| Công thức sát thương nhận | `dame = ATK_boss × hệ số kiểu × 100/(100+DEF)` | |
| Thắng | HP boss ≤ 0 | |
| Thua | Cả 3 pet chết, hoặc quá 50 nước (boss nổi điên) | |

Số tham chiếu cho `data/config.js`: tỉ lệ rơi `[24,19,19,19,19]` (Kiếm, Tim, Xoắn, Khiên, Lửa), 6×6. **Không đổi các số này khi làm giao diện** — mọi chỉnh cân bằng phải qua `sim.js` trước.

### Viên (đã chốt theo bạn)
| Loại | Màu nền | Biểu tượng |
|---|---|---|
| Tim (hồi máu) | xanh lá | tim hồng |
| Lửa (nộ) | đỏ | lửa đỏ-vàng |
| Xoắn (choáng) | xám | xoắn ốc xám |
| Khiên | tím | khiên xanh dương |
| Kiếm (công) | vàng | kiếm vàng nhạt |

Mỗi viên cần cả màu lẫn hình để người mù màu phân biệt được.

---

## 5. Điều khiển trên điện thoại
- Dùng **Pointer Events**; `touch-action: none` trên bàn cờ để không cuộn trang.
- Vuốt từ viên A sang ô kề (ngưỡng ~30% ô) thì đổi; cũng hỗ trợ chạm viên A rồi chạm viên kề.
- Chạm tối thiểu 44 px; bàn cờ vuông, cỡ theo chiều cao màn hình trừ HUD.
- Gợi ý nước đi sau **5 giây** không thao tác (làm nhấp nháy một cặp hợp lệ).
- Chống nhấn đúp thu phóng: `meta viewport` với `user-scalable=no`, `touch-action: manipulation`.
- Rung: `navigator.vibrate` nếu có (iOS không hỗ trợ, nên phải là tuỳ chọn thêm, không phụ thuộc vào).

---

## 6. Hướng dẫn trong trận đầu (3–5 lượt, không có boss đánh mạnh)
1. "Vuốt để đổi hai viên, ghép 3 cùng loại" (chỉ cho phép một nước kiếm cố định).
2. "Kiếm đánh boss" → giải thích Tim, Khiên.
3. "Boss đánh vào pet. Xem % trên mỗi pet" → chỉ vào aggro và biểu tượng đòn kế tiếp.
4. "Xoắn làm boss choáng", "Lửa nạp nộ để dùng ULT".
Chỉ hiện một lần; lưu cờ `tutorialDone`; có nút bỏ qua.

---

## 7. Dữ liệu lưu (`localStorage`, khoá `pokiwar-lite-v1`)
```json
{ "version": 1, "bossesCleared": [1], "lastTeam": ["Rùa Đá","Mèo Tiên","Hổ Lửa"],
  "tutorialDone": true, "settings": { "sfx": 1, "music": 0.5, "vibrate": true },
  "stats": { "battles": 14, "wins": 6 } }
```
Có `version` để di trú sau này. Mọi đọc/ghi bọc trong `try/catch`; nếu hỏng thì dùng mặc định, không làm sập game.

## 8. PWA
- `manifest.webmanifest`: tên, biểu tượng 192/512, `display: standalone`, `orientation: landscape`.
- `sw.js`: lưu cache các file tĩnh để chơi được khi mất mạng (chỉ file của game, không có API nào).
- Gợi ý "Thêm vào màn hình chính" (nhất là iOS) ở Trang chủ.

## 9. Âm thanh
Hiệu ứng ăn, combo, boss đánh, ult, thắng, thua. Chỉ phát sau lần chạm đầu (màn "Chạm để bắt đầu"). Mỗi âm là file ngắn; nhạc nền để sau.

---

## 10. Các mốc triển khai

Mỗi mốc có **tiêu chí hoàn thành chạy kiểm tra được**. Làm theo thứ tự, không nhảy.

| Mốc | Việc | Hoàn thành khi |
|---|---|---|
| **M0** Tách luật | Tách `engine.js`, `data/*`; `sim.js` import lại. Thêm API theo bước (`doMove`, `bossTurn`, `useUlt`) trả về **danh sách sự kiện** để giao diện hoạt ảnh | `node sim.js 300` ra **cùng số liệu** như trước tách |
| **M1** Bàn cờ chơi được | Vẽ lưới 6×6, vuốt đổi, ăn, rơi, dây chuyền, xáo bàn, gợi ý | Chơi liên tục 50 nước trên điện thoại thật, không kẹt, không lỗi console |
| **M2** Vòng chiến đấu | 3 pet + 1 boss, hiệu ứng 5 viên, boss đánh theo aggro và mẫu đòn, nộ và ult, choáng, thắng/thua | Một trận đánh từ đầu đến hết, số liệu khớp `engine.js` (kiểm bằng cách chạy cùng seed trong UI và trong Node) |
| **M3** HUD và phản hồi | Thanh HP/khiên/nộ/choáng, % aggro, biểu tượng đòn kế, số sát thương bay, hoạt ảnh | Người ngoài nhìn vào hiểu được đòn kế và ai có nguy cơ bị đánh |
| **M4** Điều hướng và dữ liệu | Các màn 3–10, chọn đội và thứ tự, mở boss tuần tự, lưu/tải | Thoát tải lại trang vẫn giữ tiến độ; tắt `localStorage` vẫn chơi được |
| **M5** Hướng dẫn và âm thanh | Trận hướng dẫn, âm thanh, cài đặt | Người chưa biết luật thắng được Boss 1 mà không cần hỏi |
| **M6** PWA và tối ưu | Manifest, service worker, ngoại tuyến, đo hiệu năng | Cài được vào màn hình chính; mất mạng vẫn chơi; giữ ~60 fps trên máy tầm trung |
| **M7** Thử nghiệm với người chơi | Ghi log ẩn danh (boss, thắng/thua, số nước, đội) vào console hoặc file | So tỉ lệ thắng thực tế với `sim.js`; chỉnh số nếu lệch >15 điểm |

Mục tiêu tỉ lệ thắng (smart bot): Boss 1 ~95%, Boss 2 ~72%, Boss 3 ~38%. Người thật có thể cao hơn bot, nên dùng M7 để chốt lại.

---

## 11. Quyết định đang đặt mặc định (sửa nếu khác ý)
1. **Hướng ngang** cố định.
2. **Cả 9 pet** dùng được từ đầu; mở khoá theo tiến độ để sau MVP.
3. **Ult miễn phí**, không tốn nước đi; pet chết **không được hồi sinh**.
4. Chỉ chạy **trên thiết bị, không có máy chủ** ở MVP.
5. Hình ảnh tạm bằng **emoji và CSS**.
6. Không tiền tệ, không quảng cáo, không đăng nhập.

## 12. Ngoài MVP (cố ý bỏ)
Viên đặc biệt (bom, cầu vồng, đá), kiểu đòn bounce, nâng cấp pet, cửa hàng, nhiệm vụ, xếp hạng, đa người chơi, thông báo đẩy, bản đóng gói lên store (Capacitor), tài khoản và lưu trên máy chủ.

## 13. Rủi ro chính
| Rủi ro | Giảm thiểu |
|---|---|
| Hoạt ảnh trượt và rơi làm trạng thái bàn lệch với `engine.js` | Giao diện **chỉ phát lại** danh sách sự kiện từ engine, không tự tính luật |
| Vuốt trên iOS Safari kéo cả trang | `touch-action: none` và `preventDefault` trên bàn, kiểm thử trên iPhone thật |
| Bàn đông chiến thắng/thua không như mô phỏng vì người chơi khác bot | M7: lấy số liệu thực, hiệu chỉnh bằng `sim.js` |
| Màn hình ngang nhỏ chật (cột pet + bàn + boss) | Thiết kế theo 640×360 trước, kiểm trên máy thật nhỏ nhất |
| `localStorage` bị xoá | MVP chấp nhận; thêm lưu máy chủ sau khi có người chơi |
