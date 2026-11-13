# PET WAR – Túi đồ (màn 11) – Asset Kit

Bộ PNG độc lập để tích hợp vào giao diện game web mobile ngang **844×390**.

## Cấu trúc

- `assets/ui/bag/`: **asset mới**, nền trong suốt, **không có chữ/số** trong asset.
- `assets/ui/upgrade/`: file **tái sử dụng nguyên gốc** từ `09b` (15 đá, 4 ô đá, icon_merge, icon_convert, arrow_sinh, fx_stat_up).
- `assets/ui/bag/fallbacks/`: nền/title/chips/nút quay lại thay thế **tùy chọn** khi chưa có asset cũ (không ghi đè bản cũ).
- `contact_sheet_bag.jpg`: bảng kiểm các file mới.
- `preview_tui_do.png`: hình xem trước, không dùng nguyên ảnh này làm giao diện vì số lượng và chữ là dữ liệu mẫu.
- `manifest.json`: tên, kích thước và loại của từng file.

## Các asset mới trong `assets/ui/bag/`

| Tên | PNG export | Kích thước hiển thị |
|---|---|---|
| tab_bag, tab_bag_active | 348×132 | 116×44 |
| icon_tab_all, icon_tab_currency, icon_tab_stone, icon_tab_item, icon_tab_chest | 96×96 | 26×26 |
| slot_item_4, slot_item_empty | 192×192 | 68×68 |
| panel_item_detail | 636×942 | 212×314 |
| fx_rarity | 360×360 | 120×120 |
| item_gold, item_gem | 192×192 | 52–96 |
| tag_new | 96×48 | 32×16 |
| icon_source | 64×64 | 16×16 |
| empty_bag | 480×360 | 160×120 |
| item_chest_1/2/3, item_shard, item_ticket, item_key | 192×192 | 52–96 (để mở rộng) |

## Cách dựng giao diện

- `bg_pet` làm mờ 5px và tối 80%; thanh trên, các tab, lưới giữa, khung chi tiết phải tạo bằng từng ảnh và CSS.
- Không cố kéo dãn `slot_*` và các icon; chọn đúng kích thước hiển thị.
- `tab_bag` và `tab_bag_active` để **trống chữ**, đặt icon 26px và tên tab bằng DOM.
- Khung `panel_item_detail` có dải đầu màu xám trung tính để CSS phủ màu hiếm. Thêm độ hiếm với `#8a6a4a`, `#3a7bd5`, `#9b4dca`, `#e8891a`.
- `slot_item_4` và `slot_item_empty` được chỉnh trực tiếp từ dáng khung đá cũ, để góc và kích cỡ nhất quán.
- `fx_rarity.png` là alpha trong suốt; `fx_rarity_screen.png` là bản nền đen để dùng `mix-blend-mode: screen`.
- Bảng tab Đá gồm 5 cột **Mộc → Hỏa → Thổ → Kim → Thủy**, 3 hàng I–III. Tên file `stone_{moc|hoa|tho|kim|thuy}_{1|2|3}.png`.
- Chỉ số lượng > 0 thì tô rõ; bằng 0 đặt `filter: grayscale(1); opacity: .35` cho icon đá, giữ nguyên số 0.
- `tag_new.png` chỉ là ruy băng, hiển thị chữ `MỚI` qua CSS. Tên vật phẩm, cấp độ, số lượng và nút thao tác đều được tạo bằng code.
- `panel_item_detail.png`: dùng nguyên bản 636×942 sẽ tương ứng 212×314. Nếu làm responsive dạng 9-slice, nên giữ **phần đầu trên khoảng 340 px bản xuất**, hai mép khoảng 60 px và đáy khoảng 90 px.
- Từ màn Nâng cấp, nút “Túi đồ” mở tab Đá với hệ của pet được chọn. Nhấn quay lại để trở lại hộp thoại Nâng cấp.

## Vị trí trong thiết kế 844×390

```js
const bagLayout = {
  tabs: { x:60, y:56, width:116, height:44, gap:6 },
  grid: { x:184, y:56, width:380, height:314 },
  detail: { x:572, y:56, width:212, height:314 },
  itemSlot: { width:68, height:68, gap:6 },
  stoneCell: { width:64, height:64, columns:5, rows:3 },
};
```

## CSS ví dụ

```css
.bag-tab { background:url('/assets/ui/bag/tab_bag.png') center/100% 100% no-repeat; }
.bag-tab.active { background-image:url('/assets/ui/bag/tab_bag_active.png'); }
.item-detail { background:url('/assets/ui/bag/panel_item_detail.png') center/100% 100% no-repeat; }
.item-slot.empty { background:url('/assets/ui/bag/slot_item_empty.png') center/contain no-repeat; }
.item-slot.legendary { background:url('/assets/ui/bag/slot_item_4.png') center/contain no-repeat; }
.bag-stone-zero > img { opacity:.35; filter:grayscale(1); }
.bag-rarity-fx { position:absolute; inset:-10px; pointer-events:none; animation:raritySpin 6s linear infinite; }
@keyframes raritySpin { to { transform:rotate(360deg); } }
```

### Ghi chú

Đây là bộ asset **dựng mới cho code**, không phải ảnh cắt các chữ từ screenshot. Các icon và khung xuất chuẩn PNG; có thể có khác biệt nhỏ so với nét vẽ AI trong bản mockup. Các asset cũ ở `assets/pet-ui` và `assets/ui` không có trong bộ tải trước này, vì trong brief yêu cầu tái sử dụng. Có sẵn những bản fallback để tự dựng màn khi thiếu chúng.
