import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import type { FieldValues } from "react-hook-form";
import type { CrudConfig, CrudMode } from "@/lib/crud/types";
import { useCrudForm } from "@/hooks/crud/useCrudForm";
import { useCrudMutation } from "@/hooks/crud/useCrudMutation";
import { renderField } from "./fields";

interface CrudFormProps<TEntity, TFormData extends FieldValues> {
  config: CrudConfig<TEntity, TFormData>;
  mode: CrudMode | null;
  entity: TEntity | null;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Dynamic form renderer for CRUD operations
 * Renders fields based on config and handles form submission
 */
export function CrudForm<TEntity, TFormData extends FieldValues>({
  config,
  mode,
  entity,
  onSuccess,
  onCancel,
}: CrudFormProps<TEntity, TFormData>) {
  const form = useCrudForm(config, mode, entity);
  const { isSubmitting, handleSubmit } = useCrudMutation(config, mode, entity, onSuccess);

  const isViewMode = mode === "view";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {config.fields.map((fieldConfig) => {
            // Handle conditional rendering
            const isHidden =
              typeof fieldConfig.hidden === "function"
                ? fieldConfig.hidden(form as any)
                : fieldConfig.hidden;

            if (isHidden) {
              return null;
            }

            // Disable all fields during submit
            return renderField(fieldConfig, form, isViewMode || isSubmitting);
          })}
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
          {!isViewMode && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "create" ? "Creating..." : "Updating..."}
                </>
              ) : (
                mode === "create" ? "Create" : "Update"
              )}
            </Button>
          )}
        </DialogFooter>
      </form>
    </Form>
  );
}
