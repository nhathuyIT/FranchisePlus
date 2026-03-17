You are a senior frontend architect. Build a production-ready React (TypeScript) page that integrates Shift and Shift Assignment APIs with the following requirements:

## CONTEXT
- System supports roles: get role from AuthStore
- APIs available: Shift + Shift Assignment
- UI must use a Dialog Form component pattern
- DO NOT use useMemo for mapping fields
- All form field configs must be stored in a local `/utils` folder

## PAGE STRUCTURE

### 1. HEADER (Franchise Selector)
- If role = ADMIN:
  - Show SelectBox (franchise_name)
  - Value = franchise_id
  - Fetch using franchise hook
- Else:
  - Auto use franchiseId from user role (no select)

---

### 2. MAIN LAYOUT (Split 7/10 - 3/10)

## LEFT PANEL (70%) → CALENDAR VIEW
- Data source: useGetAllShiftAssignByFranchiseQuery(franchiseId)
- Display:
  - Show calendar (monthly/weekly)
  - Each item = task label (ONLY taskName)

### INTERACTIONS
- Hover:
  - Show mini tooltip dialog:
    - shiftName
    - employeeName + avatar
    - status

- Click:
  - Open Dialog Form:
    Fields:
      - shiftName (readonly)
      - employeeName
      - workDate
      - startTime
      - endTime
      - status (dropdown: ASSIGNED | COMPLETED | ABSENT | CANCELED)
  - कार्रवाई:
    - Update status → useChangeShiftAssignmentStatusMutation

---

## RIGHT PANEL (30%)

### A. SHIFT LIST
- Fetch: useShiftSearchQuery
- Each item:
  - shiftName
  - time range
  - [Assign Button]

### ASSIGN FLOW
- Click "Assign" → Open Dialog Form

#### Fields (config in /utils):
- userIds (multi-select, filtered by franchiseId)
- workDate
- note (optional)

#### Logic:
- If 1 user → useAssignShiftForUserMutation
- If multiple users → useAssignShiftsForUserBulkMutation

---

### B. CREATE SHIFT
- Button at top-right
- Open Dialog Form

#### Fields:
- name
- start_time
- end_time
- franchise_id:
  - ADMIN → from select
  - others → auto

#### Submit:
- useCreateShiftMutation

---

### C. SEARCH BAR (TOP OF RIGHT PANEL)

3 modes:
1. By userName → useGetAllShiftsAssignByUserQuery
2. By shiftName → useGetAllShiftAssignByShiftIDQuery
3. By franchiseName → useGetAllShiftAssignByFranchiseQuery

---

## ARCHITECTURE RULES

### 1. Folder Structure

/pages/shifts
/components
/utils
shiftFields.ts
assignFields.ts
createShiftFields.ts
/hooks


### 2. Field Config Pattern (NO useMemo)
Example:

export const assignFields = [
{
name: "user_ids",
type: "multi-select",
label: "Employees",
},
...
];


### 3. Dialog Form
- Reusable component
- Accepts:
  - fields config
  - initialValues
  - onSubmit

### 4. State Management
- Use React Query hooks
- Keep logic separated from UI

---

## UX REQUIREMENTS
- Clean admin dashboard style
- Responsive split layout
- Smooth hover + click interactions
- Minimal but informative dialogs

---

## OUTPUT
- Full component structure
- Hooks integration
- Field config examples
- Dialog usage examples
- No pseudo-code — real TypeScript React code