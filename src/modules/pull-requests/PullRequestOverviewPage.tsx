import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components";
import { useClosePullRequest } from "../../api/mutations/pull-request/useClosePullRequest";
import { useReopenPullRequest } from "../../api/mutations/pull-request/useReopenPullRequest";
import { useGetPullRequest } from "../../api/query/pull-request/useGetPullRequest";
import { useGetPullRequestEvents } from "../../api/query/pull-request/useGetPullRequestEvents";


export const PullRequestOverviewPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: pr } = useGetPullRequest(id ?? "");

  const { data: prEvents } = useGetPullRequestEvents(id ?? "");

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
