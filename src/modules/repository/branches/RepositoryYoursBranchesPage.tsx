import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { useGetUserActiveBranchesByRepositoryId } from "../../../api/query/branch/useGetUserActiveBranchesByRepositoryId";
import { Branch } from "../../../store/model/branch.model";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDeleteBranch } from "../../../api/mutations/branch/useDeleteBranch";
import { useRestoreBranch } from "../../../api/mutations/branch/useRestoreBranch";

export const RepositoryYoursBranchesPage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; 

  const { data: yourBranches, refetch } = useGetUserActiveBranchesByRepositoryId(repository?.id ?? "", pageNumber);

  const handlePageChange = async (newPageNumber: number) => {
    await new Promise<void>((resolve) => {
      setPageNumber(newPageNumber);
      resolve();
    });
    refetch();
  };

  const showPreviousButton = pageNumber > 1;
  const showNextButton = yourBranches?.totalItems > pageNumber * pageSize;
  const { mutateAsync: deleteBranch } = useDeleteBranch();
  const { mutateAsync: restoreBranch } = useRestoreBranch();
  const [deletedBranches, setDeletedBranches] = useState<string[]>([]);

  const onDeleteBranch = async (id: string) => {
    await deleteBranch(id);
    setDeletedBranches((prevDeletedBranches) => [...prevDeletedBranches, id]);
  };

  const onRestoreBranch = async (id: string) => {
    await restoreBranch(id)
    setDeletedBranches((prevDeletedBranches) => prevDeletedBranches.filter((branchId) => branchId !== id));
  };

  const isBranchDeleted = (id: string) => deletedBranches.includes(id);

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="w-1/2 border border-gray-500 text-white rounded mt-5">
        <div className="p-2">Your branches</div>
        {yourBranches?.data.map((b: Branch) => (
          <div className="flex items-center justify-between border border-gray-500 p-3" key={b.id}>
          <span>{b?.name}</span>
          {isBranchDeleted(b.id) ? (
              <button
                className="text-blue-500 cursor-pointer underline"
                onClick={() => onRestoreBranch(b.id)}
              >
                Restore
              </button>
            ) : (
              <button
                className="text-red-500 cursor-pointer"
                onClick={() => onDeleteBranch(b.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
        </div>
        ))}
      </div>
      <div className="flex justify-between w-1/2 mt-4">
        {showPreviousButton && (
          <div className="text-center py-1 px-3 text-blue-500 cursor-pointer underline" onClick={() => handlePageChange(pageNumber - 1)}>
            Previous
          </div>
        )}
        {showNextButton && (
          <div className="text-center py-1 px-3 text-blue-500 cursor-pointer underline" onClick={() => handlePageChange(pageNumber + 1)}>
            Next
          </div>
        )}
      </div>
    </div>
  );
};