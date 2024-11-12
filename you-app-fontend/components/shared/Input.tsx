import React from "react";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface SharedInputProps<T extends FieldValues> {
  form: Control<T>;
  placeholder: string;
  className?: string;
  type: "text" | "password" | "email" | "number" | "date";
  name: FieldPath<T>;
  disabled?: boolean;
}

const SharedInput = <T extends FieldValues>({
  form,
  placeholder,
  className,
  type,
  name,
  disabled,
}: SharedInputProps<T>): JSX.Element => {
  return (
    <FormField
      control={form}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              autoComplete={`current ${name}`}
              disabled={disabled}
              showPasswordToggle
              type={type}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
              onChange={(e) => {
                const value =
                  type === "number"
                    ? e.target.value === ""
                      ? null
                      : Number(e.target.value)
                    : e.target.value;
                field.onChange(value);
              }}
              className={`placeholder:capitalize !ring-0 border-slate-600 rounded-md ${className}`}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SharedInput;
