import { useAtom } from "jotai";
import { Button } from "../../components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { currentRepositoryAtom } from "../../store/store";
import { PullRequestOverview } from "../../components/pull-request/PullRequestOverview";
import { useGetRepositoryPullRequests } from "../../api/query/pull-request/useGetRepositoryPullRequests";

export const RepositoryPullRequestPage = () => {
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: repositoryPullRequests } = useGetRepositoryPullRequests(
    selectedRepository.id ?? ""
  );
  const navigate = useNavigate();
  const { name } = useParams();

  return (
    <div className="w-[1028px] mx-auto pt-12">
      <div className="flex gap-2 mb-4">
        <Button onClick={() => navigate(`/repository/${name}/milestones`)}>Milestones</Button>
        <Button onClick={() => navigate(`/repository/${name}/pull-requests/new`)}>
          New Pull request
        </Button>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        {repositoryPullRequests != null &&
          repositoryPullRequests.map((pullRequest) => (
            <PullRequestOverview pullRequest={pullRequest} key={pullRequest.id} />
          ))}
      </div>
    </div>
  );
};
