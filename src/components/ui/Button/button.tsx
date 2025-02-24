import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "destructive" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <button
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-secondary/50
          ${
            variant === "default"
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : variant === "secondary"
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              : variant === "destructive"
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : variant === "outline"
              ? "bg-transparent border border-input hover:bg-accent hover:text-accent-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }
          ${
            size === "default"
              ? "px-4 py-2"
              : size === "sm"
              ? "px-3 py-1.5 rounded-md text-xs"
              : size === "lg"
              ? "px-8 py-3 rounded-md text-sm"
              : size === "icon"
              ? "h-9 w-9"
              : "px-4 py-2"
          }
          ${className}
        `}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
