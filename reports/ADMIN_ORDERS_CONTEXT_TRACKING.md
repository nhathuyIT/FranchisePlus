# Admin Orders Context Tracking

Last updated: 2026-03-24

## 1. Muc tieu dang lam

Implement luong order management cho admin theo cac file trong `reports/`, bao gom:

- follow rule tach page/hook/service trong `reports/SKILLS.md`
- build order list + order detail trong `src/pages/admin/orders`
- noi flow sau checkout tu cart sang order detail
- dam bao delivery/payment action refetch dung state backend

## 2. Tai lieu da doc

Da doc:

- `reports/SKILLS.md`
- `reports/ORDER_DELIVERY_PAYMENT_API_TYPES.md`
- `reports/ORDER_DELIVERY_PAYMENT_FLOW.md`
- `reports/ORDER_UI_DESIGN_GUIDE.md`

Da kiem tra them:

- Postman collection de confirm endpoint thuc te
- `src/stores/auth-store.ts`
- `src/hooks/franchise/useFranchise.hooks.ts`
- `src/router/route.const.ts`
- `src/router/admin/admin.menu.tsx`
- `src/router/admin/admin.route.tsx`
- `src/layouts/admin-layout/admin-sidebar.tsx`
- `src/pages/admin/cart/checkout.tsx`
- `src/hooks/user-franchise-role/useUserFranchiseRole.hooks.ts`
- `src/api/user-franchise-role/user-franchise-role.api.ts`
- `src/api/user-franchise-role/user-franchise-role.type.ts`

## 3. Nhung gi da lam xong

### 3.1. Da tao feature admin orders

Da tao folder `src/pages/admin/orders` va bo khung feature rieng cho admin orders.

Da tao:

- `src/pages/admin/orders/models/order-management.type.ts`
- `src/pages/admin/orders/services/order-management.service.ts`
- `src/pages/admin/orders/hooks/use-order-management-query.ts`
- `src/pages/admin/orders/hooks/use-order-franchise-context.ts`
- `src/pages/admin/orders/hooks/use-order-list-page.ts`
- `src/pages/admin/orders/hooks/use-order-detail-page.ts`
- `src/pages/admin/orders/components/OrderFranchiseGate.tsx`
- `src/pages/admin/orders/components/OrderFilterBar.tsx`
- `src/pages/admin/orders/components/OrderListPanel.tsx`
- `src/pages/admin/orders/components/OrderStatusTimeline.tsx`
- `src/pages/admin/orders/components/ReadyForPickupDialog.tsx`
- `src/pages/admin/orders/components/ConfirmPaymentDialog.tsx`
- `src/pages/admin/orders/components/OrderDetailScreen.tsx`
- `src/pages/admin/orders/index.tsx`
- `src/pages/admin/orders/detail.tsx`
- `src/pages/admin/orders/utils/order-management.utils.ts`

### 3.2. Da wire orders vao app

Da wire xong:

- `src/router/admin/admin.menu.tsx`
- `src/router/admin/admin.route.tsx`
- `src/layouts/admin-layout/admin-sidebar.tsx`
- `src/router/route.const.ts`

Da them:

- menu `Orders`
- route `/admin/orders`
- route detail `/admin/orders/:orderId`
- icon sidebar `receipt`

Luu y:

- khong dua `ORDERS_DETAIL` vao `ADMIN_MENU`
- detail route duoc khai bao rieng trong `admin.route.tsx`

### 3.3. Da sua checkout cart de chay dung post-checkout flow

Da sua `src/pages/admin/cart/checkout.tsx` de follow `reports/ORDER_DELIVERY_PAYMENT_FLOW.md`.

Da tao them:

- `src/pages/admin/cart/hooks/useCartCheckoutOrderFlow.ts`

Flow moi sau checkout:

1. Goi `PUT /api/carts/:id/checkout`
2. Khong dung response checkout lam nguon su that cuoi cung cho order
3. Luon goi lai `GET /api/orders/cart/:cartId`
4. Retry lookup order toi da 5 lan, moi lan cach 700ms
5. Neu lay duoc `orderId` thi mo `/admin/orders/:orderId`
6. Neu chua lay duoc thi giu user o checkout page, hien trang thai dang mo order flow va cho phep retry

Luu y:

- flow nay khong da nguoc ve cart list ngay nua
- page khoa checkout lai sau khi da checkout thanh cong trong session hien tai

### 3.4. Da xu ly case delivery not found

Da sua:

- `src/pages/admin/orders/hooks/use-order-detail-page.ts`
- `src/pages/admin/orders/components/OrderDetailScreen.tsx`

Neu API delivery tra message dang:

- `Delivery not found by order id`

Thi UI se coi la:

- don hang chua duoc giao
- delivery = null
- khong hien alert loi do cho case nay

Message hien tai:

- `This order has not been assigned to delivery yet.`

Cac loi delivery khac van giu alert nhu cu.

### 3.5. Da doi Ready for Pickup sang dung hook user-franchise-role

Da sua:

- `src/pages/admin/orders/components/ReadyForPickupDialog.tsx`

Thay doi:

- khong con dung query `useFranchiseDeliveryStaffQuery` de load staff cho dialog nay
- da doi sang `useUserFranchiseRoleSearch`
- search theo `franchiseId` hien tai
- filter local cac assignment co role thuoc nhom:
  - `STAFF`
  - `EMPLOYEE`
  - `SHIP`
  - `DELIVERY`
- dedupe theo `userId`
- map thanh options de chon staff giao hang

Luu y:

- dialog nay hien dang dua tren assignment `user-franchise-role`
- UI hien `name + email + role`
- khong co `phone` vi hook moi khong tra field nay

### 3.6. Da fix compile errors lien quan

Da sua:

- `src/const/order.const.ts`
- `src/pages/admin/orders/components/OrderListPanel.tsx`

Da fix:

- them `variant?: string` vao `OrderItemData`
- them `DRAFT` vao `ORDER_STATUS_STYLES`
- bo import thua trong `OrderListPanel.tsx`

### 3.7. Da tach service order management theo domain

Da sua:

- `src/pages/admin/orders/services/order-management.service.ts`
- `src/pages/admin/orders/hooks/use-order-management-query.ts`
- `src/pages/admin/cart/hooks/useCartCheckoutOrderFlow.ts`

Da tao them:

- `src/pages/admin/orders/services/order.service.ts`
- `src/pages/admin/orders/services/delivery.service.ts`
- `src/pages/admin/orders/services/payment.service.ts`
- `src/pages/admin/orders/services/service.utils.ts`

Thay doi:

- khong con de 1 file service gom ca order, delivery, payment vao cung 1 noi
- tach API order sang `order.service.ts`
- tach API delivery va load delivery staff sang `delivery.service.ts`
- tach API payment sang `payment.service.ts`
- gom helper parse response chung vao `service.utils.ts`
- giu `order-management.service.ts` thanh file re-export nho de tranh vo import cu

### 3.8. Da tach logic list theo role ADMIN / MANAGER / STAFF

Da sua:

- `src/pages/admin/orders/hooks/use-order-franchise-context.ts`
- `src/pages/admin/orders/hooks/use-order-list-page.ts`
- `src/pages/admin/orders/hooks/use-order-management-query.ts`
- `src/pages/admin/orders/services/delivery.service.ts`
- `src/hooks/franchise/useFranchise.hooks.ts`
- `src/pages/admin/orders/index.tsx`

Thay doi:

- `ADMIN`:
  - van hien franchise selector
  - chi load list khi da chon franchise
  - list tiep tuc di theo order cua franchise
- `MANAGER`:
  - tu dong dung `currentFranchiseId` trong auth context
  - khong can chon franchise tay
  - list di theo franchise hien tai
- `STAFF`:
  - tu dong dung `authUser.user.id` lam `staffId`
  - list khong goi order list theo franchise nua
  - doi sang `POST /api/deliveries/search`
  - gui `staff_id` va `franchise_id` hien tai neu co
  - map ket qua delivery ve order list item bang cach refetch `GET /api/orders/:id`

Luu y:

- trong implementation hien tai, `MANAGER` van xem list order theo franchise de giu duoc cac trang thai truoc delivery nhu `CONFIRMED` va `PREPARING`
- `STAFF` chi thay cac order co delivery lien quan den chinh user dang login

## 4. Hien trang hien tai

Trang thai hien tai:

- admin orders da duoc wire vao app
- checkout post-flow da noi sang order detail
- order detail da xu ly duoc order, delivery, payment action flow
- build TypeScript/Vite da qua

Phan chua verify bang tay tren browser/backend that:

- manual flow `cart checkout -> order detail`
- manual flow `CONFIRMED -> PREPARING -> READY_FOR_PICKUP -> OUT_FOR_DELIVERY -> COMPLETED`
- manual flow payment confirm tren order detail
- xac nhan backend role naming cho `Ready for Pickup` co on dinh voi filter `STAFF / EMPLOYEE / SHIP / DELIVERY`

## 5. Endpoint va flow da confirm

### Order

- `GET /api/orders/cart/:cartId`
- `GET /api/orders/franchise/:franchiseId?status=...`
- `GET /api/orders/:id`
- `GET /api/orders/code?code=...`
- `PUT /api/orders/:id/preparing`
- `PUT /api/orders/:id/ready-for-pickup`

Body cho `ready-for-pickup`:

- `{ staff_id: ... }`

### Delivery

- `GET /api/deliveries/order/:orderId`
- `POST /api/deliveries/search`
- `PUT /api/deliveries/:deliveryId/pickup`
- `PUT /api/deliveries/:deliveryId/complete`

### Payment

- `GET /api/payments/order/:orderId`
- `PUT /api/payments/:paymentId/confirm`

### User franchise role

- `POST /api/user-franchise-roles/search`

## 6. Build va test

Da chay:

- `npm run build`

Ket qua:

- build pass

Warning con lai:

- warning chunk size cua Vite
- warning module bi import vua dynamic vua static

Hien tai day la warning build, khong chan compile.

## 7. Tinh trang git luc ghi file nay

`git status --short` hien tai:

```text
 D "Ecommerce Franchise Training.postman_collection (1603).json"
 D "Ecommerce Franchise Training.postman_collection.json"
 M src/const/order.const.ts
 M src/layouts/admin-layout/admin-sidebar.tsx
 M src/pages/admin/cart/checkout.tsx
 M src/router/admin/admin.menu.tsx
 M src/router/admin/admin.route.tsx
 M src/router/route.const.ts
?? "Ecommerce Franchise Training.postman_collection(24032026).json"
?? reports/
?? src.zip
?? src/pages/admin/cart/hooks/useCartCheckoutOrderFlow.ts
?? src/pages/admin/orders/
```

Luu y:

- khong revert file Postman
- khong revert `reports/`
- khong revert `src.zip`

## 8. File moi va file chinh da sua

File moi:

- `src/pages/admin/cart/hooks/useCartCheckoutOrderFlow.ts`
- toan bo folder `src/pages/admin/orders/`
- trong `src/pages/admin/orders/services/` hien tai da co them:
  - `order.service.ts`
  - `delivery.service.ts`
  - `payment.service.ts`
  - `service.utils.ts`

File chinh da sua:

- `src/router/route.const.ts`
- `src/router/admin/admin.menu.tsx`
- `src/router/admin/admin.route.tsx`
- `src/layouts/admin-layout/admin-sidebar.tsx`
- `src/pages/admin/cart/checkout.tsx`
- `src/pages/admin/cart/hooks/useCartCheckoutOrderFlow.ts`
- `src/const/order.const.ts`
- `src/pages/admin/orders/hooks/use-order-management-query.ts`
- `src/pages/admin/orders/services/order-management.service.ts`

## 9. Ghi chu handoff ngan

Neu tiep tuc o context sau, thu tu hop ly la:

1. Test tay flow checkout tu cart sang order detail.
2. Test tay `Ready for Pickup` de confirm danh sach staff tu `user-franchise-role` dung nhu backend tra.
3. Test tay 4 buoc delivery status voi du lieu that.
4. Test tay payment confirm.
5. Neu muon don code, xem co can bo `getDeliveryStaffByFranchise` ra khoi order feature hay khong vi dialog hien da dung hook khac.
