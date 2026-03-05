export const getMinPrice = (
  sizes: { price: number; isAvailable: boolean }[],
): number | null => {
  const available = sizes.filter((s) => s.isAvailable);
  if (available.length === 0) return null;
  return Math.min(...available.map((s) => s.price));
};

export const formatPrice = (price: number) =>
  price.toLocaleString("vi-VN") + "₫";

export const getSizeLabel = (size: string) => {
  const map: Record<string, string> = {
    DEFAULT: "Mặc định",
    SMALL: "Nhỏ",
    MEDIUM: "Vừa",
    LARGE: "Lớn",
  };
  return map[size] || size;
};
