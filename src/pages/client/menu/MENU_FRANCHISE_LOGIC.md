# Client Menu Franchise Logic

## Muc tieu cua tai lieu

Tai lieu nay giai thich logic cua folder `src/pages/client/menu`, tap trung vao cau hoi:

1. Product menu duoc lay theo franchise nhu the nao.
2. Topping duoc lay theo franchise nhu the nao.
3. Du lieu do di qua hook/API/state/UI ra sao.
4. Khi them vao cart, id nao moi la id duoc gui len backend.

Tai lieu nay tap trung vao logic du lieu. Cac component chi hien thi thuan se chi duoc nhac ngan gon.

---

## Pham vi file lien quan

### File trong `src/pages/client/menu`

| File | Vai tro |
| --- | --- |
| `MenuPage.tsx` | Trang list menu theo franchise va category. |
| `MenuProductDetailPage.tsx` | Trang chi tiet 1 product, chon size, chon topping, them vao cart. |
| `components/MenuProductCard.tsx` | Card hien thi menu product. |
| `components/ToppingCard..tsx` | Card hien thi topping trong trang menu list. |
| `components/SectionDivider.tsx` | Divider UI cho section Menu/Topping. |
| `components/EmptyState.tsx` | Empty state UI. |
| `lib/helpers.tsx` | Helper format gia, label size, min price. |
| `index.ts` | Re-export page. |

### File ngoai folder nhung la nguon logic that su

| File | Vai tro |
| --- | --- |
| `src/hooks/client/useProduct.hook.ts` | React Query hooks cho franchise, categories, menu, toppings, product detail. |
| `src/api/client/product.api.ts` | Cac API client de lay du lieu menu/topping theo franchise. |
| `src/types/menu.type.ts` | Kieu du lieu cua menu grouped by category. |
| `src/types/product.type.ts` | Kieu du lieu cua topping list va product detail. |
| `src/pages/client/cart/useCart.ts` | Noi nhan `productFranchiseId` va `options` de gui vao cart API. |
| `src/router/route.const.ts` | Dinh nghia route menu detail. |

---

## API source of truth

Folder `client/menu` dang dung 5 nhom API chinh:

| Muc dich | Endpoint | Ham API | Hook |
| --- | --- | --- | --- |
| Lay danh sach franchise | `GET /api/clients/franchises` | `getAllFranchise` | `useGetAllFranchise` |
| Lay category theo franchise | `GET /api/clients/franchises/:franchiseId/categories` | `getAllCategoriesByFranchise` | `useGetCategoriesByFranchise` |
| Lay menu product theo franchise | `GET /api/clients/menu?franchiseId=:id` | `getMenuByFranchise` | `useGetMenuByFranchise` |
| Lay menu product theo franchise + category | `GET /api/clients/menu?franchiseId=:id&categoryId=:id` | `getMenuByFranchiseFilterByCategory` | `useGetMenuByFranchiseAndCategory` |
| Lay topping theo franchise | `GET /api/clients/products?franchiseId=:id` | `getProductByFranchise` | `useGetProductsByFranchise` |
| Lay topping theo franchise + category | `GET /api/clients/products?franchiseId=:id&categoryId=:id` | `getProductByFranchiseFilterByCategory` | `useGetProductsByFranchiseAndCategory` |
| Lay product detail trong 1 franchise | `GET /api/clients/franchises/:franchiseId/products/:productIdOrProductFranchiseId` | `getProductDetail` | `useGetProductDetail` |
| Lay franchise detail | `GET /api/clients/franchises/:franchiseId` | `getFranchiseDetail` | `useGetFranchiseDetail` |

### Ket luan nhanh

- Product menu va topping duoc lay tu 2 endpoint khac nhau.
- Ca 2 deu bi scope boi `franchiseId`.
- Category cung bi scope boi `franchiseId`.
- Product detail cung bi scope boi `franchiseId`.

Nghia la:

- Franchise la context lon nhat.
- Category chi la lop loc them.
- Cart cuoi cung se gui `productFranchiseId`, khong gui `productId`.

---

## Shape du lieu hien tai

### Menu product: `MenuCategory[]`

`/api/clients/menu` tra ve du lieu theo nhom category:

```ts
type MenuCategory = {
  categoryId: ID;
  categoryName: string;
  categoryDisplayOrder: number;
  products: MenuProduct[];
}
```

```ts
type MenuProduct = {
  productId: ID;
  name: string;
  description: string;
  imageUrl: string;
  isHaveTopping: boolean | null;
  sizes: ProductSize[];
}
```

Moi product co nhieu `sizes`, va moi size chua:

- `productFranchiseId`
- `size`
- `price`
- `isAvailable`

### Topping: `ProductListItem[]`

`/api/clients/products` tra ve flat list:

```ts
type ProductListItem = {
  productId: ID;
  categoryId: ID;
  categoryName: string;
  categoryDisplayOrder: number;
  productDisplayOrder: number;
  sku: string;
  name: string;
  description: string;
  imageUrl: string;
  isHaveTopping: boolean | null;
  sizes: ProductSizeInfo[];
}
```

Khac biet quan trong:

- `menu` endpoint tra ve grouped by category.
- `products` endpoint tra ve flat list.
- Ca hai deu co `sizes[]` va moi size deu co `productFranchiseId`.

### Product detail: `ProductDetailItem`

Trang detail dung shape rieng:

```ts
type ProductDetailItem = {
  productId: ID;
  categoryId: ID;
  categoryName: string;
  sku: string;
  name: string;
  description: string;
  content: string;
  imageUrl: string;
  imagesUrl: string[];
  isHaveTopping: boolean | null;
  sizes: ProductDetailSizeInfo[];
}
```

---

## Logic tong quan theo franchise

Luong chinh cua `client/menu` hien tai:

1. Lay tat ca franchise.
2. Chon `activeFranchiseId`.
3. Dung `activeFranchiseId` de load:
   - categories
   - menu all categories
4. Tu menu all categories, tinh category tab va item count.
5. Khi user chon category:
   - load menu theo franchise + category
   - load topping theo franchise + category
6. Khi user vao detail:
   - load product detail theo franchise
   - load topping all theo franchise
   - load categories theo franchise
   - load menu all theo franchise de ve sidebar
7. Khi them vao cart:
   - product chinh gui `selectedSize.productFranchiseId`
   - topping gui `option.productFranchiseId`
   - kem theo `franchiseId`

---

## Logic chi tiet cua `MenuPage.tsx`

File day la trang menu list theo branch.

### 1. Chon franchise

State:

- `selectedFranchiseId`
- `selectedCategoryId`

`activeFranchiseId` duoc tinh nhu sau:

1. Neu user da chon franchise -> dung `selectedFranchiseId`
2. Neu chua chon va API co franchise -> dung franchise dau tien
3. Neu khong co gi -> `""`

Nghia la:

- Vua vao trang, client tu dong dung branch dau tien tra ve tu API.
- User doi branch thi `selectedCategoryId` bi reset ve `null`.

### 2. Lay category theo franchise

Hook:

```ts
useGetCategoriesByFranchise(activeFranchiseId)
```

Chi chay khi `activeFranchiseId` co gia tri.

### 3. Lay menu all theo franchise

Hook:

```ts
useGetMenuByFranchise(activeFranchiseId)
```

Day la query rat quan trong, vi no duoc dung cho 3 viec:

1. Lay tat ca menu product cua branch.
2. Tinh category tabs.
3. Tinh count moi category.

Client flatten du lieu:

```ts
allMenuProducts = menuDataAll.flatMap((mc) => mc.products)
```

Sau do loc tiep:

```ts
allMenuProductsVisible = allMenuProducts.filter((product) =>
  product.sizes.some((s) => s.isAvailable)
)
```

Nghia la:

- Product nao khong co size available thi bi an ngay tu list page.

### 4. Category tabs hien tai duoc xay tu MENU, khong phai tu TOPPING

Client tinh `categoryMenuCounts` tu `menuDataAll`.

Sau do `categoriesVisible` chi giu category nao co `count > 0`.

He qua quan trong:

- Tab category hien tai chi phu thuoc vao menu product.
- Topping khong tham gia vao viec quyet dinh category co hien hay khong.
- Neu mot category chi co topping ma khong co menu product, category do se khong xuat hien trong tabs.

Day la logic hien tai, can biet de tranh nham la "category hien vi co topping".

### 5. Chon category active

`activeCategoryId` duoc tinh theo thu tu uu tien:

1. Neu user da chon `"ALL"` -> dung `"ALL"`
2. Neu user da chon 1 category hop le -> dung category do
3. Neu branch co it nhat 1 menu product visible -> mac dinh `"ALL"`
4. Neu khong co menu product nhung co category visible -> chon category dau tien
5. Neu khong co gi -> `""`

Ket qua:

- Phan lon truong hop, trang menu mac dinh vao tab `"ALL"`.

### 6. Khi category la `"ALL"`

Client dat:

```ts
categoryIdForQuery = ""
```

Va sau do:

- `useGetMenuByFranchiseAndCategory(activeFranchiseId, "")` bi disable vi hook yeu cau `!!categoryId`
- `useGetProductsByFranchiseAndCategory(activeFranchiseId, "")` cung bi disable

Luc nay:

- Menu section dung `menuDataAll`
- Topping section bi dat thanh mang rong

Code hien tai:

```ts
const toppings = activeCategoryId === "ALL" ? [] : toppingDataByCategory ?? []
```

Nghia la:

- Tab `"ALL"` se khong fetch topping.
- Tab `"ALL"` luon khong hien topping list.
- Neu user muon xem topping, bat buoc phai chon 1 category cu the.

Day la mot diem rat quan trong cua logic hien tai.

### 7. Khi category la category cu the

Client goi dong thoi 2 query:

```ts
useGetMenuByFranchiseAndCategory(activeFranchiseId, categoryIdForQuery)
useGetProductsByFranchiseAndCategory(activeFranchiseId, categoryIdForQuery)
```

Luc nay:

- Menu section hien `menuDataByCategory`
- Topping section hien `toppingDataByCategory`

Nghia la:

- Product menu va topping cung bi loc theo cung 1 `franchiseId` + `categoryId`.
- Client khong join 2 nguon du lieu lai.
- No chi render 2 section song song: `Menu` va `Topping`.

### 8. Loc visible item

Ca product menu va topping deu bi loc tiep theo `size.isAvailable`.

Menu:

```ts
menuProductsVisible = menuProducts.filter((product) =>
  product.sizes.some((s) => s.isAvailable)
)
```

Topping:

```ts
toppingsVisible = toppings.filter((product) =>
  product.sizes.some((s) => s.isAvailable)
)
```

Nghia la:

- Co du lieu API nhung khong con size available thi van khong hien tren UI.

### 9. Card click va route detail

`MenuProductCard` va `ToppingCard` deu co API component theo kieu:

- click theo tung size co the truyen `productFranchiseId`

Nhung `MenuPage.tsx` hien tai lai truyen callback nhu sau:

```ts
onViewDetail={() =>
  handleViewDetail(activeFranchiseId, String(product.productId))
}
```

Tuc la:

- Parent dang bo qua `productFranchiseId` ma component con co the truyen.
- Parent chi navigate bang `productId`.

He qua:

- Click vao size khac nhau tren list page van di cung 1 route cua `productId`.
- Detail page khong biet user vua click size nao.
- Trang detail se tu fallback ve size available dau tien neu route param khong match size id.

Day la 1 diem can ghi nho neu sau nay muon "click size nao vao detail thi preselect size do".

---

## Logic chi tiet cua `MenuProductDetailPage.tsx`

Trang nay la noi product va topping gap nhau ro nhat.

### 1. Route params

Page lay:

```ts
const { franchiseId = "", productFranchiseId = "" } = useParams()
```

Route duoc khai bao la:

```ts
menu/product/:franchiseId/:productFranchiseId
```

Nhung can luu y:

- Ten param la `productFranchiseId`
- Nhung `MenuPage` va sidebar trong detail page thuong navigate bang `productId`

Nghia la:

- Ten bien route hien tai khong chac da phan anh dung gia tri that dang duoc truyen.
- Backend co the dang chap nhan `productId`, hoac route/client dat ten chua chinh xac.

### 2. Query chinh cua detail page

Page goi 5 query:

1. `useGetProductDetail(franchiseId, productFranchiseId)`
2. `useGetProductsByFranchise(franchiseId)`
3. `useGetFranchiseDetail(franchiseId)`
4. `useGetCategoriesByFranchise(franchiseId)`
5. `useGetMenuByFranchise(franchiseId)`

Y nghia:

- Product detail duoc lay trong context cua branch hien tai.
- Topping tren detail page duoc lay theo TOAN BO franchise, khong loc theo category.
- Sidebar menu duoc lay theo TOAN BO franchise.

### 3. Chon size cua product chinh

Product detail tra ve `sizes[]`.

Page loc:

```ts
availableDetailSizes = detailSizes.filter((size) => size.isAvailable)
```

Sau do tinh `effectiveSelectedSizeProductFranchiseId`:

1. Neu route/state hien tai match 1 size available -> giu nguyen
2. Neu khong match -> fallback size available dau tien

Nghia la:

- Neu route param that su la `productId` chu khong phai `productFranchiseId`, UI van khong vo.
- Nhung no se mac dinh size dau tien.

### 4. Topping detail page duoc lay theo FRANCHISE, khong theo CATEGORY

Page dung:

```ts
useGetProductsByFranchise(franchiseId)
```

Sau do chi loc availability:

```ts
toppingsByFranchiseVisible = (toppingDataAll ?? []).filter((product) =>
  product.sizes.some((s) => s.isAvailable)
)
```

Khong co buoc loc theo `categoryId` cua product detail.

Nghia la:

- Khi vao trang detail, user co the thay tat ca topping available cua ca branch.
- Topping hien tai khong bi gioi han boi category cua product dang xem.

Neu business mong muon:

- topping cua category A chi dung voi product category A

thi logic hien tai chua lam viec do.

### 5. Topping chi hien khi product detail cho phep

UI topping section duoc mo boi:

```ts
detailHasTopping = product?.isHaveTopping
```

Neu `isHaveTopping` false/null:

- client van co the da fetch topping all theo franchise
- nhung UI khong render block chon topping

### 6. Chon topping hien tai la chon THEO PRODUCT, khong chon size truc tiep

State topping:

```ts
selectedToppings: Record<string, string>
```

Trong do:

- key = `productId` cua topping
- value = `productFranchiseId` cua size dang duoc chon

Nhung UI hien tai khong cho user chon size topping thu cong.
Khi bat 1 topping, page tu dong chon:

```ts
const firstAvailableSize = product.sizes.find((size) => size.isAvailable)
```

Sau do luu:

```ts
selectedToppings[productId] = firstAvailableSize.productFranchiseId
```

He qua:

- Moi topping chi co on/off.
- Neu topping co nhieu size, client mac dinh lay size available dau tien.
- Khong co UI doi size topping.

### 7. Tinh gia topping

Gia topping duoc tinh bang cach:

1. Duyet `selectedToppings`
2. Tim lai topping theo `productId`
3. Tim size theo `productFranchiseId`
4. Cong `size.price`

Nghia la:

- Gia them vao tong tien la gia cua tung size topping duoc chon.

### 8. Gia hien tren detail page

```ts
totalPrice = basePrice + toppingPrice
```

Luu y:

- Day la gia cua 1 don vi product + topping.
- Code hien tai khong nhan voi `quantity` khi hien thi gia tren man hinh.
- `quantity` chi duoc gui luc them vao cart.

Day khong anh huong den logic franchise, nhung la mot chi tiet can biet khi sua UI tinh tong.

---

## Product va topping di vao cart nhu the nao

Day la phan quan trong nhat neu sau nay sua luong order.

### 1. Main product gui len cart bang `productFranchiseId`

Khi bấm add-to-cart, page goi:

```ts
addItem(
  selectedSizeData.productFranchiseId,
  detailName,
  selectedSizeData.price,
  quantity,
  detailImageUrl,
  {
    franchiseId,
    options,
  },
)
```

Gia tri gui vao `addItem(...)` la:

- `productId` tham so dau tien thuc chat la `selectedSizeData.productFranchiseId`

Nghia la:

- Cart API nhan item chinh theo id cua product trong branch + size cu the.
- Khong gui `productId` global cua product.

### 2. Topping gui len cart cung bang `productFranchiseId`

Page map `selectedToppings` thanh:

```ts
options = [
  {
    productFranchiseId: String(selectedToppingSize.productFranchiseId),
    quantity: 1,
  }
]
```

Nghia la:

- Moi topping trong cart la 1 option item chua `productFranchiseId`.
- Hien tai quantity topping luon la `1`.

### 3. `useCart()` se dong goi payload cart

Trong `src/pages/client/cart/useCart.ts`:

- `addItem(...)` nhan `productId`
- Sau do ep thanh string `productFranchiseId`
- Tao payload `AddProductToCartRequest`

Payload that su gui len API:

```ts
{
  franchiseId,
  productFranchiseId,
  quantity,
  address,
  phone,
  note,
  message,
  options
}
```

Ket luan:

- Tren cart layer, product chinh va topping deu duoc xac dinh bang `productFranchiseId`.
- `franchiseId` bat buoc di kem de backend biet item thuoc branch nao.

---

## So do luong du lieu

### Menu list page

```text
GET franchises
  -> chon activeFranchiseId
  -> GET categories by franchise
  -> GET menu by franchise (all)
      -> tinh category tabs
      -> mac dinh activeCategoryId
  -> neu activeCategoryId = ALL
      -> hien menu all
      -> KHONG load topping
  -> neu activeCategoryId = category cu the
      -> GET menu by franchise + category
      -> GET toppings by franchise + category
      -> render 2 section: Menu + Topping
```

### Product detail page

```text
Route /menu/product/:franchiseId/:productFranchiseId
  -> GET product detail by franchise + route param
  -> GET toppings by franchise (all)
  -> GET menu by franchise (all) de ve sidebar
  -> user chon size main product
  -> user bat/tat topping
      -> topping auto chon first available size
  -> add to cart
      -> gui main productFranchiseId
      -> gui options[].productFranchiseId
      -> gui franchiseId
```

---

## Nhung diem de hieu nham hoac can luu y

### 1. `"ALL"` category khong load topping

Day la behavior hien tai:

- `ALL` chi hien menu product
- topping chi hien khi vao category cu the

Neu user bao "sao all menu khong co topping", do la do logic nay.

### 2. Category tabs duoc quyet dinh boi menu, khong boi topping

Neu category chi co topping, no co the khong bao gio hien trong tab.

### 3. Detail page lay topping theo toan franchise

Khong co loc category cua product dang xem.

### 4. Topping khong co chon size bang UI

Chi on/off va tu lay size available dau tien.

### 5. Route detail dat ten `productFranchiseId` nhung nhieu noi lai truyen `productId`

Day la diem nguy co cao nhat de sua nham:

- MenuPage navigate bang `product.productId`
- Sidebar detail cung navigate bang `p.productId`
- Nhung cart add lai gui `selectedSize.productFranchiseId`

Dieu nay cho thay he thong hien tai dang co 3 lop id:

1. `productId` global
2. `productFranchiseId` cho branch + size
3. route param duoc dat ten la `productFranchiseId` nhung co luc chua gia tri `productId`

Neu can sua detail flow cho dung size/item theo click, day la diem nen kiem tra dau tien.

### 6. Client khong sort lai du lieu

Client chu yeu tin vao thu tu backend tra ve:

- category order
- product order
- size order

Neu backend tra ve khong dung thu tu mong muon, UI hien cung se sai theo.

---

## Neu muon sua logic thi dung file nao

| Muc tieu sua | File nen vao dau tien |
| --- | --- |
| Doi logic chon franchise / category / ALL | `src/pages/client/menu/MenuPage.tsx` |
| Doi endpoint hoac query key | `src/hooks/client/useProduct.hook.ts` |
| Doi URL API client menu/topping | `src/api/client/product.api.ts` |
| Doi shape menu | `src/types/menu.type.ts` |
| Doi shape topping/product detail | `src/types/product.type.ts` |
| Doi logic detail page, size, topping, add-to-cart | `src/pages/client/menu/MenuProductDetailPage.tsx` |
| Doi payload add-to-cart | `src/pages/client/cart/useCart.ts` |
| Doi route menu detail | `src/router/route.const.ts` |

---

## Tom tat ngan gon

- Franchise la key lon nhat de load menu va topping.
- Menu product lay tu `/api/clients/menu`.
- Topping lay tu `/api/clients/products`.
- List page mac dinh vao tab `ALL`, nen thuong chi thay menu product, chua thay topping.
- Topping tren detail page lay theo toan bo franchise, khong loc category.
- Khi them vao cart, backend nhan `productFranchiseId` cho ca item chinh va topping options.
- Hien tai route/detail flow dang co dau hieu nham giua `productId` va `productFranchiseId`.

