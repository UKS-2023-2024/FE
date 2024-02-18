import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { useRegisterUser } from "../../api/mutations/useRegisterUser";
import { useMemo, useState } from "react";
import { useGetPrDiff } from "../../api/query/pull-request/useGetPrDiff";
import { parseUnifiedDiff } from "../../utils/diff-parser";
import { useNavigate } from "react-router-dom";

export const RegisterPage = () => {
  const { mutateAsync: registerUser, isError: isErrorRegister } = useRegisterUser();
  const { data: diffText } = useGetPrDiff();
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    await registerUser({
      primaryEmail: email,
      fullname: fullname,
      username: username,
      password: password,
    });
    if (!isErrorRegister) navigate("/");
  };
  return (
    <>
      <div className="w-full h-full flex justify-center bg-[#11151C]">
        <div className="w-1/2 flex flex-col items-center mt-20">
          <p className="text-white text-2xl mb-6">Register</p>
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-1/2" />
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
      <div>{JSON.stringify(parseUnifiedDiff(diffText ?? ""), null, 4)}</div>
    </>
  );
};
