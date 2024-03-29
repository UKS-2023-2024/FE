import { Resolver, useForm } from "react-hook-form";
import { Modal } from "flowbite-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../../../components/button/Button";
import { Input } from "../../../../components/input/Input";
import { RENAME_BRANCH_DEFAULT_VALUES, RENAME_BRANCH_VALIDATION_SCHEMA } from "../../../../utils/branch.constants";
import { useUpdateBranch } from "../../../../api/mutations/branch/useUpdateBranch";
import { Branch } from "../../../../store/model/branch.model";
import { useEffect } from "react";
import { useGetAllBranchesWithoutDefaultByRepositoryIdPagination } from "../../../../api/query/branch/useGetAllBranchesWithoutDefaultByRepositoryIdPagination";
import { useGetDefaultBranchByRepositoryId } from "../../../../api/query/branch/useGetDefaultBranchByRepositoryId";
import { useGetUserBranchesWithoutDefaultByRepositoryId } from "../../../../api/query/branch/useGetUserBranchesWithoutDefaultByRepositoryId";
import { useAtom } from "jotai";
import { currentAllBranchesPageNumberAtom, currentRepositoryAtom, currentYourBranchesPageNumberAtom } from "../../../../store/store";

export type RenameBranchFormValues = {
  id: string;
  name: string;
};

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  branch: Branch | undefined;
}

export const RenameBranchForm = ({ isOpen, setOpen, branch }: Props) => {
  const { mutateAsync: updateBranch } = useUpdateBranch();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<RenameBranchFormValues>({
    defaultValues: RENAME_BRANCH_DEFAULT_VALUES,
    resolver: yupResolver(RENAME_BRANCH_VALIDATION_SCHEMA) as Resolver<RenameBranchFormValues>,
  });

  const [repository] = useAtom(currentRepositoryAtom);
  const [, setYourBranchesPageNumber] = useAtom(currentYourBranchesPageNumberAtom);
  const [, setAllBranchesPageNumber] = useAtom(currentAllBranchesPageNumberAtom);
  const { refetch: refetchDefault} = useGetDefaultBranchByRepositoryId(repository?.id ?? "");
  const { refetch: refetchYourBranches} = useGetUserBranchesWithoutDefaultByRepositoryId(repository?.id ?? "", 1);
  const { refetch: refetchActiveBranches} = useGetAllBranchesWithoutDefaultByRepositoryIdPagination(repository?.id ?? "", 1);
  
  const handleOnSubmit = async (values: RenameBranchFormValues) => {
    await updateBranch(values);
    refetchDefault()
    refetchActiveBranches()
    refetchYourBranches()
    setYourBranchesPageNumber(1)
    setAllBranchesPageNumber(1)
    reset();
    setOpen(false);
  };

  useEffect(() => {
    if (branch) {
      reset({
        id: branch.id,
        name: branch.name,
      });
    }
  }, [branch, reset]);

  return (
    <Modal
      show={isOpen}
      onClose={() => {
        reset();
        setOpen(false);
      }}
    >
      <Modal.Header className="bg-[#11151C]"><div className="text-white">Rename this branch</div></Modal.Header>
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
              <Button className="w-full mt-4" type="submit" value="Submit">
                Rename
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};