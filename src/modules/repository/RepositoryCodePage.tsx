import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useState } from "react";
import { Branch } from "../../store/model/branch.model";
import { useNavigate } from "react-router-dom";
import { useGetDefaultBranchByRepositoryId } from "../../api/query/branch/useGetDefaultBranchByRepositoryId";
import { useGetAllBranchesWithoutDefaultByRepositoryId } from "../../api/query/branch/useGetAllBranchesWithoutDefaultByRepositoryId";
import { Button } from "../../components/button/Button";
import star from "./../../../public/star.png";
import { useDidUserStarRepository } from "../../api/query/repository/useDidUserStarRepository";
import { useFindAllUsersThatStarredRepository } from "../../api/query/repository/useFindAllUsersThatStarredRepository";
import { useStarRepository } from "../../api/mutations/repository/useStarRepository";
import { useUnstarRepository } from "../../api/mutations/repository/useUnstarRepository";
import { useIsUserWatchingRepository } from "../../api/query/repository/useIsUserWatchingRepository";
import { useWatchRepository } from "../../api/mutations/repository/useWatchRepository";
import eye from "./../../../public/eye.png";
import { useUnwatchRepository } from "../../api/mutations/repository/useUnwatchRepository";
import { useFindAllUsersWatchingRepository } from "../../api/query/repository/useFindAllUsersWatchingRepository";

export const RepositoryCodePage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: defaultBranch } = useGetDefaultBranchByRepositoryId(repository?.id ?? "");
  const { data: allBranches } = useGetAllBranchesWithoutDefaultByRepositoryId(repository?.id ?? "");
  const { mutateAsync: starRepository } = useStarRepository();
  const { mutateAsync: unstarRepository } = useUnstarRepository();
  const { data: didUserStarRepository } = useDidUserStarRepository(repository?.id ?? "");
  const { data: usersThatStarredRepository } = useFindAllUsersThatStarredRepository(repository?.id ?? "");
  const { data: isUserWatchingRepository } = useIsUserWatchingRepository(repository?.id ?? "");
  const { mutateAsync: watchRepository } = useWatchRepository();
  const { mutateAsync: unwatchRepository } = useUnwatchRepository();
  const { data: usersWatchingRepository } = useFindAllUsersWatchingRepository(repository?.id ?? "");
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const onBranchSelect = (selectedBranch: Branch | undefined) => {
    setShowDropdown(false);
    if (selectedBranch == undefined) {
      navigate(`/repository/${repository?.name}/branches`);
    }
  };

  const handleStarring = () => {
    if (didUserStarRepository) {
      unstarRepository(repository?.id ?? "");
      return;
    }
    starRepository(repository?.id ?? "");
  };

  const handleWatching = () => {
    if (isUserWatchingRepository) {
      unwatchRepository(repository?.id ?? "");
      return;
    }
    watchRepository(repository?.id ?? "");
  };

  return (
    <div className="w-full flex flex-col items-center pt-10">
      <div className="w-[1024px] flex justify-between">
        <div className="p-2 w-1/4">
          <div
            className="p-2 border border-gray-300 dark:border-gray-600 rounded appearance-none bg-gray-900 text-white text-sm w-full cursor-pointer flex justify-between items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span>{defaultBranch?.name}</span>
            <svg
              className={`w-3 h-3 transition-transform transform ${
                showDropdown ? "rotate-180" : ""
              }`}
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
              <div className="max-h-1/2 overflow-y-auto">
                <div
                  key={defaultBranch?.name}
                  className="flex flex-row justify-between py-1 px-3 text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => onBranchSelect(defaultBranch)}
                >
                  <span>{defaultBranch?.name}</span>
                  <div className="w-[72px] h-[20px] rounded-full text-xs text-center border border-white text-white">
                    Default
                  </div>
                </div>
                {allBranches.map((branch) => (
                  <div
                    key={branch.name}
                    className="py-1 px-3 text-white hover:bg-gray-700 cursor-pointer"
                    onClick={() => onBranchSelect(branch)}
                  >
                    {branch.name}
                  </div>
                ))}
              </div>
              <div
                className="text-center py-1 px-3 text-blue-500 cursor-pointer underline"
                onClick={() => onBranchSelect(undefined)}
              >
                View all branches
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 my-auto">

        <Button
            className="px-6 border h-10 text-sm border-gray-300 bg-gray-800 flex gap-2 hover:bg-gray-800"
            onClick={handleWatching}
          >
            <img src={eye} alt="star" className="w-[16px] my-auto h-[16px] rounded-md" />
            <div className="bg-gray-600 rounded-[50%] w-5">{usersWatchingRepository.length}</div>
            {isUserWatchingRepository ? "Unwatch" : "Watch"}
          </Button>

          <Button
            className="px-6 border h-10 text-sm border-gray-300 bg-gray-800 flex gap-2 hover:bg-gray-800"
            onClick={() => {
              navigate(`/repository/${repository?.name}/stargazers`);
            }}
          >
            Starred by
          </Button>
          <Button
            className="px-6 border h-10 text-sm border-gray-300 bg-gray-800 flex gap-2 hover:bg-gray-800"
            onClick={handleStarring}
          >
            <img src={star} alt="star" className="w-[16px] my-auto h-[16px] rounded-md" />
            <div className="bg-gray-600 rounded-[50%] w-5">{usersThatStarredRepository.length}</div>
            {didUserStarRepository ? "Unstar" : "Star"}
          </Button>
        </div>
      </div>
    </div>
  );
};
