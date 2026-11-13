# Pokiwar Lite — Quy chuẩn thiết kế giao diện mobile

Tài liệu này là **khung để bạn thiết kế**: kích thước, vị trí, lưới, cỡ chữ, cỡ nút, cách xuất ảnh.
Phần **phong cách** (màu cụ thể, font, hình khối, chất liệu) là của bạn — mục 6–7 chỉ quy định *vai trò* và *giới hạn*, kèm giá trị hiện tại để tham khảo.

Bộ file đi kèm:
| File | Dùng để |
|---|---|
| `wireframes/*.svg` | Khung từng màn, đúng toạ độ. Nhập vào Figma/Illustrator/Photoshop làm lớp nền rồi vẽ đè |
| `LAYOUT.md` | Bảng toạ độ x, y, w, h của mọi thành phần (tự sinh) |
| `index.html` | Xem nhanh mọi wireframe trong trình duyệt |
| `gen-wireframes.mjs` | Nguồn của bố cục. Đổi số ở đây → chạy `node design/gen-wireframes.mjs` → SVG và bảng cập nhật cùng lúc |

---

## 0. Phong cách đã chốt (theo bản đang chạy)

> Mục này ghi lại phong cách **đã áp dụng trong game**. Màn mới phải theo đúng các quy tắc này.

**Chất liệu & tông:** fantasy phiêu lưu dễ thương, 2D chibi, viền nâu đậm, cel shading. Khung UI: **viền vàng bóng + nền kem giấy da**, điểm nhấn **tím đậm**. Nguồn tham chiếu: `design/source/home-kit.png` (sảnh), `design/source/pet-ui-kit/` (trang Pet).

**Font:** Baloo 2 (600/700/800, có tiếng Việt) cho sảnh và trang Pet. Chữ trên nền tím/ảnh: trắng + bóng `0 2px 2px #2a0a5a`. Chữ trên nền kem: nâu `#5a3412`, phụ `#7a5a3a`.

**Nền:**
| Loại màn | Cách dùng |
|---|---|
| Sảnh | Ảnh rõ, không mờ — là "sân khấu" |
| Màn danh sách / chi tiết | Ảnh **làm mờ 5px, tối 80%** để thẻ/bảng nổi lên |
| Màn chức năng (Cài đặt…) | Nền tím đặc `#1b1230` |

**Khối & khung:**
- Thẻ dọc (pet): `card_pet*` 136×208 — chỉ ảnh + tên, không nhồi icon.
- Bảng thông tin: `panel_title_row` (dòng 44), `panel_ult` (56); bảng cao/co giãn dùng `panel_detail_back` dạng **9-slice** để viền không méo.
- Nút chính vàng `btn_primary` (chữ nâu `#5a2d00`), nút phụ tím `btn_secondary` (chữ trắng). Nút ← `btn_back` 44×40.
- Khung vẽ sẵn ký hiệu (khiên trên `card_pet_selected`) → **viết số/chữ lên đó, không chồng thêm icon**.

**Icon:** huy hiệu tròn viền vàng cho **hệ** (`icon_el_*`) và **vai** (`icon_role_*_round`) — luôn đi theo cặp, cùng cỡ. Icon chỉ số `icon_stat_*`. Ưu tiên icon thay chữ khi chỗ hẹp; luôn có `title`/`aria-label`.

**Thanh lọc / điều khiển phụ:** dải **kính mờ** (nền trắng 13→5%, viền trắng 20%, blur 6px, bo tròn), chỉ icon 24 trong nút tròn 32; trạng thái chọn = **vòng vàng 2px `#ffd24a` + quầng sáng**, chưa chọn = icon giảm bão hoà, mờ 75%. Chỉ báo trang: viên tối mờ nhỏ, chấm 6px, trang hiện tại = vạch vàng 14px.

**Nút quay lại:** một kiểu duy nhất `btn_back` 44×40 ở góc trên-trái mọi màn; luôn về **màn gần nhất** (lịch sử điều hướng), về Trang chủ thì xoá lịch sử.

**Nền sảnh:** mờ nhẹ 3px, tối 90% (vẫn thấy cảnh); màn danh sách/chi tiết mờ 5px, tối 80%.

**Bố cục:** nút ← trên-trái, tiêu đề băng rôn giữa, tiền tệ trên-phải; neo mép 12 pt trong vùng an toàn; khối nội dung chính căn giữa phần còn lại. Màn chi tiết: **hình lớn trái – cột thông tin 440 sát phải**, các khối cột cách đều theo chiều cao.

**Chuyển động:** nhân vật luôn có hoạt ảnh đứng yên (thở co giãn dọc ~3% + nhún 4px, 2.4–2.6s); nhấn nút thu 92–97%.

---

## 1. Khung thiết kế (artboard)

| Khung | Kích thước (pt) | Vai trò |
|---|---|---|
| **Chính** | **844 × 390** | Thiết kế mọi màn trên khung này (iPhone 12–15, đa số Android 19.5–20:9) |
| Rộng | 932 × 430 | Kiểm tra giãn (iPhone Pro Max) |
| 16:9 | 667 × 375 | Kiểm tra máy 16:9, Android cũ |
| Nhỏ nhất | 568 × 320 | Kiểm tra không bị vỡ/chồng chữ |

- **Chỉ màn hình ngang.** Không thiết kế dọc (game hiện lớp phủ "xoay ngang").
- **1 pt = 1 CSS px.** Thiết kế ở @1x; xuất ảnh @2x và @3x (mục 9).
- Trong Figma: tạo Frame 844×390 cho mỗi màn, đặt tên đúng mã màn (`02-home`, `06-battle`…), kéo SVG tương ứng vào làm lớp dưới cùng, khoá lại.

## 2. Vùng an toàn (safe area)
Khung đỏ nét đứt trong SVG. Vùng tô hồng là nơi có tai thỏ/camera/thanh home.

| Khung | Trái | Phải | Trên | Dưới |
|---|---|---|---|---|
| 844×390 | 48 | 48 | 8 | 20 |
| 932×430 | 59 | 59 | 8 | 21 |
| 667×375, 568×320 | 16 | 16 | 8 | 8 |

- **Nền và ảnh trang trí** được tràn ra toàn khung (kể cả vùng hồng).
- **Chữ, nút, thanh, mọi thứ chạm được** phải nằm trong vùng an toàn.
- Khi trình duyệt có thanh địa chỉ, chiều cao thực có thể ngắn hơn ~50 pt → bố cục co theo chiều cao (mục 10).

## 3. Lưới & khoảng cách
- **Lưới 8 pt** (đường mờ trong SVG). Mọi vị trí và kích thước là bội của 4, ưu tiên bội của 8.
- Thang khoảng cách: **4 · 8 · 12 · 16 · 24 · 32 · 48**.
  - 4: trong một thành phần (icon ↔ chữ)
  - 8: giữa các phần tử cùng nhóm (các thẻ pet, các thanh)
  - 12: giữa các vùng lớn của màn chiến đấu
  - 16–24: giữa các nhóm khác nhau
  - 32–48: lề trên/dưới của tiêu đề lớn

## 4. Vùng chạm
- Tối thiểu **44 × 44 pt** cho mọi thứ bấm được (nút ULT trên màn nhỏ: 42×20 là ngoại lệ duy nhất, vùng chạm thực được nới ra cả thẻ).
- Khoảng cách giữa hai nút ≥ 8 pt.
- Ô bàn cờ ≥ 42 pt (khung nhỏ nhất), 53 pt ở khung chính.
- Nút quan trọng (Đánh, Chiến dịch, Lên cấp) đặt ở **nửa dưới hoặc bên phải**: vùng ngón cái khi cầm ngang.

## 5. Chữ (typography)

| Cấp | Cỡ (pt) | Độ đậm | Dùng cho |
|---|---|---|---|
| Display | 32–44 | Black | Logo, "CHIẾN THẮNG" |
| H1 | 22 | Bold | Tiêu đề màn |
| H2 | 18 | Bold | Tiêu đề hộp thoại, tên boss |
| Body | 14 | Regular/Semibold | Nội dung, nút |
| Caption | 12 | Regular | Chú thích, chỉ số phụ |
| Mini | 10 | Semibold | **Chỉ** con số cạnh thanh HP/khiên/nộ |
| Số bay | 16 (thường), 24 (chí mạng), 13 (trên pet) | Black + viền/bóng | Sát thương, hồi máu |

- **Font phải hỗ trợ đầy đủ tiếng Việt có dấu** (ă â đ ê ô ơ ư + 5 dấu thanh). Gợi ý thử: Baloo 2, Nunito, Be Vietnam Pro, Quicksand. Kiểm bằng câu: *"Rùa Đá · Gấu Sắt · Đại Bàng · Hỗ trợ · Choáng"*.
- Số dùng chữ số cùng độ rộng (tabular) để HP không nhảy khi thay đổi.
- Chữ trên nền hình phải có viền hoặc bóng; tương phản ≥ 4.5:1 với chữ ≤ 14 pt.

## 6. Màu — theo vai trò
Bạn tự chọn màu cụ thể; chỉ cần giữ **vai trò** và các ràng buộc. Cột "Hiện tại" là màu đang dùng trong bản chạy.

| Vai trò | Hiện tại | Ràng buộc |
|---|---|---|
| Nền | `#1b1230` | Tối hoặc mờ để viên và pet nổi lên |
| Bề mặt (thẻ, bảng) | `#2b1f4d` | Khác nền đủ để thấy viền thẻ |
| Bề mặt 2 (nút phụ) | `#3a2b66` | |
| Nhấn (nút chính) | `#ffb02e → #e0801a` | Chỉ 1 nút chính mỗi màn |
| Chữ / chữ mờ | `#f4efff` / `#a99bd0` | |
| HP pet | `#3fb950` | Xanh lá |
| Khiên | `#58a6ff` | Xanh dương — **không trùng** màu HP |
| Nộ | `#f0883e` | Cam |
| HP boss | `#e5484d` | Đỏ |
| Choáng | `#9aa4b8` | Xám (cùng họ màu viên Xoắn) |
| EXP | `#a371f7` | Tím |

**Màu viên đã chốt (không đổi vai trò):**
| Viên | Nền | Biểu tượng |
|---|---|---|
| Kiếm (công) | Vàng | Kiếm vàng nhạt |
| Tim (hồi máu) | Xanh lá | Tim hồng |
| Xoắn (choáng) | Xám | Xoắn ốc xám |
| Khiên | Tím | Khiên xanh dương |
| Lửa (nộ) | Đỏ | Lửa đỏ-vàng |

Ràng buộc viên: 5 viên phải phân biệt được **khi chuyển sang ảnh đen trắng** (khác hình dạng biểu tượng, không chỉ khác màu) — cho người mù màu.

## 7. Hình khối
| Thuộc tính | Giá trị |
|---|---|
| Bo góc | Viên 24% cạnh · Nút/thẻ 8–12 · Chip = nửa chiều cao · Hộp thoại 14 · Nút màn = tròn |
| Viền | 2 pt cho trạng thái chọn; 1 pt cho viền thẻ |
| Bóng | Nhẹ, đổ xuống dưới (0, 2–4, mờ 8–12) |
| Phong cách gợi ý | 2D chibi, viền đậm, màu bão hoà |

## 8. Thành phần & trạng thái
Kích thước chuẩn xem `wireframes/00-components.svg`. Mỗi thành phần cần vẽ đủ trạng thái:

| Thành phần | Kích thước (khung chính) | Trạng thái cần vẽ |
|---|---|---|
| Nút chính | 160×48 (nhỏ nhất 120×44) | thường · nhấn · tắt |
| Nút phụ | 160×48 | thường · nhấn · tắt |
| Nút nhỏ | 96×32 (vùng chạm 44) | thường · nhấn |
| Nút icon | 44×44 | thường · nhấn · có chấm đỏ |
| Chip | cao 32 | — |
| Thẻ pet trong trận | 203×101 | thường · bị đánh (đỏ) · chết (xám) · ULT sẵn sàng (phát sáng) |
| Nút ULT | 48×22 | chưa đầy · sẵn sàng (nhấp nháy) |
| Thẻ chọn pet | 96×88 | thường · đã chọn (số thứ tự) · khoá (bóng đen) |
| Thẻ pet (danh sách) | 136×120 | thường · lên cấp được (chấm đỏ) · khoá |
| Ô bàn cờ | 53×53 | — |
| Viên | 49×49 | thường · được chọn · gợi ý · nổ (1–4 khung) |
| Nút màn trên bản đồ | 56 (boss 72) | đã qua (+sao) · đang mở · khoá · có thưởng pet |
| Thanh HP / khiên / nộ | cao 8 / 4 / 6 | đầy · vơi · trống |
| Thanh HP boss | cao 12 | |
| Thanh choáng | cao 8, chia N ô | ô trống · ô đầy · trạng thái miễn nhiễm |
| Hộp thoại | rộng ≥ 320 | có nút ✕ góc phải |
| Thông báo (toast) | tự co theo chữ | |

## 9. Xuất ảnh (asset)

| Loại | Kích thước gốc @1x | Xuất | Định dạng |
|---|---|---|---|
| Viên | 49×49 (vẽ ở 128×128) | @2x, @3x | WebP + PNG dự phòng |
| Pet trong trận / thẻ | khung 64×64 (vẽ 256×256) | @2x, @3x | WebP |
| Pet lớn (chi tiết, sảnh) | 280×280 | @2x | WebP |
| Kẻ địch / boss | 134×134 trong trận (vẽ 384×384) | @2x, @3x | WebP |
| Nền | 932×430 (vẽ 1920×1080, giữ phần quan trọng ở giữa 844×390) | @2x | WebP/JPG |
| Icon | 24 · 32 · 48 | @2x, @3x | SVG (ưu tiên) hoặc PNG |
| Khung nút/bảng | 9-slice | @2x, @3x | PNG, ghi rõ lề cắt (ví dụ 12/12/12/12) |

**Sprite sheet (hoạt ảnh):** các khung **cùng kích thước, xếp ngang một hàng**, điểm neo ở **giữa-dưới** (chân nhân vật). Ghi kèm số khung và fps. Ví dụ `pet_rua-da_idle@2x.webp` · 6 khung · 8 fps.

**Đặt tên:** chữ thường, không dấu, gạch nối: `loai_ten_trangthai@2x.webp`
```
gem_kiem@2x.webp      gem_tim_pop@2x.webp
pet_rua-da_idle@2x.webp   pet_rua-da_attack@2x.webp   pet_rua-da_hurt@2x.webp   pet_rua-da_ult@2x.webp
boss_1_idle@2x.webp   bg_chuong-1@2x.webp   ui_btn-primary@2x.png   icon_aggro.svg
```
Ngân sách: tổng tải lần đầu ≤ 5 MB; ảnh nền ≤ 300 KB mỗi ảnh.

## 10. Quy tắc co giãn giữa các khung
Xem `06-battle.svg` và các bản `06b/c/d` để thấy cùng một màn ở 4 khung.

**Quy ước chung đã áp dụng (đồng bộ với bản đang chạy):**
- **Neo mép:** mọi thành phần sát mép (nút ←, avatar, tiền tệ, bánh răng, hàng nút dưới) cách mép **vùng an toàn 12 pt**. Không đặt chúng theo toạ độ tuyệt đối giữa khung.
- **Đầu trang:** các màn danh sách/cài đặt (Chọn boss, Đội hình, Bộ sưu tập pet, Cài đặt) có nút **← ở góc trên trái** (44×40), tiêu đề giữa, nút hành động chính (nếu có) ở góc trên phải. Nội dung nằm bên dưới; nội dung chính căn giữa phần còn lại.
- **Sảnh:** khung giãn theo màn hình thật (rộng ≥ 844, cao ≥ 390 sau khi phóng); khối giữa (pet) nằm giữa theo chiều dọc; hàng nút neo đáy.
- **Nút phá huỷ** (Xoá dữ liệu) đặt riêng ở giữa đáy màn, xa các nút thường.

| Thành phần | Quy tắc |
|---|---|
| **Bàn cờ** | Luôn vuông, cạnh chia hết 6. Cạnh = min(chiều cao còn lại, chiều rộng trừ 2 cột bên tối thiểu 130). Khung chính 318, nhỏ nhất 252 |
| Cột pet & cột boss | Giãn theo phần còn lại hai bên bàn (khung chính 203, nhỏ nhất 130) |
| Thẻ pet trong trận | Chia đều chiều cao bàn thành 3. Khi hẹp (< 112 pt phần chữ): % bị nhắm gộp vào dòng tên, nút ULT chuyển xuống dưới ảnh |
| Thanh trên cùng | Cao cố định 32–40; phần "tóm tắt" co lại, cắt "…" khi thiếu chỗ |
| Hộp thoại | Rộng cố định, căn giữa; nếu khung thấp, nội dung bên trong cuộn |
| Bản đồ chương | Cuộn ngang; khoảng cách nút màn giữ nguyên |
| Nền | Phủ kín (cover), căn giữa |

## 11. Chuyển động
Giữ thời lượng này để nhịp trận như bản hiện tại (code đang dùng các số này):

| Hoạt ảnh | Thời lượng |
|---|---|
| Đổi chỗ 2 viên | 150 ms |
| Viên nổ | 200 ms |
| Viên rơi | 280 ms |
| Số bay | 900–1300 ms |
| Boss lao tới tấn công | 350 ms |
| Pet rung khi bị đánh | 300 ms |
| Thông báo (toast) | 1100 ms |
| Gợi ý nước đi | sau 5 s không thao tác, nhịp 700 ms |

Chỉ dùng di chuyển, phóng to/nhỏ, độ mờ (chạy mượt trên điện thoại). Tránh làm mờ (blur) lớn và đổ bóng động.

## 12. Danh sách màn cần thiết kế

| Mã | Màn | Ghi chú |
|---|---|---|
| 00 | Thành phần dùng chung | Vẽ trước — các màn khác tái sử dụng |
| 01 | Bắt đầu / Tải | |
| 02 | Trang chủ (sảnh) | |
| 03 | Bản đồ chương | Vẽ 1 chương mẫu; 2 chương còn lại chỉ đổi nền/màu |
| 04 | Thông tin màn | Hộp thoại |
| 05 | Đội hình | |
| 06 | Chiến đấu | Màn quan trọng nhất; kiểm cả 06b/c/d |
| 07 | Kết quả | Vẽ cả bản Thắng và Thua |
| 08 | Danh sách pet | |
| 09 | Chi tiết & nâng cấp pet | |
| 10 | Cài đặt | Hộp thoại |

## 13. Bàn giao — kiểm trước khi gửi
- [ ] Mỗi màn là 1 frame 844×390, đúng tên mã ở mục 12.
- [ ] Màn chiến đấu có thêm bản 568×320 chứng minh không vỡ.
- [ ] Không có chữ/nút nào nằm ngoài vùng an toàn.
- [ ] Mọi thứ bấm được ≥ 44 pt (trừ ngoại lệ ULT màn nhỏ).
- [ ] Font hiển thị đúng câu thử tiếng Việt ở mục 5.
- [ ] 5 viên phân biệt được khi chuyển đen trắng.
- [ ] Mỗi thành phần có đủ trạng thái ở mục 8.
- [ ] Asset xuất đúng tên, @2x/@3x, sprite sheet ghi số khung + fps.
- [ ] Ghi chú lại những chỗ bạn **cố ý khác** wireframe — mình sẽ cập nhật `gen-wireframes.mjs` cho khớp.
