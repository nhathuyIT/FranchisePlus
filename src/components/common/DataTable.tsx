import React, { useState, useMemo } from "react";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  X,
  Columns3,
  AlertCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Type Definitions
export interface ColumnFilter {
  id: string;
  type: "select" | "range" | "dateRange" | "search";
  label: string;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
}

export interface BulkAction<TData> {
  label: string;
  icon: LucideIcon;
  onClick: (selectedRows: TData[]) => void;
  variant?: "default" | "destructive";
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  initialPageSize?: number;
  // NEW PROPS - Phase 2
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  // NEW PROPS - Phase 3
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  bulkActions?: BulkAction<TData>[];
  columnFilters?: ColumnFilter[];
  onFilterChange?: (filters: ColumnFiltersState) => void;
  enableColumnVisibility?: boolean;
  defaultHiddenColumns?: string[];
  renderActions?: (row: TData) => React.ReactNode;
}

// Internal Components
const TableSkeleton = ({ rows }: { rows: number }) => (
  <>
    {Array.from({ length: rows }).map((_, index) => (
      <TableRow key={index}>
        <TableCell colSpan={100}>
          <Skeleton className="h-10 w-full" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const TableError = ({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="h-12 w-12 text-[#EF4444] mb-4" />
    <h3 className="text-lg font-semibold text-[#3E2723] mb-2">
      Something went wrong
    </h3>
    <p className="text-sm text-[#5D4037] mb-4 max-w-md">{error.message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    )}
  </div>
);

export function DataTable<TData>({
  columns: userColumns,
  data,
  searchable = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No results.",
  initialPageSize = 10,
  isLoading = false,
  error = null,
  onRetry,
  enableRowSelection = false,
  onRowSelectionChange,
  bulkActions = [],
  columnFilters: externalColumnFilters = [],
  onFilterChange,
  enableColumnVisibility = false,
  defaultHiddenColumns = [],
  renderActions,
}: DataTableProps<TData>) {
  // State Management
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultHiddenColumns.reduce(
      (acc, col) => ({ ...acc, [col]: false }),
      {} as VisibilityState
    )
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  // Add checkbox column if row selection is enabled
  const checkboxColumn: ColumnDef<TData> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Add actions column if renderActions is provided
  const actionsColumn: ColumnDef<TData> | null = renderActions
    ? {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">{renderActions(row.original)}</div>
        ),
      }
    : null;

  // Build final columns array
  const columns = useMemo(() => {
    const cols: ColumnDef<TData>[] = [];
    if (enableRowSelection) cols.push(checkboxColumn);
    cols.push(...userColumns);
    if (actionsColumn) cols.push(actionsColumn);
    return cols;
  }, [enableRowSelection, userColumns, renderActions]);

  // Table Instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater);
      if (onFilterChange) {
        const newFilters =
          typeof updater === "function" ? updater(columnFilters) : updater;
        onFilterChange(newFilters);
      }
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
      if (onRowSelectionChange) {
        const newSelection =
          typeof updater === "function" ? updater(rowSelection) : updater;
        const selectedRowIndices = Object.keys(newSelection).filter(
          (key) => newSelection[key]
        );
        const selectedRows = selectedRowIndices
          .map((index) => data[Number.parseInt(index)])
          .filter(Boolean);
        onRowSelectionChange(selectedRows);
      }
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Get selected rows
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  // Filter handlers with type conversion support
  const handleFilterChange = (filterId: string, value: string) => {
    if (value === "all" || value === "") {
      table.getColumn(filterId)?.setFilterValue(undefined);
    } else {
      // Convert "true"/"false" strings to boolean for boolean columns
      const column = table.getColumn(filterId);
      if (column) {
        // Check if the first row's value is boolean
        const firstRowValue = data[0]?.[filterId as keyof typeof data[0]];
        if (typeof firstRowValue === "boolean") {
          column.setFilterValue(value === "true");
        } else {
          column.setFilterValue(value);
        }
      }
    }
  };

  const clearAllFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
  };

  const hasActiveFilters = columnFilters.length > 0 || globalFilter !== "";

  // Helper function to get filter display label
  const getFilterLabel = (filterId: string, filterValue: unknown): string => {
    const filterConfig = externalColumnFilters.find((f) => f.id === filterId);
    if (!filterConfig) return String(filterValue);

    // For select type filters, find the matching option label
    if (filterConfig.type === "select" && filterConfig.options) {
      const option = filterConfig.options.find(
        (opt) => opt.value === String(filterValue)
      );
      if (option) return option.label;
    }

    // For boolean values (converted from string)
    if (typeof filterValue === "boolean") {
      return filterValue ? "Active" : "Inactive";
    }

    return String(filterValue);
  };

  // Pagination Info
  const startRow =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const endRow = Math.min(
    startRow + table.getState().pagination.pageSize - 1,
    table.getFilteredRowModel().rows.length
  );
  const totalRows = table.getFilteredRowModel().rows.length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5D4037]" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 border-[#E8DFD6] focus:border-[#6D4C41] focus:ring-[#6D4C41]"
            />
          </div>
        )}

        {/* Column Filters */}
        {externalColumnFilters.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
                {columnFilters.length > 0 && (
                  <Badge className="ml-1 bg-[#6D4C41] text-white rounded-full">
                    {columnFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-[#3E2723]">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="h-auto p-1 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {externalColumnFilters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <label className="text-sm font-medium text-[#5D4037]">
                      {filter.label}
                    </label>

                    {filter.type === "select" && filter.options && (
                      <Select
                        value={
                          (table.getColumn(filter.id)?.getFilterValue() as string) ||
                          "all"
                        }
                        onValueChange={(value) =>
                          handleFilterChange(filter.id, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${filter.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {filter.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {filter.type === "search" && (
                      <Input
                        placeholder={`Search ${filter.label}...`}
                        value={
                          (table.getColumn(filter.id)?.getFilterValue() as string) ||
                          ""
                        }
                        onChange={(e) =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Column Visibility Toggle */}
        {enableColumnVisibility && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Columns3 className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    column.getCanHide() && column.id !== "select" && column.id !== "actions"
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-[#5D4037]">Active filters:</span>
          {globalFilter && (
            <Badge
              variant="secondary"
              className="gap-1 bg-[#E8DFD6] text-[#3E2723]"
            >
              Search: {globalFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setGlobalFilter("")}
              />
            </Badge>
          )}
          {columnFilters.map((filter) => {
            const filterConfig = externalColumnFilters.find(
              (f) => f.id === filter.id
            );
            const displayLabel = getFilterLabel(filter.id, filter.value);

            return (
              <Badge
                key={filter.id}
                variant="secondary"
                className="gap-1 bg-[#E8DFD6] text-[#3E2723]"
              >
                {filterConfig?.label || filter.id}: {displayLabel}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    table.getColumn(filter.id)?.setFilterValue(undefined)
                  }
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Bulk Actions Toolbar */}
      {enableRowSelection && selectedRows.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-[#FAF8F5] border border-[#E8DFD6] rounded-lg animate-in slide-in-from-top-2">
          <span className="text-sm font-medium text-[#3E2723]">
            {selectedRows.length} row(s) selected
          </span>
          <div className="flex items-center gap-2">
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || "default"}
                size="sm"
                onClick={() => action.onClick(selectedRows)}
                className="gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.toggleAllRowsSelected(false)}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border-2 border-[#E8DFD6] bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gradient-to-r from-[#FAF8F5] to-[#F5F0EA] hover:from-[#FAF8F5] hover:to-[#F5F0EA] border-b-2 border-[#E8DFD6]"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-semibold text-[#3E2723]"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "flex items-center gap-2 cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4 text-[#6D4C41]" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4 text-[#6D4C41]" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 text-[#6D4C41] opacity-50" />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {/* Loading State */}
            {isLoading ? (
              <TableSkeleton rows={pagination.pageSize} />
            ) : /* Error State */ error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-[400px] text-center"
                >
                  <TableError error={error} onRetry={onRetry} />
                </TableCell>
              </TableRow>
            ) : /* Empty State */ table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[#5D4037]"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              /* Data Rows */
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-[#FAF8F5] transition-colors border-b border-[#E8DFD6]"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-[#5D4037]">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#5D4037]">Rows per page</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="w-[70px] border-[#E8DFD6]">
                <SelectValue placeholder={String(pagination.pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={String(pageSize)}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Info */}
          <div className="text-sm text-[#5D4037]">
            {totalRows === 0
              ? "No entries"
              : `Showing ${startRow}-${endRow} of ${totalRows} entries`}
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white disabled:opacity-50"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-[#5D4037] px-2">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="border-[#6D4C41] text-[#6D4C41] hover:bg-[#6D4C41] hover:text-white disabled:opacity-50"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
