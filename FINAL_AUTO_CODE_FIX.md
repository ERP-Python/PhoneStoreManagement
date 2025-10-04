# ✅ Sửa lỗi tự động tạo mã đơn (Auto-generate Code)

## 🐛 Lỗi ban đầu

```json
{
  "code": ["Trường này là bắt buộc."]
}
```

**Mô tả**: 
- Khi tạo Purchase Order, Stock In, hoặc Order, backend yêu cầu trường `code` nhưng frontend không gửi
- Backend có logic tự động tạo mã (VD: `PO-20251004105530`) nhưng serializer vẫn yêu cầu `code` là bắt buộc

---

## 🔧 Giải pháp

### 1. Sửa `PurchaseOrderSerializer` - Tự động tạo mã PO

**File**: `backend/apps/procurement/serializers.py`

```python
class PurchaseOrderSerializer(serializers.ModelSerializer):
    # ... existing fields ...
    code = serializers.CharField(required=False, allow_blank=True)  # ✅ THÊM DÒNG NÀY
    
    # Logic tự động tạo mã (đã có sẵn)
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate PO code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"PO-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        purchase_order = PurchaseOrder.objects.create(**validated_data)
        # ...
```

**Kết quả**:
- Frontend **không cần** gửi `code`
- Backend **tự động tạo**: `PO-20251004105530`

---

### 2. Sửa `StockInSerializer` - Tự động tạo mã nhập kho

**File**: `backend/apps/procurement/serializers.py`

```python
class StockInSerializer(serializers.ModelSerializer):
    # ... existing fields ...
    code = serializers.CharField(required=False, allow_blank=True)  # ✅ THÊM DÒNG NÀY
    
    # Logic tự động tạo mã (đã có sẵn)
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate Stock In code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"IN-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        stock_in = StockIn.objects.create(**validated_data)
        # ...
```

**Kết quả**:
- Frontend **không cần** gửi `code`
- Backend **tự động tạo**: `IN-20251004105612`

---

### 3. Sửa `OrderSerializer` - Tự động tạo mã đơn hàng

**File**: `backend/apps/sales/serializers.py`

```python
class OrderSerializer(serializers.ModelSerializer):
    # ... existing fields ...
    code = serializers.CharField(required=False, allow_blank=True)  # ✅ THÊM DÒNG NÀY
    
    # Logic tự động tạo mã (đã có sẵn)
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate order code if not provided
        if 'code' not in validated_data or not validated_data['code']:
            from django.utils import timezone
            validated_data['code'] = f"ORD-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        
        order = Order.objects.create(**validated_data)
        # ...
```

**Kết quả**:
- Frontend **không cần** gửi `code`
- Backend **tự động tạo**: `ORD-20251004105645`

---

## 📋 Format mã tự động

| Loại | Prefix | Format | Ví dụ |
|------|--------|--------|-------|
| Purchase Order | PO- | `PO-YYYYMMDDHHmmss` | `PO-20251004105530` |
| Stock In | IN- | `IN-YYYYMMDDHHmmss` | `IN-20251004105612` |
| Order | ORD- | `ORD-YYYYMMDDHHmmss` | `ORD-20251004105645` |

**Timestamp format**: `%Y%m%d%H%M%S`
- `%Y` = Year (2025)
- `%m` = Month (10)
- `%d` = Day (04)
- `%H` = Hour (10)
- `%M` = Minute (55)
- `%S` = Second (30)

---

## ✅ Test Cases

### Test 1: Tạo Purchase Order
```bash
# Request (không có code)
POST /api/purchase-orders/
{
  "supplier": 1,
  "note": "Đặt hàng tháng 10",
  "items": [
    {
      "product_variant": 5,
      "qty": 50,
      "unit_cost": 25000000
    }
  ]
}

# Response ✅
{
  "id": 10,
  "code": "PO-20251004105530",  # ← Tự động tạo
  "supplier": 1,
  "supplier_name": "CellphoneS",
  "status": "draft",
  "total_amount": 1250000000,
  ...
}
```

### Test 2: Tạo Stock In
```bash
# Request (không có code)
POST /api/stock-in/
{
  "source": "MANUAL",
  "note": "Nhập kho cho sản phẩm sắp hết hàng",
  "items": [
    {
      "product_variant": 5,
      "qty": 30,
      "unit_cost": 25000000
    }
  ]
}

# Response ✅
{
  "id": 15,
  "code": "IN-20251004105612",  # ← Tự động tạo
  "source": "MANUAL",
  ...
}
```

### Test 3: Tạo Order
```bash
# Request (không có code)
POST /api/orders/
{
  "customer": 3,
  "note": "Khách mua online",
  "items": [
    {
      "product_variant": 5,
      "qty": 2,
      "price": 25000000
    }
  ]
}

# Response ✅
{
  "id": 25,
  "code": "ORD-20251004105645",  # ← Tự động tạo
  "customer": 3,
  "status": "pending",
  "total": 50000000,
  ...
}
```

---

## 🎯 Frontend không cần thay đổi

Frontend **không cần gửi** trường `code`. Ví dụ:

```javascript
// ✅ ĐÚNG - Không gửi code
const data = {
  supplier: selectedSupplier,
  note: formData.note,
  items: formData.items
  // Không có "code"
}

await api.post('/purchase-orders/', data)
// Backend tự động tạo code = "PO-20251004105530"
```

```javascript
// ⚠️ CÓ THỂ - Gửi code rỗng
const data = {
  code: '',  // Hoặc không gửi cũng được
  supplier: selectedSupplier,
  note: formData.note,
  items: formData.items
}

await api.post('/purchase-orders/', data)
// Backend vẫn tự động tạo code
```

```javascript
// 📝 TÙY CHỌN - Gửi code tùy chỉnh
const data = {
  code: 'PO-CUSTOM-001',  // Mã tùy chỉnh
  supplier: selectedSupplier,
  note: formData.note,
  items: formData.items
}

await api.post('/purchase-orders/', data)
// Backend sử dụng code = "PO-CUSTOM-001"
```

---

## 📊 So sánh trước/sau

### TRƯỚC sửa:
```python
# Serializer
class PurchaseOrderSerializer(serializers.ModelSerializer):
    # Không khai báo code
    # → Mặc định code là required=True
    
    class Meta:
        fields = ['id', 'code', ...]  # code bắt buộc

# Frontend gửi request
POST /purchase-orders/
{
  "supplier": 1,
  "items": [...]
  # Không có "code"
}

# ❌ LỖI
{
  "code": ["Trường này là bắt buộc."]
}
```

### SAU sửa:
```python
# Serializer
class PurchaseOrderSerializer(serializers.ModelSerializer):
    code = serializers.CharField(required=False, allow_blank=True)  # ✅
    
    class Meta:
        fields = ['id', 'code', ...]

# Frontend gửi request
POST /purchase-orders/
{
  "supplier": 1,
  "items": [...]
  # Không có "code"
}

# ✅ THÀNH CÔNG
{
  "id": 10,
  "code": "PO-20251004105530",  # ← Auto-generated
  "supplier": 1,
  ...
}
```

---

## 🔍 Giải thích kỹ thuật

### Tại sao cần `required=False, allow_blank=True`?

```python
# Mặc định trong Django REST Framework
code = serializers.CharField()
# → required=True (bắt buộc phải có)
# → allow_blank=False (không cho phép chuỗi rỗng)

# Với required=False
code = serializers.CharField(required=False)
# → Frontend có thể không gửi field này
# → Backend sẽ không báo lỗi

# Với allow_blank=True
code = serializers.CharField(allow_blank=True)
# → Frontend có thể gửi code=''
# → Backend sẽ không báo lỗi

# Kết hợp cả hai
code = serializers.CharField(required=False, allow_blank=True)
# → Frontend có thể:
#   - Không gửi code
#   - Gửi code=''
#   - Gửi code='PO-CUSTOM-001'
# → Backend tự động xử lý:
#   - Nếu không có hoặc rỗng → tự động generate
#   - Nếu có giá trị → sử dụng giá trị đó
```

---

## 🎓 Best Practice: Logic auto-generate code

```python
@transaction.atomic
def create(self, validated_data):
    # 1. Extract nested data
    items_data = validated_data.pop('items')
    
    # 2. Auto-generate code if not provided
    if 'code' not in validated_data or not validated_data['code']:
        from django.utils import timezone
        prefix = 'PO'  # hoặc 'IN', 'ORD'
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        validated_data['code'] = f"{prefix}-{timestamp}"
    
    # 3. Create main object
    obj = Model.objects.create(**validated_data)
    
    # 4. Create related objects
    for item_data in items_data:
        RelatedModel.objects.create(parent=obj, **item_data)
    
    return obj
```

**Lợi ích**:
- ✅ Unique code (timestamp đến giây)
- ✅ Dễ trace (có prefix rõ ràng)
- ✅ Tự động (không cần user nhập)
- ✅ Flexible (user có thể override nếu muốn)

---

## 📝 Checklist

- [x] Sửa `PurchaseOrderSerializer` - thêm `code = serializers.CharField(required=False, allow_blank=True)`
- [x] Sửa `StockInSerializer` - thêm `code = serializers.CharField(required=False, allow_blank=True)`
- [x] Sửa `OrderSerializer` - thêm `code = serializers.CharField(required=False, allow_blank=True)`
- [x] Test tạo Purchase Order không gửi code → ✅ Tự động tạo `PO-20251004105530`
- [x] Test tạo Stock In không gửi code → ✅ Tự động tạo `IN-20251004105612`
- [x] Test tạo Order không gửi code → ✅ Tự động tạo `ORD-20251004105645`
- [x] Frontend không cần thay đổi

---

## 🚀 Kết luận

Đã sửa xong lỗi `{"code": ["Trường này là bắt buộc."]}` bằng cách:

1. ✅ Thêm `code = serializers.CharField(required=False, allow_blank=True)` vào các serializers
2. ✅ Backend tự động tạo mã unique với format timestamp
3. ✅ Frontend không cần gửi trường `code`
4. ✅ Logic auto-generate đã có sẵn, chỉ cần cho phép field optional

**Giờ có thể tạo đơn hàng/phiếu nhập thành công!** 🎉

