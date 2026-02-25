import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Mail, Phone, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import type { User } from "@/types/user.type";
import { useAuthStore } from "@/stores/auth-store";

interface EditProfileDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type EditableField = "name" | "email" | "phone";

interface FieldConfig {
  key: EditableField;
  label: string;
  icon: typeof UserIcon;
  type: string;
  placeholder: string;
}

const EDITABLE_FIELDS: FieldConfig[] = [
  {
    key: "name",
    label: "Full Name",
    icon: UserIcon,
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    key: "email",
    label: "Email Address",
    icon: Mail,
    type: "email",
    placeholder: "Enter your email",
  },
  {
    key: "phone",
    label: "Phone Number",
    icon: Phone,
    type: "tel",
    placeholder: "Enter your phone number",
  },
];

export const EditProfileDialog = ({
  user,
  open,
  onOpenChange,
}: EditProfileDialogProps) => {
  const { updateProfile } = useAuthStore();
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (field: EditableField) => {
    setEditingField(field);
    setEditValue((field === "phone" ? user.phone || "" : user[field]) ?? "");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleSaveField = (field: EditableField) => {
    const trimmed = editValue.trim();

    if (field === "name" && !trimmed) {
      toast.error("Name cannot be empty");
      return;
    }
    if (field === "email" && !trimmed) {
      toast.error("Email cannot be empty");
      return;
    }
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const updatedData: Partial<Pick<User, "name" | "email" | "phone">> = {
      [field]: field === "phone" && !trimmed ? null : trimmed,
    };

    updateProfile(updatedData);
    setEditingField(null);
    setEditValue("");
    toast.success(
      `${EDITABLE_FIELDS.find((f) => f.key === field)?.label} updated successfully`,
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: EditableField,
  ) => {
    if (e.key === "Enter") {
      handleSaveField(field);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl border-[#E8E0D8]">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-[#3E2723]">
            Edit Personal Information
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8D6E63]">
            Click the pencil icon on any field to edit it
          </DialogDescription>
        </DialogHeader>

        <div className="divide-y divide-[#F5F0EB]">
          {EDITABLE_FIELDS.map((field) => {
            const isEditing = editingField === field.key;
            const currentValue =
              field.key === "phone"
                ? user.phone || "Not provided"
                : user[field.key];

            return (
              <div
                key={field.key}
                className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAF8F5] transition-colors"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#EFEBE9] flex items-center justify-center">
                  <field.icon className="w-5 h-5 text-[#6D4C41]" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#A1887F] font-medium uppercase tracking-wider mb-1">
                    {field.label}
                  </p>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type={field.type}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, field.key)}
                        placeholder={field.placeholder}
                        className="h-8 text-sm border-[#D7CCC8] focus-visible:border-[#6D4C41] focus-visible:ring-[#6D4C41]/20"
                        autoFocus
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0 h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleSaveField(field.key)}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="shrink-0 h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-[#3E2723] truncate">
                      {currentValue}
                    </p>
                  )}
                </div>

                {!isEditing && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0 h-9 w-9 rounded-full text-[#A1887F] hover:text-[#6D4C41] hover:bg-[#EFEBE9]"
                    onClick={() => handleStartEdit(field.key)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-6 pt-2">
          <p className="text-xs text-[#A1887F] text-center">
            Press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-[#EFEBE9] text-[#5D4037] font-mono text-[10px]">
              Enter
            </kbd>{" "}
            to save or{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-[#EFEBE9] text-[#5D4037] font-mono text-[10px]">
              Esc
            </kbd>{" "}
            to cancel
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
