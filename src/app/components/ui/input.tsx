import * as React from "react";

import { cn } from "@/utils/shadcn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  customProp?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-auto w-full rounded-md border border-input bg-background overflow-auto file:px-3 file:py-2 file:mr-2 text-sm ring-offset-background file:border-0 file:bg-gray-50/5 file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
