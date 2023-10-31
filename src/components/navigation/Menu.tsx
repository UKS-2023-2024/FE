import { Button } from "../button/Button";
import { useNavigate } from "react-router-dom";

export const Menu = () => {
  const navigate = useNavigate();
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-end h-[5%] bg-gray-900">
      <Button
        onClick={handleRegisterClick}
        className="w-20 bg-transparent text-white"
      >
        Register
      </Button>
      <Button
        onClick={handleRegisterClick}
        className="w-20 bg-transparent text-white"
      >
        Login
      </Button>
    </div>
  );
};
