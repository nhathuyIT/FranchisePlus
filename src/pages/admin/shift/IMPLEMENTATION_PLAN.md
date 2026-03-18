# Shift Feature Implementation Plan

## 1. Current Repo State

- `shift.md` is a feature spec, not an implementation.
- `/admin/shifts` is already registered in `src/router/admin/admin.menu.tsx`, but the target module `@/pages/admin/shift/Shift.page` does not exist yet.
- `src/pages/admin/shift/` exists and is currently empty, so this feature is effectively missing.
- The current git worktree already contains deleted shift files from an older implementation attempt. Those files can be reviewed from git history, but they should not be restored as-is because they do not fully match `shift.md` or the current hook/layout expectations.
- Existing building blocks already available in the repo:
  - Auth/context: `useAuthStore()` with `isAdmin()`, `getCurrentRole()`, `authUser.currentFranchiseId`
  - Franchise selector data: `useFranchiseSelect()`
  - Shift data: `useShiftSearchQuery()`, `useShiftByFranchiseQuery()`, `useCreateShiftMutation()`
  - Shift assignment data: `useGetAllShiftAssignByFranchiseQuery()`, `useGetAllShiftsAssignByUserQuery()`, `useGetAllShiftAssignByShiftIDQuery()`, `useAssignShiftForUserMutation()`, `useAssignShiftsForUserBulkMutation()`, `useChangeShiftAssignmentStatusMutation()`
  - Employee-franchise mapping: `useUserFranchiseRoleSearch()`
  - Reusable dialog form system: `FormDialog`, `useFormDialog`, `FieldConfig`

## 2. Repo-Specific Constraints To Design Around

- No calendar package is installed. Month/week calendar views should be implemented with native `Date`, existing UI primitives, and CSS grid.
- `shift.md` requires field configs in a local `/utils` folder. For this feature, keep all shift form field arrays under `src/pages/admin/shift/utils/`.
- The assignment mutation only changes `status`. In the assignment detail dialog, `shiftName`, `employeeName`, `workDate`, `startTime`, and `endTime` should be display-only fields; only `status` is editable.
- Current assignment response does not contain `shiftName` or employee avatar. The page needs a client-side enrichment layer:
  - shift map keyed by `shiftId`
  - user map keyed by `userId`
- Search APIs accept IDs, not names:
  - user mode needs name -> `userId` resolution before `useGetAllShiftsAssignByUserQuery`
  - shift mode needs name -> `shiftId` resolution before `useGetAllShiftAssignByShiftIDQuery`
  - franchise mode needs name -> `franchiseId` resolution before `useGetAllShiftAssignByFranchiseQuery`
- `useGetAllShiftsAssignByUserQuery(userId, date)` requires a date. The user-search mode should be scoped to the current calendar anchor date or selected work date.

## 3. Recommended File Structure

- `src/pages/admin/shift/Shift.page.tsx`
- `src/pages/admin/shift/components/ShiftCalendar.tsx`
- `src/pages/admin/shift/components/ShiftCalendarToolbar.tsx`
- `src/pages/admin/shift/components/ShiftAssignmentTooltip.tsx`
- `src/pages/admin/shift/components/ShiftAssignmentDialog.tsx`
- `src/pages/admin/shift/components/ShiftListPanel.tsx`
- `src/pages/admin/shift/components/AssignShiftDialog.tsx`
- `src/pages/admin/shift/components/CreateShiftDialog.tsx`
- `src/pages/admin/shift/components/ShiftSearchBar.tsx`
- `src/pages/admin/shift/hooks/useShiftPageData.ts`
- `src/pages/admin/shift/hooks/useShiftCalendarState.ts`
- `src/pages/admin/shift/utils/shiftFields.ts`
- `src/pages/admin/shift/utils/assignFields.ts`
- `src/pages/admin/shift/utils/createShiftFields.ts`
- `src/pages/admin/shift/utils/shiftFormatters.ts`
- `src/lib/schemas/shift.schema.ts`
- `src/lib/schemas/shift-assignment.schema.ts`

## 4. Data Orchestration Plan

### 4.1 Franchise Context

- Read auth state from `useAuthStore()`.
- If `isAdmin()` is true:
  - render a franchise `Select`
  - source options from `useFranchiseSelect()`
  - selected value is local page state
- Otherwise:
  - use `authUser.currentFranchiseId`
  - hide the selector and show the active franchise as read-only context text/badge

### 4.2 Base Queries

- Active franchise shifts:
  - use `useShiftSearchQuery`
  - params:
    - `searchCondition.franchise_id = franchiseId`
    - `searchCondition.is_deleted = false`
    - `pageInfo = { pageNum: 1, pageSize: 100 }`
- Calendar assignments:
  - use `useGetAllShiftAssignByFranchiseQuery(franchiseId)`
- Employee options for assign dialog:
  - use `useUserFranchiseRoleSearch`
  - filter by `franchiseId`
  - optionally restrict to franchise-scoped roles if needed later
- User details for avatar/name enrichment:
  - use `useUserSearch({ searchCondition: { isDeleted: false }, pageInfo: { pageNum: 1, pageSize: 1000 } })`
  - filter client-side to the employee IDs returned by the franchise-role query

### 4.3 Enriched View Model

- Build a `shiftById` dictionary from shift search results.
- Build a `userById` dictionary from user search results.
- Normalize calendar items into a single UI shape, for example:

```ts
type CalendarAssignmentEvent = {
  id: string;
  shiftId: string;
  shiftName: string;
  taskName: string;
  userId: string;
  employeeName: string;
  employeeAvatarUrl: string | null;
  workDate: string;
  startTime: string;
  endTime: string;
  status: ShiftAssignmentStatus;
  note: string;
};
```

- `taskName` for the calendar should be `shiftName` because the spec says the event label must only show the task name.
- Tooltip and dialogs should consume the enriched object, not raw API responses.

## 5. UI Plan

### 5.1 Page Shell

- Use the same admin-page structure already used by inventory and user pages:
  - `PageHeader` at top
  - centered `max-w-7xl` container
  - rounded white content surface
- Main layout:
  - `lg:grid lg:grid-cols-10`
  - left calendar panel `lg:col-span-7`
  - right utility panel `lg:col-span-3`

### 5.2 Left Panel: Calendar View

- Build a lightweight calendar with two modes:
  - month
  - week
- `ShiftCalendarToolbar` responsibilities:
  - toggle month/week mode
  - previous/next period navigation
  - jump back to today
- `ShiftCalendar` responsibilities:
  - calculate visible days
  - group enriched assignment events by `workDate`
  - render day cells and event chips
  - show only `taskName` inside each event chip
- Hover interaction:
  - use `Popover` or hover card style UI
  - show `shiftName`, employee avatar + name, and status
- Click interaction:
  - open `ShiftAssignmentDialog`
  - dialog uses `FormDialog`
  - display-only fields:
    - `shiftName`
    - `employeeName`
    - `workDate`
    - `startTime`
    - `endTime`
  - editable field:
    - `status`
  - submit via `useChangeShiftAssignmentStatusMutation`

### 5.3 Right Panel

- Top section: search bar
- Middle section: shift list with assign action
- Top-right action: create shift button

## 6. Search Bar Plan

### 6.1 User Mode

- Input/search against employee names from the already loaded employee list.
- Resolve the chosen user to `userId`.
- Call `useGetAllShiftsAssignByUserQuery(userId, activeDate)`.
- Show result set in the calendar by replacing the default franchise assignment dataset while the filter is active.

### 6.2 Shift Mode

- Search shifts by name using the shift query result already loaded for the current franchise.
- Resolve the chosen shift to `shiftId`.
- Call `useGetAllShiftAssignByShiftIDQuery(shiftId)`.
- Show returned assignments in the calendar.

### 6.3 Franchise Mode

- For admin:
  - search/select a franchise from `useFranchiseSelect()`
  - call `useGetAllShiftAssignByFranchiseQuery(franchiseId)`
- For non-admin:
  - this mode can default to the current franchise only

## 7. Dialog and Form Plan

### 7.1 Create Shift

- Trigger button in the right panel header.
- Schema goes in `src/lib/schemas/shift.schema.ts`.
- Field config goes in `src/pages/admin/shift/utils/createShiftFields.ts`.
- Required fields:
  - `name`
  - `start_time`
  - `end_time`
  - `franchise_id`
- Behavior:
  - admin can choose franchise
  - non-admin gets franchise injected from auth context
- Submit with `useCreateShiftMutation()`.

### 7.2 Assign Shift

- Triggered from `[Assign]` button on each shift card.
- Schema goes in `src/lib/schemas/shift-assignment.schema.ts`.
- Field config goes in `src/pages/admin/shift/utils/assignFields.ts`.
- Required fields:
  - `userIds`
  - `workDate`
  - `note` optional
- Behavior:
  - `userIds` uses `multiselect` because `FieldConfig` supports `multiselect`, not `multi-select`
  - options are employees filtered by franchise
- Submit branching:
  - 1 selected user -> `useAssignShiftForUserMutation`
  - multiple users -> `useAssignShiftsForUserBulkMutation`

### 7.3 Assignment Detail / Status Update

- Schema can live in `src/lib/schemas/shift-assignment.schema.ts`.
- Field config goes in `src/pages/admin/shift/utils/shiftFields.ts`.
- The dialog should treat non-status values as read-only presentation fields.
- Submit only sends:

```ts
{
  shiftAssignmentId,
  data: { status }
}
```

## 8. Suggested Execution Order

1. Create the missing `Shift.page.tsx` with page shell and franchise context handling.
2. Add schemas and local field-config files in `/utils`.
3. Implement `useShiftPageData.ts` to load shifts, assignments, employees, and build enriched UI models.
4. Implement `ShiftCalendarToolbar` and `ShiftCalendar` with month/week support.
5. Implement `ShiftAssignmentDialog` and wire status updates.
6. Implement `ShiftListPanel` and `AssignShiftDialog`.
7. Implement `CreateShiftDialog`.
8. Implement `ShiftSearchBar` with name-to-ID resolution and filtered calendar results.
9. Add loading, empty, and error states for each panel.
10. Run lint/build and fix type errors.

## 9. Validation Checklist

- `/admin/shifts` route loads without module-not-found errors.
- Admin sees franchise selector; non-admin does not.
- Calendar renders month and week modes.
- Event chips show only shift name/task name.
- Hover tooltip shows shift name, employee name, avatar, and status.
- Clicking an event opens a dialog and updates assignment status successfully.
- Shift list loads for the active franchise.
- Assigning one employee uses the single mutation.
- Assigning multiple employees uses the bulk mutation.
- Creating a shift refreshes the shift list and calendar enrichment.
- Search modes switch the calendar dataset correctly.
- Field configs are stored only in `src/pages/admin/shift/utils/`.

## 10. Known Risks / Gaps

- The spec asks for user-name search, but the existing API requires `userId` plus `date`. The UI must explicitly resolve a user and scope results to the active date.
- The hover card requires avatar and shift name, but assignment APIs do not return both fields together. The enrichment layer is required for parity with the spec.
- Without a calendar dependency, month/week rendering logic will be custom code. Keep it isolated in `ShiftCalendar` plus date helpers so it stays testable and replaceable later.
