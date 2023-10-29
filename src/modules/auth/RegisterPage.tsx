import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";

export const RegisterPage = () => {
  const handleRegister = () => {};
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-1/2 h-1/2 flex flex-col items-center gap-3 shadow-lg pt-14 rounded">
        <Input placeholder="Email" className="w-1/2" />
        <Input placeholder="Username" className="w-1/2" />
        <Input placeholder="Full name" className="w-1/2" />
        <Button onClick={handleRegister} className="w-1/2 mt-10">
          Register
        </Button>
      </div>
    </div>
  );
};
