# Nâng cấp sức mạnh pet — Thiết kế logic

Đọc cùng: `PLAN-V2.md` §2 (kế hoạch gốc), `data/pets.js` (chỉ số gốc), `engine.js` (công thức trận).
Số trong file này đã đo bằng bot `smart` của `sim.js` (150 trận/ô), xem mục 6.

---

## 1. Tóm tắt

| Quy tắc | Công thức |
|---|---|
| Chỉ số theo cấp | `stat(lv) = gốc × (1 + 0.06 × (lv − 1))` cho **HP, ATK, DEF** |
| Cấp pet | **Không chặn**, tối đa cấp 15. Boss lên theo cấp trung bình của đội, +4% HP/ATK mỗi cấp (mục 3) |
| Lên cấp | Mỗi lần **thử**: bỏ đá cùng hệ pet vào 3 ô (tỉ lệ cộng dồn, tối đa 100%) + trả `50 × (L + 1)` vàng. **Mất đá và vàng cả khi thành công lẫn thất bại** (mục 4b) |
| Vàng thưởng boss | `50 × (thứ tự boss + 1)`; lần đầu ×3 (đang chạy: 100 / 150 / 200) |
| Đá thưởng boss | Đá **hệ của boss**, cấp = vị trí boss trong đảo (1/2/3); lần đầu 3 viên, đánh lại 2, đạt 3★ +1 |
| Không đổi theo cấp | Aggro, hệ, vai, loại ULT, % của ULT |

Lên cấp cần **vàng + đá nâng cấp theo hệ**, không có EXP (lý do ở mục 5).

---

## 2. Chỉ số theo cấp

- **+6% chỉ số gốc mỗi cấp, tăng tuyến tính.** Cấp 5 = ×1.24, cấp 10 = ×1.54, cấp 15 = ×1.84.
- **DEF cũng tăng.** Sát thương nhận = `thô × 100 / (100 + DEF)`, nên DEF tăng thì pet trâu hơn, không chỉ HP.
- **ULT mạnh lên theo chỉ số, không cần luật riêng:**
  - Đòn huỷ diệt = ATK × 12.
  - Khiên / hồi máu tính theo % HP tối đa.
- **Aggro giữ nguyên**, để vai trò Tanker / Hỗ trợ / Sát thương và các % bị nhắm ở màn Đội hình không đổi.
- **Làm tròn khi hiển thị**, còn trong trận dùng số thực.

| Pet (gốc → cấp 5) | HP | ATK | DEF |
|---|---|---|---|
| Rockmane | 1600 → 1984 | 30 → 37 | 50 → 62 |
| Blazefang | 800 → 992 | 70 → 87 | 15 → 19 |

## 3. Boss theo cấp đội (thay cho trần cấp)

**Không chặn nâng cấp:** pet lên được tới cấp 15 bất cứ lúc nào, nếu đủ đá và vàng. Thay vào đó, **boss lên cấp theo đội**:
- `cấp boss = cấp trung bình của 3 pet trong đội, làm tròn` (hàm `teamLv` trong engine.js).
- **HP và ATK boss tăng 4% mỗi cấp** (`CFG.up.bossGrow`, hàm `lvBoss`). Pet tăng 6% mỗi cấp, nên lên cấp vẫn có lợi, chỉ là lợi chậm.
- Cấp boss hiện ở màn Chọn boss, khung boss trên màn Đội hình, khung boss trong trận và dòng thống kê ở màn Kết quả. Đổi pet trong đội thì cấp boss đổi theo.

**Thử nghiệm** (`node sim.js --bosslv`, đội mặc định, cả đội cùng cấp, 150 trận mỗi ô):
| Boss tăng/cấp | Boss 3 ở L1 · L5 · L8 · L15 | Boss 2 ở L1 · L5 · L15 | Nhận xét |
|---|---|---|---|
| 0% (boss đứng yên) | 27 · 75 · 97 · 100% | 47 · 93 · 100% | Cày lên cấp 8 là thắng chắc, không cần chiến thuật |
| 3% | 27 · 46 · 75 · 95% | 47 · 81 · 99% | Hơi dễ ở cuối |
| **4% — chọn** | **27 · 41 · 57 · 87%** | **47 · 75 · 97%** | Lên cấp có lợi rõ nhưng từ từ; Boss 3 vẫn cần xếp đội khéo tới tận cấp cao |
| 6% (bằng pet) | 27 · 23 · 27 · 36% | 47 · 61 · 81% | Lên cấp gần như vô ích |

- Boss 1 luôn gần 100%. Đó là boss nhập môn.
- **Khi có đủ 15 boss:** chỉ số gốc của mỗi boss chỉnh để đội mặc định thắng khoảng 50–65% ở cấp 1. Boss tự lớn theo đội, không cần đặt cấp riêng cho từng boss.
- *Phần thử nghiệm đá ở §4b được đo khi còn trần cấp. Số lần đánh lại ở đó là để so sánh các bảng tỉ lệ với nhau, không còn là con số tuyệt đối.*

## 4. Kinh tế vàng

- **Giá `50 × (L+1)`:** cấp 1→2 tốn 100, 2→3 tốn 150, 3→4 tốn 200…
- **Thiết kế khớp nhau:** vàng **lần đầu hạ boss i** đủ nâng **đúng 3 pet trong đội lên 1 cấp**, tức chạm trần mới. Ví dụ Boss 1 cho 300 = 3 × 100, Boss 2 cho 450 = 3 × 150.
- **Nâng thêm pet thứ 4–5** (đổi đội theo hệ boss) cần **đánh lại**. Mỗi lần đánh lại cho 1/3 số vàng, nên cần khoảng 3 lần đánh lại cho mỗi cấp của mỗi pet ngoài đội. Đây chính là vòng "cày có mục đích": cày để có thêm lựa chọn khắc hệ, không phải để mạnh vượt trần.
- **Không hoàn vàng, không hạ cấp.**

## 4b. Đá nâng cấp theo hệ

**15 loại đá = 5 hệ × 3 cấp** (I · II · III). Pet lên cấp chỉ dùng **đá cùng hệ với pet**.

**Lên cấp = thử vận may** (đã chốt bằng thử nghiệm, chạy lại: `node sim.js --upgrade`):
- Hộp thoại có **3 ô đá, mặc định trống**. Chạm vào ô để mở hộp chọn đá: chọn cấp I/II/III (mỗi cấp chỉ nằm ở 1 ô) và số lượng.
- **Tỉ lệ = tổng tỉ lệ từng viên + may mắn, tối đa 100%** (`upTotal` trong engine.js). Khi tổng đã đạt 100% thì không thêm được đá hay số lượng nữa; viên cuối được phép làm tổng vượt 100%.
- Mỗi lần bấm Nâng cấp: **mất toàn bộ đá trong các ô và `50 × (L + 1)` vàng, dù thành công hay thất bại**. Thành công thì lên 1 cấp. Thất bại thì không tụt cấp, và lần sau **+3% may mắn** (cộng dồn, về 0 khi thành công). Sau mỗi lần thử, các ô giữ nguyên lựa chọn để thử lại nhanh.
- Người chơi tự chọn: **"chắc ăn"** (bỏ đủ đá cho 100%, tốn đá nhưng chỉ 1 lần vàng) hoặc **"liều"** (bỏ ít đá, thất bại thì mất cả đá lẫn vàng, nhưng được may mắn cộng dồn). Nói gọn: **chắc ăn tốn đá, liều tốn vàng**.

**Tỉ lệ 1 viên** (`upRate`, đã thử nghiệm: `node sim.js --rates`):
- Số đá I cần để chắc 100% khi lên từ cấp L: `c(L) = 1 + 0.08 × (L − 1)²` (`CFG.up.cost`).
- **1 đá II = 3 đá I, 1 đá III = 9 đá I** (`CFG.up.tierMul`), khớp luật hợp nhất 3 → 1, nên hợp nhất không lời không lỗ.
- Tỉ lệ 1 viên cấp t = `min(100%, 3^t / c(L))`. Các viên trong 3 ô cộng dồn, cộng thêm **may mắn +3% mỗi lần trượt liên tiếp** (`CFG.up.pity`), tối đa 100%.

| Lên từ | Lv1 | Lv3 | Lv5 | Lv7 | Lv9 | Lv11 | Lv12 | Lv13 | Lv14 |
|---|---|---|---|---|---|---|---|---|---|
| Đá I | 100% | 76% | 44% | 26% | 16% | 11% | 9% | 8% | 7% |
| Đá II | 100% | 100% | 100% | 77% | 49% | 33% | 28% | 24% | 21% |
| Đá III | 100% | 100% | 100% | 100% | 100% | 100% | 84% | 72% | 62% |
| Chắc 100% cần (quy ra đá I) | 1 | 2 | 3 | 4 | 7 | 9 | 11 | 13 | 15 |

- **Cấp thấp rẻ, cấp cao đắt dần.** Đá I hợp đầu game. Từ Lv7, đá II mới đáng dùng. Từ Lv12 trở đi, đến đá III một viên cũng không còn chắc ăn.
- **Một pet từ Lv1 lên Lv15**, theo kiểu chắc ăn: 85 điểm đá (quy ra đá I) + 5.950 vàng. Theo kiểu liều 1 viên đá I mỗi lần: khoảng 48 điểm + khoảng 25.000 vàng.

**Thử nghiệm** (tính kỳ vọng chính xác, 14 cấp, quy đổi II = 3 · III = 9):
| Đường chi phí `c(L)` | Chắc ăn 1→15 | Liều (may mắn 10% · 5% · 3%) | Nhận xét |
|---|---|---|---|
| A tuyến tính `1 + 0.75(L−1)` | 87 điểm | 40 · 47 · 53 | Cấp cao chưa đủ dốc, cấp thấp hơi đắt |
| B mũ `1.2^(L−1)` | 66 | 33 · 38 · 42 | Quá rẻ |
| **C bậc hai `1 + 0.08(L−1)²` — chọn** | **85** | 36 · 43 · **48** | Đầu game nhẹ, cuối game dốc rõ |
| D mũ `1.25^(L−1)` | 93 | 37 · 44 · 49 | Lv14 cần 18 đá I, hơi gắt |

- **Vì sao may mắn 3% (trước là 10%):** ở cấp cao một viên đá I chỉ còn 7%, nên +10% mỗi lần trượt làm kiểu "liều" rẻ hơn chắc ăn tới 3,8 lần về đá. Với 3%, liều chỉ còn rẻ hơn khoảng 2,5 lần về đá, nhưng tốn gấp khoảng 4 lần vàng. Đó là một lựa chọn thật sự, không phải mẹo.
- *Bảng cũ* (`gốc 100/115/130% − 6%/cấp, sàn 20/45/80%`) bị bỏ, vì: ở cấp thấp cả 3 loại đá đều 100% (không phân biệt được), một viên đá III luôn ≥ 80%, và may mắn 10% quá mạnh khi bỏ được nhiều đá một lúc.

**Kiếm đá từ đâu:**
- **Thắng boss → đá hệ của boss** (đảo nào rơi đá hệ đảo đó).
- **Cấp đá = vị trí boss trong đảo:** boss 1 rơi I, boss 2 rơi II, boss 3 rơi III. Hiện mỗi đảo có 1 boss nên đều rơi cấp I.
- **Số viên:** lần đầu hạ boss 3 viên, đánh lại 2 viên, đạt 3★ thêm 1 viên.
- Có vòng lặp chéo thú vị: muốn nâng pet Hỏa thì phải đi đảo Hỏa, mà boss Hỏa bị **Thủy** khắc. Vậy phải nuôi pet Thủy trước.

**Hai cách đổi đá** (trong Túi đồ → tab Đá):
| Cách | Luật | Giá |
|---|---|---|
| **Nâng cấp** | 3 đá cấp n → 1 đá cấp n+1, cùng hệ | Miễn phí |
| **Chuyển hoá** (hộp thoại) | Đá hệ X → đá hệ Y bất kỳ, cùng cấp, theo tỉ lệ ở §4c | 10 / 30 / 90 vàng mỗi viên **nhận** (cấp I / II / III) |

## 4c. Tỉ lệ chuyển hoá (đã thử nghiệm: `node sim.js --convert`)

Tỉ lệ theo **quan hệ ngũ hành từ hệ nguồn tới hệ đích** (= số bước đi theo vòng Sinh Mộc→Hỏa→Thổ→Kim→Thủy):
| Quan hệ (ví dụ từ Mộc) | Số bước | Đá vào → đá ra |
|---|---|---|
| **Sinh** (Mộc → Hỏa) | 1 | **4 → 3** |
| **Khắc** (Mộc → Thổ) | 2 | **3 → 2** |
| **Bị khắc** (Mộc → Kim) | 3 | **2 → 1** |
| **Được sinh** (Mộc → Thủy) | 4 | **2 → 1** |

**Chống lách:** tỉ lệ thoả `R[a+b] ≤ R[a]·R[b]`, nên chuyển thẳng luôn rẻ bằng hoặc hơn chuyển nối nhiều lần. Ví dụ Mộc→Thổ: chuyển thẳng 1.5 đá/viên, nối Mộc→Hỏa→Thổ 1.78 đá/viên. Bảng cũ "1→1 theo Sinh" cho phép nối 4 bước không mất đá, nên không có tỉ lệ nào khác đứng được.

**Thử nghiệm:** 3000 người chơi ảo, 15 boss trên 5 đảo Kim·Mộc·Thủy·Hỏa·Thổ, đội mặc định Thổ·Thủy·Hỏa. Người chơi đánh lại boss đã hạ có lợi nhất cho pet đang chậm nhất.
| Bảng (bước 1·2·3·4) | Đánh lại cả game (TB · 90%) | Lượt dùng đá chuyển hoá |
|---|---|---|
| 1→1 mọi hướng (luật cũ) | 5.8 · 8 | 86% (gần như không cần đi đúng đảo) |
| **E 4→3 · 3→2 · 2→1 · 2→1 — chọn** | **16.9 · 19** | 50% |
| F 1.25 · 1.5 · 1.75 · 2 | 15.9 · 18 | 54% (số lẻ, khó hiểu) |
| A 1.5 · 2 · 2 · 3 | 21.1 · 23 | 44% |
| C 2 · 3 · 4 · 5 | 34.8 · 38 | 29% |

**Chọn E vì:** trung bình khoảng 1.2 lần đánh lại mỗi boss, nằm trong mục tiêu 1–2. Số dễ đọc. Đi đúng đảo vẫn lợi hơn rõ rệt, nhưng đội lệch hệ vẫn lên được tới cấp tối đa.

Lỗ hổng thiếu đảo Thổ/Hỏa được lấp bằng chuyển hoá: Mộc → Hỏa 4→3, Mộc → Thổ 3→2.

## 5. Vì sao bỏ EXP (khác PLAN-V2)

PLAN-V2 yêu cầu cả EXP lẫn vàng. Với 5 pet và đội 3 pet, EXP gây hai vấn đề:
- **2 pet ngồi ngoài không bao giờ có EXP.** Muốn dùng pet khắc hệ cho boss mới thì phải đánh "lỗ" để luyện nó.
- **Phải làm thêm thanh EXP**, chia EXP theo từng pet, lưu dữ liệu và hiển thị ở 3 màn.

Boss lên theo cấp đội đã chặn việc lạm dụng (mục 3), nên EXP không còn việc gì để làm. Nếu sau này có nhiều pet hơn và muốn người chơi "gắn bó" với pet, có thể thêm EXP như một điều kiện phụ, không ảnh hưởng các công thức trên.

## 6. Số đo (bot smart, đội mặc định = Rockmane · Tidewisp · Blazefang)

| +6%/cấp | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv7 | Lv10 |
|---|---|---|---|---|---|---|---|
| Boss 2 | 43% | 67% | 81% | 89% | 93% | 97% | 99% |
| Boss 3 | 27% | 39% | 59% | 73% | 85% | 97% | 100% |

So sánh +4%/cấp: Boss 3 ở Lv3 chỉ 45%, ở Lv5 là 69%. Thấp hơn nhưng cảm giác lên cấp yếu, nên chọn +6% cho pet. Việc kiểm soát độ khó nay do boss lên theo cấp đội (mục 3).

Khi làm code: thêm `node sim.js --levels` để in bảng này. Sau mỗi lần đổi chỉ số boss hoặc công thức phải chạy lại và đối chiếu mục 3.

---

## 7. Giao diện cần đổi

| Màn | Thay đổi |
|---|---|
| 09 Chi tiết pet | Chip "Lv N" (`chip_level` có sẵn); nút **Lên cấp** mở hộp thoại 09b |
| 09b Nâng cấp | Chỉ số **hiện tại → sau khi nâng**; dòng chi phí: đá (có/cần) + vàng; nút mờ kèm lý do: "Đạt cấp tối đa" / "Thiếu X vàng" / "Thiếu N đá Hỏa I"; nút **Túi đá** |
| 09c Túi đá | Lưới 5 hệ × 3 cấp kèm số lượng; chọn đá → **Hợp nhất 3→1** / **Chuyển hệ → hệ kế (🪙giá)** |
| 07 Kết quả | Hiện đá nhận được bên cạnh vàng |
| 08 Bộ sưu tập | "Lv N" trên thẻ pet; chấm đỏ `dot_notify` khi pet đó nâng được |
| 05 Đội hình | "Lv N" cạnh tên trong ô đội |
| 06 Trận | Dùng chỉ số đã nhân cấp (thanh HP dài hơn) |
| Sảnh | Chấm đỏ trên nút Pet khi có pet nâng được |
| 07 Kết quả | Khi thắng lần đầu: dòng "Cấp tối đa → N" bên cạnh dòng mở khoá |

## 8. Dữ liệu & code

- **Save:** `save.lv = { rockmane: 3, … }`. Pet không có trong bảng = cấp 1. Vẫn giữ `version: 1` vì trường mới tự có mặc định.
- **Save đá:** `save.stones = { kim: [I, II, III], moc: [...], … }` (số lượng). Hệ thiếu = `[0, 0, 0]`.
- **Mọi số nâng cấp** nằm trong `CFG.up` (`data/config.js`): maxLv, grow, gold, base, dec, floor, pity, drop, merge, convert. Luật: `lvPet`, `upRate`, `upGold` trong `engine.js` (game và sim dùng chung). Cấp đá rơi = vị trí boss trong `ISLANDS[..].bosses`.
- **Một hàm duy nhất** `withLv(p, lv)` trả bản sao pet đã nhân chỉ số. Dùng ở 2 chỗ:
  - Khi bắt đầu trận (`fight` → `startBattle`).
  - Khi hiển thị chỉ số.
  - **Engine và sim không đổi.**
- **Gợi ý đội (`data/suggest.js`) đang tính ở cấp 1.** Đội gợi ý vẫn đúng vì chủ yếu dựa vào hệ và thứ tự cột, nhưng % thắng hiển thị sẽ thấp hơn thực tế. Tạm ghi "ở cấp 1", hoặc bỏ hiển thị % khi đội đã nâng cấp.

## 9. Cấp người chơi (XP)

- **XP chỉ nhận từ trận đấu:** thắng nhận `xp` của boss (40 / 60 / 80), **lần đầu hạ boss ×2**, thua nhận ×0.25. XP tự cộng dồn để lên cấp, không tiêu được.
- **XP cần để lên từ cấp L:** `60 + 40 × (L − 1)` (Lv2 cần 60, Lv10 cần 420, cả chặng 1 → 30 cần 17.980). Tối đa **cấp 30**.
- **Mỗi cấp: toàn đội +0.5% HP/ATK/DEF** (nhân sau chỉ số theo cấp pet, chỉ áp trong trận). Cấp 30 = +14.5%. Thông số ở `CFG.player`, hàm `plBonus` / `xpNeed` / `buffPet` trong engine.js.
- Cấp boss **không** tính cấp người chơi, nên đây là phần thưởng thuần cho người chơi lâu năm.

**Thử nghiệm** (`node sim.js --playerlv`, đội mặc định, pet và boss cùng cấp):
| Thưởng toàn đội | +0% | +5% | +10% | +15% | +30% |
|---|---|---|---|---|---|
| Boss 3, Lv1 | 20% | 37% | 49% | 65% | 89% |
| Boss 3, Lv5 | 52% | 69% | 77% | 85% | 98% |

Thưởng toàn đội tác động rất mạnh (chỉ +10% đã gần gấp đôi tỉ lệ thắng Boss 3), nên chọn mức nhỏ 0.5%/cấp. Khi người chơi tới Boss 3 thường mới khoảng cấp 4–6, tức chỉ +1.5–2.5%.
