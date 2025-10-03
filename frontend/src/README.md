# Cấu trúc Frontend - Component-Based Architecture

## Tổng quan
Dự án được tổ chức theo kiểu component-based, mỗi component có folder riêng chứa component chính và file styles của nó.

## Cấu trúc thư mục

```
src/
├── components/           # Các component tái sử dụng
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.styles.js
│   ├── Notification/
│   │   ├── Notification.jsx
│   │   └── Notification.styles.js
│   ├── CustomerForm/
│   │   ├── CustomerForm.jsx
│   │   └── CustomerForm.styles.js
│   ├── ProductForm/
│   │   ├── ProductForm.jsx
│   │   └── ProductForm.styles.js
│   ├── OrderForm/
│   │   ├── OrderForm.jsx
│   │   └── OrderForm.styles.js
│   └── PaymentDialog/
│       ├── PaymentDialog.jsx
│       └── PaymentDialog.styles.js
├── pages/               # Các trang chính
│   ├── Login/
│   │   ├── Login.jsx
│   │   └── Login.styles.js
│   ├── Dashboard/
│   │   ├── Dashboard.jsx
│   │   └── Dashboard.styles.js
│   ├── Products/
│   │   ├── Products.jsx
│   │   └── Products.styles.js
│   ├── Orders/
│   │   ├── Orders.jsx
│   │   └── Orders.styles.js
│   ├── Customers/
│   │   ├── Customers.jsx
│   │   └── Customers.styles.js
│   ├── Inventory/
│   │   ├── Inventory.jsx
│   │   └── Inventory.styles.js
│   └── Reports/
│       ├── Reports.jsx
│       └── Reports.styles.js
├── theme.js             # Material-UI theme chung
├── App.jsx
└── main.jsx
```

## Quy tắc tổ chức

### 1. Mỗi component có 2 file:
- `[ComponentName].jsx` - Component chính
- `[ComponentName].styles.js` - Styles cho component đó

### 2. Import styles:
```javascript
// Trong component
import { componentStyles } from './ComponentName.styles'

// Sử dụng
<Box sx={componentStyles.container}>
  <Typography {...componentStyles.title}>Title</Typography>
</Box>
```

### 3. Theme chung:
```javascript
// Trong main.jsx
import theme from './theme'

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

## Lợi ích

1. **Tổ chức rõ ràng**: Mỗi component có folder riêng, dễ tìm kiếm
2. **Tách biệt concerns**: Logic và styles được tách riêng
3. **Dễ bảo trì**: Chỉnh sửa component nào thì chỉ cần vào folder đó
4. **Tái sử dụng**: Styles được đóng gói cùng component
5. **Scalable**: Dễ dàng thêm component mới theo cùng pattern

## Ví dụ sử dụng

### Tạo component mới:
1. Tạo folder `src/components/NewComponent/`
2. Tạo `NewComponent.jsx` và `NewComponent.styles.js`
3. Import và sử dụng trong các component khác

### Thêm styles mới:
1. Mở file `[ComponentName].styles.js`
2. Thêm style object mới
3. Sử dụng trong component với `sx` prop hoặc spread operator
