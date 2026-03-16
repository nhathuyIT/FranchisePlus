import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import * as voucherApi from "@/api/voucher/voucher.api";
import type {
  CreateVoucherRequest,
  UpdateVoucherRequest,
  VoucherSearchRequest,
  VoucherSearchResponse,
} from "@/api/voucher/voucher.api";

const VOUCHER_KEYS = {
  all: ["vouchers"] as const,
  search: (params: VoucherSearchRequest) => ["vouchers", params] as const,
  detail: (id: number | string) => ["vouchers", id] as const,
};

export const useVouchersQuery = (
  searchParams: VoucherSearchRequest,
): ReturnType<typeof useQuery<VoucherSearchResponse>> => {
  return useQuery({
    queryKey: VOUCHER_KEYS.search(searchParams),
    queryFn: () => voucherApi.searchVouchers(searchParams),
    placeholderData: keepPreviousData,
  });
};

export const useVoucherDetailQuery = (id: number | string, enabled = true) => {
  return useQuery({
    queryKey: VOUCHER_KEYS.detail(id),
    queryFn: () => voucherApi.getVoucher(id),
    enabled,
  });
};

export const useCreateVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVoucherRequest) => voucherApi.createVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHER_KEYS.all });
      toast.success("Voucher created successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to create voucher", {
        description: error.message,
      });
    },
  });
};

export const useUpdateVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateVoucherRequest;
    }) => voucherApi.updateVoucher(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHER_KEYS.all });
      toast.success("Voucher updated successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to update voucher", {
        description: error.message,
      });
    },
  });
};

export const useDeleteVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => voucherApi.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHER_KEYS.all });
      toast.success("Voucher deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete voucher", {
        description: error.message,
      });
    },
  });
};

export const useRestoreVoucherMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => voucherApi.restoreVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VOUCHER_KEYS.all });
      toast.success("Voucher restored successfully!");
    },
    onError: (error: Error) => {
      toast.error("Failed to restore voucher", {
        description: error.message,
      });
    },
  });
};
