WARNING 2025-10-04 10:55:53,682 log Bad Request: /api/stock-in/
WARNING 2025-10-04 10:55:53,682 basehttp "POST /api/stock-in/ HTTP/1.1" 400 45
# Sơ đồ Use-Case Hoàn chỉnh - Hệ thống Quản lý Cửa hàng Điện thoại

## 📋 Danh sách các sơ đồ

1. Quản lý Sản phẩm
2. Quản lý Khách hàng  
3. Quản lý Đơn hàng
4. Thanh toán
5. Quản lý Kho
6. Mua hàng & Nhà cung cấp
7. Báo cáo & Thống kê
8. Quản lý Người dùng

---

## 📊 1. QUẢN LÝ SẢN PHẨM

```plantuml
@startuml
!theme plain
scale 1.2
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

left to right direction

actor "Admin" as Admin #LightGray
actor "Nhân viên" as Staff #LightGray

rectangle "QUẢN LÝ SẢN PHẨM" {
  
  package "Thương hiệu" {
    usecase "Xem danh sách\nthương hiệu" as UC1
    usecase "Thêm thương hiệu" as UC2
    usecase "Sửa thương hiệu" as UC3
    usecase "Xóa thương hiệu" as UC4
    usecase "Tìm kiếm\nthương hiệu" as UC5
    usecase "Upload logo" as UC6
  }
  
  package "Sản phẩm" {
    usecase "Xem danh sách\nsản phẩm" as UC7
    usecase "Thêm sản phẩm" as UC8
    usecase "Sửa sản phẩm" as UC9
    usecase "Xóa sản phẩm" as UC10
    usecase "Tìm kiếm\nsản phẩm" as UC11
    usecase "Lọc theo\nthương hiệu" as UC12
  }
  
  package "Biến thể" {
    usecase "Xem biến thể\n(RAM/ROM/Màu)" as UC13
    usecase "Thêm biến thể" as UC14
    usecase "Sửa biến thể\n& Giá tự động" as UC15
    usecase "Xóa biến thể" as UC16
  }
}

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8
Admin --> UC9
Admin --> UC10
Admin --> UC11
Admin --> UC12
Admin --> UC13
Admin --> UC14
Admin --> UC15
Admin --> UC16

Staff --> UC7
Staff --> UC11
Staff --> UC12
Staff --> UC13

UC2 ..> UC6 : <<extend>>
UC3 ..> UC6 : <<extend>>
UC8 ..> UC14 : <<include>>
UC15 ..> UC8 : <<include>>

@enduml
```

---

## 📊 2. QUẢN LÝ KHÁCH HÀNG

```plantuml
@startuml
!theme plain
scale 1.3
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

top to bottom direction

actor "Nhân viên" as Staff #LightGray

rectangle "QUẢN LÝ KHÁCH HÀNG" {
  
  usecase "Xem danh sách\nkhách hàng" as UC1
  
  usecase "Thêm khách hàng mới\n(Tên, SĐT, Email)" as UC2
  
  usecase "Sửa thông tin\nkhách hàng" as UC3
  
  usecase "Xem chi tiết &\nLịch sử mua hàng" as UC4
  
  usecase "Tìm kiếm\nkhách hàng" as UC5
}

Staff --> UC1
Staff --> UC2
Staff --> UC3
Staff --> UC4
Staff --> UC5

UC4 ..> UC1 : <<include>>

@enduml
```

---

## 📊 3. QUẢN LÝ ĐƠN HÀNG

```plantuml
@startuml
!theme plain
scale 1.2
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

left to right direction

actor "Nhân viên" as Staff #LightGray
actor "Admin" as Admin #LightGray

rectangle "QUẢN LÝ ĐƠN HÀNG" {
  
  package "Tạo đơn" {
    usecase "Tạo đơn hàng" as UC1
    usecase "Chọn khách hàng" as UC2
    usecase "Thêm sản phẩm\n& Kiểm tra kho" as UC3
    usecase "Tính tổng\ntự động" as UC4
  }
  
  package "Quản lý" {
    usecase "Xem danh sách\nđơn hàng" as UC5
    usecase "Lọc theo\ntrạng thái" as UC6
    usecase "Xem chi tiết\nđơn hàng" as UC7
    usecase "Tìm kiếm" as UC8
  }
  
  package "Xử lý" {
    usecase "Hủy đơn &\nHoàn kho" as UC9
    usecase "In hóa đơn" as UC10
  }
}

Staff --> UC1
Staff --> UC5
Staff --> UC7
Staff --> UC10

Admin --> UC5
Admin --> UC7
Admin --> UC9

UC1 ..> UC2 : <<include>>
UC1 ..> UC3 : <<include>>
UC1 ..> UC4 : <<include>>
UC5 ..> UC6 : <<extend>>
UC5 ..> UC8 : <<extend>>

@enduml
```

---

## 📊 4. THANH TOÁN

```plantuml
@startuml
!theme plain
scale 1.2
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

left to right direction

actor "Nhân viên" as Staff #LightGray
actor "Khách hàng" as Customer #LightGray
actor "VNPay" as VNPay #LightGray

rectangle "HỆ THỐNG THANH TOÁN" {
  
  usecase "Chọn phương thức\nthanh toán" as UC1
  
  package "Tiền mặt" {
    usecase "Thanh toán\ntiền mặt" as UC2
    usecase "Tính tiền thừa" as UC3
  }
  
  package "Chuyển khoản" {
    usecase "Thanh toán\nchuyển khoản" as UC4
    usecase "Xác nhận\nnhận tiền" as UC5
  }
  
  package "VNPay" {
    usecase "Tạo thanh toán\nVNPay" as UC6
    usecase "Khách thanh toán\nonline" as UC7
    usecase "Xác thực\ncallback" as UC8
    usecase "Cập nhật\ntrạng thái" as UC9
  }
  
  package "Xử lý" {
    usecase "Xuất kho\ntự động" as UC10
    usecase "Cập nhật\ntồn kho" as UC11
  }
  
  usecase "Xem lịch sử\nthanh toán" as UC12
}

Staff --> UC1
Staff --> UC2
Staff --> UC4
Staff --> UC6
Staff --> UC12

Customer --> UC7

VNPay --> UC8

UC1 ..> UC2 : <<extend>>
UC1 ..> UC4 : <<extend>>
UC1 ..> UC6 : <<extend>>

UC2 ..> UC3 : <<include>>
UC4 ..> UC5 : <<include>>
UC6 ..> UC7 : <<include>>
UC7 ..> UC8 : <<include>>
UC8 ..> UC9 : <<include>>

UC2 ..> UC10 : <<include>>
UC4 ..> UC10 : <<include>>
UC9 ..> UC10 : <<include>>
UC10 ..> UC11 : <<include>>

@enduml
```

---

## 📊 5. QUẢN LÝ KHO (Đã tối ưu)

```plantuml
@startuml
!theme plain
scale 1.2
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

left to right direction

actor "Quản lý kho" as Inventory #LightGray
actor "Nhân viên\nmua hàng" as Procurement #LightGray

rectangle "QUẢN LÝ KHO" {
  
  package "Nhập kho" {
    usecase "Nhập từ PO" as UC1
    usecase "Nhập thủ công\n& Tự động điền giá" as UC2
    usecase "Nhập nhanh từ\ncảnh báo hết hàng" as UC3
    usecase "Cập nhật kho\ntự động" as UC4
  }
  
  package "Xuất kho" {
    usecase "Xuất theo\nđơn hàng" as UC5
    usecase "Trừ kho\ntự động" as UC6
  }
  
  package "Quản lý" {
    usecase "Xem tồn kho" as UC7
    usecase "Cảnh báo\nsắp hết" as UC8
    usecase "Xem lịch sử\nxuất nhập" as UC9
  }
}

Inventory --> UC1
Inventory --> UC2
Inventory --> UC3
Inventory --> UC5
Inventory --> UC7
Inventory --> UC8
Inventory --> UC9

Procurement --> UC1
Procurement --> UC2

UC1 ..> UC4 : <<include>>
UC2 ..> UC4 : <<include>>
UC3 ..> UC4 : <<include>>
UC5 ..> UC6 : <<include>>
UC7 ..> UC8 : <<include>>

@enduml
```

---

## 📊 6. MUA HÀNG & NHÀ CUNG CẤP

```plantuml
@startuml
!theme plain
scale 1.2
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

left to right direction

actor "Mua hàng" as Procurement #LightGray
actor "Admin" as Admin #LightGray

rectangle "QUẢN LÝ MUA HÀNG" {
  
  package "Nhà cung cấp" {
    usecase "Xem danh sách\nNCC" as UC1
    usecase "Thêm/Sửa\nthông tin NCC" as UC2
    usecase "Xóa NCC" as UC3
  }
  
  package "Đơn đặt hàng (PO)" {
    usecase "Tạo PO\n& Tự động điền giá" as UC4
    usecase "Chọn NCC &\nThêm sản phẩm" as UC5
    usecase "Tính tổng\ntự động" as UC6
  }
  
  package "Xử lý PO" {
    usecase "Xem danh sách\n& Lọc PO" as UC7
    usecase "Duyệt PO" as UC8
    usecase "Hủy PO" as UC9
  }
}

Procurement --> UC1
Procurement --> UC2
Procurement --> UC4
Procurement --> UC7
Procurement --> UC8

Admin --> UC3
Admin --> UC7
Admin --> UC9

UC4 ..> UC5 : <<include>>
UC4 ..> UC6 : <<include>>

@enduml
```

---

## 📊 7. BÁO CÁO & THỐNG KÊ

```plantuml
@startuml
!theme plain
scale 1.2
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

left to right direction

actor "Nhân viên" as Staff #LightGray
actor "Quản lý kho" as Inventory #LightGray
actor "Admin" as Admin #LightGray

rectangle "BÁO CÁO & THỐNG KÊ" {
  
  package "Dashboard" {
    usecase "Thống kê\ntổng quan" as UC1
    usecase "Click xem\ncảnh báo kho" as UC2
    usecase "Gợi ý nhập hàng\nthông minh" as UC3
  }
  
  package "Doanh thu" {
    usecase "Báo cáo\ndoanh thu" as UC4
    usecase "Top sản phẩm\nbán chạy" as UC5
    usecase "Biểu đồ" as UC6
  }
  
  package "Tồn kho" {
    usecase "Báo cáo\ntồn kho" as UC7
    usecase "Sản phẩm\nhết hàng" as UC8
    usecase "Lịch sử\nxuất nhập" as UC9
  }
}

Staff --> UC1
Staff --> UC4
Staff --> UC6

Inventory --> UC1
Inventory --> UC2
Inventory --> UC3
Inventory --> UC7
Inventory --> UC9

Admin --> UC1
Admin --> UC4
Admin --> UC5
Admin --> UC7

UC1 ..> UC2 : <<include>>
UC2 ..> UC3 : <<include>>
UC7 ..> UC8 : <<include>>

@enduml
```

---

## 📊 8. QUẢN LÝ NGƯỜI DÙNG

```plantuml
@startuml
!theme plain
scale 1.3
skinparam linetype ortho
skinparam backgroundColor #FFFFFF

top to bottom direction

actor "Người dùng" as User #LightGray
actor "Admin" as Admin #LightGray

rectangle "QUẢN LÝ NGƯỜI DÙNG" {
  
  package "Xác thực" {
    usecase "Đăng nhập" as UC1
    usecase "Đăng xuất" as UC2
    usecase "Xem thông tin\ncá nhân" as UC3
    usecase "Đổi mật khẩu" as UC4
  }
  
  package "Quản lý" {
    usecase "Xem danh sách\nnhân viên" as UC5
    usecase "Thêm nhân viên\n& Phân quyền" as UC6
    usecase "Sửa thông tin" as UC7
    usecase "Xóa/Vô hiệu hóa" as UC8
  }
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5
Admin --> UC6
Admin --> UC7
Admin --> UC8

UC6 ..> UC7 : <<include>>

@enduml
```

---

## 🎯 Tính năng đặc biệt được highlight

### ⚡ Tối ưu hóa UX:

1. **Tự động điền giá** từ hệ thống khi chọn sản phẩm
2. **Gợi ý nhập hàng thông minh** từ Dashboard
3. **Chọn nhanh** sản phẩm sắp hết → Nhập kho ngay
4. **Format số** tự động với dấu chấm (1.000.000)
5. **Validation** đầy đủ trước khi submit
6. **Tính tổng tiền** tự động
7. **Xuất/Nhập kho** tự động cập nhật

---

## 📖 Hướng dẫn render sơ đồ

### Cách 1: PlantUML Online
```
1. Truy cập: http://www.plantuml.com/plantuml/uml/
2. Copy code từ bất kỳ sơ đồ nào ở trên
3. Click "Submit"
4. Tải PNG hoặc SVG
```

### Cách 2: VS Code
```
1. Cài extension: PlantUML (jebbs.plantuml)
2. Tạo file: diagram.puml
3. Paste code
4. Alt + D để preview
5. Export: Ctrl+Shift+P → "PlantUML: Export Current Diagram"
```

### Cách 3: Command Line
```bash
# Cài PlantUML
npm install -g node-plantuml

# Render
puml generate diagram.puml -o output.png
```

---

## 📐 Kích thước đề xuất cho slide

```
Scale: 1.2 - 1.3 (vừa đủ cho slide 16:9)
Format: PNG (cho PowerPoint)
Format: SVG (cho web, vector không vỡ)
DPI: 300 (cho in ấn chất lượng cao)
```

---

## 🎨 Theme và màu sắc

```plantuml
!theme plain              # Theme đen trắng, rõ ràng
skinparam linetype ortho  # Đường thẳng góc
backgroundColor #FFFFFF   # Nền trắng
actor #LightGray         # Actor màu xám nhạt
```

---

## 📝 Ghi chú

- Tất cả sơ đồ đã được tối ưu cho **trình chiếu slide**
- **Cân đối** chiều dài và rộng
- **Màu sắc** đơn giản, dễ nhìn
- **Font chữ** rõ ràng, đủ lớn
- **Highlight** các tính năng đặc biệt (auto-fill giá, gợi ý nhập hàng)

---

**Sẵn sàng cho presentation!** 🎯

