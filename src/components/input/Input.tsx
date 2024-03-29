/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLProps } from "react";
import { cn } from "../../utils/cn";
import React from "react";
import { FieldError } from "react-hook-form";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  hasError?: FieldError | undefined;
  errorMessage?: string | undefined;
}

export const Input = React.forwardRef(
  (
    { label, hasError, errorMessage, className = "", ...props }: InputProps,
    ref: React.LegacyRef<HTMLInputElement>
  ) => {
    return (
      <>
        <span className="text-white">{label}</span>
        <input
          {...props}
          ref={ref}
          className={cn("border border-green-700 rounded p-2", className)}
        />
        <p className="h-6 mt-2 text-red-600">{hasError && errorMessage}</p>
      </>
    );
  }
);
