import { HTMLProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface Props {
  children: ReactNode;
  onClick: () => void;
}

export const Button = ({
  children,
  onClick,
  className = "",
}: Props & HTMLProps<HTMLInputElement>) => {
  return (
    <button
      onClick={onClick}
      className={cn("h-10 bg-green-600 rounded text-white", className)}
    >
      {children}
    </button>
  );
};
