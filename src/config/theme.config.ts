// /**
//  * FranchisePlus Theme Configuration
//  * Based on Design System: Coffee Brown + Warm Gold
//  * Pattern: Data-Dense Dashboard
//  */

// export const THEME = {
//   // Color Palette
//   colors: {
//     // Primary: Coffee Brown - Main actions, links, primary elements
//     primary: {
//       900: "#78350F", // Primary brand color
//       800: "#92400E", // Hover state
//       700: "#B45309",
//       600: "#D97706",
//     },
    
//     // Secondary: Warm Gold - CTAs, highlights, buttons
//     secondary: {
//       500: "#F59E0B",
//       400: "#FBBF24", // Warm gold for CTAs
//       300: "#FCD34D",
//     },

//     // Neutral: Gray scale for text, borders, backgrounds
//     neutral: {
//       950: "#451A03", // Body text
//       900: "#1F2937",
//       700: "#374151",
//       600: "#4B5563",
//       500: "#6B7280",
//       400: "#9CA3AF",
//       200: "#E5E7EB",
//       100: "#F3F4F6",
//       50: "#FEF3C7",  // Light cream background
//     },

//     // Status Colors
//     success: "#10B981",
//     warning: "#F59E0B",
//     danger: "#EF4444",
//     info: "#3B82F6",
//   },

//   // Typography
//   typography: {
//     family: {
//       sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
//       mono: "Fira Code, ui-monospace, SFMono-Regular, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
//     },
//     sizes: {
//       xs: "0.75rem",    // 12px
//       sm: "0.875rem",   // 14px
//       base: "1rem",     // 16px
//       lg: "1.125rem",   // 18px
//       xl: "1.25rem",    // 20px
//       "2xl": "1.5rem",  // 24px
//       "3xl": "1.875rem", // 30px
//     },
//     weights: {
//       light: 300,
//       normal: 400,
//       medium: 500,
//       semibold: 600,
//       bold: 700,
//     },
//   },

//   // Spacing (for consistent padding/margin)
//   spacing: {
//     xs: "0.25rem",   // 4px
//     sm: "0.5rem",    // 8px
//     md: "1rem",      // 16px
//     lg: "1.5rem",    // 24px
//     xl: "2rem",      // 32px
//     "2xl": "3rem",   // 48px
//   },

//   // Border Radius
//   radius: {
//     none: "0",
//     sm: "0.25rem",
//     md: "0.375rem",
//     lg: "0.5rem",
//     xl: "0.75rem",
//     "2xl": "1rem",
//   },

//   // Transitions & Animations
//   transitions: {
//     fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
//     base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
//     slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
//   },

//   // Shadows
//   shadows: {
//     sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
//     md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
//     lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
//     xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
//   },

//   // Z-index scale (for layering)
//   zIndex: {
//     hide: -1,
//     base: 0,
//     dropdown: 1000,
//     sticky: 1100,
//     fixed: 1200,
//     modalBackdrop: 1300,
//     modal: 1400,
//     popover: 1500,
//     tooltip: 1600,
//   },

//   // Breakpoints (Tailwind default)
//   breakpoints: {
//     sm: "640px",
//     md: "768px",
//     lg: "1024px",
//     xl: "1280px",
//     "2xl": "1536px",
//   },
// } as const;

// // Export color utility functions
// export const getColor = (path: string): string => {
//   const keys = path.split(".");
//   let value: unknow = THEME.colors;
  
//   for (const key of keys) {
//     value = value?.[key];
//   }
  
//   return value || "#000000";
// };

// // Data-Dense Dashboard specific styles
// export const ADMIN_STYLES = {
//   // Compact card styling
//   card: "bg-white rounded-lg border border-amber-200 shadow-sm hover:shadow-md transition-shadow",
  
//   // Table row styling
//   tableRow: "hover:bg-amber-50 transition-colors border-b border-amber-100",
  
//   // Input styling with proper contrast
//   input: "bg-white border border-amber-200 rounded-lg px-3 py-2 text-amber-950 placeholder-amber-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-ring",
  
//   // Button primary (CTA - Warm Gold)
//   buttonPrimary: "bg-amber-400 hover:bg-amber-500 text-amber-950 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer active:bg-amber-600",
  
//   // Button secondary
//   buttonSecondary: "bg-amber-100 hover:bg-amber-200 text-amber-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer",
  
//   // Button danger
//   buttonDanger: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 cursor-pointer",
  
//   // Label text
//   label: "block text-sm font-semibold text-amber-950 mb-1",
  
//   // Helper/muted text
//   helperText: "text-xs text-amber-700 mt-1",
  
//   // Error message
//   errorText: "text-xs text-red-600 font-medium mt-1",
// } as const;
