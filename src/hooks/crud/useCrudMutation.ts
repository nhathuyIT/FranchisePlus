import { useState } from "react";
import { toast } from "sonner";
import type { FieldValues } from "react-hook-form";
import type { CrudConfig, CrudMode, UseCrudMutationReturn } from "@/lib/crud/types";

/**
 * Error type categorization for better UX
 */
type ErrorCategory =
  | "validation"
  | "duplicate"
  | "not_found"
  | "permission"
  | "auth"
  | "network"
  | "timeout"
  | "unknown";

interface ParsedError {
  category: ErrorCategory;
  message: string;
  technicalDetails?: string;
}

/**
 * Parse API error to user-friendly message with context
 */
function parseError(error: unknown, entityName: string, action: "create" | "update" | "delete"): ParsedError {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const technicalDetails = error.message;

    // Validation errors
    if (message.includes("validation") || message.includes("invalid")) {
      return {
        category: "validation",
        message: `Check your input - some fields have invalid values`,
        technicalDetails,
      };
    }

    // Duplicate/unique constraint errors
    if (message.includes("unique") || message.includes("duplicate") || message.includes("already exists")) {
      return {
        category: "duplicate",
        message: `A ${entityName.toLowerCase()} with this information already exists. Try different values.`,
        technicalDetails,
      };
    }

    // Not found errors
    if (message.includes("not found") || message.includes("404")) {
      return {
        category: "not_found",
        message: `${entityName} not found. It may have been deleted by another user.`,
        technicalDetails,
      };
    }

    // Permission errors
    if (message.includes("permission") || message.includes("forbidden") || message.includes("403")) {
      return {
        category: "permission",
        message: `You don't have permission to ${action} this ${entityName.toLowerCase()}. Contact your administrator.`,
        technicalDetails,
      };
    }

    // Auth errors
    if (message.includes("unauthorized") || message.includes("401") || message.includes("token")) {
      return {
        category: "auth",
        message: "Your session has expired. Please log in again.",
        technicalDetails,
      };
    }

    // Network errors
    if (message.includes("network") || message.includes("fetch") || message.includes("connection")) {
      return {
        category: "network",
        message: "Network error. Check your internet connection and try again.",
        technicalDetails,
      };
    }

    // Timeout errors
    if (message.includes("timeout") || message.includes("timed out")) {
      return {
        category: "timeout",
        message: "Request timed out. The server might be slow - please try again.",
        technicalDetails,
      };
    }

    // Unknown error with original message
    return {
      category: "unknown",
      message: error.message,
      technicalDetails,
    };
  }

  // Non-Error objects
  return {
    category: "unknown",
    message: "An unexpected error occurred. Please try again.",
    technicalDetails: String(error),
  };
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
        toast.success(`${config.entityName} created successfully`, {
          description: "Your changes have been saved.",
        });
        config.onSuccess?.create?.(created);
      } else if (mode === "update" && config.api.update && entity) {
        const id = (entity as any).id; // Assuming entities have 'id'
        const updated = await config.api.update(id, data);
        toast.success(`${config.entityName} updated successfully`, {
          description: "Your changes have been saved.",
        });
        config.onSuccess?.update?.(updated);
      }

      onSuccess(); // Close dialog and refresh list
    } catch (error) {
      const action = mode === "create" ? "create" : "update";
      const parsedError = parseError(error, config.entityName, action);

      toast.error(`Failed to ${action} ${config.entityName.toLowerCase()}`, {
        description: parsedError.message,
        duration: parsedError.category === "network" || parsedError.category === "timeout" ? 5000 : 4000,
      });

      // Log technical details for debugging
      console.error(`[CRUD ${mode}]`, {
        category: parsedError.category,
        message: parsedError.message,
        technical: parsedError.technicalDetails,
        originalError: error,
      });

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
      toast.success(`${config.entityName} deleted successfully`, {
        description: "The item has been permanently removed.",
      });
      config.onSuccess?.delete?.(id);
      onSuccess();
    } catch (error) {
      const parsedError = parseError(error, config.entityName, "delete");

      toast.error(`Failed to delete ${config.entityName.toLowerCase()}`, {
        description: parsedError.message,
        duration: parsedError.category === "network" || parsedError.category === "timeout" ? 5000 : 4000,
      });

      // Log technical details for debugging
      console.error(`[CRUD delete]`, {
        category: parsedError.category,
        message: parsedError.message,
        technical: parsedError.technicalDetails,
        originalError: error,
      });

      // Don't close dialog on error - let user retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit, handleDelete };
}
