import { useAtom } from "jotai";
import { useGetDefaultBranchByRepositoryId } from "../../../api/query/branch/useGetDefaultBranchByRepositoryId";
import { currentRepositoryAtom } from "../../../store/store";
import { useGetUserActiveBranchesByRepositoryId } from "../../../api/query/branch/useGetUserActiveBranchesByRepositoryId";
import { Branch } from "../../../store/model/branch.model";
import { useGetActiveBranchesByRepositoryId } from "../../../api/query/branch/useGetActiveBranchesByRepositoryId";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const RepositoryOverviewBranchesPage = () => {
    const [repository] = useAtom(currentRepositoryAtom);
    const { data: branch} = useGetDefaultBranchByRepositoryId(repository?.id ?? "");
    const { data: yourBranches} = useGetUserActiveBranchesByRepositoryId(repository?.id ?? "", 1);
    const { data: activeBranches} = useGetActiveBranchesByRepositoryId(repository?.id ?? "", 1);
    const navigate = useNavigate();

    const onYourBranches = () => {
        navigate(`/repository/${repository?.name}/branches/yours`);
    }
    const onActiveBranches = () => {
      navigate(`/repository/${repository?.name}/branches/active`);
  }

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="w-1/2 border border-white text-white rounded">
        <div className="p-2">Default branch</div>
        <div className="border border-white p-3">
            {branch?.name}
        </div>
      </div>

      <div className="w-1/2 border border-white text-white rounded mt-5">
        <div className="p-2">Your branches</div>
        { yourBranches?.data.slice(0, 5).map((b: Branch) => (
        <div className="border border-white p-3" key={b.id}>
            {b?.name}
        </div>
        ))}
        {  yourBranches?.totalItems > 5 && (
            <div 
              className="text-center py-1 px-3 text-blue-500 cursor-pointer underline"
              onClick={() => onYourBranches()}
            >
                View all of your branches
            </div>
        )
        }
      </div>

      <div className="w-1/2 border border-white text-white rounded mt-5">
        <div className="p-2">Active branches</div>
        { activeBranches?.data.slice(0, 5).map((b: Branch) => (
        <div className="border border-white p-3" key={b.id}>
            {b?.name}
        </div>
        ))}
         {  activeBranches?.totalItems > 5 && (
            <div 
              className="text-center py-1 px-3 text-blue-500 cursor-pointer underline"
              onClick={() => onActiveBranches()}
            >
                View all active branches
            </div>
        )
        }
      </div>
    </div>
  );
};
