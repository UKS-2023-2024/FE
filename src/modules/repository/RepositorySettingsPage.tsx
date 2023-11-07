import { Button } from "../../components/button/Button";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useDeleteRepository } from "../../api/mutations/repository/useDeleteRepository";

export const RepositorySettingsPage = () => {
  const { mutateAsync: deleteRepository } = useDeleteRepository();
  const [repository] = useAtom(currentRepositoryAtom);

  const handleDelete = async () => {
    console.log(repository?.id);
    await deleteRepository(repository?.id ?? "");
  };

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="flex gap-8 border border-white rounded p-10">
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
