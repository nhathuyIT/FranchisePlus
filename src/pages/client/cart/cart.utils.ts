export const formatCurrency = (value: number) =>
  `${Number(value || 0).toLocaleString("vi-VN")} VND`;
