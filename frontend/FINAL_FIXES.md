# Tóm tắt sửa lỗi cuối cùng - Input giá và chọn sản phẩm hết hàng

## 🐛 Lỗi đã sửa

### 1. **Lỗi không nhập được giá trong Purchase Orders và Stock In**

**Vấn đề**: 
- Input bị block, không thể nhập số
- Format number gây conflict khi đang nhập

**Nguyên nhân**:
```javascript
// SAI - Format liên tục khi đang nhập
value={formatNumber(item.unit_cost)}  // "1000" -> "1.000" -> "1.000.000" (lỗi)
```

**Giải pháp**:
```javascript
// ĐÚNG - Clean và format riêng biệt
const handleItemChange = (index, field, value) => {
  if (field === 'unit_cost') {
    // Xóa tất cả dấu chấm, chỉ giữ số
    const cleanValue = value.toString().replace(/\./g, '').replace(/[^0-9]/g, '')
    processedValue = cleanValue === '' ? '' : parseInt(cleanValue) || 0
  }
}

// Hiển thị với format
value={item.unit_cost ? formatNumber(item.unit_cost) : ''}
```

**Kết quả**:
- ✅ Nhập: `1000000` → Hiển thị: `1.000.000`
- ✅ Tiếp tục nhập: `10000000` → Hiển thị: `10.000.000`
- ✅ Submit API nhận: `10000000` (number)

---

## ✨ Tính năng mới

### 2. **Chọn sản phẩm hết hàng để nhập kho ngay**

**Chức năng**:
1. **Checkbox để chọn sản phẩm** trong LowStockAlert
2. **Tự động điền form** khi nhập kho
3. **Gợi ý số lượng** cần nhập

**Workflow**:
```
Dashboard 
  → Click "Sản phẩm sắp hết" 
  → Dialog hiển thị danh sách
  → Chọn checkbox sản phẩm cần nhập
  → Click "Nhập kho ngay (3)"
  → Tự động mở form Stock In với:
     - Sản phẩm đã được chọn sẵn
     - Số lượng gợi ý tự động
     - Ghi chú: "Nhập kho cho sản phẩm sắp hết hàng"
```

**Code implementation**:

#### LowStockAlert.jsx
```javascript
// Thêm state cho selected items
const [selectedItems, setSelectedItems] = useState([])

// Chọn sản phẩm
const handleSelectItem = (id) => {
  setSelectedItems(prev => 
    prev.includes(id) 
      ? prev.filter(itemId => itemId !== id)
      : [...prev, id]
  )
}

// Nhập kho với sản phẩm đã chọn
const handleCreateStockIn = () => {
  const itemsToAdd = selectedItems.map(id => {
    const item = lowStockItems.find(i => i.id === id)
    return {
      product_variant: item.product_variant_id,
      suggested_qty: Math.max(20 - item.on_hand, 10)
    }
  })
  
  navigate('/stock-in', { state: { preSelectedItems: itemsToAdd } })
}
```

#### StockIn.jsx
```javascript
// Nhận dữ liệu từ LowStockAlert
useEffect(() => {
  if (location.state?.preSelectedItems) {
    const items = location.state.preSelectedItems.map(item => ({
      product_variant: item.product_variant,
      qty: item.suggested_qty,
      unit_cost: ''
    }))
    
    setFormData({
      source: 'MANUAL',
      note: 'Nhập kho cho sản phẩm sắp hết hàng',
      items: items
    })
    
    setFormOpen(true)
  }
}, [location.state])
```

---

## 📋 Chi tiết thay đổi

### Files đã sửa:

#### 1. `frontend/src/utils/formatters.js`
- ✅ Sửa logic `formatNumber()` để tránh conflict
- ✅ Thêm `formatNumberDisplay()` cho display only

#### 2. `frontend/src/pages/PurchaseOrders/PurchaseOrders.jsx`
- ✅ Sửa `handleItemChange()` - clean input đúng cách
- ✅ Sửa TextField value condition
- ✅ Thêm validation trước khi submit
- ✅ Initial state `unit_cost: ''` thay vì `0`

#### 3. `frontend/src/pages/StockIn/StockIn.jsx`
- ✅ Sửa `handleItemChange()` - clean input đúng cách
- ✅ Sửa TextField value condition
- ✅ Thêm validation trước khi submit
- ✅ Thêm `useLocation` để nhận data
- ✅ Thêm useEffect xử lý preSelectedItems
- ✅ Initial state `unit_cost: ''` thay vì `0`

#### 4. `frontend/src/components/LowStockAlert/LowStockAlert.jsx`
- ✅ Thêm state `selectedItems`
- ✅ Thêm Checkbox cho từng row
- ✅ Thêm "Select All" checkbox
- ✅ Hiển thị số lượng đã chọn trên nút
- ✅ Pass data qua navigate state
- ✅ Highlight row khi được chọn

---

## 🎯 Demo

### Test nhập giá:
```
1. Vào Stock In → Tạo phiếu mới
2. Nhập giá: 5000000
3. Kiểm tra hiển thị: "5.000.000" ✅
4. Tiếp tục nhập: 50000000
5. Kiểm tra hiển thị: "50.000.000" ✅
6. Submit → Backend nhận: 50000000 ✅
```

### Test chọn sản phẩm hết hàng:
```
1. Dashboard → Click card "Sản phẩm sắp hết"
2. Dialog mở → Chọn 3 sản phẩm hết hàng ✅
3. Nút hiển thị: "Nhập kho ngay (3)" ✅
4. Click "Nhập kho ngay" ✅
5. Form mở với:
   - 3 sản phẩm đã được chọn sẵn ✅
   - Số lượng gợi ý (VD: 15, 20, 10) ✅
   - Ghi chú tự động ✅
6. Chỉ cần nhập giá → Submit ✅
```

---

## ✅ Checklist hoàn thành

- [x] Sửa lỗi không nhập được giá trong Purchase Orders
- [x] Sửa lỗi không nhập được giá trong Stock In
- [x] Format số với dấu chấm ngăn cách (1.000.000)
- [x] Xóa số 0 mặc định ở đầu input
- [x] Thêm checkbox chọn sản phẩm trong Low Stock Alert
- [x] Tự động điền form khi chọn "Nhập kho ngay"
- [x] Gợi ý số lượng cần nhập thông minh
- [x] Validation dữ liệu trước khi submit
- [x] Hiển thị số lượng đã chọn trên nút
- [x] Highlight row khi được chọn

---

## 🚀 Cách sử dụng

### Nhập giá bình thường:
```
1. Vào Purchase Orders hoặc Stock In
2. Click "Tạo mới"
3. Nhập giá trực tiếp: 5000000
4. Hệ thống tự format: 5.000.000
5. Submit bình thường
```

### Nhập kho từ sản phẩm hết hàng:
```
1. Vào Dashboard
2. Click card "Sản phẩm sắp hết" (màu vàng)
3. Chọn checkbox các sản phẩm cần nhập
4. Click "Nhập kho ngay (X)"
5. Form tự động mở với:
   - Sản phẩm đã chọn
   - Số lượng gợi ý
   - Ghi chú tự động
6. Nhập giá → Submit
```

---

## 📊 So sánh trước/sau

### TRƯỚC:
```
❌ Nhập giá: Bị block, không nhập được
❌ Hiển thị: 01000000 (có số 0 ở đầu)
❌ Low Stock Alert: Chỉ xem, không thao tác được
❌ Phải nhập thủ công từng sản phẩm
```

### SAU:
```
✅ Nhập giá: Mượt mà, không bị block
✅ Hiển thị: 1.000.000 (format đẹp)
✅ Low Stock Alert: Chọn được sản phẩm
✅ Tự động điền form, tiết kiệm thời gian
✅ Gợi ý số lượng thông minh
```

---

**Kết luận**: Đã sửa thành công lỗi nhập giá và thêm chức năng chọn sản phẩm hết hàng để nhập kho nhanh chóng! 🎉

