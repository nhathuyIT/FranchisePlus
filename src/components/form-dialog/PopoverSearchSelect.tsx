import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type PopoverSearchSelectOption = {
  value: string;
  label: React.ReactNode;
  searchText?: string;
  disabled?: boolean;
};

export interface PopoverSearchSelectProps {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;

  value?: string;
  onValueChange: (value: string) => void;
  options: PopoverSearchSelectOption[];

  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  minChars?: number;
  loadingText?: string;

  disabled?: boolean;
  isLoading?: boolean;

  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  resetSearchOnClose?: boolean;

  triggerClassName?: string;
  contentClassName?: string;
}

function normalizeForSearch(value: string) {
  return value.trim().toLowerCase();
}

export function PopoverSearchSelect({
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No options found",
  minChars = 0,
  loadingText = "Loading...",
  disabled = false,
  isLoading = false,
  open: openProp,
  onOpenChange,
  searchValue: searchValueProp,
  onSearchValueChange,
  resetSearchOnClose = true,
  triggerClassName,
  contentClassName,
}: PopoverSearchSelectProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [internalSearch, setInternalSearch] = React.useState("");

  const open = openProp ?? internalOpen;
  const searchValue = searchValueProp ?? internalSearch;

  const setOpen = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (openProp == null) setInternalOpen(next);
    },
    [onOpenChange, openProp]
  );

  const setSearch = React.useCallback(
    (next: string) => {
      onSearchValueChange?.(next);
      if (searchValueProp == null) setInternalSearch(next);
    },
    [onSearchValueChange, searchValueProp]
  );

  React.useEffect(() => {
    if (!open && resetSearchOnClose) {
      setSearch("");
    }
  }, [open, resetSearchOnClose, setSearch]);

  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = React.useMemo(() => {
    const normalizedSearch = normalizeForSearch(searchValue);
    if (minChars > 0 && normalizedSearch.length < minChars) return [];
    if (!normalizedSearch) return options;

    return options.filter((opt) => {
      const raw =
        opt.searchText ??
        (typeof opt.label === "string"
          ? opt.label
          : typeof opt.label === "number"
            ? String(opt.label)
            : "");
      return normalizeForSearch(raw).includes(normalizedSearch);
    });
  }, [options, searchValue, minChars]);

  const showMinCharsHint = minChars > 0 && normalizeForSearch(searchValue).length < minChars;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          id={id}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !selectedOption && "text-muted-foreground",
            triggerClassName
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        portalled
        className={cn(
          "w-[--radix-popover-trigger-width] min-w-[29rem] max-w-[calc(100vw-2rem)] p-0",
          contentClassName
        )}
      >
        <div className="border-b p-2">
          <Input
            value={searchValue}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9"
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div
          className="max-h-64 overflow-y-auto overscroll-contain p-1"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{loadingText}</span>
            </div>
          ) : showMinCharsHint ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least {minChars} characters to search
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </div>
          ) : (
            filteredOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    onValueChange(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50",
                    isSelected && "bg-accent text-accent-foreground"
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isSelected ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
