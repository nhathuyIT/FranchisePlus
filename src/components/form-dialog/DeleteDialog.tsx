import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps<TEntity> {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the dialog should close */
  onOpenChange: (open: boolean) => void;
  /** The entity to delete */
  entity: TEntity | null;
  /** Entity name for display (e.g., "Franchise", "Product") */
  entityName: string;
  /** Called when delete is confirmed */
  onConfirm: () => void | Promise<void>;
  /** Whether delete is in progress */
  isDeleting?: boolean;
  /** Custom message function or static string */
  deleteMessage?: string | ((entity: TEntity) => string);
  /** Get display name from entity (defaults to entity.name) */
  getDisplayName?: (entity: TEntity) => string;
}

/**
 * Standalone delete confirmation dialog
 * Can be used without CrudConfig
 */
export function DeleteDialog<TEntity>({
  open,
  onOpenChange,
  entity,
  entityName,
  onConfirm,
  isDeleting = false,
  deleteMessage,
  getDisplayName,
}: DeleteDialogProps<TEntity>) {
  const [isConfirming, setIsConfirming] = React.useState(false);

  const getMessage = (): string => {
    if (!entity) return "";

    if (typeof deleteMessage === "function") {
      return deleteMessage(entity);
    }
    if (typeof deleteMessage === "string") {
      return deleteMessage;
    }

    // Default message
    const displayName = getDisplayName
      ? getDisplayName(entity)
      : (entity as Record<string, unknown>).name ?? entityName;

    return `Are you sure you want to delete "${displayName}"? This action cannot be undone.`;
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  const handleClose = () => {
    if (!isConfirming && !isDeleting) {
      onOpenChange(false);
    }
  };

  const isPending = isDeleting || isConfirming;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {entityName}</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
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
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
