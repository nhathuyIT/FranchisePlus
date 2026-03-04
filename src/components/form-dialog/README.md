# FormDialog Component

A reusable, type-safe form dialog component with React Hook Form + Zod integration.

## Features

- **Generic type support** - Full TypeScript inference from Zod schema to form fields
- **Dynamic field rendering** - Configure fields with `FieldConfig[]` instead of hardcoded JSX
- **API error mapping** - Server errors automatically display at field level
- **Create/Edit/View modes** - Built-in support for common form scenarios
- **Performance optimized** - Memoized field components to minimize re-renders

## Quick Start

```tsx
import * as z from "zod";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";

// 1. Define your schema
const userSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "user"]),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

// 2. Define field configurations
const userFields: FieldConfig<UserFormData>[] = [
  { name: "name", type: "text", label: "Name", required: true },
  { name: "email", type: "text", label: "Email", required: true },
  {
    name: "role",
    type: "select",
    label: "Role",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
  },
  { name: "isActive", type: "checkbox", label: "Active", defaultValue: true },
];

// 3. Use in component
function UsersPage() {
  const dialog = useFormDialog<User>();

  const handleSubmit = async (data: UserFormData) => {
    if (dialog.mode === "edit") {
      await updateUser(dialog.data.id, data);
    } else {
      await createUser(data);
    }
  };

  return (
    <>
      <Button onClick={dialog.openCreate}>Add User</Button>

      <FormDialog<UserFormData>
        open={dialog.isOpen}
        onOpenChange={(open) => !open && dialog.close()}
        title={dialog.mode === "create" ? "Create User" : "Edit User"}
        schema={userSchema}
        fields={userFields}
        values={dialog.data}
        mode={dialog.mode}
        onSubmit={handleSubmit}
        onSuccess={dialog.close}
      />
    </>
  );
}
```

## Field Types

| Type | Description | Extra Props |
|------|-------------|-------------|
| `text` | Text input | - |
| `textarea` | Multi-line text | `rows` |
| `number` | Numeric input | `min`, `max`, `step` |
| `select` | Dropdown select | `options` |
| `async-select` | Async loading select | `asyncOptions` |
| `multiselect` | Multiple selection | `options` |
| `checkbox` | Single checkbox | - |
| `switch` | Toggle switch | - |
| `radio` | Radio group | `options` |
| `date` | Date picker | - |
| `time` | Time picker | - |
| `datetime` | Date + time picker | - |
| `image-upload` | Image upload | `accept` |
| `file-upload` | File upload | `accept` |
| `custom` | Custom render | `render` |

## API Error Mapping

The component automatically maps API errors to form fields:

```tsx
// API Response
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Email already exists" },
    { "field": "code", "message": "Code must be unique" }
  ]
}

// Errors display at respective fields automatically!
```

## Conditional Fields

Show/hide fields based on other values:

```tsx
const fields: FieldConfig<MyForm>[] = [
  { name: "hasAddress", type: "checkbox", label: "Add Address" },
  {
    name: "address",
    type: "text",
    label: "Address",
    hidden: (form) => !form.watch("hasAddress"),
  },
];
```

## Custom Field Rendering

```tsx
const fields: FieldConfig<MyForm>[] = [
  {
    name: "avatar",
    type: "custom",
    label: "Avatar",
    render: ({ field, disabled }) => (
      <AvatarPicker
        value={field.value}
        onChange={field.onChange}
        disabled={disabled}
      />
    ),
  },
];
```

## Async Select Field

```tsx
const fields: FieldConfig<MyForm>[] = [
  {
    name: "categoryId",
    type: "async-select",
    label: "Category",
    asyncOptions: {
      loader: async (search) => {
        const categories = await searchCategories(search);
        return categories.map((c) => ({ label: c.name, value: c.id }));
      },
      debounceMs: 300,
      minChars: 2,
    },
  },
];
```

## Props Reference

### FormDialog Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Dialog open state |
| `onOpenChange` | `(open: boolean) => void` | required | Open state handler |
| `title` | `string` | required | Dialog title |
| `description` | `string` | - | Optional description |
| `schema` | `z.ZodType<T>` | required | Zod validation schema |
| `fields` | `FieldConfig<T>[]` | required | Field configurations |
| `defaultValues` | `DefaultValues<T>` | - | Default form values |
| `values` | `T` | - | Edit mode values |
| `mode` | `"create" \| "edit" \| "view"` | `"create"` | Form mode |
| `onSubmit` | `(data: T) => Promise<SubmitResult \| void>` | required | Submit handler |
| `onSuccess` | `() => void` | - | Success callback |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"lg"` | Dialog size |
| `columns` | `1 \| 2` | `1` | Field grid columns |

### FieldConfig Props

| Prop | Type | Description |
|------|------|-------------|
| `name` | `Path<T>` | Field name (type-safe) |
| `type` | `FieldType` | Field type |
| `label` | `string` | Display label |
| `placeholder` | `string` | Input placeholder |
| `description` | `string` | Help text |
| `required` | `boolean` | Show required indicator |
| `defaultValue` | `T[name]` | Default value |
| `disabled` | `boolean \| (form) => boolean` | Disabled state |
| `hidden` | `boolean \| (form) => boolean` | Hidden state |
| `options` | `SelectOption[]` | Select/radio options |
| `colSpan` | `1 \| 2` | Grid column span |
| `render` | `(props) => ReactNode` | Custom render (type="custom") |

## Hooks

### useFormDialog

```tsx
const dialog = useFormDialog<Entity>();

dialog.isOpen; // boolean
dialog.mode; // "create" | "edit" | "view"
dialog.data; // Entity | null

dialog.openCreate(); // Open in create mode
dialog.openEdit(entity); // Open in edit mode with data
dialog.openView(entity); // Open in view mode (readonly)
dialog.close(); // Close dialog
```

### DeleteDialog

Standalone delete confirmation dialog:

```tsx
import { DeleteDialog } from "@/components/form-dialog";

const [deleteTarget, setDeleteTarget] = useState<Entity | null>(null);

<DeleteDialog
  open={!!deleteTarget}
  onOpenChange={(open) => !open && setDeleteTarget(null)}
  entity={deleteTarget}
  entityName="User"
  onConfirm={async () => {
    await deleteUser(deleteTarget.id);
    setDeleteTarget(null);
  }}
  isDeleting={isDeleting}
  deleteMessage={(entity) => `Delete "${entity.name}"? This cannot be undone.`}
/>
```

### FormContent

Standalone form component (without dialog wrapper):

```tsx
import { FormContent } from "@/components/form-dialog";

<FormContent
  schema={userSchema}
  fields={userFields}
  defaultValues={{ role: "user" }}
  onSubmit={handleSubmit}
  onSuccess={handleSuccess}
  columns={2}
/>
```

### useFormSubmit

Low-level hook for custom form handling:

```tsx
const { isSubmitting, generalError, handleSubmit, clearGeneralError } =
  useFormSubmit({
    form,
    onSubmit: async (data) => {
      await api.create(data);
    },
    onSuccess: () => {
      toast.success("Created!");
    },
  });
```

## Migration from Inline Forms

Before:

```tsx
const [isOpen, setIsOpen] = useState(false);
const [editing, setEditing] = useState<Entity | null>(null);
const { register, handleSubmit, reset, setValue, formState } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});

// Lots of manual form JSX...
```

After:

```tsx
const dialog = useFormDialog<Entity>();

<FormDialog
  open={dialog.isOpen}
  onOpenChange={(open) => !open && dialog.close()}
  title={dialog.mode === "create" ? "Create" : "Edit"}
  schema={schema}
  fields={fields}
  values={dialog.data}
  mode={dialog.mode}
  onSubmit={handleSubmit}
  onSuccess={dialog.close}
/>
```

## File Structure

```
form-dialog/
├── index.ts                 # Main exports
├── types.ts                 # TypeScript types & interfaces
├── FormDialog.tsx           # Main dialog component
├── FormContent.tsx          # Standalone form body
├── DeleteDialog.tsx         # Delete confirmation dialog
├── FormErrorBanner.tsx      # Error display banner
├── FormFooter.tsx           # Submit/Cancel buttons
├── hooks/
│   ├── index.ts
│   ├── useFormDialog.ts     # Dialog state management
│   └── useFormSubmit.ts     # Form submission with error mapping
└── fields/
    ├── index.ts             # Field exports
    ├── render-field.tsx     # Dynamic field renderer
    ├── TextField.tsx
    ├── SelectField.tsx
    └── ... (other field components)
```

## Exports

```tsx
// Components
import {
  FormDialog,
  FormContent,
  DeleteDialog,
  FormErrorBanner,
  FormFooter,
} from "@/components/form-dialog";

// Hooks
import { useFormDialog, useFormSubmit } from "@/components/form-dialog";

// Field components (for custom layouts)
import {
  TextField,
  SelectField,
  CheckboxField,
  // ... etc
  renderField,
  getFieldColSpanClass,
} from "@/components/form-dialog";

// Types
import type {
  FormDialogProps,
  FormDialogMode,
  SubmitResult,
  UseFormDialogReturn,
} from "@/components/form-dialog";

// Field config types (from lib)
import type { FieldConfig, FieldType, SelectOption } from "@/lib/form/field-config";
```
