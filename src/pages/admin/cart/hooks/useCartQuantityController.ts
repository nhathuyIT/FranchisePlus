import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseCartQuantityControllerProps {
  serverQuantity: number;
  onCommit: (quantity: number) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
  debounceMs?: number;
}

export interface CartQuantityController {
  draftQuantity: string;
  currentQuantity: number;
  confirmDeleteOpen: boolean;
  isSubmitting: boolean;
  setConfirmDeleteOpen: (open: boolean) => void;
  cancelScheduledCommit: () => void;
  handleInputChange: (value: string) => void;
  handleInputBlur: () => void;
  handleInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;
}

const normalizeQuantity = (value: number) =>
  Math.max(1, Number.isFinite(value) ? Math.trunc(value) : 1);

export const useCartQuantityController = ({
  serverQuantity,
  onCommit,
  onDelete,
  debounceMs = 500,
}: UseCartQuantityControllerProps): CartQuantityController => {
  const normalizedServerQuantity = normalizeQuantity(serverQuantity);
  const serverQuantityRef = useRef(normalizedServerQuantity);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [draftQuantity, setDraftQuantity] = useState(
    String(normalizedServerQuantity),
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancelScheduledCommit = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const rollbackToServer = useCallback(() => {
    setDraftQuantity(String(serverQuantityRef.current));
  }, []);

  useEffect(() => {
    serverQuantityRef.current = normalizedServerQuantity;
    setDraftQuantity(String(normalizedServerQuantity));
  }, [normalizedServerQuantity]);

  useEffect(() => {
    return () => {
      cancelScheduledCommit();
    };
  }, [cancelScheduledCommit]);

  const currentQuantity = useMemo(() => {
    const parsedQuantity = Number.parseInt(draftQuantity, 10);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return serverQuantityRef.current;
    }

    return parsedQuantity;
  }, [draftQuantity]);

  const commitQuantity = useCallback(
    async (quantity: number) => {
      cancelScheduledCommit();

      const nextQuantity = Math.trunc(quantity);
      if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
        rollbackToServer();
        return false;
      }

      if (nextQuantity === serverQuantityRef.current) {
        setDraftQuantity(String(nextQuantity));
        return true;
      }

      setIsSubmitting(true);

      try {
        const wasSaved = await onCommit(nextQuantity);
        if (!wasSaved) {
          rollbackToServer();
          return false;
        }

        setDraftQuantity(String(nextQuantity));
        return true;
      } catch {
        rollbackToServer();
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [cancelScheduledCommit, onCommit, rollbackToServer],
  );

  const scheduleCommit = useCallback(
    (quantity: number) => {
      cancelScheduledCommit();

      timeoutRef.current = setTimeout(() => {
        void commitQuantity(quantity);
      }, debounceMs);
    },
    [cancelScheduledCommit, commitQuantity, debounceMs],
  );

  const openDeleteConfirm = useCallback(() => {
    cancelScheduledCommit();

    if (!onDelete) {
      rollbackToServer();
      return;
    }

    setDraftQuantity("0");
    setConfirmDeleteOpen(true);
  }, [cancelScheduledCommit, onDelete, rollbackToServer]);

  const commitFromInput = useCallback(async () => {
    cancelScheduledCommit();

    if (draftQuantity === "") {
      rollbackToServer();
      return;
    }

    if (!/^\d+$/.test(draftQuantity)) {
      rollbackToServer();
      return;
    }

    const parsedQuantity = Number.parseInt(draftQuantity, 10);

    if (!Number.isFinite(parsedQuantity)) {
      rollbackToServer();
      return;
    }

    if (parsedQuantity <= 0) {
      openDeleteConfirm();
      return;
    }

    setDraftQuantity(String(parsedQuantity));

    if (parsedQuantity === serverQuantityRef.current) {
      return;
    }

    await commitQuantity(parsedQuantity);
  }, [
    cancelScheduledCommit,
    commitQuantity,
    draftQuantity,
    openDeleteConfirm,
    rollbackToServer,
  ]);

  const handleInputChange = useCallback((value: string) => {
    if (/^\d*$/.test(value)) {
      setDraftQuantity(value);
    }
  }, []);

  const handleIncrement = useCallback(() => {
    if (isSubmitting) return;

    const nextQuantity = currentQuantity + 1;
    setDraftQuantity(String(nextQuantity));
    scheduleCommit(nextQuantity);
  }, [currentQuantity, isSubmitting, scheduleCommit]);

  const handleDecrement = useCallback(() => {
    if (isSubmitting) return;

    const nextQuantity = currentQuantity - 1;
    if (nextQuantity <= 0) {
      openDeleteConfirm();
      return;
    }

    setDraftQuantity(String(nextQuantity));
    scheduleCommit(nextQuantity);
  }, [currentQuantity, isSubmitting, openDeleteConfirm, scheduleCommit]);

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (["-", "+", ".", ",", "e", "E"].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "Enter") {
        event.preventDefault();
        void commitFromInput();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        rollbackToServer();
      }
    },
    [commitFromInput, rollbackToServer],
  );

  const handleConfirmDelete = useCallback(async () => {
    cancelScheduledCommit();

    if (!onDelete) {
      setConfirmDeleteOpen(false);
      rollbackToServer();
      return;
    }

    setIsSubmitting(true);

    try {
      const wasDeleted = await onDelete();
      if (!wasDeleted) {
        rollbackToServer();
      }
    } catch {
      rollbackToServer();
    } finally {
      setIsSubmitting(false);
      setConfirmDeleteOpen(false);
    }
  }, [cancelScheduledCommit, onDelete, rollbackToServer]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteOpen(false);
    rollbackToServer();
  }, [rollbackToServer]);

  return {
    draftQuantity,
    currentQuantity,
    confirmDeleteOpen,
    isSubmitting,
    setConfirmDeleteOpen,
    cancelScheduledCommit,
    handleInputChange,
    handleInputBlur: () => {
      void commitFromInput();
    },
    handleInputKeyDown,
    handleIncrement,
    handleDecrement,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
