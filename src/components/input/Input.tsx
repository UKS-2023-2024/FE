/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLProps } from "react";
import { cn } from "../../utils/cn";
import React from "react";

interface InputProps extends HTMLProps<HTMLInputElement> {}

export const Input = React.forwardRef(
  ({ className = "", ...props }: InputProps, ref: React.LegacyRef<HTMLInputElement>) => {
    return (
      <input
        {...props}
        ref={ref}
        className={cn("border border-green-700 rounded p-2", className)}
      />
    );
  }
);
