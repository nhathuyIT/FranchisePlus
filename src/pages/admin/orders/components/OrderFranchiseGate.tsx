import { AlertCircle, Store } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FranchiseOption {
  value: string;
  name: string;
  code: string;
}

interface OrderFranchiseGateProps {
  canSelectFranchise: boolean;
  isLoadingFranchises: boolean;
  franchiseOptions: FranchiseOption[];
  activeFranchiseId: string;
  activeFranchiseName?: string;
  onSelectFranchise: (value: string) => void;
}

export function OrderFranchiseGate({
  canSelectFranchise,
  isLoadingFranchises,
  franchiseOptions,
  activeFranchiseId,
  activeFranchiseName,
  onSelectFranchise,
}: OrderFranchiseGateProps) {
  return (
    <div className="mb-6 rounded-2xl border border-[#E8DFD6] bg-white p-4 shadow-lg">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="mt-2 text-xl font-semibold text-[#3E2723]">
            {canSelectFranchise ? "Choose a franchise to load orders" : ""}
          </h2>
        </div>

        {canSelectFranchise ? (
          <div className="w-full max-w-md">
            <Select
              value={activeFranchiseId || undefined}
              onValueChange={onSelectFranchise}
            >
              <SelectTrigger className="border-[#E8DFD6] bg-white">
                <SelectValue
                  placeholder={
                    isLoadingFranchises
                      ? "Loading franchises..."
                      : "Select a franchise"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {franchiseOptions.map((franchise) => (
                  <SelectItem key={franchise.value} value={franchise.value}>
                    {franchise.name}
                    {franchise.code ? ` (${franchise.code})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="flex min-w-64 items-start gap-3 rounded-2xl border border-[#E8DFD6] bg-[#FAF8F5] px-4 py-3">
            <Store className="mt-0.5 h-5 w-5 text-[#8D6E63]" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A7B67]">
                Active Franchise
              </p>
              <p className="mt-1 text-sm font-semibold text-[#3E2723]">
                {activeFranchiseName || activeFranchiseId || "Unavailable"}
              </p>
            </div>
          </div>
        )}
      </div>

      {!activeFranchiseId && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#F2D6C9] bg-[#FFF7F2] px-4 py-3 text-sm text-[#7A271A]">
          <AlertCircle className="mt-0.5 h-4 w-4 text-[#C2410C]" />
          <p>
            Select a franchise first. The order list API stays disabled until
            the page has a valid franchise context.
          </p>
        </div>
      )}
    </div>
  );
}
