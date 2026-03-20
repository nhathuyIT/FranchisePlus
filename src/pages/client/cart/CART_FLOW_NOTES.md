# Cart flow notes

## API source of truth

- Cart page uses `useCartsByCustomerQuery({ customerId, status: "ACTIVE" })`.
- Cart list API is the main source of truth for item list, snapshot price, product name, product image, voucher discount, subtotal, and final total.
- Product data should prefer:
  - `productName`
  - `productImageUrl`
  - fallback to `product.name` and `product.imageUrl`

## API calls used by cart screen

- Cart screen currently calls `7` cart APIs and `1` menu API.

### Cart APIs actively called on cart screen

- `GET /api/carts/customer/:customerId`
  - Purpose: load active carts for the current customer.
  - Defined in `src/api/cart/cart.api.ts` via `getCartsByCustomerId`.
  - Called through `useCartsByCustomerQuery` in `src/pages/client/cart/useCart.ts`.

- `PUT /api/carts/:cartId`
  - Purpose: save cart-level `message`.
  - Defined in `src/api/cart/cart.api.ts` via `updateCart`.
  - Called through `useUpdateCartMutation` in `src/pages/client/cart/CartPage.tsx`.

- `DELETE /api/carts/items/:cartItemId`
  - Purpose: remove one cart item.
  - Defined in `src/api/cart/cart.api.ts` via `deleteCartItem`.
  - Called through `useDeleteCartItemMutation` in `src/pages/client/cart/useCart.ts`.

- `PATCH /api/carts/items/update-cart-item`
  - Purpose: update item quantity.
  - Defined in `src/api/cart/cart.api.ts` via `updateCartItem`.
  - Called through `useUpdateCartItemMutation` in `src/pages/client/cart/useCart.ts`.

- `PATCH /api/carts/items/update-cart-item`
  - Purpose: save item note.
  - Defined in `src/api/cart/cart.api.ts` via `updateCartItem`.
  - Called through `useUpdateCartItemMutation` in `src/pages/client/cart/useCart.ts`.

- `PUT /api/carts/:cartId/apply-voucher`
  - Purpose: apply voucher code to one shop cart.
  - Defined in `src/api/cart/cart.api.ts` via `applyVoucherInCart`.
  - Called through `useApplyVoucherInCartMutation` in `src/pages/client/cart/CartPage.tsx`.

- `DELETE /api/carts/:cartId/remove-voucher`
  - Purpose: remove voucher from one shop cart.
  - Defined in `src/api/cart/cart.api.ts` via `removeVoucherInCart`.
  - Called through `useRemoveVoucherInCartMutation` in `src/pages/client/cart/CartPage.tsx`.
  
- `PUT /api/carts/:cartId/cancel`
  - Purpose: cancel one whole shop cart.
  - Defined in `src/api/cart/cart.api.ts` via `cancelCart`.
  - Called through `useCancelCartMutation` in `src/pages/client/cart/CartPage.tsx`.

### Non-cart API still used inside cart UI

- `GET menu by franchise`
  - Purpose: resolve fallback product image and size label by `productFranchiseId`.
  - Defined in `src/api/client/product.api.ts` via `getMenuByFranchise`.
  - Called through `useGetMenuByFranchise` in `src/pages/client/cart/components/CartStoreSection.tsx`.

### Cart APIs defined but not called by cart screen right now

- `POST /api/carts/items/staff`
- `POST /api/carts/items`
  - Still used by add-to-cart flows outside the cart screen through `useCart().addItem(...)`.
- `GET /api/carts/:cartId`
- `GET /api/carts/customer/:customerId/count-cart`
- `GET /api/carts/:cartId/count-cart-item`
- `PATCH /api/carts/items/update-option`
- `PATCH /api/carts/items/remove-option`
- `PUT /api/carts/:cartId/checkout`

## Quantity flow

- Cart item quantity updates via `PATCH /api/carts/items/update-cart-item`.
- Cart item UI supports both `+/-` controls and direct numeric input by `cartItemId`.
- Direct input is committed on `blur` or `Enter`.
- Quantity `1` is the minimum.
- UI blocks negative values and normalizes `0` back to `1`.
- Delete item still uses `DELETE /api/carts/items/:cartItemId`.

## Cart note flow

- Item note editor is shown on each item row.
- Saving item note uses `updateCartItem({ cartItemId, quantity, note })`.
- Cart-level `message` is shown below the product list of each shop.
- Saving cart-level message uses `updateCart(cartId, { message })`.

## Cancel vs delete

- Delete one product: `deleteCartItem(cartItemId)`.
- Cancel the whole shop cart: `cancelCart(cartId)`.

## Totals

- Use `subtotalAmount` and `finalAmount` from cart API.
- If there is discount, show old subtotal with strikethrough and final amount as the active price.

## Voucher

- Voucher dialog is opened per shop cart.
- Apply voucher uses `PUT /api/carts/:cartId/apply-voucher`.
- Remove voucher uses `DELETE /api/carts/:cartId/remove-voucher`.
- Voucher selection on cart screen is manual code entry only.

## Not in scope in this state

- No option item quantity update/remove in cart UI.
- No voucher search inside cart screen.
