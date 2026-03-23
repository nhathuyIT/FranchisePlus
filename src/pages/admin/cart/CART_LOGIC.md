# Admin Cart Logic

## Mục tiêu của màn `admin/cart`

Màn `src/pages/admin/cart` hiện tại có 3 nhiệm vụ chính:

1. Tìm một customer đang active.
2. Load danh sách cart của customer đó theo status.
3. Cho staff/admin tạo thêm cart mới cho customer và xem chi tiết từng cart.

Điểm quan trọng: màn này hiện thiên về `lookup + inspect + create`.
Nó chưa có UI để sửa cart, xóa item, cancel cart, checkout cart, cập nhật voucher... dù các API/hook đó đã tồn tại ở layer cart.

---

## Phạm vi file cần hiểu

### File trong folder `src/pages/admin/cart`

| File | Vai trò |
| --- | --- |
| `index.tsx` | Container chính của page. Quản lý permission, state, search customer, fetch carts, chọn cart, mở dialog tạo cart. |
| `add-cart-form.config.tsx` | Khai báo schema Zod và cấu hình field cho form tạo cart. |
| `types.ts` | Kiểu dữ liệu nhỏ dùng riêng cho page, chủ yếu là `CartLookupUser` và filter status. |
| `columns/CartColumns.tsx` | Cấu hình cột DataTable của danh sách cart và cột item nếu cần tái sử dụng. |
| `components/AddCartDialog.tsx` | Dialog tạo cart, nối form với mutation thêm cart. |
| `components/CartLookupToolbar.tsx` | Toolbar chọn customer, chọn status, clear filter. |
| `components/CartSelectedUserSummary.tsx` | Block tóm tắt user đã chọn. |
| `components/SelectedCartPanel.tsx` | Panel chi tiết cart đang được chọn. |
| `components/CartItemCard.tsx` | Card hiển thị từng item trong cart. |
| `components/CartOptionRow.tsx` | Dòng hiển thị từng option của item. |
| `components/CartOptionArrayField.tsx` | Custom field cho form tạo cart để thêm option products. |
| `components/CartDetailField.tsx` | Ô thông tin đơn giản dùng lặp lại nhiều nơi. |
| `components/CartProductImage.tsx` | Hiển thị ảnh sản phẩm, có fallback nếu ảnh lỗi hoặc rỗng. |
| `utils/cartDisplay.ts` | Hàm format tiền, ngày giờ, hint text, class status, no-cart error detection. |

### File ngoài folder nhưng là nguồn logic thật sự

| File | Vai trò |
| --- | --- |
| `src/types/cart.ts` | Contract chính của cart request/response. |
| `src/api/cart/cart.api.ts` | Gọi API cart và normalize response backend -> shape UI dùng. |
| `src/hooks/cart/useCart.hook.ts` | React Query hooks, cache key, invalidate logic, mutation success/error toast. |
| `src/hooks/customer/useCustomerAdmin.hooks.ts` | Hook search customer cho dropdown lookup. |
| `src/api/customer/customer-admin.api.ts` | API search customer. |
| `src/hooks/franchise/useFranchise.hooks.ts` | Hook lấy danh sách franchise cho form tạo cart. |
| `src/api/franchise/franchise.api.ts` | API lấy franchise select options. |
| `src/api/product-franchise/product-franchise.api.ts` | API search product-franchise cho main product và option products. |
| `src/hooks/common/useDebounce.ts` | Debounce cho input search. |

---

## Bức tranh tổng quát của màn hình

Luồng chính:

1. User vào trang `Cart Management`.
2. Page kiểm tra permission:
   - `VIEW_CART` để được tìm và xem cart.
   - `MANAGE_CART` để được bấm `Add Cart`.
3. User mở search customer.
4. Search dropdown gọi API customer search với debounce 300ms.
5. Khi chọn một customer:
   - Page lưu `selectedUser`.
   - Reset cart đang chọn.
   - Gọi query lấy carts của customer theo status đang chọn.
6. DataTable hiển thị danh sách cart.
7. Row nào được click thì `selectedCartId` đổi theo row đó.
8. Panel bên dưới hiển thị chi tiết `selectedCart`.
9. Nếu bấm `Add Cart`:
   - Mở dialog.
   - Chọn franchise.
   - Chọn main product thuộc franchise đó.
   - Nhập quantity, phone, address, note, message.
   - Có thể thêm option products.
   - Submit sẽ gọi API staff add-to-cart.
10. Sau khi tạo thành công:
   - Page ép filter status về `ACTIVE`.
   - Lưu `selectedCartId` bằng id cart mới trả về.
   - Trigger refetch để cart mới xuất hiện trong list và được chọn.

---

## Layer dữ liệu cart

### Kiểu dữ liệu quan trọng trong `src/types/cart.ts`

#### Status

```ts
type CartStatus = "ACTIVE" | "CHECKED_OUT" | "CANCELED";
```

#### Request tạo cart cho staff/admin

```ts
interface AddProductToCartByStaffRequest {
  customerId: string;
  franchiseId: string;
  productFranchiseId: string;
  quantity: number;
  address: string;
  phone: string;
  note?: string;
  message?: string;
  options?: CartItemOptionRequest[];
}
```

#### Shape của cart sau khi UI dùng

```ts
interface CartResponse {
  id: string;
  customerId: string;
  franchiseId: string;
  staffId: string;
  status: CartStatus;
  address: string;
  phone: string;
  note?: string;
  message: string;
  promotionDiscount: number;
  promotionType: string;
  promotionValue: number;
  voucherDiscount: number;
  loyaltyPointsUsed: number;
  loyaltyDiscount: number;
  subtotalAmount: number;
  finalAmount: number;
  promotionId: string;
  voucherId?: string;
  franchiseName: string;
  customerName: string;
  staffName: string;
  staffEmail: string;
  cartItems: CartItemResponse[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isActive: boolean;
}
```

#### Item và option

- `CartItemResponse` là dòng sản phẩm chính trong cart.
- `CartOptionResponse` là topping/extras đi kèm item chính.
- UI admin/cart đọc thẳng `productName`, `productImageUrl`, `quantity`, `discountAmount`, `finalLineTotal`, `options`.

---

## API cart và normalization

File: `src/api/cart/cart.api.ts`

### API đang được màn admin/cart dùng trực tiếp

| API | Hàm | Dùng để làm gì |
| --- | --- | --- |
| `GET /api/carts/customer/:customerId` | `getCartsByCustomerId` | Load danh sách cart theo customer và status. |
| `POST /api/carts/items/staff` | `addProductToCartByStaff` | Tạo cart mới hoặc thêm item vào cart cho customer từ flow staff/admin. |
| `POST /api/product-franchises/search` | `searchProductFranchises` | Search main product và option products theo franchise. |
| `POST /api/customers/search` | `search` trong customer admin API | Search customer trong toolbar. |
| `GET /api/franchises/select` | `getSelect` | Lấy dropdown franchise cho dialog tạo cart. |

### Normalize response là điểm rất quan trọng

Backend cart không phải lúc nào cũng trả field product giống nhau, nên file API normalize lại trước khi UI dùng:

- `normalizeCartProduct(...)`
  - Ưu tiên `product.name` hoặc `product.productName`.
  - Fallback sang `productName` nằm trực tiếp trên object.
  - Nếu vẫn thiếu thì dùng `"Unnamed product"`.
- `normalizeCartOption(...)`
  - Bơm default number = `0`, string = `""`.
  - Normalize cả product name/image cho option.
- `normalizeCartItem(...)`
  - Normalize item chính.
  - Map `options` qua `normalizeCartOption`.
- `normalizeCart(...)`
  - Đảm bảo cart luôn có đủ field UI cần, kể cả khi backend trả thiếu.

Ý nghĩa thực tế:

- UI ở `admin/cart` gần như tin tưởng hoàn toàn vào shape sau normalize.
- Nếu backend đổi field name hoặc join product không ổn định, điểm sửa đầu tiên nên là `src/api/cart/cart.api.ts`, không nên vá rải rác ở component.

---

## React Query layer

File: `src/hooks/cart/useCart.hook.ts`

### Query keys

Các cache key chính:

- `CART_KEYS.byCustomer({ customerId, status })`
- `CART_KEYS.detail(cartId)`
- `CART_KEYS.countByCustomer(...)`
- `CART_KEYS.countItemsByCart(cartId)`

### Hook mà admin/cart đang dùng

#### `useCartsByCustomerQuery(params, enabled)`

- Gọi `cartApi.getCartsByCustomerId(params)`.
- Chỉ chạy khi có `customerId` và `enabled = true`.
- Trên page, `enabled` thực tế là:

```ts
canViewCart && !!selectedUser?.id
```

#### `useAddProductToCartByStaffMutation()`

- Gọi `cartApi.addProductToCartByStaff(data)`.
- `onSuccess`:
  - invalidate toàn bộ cart queries.
  - invalidate thêm list/count theo `customerId` với status `ACTIVE`.
  - show toast success.
- `onError`:
  - show toast fail.

### Lưu ý quan trọng về refresh sau create

Sau khi tạo cart xong đang có `2 lớp refresh`:

1. Mutation `useAddProductToCartByStaffMutation` đã invalidate cache.
2. `src/pages/admin/cart/index.tsx` còn chủ động set `shouldRefetchAfterCreate = true` rồi gọi `customerLookupQuery.refetch()` trong `useEffect`.

Nghĩa là sau create, list sẽ được refresh khá chắc chắn, nhưng cũng có chút dư thừa.
Nếu sau này muốn tối giản refresh logic, đây là một vùng có thể gom lại.

---

## Logic chi tiết của `src/pages/admin/cart/index.tsx`

Đây là file quan trọng nhất.

### 1. Permission gate

```ts
const canViewCart = userPermissions.includes(Permission.VIEW_CART);
const canManageCart = userPermissions.includes(Permission.MANAGE_CART);
```

Tác động:

- Không có `VIEW_CART`:
  - Không fetch carts.
  - Không fetch customer search khi mở dropdown.
  - Table hiện empty message dạng không có quyền.
- Không có `MANAGE_CART`:
  - Nút `Add Cart` biến mất.

### 2. Local state chính

| State | Ý nghĩa |
| --- | --- |
| `userSearchOpen` | Dropdown customer search có đang mở không. |
| `userSearchValue` | Từ khóa search customer hiện tại. |
| `selectedUser` | Customer đang được inspect cart. |
| `customerStatus` | Filter trạng thái cart, mặc định `ACTIVE`. |
| `selectedCartId` | Cart đang được chọn trong table. |
| `shouldRefetchAfterCreate` | Cờ yêu cầu refetch sau khi vừa tạo cart. |
| `isRefreshingAfterCreate` | Dùng để show loading trong lúc refetch sau create. |

### 3. Search customer

Flow:

1. `userSearchValue` được debounce 300ms qua `useDebounce`.
2. `useCustomerSearch(...)` gọi search customer với điều kiện:
   - `keyword: debouncedUserSearch || undefined`
   - `isActive: true`
   - `isDeleted: false`
   - `pageNum: 1`
   - `pageSize: 20`
3. Query chỉ chạy khi:
   - có quyền view cart
   - dropdown search đang mở

Điều này có nghĩa:

- Chưa mở dropdown thì không tốn request customer search.
- Chỉ customer active và chưa bị xóa mới có thể được chọn trong màn này.

### 4. Tạo option hiển thị cho dropdown customer

`userSearchResults` lấy từ `userSearchQuery.data?.pageData ?? []`.

Sau đó map thành `userOptions` để đưa vào `PopoverSearchSelect`:

- `value = user.id`
- `label = JSX hiển thị name + email + phone`
- `searchText = "name email phone"`

Nếu đang có `selectedUser`, page ghép thêm `selectedUserOption` vào đầu danh sách bằng `mergedUserOptions`.

Mục đích:

- Dù user đó không còn nằm trong batch search hiện tại, dropdown vẫn giữ được option đang chọn.

### 5. Khi đổi customer

`handleUserChange(userId)` làm các việc sau:

1. Nếu chọn lại đúng user cũ:
   - chỉ đóng dropdown.
2. Nếu là user mới:
   - tìm user trong `userSearchResults`.
   - set `selectedUser`.
   - reset `selectedCartId`.
   - reset 2 cờ refetch sau create.
   - đóng dropdown.

### 6. Khi clear filter

`handleClearSelection()` reset:

- `selectedUser`
- `selectedCartId`
- `shouldRefetchAfterCreate`
- `isRefreshingAfterCreate`
- `userSearchValue`
- `userSearchOpen`

### 7. Fetch cart list

`customerLookupQuery` dùng:

```ts
useCartsByCustomerQuery(
  {
    customerId: selectedUser?.id ?? "",
    status: customerStatus === "all" ? undefined : customerStatus,
  },
  canViewCart && !!selectedUser?.id,
)
```

Ý nghĩa:

- Nếu filter là `all` thì API không truyền status.
- Nếu chọn status cụ thể thì API chỉ load cart status đó.

### 8. Error handling đặc biệt cho trường hợp "không có cart"

`isNoCartError(error)` trong `cartDisplay.ts` kiểm tra message text.

Nếu message chứa kiểu:

- `"cart"`
- và một trong các cụm `"no "`, `"not found"`, `"doesnt have"`, `"doesn't have"`, `"empty"`

thì page coi đây là no-data chứ không phải error thật.

Kết quả:

- `customerRows = []`
- `error = null`

Lưu ý:

- Cách này phụ thuộc string message của backend, khá mong manh.
- Nếu backend đổi wording, UI có thể lại hiện error thật hoặc nuốt nhầm error.

### 9. Chọn cart đang active trong UI

`selectedCart` được tính như sau:

1. Nếu list rỗng -> `null`
2. Nếu chưa có `selectedCartId` -> lấy cart đầu tiên
3. Nếu có `selectedCartId`:
   - tìm theo id
   - nếu không thấy nữa thì fallback về cart đầu tiên

Hệ quả:

- Khi vừa đổi customer hoặc đổi filter, panel dưới vẫn luôn có cart đầu tiên để xem nếu list còn data.
- Nếu cart cũ biến mất do filter đổi, UI không bị vỡ vì tự fallback.

### 10. Hint text cho vùng lookup

`lookupHint` lấy từ `getCartLookupHint(...)`:

- Chưa gõ gì -> hướng dẫn mở search và nhập tên/email/phone.
- Đang gõ nhưng chưa chọn -> nhắc user chọn một kết quả.
- Đã chọn user -> nhắc đang xem carts của user đó.

### 11. Empty/loading state của table

`customerEmptyMessage`:

- Không có quyền -> `"You do not have permission to view carts."`
- Chưa chọn user -> `"Search and select a user to view carts."`
- Đã chọn user nhưng không có cart -> `"This user doesnt have any cart"`

`isCustomerTableLoading` sẽ bật nếu:

- có `selectedUser`
- và query đang `isLoading` hoặc `isFetching`
- hoặc đang `isRefreshingAfterCreate`

### 12. Sau khi tạo cart thành công

`handleCartCreated(cartId)`:

1. ép `customerStatus = "ACTIVE"`
2. set `selectedCartId = cartId`
3. set `shouldRefetchAfterCreate = true`

Sau đó `useEffect` chạy refetch.

Ý nghĩa của việc ép về `ACTIVE`:

- Nếu trước đó đang lọc `CHECKED_OUT` hoặc `CANCELED`, cart mới tạo sẽ không bị ẩn khỏi list.

### 13. Render tree của page

Thứ tự render:

1. `PageHeader`
2. `CartLookupToolbar`
3. Hint box
4. `CartSelectedUserSummary` nếu đã chọn user
5. `DataTable` danh sách carts
6. `SelectedCartPanel` chi tiết cart
7. `AddCartDialog`

---

## DataTable danh sách cart

File: `src/pages/admin/cart/columns/CartColumns.tsx`

### Cột của cart list

| Cột | Dữ liệu |
| --- | --- |
| `Customer` | `customerName` |
| `Franchise` | `franchiseName` |
| `Status` | `status` với badge màu |
| `Items` | `cartItems.length` |
| `Final Amount` | `finalAmount` format tiền |
| `Updated At` | `updatedAt` format datetime |

### Highlight row đang chọn

Trong `index.tsx`, DataTable dùng:

```ts
getRowClassName={(cart) =>
  cart.id === selectedCart?.id
    ? "bg-[#FFF8F1] hover:bg-[#FFF3E0]"
    : ""
}
```

Tức là row đang được panel dưới hiển thị sẽ được tô nền khác.

### `cartItemColumns`

File này còn export `cartItemColumns`, nhưng màn admin/cart hiện không render DataTable item riêng.
Chi tiết item đang được hiển thị bằng `CartItemCard` trong `SelectedCartPanel`.

---

## Panel chi tiết cart

File: `src/pages/admin/cart/components/SelectedCartPanel.tsx`

### Trách nhiệm

- Hiển thị metadata của cart đang chọn.
- Hiển thị các thông tin tổng tiền/promotion.
- Hiển thị customer, franchise, phone, address.
- Hiển thị note/message ở cấp cart.
- Render từng `CartItemCard`.

### Cách tính promotion value

```ts
const promotionValue =
  selectedCart?.promotionType?.toUpperCase() === "PERCENT"
    ? `${selectedCart.promotionValue}%`
    : selectedCart?.promotionType
      ? formatCartMoney(selectedCart.promotionValue)
      : "N/A";
```

Nghĩa là:

- Promotion phần trăm -> thêm `%`
- Promotion fixed amount -> format tiền
- Không có promotion -> `"N/A"`

### Empty message

- Chưa chọn user -> `"Select a user to inspect cart details."`
- Có user nhưng không có cart -> `"This user doesnt have any cart"`

### Hiển thị item

Mỗi item được render bằng `CartItemCard`:

- ảnh sản phẩm
- tên sản phẩm
- quantity
- unit price
- final total
- discount
- line total
- số lượng options
- note item
- danh sách option nếu có

### Hiển thị option

`CartOptionRow` hiển thị:

- ảnh option
- tên option
- quantity
- price snapshot
- final price

### Ảnh fallback

`CartProductImage`:

- Nếu `src` rỗng hoặc load lỗi -> hiện icon `ImageOff`
- Nếu ảnh hợp lệ -> render `<img />`

Điểm này giúp panel không bị vỡ layout khi product image backend thiếu.

---

## Dialog tạo cart

File: `src/pages/admin/cart/components/AddCartDialog.tsx`

### Dữ liệu đầu vào

Props:

- `open`
- `onOpenChange`
- `selectedUser`
- `onCreated`

### Dữ liệu phụ trợ

- `useFranchiseSelect()` lấy list franchise cho select.
- `useAddProductToCartByStaffMutation()` xử lý submit.

### Default values

```ts
{
  customerId: selectedUser?.id ?? "",
  franchiseId: "",
  productFranchiseId: "",
  quantity: 1,
  address: "",
  phone: selectedUser?.phone ?? "",
  note: "",
  message: "",
  options: [],
}
```

Lưu ý:

- `phone` mặc định lấy từ customer đã chọn nhưng vẫn cho sửa tay.
- `customerId` trong form chỉ là default value; lúc submit component vẫn ép dùng `selectedUser.id`.

### Submit flow

1. Nếu chưa có `selectedUser` -> trả error ngay, không submit.
2. Lọc `data.options` để chỉ giữ option có:
   - `productFranchiseId`
   - `quantity > 0`
3. Gọi mutation:

```ts
addCartMutation.mutateAsync({
  ...data,
  customerId: selectedUser.id,
  options: normalizedOptions.length > 0 ? normalizedOptions : undefined,
})
```

4. Khi API trả cart mới, gọi `onCreated?.(response.id)`.

### Điều đáng chú ý

- Form này không tự dedupe option products.
- Cùng một `productFranchiseId` có thể bị thêm nhiều dòng nếu component form cho phép user làm vậy.
- Nếu cần rule business chặt hơn, vùng sửa nằm ở `CartOptionArrayField` hoặc lúc normalize trước submit.

---

## Cấu hình field của form tạo cart

File: `src/pages/admin/cart/add-cart-form.config.tsx`

### Zod schema

Field bắt buộc:

- `customerId`
- `franchiseId`
- `productFranchiseId`
- `quantity >= 1`
- `address`
- `phone`

Field optional:

- `note`
- `message`
- `options`

### Các field chính

#### 1. Franchise select

- `type: "select"`
- options lấy từ `useFranchiseSelect`

#### 2. Main Product async select

- `type: "async-select"`
- disabled nếu chưa chọn `franchiseId`
- loader gọi `searchProductFranchises(...)`
- chỉ search sản phẩm:
  - thuộc franchise đã chọn
  - `is_active: true`
  - `is_deleted: false`
  - page size 20

Label hiển thị:

```ts
productName + size + priceBase
```

#### 3. Quantity

- number input
- min = 1

#### 4. Phone / Address / Note / Message

- `phone` là text field
- `address` là textarea lớn, bắt buộc
- `note` và `message` là optional

#### 5. Options custom field

- Render qua `CartOptionArrayField`
- Truyền `franchiseId` hiện tại để search option products trong cùng franchise

---

## Logic của `CartOptionArrayField`

File: `src/pages/admin/cart/components/CartOptionArrayField.tsx`

### Mục đích

Cho phép thêm nhiều option products vào item chính khi tạo cart.

### Cấu trúc

- Component cha `CartOptionArrayField`
- Component con `CartOptionEditorRow`

### `CartOptionArrayField`

Trách nhiệm:

- nhận `value`, `onChange`, `franchiseId`, `disabled`
- thêm row mới với shape:

```ts
{
  productFranchiseId: "",
  quantity: 1,
}
```

- update row theo index
- remove row theo index

### Điều kiện cho phép sửa

```ts
const canEdit = !disabled && !!franchiseId;
```

Tức là chưa chọn franchise thì không thể thêm option.

### Empty state

- Chưa có `franchiseId`:
  - hiện message yêu cầu chọn franchise trước
- Có `franchiseId` nhưng chưa có option:
  - hiện message chưa có option nào

### `CartOptionEditorRow`

Mỗi row có:

- 1 `PopoverSearchSelect` cho option product
- 1 input quantity
- 1 nút remove

Search flow của row:

1. User mở popover.
2. `searchValue` được debounce 300ms.
3. `useQuery` gọi `searchProductFranchiseOptions(franchiseId, keyword)`.
4. API chỉ chạy khi có `franchiseId` và popover đang mở.

### `mergedOptions`

Nếu option hiện tại đã được chọn nhưng search result mới không chứa nó, component tự ghép option hiện tại vào đầu list.

Điểm cần hiểu:

- UX sẽ không mất giá trị đã chọn.
- Nhưng label fallback lúc này chỉ là raw `productFranchiseId`, không có tên đẹp nếu API không trả item đó trong result hiện tại.

---

## Toolbar lookup customer

File: `src/pages/admin/cart/components/CartLookupToolbar.tsx`

### Thành phần

1. `PopoverSearchSelect` cho customer
2. `Select` cho status
3. Nút `Clear`

### Status options hiện tại

- `all`
- `ACTIVE`
- `CHECKED_OUT`
- `CANCELED`

### Điểm cần chú ý

`cartDisplay.getCartStatusClassName(...)` xử lý thêm cả các biến thể như:

- `CHECKOUT`
- `COMPLETED`
- `CANCEL`
- `CANCELLED`

Điều này cho thấy code đang phòng trường hợp backend trả status wording hơi lệch.

---

## Các utility hiển thị

File: `src/pages/admin/cart/utils/cartDisplay.ts`

### `formatCartMoney(value)`

- format kiểu `vi-VN`
- thêm hậu tố `VND`

### `formatCartDateTime(value)`

- nếu có value -> `new Date(value).toLocaleString("vi-VN")`
- nếu không -> `"N/A"`

### `getCartLookupHint(searchValue, selectedUserName?)`

- tạo nội dung hướng dẫn ngay dưới toolbar

### `isNoCartError(error)`

- đoán no-data bằng text message
- là điểm khá mong manh nếu backend đổi wording

### `getCartStatusClassName(status)`

- map màu badge theo status

---

## Customer search và franchise select

### Customer search

Files:

- `src/hooks/customer/useCustomerAdmin.hooks.ts`
- `src/api/customer/customer-admin.api.ts`

`useCustomerSearch(...)`:

- dùng React Query
- có `placeholderData: keepPreviousData`
- giúp dropdown ít bị giật khi search keyword mới

API customer search:

- endpoint `POST /api/customers/search`
- payload được gửi thủ công theo snake_case:
  - `is_active`
  - `is_deleted`

### Franchise select

Files:

- `src/hooks/franchise/useFranchise.hooks.ts`
- `src/api/franchise/franchise.api.ts`

`useFranchiseSelect()`:

- gọi `GET /api/franchises/select`
- có `staleTime = 10 phút`

Ý nghĩa:

- mở dialog nhiều lần không phải refetch franchise liên tục.

---

## Những điểm dễ sửa nhầm hoặc cần đặc biệt lưu ý

### 1. Màn admin/cart không phải full cart management

Tên page là `Cart Management`, nhưng thực tế UI hiện tại chưa hỗ trợ:

- update cart
- update cart item
- remove cart item
- update option quantity
- remove option
- apply/remove voucher
- checkout
- cancel

Tất cả chỉ mới có ở API/hook layer.

### 2. Sau create có double-refresh

- invalidate query từ mutation
- cộng thêm refetch thủ công ở page

Nếu sau này thấy request bị dư hoặc loading hơi lặp, kiểm tra đoạn này đầu tiên.

### 3. No-cart detection đang dựa vào text

Nếu backend đổi error message, UI có thể:

- hiện error thay vì empty state
- hoặc nuốt nhầm một error thật

### 4. Chỉ search customer active, not deleted

Không thể inspect cart của customer inactive/deleted từ màn này.
Nếu business muốn xem cả customer inactive, phải sửa search params ở `index.tsx`.

### 5. Product search luôn giới hạn trong franchise đã chọn

Cả main product lẫn option products đều bám theo `franchiseId`.
Nếu muốn cho cross-franchise product selection thì phải đổi cả UI lẫn API params.

### 6. Option products chưa có business rule chống trùng

User có thể thêm nhiều dòng option cùng `productFranchiseId` nếu không bị layer form chặn.

### 7. `selectedCart` luôn fallback về cart đầu tiên

Nếu bạn cần "không tự chọn cart nào cả", phải sửa logic tính `selectedCart` trong `index.tsx`.

---

## Nếu muốn sửa thì nên đụng vào file nào

| Nhu cầu sửa | File nên vào đầu tiên |
| --- | --- |
| Đổi flow chọn customer / clear / auto-select cart | `src/pages/admin/cart/index.tsx` |
| Đổi cột danh sách cart | `src/pages/admin/cart/columns/CartColumns.tsx` |
| Đổi giao diện panel chi tiết cart | `src/pages/admin/cart/components/SelectedCartPanel.tsx` |
| Đổi giao diện từng item / option | `CartItemCard.tsx`, `CartOptionRow.tsx` |
| Đổi field form tạo cart | `src/pages/admin/cart/add-cart-form.config.tsx` |
| Đổi logic add/remove/edit option rows | `src/pages/admin/cart/components/CartOptionArrayField.tsx` |
| Đổi payload create cart | `AddCartDialog.tsx` hoặc `src/types/cart.ts` |
| Đổi endpoint / normalize cart response | `src/api/cart/cart.api.ts` |
| Đổi cache invalidate / query behavior | `src/hooks/cart/useCart.hook.ts` |
| Đổi search customer | `src/hooks/customer/useCustomerAdmin.hooks.ts` và `src/api/customer/customer-admin.api.ts` |
| Đổi load franchise dropdown | `src/hooks/franchise/useFranchise.hooks.ts` |

---

## Tóm tắt ngắn gọn để nhớ nhanh

- `index.tsx` là bộ não của màn hình.
- `add-cart-form.config.tsx` + `AddCartDialog.tsx` là bộ não của flow tạo cart.
- `cart.api.ts` là nơi biến dữ liệu backend thành shape UI tin tưởng dùng.
- `useCart.hook.ts` là nơi quyết định cache/refetch/toast.
- `SelectedCartPanel.tsx` là nơi render chi tiết thật sự của cart.
- `CartOptionArrayField.tsx` là nơi phức tạp nhất trong form vì có search động theo franchise.

Nếu mai sau cần mở rộng màn này thành full CRUD cart cho admin, nhiều khả năng sẽ phải bắt đầu từ:

1. thêm action trong `SelectedCartPanel` hoặc DataTable row
2. nối sang các mutation có sẵn trong `useCart.hook.ts`
3. quyết định lại chiến lược refetch/invalidate cho gọn hơn

