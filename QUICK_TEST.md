# ⚡ Test nhanh các chức năng đã sửa

## 🎯 Đã sửa xong

✅ **Lỗi không nhập được giá** (Stock In & Purchase Orders)  
✅ **Lỗi thiếu mã đơn** (code field required)  
✅ **Tự động điền giá** từ hệ thống  
✅ **Nhập kho nhanh** từ cảnh báo sắp hết hàng

---

## 🚀 Khởi động server

### Terminal 1 - Backend:
```bash
cd backend
python manage.py runserver
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Truy cập**: http://localhost:3000

---

## ✅ Test Case 1: Tạo Purchase Order (Đơn đặt hàng)

### Bước 1: Vào trang
```
http://localhost:3000/purchase-orders
```

### Bước 2: Click "Tạo đơn đặt hàng mới"

### Bước 3: Điền thông tin
```
- Nhà cung cấp: Chọn bất kỳ (VD: CellphoneS)
- Click "Thêm sản phẩm"
- Chọn sản phẩm: Bất kỳ (VD: iPhone 15 Pro Max)
  → Giá TỰ ĐỘNG điền ✅
- Số lượng: 50
- Ghi chú: "Test tạo PO"
```

### Bước 4: Click "Tạo đơn"

### ✅ Kết quả mong đợi:
```
✅ Thông báo: "Tạo đơn đặt hàng thành công"
✅ Đơn mới xuất hiện với mã: "PO-20251004XXXXXX"
✅ Không có lỗi 400 Bad Request
```

---

## ✅ Test Case 2: Tạo Stock In (Nhập kho thủ công)

### Bước 1: Vào trang
```
http://localhost:3000/stock-in
```

### Bước 2: Click "Tạo phiếu nhập kho"

### Bước 3: Điền thông tin
```
- Nguồn: "Nhập thủ công"
- Click "Thêm sản phẩm"
- Chọn sản phẩm: Bất kỳ (VD: Samsung S24 Ultra)
  → Giá TỰ ĐỘNG điền ✅
- Số lượng: 30
- Ghi chú: "Test nhập kho"
```

### Bước 4: Click "Tạo phiếu"

### ✅ Kết quả mong đợi:
```
✅ Thông báo: "Tạo phiếu nhập kho thành công"
✅ Phiếu mới xuất hiện với mã: "IN-20251004XXXXXX"
✅ Tồn kho tự động cập nhật +30
✅ Không có lỗi 400 Bad Request
```

---

## ✅ Test Case 3: Nhập kho nhanh (TÍNH NĂNG MỚI ⚡)

### Bước 1: Vào Dashboard
```
http://localhost:3000/
```

### Bước 2: Click card "Sản phẩm sắp hết" (màu vàng)

### Bước 3: Dialog mở với danh sách sản phẩm
```
Checkbox list:
☐ iPhone 15 Pro Max (tồn: 2)
☐ Samsung S24 Ultra (tồn: 0)
☐ Xiaomi 14 Pro (tồn: 5)
```

### Bước 4: Check 2-3 sản phẩm

### Bước 5: Click "Nhập kho ngay (X)"

### ✅ Kết quả mong đợi:
```
✅ Chuyển đến trang Stock In
✅ Form tự động mở
✅ 2-3 sản phẩm đã được chọn sẵn
✅ Số lượng gợi ý đã điền (VD: 18, 20, 15)
✅ Giá tự động điền từ hệ thống
✅ Ghi chú: "Nhập kho cho sản phẩm sắp hết hàng"
```

### Bước 6: Chỉ cần review và click "Tạo phiếu"

### ✅ Kết quả:
```
✅ Tạo phiếu thành công
✅ Tồn kho tự động cập nhật
✅ Hoàn thành trong 10 giây! ⚡
```

---

## ✅ Test Case 4: Tạo Order (Đơn hàng)

### Bước 1: Vào trang
```
http://localhost:3000/orders
```

### Bước 2: Click "Tạo đơn hàng"

### Bước 3: Điền thông tin
```
- Khách hàng: Chọn bất kỳ
- Click "Thêm sản phẩm"
- Chọn sản phẩm: Bất kỳ
- Số lượng: 2
```

### Bước 4: Click "Tạo đơn hàng"

### ✅ Kết quả mong đợi:
```
✅ Thông báo: "Tạo đơn hàng thành công"
✅ Đơn mới xuất hiện với mã: "ORD-20251004XXXXXX"
✅ Không có lỗi {"code": ["Trường này là bắt buộc."]}
```

---

## 🐛 Nếu vẫn gặp lỗi

### Lỗi 400 Bad Request:

1. **Mở Console** (F12)
2. **Xem tab Console**:
   ```javascript
   Submitting data: { ... }
   Error response: { ... }
   ```
3. **Kiểm tra**:
   - Đã chọn sản phẩm chưa?
   - Đã chọn nhà cung cấp chưa? (PO)
   - Số lượng >= 1?
   - Giá >= 0?

### Giá không tự động điền:

1. **Đợi 1-2 giây** cho products load
2. **Chọn lại sản phẩm**
3. Hoặc **refresh trang** (F5)

### Form không mở từ Low Stock Alert:

1. **Đợi** trang Stock In load hết (~2 giây)
2. **Click lại** từ Dashboard

---

## 📊 Kiểm tra kết quả

### 1. Kiểm tra mã tự động:
```
Purchase Order: PO-20251004105530
Stock In: IN-20251004105612
Order: ORD-20251004105645
```

### 2. Kiểm tra giá tự động:
```
- Chọn sản phẩm → Giá tự động hiện ra
- Format: 25.000.000 (có dấu chấm)
```

### 3. Kiểm tra tồn kho:
```
Dashboard → Inventory → Xem tồn kho đã tăng
```

### 4. Kiểm tra backend logs:
```
Terminal 1 (Backend):
- POST /api/purchase-orders/ HTTP/1.1" 201 (SUCCESS)
- POST /api/stock-in/ HTTP/1.1" 201 (SUCCESS)
- POST /api/orders/ HTTP/1.1" 201 (SUCCESS)

Không còn:
- "POST /api/purchase-orders/ HTTP/1.1" 400 (BAD REQUEST)
```

---

## 🎉 Tất cả test pass = Thành công!

```
✅ Tạo Purchase Order → SUCCESS (Mã: PO-XXXXXX)
✅ Tạo Stock In → SUCCESS (Mã: IN-XXXXXX)
✅ Nhập kho nhanh → SUCCESS (10 giây)
✅ Tạo Order → SUCCESS (Mã: ORD-XXXXXX)
✅ Giá tự động điền → SUCCESS
✅ Tồn kho tự động cập nhật → SUCCESS
```

---

## 📚 Tài liệu chi tiết

Xem các file sau để biết thêm:
- `FINAL_AUTO_CODE_FIX.md` - Chi tiết sửa lỗi mã đơn
- `OPTIMIZATION_SUMMARY.md` - Chi tiết tối ưu hóa
- `USAGE_GUIDE.md` - Hướng dẫn sử dụng đầy đủ
- `COMPLETE_UPDATE_SUMMARY.md` - Tổng quan toàn bộ

---

**Chúc test thành công!** 🚀

