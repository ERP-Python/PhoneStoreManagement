# Hướng dẫn sử dụng - Các tính năng mới

## 🚀 Quick Start

### Khởi động hệ thống:
```bash
# Terminal 1 - Backend
cd backend
python manage.py runserver

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Truy cập: http://localhost:3000

---

## 📱 1. QUẢN LÝ THƯƠNG HIỆU (Brands)

### Đường dẫn: `/brands`

### Chức năng:
- ✅ Xem danh sách thương hiệu
- ✅ Thêm thương hiệu mới (tên, mô tả, logo)
- ✅ Sửa thông tin thương hiệu
- ✅ Xóa thương hiệu
- ✅ Tìm kiếm thương hiệu

### Cách dùng:
```
1. Click "Brands" trong menu bên trái
2. Click "Thêm thương hiệu" (nút xanh góc phải)
3. Nhập thông tin:
   - Tên thương hiệu (bắt buộc)
   - Mô tả (tùy chọn)
   - Upload logo (tùy chọn)
4. Click "Thêm"
5. Thương hiệu mới xuất hiện trong danh sách
```

---

## 🏢 2. QUẢN LÝ NHÀ CUNG CẤP (Suppliers)

### Đường dẫn: `/suppliers`

### Chức năng:
- ✅ Quản lý thông tin nhà cung cấp
- ✅ Lưu người liên hệ, SĐT, email
- ✅ Tìm kiếm theo tên, SĐT

### Cách dùng:
```
1. Click "Suppliers" trong menu
2. Click "Thêm nhà cung cấp"
3. Nhập thông tin:
   - Tên NCC (bắt buộc)
   - Người liên hệ
   - Số điện thoại
   - Email
   - Địa chỉ
   - Ghi chú
4. Click "Thêm"
```

---

## 📦 3. TẠO ĐƠN ĐẶT HÀNG (Purchase Orders) - AUTO PRICE

### Đường dẫn: `/purchase-orders`

### Chức năng:
- ✅ Tạo đơn đặt hàng từ NCC
- ✅ **Tự động điền giá** từ hệ thống
- ✅ Duyệt đơn
- ✅ Lọc theo trạng thái

### Cách dùng (Tối ưu):
```
1. Click "Purchase Orders" → "Tạo đơn đặt hàng mới"
2. Chọn nhà cung cấp (VD: CellphoneS)
3. Chọn sản phẩm: "Redmi Note 13 Pro"
   → Giá TỰ ĐỘNG điền: 6.290.000 ✅
4. Nhập số lượng: 50
5. Điều chỉnh giá nếu cần (VD: giảm 10% → 5.661.000)
6. Click "Thêm sản phẩm" nếu muốn thêm sản phẩm khác
7. Click "Tạo đơn"
8. DONE! ✅
```

**Lưu ý**: Giá tự động lấy từ ProductVariant.price trong hệ thống

---

## 📥 4. NHẬP KHO (Stock In) - SMART IMPORT

### Đường dẫn: `/stock-in`

### Chức năng:
- ✅ Nhập kho từ PO đã duyệt
- ✅ Nhập kho thủ công
- ✅ **Nhập nhanh từ cảnh báo** sản phẩm sắp hết
- ✅ **Tự động điền giá** từ hệ thống

### Cách 1: Nhập thủ công
```
1. Click "Stock In" → "Tạo phiếu nhập kho"
2. Chọn "Nhập thủ công"
3. Chọn sản phẩm: "iPhone 14"
   → Giá TỰ ĐỘNG điền: 18.290.000 ✅
4. Nhập số lượng: 30
5. Click "Tạo phiếu"
6. Tồn kho tự động cập nhật +30 ✅
```

### Cách 2: Nhập từ PO
```
1. Click "Stock In" → "Tạo phiếu nhập kho"
2. Chọn "Từ đơn đặt hàng"
3. Chọn PO đã duyệt (VD: PO-010)
   → Tất cả sản phẩm trong PO tự động điền ✅
4. Xác nhận số lượng nhập
5. Click "Tạo phiếu"
```

### ⚡ Cách 3: Nhập nhanh từ cảnh báo (KHUYÊN DÙNG)
```
1. Vào Dashboard
2. Click card "Sản phẩm sắp hết" (màu vàng)
3. Dialog mở với danh sách sản phẩm sắp hết:
   
   ┌────────────────────────────────────┐
   │ ☑️ iPhone 15 Pro Max    | 2  | Rất thấp │
   │ ☑️ Samsung S24 Ultra    | 0  | Hết hàng │
   │ ☑️ Xiaomi 14 Pro        | 5  | Thấp     │
   └────────────────────────────────────┘
   
4. Check các sản phẩm cần nhập (VD: 3 sản phẩm)
5. Click "Nhập kho ngay (3)"
6. Form tự động mở với:
   ✅ 3 sản phẩm đã chọn sẵn
   ✅ Số lượng gợi ý: 18, 20, 15
   ✅ Giá tự động: 25.000.000, 30.000.000, 12.000.000
   ✅ Ghi chú: "Nhập kho cho sản phẩm sắp hết hàng"
7. Review → Click "Tạo phiếu"
8. DONE trong 10 giây! ⚡
```

**Lợi ích**:
- ⏱️ Tiết kiệm 95% thời gian
- ✅ Không bỏ sót sản phẩm sắp hết
- 💯 Giá chính xác từ hệ thống
- 🎯 Số lượng gợi ý thông minh

---

## 🎯 Các tính năng tự động

### 1. **Tự động điền giá**
```
Khi chọn sản phẩm:
  - Hệ thống tự động lấy giá từ ProductVariant.price
  - Hiển thị với format: 25.000.000
  - Có thể điều chỉnh nếu cần
```

### 2. **Tự động cập nhật kho**
```
Khi tạo phiếu nhập:
  - Tồn kho tự động +X
  - Ghi log Stock Movement (IN)
  - Hiển thị ngay trong Inventory
```

### 3. **Tự động tính tổng**
```
Khi thêm/sửa sản phẩm:
  - Tổng tiền = Σ(Số lượng × Giá)
  - Hiển thị real-time
```

### 4. **Gợi ý số lượng**
```
Công thức: Math.max(20 - tồn_hiện_tại, 10)

VD:
  - Tồn hiện tại: 2
  - Gợi ý: 20 - 2 = 18
  
  - Tồn hiện tại: 0
  - Gợi ý: 20 - 0 = 20
  
  - Tồn hiện tại: 15
  - Gợi ý: Min = 10
```

---

## 📊 Dashboard - Cảnh báo thông minh

### Cards trên Dashboard:

```
┌─────────────────────────────────────────────┐
│  💰 Doanh thu hôm nay    📦 Đơn hàng        │
│  ⚠️ Sản phẩm sắp hết ← CLICK HERE           │
│  👥 Khách hàng                               │
└─────────────────────────────────────────────┘
```

### Click "Sản phẩm sắp hết":
```
→ Mở dialog với:
  - Danh sách chi tiết sản phẩm
  - Checkbox để chọn
  - Nút "Nhập kho ngay"
  - Nút "Tạo đơn đặt hàng"
```

---

## 💡 Tips & Tricks

### Tip 1: Nhập số tiền nhanh
```
Nhập: 25000000
Hệ thống tự động format: 25.000.000
Không cần gõ dấu chấm!
```

### Tip 2: Chọn nhiều sản phẩm hết hàng
```
1. Low Stock Alert → Check "Select All"
2. Bỏ check những sản phẩm không cần
3. Click "Nhập kho ngay"
4. Tất cả đã điền sẵn!
```

### Tip 3: Sửa giá nhanh
```
Giá tự động điền: 25.000.000
Muốn giảm 10%:
  - Click vào ô giá
  - Xóa hết
  - Nhập: 22500000
  - Tự động format: 22.500.000
```

### Tip 4: Kiểm tra console để debug
```
F12 → Console tab
Xem logs khi submit:
  - "Submitting data: { items: [...] }"
  - "Error response: { ... }"
```

---

## 🐛 Troubleshooting

### Lỗi 400 Bad Request:
```
Nguyên nhân: Thiếu dữ liệu hoặc sai định dạng
Giải pháp:
  1. F12 → Console → Xem log
  2. Kiểm tra:
     - Đã chọn nhà cung cấp? (PO)
     - Đã chọn sản phẩm?
     - Giá > 0?
     - Số lượng >= 1?
  3. Submit lại
```

### Giá không tự động điền:
```
Nguyên nhân: Product chưa load xong
Giải pháp:
  1. Đợi 1-2 giây cho products load
  2. Chọn sản phẩm lại
  3. Hoặc refresh trang
```

### Form không mở khi click "Nhập kho ngay":
```
Nguyên nhân: Products chưa load
Giải pháp:
  1. Đợi trang Stock In load hết
  2. Click lại từ Dashboard
```

---

## 📚 Tài liệu tham khảo

Các file tài liệu đã tạo:
- ✅ `CHANGELOG.md` - Log tất cả tính năng
- ✅ `FIXES_SUMMARY.md` - Chi tiết các lỗi đã sửa
- ✅ `FINAL_FIXES.md` - Sửa lỗi cuối cùng
- ✅ `OPTIMIZATION_SUMMARY.md` - Tối ưu hóa logic
- ✅ `USECASE_DIAGRAMS_FINAL.md` - Tất cả sơ đồ use-case
- ✅ `USAGE_GUIDE.md` - File này

---

**Chúc bạn sử dụng hiệu quả!** 🎉

