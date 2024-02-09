import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components";
import { useClosePullRequest } from "../../api/mutations/pull-request/useClosePullRequest";
import { useReopenPullRequest } from "../../api/mutations/pull-request/useReopenPullRequest";
import { useGetPullRequest } from "../../api/query/pull-request/useGetPullRequest";
import { useGetPullRequestEvents } from "../../api/query/pull-request/useGetPullRequestEvents";
import { Popper } from "@mui/material";
import { PlusIcon, Trash2 } from "lucide-react";
import { Issue } from "../../store/model/issue.model";
import React, { useEffect, useState } from "react";
import { useGetRepositoryIssues } from "../../api/query/issue/useGetRepositoryIssues";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";
import { useAssignIssuesToPullRequest } from "../../api/mutations/pull-request/useAssignIssuesToPullRequest";


export const PullRequestOverviewPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: pr, refetch: refetchPr } = useGetPullRequest(id ?? "");

  const { data: prEvents, refetch: refetchPrEvents } = useGetPullRequestEvents(id ?? "");

  const { mutateAsync: closePr } = useClosePullRequest();
  const { mutateAsync: reopenPr } = useReopenPullRequest();


  const handleCloseIssue = async () => {
    await closePr(pr?.id ?? "");
    queryClient.invalidateQueries(["repository-pull-request", id]);
  };

  const handleReopenIssue = async () => {
    await reopenPr(pr?.id ?? "");
    queryClient.invalidateQueries(["repository-pull-request", id]);
  };

  const { mutateAsync: assignIssuesToPullRequest } = useAssignIssuesToPullRequest();
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const { data: repositoryIssues } = useGetRepositoryIssues(selectedRepository);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const popperId = open ? "simple-popper" : undefined;

  const isIssueSelected = (issueToCheck: Issue) => {
    return selectedIssues.findIndex((issue) => issue.id === issueToCheck.id) != -1;
  };
  const removeIssue = async (issueToRemove: Issue) => {
    setSelectedIssues(selectedIssues.filter((issue) => issueToRemove.id !== issue.id));
    await assignIssuesToPullRequest({id: pr?.id ?? "", issueIds: selectedIssues.filter((issue) => issueToRemove.id !== issue.id).map(issue => issue.id)})
    queryClient.invalidateQueries(["repository-pull-request", id]);
    queryClient.invalidateQueries(["pull-request-events", id])
  };
  const AddIssue = async (issueToAdd: Issue) => {
    setSelectedIssues([...selectedIssues, issueToAdd]);
    await assignIssuesToPullRequest({id: pr?.id ?? "", issueIds: [...selectedIssues, issueToAdd].map(issue => issue.id)})
    queryClient.invalidateQueries(["repository-pull-request", id]);
    queryClient.invalidateQueries(["pull-request-events", id])
  };

  useEffect(() => {
    setSelectedIssues(Array.isArray(pr?.issues) ? pr.issues : []);
  }, [pr])
  
  return (
    <div className="p-10">
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-4 pt-4 pb-2">
          <div className="text-3xl text-white">{pr?.title ?? ""}</div>
          <div className="text-3xl text-gray-500">#{pr?.number}</div>
        </div>
        <div className="flex gap-4 text-lg text-gray-500 pb-4">
          {pr?.state === 0  &&
            <div className="w-[80px] flex justify-center rounded-3xl bg-green-600 text-white">
              Open
            </div>
          }
          {pr?.state === 1  &&
            <div className="w-[80px] flex justify-center rounded-3xl bg-red-600 text-white">
              Closed
            </div>
          }
          {pr?.state === 3  &&
            <div className="w-[80px] flex justify-center rounded-3xl bg-green-600 text-white">
              Merged
            </div>
          }
          <div>
            <span className="font-bold">
              {pr?.events[0].creator.username}{" "}
            </span>{" "}
          wants to merge into {pr?.toBranch} from {pr?.fromBranch}
            
          </div>
        </div>
        <div className="border"></div>
      </div>

      <div className="flex flex-col">
        <div className="flex">
          <div className="w-[70%] flex flex-col pl-14 ">
            {prEvents?.map((event) => (
                <div key={event.id} className="mt-1">
                  <span className="text-white text-lg font-bold">
                    {event.creator.username}
                  </span>
                  <span className="text-gray-500"> {event.title}</span>
                  <span className="text-gray-500">
                    {" "}
                    on {formatDate(event.createdAt)}
                  </span>
              </div>
              ))}
          </div>
          <div>
            <div className="flex gap-2 pt-10">
              <div className="text-gray-600">Issues</div>
              <button aria-describedby={id} type="button" onClick={handleClick}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={popperId}
              open={open}
              anchorEl={anchorEl}
              className="bg-gray-700 rounded w-[200px] p-4"
            >
              <div className="text-white">
                {repositoryIssues.map((issue: Issue) => (
                  <div className="flex gap-2" key={issue.id}>
                    <div>
                      #{issue.number} {issue.title}
                    </div>
                    {isIssueSelected(issue) ? (
                      <div onClick={() => removeIssue(issue)}>
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div onClick={() => AddIssue(issue)}>
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>
            <div className="p-1">
              {selectedIssues.map((issue) => (
                <div key={issue.id} className="text-white text-l">
                  #{issue.number} {issue.title}
                </div>
              ))}
            </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-full mt-10">
      {pr?.state === 0 ? (
        <Button onClick={handleCloseIssue}>Close pull request</Button>
      ) : (
        <Button onClick={handleReopenIssue}>Reopen pull request</Button>
      )}
      </div>
    </div>
    </div>
  );
};
