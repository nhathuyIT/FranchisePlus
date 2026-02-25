import { useState, useCallback } from "react";
import type { CrudDialogState, UseCrudDialogReturn } from "@/lib/crud/types";

/**
 * Hook for managing CRUD dialog state
 * Handles opening/closing dialog and switching between modes
 */
export function useCrudDialog<TEntity = any>(): UseCrudDialogReturn<TEntity> {
  const [state, setState] = useState<CrudDialogState<TEntity>>({
    isOpen: false,
    mode: null,
    entity: null,
  });

  const openCreate = useCallback(() => {
    setState({ isOpen: true, mode: "create", entity: null });
  }, []);

  const openUpdate = useCallback((entity: TEntity) => {
    setState({ isOpen: true, mode: "update", entity });
  }, []);

  const openView = useCallback((entity: TEntity) => {
    setState({ isOpen: true, mode: "view", entity });
  }, []);

  const openDelete = useCallback((entity: TEntity) => {
    setState({ isOpen: true, mode: "delete", entity });
  }, []);

  const close = useCallback(() => {
    setState({ isOpen: false, mode: null, entity: null });
  }, []);

  return { state, openCreate, openUpdate, openView, openDelete, close };
}
