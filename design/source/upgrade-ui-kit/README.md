# PET WAR — Asset Nâng cấp Pet (09b + Túi đá 09c)

## Thư mục

`assets/ui/upgrade/` có **PNG riêng**, giữ nền trong suốt trừ file `*_screen.png` (hiệu ứng nền đen dùng chế độ screen).

## Lắp vào giao diện

- Kích thước viewport thiết kế: **844 × 390**. Nền phía sau modal: `rgba(0,0,0,.60)`.
- Hộp thoại x=142, y=34, rộng 560, cao 336: `panel_upgrade.png` (1120×672), dùng **9-slice 72 px ở bản xuất** (36 CSS px ở tỉ lệ x2).
- Băng tiêu đề `title_island`, nút thường `btn_primary`, `btn_secondary`, chip vàng `chip_coin`, icon HP/ATK/DEF/ULT, icon khóa và chân dung pet **dùng lại từ bộ asset hiện có** như brief.
- Khung chân dung `frame_upgrade.png` (420×420); đặt ảnh pet nằm dưới khung, không dán ảnh pet vào asset khung.
- Huy hiệu cấp: `badge_level.png` / `badge_level_new.png` để trống cho số cấp viết bằng code. `arrow_upgrade.png` là mũi tên giữa hai cấp.
- Dòng chỉ số HP, ATK, DEF, ULT: `row_compare.png` (1044×108), kéo dãn 9-slice ngang; số hiện tại, số mới và phần (+...) viết bằng code, màu tăng `#2e9e3e`.
- Dòng nguyên liệu: 1 trong 15 file `stone_<he>_<cap>.png` (192×192), tên hệ `moc/hoa/tho/kim/thuy`, cấp `1/2/3`.
- Ô Túi đá 5×3: `slot_stone_1.png`, `slot_stone_2.png`, `slot_stone_3.png`, `slot_stone_sel.png` (192×192).
- Nút chức năng: `icon_upgrade`, `icon_merge`, `icon_convert`, `icon_bag_stone`, `btn_close`, `arrow_sinh`.
- Khi chạm trần cấp: `plate_maxed.png` làm nền biển; dòng chữ "Đạt cấp tối đa" viết bằng code.
- Hiệu ứng lên cấp: `fx_levelup.png` (600×600) hoặc `fx_levelup_screen.png` với `mix-blend-mode: screen`; `fx_stat_up.png` (96×128) trên chỉ số xanh.

## Tên trạng thái cần dựng trong code

1. **Có thể nâng:** nút vàng đang hoạt động, đủ đá + vàng.
2. **Thiếu đá hoặc vàng:** nút disabled (CSS grayscale); số thiếu hiển thị đỏ.
3. **Đạt trần:** hiện `plate_maxed`, ẩn mũi tên và chỉ số mới.
4. **Vừa nâng:** bùng `fx_levelup`, chỉ số + bay lên bằng `fx_stat_up`, giữ hộp thoại để nâng tiếp.

## Lưu ý

Asset chỉ chứa đồ họa tĩnh. Chữ, chỉ số, giá và hiệu ứng CSS/JS phải tạo trong code. Bộ UI này xây dựng bám bản minh họa nâng cấp của cuộc trò chuyện và tài liệu `09b-upgrade.md`.

## CSS cơ bản

```css
.upgrade-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); }
.upgrade-modal { width: 560px; height: 336px; background: url('/assets/ui/upgrade/panel_upgrade.png') center/100% 100% no-repeat; }
.upgrade-stats { background: url('/assets/ui/upgrade/row_compare.png') center/100% 100% no-repeat; }
.upgrade-gain { color: #2e9e3e; font-weight: 900; }
.upgrade-disabled { filter: grayscale(1); opacity: .75; pointer-events: none; }
.upgrade-fx { position: absolute; width: 200px; height: 200px; animation: upgradePop .8s ease-out both; pointer-events: none; }
@keyframes upgradePop { 0% { opacity:0; transform: scale(.5) } 30% { opacity:1 } 100% { opacity:0; transform: scale(1.45) } }
```
