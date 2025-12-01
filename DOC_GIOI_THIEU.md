# HỆ THỐNG QUẢN LÝ CỬA HÀNG ĐIỆN THOẠI
## Phone Store Management System

---

## LỜI MỞ ĐẦU

Trong bối cảnh cuộc cách mạng công nghiệp 4.0 đang diễn ra mạnh mẽ, việc ứng dụng công nghệ thông tin vào quản lý và vận hành doanh nghiệp không còn là một lựa chọn mà đã trở thành một yếu tố sống còn đối với sự tồn tại và phát triển của các doanh nghiệp. Ngành bán lẻ điện thoại di động, một trong những lĩnh vực kinh doanh năng động và cạnh tranh khốc liệt nhất hiện nay, cũng không nằm ngoài xu hướng chuyển đổi số này.

Thị trường điện thoại di động tại Việt Nam trong những năm gần đây đã chứng kiến sự tăng trưởng vượt bậc với hàng triệu thiết bị được bán ra mỗi năm. Tuy nhiên, cùng với sự phát triển đó là những thách thức ngày càng lớn trong việc quản lý kho hàng, theo dõi giao dịch, quản lý mối quan hệ khách hàng, và đảm bảo tính minh bạch trong toàn bộ chuỗi cung ứng. Các phương thức quản lý truyền thống dựa trên giấy tờ hoặc bảng tính Excel không còn đáp ứng được yêu cầu về tốc độ, độ chính xác và khả năng mở rộng.

Xuất phát từ thực tiễn đó, việc xây dựng một hệ thống quản lý cửa hàng điện thoại toàn diện, tích hợp các chức năng từ quản lý sản phẩm, mua hàng, tồn kho, bán hàng đến báo cáo phân tích là một nhu cầu cấp thiết. Hệ thống không chỉ giúp tự động hóa các quy trình nghiệp vụ, giảm thiểu sai sót do con người, mà còn cung cấp các công cụ hỗ trợ ra quyết định dựa trên dữ liệu thực tế, từ đó nâng cao hiệu quả kinh doanh và khả năng cạnh tranh của doanh nghiệp.

Đề tài "Hệ thống Quản lý Cửa hàng Điện thoại" được thực hiện với mục tiêu xây dựng một giải pháp phần mềm hiện đại, dễ sử dụng và có khả năng mở rộng cao, đáp ứng đầy đủ các yêu cầu nghiệp vụ của một cửa hàng kinh doanh điện thoại di động. Hệ thống được phát triển dựa trên kiến trúc hiện đại với backend sử dụng Django REST Framework và frontend sử dụng React, đảm bảo tính ổn định, bảo mật và trải nghiệm người dùng tốt nhất.

Qua quá trình nghiên cứu và phát triển dự án này, chúng tôi hy vọng có thể đóng góp một phần nhỏ bé vào việc ứng dụng công nghệ thông tin vào thực tiễn kinh doanh, đồng thời tích lũy kinh nghiệm quý báu trong việc phát triển các hệ thống thông tin quản lý doanh nghiệp.

---

## CHƯƠNG 1: GIỚI THIỆU VỀ DỰ ÁN PHẦN MỀM

### 1.1. Giới thiệu tổng quan về dự án phần mềm

#### 1.1.1. Bối cảnh ra đời của dự án

Ngành bán lẻ điện thoại di động tại Việt Nam đã trải qua nhiều giai đoạn phát triển và hiện đang trong một thời kỳ chuyển đổi mạnh mẽ. Theo thống kê, thị trường smartphone Việt Nam đạt doanh số khoảng 8-10 triệu máy/năm với giá trị hàng tỷ USD. Với quy mô và tốc độ tăng trưởng như vậy, việc quản lý hiệu quả các hoạt động kinh doanh trở thành yếu tố then chốt quyết định sự thành bại của doanh nghiệp.

Tuy nhiên, nhiều cửa hàng kinh doanh điện thoại, đặc biệt là các cửa hàng vừa và nhỏ, vẫn đang sử dụng các phương pháp quản lý truyền thống với nhiều hạn chế:

- **Quản lý thủ công hoặc bán thủ công**: Sử dụng sổ sách, file Excel dẫn đến nhiều sai sót, khó kiểm soát và mất thời gian
- **Thiếu tính tích hợp**: Các phần khác nhau của quy trình kinh doanh (mua hàng, bán hàng, kho hàng) không được kết nối với nhau
- **Khó khăn trong theo dõi tồn kho**: Không nắm bắt được tình trạng hàng tồn kho real-time, dẫn đến tình trạng thừa/thiếu hàng
- **Thiếu công cụ phân tích**: Không có dữ liệu và báo cáo để hỗ trợ ra quyết định kinh doanh
- **Trải nghiệm khách hàng chưa tốt**: Quy trình bán hàng, thanh toán còn chậm và phức tạp

Chính những thách thức trên đã thúc đẩy nhu cầu phát triển một hệ thống quản lý toàn diện, tự động hóa và hiện đại cho ngành kinh doanh điện thoại di động.

#### 1.1.2. Mục tiêu của dự án

Dự án "Hệ thống Quản lý Cửa hàng Điện thoại" được xây dựng với các mục tiêu cụ thể sau:

**Mục tiêu chung:**
- Xây dựng một hệ thống quản lý cửa hàng điện thoại toàn diện, tích hợp đầy đủ các chức năng từ quản lý sản phẩm, thu mua, tồn kho, bán hàng đến báo cáo phân tích
- Ứng dụng các công nghệ lập trình web hiện đại để tạo ra một giải pháp phần mềm ổn định, bảo mật và dễ sử dụng
- Nâng cao hiệu quả quản lý và vận hành kinh doanh cho các cửa hàng điện thoại

**Mục tiêu cụ thể:**

1. **Về chức năng:**
   - Quản lý danh mục sản phẩm (thương hiệu, sản phẩm, biến thể, hình ảnh) một cách khoa học và dễ dàng
   - Quản lý quy trình thu mua từ nhà cung cấp (đơn đặt hàng, nhập kho) một cách chặt chẽ và minh bạch
   - Theo dõi tồn kho real-time với đầy đủ lịch sử xuất nhập tồn
   - Quản lý thông tin khách hàng và lịch sử giao dịch
   - Xử lý đơn hàng, thanh toán (tích hợp VNPay) và xuất kho tự động
   - Cung cấp báo cáo và thống kê đa dạng để hỗ trợ ra quyết định

2. **Về kỹ thuật:**
   - Áp dụng kiến trúc phân lớp, tách biệt frontend và backend để dễ bảo trì và mở rộng
   - Sử dụng RESTful API cho việc trao đổi dữ liệu giữa các thành phần
   - Đảm bảo tính bảo mật thông tin với các cơ chế xác thực và phân quyền
   - Thiết kế giao diện người dùng thân thiện, trực quan và responsive
   - Đảm bảo hiệu năng xử lý tốt với khối lượng dữ liệu lớn

3. **Về đào tạo và nghiên cứu:**
   - Nghiên cứu và thực hành phát triển ứng dụng web full-stack với Django và React
   - Áp dụng các nguyên tắc thiết kế phần mềm, mô hình MVC/MVT
   - Tích lũy kinh nghiệm làm việc với cơ sở dữ liệu quan hệ (MySQL)
   - Làm quen với quy trình phát triển phần mềm chuyên nghiệp

#### 1.1.3. Đối tượng sử dụng

Hệ thống được thiết kế để phục vụ các đối tượng người dùng sau:

1. **Quản trị viên hệ thống (Admin):**
   - Có toàn quyền truy cập và quản lý mọi chức năng của hệ thống
   - Quản lý người dùng, phân quyền truy cập
   - Duyệt các đơn đặt hàng mua vào
   - Xem và phân tích các báo cáo tổng hợp
   - Cấu hình các thông số hệ thống

2. **Nhân viên bán hàng (Staff):**
   - Quản lý thông tin sản phẩm (thêm, sửa, xóa sản phẩm)
   - Tạo và xử lý đơn hàng cho khách hàng
   - Quản lý thông tin khách hàng
   - Xử lý thanh toán và in hóa đơn
   - Xem các báo cáo liên quan đến công việc được giao

3. **Nhân viên kho (Staff):**
   - Thực hiện nhập kho khi nhận hàng từ nhà cung cấp
   - Thực hiện xuất kho theo đơn hàng
   - Kiểm tra và cập nhật tồn kho
   - Xem lịch sử xuất nhập tồn

4. **Nhân viên thu mua (Staff):**
   - Quản lý thông tin nhà cung cấp
   - Tạo đơn đặt hàng mua vào
   - Theo dõi trạng thái đơn hàng
   - Đối chiếu hàng nhập với đơn đặt hàng

#### 1.1.4. Phạm vi của dự án

**Phạm vi triển khai:**

Dự án tập trung phát triển một hệ thống quản lý hoàn chỉnh cho một cửa hàng điện thoại đơn lẻ hoặc chuỗi cửa hàng nhỏ, bao gồm các module chính:

1. **Module Xác thực & Phân quyền (Authentication & Authorization)**
   - Đăng nhập, đăng xuất
   - Quản lý người dùng
   - Phân quyền theo vai trò (RBAC - Role-Based Access Control)

2. **Module Danh mục sản phẩm (Catalog Management)**
   - Quản lý thương hiệu (Brand)
   - Quản lý sản phẩm (Product)
   - Quản lý biến thể sản phẩm (Variant - dung lượng, màu sắc)
   - Quản lý hình ảnh sản phẩm
   - Quản lý số IMEI (International Mobile Equipment Identity)

3. **Module Thu mua (Procurement)**
   - Quản lý nhà cung cấp (Supplier)
   - Quản lý đơn đặt hàng (Purchase Order)
   - Quản lý nhập kho (Stock In)

4. **Module Tồn kho (Inventory)**
   - Theo dõi tồn kho theo thời gian thực
   - Lịch sử xuất nhập kho (Stock Movements)
   - Cảnh báo hàng tồn kho thấp

5. **Module Khách hàng (Customer Management)**
   - Quản lý thông tin khách hàng
   - Lịch sử giao dịch
   - Hệ thống CRM cơ bản

6. **Module Bán hàng (Sales & Orders)**
   - Tạo và quản lý đơn hàng
   - Xử lý thanh toán
   - Tích hợp cổng thanh toán VNPay
   - Xuất kho tự động (Stock Out)
   - In hóa đơn

7. **Module Báo cáo (Reports)**
   - Dashboard tổng quan
   - Báo cáo doanh thu theo thời gian
   - Báo cáo tồn kho
   - Báo cáo sản phẩm bán chạy
   - Các báo cáo thống kê khác

**Giới hạn phạm vi:**

Dự án hiện tại **không** bao gồm:
- Quản lý đa chi nhánh phức tạp (multi-store với inventory riêng)
- Module quản lý bảo hành và sửa chữa
- Module quản lý nhân sự và chấm công
- Hệ thống bán hàng online (e-commerce) đầy đủ
- Module marketing tự động và CRM nâng cao
- Tích hợp với hệ thống kế toán bên ngoài
- Mobile app cho khách hàng

#### 1.1.5. Công nghệ sử dụng

Hệ thống được xây dựng dựa trên kiến trúc Client-Server với sự phân tách rõ ràng giữa phần giao diện người dùng (Frontend) và phần xử lý nghiệp vụ (Backend):

**1. Backend (Server-side):**

- **Ngôn ngữ lập trình**: Python 3.10+
  - Python là ngôn ngữ lập trình bậc cao, dễ học, dễ đọc với cộng đồng phát triển lớn
  - Phù hợp cho phát triển web, xử lý dữ liệu và tích hợp API

- **Web Framework**: Django 4.2.7
  - Django là một web framework Python mạnh mẽ, bảo mật và có nhiều tính năng tích hợp sẵn
  - Triết lý "batteries included" giúp tăng tốc độ phát triển
  - ORM (Object-Relational Mapping) mạnh mẽ cho việc làm việc với database
  - Hệ thống Admin tích hợp sẵn

- **REST API Framework**: Django REST Framework 3.14.0
  - Framework chuyên dụng để xây dựng RESTful API
  - Serialization tự động, validation và authentication
  - Browsable API cho việc test và debug dễ dàng

- **Cơ sở dữ liệu**: MySQL 8.0
  - Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở phổ biến
  - Hiệu năng cao, ổn định và có nhiều công cụ quản lý
  - Hỗ trợ ACID transactions đảm bảo tính toàn vẹn dữ liệu

- **Các thư viện bổ trợ**:
  - `django-cors-headers`: Xử lý Cross-Origin Resource Sharing
  - `Pillow`: Xử lý hình ảnh
  - `python-decouple`: Quản lý cấu hình và biến môi trường
  - `requests`: HTTP client cho việc gọi API bên ngoài
  - `mysqlclient`: MySQL database adapter

**2. Frontend (Client-side):**

- **Thư viện JavaScript**: React 18.2
  - Thư viện JavaScript phổ biến nhất hiện nay cho việc xây dựng giao diện người dùng
  - Component-based architecture giúp tái sử dụng code hiệu quả
  - Virtual DOM cho hiệu năng render tốt
  - Cộng đồng lớn với nhiều thư viện hỗ trợ

- **Build Tool**: Vite 5.0
  - Build tool hiện đại, nhanh hơn nhiều so với Webpack
  - Hot Module Replacement (HMR) cực nhanh
  - Hỗ trợ ES modules natively

- **Routing**: React Router DOM 6.20
  - Thư viện routing chuẩn cho React
  - Hỗ trợ nested routes và dynamic routing

- **HTTP Client**: Axios 1.6
  - HTTP client phổ biến với API dễ sử dụng
  - Hỗ trợ interceptors cho authentication
  - Tự động transform JSON data

- **UI Framework**: Material-UI (MUI) 5.14
  - Component library dựa trên Material Design của Google
  - Các component có sẵn, đẹp và responsive
  - Theming system mạnh mẽ
  - Icon set phong phú (@mui/icons-material)

- **Data Visualization**: Recharts 2.10
  - Thư viện vẽ biểu đồ cho React
  - Dựa trên D3.js nhưng dễ sử dụng hơn
  - Responsive và customizable

- **Các thư viện bổ trợ**:
  - `date-fns`: Xử lý và format ngày tháng
  - `@emotion/react`, `@emotion/styled`: CSS-in-JS cho styling

**3. DevOps & Deployment:**

- **Containerization**: Docker & Docker Compose
  - Đóng gói ứng dụng và dependencies vào container
  - Đảm bảo môi trường development và production nhất quán
  - Dễ dàng deploy và scale

- **Web Server**: Nginx
  - Reverse proxy và load balancer
  - Serve static files
  - SSL/TLS termination

- **Application Server**: Gunicorn
  - WSGI HTTP Server cho Python
  - Production-ready, ổn định
  - Hỗ trợ multiple workers

- **Version Control**: Git
  - Quản lý source code
  - Collaborative development
  - Branching và merging

**4. Testing & Quality Assurance:**

- **Backend Testing**: pytest, pytest-django
  - Framework testing mạnh mẽ cho Python
  - Fixtures và parametrize tests
  - Coverage reporting

- **Test Data**: Factory Boy
  - Tạo test data dễ dàng
  - Hỗ trợ relationships và nested objects

**5. Payment Gateway:**

- **VNPay**: Cổng thanh toán điện tử phổ biến tại Việt Nam
  - Hỗ trợ thẻ ATM nội địa, thẻ quốc tế, QR Code
  - An toàn, bảo mật theo chuẩn PCI-DSS
  - API tích hợp đơn giản

#### 1.1.6. Lợi ích mang lại

Việc triển khai hệ thống quản lý cửa hàng điện thoại sẽ mang lại nhiều lợi ích thiết thực:

**1. Cho chủ doanh nghiệp/Quản lý:**
- **Kiểm soát toàn diện**: Nắm bắt được tình hình kinh doanh real-time qua dashboard và báo cáo
- **Ra quyết định dựa trên dữ liệu**: Các báo cáo phân tích giúp đưa ra quyết định chính xác hơn
- **Giảm thiểu rủi ro**: Kiểm soát chặt chẽ quy trình thu mua và tồn kho, tránh thất thoát
- **Tăng trưởng doanh thu**: Quản lý tốt hơn dẫn đến hiệu quả kinh doanh cao hơn
- **Mở rộng dễ dàng**: Hệ thống có thể scale khi doanh nghiệp phát triển

**2. Cho nhân viên:**
- **Tiết kiệm thời gian**: Tự động hóa các tác vụ lặp đi lặp lại
- **Giảm thiểu sai sót**: Hệ thống kiểm tra và validation tự động
- **Giao diện thân thiện**: Dễ học, dễ sử dụng, không cần đào tạo lâu
- **Làm việc hiệu quả hơn**: Tra cứu thông tin nhanh, xử lý đơn hàng nhanh
- **Phân quyền rõ ràng**: Mỗi người chỉ truy cập những gì cần thiết

**3. Cho khách hàng:**
- **Trải nghiệm mua sắm tốt**: Quy trình thanh toán nhanh chóng, chuyên nghiệp
- **Thông tin minh bạch**: Giá cả, sản phẩm được hiển thị rõ ràng
- **Thanh toán linh hoạt**: Nhiều phương thức thanh toán (tiền mặt, chuyển khoản, VNPay)
- **Hóa đơn chính xác**: Hệ thống tự động tính toán và in hóa đơn

**4. Về mặt kỹ thuật:**
- **Bảo mật cao**: Authentication, authorization, HTTPS encryption
- **Hiệu năng tốt**: Tối ưu database queries, caching
- **Dễ bảo trì**: Code structured, documented, following best practices
- **Khả năng mở rộng**: Kiến trúc modular, có thể thêm tính năng mới
- **Tích hợp dễ dàng**: RESTful API có thể tích hợp với các hệ thống khác

#### 1.1.7. Tính khả thi

**1. Tính khả thi về công nghệ:**
- Tất cả các công nghệ sử dụng đều là mã nguồn mở, miễn phí và có cộng đồng hỗ trợ lớn
- Django và React là những công nghệ trưởng thành, ổn định và được sử dụng rộng rãi
- Nhiều tài liệu học tập, tutorial và best practices có sẵn
- Các thư viện và framework được chọn đều tương thích tốt với nhau

**2. Tính khả thi về nguồn lực:**
- **Nhân lực**: Phù hợp với trình độ sinh viên/lập trình viên có kiến thức cơ bản về web development
- **Thời gian**: Có thể hoàn thành trong khung thời gian 3-6 tháng với team 2-3 người
- **Chi phí**: Không tốn chi phí license phần mềm, chỉ cần máy tính và hosting cho deployment

**3. Tính khả thi về nghiệp vụ:**
- Quy trình nghiệp vụ của cửa hàng điện thoại đã rõ ràng và ổn định
- Đã có nhiều hệ thống tương tự trên thị trường, có thể tham khảo
- Yêu cầu chức năng cụ thể, không quá phức tạp
- Có thể triển khai từng module một (phát triển lặp/agile)

**4. Tính khả thi về thị trường:**
- Nhu cầu thực tế từ các cửa hàng điện thoại vừa và nhỏ
- Chi phí thấp hơn nhiều so với các giải pháp thương mại
- Có thể tùy chỉnh theo nhu cầu cụ thể của từng cửa hàng
- Tiềm năng mở rộng sang các lĩnh vực bán lẻ khác

---

### 1.2. Tổng quan về hệ thống

#### 1.2.1. Kiến trúc tổng quan

Hệ thống quản lý cửa hàng điện thoại được thiết kế theo kiến trúc **Client-Server** với sự tách biệt rõ ràng giữa tầng giao diện (Frontend) và tầng xử lý nghiệp vụ (Backend). Hai tầng này giao tiếp với nhau thông qua RESTful API.

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT SIDE                          │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │           React Frontend Application                │   │
│  │                                                      │   │
│  │  ├─ Components (UI)                                 │   │
│  │  ├─ Pages (Views)                                   │   │
│  │  ├─ Context (State Management)                      │   │
│  │  ├─ API Client (Axios)                              │   │
│  │  └─ Routing (React Router)                          │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/JSON
                            │ RESTful API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                           │
│                                                              │
│  ┌────────────────────────────────────────────────────┐   │
│  │              Django Backend (API Server)            │   │
│  │                                                      │   │
│  │  ├─ API Endpoints (Views)                           │   │
│  │  ├─ Business Logic (Models)                         │   │
│  │  ├─ Serializers (Data Validation)                   │   │
│  │  ├─ Authentication & Authorization                   │   │
│  │  └─ Integration (VNPay, etc.)                       │   │
│  └────────────────────────────────────────────────────┘   │
│                            │                                 │
│                            │ ORM                              │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────┐   │
│  │                 MySQL Database                       │   │
│  │                                                      │   │
│  │  ├─ Users & Permissions                             │   │
│  │  ├─ Catalog (Products, Brands)                      │   │
│  │  ├─ Procurement (Suppliers, POs)                    │   │
│  │  ├─ Inventory & Stock Movements                     │   │
│  │  ├─ Customers                                        │   │
│  │  ├─ Sales (Orders, Payments)                        │   │
│  │  └─ Reports & Analytics                             │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Ưu điểm của kiến trúc này:**
- **Tách biệt concerns**: Frontend chỉ lo hiển thị, Backend lo xử lý nghiệp vụ
- **Độc lập công nghệ**: Có thể thay đổi frontend/backend độc lập
- **Dễ mở rộng**: Có thể phát triển mobile app sử dụng chung API
- **Bảo mật tốt hơn**: Business logic và database không expose trực tiếp
- **Phát triển song song**: Frontend và Backend team có thể làm việc độc lập

#### 1.2.2. Mô hình dữ liệu tổng quan

Hệ thống sử dụng cơ sở dữ liệu quan hệ (MySQL) với các bảng chính được tổ chức theo các module nghiệp vụ:

**1. Module Users (Người dùng):**
- `users`: Thông tin người dùng hệ thống
- `groups`: Nhóm phân quyền
- `permissions`: Quyền hạn cụ thể

**2. Module Catalog (Danh mục):**
- `brands`: Thương hiệu điện thoại
- `products`: Sản phẩm (model/dòng máy)
- `product_variants`: Biến thể (dung lượng, màu sắc)
- `product_images`: Hình ảnh sản phẩm
- `imeis`: Số IMEI của từng máy

**3. Module Procurement (Thu mua):**
- `suppliers`: Nhà cung cấp
- `purchase_orders`: Đơn đặt hàng mua vào
- `purchase_order_items`: Chi tiết đơn hàng
- `stock_ins`: Phiếu nhập kho
- `stock_in_items`: Chi tiết nhập kho

**4. Module Inventory (Tồn kho):**
- `inventory`: Tồn kho hiện tại theo variant
- `stock_movements`: Lịch sử xuất nhập tồn

**5. Module Customers (Khách hàng):**
- `customers`: Thông tin khách hàng

**6. Module Sales (Bán hàng):**
- `orders`: Đơn hàng
- `order_items`: Chi tiết đơn hàng
- `payments`: Thanh toán
- `stock_outs`: Phiếu xuất kho
- `stock_out_items`: Chi tiết xuất kho

**Mối quan hệ giữa các bảng:**
- Quan hệ 1-nhiều (One-to-Many): Brand → Products, Product → Variants
- Quan hệ nhiều-nhiều (Many-to-Many): Orders ↔ Products (thông qua OrderItems)
- Quan hệ 1-1 (One-to-One): Order → StockOut

#### 1.2.3. Quy trình nghiệp vụ chính

**1. Quy trình Thu mua:**
```
[Tạo Đơn đặt hàng] → [Quản lý duyệt] → [Nhà cung cấp giao hàng]
                                              ↓
                                     [Nhập kho + IMEI]
                                              ↓
                                    [Tồn kho tự động tăng]
```

**2. Quy trình Bán hàng:**
```
[Khách hàng đặt hàng] → [Tạo Order] → [Chọn phương thức thanh toán]
                                              ↓
                        ┌─────────────────────┴─────────────────────┐
                        ▼                                            ▼
                [Tiền mặt/Chuyển khoản]                      [VNPay Gateway]
                        │                                            │
                        └─────────────────────┬─────────────────────┘
                                              ▼
                                  [Thanh toán thành công]
                                              ↓
                                    [Tạo phiếu xuất kho]
                                              ↓
                                    [Tồn kho tự động giảm]
                                              ↓
                                        [In hóa đơn]
```

**3. Quy trình Quản lý tồn kho:**
- Mỗi lần nhập/xuất kho đều tạo Stock Movement record
- Inventory table luôn phản ánh tồn kho hiện tại
- Hệ thống cảnh báo khi tồn kho dưới ngưỡng minimum

#### 1.2.4. Các tính năng nổi bật

**1. Quản lý IMEI:**
- Mỗi máy điện thoại có IMEI riêng
- Theo dõi được IMEI nào đã bán, nào còn trong kho
- Chống hàng giả, hàng nhái

**2. Tích hợp thanh toán VNPay:**
- Khách hàng có thể thanh toán online
- Tự động xác nhận thanh toán qua callback
- An toàn, bảo mật theo chuẩn quốc tế

**3. Dashboard & Reports:**
- Dashboard realtime hiển thị các chỉ số KPI
- Báo cáo doanh thu theo ngày/tháng/năm
- Báo cáo tồn kho
- Báo cáo sản phẩm bán chạy
- Biểu đồ trực quan dễ hiểu

**4. Phân quyền chi tiết:**
- Admin: Toàn quyền
- Staff: Quyền giới hạn theo chức năng
- Mỗi API endpoint đều có kiểm tra quyền

**5. Responsive Design:**
- Giao diện tự động điều chỉnh theo màn hình
- Sử dụng được trên desktop, tablet, mobile

---

## KẾT LUẬN CHƯƠNG 1

Chương 1 đã trình bày tổng quan về dự án "Hệ thống Quản lý Cửa hàng Điện thoại", bao gồm bối cảnh ra đời, mục tiêu, phạm vi, công nghệ sử dụng và các đối tượng hữu ích từ hệ thống. Qua đó, ta có thể thấy rằng việc xây dựng một hệ thống quản lý toàn diện cho cửa hàng điện thoại không chỉ là một nhu cầu thực tế mà còn là một bài toán kỹ thuật thú vị, đòi hỏi sự kết hợp giữa kiến thức nghiệp vụ và kỹ năng lập trình.

Dự án được triển khai với kiến trúc hiện đại, sử dụng các công nghệ tiên tiến như Django REST Framework cho backend và React cho frontend, đảm bảo tính ổn định, bảo mật và khả năng mở rộng trong tương lai. Hệ thống không chỉ giúp tự động hóa các quy trình nghiệp vụ, giảm thiểu sai sót mà còn cung cấp các công cụ phân tích và báo cáo hỗ trợ ra quyết định kinh doanh hiệu quả.

Trong các chương tiếp theo, chúng ta sẽ đi sâu vào phân tích yêu cầu chi tiết, thiết kế hệ thống, triển khai các chức năng cụ thể và đánh giá kết quả đạt được của dự án.

---

*Tài liệu này là phần giới thiệu của hệ thống. Để biết thêm chi tiết về cài đặt, sử dụng và phát triển, vui lòng tham khảo file [README.md](./README.md) chính.*

