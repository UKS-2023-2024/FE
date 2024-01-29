import { useEffect, useRef, useState } from "react";
import { LoginForm } from "../../modules/auth/forms/LoginForm";
import { Button } from "../button/Button";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentUserAtom, tokenAtom } from "../../store/store";
import inbox from "./../../assets/inbox-mail.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../dropdownMenu";

export const Menu = () => {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [token, setToken] = useAtom(tokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [currentUser] = useAtom(currentUserAtom);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleHomeClick = () => {
    navigate("/home");
  };

  const logout = () => {
    navigate("/");
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <div className="flex justify-between bg-black border-b-[1px]  border-gray-600 py-2 px-4">
      <div className="text-white">
        {token != null && (
          <Button onClick={handleHomeClick} className="w-20 bg-transparent text-white">
            Home
          </Button>
        )}
      </div>
      {token == null ? (
        <div>
          <Button onClick={handleRegisterClick} className="w-20 bg-transparent text-white">
            Register
          </Button>
          <Button onClick={() => setOpenLogin(true)} className="w-20 bg-transparent text-white">
            Login
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <img
            src={inbox}
            alt="star"
            className="w-[25px] my-auto h-[25px] rounded-md cursor-pointer mr-2"
            onClick={() => navigate("/notifications")}
          />
          <DropdownMenu>
            <DropdownMenuTrigger className="text-white focus:ring-0 focus:outline-none ">
              {currentUser?.fullName}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={logout} className="w-20 bg-transparent text-white">
            Logout
          </Button>
        </div>
      )}
      <LoginForm isOpen={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};
