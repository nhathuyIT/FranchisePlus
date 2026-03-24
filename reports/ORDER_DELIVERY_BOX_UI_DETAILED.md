# Order Delivery Box UI - Detailed Design Spec

Updated: 2026-03-24

## 1. Muc tieu

Tai lieu nay dac ta chi tiet UI cua "Delivery Box" trong man hinh Order Detail.

Muc tieu:

- de UI nhin dep, ro trang thai, de thao tac
- de dev frontend implement nhanh va dung nghiep vu
- de copy sang project khac ma khong phu thuoc code cu

## 2. Delivery Box la gi

Delivery Box la card trung tam de dieu khien delivery flow cua 1 order:

1. Hien trang thai hien tai
2. Hien nguoi duoc gan giao don
3. Hien timeline transition
4. Cung cap action theo dung step

Flow business can cover:

1. confirmed -> preparing
2. preparing -> readyForPickup (co modal chon staff)
3. readyForPickup -> outForDelivery
4. outForDelivery -> completed

## 3. Vi tri trong trang

Tren desktop:

1. Dat Delivery Box ngay duoi OrderProgressHeader
2. Cung cot voi thong tin order/items (khong day sang Payment panel)
3. Khoang cach voi section tren: 16px
4. Khoang cach voi section duoi: 20px

Tren mobile:

1. Dat sau Header va Progress
2. Nhom Delivery thanh 1 card day du
3. Action button sticky trong card khi can

## 4. Visual direction

Cam giac can dat:

- clean, operational, ro trang thai
- trustable cho staff va manager
- khong loe loet, khong "dashboard noisy"

Card style de xuat:

1. Nen card: #FFFFFF
2. Border: 1px solid #E9E2D8
3. Radius: 16px
4. Shadow: 0 8px 24px rgba(64, 45, 24, 0.08)
5. Padding desktop: 20px
6. Padding mobile: 14px

## 5. Design tokens (goi y)

```css
:root {
  --delivery-bg: #ffffff;
  --delivery-border: #e9e2d8;
  --delivery-title: #2f2419;
  --delivery-text: #5b4b3a;
  --delivery-muted: #8b7b68;

  --delivery-confirmed: #7c5a2f;
  --delivery-confirmed-bg: #f9efe1;

  --delivery-preparing: #a36312;
  --delivery-preparing-bg: #fff3df;

  --delivery-ready: #245f8f;
  --delivery-ready-bg: #eaf5ff;

  --delivery-out: #155aa8;
  --delivery-out-bg: #e8f1ff;

  --delivery-completed: #1e7a3f;
  --delivery-completed-bg: #eaf8ef;

  --delivery-error: #b42318;
  --delivery-error-bg: #fdecec;
}
```

## 6. Component anatomy

Delivery Box nen gom 6 vung:

1. Header row
   - Title: "Delivery"
   - Status badge
2. Meta row
   - Delivery ID
   - Assigned staff
   - Assigned time
3. Step rail (mini progress)
   - 4 nodes transition cho delivery
4. Primary action area
   - 1 nut hanh dong chinh theo trang thai
5. Secondary actions
   - refresh
   - view logs (neu co)
6. Helper text / error strip
   - canh bao khi thieu deliveryId

## 7. Noi dung va microcopy

### 7.1 Header

- Title: "Delivery"
- Subtitle: "Track and control shipping progress"

### 7.2 Badge text

Map text:

1. confirmed -> "Confirmed"
2. preparing -> "Preparing"
3. readyForPickup -> "Ready for pickup"
4. outForDelivery -> "Out for delivery"
5. completed -> "Completed"

### 7.3 Action label

1. confirmed: "Start preparing"
2. preparing: "Assign shipper"
3. readyForPickup: "Mark as picked up"
4. outForDelivery: "Mark as delivered"
5. completed: disabled, label "Delivery completed"

### 7.4 Helper message

1. Thieu deliveryId:
   - "Cannot continue delivery flow because deliveryId is missing."
2. Dang xu ly action:
   - "Processing delivery update..."
3. Action thanh cong:
   - "Delivery status updated successfully."

## 8. State-by-state UI behavior

### 8.1 confirmed

1. Badge mau confirmed
2. Nut chinh enable: Start preparing
3. Step rail highlight node 1

### 8.2 preparing

1. Badge mau preparing
2. Nut chinh enable: Assign shipper
3. Click nut mo ReadyForPickup modal
4. Step rail highlight node 2

### 8.3 readyForPickup

1. Badge mau ready
2. Hien assigned staff ro rang
3. Nut chinh enable: Mark as picked up
4. Neu thieu deliveryId -> disable + helper error

### 8.4 outForDelivery

1. Badge mau outForDelivery
2. Nut chinh enable: Mark as delivered
3. Step rail highlight node 4

### 8.5 completed

1. Badge mau completed
2. Nut chinh disabled
3. Hien timestamp deliveredAt neu co

## 9. CTA button design

Nut chinh can dep va de bam:

1. Height: 44px desktop, 42px mobile
2. Radius: 12px
3. Font weight: 600
4. Padding ngang: 16px

Color rule:

1. default: use status color
2. hover: darken 8%
3. active: darken 12%
4. disabled: #d9d2c7 + text #8f8577

Neu action nguy hiem hoac irreversible:

- show confirm modal nhe truoc khi submit

## 10. ReadyForPickup modal style

Modal can dong bo voi Delivery Box:

1. Width desktop: 560px
2. Radius: 16px
3. Header title: "Assign shipper"
4. Search input o tren list
5. Staff item la card row de click

Staff item row:

1. Avatar tron 36px
2. Ten dam + subtitle phone/email
3. Chip "Selected" khi duoc chon
4. Hover bg: #f8f4ef

Footer:

1. Secondary: Cancel
2. Primary: Confirm assignment
3. Primary disable neu chua chon staff

## 11. Interaction va motion

Motion dung vua du:

1. Card appear: fade + translateY(4px), 180ms
2. Badge change: color transition 160ms
3. Button loading: spinner nho ben trai label
4. Step node active: scale from 0.96 -> 1, 140ms

Rule:

- Khong dung animation dai hon 220ms
- Tat ca transition dung ease-out

## 12. Empty/loading/error states

### Loading

1. Skeleton cho title, meta, button
2. Step rail dung placeholder bars

### Empty

1. Khi chua co delivery object
2. Hien thong diep: "Delivery info is not available yet"
3. Con show order status de user van hieu context

### Error

1. Banner tren cung card, mau do nhe
2. Noi dung: ly do + nut Retry
3. Khong an mat du lieu cu neu update fail

## 13. Responsive spec

### Desktop >= 1024

1. Header va action cung hang neu du cho
2. Meta 3 cot: deliveryId, assignee, assignedAt
3. Step rail full ngang card

### Tablet 768-1023

1. Header tach 2 dong
2. Meta xuong 2 cot
3. CTA van full-width

### Mobile < 768

1. Title, badge, helper text xep doc
2. Meta xep doc tung dong
3. Nut chinh full width
4. Step rail chuyen dang compact chips

## 14. Accessibility

1. Contrast text >= 4.5:1
2. Badge co icon + text, khong chi dung mau
3. Nut co aria-label day du
4. Modal trap focus
5. Enter = submit, Esc = close modal
6. Live region cho success/error message

## 15. Data contract can cho UI box

Delivery Box can cac truong toi thieu:

1. orderStatus
2. deliveryId
3. assignedToName
4. assignedAt
5. updatedAt
6. canTransition (derived)
7. transitionLoading (derived)

Cac truong derived nen tinh trong hook/usecase, khong tinh truc tiep trong component presentational.

## 16. Pseudocode render logic

```ts
const deliveryUiState = buildDeliveryUiState(orderDetail, deliveryDetail);

if (deliveryUiState.isLoading) return <DeliveryBoxSkeleton />;

return (
  <DeliveryBox>
    <StatusBadge status={deliveryUiState.status} />
    <DeliveryMeta data={deliveryUiState.meta} />
    <DeliveryStepRail status={deliveryUiState.status} />

    <PrimaryAction
      disabled={!deliveryUiState.canPrimaryAction}
      loading={deliveryUiState.isMutating}
      onClick={deliveryUiState.onPrimaryAction}
    />

    {deliveryUiState.errorMessage && (
      <InlineError message={deliveryUiState.errorMessage} />
    )}
  </DeliveryBox>
);
```

## 17. Acceptance checklist cho UI dep va dung flow

1. Nhin vao card biet ngay don dang o step nao.
2. Moi trang thai chi co 1 action chinh ro rang.
3. Action mau sac va copy khop voi trang thai.
4. Modal assign shipper de dung va khong nham.
5. Mobile van thao tac duoc bang 1 tay.
6. Khong bi jump layout khi loading/mutating.
7. Error hien ro nhung khong pha context.

---

Tai lieu nay tap trung vao UI Delivery Box. Flow tong post-checkout va payment xem trong ORDER_DELIVERY_PAYMENT_FLOW.md.
