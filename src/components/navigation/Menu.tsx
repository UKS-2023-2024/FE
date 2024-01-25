import { useState } from "react";
import { LoginForm } from "../../modules/auth/forms/LoginForm";
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
  const [showDropdown, setShowDropdown] = useState(false);

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
        <div className="flex flex-row">
          <div>
          <div
            className="p-2 rounded appearance-none text-white text-sm w-full cursor-pointer flex justify-between items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentUser?.fullName}
            <svg
              className={`w-3 h-3 transition-transform transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 15a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 15z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {showDropdown && (
            <div className="absolute mt-1 bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm">
              <div className="flex flex-col p-2 text-white">
                  <button className="text-white" onClick={() => {navigate("/settings/profile")}}>Profile</button>
                  ------------------------
                  <button className="text-white" onClick={() => {navigate("/settings/notifications")}}>Notificatons</button>
              </div>
            </div>
          )}
       
          </div>
          <Button onClick={logout} className="w-20 bg-transparent text-white">
            Logout
          </Button>
        </div>
      )}
      <LoginForm isOpen={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};
