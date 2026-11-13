# PET WAR — Asset màn 05 Đội hình

Bộ **37 PNG rời** cho game mobile web ngang **844×390**, theo wireframe `05-team.md`. Bao gồm **16 asset mới** cho Đội hình, **20 asset dùng lại** từ trang Pet và **1 nền `bg_team`**. Đồng thời cung cấp 16 SVG gốc của asset mới để điều chỉnh chất lượng khi scale.

## Tải và dùng nhanh

1. Giải nén toàn bộ gói, giữ nguyên các thư mục `assets/`, `demo/`.
2. Mở `demo/index.html` trên localhost để xem ví dụ giao diện và tương tác. Ví dụ `python -m http.server 8000` trong thư mục gốc, truy cập `http://localhost:8000/demo/`.
3. Sao chép `assets/team/` vào đường dẫn UI game hiện tại. Nếu đã có asset trang Pet, có thể tham chiếu lại file tương ứng trong `assets/shared/` thay vì sao chép trùng.
4. Dùng `layout.json` cho vị trí chuẩn theo wireframe; `manifest.json` cho tên file và pixel thực của asset (1×, 2×, hoặc 3× tùy loại).

## Asset mới (`assets/team/`)

- `slot_team.png`, `slot_team_active.png`, `slot_team_empty.png`: 600×168 (logical 300×84).
- `frame_portrait.png`: 128×128 (logical 64×64), vòng khung; đặt **trên** ảnh pet để nhìn xuyên tâm trong suốt.
- `chip_boss.png`: 336×80 (logical 168×40).
- `filter_bar.png`: 816×68 (logical 408×34).
- `icon_aggro_target.png`, `icon_blast.png`: 64×64 (hiển thị 18×18).
- `icon_auto_team.png`: 72×72 (hiển thị 24×24).
- `tag_adv.png`, `tag_dis.png`: 112×44 (logical 56×22), **không chữ**.
- `link_sinh.png`, `link_sinh_up.png`: 84×42 (logical 28×14), mũi tên sinh xuống / lên.
- `icon_role_t_round.png`, `icon_role_s_round.png`, `icon_role_d_round.png`: 64×64 (hiển thị 18×18).

Mỗi PNG mới có một SVG nguồn trùng tên trong `svg/team/`, tiện chỉnh sửa viền vàng, màu nền hoặc xuất lại ở độ phân giải cao hơn.

## Asset dùng lại (`assets/shared/`)

`title_pet`, `btn_back`, `btn_primary`, `btn_secondary`, `card_pet`, `card_pet_selected`, `card_pet_locked`, `badge_team_1/2/3`, `panel_detail_back`, `icon_el_kim/moc/thuy/hoa/tho`, `icon_role_t/s/d`, `dot_notify`. Nền `assets/backgrounds/bg_team.png` 1920×880 được tạo từ nền Pet gốc bằng blur và giảm sáng, **không có chữ/khung**.

## Vị trí chuẩn (844×390)

- Header: `btn_back` (60,8,44,40), `title_pet` (292,8,260,40), `chip_boss` (616,8,168,40).
- Ba slot đội: `(60, 56+92*k, 300, 84)`; ảnh 64×64 đặt offset (10,10).
- Thanh lọc: `(376,56,408,34)`; năm thẻ kho: `(376+83*i,98,76,104)`.
- Khung khắc chế: `(376,212,408,110)`; Gợi ý đội `(376,334,120,40)`; ĐÁNH! `(604,334,180,40)`.

## Lưu ý tích hợp

- Đây là **asset UI**, **không bao gồm sprite gốc pet hoặc boss**. Gắn ảnh từ `assets/pets/` dự án của bạn.
- Thư mục `demo/preview-art/` chỉ có **ảnh crop minh họa từ mockup**, không phải sprite pet sạch/transparency, và không nên dùng trong trận đánh.
- Tất cả asset UI mới **không có chữ**, đủ nền alpha trong suốt. Tên pet, Boss, các con số phần trăm, hệ số, gợi ý khắc chế và text nút được render bằng code; không bị dính chữ vào ảnh.
- `demo/team-ui.js` đã cho phép chọn, thay pet, hoán đổi vị trí và hiển thị tỷ lệ Aggro &amp; trúng lan cập nhật tức thì. Công thức minh họa: Aggro Tank 200, Support 100, Damage 75; đòn lan gồm pet bị nhắm và hàng kề. Sử dụng chu trình ngũ hành khắc/sinh trong `05-team.md`.
- Nút `Gợi ý đội` trong demo chỉ dùng thứ tự ví dụ (không tích hợp thuật toán mô phỏng `data/suggest.js` của dự án); nút ĐÁNH! là hook chưa nối backend.
- `panel_detail_back` được dùng làm border-image trong demo để không co kéo viền trang trí.
