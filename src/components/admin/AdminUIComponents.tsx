/**
 * Admin UI Components Template
 * Follows FranchisePlus Design System: Coffee Brown + Warm Gold
 * Based on ui-ux-pro-max recommendations
 */

import React from "react";
import  { AlertCircle, CheckCircle, Info } from "lucide-react";
import { ADMIN_STYLES } from "@/config/theme.config";

// ============================================
// FORM COMPONENTS
// ============================================

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * FormInput - Controlled component with proper labels
 * Following React best practices: labels with htmlFor
 */
export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, id, className, ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className={ADMIN_STYLES.label}>
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full ${ADMIN_STYLES.input} ${error ? "border-red-500 focus:ring-red-400" : ""} ${className || ""}`}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        {helperText && !error && (
          <p className={ADMIN_STYLES.helperText}>{helperText}</p>
        )}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

// ============================================
// BUTTON COMPONENTS
// ============================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = "primary", 
    size = "md", 
    loading = false, 
    icon, 
    children, 
    className,
    disabled,
    ...props 
  }, ref) => {
    const baseStyle = "font-semibold rounded-lg transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantStyles = {
      primary: ADMIN_STYLES.buttonPrimary,
      secondary: ADMIN_STYLES.buttonSecondary,
      danger: ADMIN_STYLES.buttonDanger,
    };
    
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

// ============================================
// CARD COMPONENTS
// ============================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, icon, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${ADMIN_STYLES.card} ${className || ""}`}
        {...props}
      >
        {title && (
          <div className="border-b border-amber-100 p-4 flex items-center gap-3">
            {icon && <div className="text-amber-900">{icon}</div>}
            <h3 className="font-bold text-lg text-amber-950">{title}</h3>
          </div>
        )}
        <div className={title ? "p-4" : ""}>{children}</div>
      </div>
    );
  }
);
Card.displayName = "Card";

// ============================================
// ALERT COMPONENTS
// ============================================

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "success" | "error" | "warning" | "info";
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ type = "info", children, className, ...props }, ref) => {
    const typeStyles = {
      success: "bg-green-50 border-green-200 text-green-900",
      error: "bg-red-50 border-red-200 text-red-900",
      warning: "bg-amber-50 border-amber-200 text-amber-900",
      info: "bg-blue-50 border-blue-200 text-blue-900",
    };
    
    const icons = {
      success: <CheckCircle size={20} />,
      error: <AlertCircle size={20} />,
      warning: <AlertCircle size={20} />,
      info: <Info size={20} />,
    };
    
    return (
      <div
        ref={ref}
        className={`flex items-start gap-3 p-4 rounded-lg border ${typeStyles[type]} ${className || ""}`}
        {...props}
      >
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1 text-sm">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

// ============================================
// TABLE COMPONENTS (Data-Dense)
// ============================================

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ striped = true, className, children, ...props }, ref) => {
    return (
      <div className="overflow-x-auto">
        <table
          ref={ref}
          className={`w-full text-sm ${className || ""}`}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);
Table.displayName = "Table";

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  React.TableHTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={`bg-amber-100 text-amber-950 font-bold sticky top-0 ${className || ""}`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.TableHTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={className || ""} {...props} />
));
TableBody.displayName = "TableBody";

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.TableHTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`${ADMIN_STYLES.tableRow} ${className || ""}`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`px-4 py-3 text-amber-950 ${className || ""}`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export const TableHeader = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`px-4 py-3 text-left font-semibold ${className || ""}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// ============================================
// BADGE COMPONENT
// ============================================

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    const variants = {
      default: "bg-amber-100 text-amber-900",
      success: "bg-green-100 text-green-900",
      warning: "bg-yellow-100 text-yellow-900",
      error: "bg-red-100 text-red-900",
      info: "bg-blue-100 text-blue-900",
    };
    
    return (
      <span
        ref={ref}
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className || ""}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = "Badge";
