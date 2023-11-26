import { useForm } from "react-hook-form";
import { Modal } from "flowbite-react";
import { Button } from "../../../../components/button/Button";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../../store/store";
import { useMakeBranchDefault } from "../../../../api/mutations/branch/useMakeBranchDefault";
import { useGetDefaultBranchByRepositoryId } from "../../../../api/query/branch/useGetDefaultBranchByRepositoryId";
import { useGetAllBranchesWithoutDefaultByRepositoryId } from "../../../../api/query/branch/useGetAllBranchesWithoutDefaultByRepositoryId";



export type SwitchDefaultBranchFormValues = {
  branchId: string;
};

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SwitchDefaultBranchForm = ({ isOpen, setOpen}: Props) => {
  const { mutateAsync: makeBranchDefault } = useMakeBranchDefault();
  const {
    handleSubmit,
    reset,
    register,
  } = useForm<SwitchDefaultBranchFormValues>({
  });

  const [repository] = useAtom(currentRepositoryAtom);
  const { data: defaultBranch, refetch: refetchDefaultBranch} = useGetDefaultBranchByRepositoryId(repository?.id ?? "");
  const { data: allBranches, refetch: refetchAllBranches} = useGetAllBranchesWithoutDefaultByRepositoryId(repository?.id ?? "")

  const handleOnSubmit = async (values: SwitchDefaultBranchFormValues) => {
    await makeBranchDefault(values.branchId);
    refetchDefaultBranch()
    refetchAllBranches()
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
      <Modal.Header className="bg-[#11151C]"><div className="text-white">Switch default branch to another branch</div></Modal.Header>
      <Modal.Body className="bg-[#11151C]">
        <div className="flex flex-col align-middle mb-4">
          <div className=" w-2/3 mx-auto">
            <form onSubmit={handleSubmit(handleOnSubmit)}>
            <select {...register("branchId")} className="w-full mt-4 bg-[#11151C] text-white" defaultValue={defaultBranch?.id}>
                <option key={defaultBranch?.id} value={defaultBranch?.id}>
                    {defaultBranch?.name}
                </option>
                {allBranches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <Button className="w-full mt-4" type="submit" value="Submit">
                Update
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};