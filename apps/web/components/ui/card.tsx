import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses = "rounded-xl border bg-card text-card-foreground shadow-sm";
    const variantClasses = variant === "secondary" ? "bg-secondary text-secondary-foreground" : "";
    
    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${className || ""}`}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className || ""}`} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardContent };