import { useState } from "react";
import { toast } from "sonner";
import type { FieldValues } from "react-hook-form";
import type { CrudConfig, CrudMode, UseCrudMutationReturn } from "@/lib/crud/types";

/**
 * Parse API error to user-friendly message
 */
function getErrorMessage(error: unknown, entityName: string): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Common API errors
    if (message.includes("unique") || message.includes("duplicate")) {
      return `This ${entityName.toLowerCase()} already exists`;
    }
    if (message.includes("not found") || message.includes("404")) {
      return `${entityName} not found`;
    }
    if (message.includes("permission") || message.includes("forbidden") || message.includes("403")) {
      return `You don't have permission to perform this action`;
    }
    if (message.includes("unauthorized") || message.includes("401")) {
      return "Please login to continue";
    }
    if (message.includes("network") || message.includes("fetch")) {
      return "Network error. Please check your connection";
    }
    if (message.includes("timeout")) {
      return "Request timeout. Please try again";
    }

    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * Hook for handling CRUD mutations (create, update, delete)
 * Manages loading state and displays toast notifications
 */
export function useCrudMutation<TEntity, TFormData extends FieldValues>(
  config: CrudConfig<TEntity, TFormData>,
  mode: CrudMode | null,
  entity: TEntity | null,
  onSuccess: () => void
): UseCrudMutationReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TFormData) => {
    setIsSubmitting(true);
    try {
      if (mode === "create" && config.api.create) {
        const created = await config.api.create(data);
        toast.success(`${config.entityName} created successfully`);
        config.onSuccess?.create?.(created);
      } else if (mode === "update" && config.api.update && entity) {
        const id = (entity as any).id; // Assuming entities have 'id'
        const updated = await config.api.update(id, data);
        toast.success(`${config.entityName} updated successfully`);
        config.onSuccess?.update?.(updated);
      }

      onSuccess(); // Close dialog and refresh list
    } catch (error) {
      const action = mode === "create" ? "create" : "update";
      const errorMessage = getErrorMessage(error, config.entityName);

      toast.error(`Failed to ${action} ${config.entityName.toLowerCase()}`, {
        description: errorMessage,
      });
      console.error(`[CRUD ${mode}]`, error);

      // Don't close dialog on error - let user retry
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!entity || !config.api.delete) return;

    setIsSubmitting(true);
    try {
      const id = (entity as any).id;
      await config.api.delete(id);
      toast.success(`${config.entityName} deleted successfully`);
      config.onSuccess?.delete?.(id);
      onSuccess();
    } catch (error) {
      const errorMessage = getErrorMessage(error, config.entityName);

      toast.error(`Failed to delete ${config.entityName.toLowerCase()}`, {
        description: errorMessage,
      });
      console.error(`[CRUD delete]`, error);

      // Don't close dialog on error - let user retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit, handleDelete };
}
