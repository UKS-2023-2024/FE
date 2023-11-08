import { useForm } from "react-hook-form";
import { Input } from "../../components/input/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/button/Button";
import { useState } from "react";
import { useCreateUserRepository } from "../../api/mutations/repository/useCreateUserRepository";
import { useCreateOrganizationRepository } from "../../api/mutations/repository/useCreateOrganizationRepository";
import { CREATE_REPOSITORY_VALIDATION_SCHEMA } from "../../utils/repository.constants";
import { useGetUserOrganizations } from "../../api/query/useGetUserOrganizations";
import { currentUserAtom } from "../../store/store";
import { useAtom } from "jotai";

export type CreateRepositoryFormValues = {
  name: string;
  description: string;
  isPrivate: string;
  organizationId: string
};

export const CreateRepositoryPage = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<CreateRepositoryFormValues>({
  });

  const { data: userOrganizations } = useGetUserOrganizations();
  const { mutateAsync: createUserRepository } = useCreateUserRepository();
  const { mutateAsync: createOrganizationRepository } = useCreateOrganizationRepository();
  const [currentUser] = useAtom(currentUserAtom);

  const handleOnSubmit = async (values: CreateRepositoryFormValues) => {
    const isPrivate = values.isPrivate == "true"
    if (values.organizationId == "") {
      await createUserRepository({
        name: values.name,
        description: values.description,
        isPrivate: isPrivate,
      });
    } else {
      await createOrganizationRepository({
        name: values.name,
        description: values.description,
        isPrivate: isPrivate,
        organizationId: values.organizationId
      });
    }
    reset();
  };


  return (
    <div className="w-full h-full flex justify-center pt-20 bg-[#11151C]">
      <div className="w-1/2 flex flex-col items-cemter">
        <div className="p-6 text-white">
          <p className="text-center font-sans">
            Create a new repository
          </p>
        </div>
        <div className="flex">
          <div className="mr-5">
            <label className="text-white">Owner*</label>
            <select {...register("organizationId")} className="w-full">
              <option value="">{currentUser?.username}</option>
              {userOrganizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-white flex justify-content items-center">
            /
          </div>
          <div className="ml-5">
            <label className="text-white">Repository name*</label>
            <Input
              {...register("name")}
              hasError={errors.name}
              errorMessage={errors.name?.message}
              className="w-full"
            />
          </div>
        </div>
        <label className="text-white">Description (optional)</label>  
        <Input
          {...register("description")}
          hasError={errors.description}
          errorMessage={errors.description?.message}
          className="w-full"
        />
        <div>
          <div>
            <input
              type="radio"
              id="public"
              {...register("isPrivate")}
              value="false"
            />
            <label className="text-white ml-2">Public</label>
          </div>
          <div>
            <input
              type="radio"
              id="private"
              {...register("isPrivate")}
              defaultChecked
              value="true"
            />
            <label className="text-white ml-2">Private</label>
          </div>
        </div>
        <Button onClick={handleSubmit(handleOnSubmit)} className="w-full mt-6">
          Create
        </Button>
      </div>
    </div>
  );
};
