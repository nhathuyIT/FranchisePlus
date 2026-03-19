import { useMemo } from "react";
import { FormDialog } from "@/components/form-dialog";
import { useFranchiseSelect } from "@/hooks/franchise";
import { useAddProductToCartByStaffMutation } from "@/hooks/cart/useCart.hook";
import type { CartLookupUser } from "../types";
import {
  addCartSchema,
  buildAddCartFields,
  type AddCartFormData,
} from "../add-cart-form.config";

interface AddCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: CartLookupUser | null;
  onCreated?: (cartId: string) => void;
}

export const AddCartDialog = ({
  open,
  onOpenChange,
  selectedUser,
  onCreated,
}: AddCartDialogProps) => {
  const { data: franchiseSelectItems = [] } = useFranchiseSelect();
  const addCartMutation = useAddProductToCartByStaffMutation();

  const franchiseOptions = useMemo(
    () =>
      franchiseSelectItems.map((item) => ({
        label: item.name,
        value: item.value,
      })),
    [franchiseSelectItems],
  );

  const fields = useMemo(
    () => buildAddCartFields(franchiseOptions),
    [franchiseOptions],
  );

  const defaultValues = useMemo<AddCartFormData>(
    () => ({
      customerId: selectedUser?.id ?? "",
      franchiseId: "",
      productFranchiseId: "",
      quantity: 1,
      address: "",
      phone: selectedUser?.phone ?? "",
      note: "",
      message: "",
      options: [],
    }),
    [selectedUser],
  );

  return (
    <FormDialog<AddCartFormData>
      open={open}
      onOpenChange={onOpenChange}
      title="Add Cart"
      description={
        selectedUser
          ? `Create a new active cart for ${selectedUser.name}.`
          : "Select a user first before creating a cart."
      }
      size="xl"
      schema={addCartSchema}
      fields={fields}
      defaultValues={defaultValues}
      mode="create"
      submitText="Add Cart"
      columns={2}
      onSubmit={async (data) => {
        if (!selectedUser?.id) {
          return {
            success: false,
            error: "Select a user before creating a cart.",
          };
        }

        const normalizedOptions =
          data.options?.filter(
            (option) => option.productFranchiseId && option.quantity > 0,
          ) ?? [];

        const response = await addCartMutation.mutateAsync({
          ...data,
          customerId: selectedUser.id,
          options: normalizedOptions.length > 0 ? normalizedOptions : undefined,
        });

        onCreated?.(response.id);
      }}
    />
  );
};
