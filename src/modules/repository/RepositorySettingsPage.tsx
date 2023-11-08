import { Button } from "../../components/button/Button";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useDeleteRepository } from "../../api/mutations/repository/useDeleteRepository";
import { Input } from "../../components/input/Input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateRepository } from "../../api/mutations/repository/useUpdateRepository";


export type UpdateRepositoryFormValues = {
  name: string;
  description: string;
  isPrivate: string;
};

export const RepositorySettingsPage = () => {
  const { mutateAsync: deleteRepository } = useDeleteRepository();
  const { mutateAsync: updateRepository } = useUpdateRepository();
  const [repository] = useAtom(currentRepositoryAtom);

  const [defaultValues, setDefaultValues] = useState({
    name: repository?.name ?? "",
    description: repository?.description ?? "",
    isPrivate: repository?.isPrivate.toString() ?? ""
  });

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<UpdateRepositoryFormValues>({defaultValues: defaultValues});
  
  useEffect(() => {
    if (repository) {
      reset( {name: repository?.name ?? "",
      description: repository?.description ?? "",
      isPrivate: repository?.isPrivate.toString() ?? ""})
    }
  }, [repository])

  const handleUpdate = async (values: UpdateRepositoryFormValues) => {
    const isPrivate = values.isPrivate == "true"
    await updateRepository({
      id: repository?.id ?? "",
      name: values.name,
      description: values.description,
      isPrivate: isPrivate
    });
  };

  const handleDelete = async () => {
    await deleteRepository(repository?.id ?? "");
  };

  return (
    <div className="w-full flex flex-col items-center pt-6">
        <div className="p-6 text-white">
          <p className="text-center font-sans">
            General
          </p>
        </div>
        <label className="text-white">Repository name*</label>
        <Input
          {...register("name")}
          className="w-1/4"
        />
        <label className="text-white">Description (optional)</label>  
        <Input
          {...register("description")}
          className="w-1/4"
        />
        <div>
          <div>
            <input
            {...register("isPrivate")}
              type="radio"
              id="public"
              value="false"
              defaultChecked={defaultValues.isPrivate === "false"}
            />
            <label className="text-white ml-2">Public</label>
          </div>
          <div>
            <input
            {...register("isPrivate")}
              type="radio"
              id="private"
              defaultChecked={defaultValues.isPrivate === "true"}
              value="true"
            />
            <label className="text-white ml-2">Private</label>
          </div>
      </div>
      <Button onClick={handleSubmit(handleUpdate)} className="w-1/4 mt-6">
          Update
      </Button>
      <div className="flex gap-8 border border-white rounded p-10 mt-5">
        <div className="text-white">
          <p>Delete this repository</p>
          <p>Once deleted, it will be gone forever. Please be certain.</p>
        </div>
        <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-400">
          Delete this repository
        </Button>
      </div>
    </div>
  );
};
