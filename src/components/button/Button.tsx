import { HTMLProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

export const Button = ({
  children,
  onClick = () => {},
  className = "",
}: Props & HTMLProps<HTMLInputElement>) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "bg-green-600 rounded text-white hover:bg-green-500 p-2",
        className
      )}
    >
      {children}
    </button>
  );
};
