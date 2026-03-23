import { useEffect, useMemo, useState } from "react";
import type { CartResponse, UpdateCartRequest } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditCartCartFormProps {
  cart: CartResponse;
  isSaving: boolean;
  onSave: (data: UpdateCartRequest) => Promise<boolean>;
}

type CartFormDraft = {
  address: string;
  phone: string;
  note: string;
  message: string;
};

const buildDraft = (cart: CartResponse): CartFormDraft => ({
  address: cart.address ?? "",
  phone: cart.phone ?? "",
  note: cart.note ?? "",
  message: cart.message ?? "",
});

export const EditCartCartForm = ({
  cart,
  isSaving,
  onSave,
}: EditCartCartFormProps) => {
  const [draft, setDraft] = useState<CartFormDraft>(() => buildDraft(cart));

  useEffect(() => {
    setDraft(buildDraft(cart));
  }, [cart]);

  const originalDraft = useMemo(() => buildDraft(cart), [cart]);
  const isDirty =
    draft.address !== originalDraft.address ||
    draft.phone !== originalDraft.phone ||
    draft.note !== originalDraft.note ||
    draft.message !== originalDraft.message;

  return (
    <section className="rounded-2xl border border-[#E8DFD6] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#3E2723]">
            Cart Information
          </p>
          <p className="mt-1 text-sm text-[#8D6E63]">
            Update cart-level contact and note fields.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving || !isDirty}
            onClick={() => setDraft(originalDraft)}
            className="border-[#E8DFD6] text-[#6D4C41]"
          >
            Reset
          </Button>
          <Button
            type="button"
            disabled={isSaving || !isDirty}
            onClick={() => {
              void onSave({
                address: draft.address.trim(),
                phone: draft.phone.trim(),
                note: draft.note.trim(),
                message: draft.message.trim(),
              });
            }}
            className="bg-[#6D4C41] text-white hover:bg-[#5D4037]"
          >
            {isSaving ? "Saving..." : "Save cart info"}
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#5D4037]">
            Phone
          </label>
          <Input
            value={draft.phone}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
            placeholder="Customer phone"
            className="border-[#E8DFD6]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5D4037]">
            Address
          </label>
          <Input
            value={draft.address}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
            placeholder="Delivery address"
            className="border-[#E8DFD6]"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#5D4037]">
            Cart note
          </label>
          <Textarea
            rows={3}
            value={draft.note}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                note: event.target.value,
              }))
            }
            placeholder="Internal cart note"
            className="border-[#E8DFD6] bg-white"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#5D4037]">
            Message
          </label>
          <Textarea
            rows={3}
            value={draft.message}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                message: event.target.value,
              }))
            }
            placeholder="Message for this cart"
            className="border-[#E8DFD6] bg-white"
          />
        </div>
      </div>
    </section>
  );
};
