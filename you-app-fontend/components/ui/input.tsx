import * as React from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean;
}

const BsEye = dynamic(() => import("react-icons/bs").then((mod) => mod.BsEye), {
  ssr: false,
});
const BsEyeSlash = dynamic(
  () => import("react-icons/bs").then((mod) => mod.BsEyeSlash),
  { ssr: false }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showPasswordToggle, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            showPasswordToggle && "pr-10",
            className
          )}
          ref={ref}
          {...props}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 border-0"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <BsEye className="h-5 w-5" color="white" />
            ) : (
              <BsEyeSlash className="h-5 w-5" color="white" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
