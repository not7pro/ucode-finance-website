import * as React from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, description, id, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2.5">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className={`h-4 w-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer transition-colors mt-0.5 ${className}`}
          {...props}
        />
        {(label || description) && (
          <div className="grid gap-0.5 leading-none cursor-pointer">
            {label && (
              <label
                htmlFor={id}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
