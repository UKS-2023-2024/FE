import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { useRegisterUser } from "../../api/mutations/useRegisterUser";
import { useState } from "react";

export const RegisterPage = () => {
  const { mutateAsync: registerUser } = useRegisterUser();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    await registerUser({
      primaryEmail: email,
      fullname: fullname,
      username: username,
      password: password,
    });
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-1/2 h-1/2 flex flex-col items-center gap-3 shadow-lg pt-14 rounded">
        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-1/2"
        />
        <Input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-1/2"
        />
        <Input
          placeholder="Full name"
          onChange={(e) => setFullname(e.target.value)}
          className="w-1/2"
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-1/2"
        />
        <Button onClick={handleRegister} className="w-1/2 mt-10">
          Register
        </Button>
      </div>
    </div>
  );
};
