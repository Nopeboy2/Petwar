# Pokiwar-lite — Kế hoạch giai đoạn 2: Trang chủ, Nuôi pet, Chiến dịch, Đồ hoạ 2D

Tiếp nối `PLAN.md` (MVP đã chạy được: 3 boss, chọn đội, chiến đấu, kết quả).
Nguyên tắc giữ nguyên: **luật và số chỉ nằm ở `engine.js` + `data/*`**; mọi số mới (cấp pet, độ khó màn) phải được kiểm bằng `sim.js` trước khi đưa vào game.

---

## 1. Phạm vi

| Phần | Có trong giai đoạn 2 | Để sau |
|---|---|---|
| Trang chủ | Sảnh có đội hình, tiền tệ, lối vào các chức năng | Sự kiện, thư, nhiệm vụ ngày |
| Nuôi pet | Lên cấp bằng Vàng + EXP, mở khoá pet theo tiến độ chiến dịch | Tiến hoá, kỹ năng phụ, trang bị, gacha |
| Chiến dịch | 3 chương × 10 màn = 30 màn, sao 1–3, quái thường + boss cuối chương | Màn ẩn, chế độ khó, sự kiện giới hạn |
| Đồ hoạ 2D | Bộ hình viên, pet, boss, nền, khung UI, hiệu ứng | Hoạt hình xương (Spine), nhạc nền riêng từng chương |

Không có: thể lực/năng lượng, quảng cáo, nạp tiền, đăng nhập. (Lý do: thêm áp lực kiếm tiền trước khi lõi game được kiểm chứng.)

---

## 2. Hệ thống nuôi pet

### Tiền tệ và tài nguyên
| Tên | Kiếm từ đâu | Dùng để |
|---|---|---|
| 🪙 Vàng | Thắng màn (nhiều hơn theo sao và lần đầu) | Lên cấp pet |
| ⭐ Sao | 1–3 sao mỗi màn | Mở rương mốc sao của chương (Vàng thưởng) |
| EXP pet | Pet tham chiến nhận EXP khi thắng | Đủ EXP mới được lên cấp |

Hai điều kiện lên cấp (đủ EXP **và** trả Vàng) để người chơi phải dùng pet trong trận, không chỉ bỏ tiền.

### Cấp và chỉ số (mặc định, kiểm lại bằng sim)
- Cấp 1–30. Giới hạn cấp theo chương: Chương 1 tối đa cấp 10, Chương 2 cấp 20, Chương 3 cấp 30 (chống cày quá mạnh rồi đi xuyên game).
- HP, ATK, DEF tăng **+6% mỗi cấp** so với chỉ số gốc: `stat(lv) = gốc × (1 + 0.06 × (lv − 1))` → cấp 30 ≈ 2,74× gốc.
- Aggro **không** đổi theo cấp (giữ vai trò rõ ràng).
- Sức mạnh ULT tăng theo ATK/HP tự nhiên (nuke theo ATK, khiên/hồi theo %HP).
- EXP cần: `exp(lv) = 50 × lv`. Vàng cần: `vàng(lv) = 40 × lv^1.4` (làm tròn 10).

### Mở khoá pet
Bắt đầu với 3 pet (1 Tanker, 1 Hỗ trợ, 1 AD). 6 pet còn lại mở khi qua các màn mốc (ví dụ 1-3, 1-6, 1-10, 2-5, 2-10, 3-5). Không gacha → người chơi biết trước khi nào có pet nào.

---

## 3. Chiến dịch

### Cấu trúc
- **3 chương × 10 màn.** Màn 1–9: quái thường; màn 10: boss chương (dùng 3 boss hiện có, mạnh lên theo chương).
- Mỗi chương có nền và màu riêng (Rừng, Núi lửa, Lâu đài bóng tối — gợi ý).
- Màn mở tuần tự; thắng màn trước mới mở màn sau.

### Kẻ địch
Mỗi màn có **một** kẻ địch (giữ luật 1 boss/trận như hiện tại) gồm: HP, ATK, ngưỡng choáng, mẫu đòn, hình.
- Số được **sinh bằng công thức** theo chỉ số màn + bảng ghi đè cho màn đặc biệt:
  `HP = 3000 × 1.12^(n−1)`, `ATK = 300 × 1.07^(n−1)` (n = số thứ tự màn 1–30), boss cuối chương × 1.5 HP.
- Mẫu đòn mở dần: chương 1 chỉ đơn + lan, chương 2 thêm toàn đội, chương 3 mẫu dồn dập hơn.
- Công thức trên là **điểm xuất phát**; số cuối cùng chốt bằng sim (mục 7).

### Sao
| Sao | Điều kiện |
|---|---|
| ⭐ | Thắng |
| ⭐⭐ | Thắng trong ≤ ngưỡng nước của màn (mặc định 30) |
| ⭐⭐⭐ | Thắng và **không pet nào chết** |
Rương mốc sao: 10 / 20 / 30 sao mỗi chương.

### Phần thưởng
- Lần đầu thắng: Vàng × 3. Thắng lại: Vàng thường + EXP (cày được, nhưng giới hạn cấp theo chương chặn lạm dụng).

### Đường cong độ khó (mục tiêu kiểm bằng sim, bot smart, pet ở **cấp kỳ vọng** của màn)
| Màn | Thắng mục tiêu |
|---|---|
| Màn thường đầu chương | 90–95% |
| Màn thường cuối chương | 70–80% |
| Boss chương | 50–65% |

"Cấp kỳ vọng" = cấp người chơi đạt được nếu chơi mỗi màn 1–2 lần. Sim tính ra cấp này từ bảng thưởng → kiểm rằng không có màn nào bắt buộc cày.

---

## 4. Đồ hoạ 2D

### Cách vẽ (quyết định kỹ thuật)
| Lựa chọn | Chọn? | Lý do |
|---|---|---|
| **DOM + CSS + ảnh (PNG/WebP), sprite sheet bằng CSS `steps()`** | ✅ | Giữ nguyên code hiện có; đủ cho match-3 theo lượt; nhẹ trên điện thoại |
| PixiJS (Canvas/WebGL) | Chỉ khi cần | Thêm khi hiệu ứng hạt dày đặc làm DOM giật (đo trên máy thật trước) |
| Spine / hoạt hình xương | Để sau | Đẹp nhưng cần công cụ + hoạ sĩ chuyên |

Bàn cờ vẫn là lưới DOM; chỉ thay emoji bằng ảnh viên. Pet/boss là ảnh có sprite sheet các trạng thái.

### Phong cách gợi ý
2D chibi, viền đậm, màu bão hoà, nền hơi mờ để viên và pet nổi lên. Dễ đọc ở màn 568×320.

### Danh sách tài sản (asset)
| Nhóm | Số lượng | Nội dung | Kích thước gốc |
|---|---|---|---|
| Viên | 5 + hiệu ứng | Theo mô tả đã chốt: xanh lá/tim hồng, đỏ/lửa đỏ-vàng, xám/xoắn ốc xám, tím/khiên xanh dương, vàng/kiếm vàng nhạt; mỗi viên thêm 1 khung "nổ" | 128×128 |
| Pet | 9 × 4 trạng thái | Đứng (idle, 4–6 khung), tấn công, bị đánh, ULT | 256×256 mỗi khung |
| Kẻ địch | ~10 quái + 3 boss | Đứng, tấn công (theo 3 kiểu đòn), bị đánh, choáng | 384×384 |
| Nền | 3 chương + sảnh | Nền chiến đấu, nền bản đồ chương, nền sảnh | 1920×1080 (cắt được cho ngang) |
| Khung UI | 1 bộ | Nút (thường/chính/khoá), bảng, thanh HP/khiên/nộ/choáng, khung thẻ pet, ngôi sao, biểu tượng tiền | 9-slice PNG |
| Biểu tượng | ~20 | Vai trò (T/S/D), kiểu đòn (🎯💥🌊), choáng, tiền tệ, cài đặt | 64×64 |
| Hiệu ứng | ~8 | Chém, hồi máu, khiên, choáng, nổ combo, ULT ×3 loại | sprite sheet |

Định dạng: **WebP** (có dự phòng PNG), bản @1x và @2x. Gom ảnh nhỏ (viên, icon) thành một atlas để giảm số lần tải.

### Nguồn hình
1. **Giai đoạn đầu:** gói hình miễn phí/thương mại (CC0, itch.io) hoặc hình AI để thay emoji → kiểm bố cục với hình thật.
2. **Sau khi chốt bố cục:** đặt hoạ sĩ vẽ bộ chính thức theo danh sách trên.
Code đọc hình qua **một bảng ánh xạ** (`data/art.js`: tên → đường dẫn ảnh) để thay bộ hình mà không sửa code giao diện. Thiếu ảnh thì tự rơi về emoji hiện tại.

### Ngân sách hiệu năng
- Tổng tải lần đầu ≤ **5 MB**; hình chương 2–3 tải lười khi vào chương.
- Hoạt ảnh chỉ dùng `transform`/`opacity` (GPU), không đổi kích thước/layout trong lúc chạy.
- Giữ ~60 fps trên máy tầm trung; đo bằng DevTools trên điện thoại thật.

---

## 5. Giao diện từng màn

Tất cả màn ngang, thiết kế cho **640×360**, co giãn tới 915×412. Thanh trên cùng (tiền tệ) dùng chung.

### 5.1 Trang chủ (sảnh)
```
┌──────────────────────────────────────────────────────────────┐
│ [avatar] Tên người chơi        🪙 12,340   ⭐ 45      ⚙      │
│                                                              │
│      ┌──────┐  ┌──────┐  ┌──────┐                            │
│      │ Pet1 │  │ Pet2 │  │ Pet3 │      ┌──────────────────┐  │
│      │ idle │  │ idle │  │ idle │      │  ▶ CHIẾN DỊCH    │  │
│      └──────┘  └──────┘  └──────┘      │  Màn kế: 1-4     │  │
│        Đội hình hiện tại (chạm để sửa) └──────────────────┘  │
│                                                              │
│  [🐾 Pet]   [👥 Đội hình]   [📖 Hướng dẫn]                    │
└──────────────────────────────────────────────────────────────┘
```
- Nền sảnh, 3 pet trong đội đứng hoạt ảnh idle.
- Nút lớn "Chiến dịch" ghi màn kế tiếp; chạm vào là vào thẳng màn đó (nhanh nhất cho người chơi quay lại).
- Chấm đỏ thông báo trên nút Pet khi có pet đủ điều kiện lên cấp.

### 5.2 Bản đồ chiến dịch
```
┌──────────────────────────────────────────────────────────────┐
│ ←  Chương 1: Rừng Xanh            ⭐ 14/30   [🎁10][🎁20][🎁30]│
│                                                              │
│   (1)⭐⭐⭐──(2)⭐⭐──(3)🐾──(4)●──(5)🔒── … ──(10)👹           │
│                                                              │
│   ◀ Chương trước                         Chương sau ▶ (🔒)   │
└──────────────────────────────────────────────────────────────┘
```
- Đường đi nối các nút màn trên nền chương; vuốt ngang để cuộn.
- Trạng thái nút: đã qua (hiện sao), đang mở (nhấp nháy), khoá, có thưởng pet (🐾), boss (to hơn).
- Rương mốc sao ở góc phải, sáng khi nhận được.

### 5.3 Thông tin màn (cửa sổ nổi khi chạm một màn)
```
┌─────────────── Màn 1-4 ───────────────┐
│  [hình quái]   HP 4,200   ATK 370      │
│                Đòn: 🎯 → 🎯 → 💥        │
│                Choáng: 6 viên 🌀        │
│  Sao: ⭐ thắng  ⭐ ≤30 nước  ⭐ không chết │
│  Thưởng: 🪙 120 (lần đầu ×3) + EXP     │
│        [Đổi đội]      [▶ Đánh]         │
└────────────────────────────────────────┘
```
Hiện "Lực chiến đội" so với "Lực chiến đề xuất" của màn (màu xanh/vàng/đỏ) để người chơi biết nên nuôi thêm pet chưa.

### 5.4 Đội hình
Giống màn chọn đội hiện có, thêm: cấp của pet, lực chiến đội, pet chưa mở hiện bóng đen kèm "Mở ở màn 2-5". Giữ phần % bị nhắm và % trúng lan theo ô.

### 5.5 Chiến đấu (2D)
```
┌──────────────────────────────────────────────────────────────┐
│ ⏸  1-4  Nước 6/50   [tóm tắt nước vừa đi]                    │
│ ┌────────┐   ┌──────────────────┐   ┌──────────────────────┐ │
│ │Pet1 ❤🛡🔥│   │                  │   │   HP ████████░░      │ │
│ │Pet2 ❤🛡🔥│   │    Bàn 6×6        │   │   Choáng ▮▮▯▯▯▯     │ │
│ │Pet3 ❤🛡🔥│   │    (ảnh viên)     │   │   [ảnh boss động]    │ │
│ └────────┘   └──────────────────┘   │   Đòn kế: 💥 Lan      │ │
│  (nền chương phía sau, mờ)          └──────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```
Bố cục giữ như hiện tại (người chơi đã quen). Thay đổi:
- Pet và boss là ảnh có hoạt ảnh: idle liên tục; **tấn công** khi ăn kiếm (pet nhảy về phía boss); **bị đánh** (nháy đỏ, lùi); **ULT** (phóng to + hiệu ứng riêng).
- Đòn boss có hiệu ứng theo kiểu: 🎯 một tia vào một pet, 💥 vụ nổ lan sang ô kề, 🌊 sóng quét cả cột.
- Viên nổ có mảnh vỡ; combo hiện chữ lớn "COMBO ×1.6".
- Khi boss bị choáng: vòng sao quay trên đầu, viền màn hình vàng nhạt nhắc "+50% sát thương".

### 5.6 Kết quả
```
┌──────────────────────────────────────┐
│          🏆 CHIẾN THẮNG                │
│        ⭐  ⭐  ☆   (sao bật lần lượt)   │
│  🪙 +360   EXP +80                     │
│  [Pet1 Lv5 ▮▮▮▯] [Pet2 …] [Pet3 …]    │ ← thanh EXP chạy, "LÊN ĐƯỢC CẤP!"
│  🐾 Mở khoá: Thỏ Ngọc!                 │
│  [Chơi lại] [Màn kế ▶] [Bản đồ]        │
└──────────────────────────────────────┘
```
Thua: gợi ý cụ thể dựa trên trận (ví dụ "Pet chết vì đòn lan → thử đặt Tanker ở giữa" hoặc "Lực chiến thấp → nâng cấp pet").

### 5.7 Danh sách pet
Lưới thẻ: ảnh, tên, vai, cấp, chấm đỏ nếu lên cấp được. Lọc theo vai; pet khoá hiện bóng đen + điều kiện mở.

### 5.8 Chi tiết & nâng cấp pet
```
┌──────────────────────────────────────────────────────────────┐
│ ←  Rùa Đá · Tanker · Lv 7                                     │
│  ┌──────────┐   HP   1,600 → 1,696  (+96)                    │
│  │ ảnh lớn   │   ATK     30 →    32                            │
│  │ idle     │   DEF     50 →    53                             │
│  └──────────┘   Aggro  200 (không đổi)                         │
│                 ULT: Khiên cả đội +25% HP                      │
│  EXP ▮▮▮▮▮▮▯▯ 300/350        [⬆ Lên cấp  🪙 620]               │
└──────────────────────────────────────────────────────────────┘
```
Hiện chỉ số **trước → sau** khi lên cấp; nút mờ kèm lý do nếu thiếu EXP/Vàng/chạm giới hạn chương.

### 5.9 Cài đặt
Giữ như hiện tại, thêm: chất lượng hình (Thấp = tắt hiệu ứng hạt), tốc độ hoạt ảnh (1×/1.5×/2×).

### Điều hướng tổng
```
Bắt đầu → TRANG CHỦ ─┬─ Chiến dịch ─ Bản đồ ─ Thông tin màn ─ (Đội hình) ─ Chiến đấu ─ Kết quả ─┐
                    ├─ Pet ─ Chi tiết/Nâng cấp                                                │
                    ├─ Đội hình                                                               │
                    └─ Cài đặt                     ◄──────────────────────────────────────────┘
```
Màn "Chọn boss" hiện tại được thay bằng Bản đồ chiến dịch.

---

## 6. Dữ liệu

### Tệp dữ liệu mới
```
data/stages.js   30 màn: { id:'1-4', enemy:{...}, starMoves:30, reward:{gold,exp}, unlockPet? }
data/enemies.js  quái thường (hình + mẫu đòn); boss lấy từ bosses.js
data/progress.js công thức cấp, EXP, vàng, giới hạn cấp theo chương
data/art.js      tên → đường dẫn ảnh (thiếu thì dùng emoji)
```

### Lưu tiến độ v2 (di trú từ v1)
```json
{ "version": 2, "gold": 0, "stages": { "1-1": 3, "1-2": 2 },
  "pets": { "Rùa Đá": { "lv": 7, "exp": 300 }, "Mèo Tiên": { "lv": 5, "exp": 40 } },
  "team": ["Rùa Đá","Mèo Tiên","Hổ Lửa"], "chests": ["1-10"],
  "tutorialDone": true, "settings": { "sfx": 1, "vibrate": true, "quality": "high", "speed": 1 } }
```
Di trú v1 → v2: `cleared` boss cũ được quy đổi thành đã qua màn boss chương tương ứng; mọi pet về cấp 1.

### Engine
`createGame` nhận pet **đã tính chỉ số theo cấp** (hàm `petAtLevel` trong `data/progress.js`) → engine không cần biết đến cấp. Luật chiến đấu không đổi.

---

## 7. Cân bằng (sim mở rộng)

Thêm vào `sim.js`:
1. **Mô phỏng tiến trình:** người chơi ảo chơi màn 1 → 30, thắng thì nhận thưởng và nâng cấp đội; thua thì đánh lại. Báo cáo: số lần chơi mỗi màn, cấp đội khi tới màn đó, màn nào là "tường" (> 3 lần thua liên tiếp).
2. **Bảng thắng% theo màn** ở cấp kỳ vọng, so với đường cong mục tiêu (mục 3).
3. **Kiểm tra lạm dụng:** đội cấp tối đa của chương không được thắng boss chương sau > 30%.

Số trong mục 2–3 của tài liệu này **chỉ chốt sau khi sim đạt** các mục tiêu trên.

---

## 8. Các mốc

| Mốc | Việc | Hoàn thành khi |
|---|---|---|
| **V2-0** Dữ liệu & sim | `stages.js`, `progress.js`, sim tiến trình | Sim cho đường cong độ khó đúng mục tiêu, không có "tường" |
| **V2-1** Lưu v2 + chiến dịch (emoji) | Bản đồ, thông tin màn, sao, thưởng, mở pet; di trú v1 | Chơi 1-1 → 1-10 liên tục; tải lại trang giữ đủ tiến độ; dữ liệu v1 cũ vẫn chạy |
| **V2-2** Nuôi pet (emoji) | Danh sách pet, chi tiết, lên cấp, giới hạn theo chương | Lên cấp đúng công thức; chỉ số trong trận khớp `petAtLevel` |
| **V2-3** Trang chủ mới | Sảnh, thanh tiền tệ, vào nhanh màn kế, chấm thông báo | Từ mở game tới vào trận ≤ 2 chạm |
| **V2-4** Khung đồ hoạ 2D | `data/art.js`, nạp ảnh + dự phòng emoji, sprite sheet CSS, hiệu ứng | Thay 1 bộ hình mẫu (gói miễn phí) mà không sửa code giao diện; ≥ 55 fps máy tầm trung |
| **V2-5** Bộ hình chính thức | Thay hình hoạ sĩ theo danh sách asset | Đủ asset mục 4; tải lần đầu ≤ 5 MB |
| **V2-6** Thử nghiệm người chơi | Ghi log tiến trình (màn, thua/thắng, cấp) | So với sim tiến trình, chỉnh màn lệch > 15 điểm |

V2-0 → V2-3 làm được ngay với emoji; V2-4 dựng sẵn "khe cắm" để V2-5 chỉ là thay file ảnh.

---

## 9. Quyết định đang đặt mặc định (sửa nếu khác ý)
1. 3 chương × 10 màn, 1 kẻ địch mỗi trận.
2. Lên cấp cần cả EXP và Vàng; +6%/cấp; trần cấp theo chương.
3. Mở pet theo màn mốc, không gacha.
4. Không thể lực, không nạp tiền, không quảng cáo.
5. Đồ hoạ bằng DOM + CSS + ảnh WebP; chỉ dùng PixiJS khi đo thấy cần.
6. Hình tạm từ gói miễn phí/AI trước, hoạ sĩ vẽ bộ chính thức sau.

## 10. Rủi ro
| Rủi ro | Giảm thiểu |
|---|---|
| Nuôi pet làm hỏng cân bằng đã chỉnh | Sim tiến trình (mục 7) trước khi đưa số vào game |
| Hình to làm tải chậm trên 4G | WebP, atlas, tải lười theo chương, ngân sách 5 MB |
| Phong cách hình không đồng nhất khi trộn nhiều nguồn | Chỉ một nguồn tạm thời; bộ chính thức do một hoạ sĩ |
| Hoạt ảnh làm sai lệch trạng thái trận | Giao diện vẫn chỉ phát lại sự kiện từ engine (như hiện tại) |
| Màn bản đồ chật trên 568×320 | Cuộn ngang, nút màn ≥ 44px, kiểm trên máy nhỏ nhất |
