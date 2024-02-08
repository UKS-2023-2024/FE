/* eslint-disable react-hooks/exhaustive-deps */
import { Resolver, useForm } from "react-hook-form";
import { Modal } from "flowbite-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../../../components/button/Button";
import { Input } from "../../../../components/input/Input";
import {
  CREATE_BRANCH_DEFAULT_VALUES,
  CREATE_BRANCH_VALIDATION_SCHEMA,
} from "../../../../utils/branch.constants";
import { useCreateBranch } from "../../../../api/mutations/branch/useCreateBranch";
import { useAtom } from "jotai";
import {
  currentActiveBranchesPageNumberAtom,
  currentRepositoryAtom,
  currentYourBranchesPageNumberAtom,
} from "../../../../store/store";
import { useGetActiveBranchesByRepositoryId } from "../../../../api/query/branch/useGetAllBranchesWithoutDefaultByRepositoryIdPagination";
import { useGetUserActiveBranchesByRepositoryId } from "../../../../api/query/branch/useGetUserBranchesWithoutDefaultByRepositoryId";
import { useGetAllRepositoryBranches } from "../../../../api/query/branch/useGetAllRepositoryBranches";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../../../../components/select";
import { SelectValue } from "@radix-ui/react-select";
import { Branch } from "../../../../store/model/branch.model";
import { useEffect } from "react";

export type CreateBranchFormValues = {
  name: string;
  createdFromBranch: string;
};

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateBranchForm = ({ isOpen, setOpen }: Props) => {
  const { mutateAsync: createBranch } = useCreateBranch();
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm<CreateBranchFormValues>({
    defaultValues: CREATE_BRANCH_DEFAULT_VALUES,
    resolver: yupResolver(CREATE_BRANCH_VALIDATION_SCHEMA) as Resolver<CreateBranchFormValues>,
  });

  const [repository] = useAtom(currentRepositoryAtom);
  const { data: repositoryBranches } = useGetAllRepositoryBranches(repository?.id ?? "");
  const [, setYourBranchesPageNumber] = useAtom(currentYourBranchesPageNumberAtom);
  const [, setActiveBranchesPageNumber] = useAtom(currentActiveBranchesPageNumberAtom);
  const { refetch: refetchYourBranches } = useGetUserActiveBranchesByRepositoryId(
    repository?.id ?? "",
    1
  );
  const { refetch: refetchActiveBranches } = useGetActiveBranchesByRepositoryId(
    repository?.id ?? "",
    1
  );

  useEffect(() => {
    setValue(
      "createdFromBranch",
      repositoryBranches != undefined ? repositoryBranches[0].name : ""
    );
  }, [repositoryBranches]);

  const handleOnSubmit = async (values: CreateBranchFormValues) => {
    await createBranch({
      name: values.name,
      repositoryId: repository?.id ?? "",
      createdFromBranch: values.createdFromBranch,
    });
    reset();
    setOpen(false);
    refetchActiveBranches();
    refetchYourBranches();
    setActiveBranchesPageNumber(1);
    setYourBranchesPageNumber(1);
  };

  return (
    <Modal
      show={isOpen}
      onClose={() => {
        reset();
        setOpen(false);
      }}
    >
      <Modal.Header className="bg-[#11151C]">
        <div className="text-white">Create a branch</div>
      </Modal.Header>
      <Modal.Body className="bg-[#11151C]">
        <div className="flex flex-col align-middle mb-4">
          <div className=" w-2/3 mx-auto">
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              <Input
                type="name"
                placeholder="Name"
                className="w-full"
                {...register("name")}
                hasError={errors.name}
                errorMessage={errors.name?.message}
              />
              <Select
                defaultValue={repositoryBranches?.find((branch) => branch.isDefault)?.name}
                onValueChange={async (value: string) => {
                  setValue("createdFromBranch", value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Branch" />
                </SelectTrigger>
                <SelectContent>
                  {repositoryBranches?.map((branch: Branch) => {
                    return (
                      <SelectItem key={branch.id} value={branch.name}>
                        {branch.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <p className="h-6 mt-2 text-red-600">
                {errors.createdFromBranch && errors.createdFromBranch.message}
              </p>
              <Button className="w-full mt-4" type="submit" value="Submit">
                Create new branch
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
