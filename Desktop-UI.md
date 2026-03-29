# Desktop UI Structure - Homepage

## Tổng quan

Trang homepage desktop sử dụng nền tổng thể màu kem nhạt `#FAF8F5`, đi theo phong cách premium coffee với bảng màu nâu đậm, vàng nâu và trắng kem. Cấu trúc trang được xếp theo chiều dọc từ trên xuống dưới gồm 5 section chính:

1. Hero Section
2. Features Section
3. Coffee Showcase
4. CTA Section
5. Footer

Toàn bộ trải nghiệm thị giác tập trung vào cảm giác sang trọng, ấm, thủ công và đậm chất thương hiệu cà phê cao cấp.

## 1. Hero Section

### Bố cục

- Section đầu trang chiếm toàn bộ chiều cao màn hình desktop.
- Nền là carousel toàn màn hình với 3 slide ảnh lớn.
- Nội dung chính được căn giữa cả theo chiều ngang lẫn chiều dọc.
- Hai nút điều hướng trái và phải nổi trên ảnh, đặt ở giữa chiều cao màn hình.
- Pagination nằm ở giữa phía dưới màn hình.
- Góc trái dưới có thêm chỉ báo cuộn dọc "Scroll Down".

### Thành phần chính

- Ảnh nền full-screen đổi theo từng slide.
- Overlay gradient nhiều lớp phủ lên ảnh để giữ độ tương phản cho chữ.
- Dòng accent nhỏ phía trên tiêu đề, đi kèm icon ly cà phê và hai đường line trang trí hai bên.
- Tiêu đề lớn dạng serif, là điểm nhấn chính của section.
- Đoạn mô tả ngắn nằm ngay dưới tiêu đề.
- Hai nút CTA đặt ngang trên desktop:
  - `Explore Our Coffee`
  - `Our Story`
- Nút mũi tên trái/phải để chuyển slide.
- Cụm dot pagination phía dưới, trong đó slide active có thanh tiến trình kéo dài.

### Phong cách hình ảnh

- Tông màu tối, ấm, điện ảnh với lớp phủ đen và nâu.
- Typography tiêu đề lớn, mạnh, tạo cảm giác cao cấp.
- Nút CTA chính dùng màu vàng nâu `#C4A77D`, nút phụ là kính mờ trắng.
- Hero ưu tiên chiều sâu hình ảnh, hiệu ứng carousel mượt và cảm giác sang trọng ngay từ lần nhìn đầu tiên.

## 2. Features Section

### Bố cục

- Section nền tối `#1A1612`, mở đầu bằng phần heading căn giữa.
- Sau phần heading là 4 block nội dung lớn hiển thị nối tiếp theo chiều dọc.
- Mỗi block có bố cục split-screen desktop:
  - Ảnh chiếm khoảng 3/5 chiều rộng và nằm xen kẽ trái/phải theo từng block.
  - Nội dung text nằm ở nửa còn lại và đổi bên tương ứng với ảnh.
- Ở cạnh phải màn hình desktop lớn có cụm dot dọc đóng vai trò section indicator.
- Cuối section có một dải icon tóm tắt lại 4 giá trị nổi bật.

### Thành phần chính

- Heading section gồm:
  - Nhãn nhỏ `Why Choose Us`
  - Tiêu đề lớn `The Art of Exceptional Coffee`
  - Dòng chữ nhấn màu vàng nâu ở dòng thứ hai
  - Một divider mảnh ở giữa
- Mỗi feature block gồm:
  - Ảnh nền lớn toàn chiều cao block
  - Icon tròn ở đầu nội dung
  - Subtitle dạng uppercase
  - Tiêu đề lớn
  - Đoạn mô tả dài
  - Một stats card hiển thị số liệu nổi bật
  - Một cụm rating dots và nhãn `Excellence Rating`
  - Một đường line trang trí ở cuối nội dung
- Dải cuối section gồm 4 icon đại diện cho 4 feature, đặt theo hàng ngang và canh giữa.

### Phong cách hình ảnh

- Phần này mang cảm giác editorial, cinematic và sang trọng.
- Ảnh lớn đi kèm overlay gradient để nội dung text nổi bật hơn.
- Màu chủ đạo là nâu đen, trắng và vàng nâu `#C4A77D`.
- Layout xen kẽ trái/phải giúp section có nhịp điệu thị giác mạnh, tránh đơn điệu.
- Các chi tiết như border mờ, blur nhẹ, line mảnh và icon tròn tạo cảm giác tinh tế và cao cấp.

## 3. Coffee Showcase

### Bố cục

- Section nền sáng `#F8F5F0`, có khoảng trắng lớn và được bọc bởi các chi tiết trang trí ở bốn góc.
- Phần đầu section là block heading căn giữa.
- Nội dung chính của desktop là lưới 3 cột, hiển thị tối đa 6 card sản phẩm cà phê.
- Bên dưới lưới card là một CTA phụ dẫn tới bộ sưu tập đầy đủ.

### Thành phần chính

- Heading section gồm:
  - Cụm 3 ngôi sao và line trang trí hai bên
  - Nhãn nhỏ `Artisan Collection`
  - Tiêu đề lớn `Our Signature Blends`
  - Đoạn mô tả ngắn ở dưới
  - Divider trang trí ở cuối heading
- Mỗi product card gồm:
  - Ảnh sản phẩm lớn ở đầu card
  - Nút thêm vào giỏ hàng hình tròn ở góc trên trái
  - Badge tròn `Est. 1892` ở góc trên phải
  - Số thứ tự lớn mờ ở góc dưới trái của ảnh
  - Nhãn category nhỏ phía trên tiêu đề
  - Tên sản phẩm
  - Mô tả ngắn
  - Khối hiển thị giá hoặc khoảng giá
  - Cụm chỉ số flavor profile gồm `Body`, `Acidity`, `Aroma`
  - Dòng `100% Arabica`
  - Nút `Discover`
- CTA cuối section gồm:
  - Câu quote ngắn
  - Nút `View Full Collection`
  - Dòng trang trí `Since 1892`

### Phong cách hình ảnh

- Section này theo phong cách vintage boutique, sáng hơn phần trước nhưng vẫn giữ hệ màu nâu cà phê.
- Card sản phẩm dùng nền trắng, border mảnh, shadow đậm và nhiều chi tiết góc trang trí kiểu cổ điển.
- Màu vàng nâu được dùng để nhấn giá, badge, line, icon và các trạng thái quan trọng.
- Lưới 3 cột trên desktop giúp sản phẩm được trình bày rõ ràng, đều và có cảm giác catalogue cao cấp.

## 4. CTA Section

### Bố cục

- Đây là một dải CTA toàn chiều ngang nằm sau phần showcase.
- Nội dung được căn giữa trong container.
- Trên desktop, hai nút hành động đặt ngang hàng ở giữa section.

### Thành phần chính

- Tiêu đề lớn: `Start Your Coffee Journey Today`
- Đoạn mô tả ngắn bên dưới tiêu đề
- Hai nút CTA:
  - `Order Now`
  - `View Locations`

### Phong cách hình ảnh

- Nền dùng gradient nâu từ `#6D4C41` sang `#5D4037`.
- Chữ trắng nổi bật trên nền tối.
- Nút màu trắng bo tròn, tạo tương phản mạnh và giữ cảm giác thân thiện, dễ bấm.
- Đây là section chuyển nhịp rõ ràng từ nội dung trưng bày sang hành động.

## 5. Footer

### Bố cục

- Footer dùng nền nâu đậm `#3E2723`.
- Desktop hiển thị dạng grid 4 cột.
- Toàn bộ nội dung chính nằm phía trên, dưới cùng là một dòng copyright có border-top.

### Thành phần chính

- Cột 1:
  - Logo tròn và tên thương hiệu `GOAT Coffee`
  - Đoạn mô tả thương hiệu
  - Hàng icon social
- Cột 2:
  - Tiêu đề `Explore`
  - Danh sách link điều hướng
- Cột 3:
  - Tiêu đề `Contact Us`
  - Địa chỉ
  - Số điện thoại
  - Email
- Cột 4:
  - Tiêu đề `Opening Hours`
  - Lịch mở cửa theo ngày thường, cuối tuần và ngày lễ
- Dòng cuối footer:
  - Copyright của thương hiệu

### Phong cách hình ảnh

- Footer giữ tông nâu đậm và chữ trắng kem để đồng bộ với toàn trang.
- Bố cục 4 cột giúp nội dung thông tin rõ ràng, quen thuộc và dễ quét trên desktop.
- Màu `#BCAAA4` được dùng làm màu phụ cho icon, meta text và trạng thái hover, tạo độ mềm cho phần chân trang.

## Tóm tắt cấu trúc desktop

- `Hero`: full-screen carousel, nội dung căn giữa, có điều hướng nổi trên ảnh.
- `Features`: section nền tối, 4 block split-screen xen kẽ trái/phải, có dải icon tổng kết.
- `Coffee Showcase`: heading căn giữa, lưới sản phẩm 3 cột, tối đa 6 card.
- `CTA`: banner kêu gọi hành động trung tâm với 2 nút ngang.
- `Footer`: chân trang 4 cột thông tin, kết thúc bằng copyright.
