# Order Management - UI Design Guide

Updated: 2026-03-24

## 1. Muc tieu tai lieu

Tai lieu nay mo ta thiet ke UI cho bo man hinh order-management theo goc nhin handoff:

- de team moi hieu nhanh cau truc man hinh
- de map dung giua business flow va UI blocks
- de tai su dung cho project khac ma khong phu thuoc source code cu the

## 2. UI architecture tong quan

UI nen tach thanh 4 man hinh chinh:

1. POS Builder
2. POS Review
3. Order List
4. Order Detail

Nguyen tac:

- man hinh tao don va man hinh van hanh don phai tach ro
- moi man hinh co action chinh duy nhat, khong tron qua nhieu tac vu

## 3. Screen design chi tiet

### 3.1 POS Builder

Muc tieu:

- tao va chinh cart nhanh trong thao tac tai quay

Layout desktop:

1. Left column (workspace):
   - header thao tac
   - bo loc category
   - product grid
2. Right column (sidebar):
   - cart tom tat
   - danh sach item
   - tong tien tam tinh
   - action tiep tuc review

Layout mobile:

- product grid la trung tam
- cart summary chuyen thanh bottom action va panel truot

Component nhin tu UX:

- Category tabs
- Product card
- Product config modal (size, topping, note)
- Draft or active cart sidebar

### 3.2 POS Review

Muc tieu:

- xac nhan thong tin cuoi truoc checkout

Layout desktop:

1. Main column:
   - thong tin customer
   - danh sach cart items
   - sua item persisted qua modal cau hinh
2. Summary sidebar:
   - subtotal
   - discount
   - final amount
   - form address / phone / message
   - action checkout

Layout mobile:

- tach thanh cac section cuon doc
- co sticky mobile nav de di nhanh giua Item va Summary

Rule UX:

- khong submit address / phone / message khi blur
- chi submit 1 lan o action checkout

### 3.3 Order List

Muc tieu:

- theo doi danh sach don theo franchise va status

Layout desktop:

1. Top filter bar:
   - status tabs
   - search code/phone
   - refresh
2. Main content:
   - list card or list row theo don
   - quick select order

Layout mobile:

- filter rut gon
- card list uu tien thong tin code, status, final amount

Rule UX:

- auto-select don dau tien khi list co du lieu
- empty state ro rang cho status filter khong co don

### 3.4 Order Detail

Muc tieu:

- dieu khien toan bo lifecycle delivery va payment cho 1 don

Layout desktop de xuat:

1. Header zone:
   - ma don, trang thai, thong tin co ban
2. Progress zone:
   - thanh 5 buoc trang thai
3. Detail zone:
   - thong tin customer va giao nhan
   - danh sach items va options
4. Payment zone:
   - thong tin payment
   - action confirm payment

Layout mobile:

- sap xep theo thu tu:
  - Header -> Progress -> Items -> Payment
- cac action chinh dat o cuoi section tuong ung

## 4. Status UI mapping

Thanh status 5 cot:

1. Da xac nhan (CONFIRMED)
2. Dang chuan bi (PREPARING)
3. San sang ban giao (READY_FOR_PICKUP)
4. Dang giao (OUT_FOR_DELIVERY)
5. Giao thanh cong (COMPLETED)

Hanh vi action tren UI:

1. Tu CONFIRMED co action chuyen PREPARING
2. Tu PREPARING co action mo modal chon staff roi chuyen READY_FOR_PICKUP
3. Tu READY_FOR_PICKUP co action pickup
4. Tu OUT_FOR_DELIVERY co action complete

Neu trang thai khong hop le:

- disable action
- hien thong diep ly do ngan gon

## 5. Modal va interaction patterns

### 5.1 Product config modal

Dung cho:

- chon size
- chon topping
- nhap note

Rule:

- neu thay doi cau hinh item persisted, xu ly theo business rule cua backend

### 5.2 Ready for pickup modal

Dung cho:

- chon staff giao hang theo franchise

UX toi thieu:

1. load danh sach staff
2. cho phep tim theo ten/sdt neu list dai
3. buoc submit bat buoc co staff duoc chon

## 6. Data states can thiet cho moi screen

Moi screen can day du 4 nhom state:

1. Loading
2. Empty
3. Error
4. Success

Rule chung:

- mutate thanh cong thi refetch du lieu lien quan
- khong update UI bang gia tri gia dinh neu thieu du lieu critical

## 7. Responsive va usability rules

1. Desktop uu tien 2 cot cho thao tac nhanh.
2. Mobile uu tien 1 cot, action sticky o vi tri de bam.
3. Hit area nut chinh >= 40px cao.
4. Contrast text va action du de doc trong dieu kien anh sang manh.
5. Action nguy hiem (cancel/remove) can co xac nhan.

## 8. Visual language de giu tinh thong nhat

1. Tong the card-based, bo goc lon, shadow nhe.
2. Mau action chinh nhat quan tren toan flow.
3. Status color map co quy tac ro rang:
   - preparing: warning/amber
   - out_for_delivery: info/blue
   - completed: success/green
4. Typography nhat quan theo cap:
   - title
   - section
   - body
   - caption

## 9. Accessibility checklist

1. Tat ca nut action co label ro rang.
2. Modal mo ra phai focus vao phan tu dau tien co the tuong tac.
3. Ho tro keyboard cho cac action chinh.
4. Co thong bao loi thanh cong that bai de screen reader co the doc.
5. Khong dung mau la kenh duy nhat de truyen trang thai.

## 10. Handoff checklist cho project moi

1. Co du 4 screen: Builder, Review, List, Detail.
2. Co status bar 5 buoc va map dung status code.
3. Co modal chon staff cho buoc READY_FOR_PICKUP.
4. Co payment panel voi flow load va confirm.
5. Co loading, empty, error state tren moi screen.
6. Co responsive desktop va mobile.

---

Tai lieu nay chi mo ta design va interaction. API flow post-checkout duoc tach rieng trong file ORDER_DELIVERY_PAYMENT_FLOW.md.
