# FranchisePlus Admin Design System Guide

## 📋 Overview

Admin dashboard design system cho FranchisePlus, dựa trên:
- **Pattern**: Data-Dense Dashboard
- **Colors**: Coffee Brown (#78350F) + Warm Gold (#FBBF24)
- **Typography**: Fira Sans (UI) + Fira Code (Data)
- **Stack**: React + Tailwind CSS

---

## 🎨 Color Palette

### Primary Colors (Coffee Brown)
```
bg-amber-900    #78350F  - Primary brand color
bg-amber-800    #92400E  - Hover states
```

### Secondary Colors (Warm Gold - CTAs)
```
bg-amber-400    #FBBF24  - Buttons, CTAs
bg-amber-500    #F59E0B  - Hover on CTAs
```

### Backgrounds & Accents
```
bg-amber-50     #FEF3C7  - Page background (light cream)
bg-amber-100    #FCD34D  - Card backgrounds, subtle highlights
text-amber-950  #451A03  - Body text (dark brown)
text-amber-700  #B45309  - Secondary text
```

### Status Colors
```
bg-green-600    - Success
bg-red-600      - Danger
bg-yellow-500   - Warning
bg-blue-500     - Info
```

---

## 🛠️ Using Theme Configuration

### Import Theme
```typescript
import { THEME, ADMIN_STYLES, getColor } from "@/config/theme.config";

// Get color
const primaryColor = getColor("colors.primary.900");

// Use predefined styles
const cardClassName = ADMIN_STYLES.card; // ✅ "bg-white rounded-lg..."
const inputClassName = ADMIN_STYLES.input; // ✅ "bg-white border border-amber-200..."
```

---

## 🧩 Using Admin UI Components

All components are in `src/components/admin/AdminUIComponents.tsx`

### FormInput (with label, error, helperText)
```tsx
import { FormInput } from "@/components/admin/AdminUIComponents";

export function MyForm() {
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");

  return (
    <FormInput
      id="full-name"
      label="Họ và Tên"
      placeholder="Nhập họ tên..."
      value={name}
      onChange={(e) => setName(e.target.value)}
      error={error ? "Tên không được để trống" : ""}
      helperText="Tên của người quản lý"
      required
    />
  );
}
```

**Features**:
- ✅ Proper `htmlFor` labels (accessibility)
- ✅ Built-in error messaging with icon
- ✅ Helper text support
- ✅ Focus states with amber highlight

### Button (with variants & loading)
```tsx
import { Button } from "@/components/admin/AdminUIComponents";
import { Save, Trash2 } from "lucide-react";

<Button variant="primary" size="md" icon={<Save size={18} />}>
  Lưu Thay Đổi
</Button>

<Button variant="danger" size="sm" icon={<Trash2 size={16} />}>
  Xóa
</Button>

<Button variant="secondary" loading>
  Đang xử lý...
</Button>
```

**Variants**:
- `primary` - Warm gold CTA buttons
- `secondary` - Light amber secondary actions
- `danger` - Red delete/destructive actions

**Sizes**: `sm` (12px), `md` (16px), `lg` (18px)

### Card (for grouping content)
```tsx
import { Card } from "@/components/admin/AdminUIComponents";
import { Users } from "lucide-react";

<Card title="Quản Lý Người Dùng" icon={<Users size={24} />}>
  <div className="space-y-4">
    {/* Card content */}
  </div>
</Card>
```

### Alert (for messages)
```tsx
import { Alert } from "@/components/admin/AdminUIComponents";

<Alert type="success">✓ Lưu thành công!</Alert>
<Alert type="error">✗ Có lỗi xảy ra. Vui lòng thử lại.</Alert>
<Alert type="warning">⚠ Hành động này không thể hoàn tác</Alert>
<Alert type="info">ℹ Có cập nhật mới khả dụng</Alert>
```

### Table (data-dense layout)
```tsx
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/admin/AdminUIComponents";

<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Tên</TableHeader>
      <TableHeader>Email</TableHeader>
      <TableHeader>Trạng Thái</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Badge variant="success">Hoạt Động</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

**Features**:
- ✅ Hover highlighting (subtle amber background)
- ✅ Horizontal scroll on mobile
- ✅ Compact padding (space-efficient)
- ✅ Sticky header

### Badge (for status/tags)
```tsx
import { Badge } from "@/components/admin/AdminUIComponents";

<Badge variant="success">Hoạt Động</Badge>
<Badge variant="warning">Chờ Xử Lý</Badge>
<Badge variant="error">Bị Khóa</Badge>
```

---

## 📐 Tailwind Color Classes

Direct mapping to design system:

### Text Colors
```
text-amber-950  → Body text (#451A03)
text-amber-900  → Headers
text-amber-700  → Secondary text
text-amber-600  → Links
text-white      → On dark backgrounds
```

### Background Colors
```
bg-amber-50     → Page background
bg-amber-100    → Card, subtle highlights
bg-amber-400    → CTA buttons
bg-amber-900    → Sidebar
```

### Border Colors
```
border-amber-200  → Subtle borders (light)
border-amber-800  → Dark borders
```

### Focus/Hover
```
focus:ring-amber-400      → Focus indicator
hover:bg-amber-500        → Button hover
hover:bg-amber-50         → Row hover
```

---

## ✅ Best Practices for Admin UI

### 1. Forms
```tsx
// ✅ DO: Use FormInput with labels
<FormInput 
  id="email"
  label="Email"
  type="email"
  required
/>

// ❌ DON'T: Use placeholder as only label
<input placeholder="Email" />
```

### 2. Icons
```tsx
// ✅ DO: Use SVG icons (Lucide, Heroicons)
import { Save, Trash2, Edit } from "lucide-react";
<Button icon={<Save size={18} />}>Save</Button>

// ❌ DON'T: Use emojis
<button>💾 Save</button>
```

### 3. Interactions
```tsx
// ✅ DO: Add cursor-pointer & smooth transitions
<div className="cursor-pointer hover:bg-amber-50 transition-colors duration-200">

// ❌ DON'T: No feedback on hover
<div className="hover:scale-105">  {/* Causes layout shift */}
```

### 4. Forms - React Pattern
```tsx
// ✅ DO: Controlled components
const [email, setEmail] = useState("");
<FormInput 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// ❌ DON'T: Uncontrolled refs
const inputRef = useRef();
<input ref={inputRef} />
```

### 5. Search/Filter
```tsx
// ✅ DO: Debounce search input
import { useDeferredValue } from "react";
const deferredSearchTerm = useDeferredValue(searchTerm);

// ❌ DON'T: Filter on every keystroke
useEffect(() => {
  // Filter immediately - causes performance issues
}, [searchInput]);
```

---

## 📱 Responsive Breakpoints

```
sm: 640px   - Small phones
md: 768px   - Tablets
lg: 1024px  - Laptops
xl: 1280px  - Desktops
2xl: 1536px - Large screens
```

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
```

---

## 🎯 Data-Dense Dashboard Tips

1. **Minimize padding**: Use `p-3`, `p-4` instead of `p-6`, `p-8`
2. **Compact spacing**: `gap-2`, `gap-3` for tight layouts
3. **Hover tooltips**: Show extra data on hover
4. **Multi-select**: Allow bulk operations
5. **Horizontal scroll**: Don't break tables on mobile, let them scroll

---

## 🧪 Testing Accessibility

### Keyboard Navigation
```bash
# Test with Tab, Shift+Tab, Enter, Space
# All buttons and inputs should be keyboard accessible
```

### Focus States
All interactive elements should have visible focus:
```css
focus:ring-2 focus:ring-amber-400
focus:outline-none
```

### Color Contrast
Text contrast should be ≥ 4.5:1 (WCAG AA)
- Body text (amber-950 on white): ✅ Pass
- Labels (amber-950 on white): ✅ Pass

### Screen Readers
Always include:
```tsx
<label htmlFor="input-id">Label text</label>
<FormInput id="input-id" />
```

---

## 📚 File References

- **Theme Config**: `src/config/theme.config.ts`
- **UI Components**: `src/components/admin/AdminUIComponents.tsx`
- **Admin Layout**: `src/layouts/admin/adminLayout.tsx`
- **Sidebar**: `src/layouts/admin/sidebar.tsx`

---

## 🚀 Next Steps

1. Update admin pages to use new `FormInput`, `Button`, `Card` components
2. Migrate data tables to use new `Table` component
3. Add more utility components as needed (Modal, Dropdown, etc.)
4. Implement dark mode variant if needed
5. Add animations for transitions (Framer Motion optional)

