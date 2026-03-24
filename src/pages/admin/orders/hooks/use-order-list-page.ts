/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "@/router/route.const";
import type { AdminOrderStatus } from "../models/order-management.type";
import { useOrderFranchiseContext } from "./use-order-franchise-context";
import {
  useFranchiseOrdersQuery,
  useStaffDeliveryOrdersQuery,
} from "./use-order-management-query";
import {
  ORDER_STATUS_FILTERS,
  filterOrderList,
} from "../utils/order-management.utils";

export const useOrderListPage = () => {
  const navigate = useNavigate();
  const franchiseContext = useOrderFranchiseContext();
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "all">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const franchiseOrdersQuery = useFranchiseOrdersQuery(
    {
      franchiseId: franchiseContext.activeFranchiseId,
      status: statusFilter === "all" ? "" : statusFilter,
    },
    franchiseContext.hasFranchiseSelected,
  );

  const staffOrdersQuery = useStaffDeliveryOrdersQuery(
    {
      franchiseId: franchiseContext.activeFranchiseId || undefined,
      staffId: franchiseContext.currentStaffId || undefined,
      status: statusFilter === "all" ? "" : statusFilter,
    },
    franchiseContext.isStaff && franchiseContext.hasListContext,
  );

  const ordersQuery = franchiseContext.isStaff
    ? staffOrdersQuery
    : franchiseOrdersQuery;

  const filteredOrders = useMemo(
    () => filterOrderList(ordersQuery.data ?? [], searchTerm),
    [ordersQuery.data, searchTerm],
  );

  useEffect(() => {
    if (!filteredOrders.length) {
      setSelectedOrderId(null);
      return;
    }

    const hasSelectedOrder = filteredOrders.some(
      (order) => order.id === selectedOrderId,
    );

    if (!hasSelectedOrder) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order.id === selectedOrderId) ?? null,
    [filteredOrders, selectedOrderId],
  );

  const openOrderDetailPage = (orderId: string) => {
    navigate(
      `/admin/${ROUTER_URL.ADMIN_ROUTER.ORDERS_DETAIL.replace(":orderId", orderId)}`,
    );
  };

  return {
    franchiseContext,
    ordersQuery,
    filteredOrders,
    selectedOrder,
    selectedOrderId,
    setSelectedOrderId,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    statusFilters: ORDER_STATUS_FILTERS,
    openOrderDetailPage,
  };
};
