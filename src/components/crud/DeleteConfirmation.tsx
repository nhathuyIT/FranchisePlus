import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import type { FieldValues } from "react-hook-form";
import type { CrudConfig } from "@/lib/crud/types";
import { useCrudMutation } from "@/hooks/crud/useCrudMutation";

interface DeleteConfirmationProps<TEntity, TFormData extends FieldValues> {
  config: CrudConfig<TEntity, TFormData>;
  entity: TEntity | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Delete confirmation dialog
 * Shows warning message and delete/cancel buttons
 */
export function DeleteConfirmation<TEntity, TFormData extends FieldValues>({
  config,
  entity,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps<TEntity, TFormData>) {
  const { isSubmitting, handleDelete } = useCrudMutation(
    config,
    "delete",
    entity,
    onConfirm
  );

  const getMessage = () => {
    if (!entity) return "";

    const messageConfig = config.dialog?.deleteMessage;
    if (typeof messageConfig === "function") {
      return messageConfig(entity);
    }
    if (typeof messageConfig === "string") {
      return messageConfig;
    }

    // Default message
    const entityName = (entity as any).name || config.entityName;
    return `Are you sure you want to delete "${entityName}"? This action cannot be undone.`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
            Warning
          </h4>
          <p className="text-sm text-red-800 dark:text-red-200">
            {getMessage()}
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
