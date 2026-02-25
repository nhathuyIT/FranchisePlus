import { AlertCircle } from "lucide-react";
import type { FieldErrors, FieldValues } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormErrorSummaryProps<TFormData extends FieldValues> {
  errors: FieldErrors<TFormData>;
  fieldLabels: Record<string, string>; // Map field names to user-friendly labels
}

/**
 * Form-level error summary component
 * Displays all validation errors in one place for better UX
 */
export function FormErrorSummary<TFormData extends FieldValues>({
  errors,
  fieldLabels,
}: FormErrorSummaryProps<TFormData>) {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>
        {errorEntries.length === 1
          ? "1 field needs attention"
          : `${errorEntries.length} fields need attention`}
      </AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {errorEntries.map(([fieldName, error]: [string, any]) => {
            const label = fieldLabels[fieldName] || fieldName;
            const message = error?.message || "Invalid value";

            return (
              <li key={fieldName} className="text-sm">
                <span className="font-medium">{label}:</span> {message}
              </li>
            );
          })}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
