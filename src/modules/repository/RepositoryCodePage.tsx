import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useGetNotDeletedBranchesByRepositoryId } from "../../api/query/branch/useGetNotDeletedBranchesByRepositoryId";
import { Branch } from "../../store/model/branch.model";
import { useNavigate } from "react-router-dom";


export const RepositoryCodePage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: branches} = useGetNotDeletedBranchesByRepositoryId(repository?.id ?? "");
  const [defaultBranch, setDefaultBranch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const defaultBranch = branches.find((branch) => branch.isDefault);
    if (defaultBranch) {
      setDefaultBranch(defaultBranch.name);
    }
  }, [branches]);

  const [showDropdown, setShowDropdown] = useState(false);

  const onBranchSelect = (selectedBranch: Branch | null) => {
    setShowDropdown(false);
    if (selectedBranch == null) {
      navigate(`/repository/${repository?.name}/branches`);
    } else {
    }
  }
 

  return (
    <div className="w-full pt-6">
        <div className="p-2 w-1/5">
          <div
            className="p-2 border border-gray-300 dark:border-gray-600 rounded appearance-none bg-gray-900 text-white text-sm w-full cursor-pointer flex justify-between items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{defaultBranch}</span>
            <svg
              className={`w-3 h-3 transition-transform transform ${showDropdown ? 'rotate-180' : ''}`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 15a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 15z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {showDropdown && (
            <div className="absolute mt-1 w-1/4 bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm">
              {branches.slice(0, 5).map((branch) => (
                <div
                  key={branch.name}
                  className="py-1 px-3 text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => onBranchSelect(branch)}
                >
                  {branch.name}
                </div>
              ))}
          <div
            className="text-center py-1 px-3 text-blue-500 cursor-pointer underline"
            onClick={() => onBranchSelect(null)}
          >
            View all branches
          </div>
        </div>
          )}
      </div>     
    </div>
  );
};
