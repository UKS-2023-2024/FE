import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { Branch } from "../../store/model/branch.model";
import { useNavigate } from "react-router-dom";
import { useGetDefaultBranchByRepositoryId } from "../../api/query/branch/useGetDefaultBranchByRepositoryId";
import { useGetAllBranchesWithoutDefaultByRepositoryId } from "../../api/query/branch/useGetAllBranchesWithoutDefaultByRepositoryId";
import { Button } from "../../components/button/Button";
import star from "./../../assets/star.png";
import fork from "./../../assets/fork.png";
import { useDidUserStarRepository } from "../../api/query/repository/useDidUserStarRepository";
import { useFindAllUsersThatStarredRepository } from "../../api/query/repository/useFindAllUsersThatStarredRepository";
import { useStarRepository } from "../../api/mutations/repository/useStarRepository";
import { useUnstarRepository } from "../../api/mutations/repository/useUnstarRepository";
import { useIsUserWatchingRepository } from "../../api/query/repository/useIsUserWatchingRepository";
import { useWatchRepository } from "../../api/mutations/repository/useWatchRepository";
import eye from "./../../assets/eye.png";
import { useUnwatchRepository } from "../../api/mutations/repository/useUnwatchRepository";
import { useFindAllUsersWatchingRepository } from "../../api/query/repository/useFindAllUsersWatchingRepository";
import check from "./../../assets/check.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { useGetFileTree } from "../../api/query/files/useGetFileTree";
import { Select, SelectItem, SelectContent, SelectTrigger } from "../../components/select/Select";
import { FilePreview } from "./files/FilePreview";
import { useNumberOfRepositoryForks } from "../../api/query/repository/useNumberOfRepositoryForks";
import { useForkRepository } from "../../api/mutations/repository/useForkRepository";
import { useListCommits } from "../../api/query/branch/useListCommits";

export const RepositoryCodePage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: defaultBranch } = useGetDefaultBranchByRepositoryId(repository?.id ?? "");
  const { data: allBranches } = useGetAllBranchesWithoutDefaultByRepositoryId(repository?.id ?? "");
  const { mutateAsync: starRepository } = useStarRepository();
  const { mutateAsync: unstarRepository } = useUnstarRepository();
  const { mutateAsync: forkRepository } = useForkRepository();
  const { data: didUserStarRepository } = useDidUserStarRepository(repository?.id ?? "");
  const { data: usersThatStarredRepository } = useFindAllUsersThatStarredRepository(
    repository?.id ?? ""
  );
  const { data: isUserWatchingRepository } = useIsUserWatchingRepository(repository?.id ?? "");
  const { mutateAsync: watchRepository } = useWatchRepository();
  const { mutateAsync: unwatchRepository } = useUnwatchRepository();
  const { data: usersWatchingRepository } = useFindAllUsersWatchingRepository(repository?.id ?? "");
  const { data: numberOfForks } = useNumberOfRepositoryForks(repository?.id ?? "");
  const navigate = useNavigate();
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [showDropdown3, setShowDropdown3] = useState(false);
  const [issuesChecked, setIssuesChecked] = useState(false);
  const [pullRequestsChecked, setPullRequestsChecked] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>(undefined);
  const [path, setPath] = useState("/");
  const [filePath, setFilePath] = useState<string | undefined>(undefined);
  const { data: fileTree } = useGetFileTree(selectedBranch?.id, path);

  useEffect(() => {
    setIssuesChecked(isUserWatchingRepository === 2 || isUserWatchingRepository === 4);
    setPullRequestsChecked(isUserWatchingRepository === 3 || isUserWatchingRepository === 4);
  }, [isUserWatchingRepository]);

  useEffect(() => {
    if (selectedBranch) return;
    setSelectedBranch(defaultBranch);
  }, [defaultBranch]);

  const handleStarring = () => {
    if (didUserStarRepository) {
      unstarRepository(repository?.id ?? "");
      return;
    }
    starRepository(repository?.id ?? "");
  };

  const handleForking = () => {
    forkRepository(repository?.id ?? "");
  };

  const handleUnWatch = (e: any) => {
    if (isUserWatchingRepository?.toString() != "") {
      unwatchRepository(repository?.id ?? "");
      return;
    }
  };

  const handleAllActivityWatching = (e: any) => {
    watchRepository({ repositoryId: repository?.id ?? "", watchingPreferences: 0 });
  };

  const handleIgnoreWatching = (e: any) => {
    watchRepository({ repositoryId: repository?.id ?? "", watchingPreferences: 1 });
  };

  const handleIssuesWatching = (e: any) => {
    let watchingPreferences = 2;
    setIssuesChecked(e.target.checked);
    if (!e.target.checked) {
      setPullRequestsChecked(true);
      watchingPreferences = 3;
    } else {
      if (pullRequestsChecked) watchingPreferences = 4;
    }
    watchRepository({
      repositoryId: repository?.id ?? "",
      watchingPreferences: watchingPreferences,
    });
  };

  const handlePullRequestsWatching = (e: any) => {
    let watchingPreferences = 3;
    setPullRequestsChecked(e.target.checked);
    if (!e.target.checked) {
      setIssuesChecked(true);
      watchingPreferences = 2;
    } else {
      if (issuesChecked) watchingPreferences = 4;
    }
    watchRepository({
      repositoryId: repository?.id ?? "",
      watchingPreferences: watchingPreferences,
    });
  };

  const branches = useMemo(() => {
    const defaultBranchCopy = defaultBranch ? [defaultBranch] : [];
    const allBranchesCopy = allBranches ?? [];
    return [...defaultBranchCopy, ...allBranchesCopy];
  }, [allBranches, defaultBranch]);

  const onSelectValueChange = (val: string) => {
    const branch = branches.find((b) => b.id === val);
    setSelectedBranch(branch);
    setPath("/");
  };

  const handleBackFolderClick = () => {
    setPath((prevPath) => {
      const lastSlashIndex = prevPath.lastIndexOf("/");
      if (lastSlashIndex !== -1) {
        const newLastSlashIndex = prevPath.slice(0, lastSlashIndex - 1).lastIndexOf("/");
        return newLastSlashIndex !== -1 ? prevPath.slice(0, newLastSlashIndex + 1) : "/";
      } else {
        return "/";
      }
    });
  };

  const handleFileClick = (node: any) => {
    if (node.isFolder) {
      setPath(`${path}${node.name}/`);
      return;
    }

    setFilePath(`${path}${node.name}`);
    setPath(`${path}${node.name}/`);
  };

  return (
    <div className="w-full flex flex-col items-center pt-10">
      <div>
        <div className="w-[1024px] h-10 flex justify-between">
          <div className="flex gap-1 flex-1 items-center px-2">
            <Select value={selectedBranch?.id} onValueChange={onSelectValueChange}>
              <SelectTrigger className="max-w-[300px]">
                {selectedBranch?.name ?? "None"}
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    <div className="flex h-full justify-between w-[200px]">
                      <div>{b.name}</div>
                      {b.id === defaultBranch?.id && (
                        <small className="w-10 h-5 rounded-lg text-black border border-black p-1 flex items-center justify-center">
                          default
                        </small>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span
              onClick={() => navigate(`/repository/${repository?.name}/branches`)}
              className="cursor-pointer text-xs break-keep pl-2 text-white hover:underline"
            >
              View All Branches
            </span>
            <span
              onClick={() => navigate(`/repository/${repository?.name}/branches/${selectedBranch?.id}/commits`)}
              className="cursor-pointer text-xs break-keep pl-2 text-white hover:underline"
            >
              Commits
            </span>
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
                className="p-2 h-10 border border-gray-300 dark:border-gray-600 rounded appearance-none bg-gray-800 text-white text-sm w-full cursor-pointer flex justify-between items-center"
                onClick={() => {
                  if (showDropdown3) {
                    setShowDropdown3(false);
                    return;
                  }
                  setShowDropdown2(!showDropdown2);
                }}
              >
                <img src={eye} alt="star" className="w-[16px] my-auto h-[16px] rounded-md" />
                <div className="ml-1 mr-2 bg-gray-600 rounded-[50%] w-5 flex justify-center">
                  {usersWatchingRepository.length}
                </div>
                {isUserWatchingRepository == 0 ? "Unwatch" : "Watch"}
                <svg
                  className={`w-3 h-3 transition-transform transform ${showDropdown2 ? "rotate-180" : ""
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
                  <div className="flex text-align-l p-3">
                    <button onClick={handleUnWatch}>Participating and @mentions</button>
                    {isUserWatchingRepository?.toString() == "" && (
                      <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                    )}
                  </div>
                  <hr></hr>
                  <div className="flex text-align-l p-3">
                    <button onClick={handleAllActivityWatching}>All activity</button>
                    {isUserWatchingRepository === 0 && (
                      <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                    )}
                  </div>
                  <hr></hr>
                  <div className="flex p-3">
                    <button value={1}>
                      <div onClick={handleIgnoreWatching} className="flex flex-col text-left">
                        Ignore
                        <span className="text-xs">Never be notified</span>
                      </div>
                    </button>
                    {isUserWatchingRepository === 1 && (
                      <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                    )}
                  </div>
                  <hr></hr>
                  <div className="flex p-3">
                    <button
                      onClick={() => {
                        setShowDropdown2(false);
                        setShowDropdown3(true);
                      }}
                    >
                      <div className="flex flex-col text-left">
                        Custom
                        <span className="text-xs">
                          Select events you want to be notified on in addition to participating and
                          @mentions
                        </span>
                      </div>
                    </button>
                    {(isUserWatchingRepository === 2 ||
                      isUserWatchingRepository === 3 ||
                      isUserWatchingRepository === 4) && (
                        <img src={check} className="ml-5 w-[16px] my-auto h-[16px] rounded-md" />
                      )}
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
                          onClick={() => {
                            setShowDropdown3(false);
                            setShowDropdown2(true);
                          }}
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
                          onChange={handleIssuesWatching}
                        />
                        Issues
                      </label>

                      <label className="text-white mb-2">
                        <input
                          className="mr-2"
                          type="checkbox"
                          name="3"
                          checked={pullRequestsChecked}
                          onChange={handlePullRequestsWatching}
                        />
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
              <div className="bg-gray-600 rounded-[50%] w-5">
                {usersThatStarredRepository.length}
              </div>
              {didUserStarRepository ? "Unstar" : "Star"}
            </Button>
          </div>
          <Button
            className="px-6 ml-4 border h-10 text-sm border-gray-300 bg-gray-800 flex gap-2 hover:bg-gray-800"
            onClick={handleForking}
          >
            <img src={fork} alt="fork" className="w-[16px] my-auto h-[16px] rounded-md" />
            <div className="bg-gray-600 rounded-[50%] w-5">{numberOfForks}</div>
            Fork
          </Button>
        </div>
      </div>

      <div className="w-full mt-10 flex flex-col gap-1">
        {path != "/" && (
          <div key="back" className="flex w-3/4 mx-auto">
            <div
              className={`flex items-center text-gray-400 border border-gray-500 rounded-lg p-3 w-full`}
            >
              <FontAwesomeIcon icon={faFolder} className="icon white" />
              <div className="ml-3 cursor-pointer" onClick={handleBackFolderClick}>
                ...
              </div>
            </div>
          </div>
        )}
        {(!filePath || !path.includes(filePath ?? "")) &&
          fileTree.map((node: any) => (
            <div key={node.name} className="flex w-3/4 mx-auto">
              <div
                className={`flex items-center text-gray-400 border border-gray-500 rounded-lg p-3 w-full`}
              >
                <FontAwesomeIcon icon={node.isFolder ? faFolder : faFile} className="icon white" />
                <div className="ml-3 cursor-pointer" onClick={() => handleFileClick(node)}>
                  {node.name}
                </div>
              </div>
            </div>
          ))}
        {!!filePath && path.includes(filePath ?? "") && (
          <FilePreview branchId={selectedBranch?.id} path={filePath} />
        )}
      </div>
    </div>
  );
};
