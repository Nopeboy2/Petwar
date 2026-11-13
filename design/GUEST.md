# Cơ chế chơi Khách

Mục tiêu: **mở game là chơi ngay**, không đăng ký. Tiến độ lưu trên máy. Thiết kế sẵn chỗ để sau này **liên kết Google/Apple (tuỳ chọn)** mà không mất tiến độ.

---

## 1. Luồng

```
Lần đầu:  Chạm để chơi → (tạo hồ sơ khách ngầm) → Sảnh
Lần sau:  "Chào, Khách#7F3A" · Chạm để chơi → Sảnh
```

- **Không hỏi tên lúc đầu.** Tên mặc định là `Khách#XXXX`, lấy 4 ký tự đầu của ID. Người chơi đổi tên sau, bằng cách chạm vào tên ở Sảnh.
- Màn "Chạm để chơi" vẫn giữ, vì trình duyệt cần một lần chạm để mở âm thanh và vào toàn màn hình.

## 2. Dữ liệu (save v2)

Hồ sơ người chơi tách riêng khỏi tiến độ, để sau này gắn tài khoản chỉ phải đụng vào `profile`:

```js
profile: {
  id: 'uuid',              // crypto.randomUUID(), tạo 1 lần, không đổi — sau này là khoá để ghép với tài khoản đám mây
  name: 'Khách#7F3A',      // 2–12 ký tự
  avatar: 'rockmane',      // id pet làm ảnh đại diện (chỉ chọn pet đã có)
  created: 1730851200000,
  linked: null,            // sau này: { by: 'google' | 'apple', uid, at }
}
// tiến độ giữ nguyên: cleared, gold, gem, stars, lv, fail, stones, items, seen, lastTeam, settings, stats
```

- **Nâng phiên bản lưu từ 1 lên 2:** khi đọc bản lưu cũ thì tự thêm `profile`, giữ nguyên mọi tiến độ. Khoá lưu `pokiwar-lite-v1` không đổi.
- **Kim cương:** lúc này vẫn lưu trên máy và bằng 0, vì chưa có nguồn. Khi có nạp tiền, Kim cương chuyển lên máy chủ. **Khách không nạp được**, muốn nạp phải liên kết tài khoản trước, để tiền nạp không mất theo máy.

## 3. Giữ an toàn dữ liệu khách

Điểm yếu của chế độ khách là dữ liệu chỉ nằm trên máy. Có thể mất khi xoá dữ liệu trình duyệt, khi iOS tự dọn bộ nhớ, hoặc khi đổi máy.

| Biện pháp | Cách làm |
|---|---|
| **Xin lưu bền** | Gọi `navigator.storage.persist()` lần đầu. Trình duyệt sẽ hạn chế tự xoá dữ liệu. Không cần hỏi người chơi. |
| **Mã sao lưu** | Cài đặt → "Sao lưu": tạo mã chữ từ toàn bộ bản lưu (base64 + 4 ký tự kiểm tra), có nút **Sao chép**. "Khôi phục": dán mã → xem tóm tắt (tên, số boss đã hạ, cấp pet cao nhất) → xác nhận ghi đè. Dùng để chuyển máy khi chưa có đăng nhập. |
| **Nhắc nhở** | Cài đặt hiện dòng "Dữ liệu chỉ lưu trên máy này". Sau khi hạ boss mới, nếu đã hơn 7 ngày chưa sao lưu: hiện một chấm nhắc trên nút Cài đặt (không bật hộp thoại). |
| **Xoá dữ liệu 2 bước** | Bấm "Xoá dữ liệu" → hộp thoại ghi rõ những gì sẽ mất, có nút "Sao lưu trước", phải bấm xác nhận lần nữa. |

Mã sao lưu **không chống gian lận**: người chơi có thể tự sửa mã. Game chơi một mình nên chấp nhận được. Riêng Kim cương mua bằng tiền thật thì sau này máy chủ giữ, không nằm trong mã.

## 4. Giao diện

| Chỗ | Hiển thị |
|---|---|
| **Sảnh, góc trái trên** | Avatar (pet đã chọn) · tên · tag nhỏ "Khách". Chạm vào → hộp thoại **Hồ sơ** |
| **Hộp thoại Hồ sơ** | Avatar lớn + nút đổi (lưới các pet) · ô tên + nút Đổi · `ID #7F3A2C` · thống kê: số trận, số trận thắng, số boss đã hạ, ngày bắt đầu chơi · nút "Liên kết tài khoản" **mờ, ghi Sắp có** |
| **Cài đặt → Tài khoản** | "Khách · #7F3A2C" · Sao lưu · Khôi phục · "Liên kết Google — Sắp có" · Xoá dữ liệu |
| **Màn bắt đầu** | Thêm dòng "Chào, ‹tên›" khi đã có hồ sơ |

Hộp thoại dùng lại khung `panel_upgrade` và các nút có sẵn, **không cần vẽ asset mới**.

**Quy tắc đặt tên:**
- Dài 2–12 ký tự, có thể dùng chữ có dấu, số và khoảng trắng. Tự xoá khoảng trắng thừa.
- Có lọc từ cấm cơ bản.
- **Không kiểm tra trùng tên**, vì việc đó cần máy chủ. Hai người trùng tên vẫn phân biệt được qua ID.

## 5. Sau này: gắn đăng nhập vào (tuỳ chọn)

| Tình huống | Xử lý |
|---|---|
| Khách bấm "Liên kết Google" | Đăng nhập → tải bản lưu lên đám mây, gắn với tài khoản → ghi `profile.linked`. Tiến độ giữ nguyên. |
| Máy mới, đăng nhập Google, đám mây đã có bản lưu, máy chưa chơi | Tải bản đám mây về. |
| Cả máy và đám mây đều có tiến độ | Hiện 2 thẻ so sánh: tên, số boss đã hạ, cấp pet cao nhất, lần chơi cuối. Người chơi chọn giữ bản nào. **Không tự gộp.** |
| Đăng xuất | Quay lại bản lưu khách trên máy hoặc tạo hồ sơ khách mới. Không xoá bản trên đám mây. |

Như vậy phần làm bây giờ (`profile.id`, nâng phiên bản lưu, mã sao lưu, giao diện Hồ sơ) đều **dùng lại nguyên được** khi thêm Firebase.

## 6. Không làm lúc này

- Đăng nhập giả bằng mật khẩu trên máy: không có tác dụng bảo mật vì không có máy chủ.
- Kiểm tra trùng tên, bảng xếp hạng: cần máy chủ.
- Nhiều hồ sơ trên một máy: hiếm ai cần, sẽ thêm nếu có người yêu cầu.

## 7. Phạm vi code (ước tính)

- `ui/app.js`: thêm `profile` vào `DEF` và hàm `load` (nâng phiên bản lưu 1 → 2), sửa tên và avatar ở Sảnh, thêm hộp thoại Hồ sơ, Sao lưu/Khôi phục, Xoá dữ liệu 2 bước, mục Tài khoản trong Cài đặt. Khoảng 80–100 dòng.
- `style.css`: kiểu cho hộp thoại Hồ sơ và Sao lưu, dùng lại `.up-panel` và `.rs-btn`.
- Không cần asset mới, không cần máy chủ.
