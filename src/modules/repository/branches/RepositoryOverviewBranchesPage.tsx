import { useAtom } from "jotai";
import { useGetDefaultBranchByRepositoryId } from "../../../api/query/branch/useGetDefaultBranchByRepositoryId";
import { currentRepositoryAtom } from "../../../store/store";
import { useGetUserActiveBranchesByRepositoryId } from "../../../api/query/branch/useGetUserActiveBranchesByRepositoryId";
import { Branch } from "../../../store/model/branch.model";
import { useGetActiveBranchesByRepositoryId } from "../../../api/query/branch/useGetActiveBranchesByRepositoryId";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useDeleteBranch } from "../../../api/mutations/branch/useDeleteBranch";
import { useState } from "react";
import { useRestoreBranch } from "../../../api/mutations/branch/useRestoreBranch";


export const RepositoryOverviewBranchesPage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: branch} = useGetDefaultBranchByRepositoryId(repository?.id ?? "");
  const { data: yourBranches} = useGetUserActiveBranchesByRepositoryId(repository?.id ?? "", 1);
  const { data: activeBranches} = useGetActiveBranchesByRepositoryId(repository?.id ?? "", 1);
  const navigate = useNavigate();
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
      <div className="w-1/2 border border-gray-500 text-white rounded">
        <div className="p-2">Default branch</div>
        <div className="border border-gray-500 p-3">
            {branch?.name}
        </div>
      </div>

      <div className="w-1/2 border border-gray-500 text-white rounded mt-5">
        <div className="p-2">Your branches</div>
        { yourBranches?.data.slice(0, 5).map((b: Branch) => (
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
        {  yourBranches?.totalItems > 5 && (
            <div 
              className="text-center py-1 px-3 text-blue-500 cursor-pointer underline"
              onClick={() => navigate(`/repository/${repository?.name}/branches/yours`)}
            >
                View all of your branches
            </div>
        )
        }
      </div>

      <div className="w-1/2 border border-gray-500 text-white rounded mt-5">
        <div className="p-2">Active branches</div>
        { activeBranches?.data.slice(0, 5).map((b: Branch) => (
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
         {  activeBranches?.totalItems > 5 && (
            <div 
              className="text-center py-1 px-3 text-blue-500 cursor-pointer underline"
              onClick={() => navigate(`/repository/${repository?.name}/branches/active`)}
            >
                View all active branches
            </div>
        )
        }
      </div>
    </div>
  );
};
