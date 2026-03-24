# Order Management - Post Checkout Delivery va Payment Flow

Updated: 2026-03-24

## 1. Muc tieu tai lieu

Tai lieu nay chi tap trung vao flow SAU KHI da goi checkout thanh cong.

Pham vi gom:

- tim order vua sinh tu cart
- load order list va order detail
- xu ly chuyen trang thai delivery
- xu ly thanh toan payment

## 2. Diem bat dau sau checkout

Gia dinh diem bat dau:

1. Da goi checkout thanh cong: PUT /api/carts/:id/checkout
2. Da co cartId vua checkout

Buoc tiep theo bat buoc:

1. Goi GET /api/orders/cart/:cartId de lay order tu cart
2. Lay orderId tu response
3. Mo trang detail don: /admin/orders/:orderId

Luu y quan trong:

- Khong dung response checkout lam nguon su that cuoi cung cho order.
- Luon refetch order bang cartId ngay sau checkout.

## 3. Order read flow sau checkout

### 3.1 Order detail read

API chinh:

- GET /api/orders/:id

Field detail toi thieu can co de van hanh:

- \_id, code, status, created_at
- customer_id, customer_name, phone
- address, message, franchise_id, franchise_name
- subtotal_amount, promotion_discount, voucher_discount, loyalty_discount, final_amount
- order_items[] va options[]
- delivery_id hoac delivery.\_id (cho 2 step giao hang cuoi)

### 3.2 Order list read

API chinh theo role:

- ADMIN, MANAGER:
  - GET /api/orders/franchise/:franchiseId?status=...
- STAFF:
  - POST /api/deliveries/search
  - body dung `staff_id` cua user dang login
  - co the gui kem `franchise_id` tu auth context neu can
  - sau do refetch `GET /api/orders/:id` theo tung `orderId` de mo detail va render list item

Field list toi thieu:

- \_id, code, status, phone
- subtotal_amount, final_amount
- created_at

## 4. Delivery state machine

Flow delivery dang duoc dung:

1. CONFIRMED -> PREPARING
   - PUT /api/orders/:id/preparing
2. PREPARING -> READY_FOR_PICKUP
   - mo modal chon staff giao hang theo franchise
   - GET /api/user-franchise-roles/franchise/:franchiseId
   - PUT /api/orders/:id/ready-for-pickup
   - body: { "staff_id": "<user_id>" }
3. READY_FOR_PICKUP -> OUT_FOR_DELIVERY
   - PUT /api/deliveries/:deliveryId/pickup
4. OUT_FOR_DELIVERY -> COMPLETED
   - PUT /api/deliveries/:deliveryId/complete

Rule van hanh:

1. Sau moi lan mutate status, refetch order detail.
2. Khong phu thuoc vao body mutate endpoint de render timeline.
3. Neu thieu deliveryId thi block action 2 step cuoi va hien loi ro rang.

## 5. Payment flow

Flow payment tren order detail:

1. GET /api/payments/order/:orderId de load payment
2. Neu can xac nhan thanh toan:
   - PUT /api/payments/:paymentId/confirm
3. Sau khi confirm:
   - refetch payment
   - refetch order detail

Rule van hanh:

1. Payment va order phai duoc dong bo sau moi action confirm.
2. Neu payment contract thay doi shape, uu tien sua service mapping thay vi sua truc tiep UI.

## 6. Role va franchise context

1. STAFF va MANAGER: lay franchiseId tu active auth context.
2. ADMIN: neu chua co active franchise thi bat buoc chon franchise truoc.
3. STAFF dung them `staffId = authUser.user.id` de scope list vao delivery lien quan den chinh minh.
4. Neu chua resolve duoc context hop le thi khong goi list API.

## 7. API checklist cho post-checkout flow

Order:

- GET /api/orders/cart/:cartId
- GET /api/orders/franchise/:franchiseId?status=...
- GET /api/orders/:id
- PUT /api/orders/:id/preparing
- PUT /api/orders/:id/ready-for-pickup

Delivery:

- POST /api/deliveries/search
- PUT /api/deliveries/:deliveryId/pickup
- PUT /api/deliveries/:deliveryId/complete

Payment:

- GET /api/payments/order/:orderId
- PUT /api/payments/:paymentId/confirm

## 8. Acceptance criteria

1. Sau checkout luon tim duoc order bang cartId.
2. Order detail hien dung status va tong tien.
3. Chuyen duoc day du 4 buoc delivery.
4. Buoc PREPARING -> READY_FOR_PICKUP co staff_id hop le.
5. Payment load duoc va confirm duoc.
6. Moi mutate xong deu refetch de UI khong lech state.

---

Neu backend doi contract tiep, cap nhat tai lieu nay truoc roi moi cap nhat service va UI.
