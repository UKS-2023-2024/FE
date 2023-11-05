import { useState } from "react";
import { LoginForm } from "../auth/LoginForm";
import { Button } from "../button/Button";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentUserAtom, tokenAtom } from "../../store/store";

export const Menu = () => {
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [token, setToken] = useAtom(tokenAtom);
  const [, setCurrentUser] = useAtom(currentUserAtom);
  const [currentUser] = useAtom(currentUserAtom);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleUserProfileClick = () => {
    navigate("/profile");
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <div className="flex justify-end h-[5%] bg-black border-b-[1px]  border-gray-600">
      \
      {token == null ? (
        <div>
          {" "}
          <Button
            onClick={handleRegisterClick}
            className="w-20 bg-transparent text-white"
          >
            Register
          </Button>
          <Button
            onClick={() => setOpenLogin(true)}
            className="w-20 bg-transparent text-white"
          >
            Login
          </Button>
        </div>
      ) : (
        <div>
          <Button
            onClick={handleUserProfileClick}
            className="w-20 bg-transparent text-white"
          >
            {currentUser?.fullName}
          </Button>
          <Button onClick={logout} className="w-20 bg-transparent text-white">
            Logout
          </Button>
        </div>
      )}
      <LoginForm isOpen={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};
