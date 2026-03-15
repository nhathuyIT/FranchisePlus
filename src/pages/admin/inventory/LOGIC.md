# Inventory Module Logic

## 1. Scope

This document summarizes the logic inside `src/pages/admin/inventory`.

Covered files:

- `index.tsx`
- `low-stock-alert.tsx`
- `inventory-form.config.ts`
- `columns/*`
- `components/*`
- `context/*`
- `hooks/*`

It also references direct external dependencies that control data flow:

- `src/hooks/inventory/useInventory.hooks.ts`
- `src/api/inventory/inventory.api.ts`
- `src/api/inventory/inventory.type.ts`
- `src/hooks/common/useDebounce.ts`

## 2. High-Level Responsibilities

The inventory module currently has 2 main screens:

1. `index.tsx`: Inventory Management list
2. `low-stock-alert.tsx`: Low Stock Alert list

Main capabilities:

- View inventory items
- Filter by franchise
- Search by product/franchise name
- Add new inventory item
- Adjust stock with dialog
- Delete inventory item
- Inline edit quantity and alert threshold directly in table
- Export inventory to Excel
- Review low-stock items
- Export selected low-stock rows to CSV

There is also import-preview code prepared in the folder, but it is not currently mounted into the main inventory page.

## 3. Main Data Model

Primary display model is `InventorySearchItem`.

Important fields used by the UI:

- `id`
- `productFranchiseId`
- `productName`
- `franchiseName`
- `quantity`
- `alertThreshold`
- `updatedAt`

This type comes from the search API and is richer than the base inventory entity because it already contains joined product/franchise names.

## 4. API Layer Used By This Module

Main API file: `src/api/inventory/inventory.api.ts`

Used endpoints:

1. `search()`
   - `POST /api/inventories/search`
   - Used by both inventory list and low-stock screen

2. `create()`
   - `POST /api/inventories`
   - Used by "Add Item" dialog

3. `adjust()`
   - `POST /api/inventories/adjust`
   - Used by adjust dialog
   - Used by inline table editing
   - Used by low-stock page update action

4. `remove()`
   - `DELETE /api/inventories/:id`
   - Used by delete flow

## 5. Query / Cache Flow

React Query hooks are defined in `src/hooks/inventory/useInventory.hooks.ts`.

### 5.1 Scope key

Both screens build an `inventoryScopeKey` from auth context:

- `user.id`
- `currentRoleId`
- `currentFranchiseId`

Purpose:

- Separate cache between user contexts
- Avoid stale inventory data when role/franchise changes

### 5.2 Inventory list query

`index.tsx` uses `useInventorySearch(...)` with:

- `isDeleted: false`
- optional `franchiseId`
- fixed pagination `{ pageNum: 1, pageSize: 100 }`

Important note:

- Franchise filter is server-side
- Product search is client-side because current API has no keyword field for this screen

### 5.3 Low-stock query

`low-stock-alert.tsx` uses `useInventories(...)`, which is a convenience wrapper over `useInventorySearch(...)`.

Then low-stock filtering is done on the client:

- Low stock: `quantity <= alertThreshold`
- Critical: `(quantity / alertThreshold) * 100 <= 50`

## 6. Inventory Management Page Logic (`index.tsx`)

### 6.1 Permission gates

Permissions are read from `useAuthStore()`:

- `VIEW_INVENTORY`
- `MANAGE_INVENTORY`

Effects:

- Without `VIEW_INVENTORY`, query is disabled and table receives empty data
- Without `MANAGE_INVENTORY`, add/edit/delete/inline-save actions are disabled

### 6.2 Local UI state

Main state on this page:

- `selectedFranchiseId`
- `productNameQuery`
- `deleteTarget`
- dialog state from `useFormDialog()`

### 6.3 Search and filtering

Two filtering layers exist:

1. Server-side:
   - `selectedFranchiseId`
   - passed into `useInventorySearch`

2. Client-side:
   - `productNameQuery`
   - debounced by `useDebounce(..., 300, productNameQuery)`
   - filters by:
     - `item.productName`
     - `item.franchiseName`

### 6.4 Add item flow

Trigger:

- Click `Add Item`

Flow:

1. Open `FormDialog`
2. Use schema `addInventorySchema`
3. Use field config `addInventoryFields`
4. Submit calls `inventoryApi.create(...)`
5. On success:
   - show success toast
   - close dialog
   - refetch list

### 6.5 Adjust stock dialog flow

Trigger:

- Click edit action on a row

Flow:

1. Open `adjustDialog` with selected row
2. Dialog title/description are derived from current item
3. Use schema `adjustInventorySchema`
4. Submit calls `inventoryApi.adjust(...)`
5. Payload includes:
   - `productFranchiseId`
   - `change`
   - `alertThreshold`
   - `reason`
6. On success:
   - show success toast
   - close dialog
   - refetch list

### 6.6 Delete flow

Trigger:

- Click delete action on a row

Flow:

1. Store row in `deleteTarget`
2. Open `DeleteDialog`
3. Confirm calls `useDeleteInventory().mutateAsync(id)`
4. On success:
   - show success toast
   - clear `deleteTarget`
   - refetch list

### 6.7 Inline edit flow

Inline editing is handled through the table, not through row-level immediate API calls.

Flow:

1. Table renders `InlineEditCell` for:
   - `quantity`
   - `alertThreshold`
2. User changes one or more cells
3. Local form state becomes dirty
4. Save bar appears
5. User clicks `Save Changes`
6. Dirty rows are validated
7. For each dirty row, page-level `handleSaveRow(...)` is called
8. `handleSaveRow(...)` converts quantity edit into delta:
   - `delta = newQuantity - oldQuantity`
9. Save uses `inventoryApi.adjust(...)`
10. After all rows complete:
    - success toast per row
    - table refetches from server

Important behavior:

- If only threshold changes, API still uses `adjust()` with `change: 0`
- If nothing changed, save is skipped for that row

## 7. Inventory Table Logic (`components/InventoryTable.tsx`)

This component combines:

- `DataTable`
- React Hook Form
- inline validation
- export
- save/discard UX

### 7.1 Excel export

`InventoryTable` uses `useExcelExport(...)`.

Before export, each item is flattened by `flattenInventoryItem(...)`.

Export behavior:

- Exports current `items` prop
- Shows success/error toast

### 7.2 Inline edit state

The table uses `useInventoryInlineEdit(...)` to create a form with a `rows[]` structure.

Returned helpers:

- `methods`
- `fieldIndexMap`
- `collectErrors()`
- `isRowDirty()`
- `hasDirtyRows`
- `saveAllChanges()`

### 7.3 Validation banner

`InventoryErrorBanner` displays all current row validation errors.

Rules:

- Ordered by row index
- `quantity` appears before `alertThreshold`
- Can collapse
- Can dismiss temporarily

### 7.4 Save bar

`SaveBar` appears when:

- there is at least one dirty row, or
- save is in progress

Actions:

- `Discard` -> `methods.reset()`
- `Save Changes` -> `saveAllChanges()`

### 7.5 Row highlighting

Visual row background:

- `quantity === 0` -> red
- `quantity <= alertThreshold` -> amber
- otherwise normal

This is purely UI highlighting and is separate from table filtering.

### 7.6 Table actions

If callbacks are provided:

- Edit button calls `onEdit(item)`
- Delete button calls `onDelete(item)`

### 7.7 Table filter config

The table defines a column filter named `status` with values:

- `in_stock`
- `low_stock`
- `out_of_stock`

Actual filtering logic lives in `columns/inventory.columns.tsx`.

## 8. Inline Edit Internals

### 8.1 Hook: `useInventoryInlineEdit`

This hook is the core of batch inline editing.

#### Form schema

Each row contains:

- `inventoryId`
- `productName`
- `productFranchiseId`
- `quantity`
- `alertThreshold`

Validation:

- `quantity >= 0`
- `alertThreshold >= 0`
- both must be numbers

#### Default values

Default form values are built from the current `items` prop.

The hook intentionally resets when relevant server data changes so the form always reflects the latest fetched values after refetch/save.

#### `fieldIndexMap`

Maps:

- `inventoryId -> form row index`

This allows static table column definitions to locate the correct form field for any rendered item.

#### Error collection

`collectErrors()` converts React Hook Form error objects into UI-friendly entries:

- `rowIndex`
- `productName`
- `field`
- `message`

#### Dirty tracking

`isRowDirty()` checks if `quantity` or `alertThreshold` changed for a specific row.

`hasDirtyRows` checks whether any row has pending changes.

#### Save all

`saveAllChanges()`:

1. triggers form validation
2. finds dirty rows
3. reads latest values from form
4. calls `onSaveRow(...)` for each dirty row
5. runs saves in parallel with `Promise.all`

### 8.2 Context: `InventoryInlineEditContext`

This context lets cell components access form state without prop drilling.

Exposed values:

- `control`
- `errors`
- `fieldIndexMap`
- `isRowDirty`
- `isEditable`

### 8.3 Cell renderer: `InlineEditCell`

Behavior:

1. Resolve row index using `fieldIndexMap[item.id]`
2. If row is missing, render plain text fallback
3. If inline editing is disabled, render plain text
4. Otherwise render controlled numeric input

Input specifics:

- empty string becomes `NaN`
- validation error is then handled by Zod / RHF
- error state changes border and background color

## 9. Column Logic

### 9.1 Main inventory columns

Defined in `columns/inventory.columns.tsx`.

Columns:

- Product
- Franchise
- Quantity
- Threshold
- Status
- Last Updated

Special behavior:

- `Quantity` and `Threshold` use `InlineEditCell`
- `Status` column uses `StockStatusBadge`
- `Status` column also contains custom filter logic

Status filter rules:

- `out_of_stock`: `quantity === 0`
- `low_stock`: `quantity > 0 && percentage <= 100`
- `in_stock`: `percentage > 100`

Where:

- `percentage = (quantity / alertThreshold) * 100`

### 9.2 Low-stock columns

Defined in `columns/low-stock.columns.tsx`.

Columns:

- Product
- Franchise
- Current
- Threshold
- Shortage
- Status

`Shortage` is computed as:

- `alertThreshold - quantity`

## 10. Low Stock Page Logic (`low-stock-alert.tsx`)

### 10.1 Data derivation

This page fetches all inventory items first, then derives:

- `lowStockItems = quantity <= alertThreshold`
- `criticalItems = lowStockItems where percentage <= 50`

### 10.2 Stats cards

`InventoryStatsCards` displays:

- total low stock
- critical items
- warning items

Where:

- `warningItems = totalLowStock - criticalItems`

### 10.3 Update stock flow

The update button reuses the same adjust dialog and same `inventoryApi.adjust(...)` endpoint as the main inventory page.

### 10.4 Bulk export flow

Low-stock export is implemented locally in the page as CSV generation:

1. build headers
2. map selected rows to CSV lines
3. create `Blob`
4. create object URL
5. trigger browser download
6. revoke object URL

Filename format:

- `low-stock-alert-YYYY-MM-DD.csv`

## 11. Form Configuration (`inventory-form.config.ts`)

This file provides declarative field definitions for `FormDialog`.

### 11.1 Adjust form

Fields:

- `change`
- `alertThreshold`
- `reason`

Used for:

- stock adjustment dialog on main page
- stock adjustment dialog on low-stock page

### 11.2 Add form

Fields:

- `productFranchiseId`
- `quantity`
- `alertThreshold`

`productFranchiseId` is an async select:

- calls `searchProductFranchises(...)`
- searches product-franchise combinations
- returns label/value options for the dialog

## 12. Import Preview Code Present In Folder

### 12.1 `components/InventoryImportPreview.tsx`

This component is already fairly complete, but it is not currently mounted in `index.tsx`.

Main responsibilities:

- parse preview rows into typed inventory import rows
- compare imported rows with existing inventory
- mark changed fields
- detect duplicate rows inside the import file
- merge file validation errors with duplicate errors
- allow selecting only valid rows
- confirm selected rows back to parent

Visual states:

- new row
- updated row
- unchanged row
- duplicate/error row

### 12.2 `hooks/useUpdateInventoryFromExcel.ts`

This file is currently empty, so the Excel import update flow is not implemented in this folder yet.

## 13. Important Separation Of Concerns

Current design is split cleanly:

1. Page components
   - permissions
   - query wiring
   - dialog wiring
   - API action orchestration

2. Table components
   - rendering
   - save/discard UX
   - export
   - table-specific filtering

3. Hook
   - inline form state
   - validation
   - dirty tracking
   - batch save preparation

4. Context
   - bridge form state into static cell definitions

5. API layer
   - endpoint mapping
   - request formatting

## 14. Current End-to-End Flows Summary

### Flow A: View inventory list

1. Check permissions
2. Build scope key
3. Fetch inventory search result
4. Apply client-side keyword filter
5. Render table

### Flow B: Add inventory item

1. Open add dialog
2. Pick product-franchise
3. Submit create API
4. Refetch list

### Flow C: Adjust stock from dialog

1. Open adjust dialog from row
2. Enter change / threshold / reason
3. Submit adjust API
4. Refetch list

### Flow D: Inline batch edit

1. Edit quantity/threshold in cells
2. Form becomes dirty
3. Error banner updates live if invalid
4. Save bar appears
5. Save all dirty rows
6. Each row calls adjust API
7. Refetch list

### Flow E: Delete row

1. Open delete confirmation
2. Call delete mutation
3. Refetch list

### Flow F: Review low stock

1. Fetch all inventory
2. Derive low-stock items
3. Render stats + low-stock table
4. Optionally update stock or export selected rows

## 15. Practical Notes

Some behaviors worth remembering when maintaining this module:

1. Product keyword search is client-side, not API-side.
2. Inline editing saves in batch, not per cell blur.
3. Quantity updates are persisted as delta via `adjust()`, not as absolute overwrite.
4. Threshold updates are also routed through `adjust()`.
5. Import preview code exists, but import execution is not wired up here yet.
6. Low-stock screen currently derives low stock from the general inventory list instead of using the dedicated franchise low-stock endpoint.
