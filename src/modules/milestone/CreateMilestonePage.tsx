import { useForm } from "react-hook-form";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { CREATE_MILESTONE_VALIDATION_SCHEMA } from "../../utils/auth.constants";
import { useCreateMilestone } from "../../api/mutations/milestone/useCreateMilestone";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";

export type CreateMilestoneValues = {
  title: string;
  description?: string;
  dueDate?: Date;
};

export const CreateMilestonePage = () => {
  const { mutateAsync: createMilestone } = useCreateMilestone();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CreateMilestoneValues>({
    resolver: yupResolver(CREATE_MILESTONE_VALIDATION_SCHEMA),
  });

  const handleOnSubmit = async (values: CreateMilestoneValues) => {
    await createMilestone({
      title: values.title,
      description: values.description ?? "",
      dueDate: values.dueDate && formatDateToDateOnly(values.dueDate),
      repositoryId: selectedRepository.id,
    });
    //reset();
  };

  const formatDateToDateOnly = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  };

  return (
    <div className="flex flex-col p-20">
      <div className="pb-6 border-b border-gray-600">
        <p className="text-white text-2xl">New milestone</p>
        <p className="text-gray-400">
          Create a new milestone to help organize your issues and pull requests.
        </p>
      </div>

      <div className=" flex flex-col pt-6 pb-6 border-b border-gray-600">
        <Input
          label="Title"
          placeholder="Title"
          className="w-[60%]"
          {...register("title")}
          hasError={errors.title}
          errorMessage={errors.title?.message}
        />
        <Input
          label="Due date (optional)"
          type="date"
          className="w-[60%]"
          {...register("dueDate")}
          hasError={errors.dueDate}
          errorMessage={errors.dueDate?.message}
        />
        <span className="text-white">Description</span>
        <textarea className="w-[60%]" {...register("description")} />
      </div>
      <div className="flex justify-end pt-6">
        <Button onClick={handleSubmit(handleOnSubmit)}>Create milestone</Button>
      </div>
    </div>
  );
};
