import { z } from "zod";
import type { FranchiseSelectItem } from "@/api/franchise/franchise.type";
import type { FieldConfig } from "@/lib/form/field-config";

export const createShiftSchema = z
  .object({
    franchiseId: z.string().min(1, "Franchise is required."),
    name: z
      .string()
      .trim()
      .min(1, "Shift name is required.")
      .max(100, "Shift name must be 100 characters or fewer."),
    startTime: z.string().min(1, "Start time is required."),
    endTime: z.string().min(1, "End time is required."),
  })
  .refine(
    (values) => {
      if (!values.startTime || !values.endTime) {
        return true;
      }

      return values.endTime > values.startTime;
    },
    {
      path: ["endTime"],
      message: "End time must be later than start time.",
    },
  );

export type CreateShiftFormData = z.infer<typeof createShiftSchema>;

export const getCreateShiftFields = (
  franchiseOptions: FranchiseSelectItem[],
  currentFranchiseId: string,
): FieldConfig<CreateShiftFormData>[] => [
  {
    name: "franchiseId",
    type: "select",
    label: "Franchise",
    placeholder: "Select franchise",
    required: true,
    hidden: !!currentFranchiseId,
    options: franchiseOptions.map((franchise) => ({
      label: `${franchise.name} (${franchise.code})`,
      value: franchise.value,
    })),
    colSpan: 2,
  },
  {
    name: "name",
    type: "text",
    label: "Shift name",
    placeholder: "Morning Opening",
    required: true,
    colSpan: 2,
  },
  {
    name: "startTime",
    type: "time",
    label: "Start time",
    required: true,
  },
  {
    name: "endTime",
    type: "time",
    label: "End time",
    required: true,
  },
];
