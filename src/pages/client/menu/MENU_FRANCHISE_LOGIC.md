# MENU FRANCHISE LOGIC

## 1) Mục tiêu

- Chuẩn hóa luồng dữ liệu Menu theo API mới.
- Tách rõ `getMenu...` và `getProduct...` theo đúng nghiệp vụ.
- Xử lý đặc biệt `categoryId = Topping`.
- Bỏ `useMemo` cho derived data chính, chuyển sang TanStack Query (`queryKey`, `select`, `enabled`, cache strategy).

## 2) Quy tắc API bắt buộc

- `getMenu...`: lấy dữ liệu theo `franchiseId + categoryId`.
- `getProduct...`: với case `ALL`, gọi API kèm param `categoryId=` (rỗng), vẫn truyền `categoryId` trong query string.
- `categoryId = Topping`: lấy từ response `getProduct(..., categoryId="")` bằng cách filter `categoryName="Topping"`, sau đó gọi lại `getProduct(..., categoryId=toppingId)`.

## 3) Phase triển khai

### Phase 1 — Chuẩn hóa contract & hook nền (blocking)

- Hợp nhất hook menu/client để tránh trùng logic, trùng query key.
- Định nghĩa lại query key theo ngữ nghĩa: `menuByFranchiseCategory`, `productsByFranchiseAll`, `menuTabsByFranchise`.
- Chốt source-of-truth cho dữ liệu topping theo 2 bước:
  1. gọi `getProduct(franchiseId, "")` để lấy all products,
  2. filter `categoryName="Topping"` để lấy `categoryId`,
  3. gọi `getProduct(franchiseId, toppingCategoryId)` để lấy danh sách topping.

### Phase 2 — Refactor MenuPage theo TanStack-first (depends on Phase 1)

- Giữ state tối thiểu: `selectedFranchiseId`, `selectedCategoryId`.
- Dùng query/`select` để tính:
  - category tabs + count
  - danh sách hiển thị theo category
  - danh sách hiển thị cho ALL (tách 2 section: `Menu` và `Topping`)
- Với `ALL`, gọi `getProduct...` với `categoryId=` (empty string), không bỏ param `categoryId`.
- `Topping` đi nhánh riêng theo dữ liệu động từ `products all`:
  - lấy `toppingCategoryId` bằng cách filter `categoryName="Topping"` trong response all products,
  - gọi `getProduct(franchiseId, toppingCategoryId)` để lấy topping data.

### Phase 3 — Refactor MenuProductDetailPage (depends on Phase 1, song song cuối Phase 2)

- Đồng bộ dữ liệu detail + sidebar + topping theo cùng query contract.
- Bỏ `useMemo` cho transform chính; chuyển sang `select` hoặc query phụ thuộc.
- Đảm bảo dữ liệu topping/detail không lệch so với MenuPage.
- Với topping, dùng chung source từ `getProduct(franchiseId, toppingCategoryId)`.

### Phase 4 — Điều hướng và reset state (depends on Phase 2,3)

- Đổi franchise: reset category hợp lệ + giữ cache hợp lý.
- Đổi category: chỉ refetch phần cần thiết.
- Quay lại từ detail: giữ/khôi phục context franchise-category ổn định.

### Phase 5 — Verify và ổn định (depends on Phase 4)

- Lint + build + typecheck.
- Smoke test các luồng:
  - ALL
  - category thường
  - category Topping
  - vào detail / quay lại
  - add-to-cart có topping.

## 4) Flow runtime

### MenuPage Flow

- Chọn franchise → load categories + products all (theo franchise).
- Chọn category:
  - Nếu category thường → gọi `getMenu(franchiseId, categoryId)`.
  - Nếu `ALL` → gọi `getProduct(franchiseId, "")` (tương đương `categoryId=`), rồi:
    - product có `categoryName="Topping"` hiển thị dưới section `Topping`,
    - product còn lại hiển thị dưới section `Menu`.
  - Nếu `Topping` → lấy `toppingCategoryId` từ response all products (`categoryName="Topping"`), rồi gọi `getProduct(franchiseId, toppingCategoryId)`.
- Render tab/count dựa trên dữ liệu available đã transform từ TanStack Query.

### MenuProductDetailPage Flow

- Vào detail theo `franchiseId + productFranchiseId`.
- Lấy product detail + products all theo franchise.
- Nếu sản phẩm cho phép topping:
  - lấy `toppingCategoryId` từ products all (`categoryName="Topping"`), rồi gọi `getProduct(franchiseId, toppingCategoryId)` (không lệch với MenuPage).
- Add-to-cart dùng size đang chọn + topping đang chọn.

## 5) Scope

- In scope: logic API/hook/menu/detail liên quan trực tiếp.
- Out of scope: refactor toàn bộ trang products hardcoded (trừ khi ảnh hưởng trực tiếp luồng menu/detail).
