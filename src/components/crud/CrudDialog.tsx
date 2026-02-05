import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { FieldValues } from "react-hook-form";
import type { CrudConfig, UseCrudDialogReturn } from "@/lib/crud/types";
import { CrudForm } from "./CrudForm";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface CrudDialogProps<TEntity, TFormData extends FieldValues> {
  config: CrudConfig<TEntity, TFormData>;
  dialog: UseCrudDialogReturn<TEntity>;
  onSuccess: () => void; // Callback to refresh DataTable
}

/**
 * Main CRUD dialog component
 * Handles Create, Update, View, and Delete operations
 */
export function CrudDialog<TEntity, TFormData extends FieldValues>({
  config,
  dialog,
  onSuccess,
}: CrudDialogProps<TEntity, TFormData>) {
  const { state, close } = dialog;
  const { mode, entity } = state;

  const getTitle = () => {
    switch (mode) {
      case "create":
        return config.dialog?.createTitle || `Create ${config.entityName}`;
      case "update":
        return config.dialog?.updateTitle || `Update ${config.entityName}`;
      case "view":
        return config.dialog?.viewTitle || `View ${config.entityName}`;
      case "delete":
        return config.dialog?.deleteTitle || `Delete ${config.entityName}`;
      default:
        return "";
    }
  };

  const getSizeClass = () => {
    const size = config.dialog?.size || "lg";
    const sizeMap = {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      full: "sm:max-w-full",
    };
    return sizeMap[size];
  };

  return (
    <Dialog open={state.isOpen} onOpenChange={close}>
      <DialogContent className={getSizeClass()}>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        {mode === "delete" ? (
          <DeleteConfirmation
            config={config}
            entity={entity}
            onConfirm={() => {}}
            onCancel={close}
          />
        ) : (
          <CrudForm
            config={config}
            mode={mode}
            entity={entity}
            onSuccess={onSuccess}
            onCancel={close}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
