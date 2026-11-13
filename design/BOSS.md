# Sức mạnh boss — đường cong độ khó & Boss 4–5

Số liệu: `node sim.js --curve 100`. Đã tính viên x2/x3 (`CFG.mulGem`): khi thêm viên này, HP boss 3/4/5 tăng 12 000→13 500, 14 000→16 000, 21 000→23 500 để giữ đường cong (bot smart, pet & boss cùng Lv1, chưa tính thưởng cấp người chơi).
Thử boss mới không cần sửa code: `CAND='[{"n":"thử","el":"hoa","hp":14000,"atk":810,"stun":7,"pat":["blast","aoe"]}]' node sim.js --curve 80`.
Mô phỏng nhiễu khoảng ±8% ở 80–100 trận/đội, nên chốt số bằng ≥ 80 trận.

## 1. Đường cong mục tiêu

Mỗi boss khó hơn boss trước khoảng 10–20 điểm % (đội tốt nhất). Từ boss 3 trở đi, đội mặc định thua nhiều: người chơi phải **đổi đội theo hệ**.

| Boss | Đảo | Hệ | HP | ATK | Choáng | Mẫu đòn | Đội tốt nhất | Đội mặc định | Số nước |
|---|---|---|---|---|---|---|---|---|---|
| 1 dễ | Thiết Nham | Kim | 7 000 | 580 | 6 | đơn, đơn, lan | 100% | 100% | 11 |
| 2 vừa | Rừng Ngàn | Mộc | 11 000 | 620 | 8 | đơn, lan, toàn đội | 93% | 45% | 20 |
| 3 khó | Thủy Cung | Thủy | 13 500 | 650 | 10 | toàn đội, lan, đơn, toàn đội | 81% | 29% | 33 |
| **4 rất khó** | **Hỏa Sơn** | **Hỏa** | **16 000** | **810** | **7** | **lan, toàn đội, lan, toàn đội** | **58%** | 19% | 42 |
| **5 cực khó** | **Hoàng Thổ** | **Thổ** | **23 500** | **690** | **13** | **đơn, đơn, toàn đội** | **47%** | 1% | 44 |

Phần thưởng nối tiếp: vàng 250 / 300, XP 100 / 120 (lần đầu vẫn ×3 vàng, ×2 XP).

## 2. Lối chơi riêng của từng boss mới

Chỉ dùng các núm có sẵn (HP, ATK, ngưỡng choáng, mẫu đòn), không thêm luật mới vào engine.

**Boss 4 Hỏa: "Bùng nổ"**
- **Cách đánh:** ATK cao nhất game, nhưng không bao giờ đánh đơn. Đòn lan và toàn đội xen kẽ, nên sát thương rải lên cả đội.
- **Điểm yếu:** ngưỡng choáng thấp (7 Xoắn). Gom Xoắn để choáng thì được lượt nghỉ và +50% sát thương.
- **Khắc chế:** pet Thủy (Tidewisp) khắc Hỏa. Đội thắng tốt nhất là hai pet hồi máu cộng Tanker (Leafkit, Tidewisp, Rockmane): sống sót quan trọng hơn dồn sát thương.
- **Bẫy:** Steelclaw (Kim) bị Hỏa khắc nên chịu đòn nặng.

**Boss 5 Thổ: "Pháo đài"**
- **Cách đánh:** HP gấp 1,5 lần boss 4, ATK thấp hơn. Hai đòn đơn dồn vào pet bị nhắm (thường là Tanker), rồi một đòn toàn đội.
- **Điểm yếu khó khai thác:** ngưỡng choáng cao (13 Xoắn) nên khó choáng. Đây là trận dài nhất, khoảng 44 nước.
- **Khắc chế:** pet Mộc (Leafkit) khắc Thổ. Đội thắng là Rockmane đỡ đòn, Leafkit vừa hồi máu vừa khắc hệ, Steelclaw gây sát thương (Thổ sinh Kim không ảnh hưởng boss).
- **Bẫy:** Tidewisp (Thủy) bị Thổ khắc. Đội mặc định có Tidewisp nên gần như thua chắc (1%).

## 3. Theo cấp

- **Cấp đội:** boss lên theo cấp trung bình của đội (+4% HP/ATK mỗi cấp), còn pet +6% mỗi cấp. Nâng cấp pet vẫn làm trận dễ dần, khoảng +2% mỗi cấp so với boss.
- **Cấp người chơi:** thêm +0,5% chỉ số toàn đội mỗi cấp, tối đa +14,5%. Đây là đường cày khi bị kẹt ở boss 4–5.
- **Gợi ý đội:** `data/suggest.js` đã tạo lại bằng `node sim.js --suggest 40`, gồm cả boss 4 và 5. Nút "Gợi ý đội" dùng được ngay.

## 4. Khi chỉnh lại

1. Sửa `data/bosses.js`.
2. Chạy `node sim.js --curve 100`, giữ đường cong đội tốt nhất giảm dần khoảng 100 → 93 → 81 → 58 → 47%.
3. Chạy `node sim.js --suggest 40` để tạo lại Gợi ý đội.
