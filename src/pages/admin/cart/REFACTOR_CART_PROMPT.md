# Context

Tôi đang cần refactor lại hoàn toàn luồng "Add Cart" trong màn hình Admin Cart (`src/pages/admin/cart`). Vui lòng đọc kỹ file `CART_LOGIC.md` trong workspace để hiểu luồng hiện tại.
Hiện tại, màn hình đang sử dụng Dropdown để chọn Product. Tôi muốn chuyển sang giao diện giống POS (dạng lưới) với Category Tabs, Product Grid, Size Selection và Topping Selection ngay bên trong `AddCartDialog`.

# 1. Định nghĩa Types & Payload mới

Hãy cập nhật hoặc tạo mới các file Types (ví dụ: `src/types/cart.ts` và `src/types/menu.ts`) dựa trên cấu trúc sau.

[API Request Body (Payload để tạo Cart mới):]
{
"customer_id": "699e5b64558e4453d3fce2e3",
"franchise_id": "698eab0826ca2b18eb35337e",
"items": [
{
"product_franchise_id": "69abb33e54f63d42311eeecd", // ID của món chính (ứng với Size đã chọn)
"quantity": 1,
"note": "không đá, 30% đường",
"options": [
{
"product_franchise_id": "698eab1a26ca2b18eb3534de", // ID của Topping
"quantity": 1
}
]
}
]
}

[Cấu trúc dữ liệu Menu (GET Menu by Franchise):]
API sẽ trả về mảng các Categories. Bên trong mỗi Category có mảng `products`. Bên trong mỗi Product có cờ `is_have_topping` (boolean) và mảng `sizes` (mỗi size chứa `product_franchise_id`, `price`, `size`, `is_available`).

# 2. Yêu cầu tạo mới API Functions & Hooks

Tạo các hàm gọi API và React Query hooks (gợi ý đặt trong `src/hooks/product/useMenu.hook.ts`):

1. useGetMenuByFranchise(franchiseId: string):
   Lấy toàn bộ menu của franchise.
   export const useGetMenuByFranchise = (franchiseId: string) => {
   return useQuery({
   queryKey: ["menu", franchiseId, "all"],
   queryFn: () => productApi.getMenuByFranchise(franchiseId),
   enabled: !!franchiseId,
   });
   };

2. useGetCategoriesByFranchise(franchiseId: string):
   Lấy danh sách các categories để làm thanh menu ngang.

3. useGetProductsByFranchiseAndCategory(franchiseId, categoryId) (hoặc getMenuByFranchiseFilterByCategory):
   Dùng để lấy danh sách Topping khi một product có `is_have_topping: true`.

# 3. Yêu cầu làm mới UI/UX trong AddCartDialog

Sau khi user chọn Customer và Franchise trong form, thay vì hiện Dropdown chọn món, hãy hiển thị khu vực chọn món dạng POS:

A. Thanh Category (Top Bar):

- Hiển thị danh sách các Category lấy từ useGetCategoriesByFranchise.
- Logic quan trọng: Ẩn/Loại bỏ các category có chứa từ "Topping" (VD: "Topping", "Topping12345") ở thanh này để user không chọn trực tiếp topping làm món chính.
- Khi click vào 1 category, filter danh sách product bên dưới.

B. Product Grid (Middle Section):

- Hiển thị danh sách các Products thuộc Category đang chọn.
- Giao diện lưới: 4 cột (grid-cols-4).
- Mỗi Product Card hiển thị: Ảnh (image_url), Tên món, và Tất cả các Size hiện có (S, M, L, XL...) dưới dạng các nút bấm.
- Action: Khi bấm vào 1 Size (VD: Size L), sử dụng `product_franchise_id` của chính Size đó. Sử dụng icon dấu `+` trên nút size để add món.

C. Topping & Note Section (Xử lý tùy chọn):

- Nếu món vừa chọn có `is_have_topping: true`, hiển thị danh sách Topping phía dưới (gọi hook lấy products của category Topping).
- Cho phép user chọn số lượng topping muốn thêm vào món hiện tại.
- Cung cấp một Textarea nhỏ để user nhập note (VD: "không đá, 30% đường").

D. Selected Cart Items List (Bottom hoặc Side Section - Draft Cart):

- Đây là "Giỏ hàng nháp" hiển thị ngay trong dialog trước khi gọi API submit.
- Hiển thị danh sách Item đã add: Tên món + Size, danh sách Topping (Options) đi kèm, Note và Số lượng.
- Có nút Tăng/Giảm số lượng hoặc Xóa item khỏi nháp.

# 4. Nhiệm vụ của bạn (AI)

1. Khai báo các interfaces/types chuẩn xác cho Menu response và Payload gửi đi.
2. Viết các React Query hooks đã nêu ở phần 2.
3. Cập nhật component AddCartDialog.tsx hiện tại. Hãy chia nhỏ ra các components con (ví dụ: PosCategoryTabs, PosProductGrid, PosDraftCart) để code dễ maintain.
4. Quản lý Local State khéo léo cho giỏ hàng nháp (Draft Cart) để handle cấu trúc lồng nhau (Item -> Options/Toppings + Note).
5. Sử dụng TypeScript và Tailwind CSS.

Vui lòng bắt đầu bằng việc liệt kê danh sách các file bạn sẽ tạo hoặc chỉnh sửa, sau đó cung cấp code chi tiết cho file Types và Hooks trước.
