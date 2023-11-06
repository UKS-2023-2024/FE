import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
}

export const Tab = ({ children, onClick }: Props) => {
  return (
    <li className="mr-2" onClick={onClick}>
      <a
        href="#"
        className="text-lg inline-block p-4 border-b-0 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
      >
        {children}
      </a>
    </li>
  );
};
