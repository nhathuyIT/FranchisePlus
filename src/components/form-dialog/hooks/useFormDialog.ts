import { useState, useCallback } from "react";
import type { UseFormDialogReturn, FormDialogMode } from "../types";

/**
 * Hook for managing FormDialog state
 *
 * @example
 * ```tsx
 * const dialog = useFormDialog<User>();
 *
 * // Open in create mode
 * dialog.openCreate();
 *
 * // Open in edit mode with data
 * dialog.openEdit(user);
 *
 * // In JSX
 * <FormDialog
 *   open={dialog.isOpen}
 *   onOpenChange={(open) => !open && dialog.close()}
 *   mode={dialog.mode}
 *   values={dialog.data}
 *   ...
 * />
 * ```
 */
export function useFormDialog<TData = unknown>(): UseFormDialogReturn<TData> {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<FormDialogMode>("create");
  const [data, setData] = useState<TData | null>(null);

  const open = useCallback((newMode: FormDialogMode, newData?: TData) => {
    setMode(newMode);
    setData(newData ?? null);
    setIsOpen(true);
  }, []);

  const openCreate = useCallback(() => {
    setMode("create");
    setData(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((editData: TData) => {
    setMode("edit");
    setData(editData);
    setIsOpen(true);
  }, []);

  const openView = useCallback((viewData: TData) => {
    setMode("view");
    setData(viewData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing data to allow for exit animation
    setTimeout(() => {
      setData(null);
    }, 200);
  }, []);

  return {
    isOpen,
    mode,
    data,
    open,
    openCreate,
    openEdit,
    openView,
    close,
  };
}
