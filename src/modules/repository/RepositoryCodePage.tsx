import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
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
import check from "./../../../public/check.png";

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
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [issuesChecked, setIssuesChecked] = useState(false);
  const [pullRequestsChecked, setPullRequestsChecked] = useState(false)

  useEffect(()=> {
    setIssuesChecked(isUserWatchingRepository === 2 || isUserWatchingRepository === 4)
    setPullRequestsChecked(isUserWatchingRepository === 3 || isUserWatchingRepository === 4)
  }, [isUserWatchingRepository])

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

  const handleUnWatch = (e: any) => {
    if (isUserWatchingRepository?.toString() != "") {
      unwatchRepository(repository?.id ?? "");
      return;
    }
  };

  const handleAllActivityWatching = (e: any) => {
    watchRepository({repositoryId: repository?.id ?? "", watchingPreferences: 0});
  }

  const handleIgnoreWatching = (e: any) => {
    watchRepository({repositoryId: repository?.id ?? "", watchingPreferences: 1});
  }

  const handleIssuesWatching = (e: any) => {
    let watchingPreferences = 2
    setIssuesChecked(e.target.checked)
    if (!e.target.checked) {
      setPullRequestsChecked(true)
      watchingPreferences = 3
    } else {
      if (pullRequestsChecked) watchingPreferences = 4
    }
    watchRepository({repositoryId: repository?.id ?? "", watchingPreferences: watchingPreferences});
  };

  const handlePullRequestsWatching = (e: any) => {
    let watchingPreferences = 3
    setPullRequestsChecked(e.target.checked) 
    if (!e.target.checked) {
      setIssuesChecked(true)
      watchingPreferences = 2
    } else {
    if (issuesChecked) watchingPreferences = 4
    }
    watchRepository({repositoryId: repository?.id ?? "", watchingPreferences: watchingPreferences});
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
            onClick={() => {
              navigate(`/repository/${repository?.name}/watchers`);
            }}
          >
            Watchers
        </Button>


        
        <div className="p w-1/4">
          <div
            className="p-2 border border-gray-300 dark:border-gray-600 rounded appearance-none bg-gray-800 text-white text-sm w-full cursor-pointer flex justify-between items-center"
            onClick={() => {
              if (showDropdown3)
              {
                setShowDropdown3(false)
                return
              }
              setShowDropdown2(!showDropdown2);
            }}
          >
            <img src={eye} alt="star" className="w-[16px] my-auto h-[16px] rounded-md" />
            <div className="ml-1 mr-2 bg-gray-600 rounded-[50%] w-5 flex justify-center">{usersWatchingRepository.length}</div>
            {isUserWatchingRepository == 0 ? "Unwatch" : "Watch"}
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

          {showDropdown2 && (
            <div className="flex flex-col text-white absolute mt-1 w-1/4 bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm">
              <div className="flex flex-row text-align-l p-3">
                <button onClick={handleUnWatch}>Participating and @mentions</button>
                { isUserWatchingRepository?.toString() == "" &&
                  <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                }
              </div>
              <hr></hr>
              <div className="flex flex-row text-align-l p-3">
                <button onClick={handleAllActivityWatching}>All activity</button>
                { isUserWatchingRepository === 0 &&
                  <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                }
              </div>
              <hr></hr>
              <div className="flex flex-row p-3">
                  <button value={1}>
                    <div onClick={handleIgnoreWatching} className="flex flex-col text-left">
                      Ignore
                      <span className="text-xs">Never be notified</span>
                    </div>
                  </button>
                  { isUserWatchingRepository === 1 &&
                    <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                  }
              </div>
              <hr></hr>
              <div className="flex flex-row p-3">
                  <button onClick={() => {setShowDropdown2(false); setShowDropdown3(true)}}>
                    <div className="flex flex-col text-left">
                      Custom
                      <span className="text-xs">Select events you want to be notified on in addition to participating and @mentions</span>
                    </div>
                    </button>
                  { (isUserWatchingRepository === 2 || isUserWatchingRepository === 3 || isUserWatchingRepository === 4) &&
                    <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                  }
              </div>
            </div>
          )}

    {showDropdown3 && (
            <div className="flex flex-col text-white absolute mt-1 w-1/5 bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-sm">
              <div className="text-align-l p-3">
              <div className="flex flex-col">
                <label className="text-white mb-2"> 
                <svg
                className={`w-3 h-3 transition-transform transform mb-2 cursor-pointer`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {setShowDropdown3(false); setShowDropdown2(true)}}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
                  <input
                  className="mr-2"
                  type="checkbox"
                  name="2"
                  checked={issuesChecked}
                  onChange={handleIssuesWatching}/>
                  Issues
                </label>

                <label className="text-white mb-2">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name="3"
                    checked={pullRequestsChecked}
                    onChange={handlePullRequestsWatching}/>
                  Pull requests
                </label>
              </div>
            </div>
          </div>
          )}
        </div>
        <div className="flex gap-3 my-auto"></div>

          <Button
            className="px-6 border h-10 text-sm border-gray-300 bg-gray-800 flex gap-2 hover:bg-gray-800"
            onClick={() => {
              navigate(`/repository/${repository?.name}/stargazers`);
            }}
          >
            Stargazers
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
