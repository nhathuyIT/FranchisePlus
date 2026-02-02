/**
 * FranchisePlus Pro Theme - Highland Coffee Style
 * Pattern: High Contrast + Deep Shadows
 */

export const THEME = {
  colors: {
    // Đỏ Highland đặc trưng
    primary: {
      900: "#8B181B", // Dark Red (Header/Primary Buttons)
      800: "#A61D21", // Hover Red
      700: "#C12226",
      50: "#FFF5F5",  // Lightest Red Background
    },
    // Nâu Espresso cho text và Sidebar
    secondary: {
      900: "#4A2B29", 
      800: "#5D3A37",
      100: "#F3EFEF", 
    },
    // Màu nền thương hiệu (Nền kem cổ điển)
    neutral: {
      950: "#1A1A1A",
      500: "#737373",
      100: "#F5F5F5",
      50: "#FAF9F6",  // Kem Highland cho Background chính
    },
  },
} as const;

export const ADMIN_STYLES = {
  // Card với Shadow mềm và viền cực mỏng
  card: "bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300",
  
  // Table row gọn gàng hơn
  tableRow: "hover:bg-gray-50/80 transition-colors border-b border-gray-50 last:border-0",
  
  // Button Pro: Đỏ Highland với độ bo góc lớn
  buttonPrimary: "bg-[#8B181B] hover:bg-[#A61D21] text-white font-bold py-2.5 px-6 rounded-full transition-all duration-200 active:scale-95 shadow-md shadow-red-900/20",
  
  helperText: "text-xs text-gray-500 mt-1 font-medium",
} as const;

// Hàm getColor giữ nguyên logic fix lỗi 'any' của bạn
export const getColor = (path: string): string => {
  const keys = path.split(".");
  let value: Record<string, unknown> | unknown = THEME.colors;
  for (const key of keys) {
    if (value && typeof value === "object" && key in (value as object)) {
      value = (value as Record<string, unknown>)[key];
    } else { return "#000000"; }
  }
  return typeof value === "string" ? value : "#000000";
};