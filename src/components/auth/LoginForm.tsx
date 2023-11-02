import { useForm } from "react-hook-form";
import { Modal } from "flowbite-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { LOGIN_DEFAULT_VALUES, LOGIN_VALIDATION_SCHEMA } from "../../utils/auth.constants";
import { Button } from "../button/Button";
import { useLogin } from "../../api/mutations/useLogin";
import { Input } from "../input/Input";

export type LoginFormValues = {
  email: string;
  password: string;
};

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginForm = ({ isOpen, setOpen }: Props) => {
  const { mutateAsync: login } = useLogin();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: LOGIN_DEFAULT_VALUES,
    resolver: yupResolver(LOGIN_VALIDATION_SCHEMA),
  });

  const handleOnSubmit = async (values: LoginFormValues) => {
    await login(values);
    reset();
    setOpen(false);
  };

  return (
    <Modal
      show={isOpen}
      onClose={() => {
        reset();
        setOpen(false);
      }}
    >
      <Modal.Header>Login</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col align-middle mb-4">
          <div className=" w-2/3 mx-auto">
            <form onSubmit={handleSubmit(handleOnSubmit)} className="flex flex-col gap-4">
              <div className="flex-grow">
                <Input type="email" placeholder="Email" className="w-full" {...register("email")} />
                {errors.email ? <p>{errors.email.message} </p> : <p className="h-6"></p>}
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="w-full"
                  {...register("password")}
                />
                {errors.password ? <p>{errors.password.message} </p> : <p className="h-6"></p>}
              </div>
              <Button className="w-full" type="submit" value="Submit">
                Login
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
