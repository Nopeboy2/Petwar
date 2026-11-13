# PET WAR — Bộ asset trang PET (08 · 09)

Bộ hình được tách thành **PNG rời, nền ngoài trong suốt**, gồm nền, khung thẻ, icon, nút, thanh trạng thái, hiệu ứng và code mẫu. Thiết kế theo bản wireframe 844 × 390 ngang mà bạn cung cấp.

## Bắt đầu

1. Giải nén ZIP, giữ nguyên cây thư mục.
2. Mở `demo/index.html` trong trình duyệt (hoặc qua local web server). Bạn sẽ có hai màn thử: **PET → chọn thẻ → Chi tiết pet → đổi tư thế**.
3. Sao chép ảnh pet gốc vào `assets/pets/` (xem `assets/pets/PUT_YOUR_PETS_HERE.txt`). Thiết kế của bạn đã có ảnh pet trong dự án, nên gói này **không vẽ lại nhân vật**.
4. Đọc `layout.json` để đặt tọa độ chính xác trong game đang viết, hoặc dùng `demo/style.css` và `demo/pet-ui.js` làm điểm khởi đầu.

## Nội dung

```text
petwar_pet_assets/
  assets/
    backgrounds/
      bg_pet.png              # 1920 x 880, khung ngang
      bg_pet_detail.png       # 1920 x 880
    ui/
      card_pet.png
      card_pet_selected.png
      card_pet_pressed.png
      card_pet_locked.png
      title_pet.png
      panel_info_wide.png
      panel_info_mid.png
      panel_title_row.png
      panel_stat.png
      panel_ult.png
      panel_ngu_hanh.png
      panel_detail_back.png
      pedestal.png
      pedestal_large.png
      btn_pose_stand.png ... btn_pose_happy.png
      icon_el_kim.png ... icon_el_tho.png
      icon_role_t.png / icon_role_s.png / icon_role_d.png
      icon_stat_hp.png ... icon_stat_aggro.png
      bar_hp.png / bar_atk.png / bar_def.png / bar_aggro.png / bar_exp.png
      btn_back.png / btn_primary.png / btn_secondary.png
      chip_coin.png / chip_role.png / chip_element.png / chip_level.png
      badge_team_1.png / badge_team_2.png / badge_team_3.png
      icon_ult.png / icon_lock.png / dot_notify.png
    fx/
      fx_circle.png / fx_light.png / fx_floor.png
    pets/
      PUT_YOUR_PETS_HERE.txt
  demo/
    index.html
    style.css
    pet-ui.js
  layout.json                  # Các vị trí theo file thiết kế gốc
  manifest.json                # Tên file, kích thước thật, alpha
  asset_contact_sheet.jpg     # Bảng xem nhanh
  source/art_atlas_reference.png
```

## Cách đặt ảnh trong code

**Màn 08, Bộ sưu tập** (844×390): thẻ `i` ở `{x: 60 + 147*i, y: 109, w: 136, h: 208}` (5 thẻ). Ảnh pet 120×120 (offset +8,+8), tên +134, chip vai +160, chip hệ +160, thanh EXP +188. Đánh dấu 3 pet trong đội bằng `card_pet_selected.png` và `badge_team_1/2/3.png`.

**Màn 09, Chi tiết**: vùng pet `x60 y56 w268 h268`, header `x344 y56 w440 h44`, stat `x344 y108 w440 h100`, ULT `x344 y216 w440 h56`, ngũ hành `x344 y280 w440 h44`; nút lên cấp `x452 y332 w140 h36`, nút chọn `x604 y332 w180 h36`. Hàng pose gồm 6 nút tại `x=64+44*i, y=330, w=40, h=36`.

**Lưu ý hiển thị**:
- Nút/khung là file **không chữ**; text tiếng Việt, pet name, chỉ số và màu tiến trình dựng bằng HTML/CSS/UI engine. Không dùng chữ dính vào PNG.
- Gói sử dụng artwork đã raster hóa và tách nền từ một sheet hình; **không phải file Figma/PSD phân lớp**. Viền vàng và bóng mềm có thể có một ít sai số anti-alias ở mép khi phóng to quá mức.
- Ảnh nền 1920×880 là bản phóng từ hình sáng tác; phù hợp web landscape, nhưng không nên hiểu là tranh vẽ tay native 1920px.
- Một số panel tham khảo (`panel_stat`, `panel_ngu_hanh`) có biểu tượng trang trí đã vẽ trong ảnh; nếu muốn quan hệ ngũ hành thay đổi theo pet, hãy dùng panel trống `panel_info_mid` rồi thêm icon bằng code như demo.
- Đã có EXP và "Lên cấp (sau)" để chờ kích hoạt; demo hiện lưu trạng thái chọn đội trong bộ nhớ tab, không có backend.

## Ví dụ HTML/CSS đơn giản

```html
<div class="card">
  <img class="frame" src="assets/ui/card_pet_selected.png" alt="">
  <img class="pet" src="assets/pets/pet_rockmane_idle_L.webp" alt="Rockmane">
  <span class="name">Rockmane</span>
</div>
<style>
  .card {position:relative;width:136px;height:208px;}
  .frame {position:absolute;inset:0;width:100%;height:100%;}
  .pet {position:absolute;left:8px;top:8px;width:120px;height:120px;object-fit:contain;}
  .name {position:absolute;left:8px;top:134px;width:120px;text-align:center;font-weight:bold;}
</style>
```

Nếu dùng Phaser, Pixi, Godot hoặc React, chỉ cần giữ cùng đường dẫn ảnh trong `manifest.json` và tọa độ `layout.json`, thay phần HTML demo bằng component / sprite của engine.

## Tên pet và tư thế

Theo thiết kế: Rockmane (Thổ), Tidewisp (Thủy), Leafkit (Mộc), Blazefang (Hỏa), Steelclaw (Kim). Code demo tìm `pet_<id>_idle_L.webp` và các ảnh tư thế tương ứng. Nếu ảnh chưa có, demo tạm hiển thị huy hiệu hệ thay nhân vật (không phát sinh pet vẽ giả).
