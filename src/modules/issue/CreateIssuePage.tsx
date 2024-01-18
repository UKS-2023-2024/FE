import { useForm } from "react-hook-form";
import { Button } from "../../components/button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { CREATE_ISSUE_VALIDATION_SCHEMA } from "../../utils/auth.constants";
import { Input } from "../../components/input/Input";
import { useCreateIssue } from "../../api/mutations/issue/useCreateIssue";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";

export type CreateIssueValues = {
  title: string;
  description?: string;
};

export const CreateIssuePage = () => {
  const { mutateAsync: createIssue } = useCreateIssue();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateIssueValues>({
    resolver: yupResolver(CREATE_ISSUE_VALIDATION_SCHEMA),
  });

  const handleOnSubmit = async (values: CreateIssueValues) => {
    await createIssue({
      title: values.title,
      description: values.description ?? "",
      repositoryId: selectedRepository.id,
    });
    //reset();
  };

  return (
    <div className="flex flex-col p-20">
      <div className="pb-6 border-b border-gray-600">
        <p className="text-white text-2xl">New issue</p>
      </div>

      <div className=" flex flex-col pt-6 pb-6 border-b border-gray-600">
        <Input
          label="Add a title"
          placeholder="Title"
          className="w-[60%]"
          {...register("title")}
          hasError={errors.title}
          errorMessage={errors.title?.message}
        />
        <span className="text-white">Add a description</span>
        <textarea className="w-[60%]" {...register("description")} />
      </div>
      <div className="flex justify-end pt-6">
        <Button onClick={handleSubmit(handleOnSubmit)}>Submit new issue</Button>
      </div>
    </div>
  );
};
