import { HTMLProps } from "react";
import { cn } from "../../utils/cn";

interface Props {}

export const Input = ({
  className = "",
  ...props
}: Props & HTMLProps<HTMLInputElement>) => {
  return (
    <input
      className={cn("border border-green-700 rounded p-2", className)}
      {...props}
    />
  );
};
