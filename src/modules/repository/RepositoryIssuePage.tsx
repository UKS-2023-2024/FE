import { useAtom } from "jotai";
import { useGetRepositoryIssues } from "../../api/query/issue/useGetRepositoryIssues";
import { Button } from "../../components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { currentRepositoryAtom } from "../../store/store";
import { IssueOverview } from "../../components/issue/IssueOverview";

export const RepositoryIssuePage = () => {
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: repositoryIssues } = useGetRepositoryIssues(selectedRepository);
  const navigate = useNavigate();
  const { name } = useParams();

  return (
    <div className="w-[1028px] mx-auto pt-8">
      <span className="text-white text-3xl font-bold">Issues</span>
      <div className="flex gap-2 my-4">
        <Button onClick={() => navigate(`/repository/${name}/milestones`)}>Milestones</Button>
        <Button onClick={() => navigate(`/repository/${name}/issues/new`)}>New issue</Button>
      </div>
      <div className="w-full flex flex-col items-center gap-4">
        {repositoryIssues?.map((issue) => (
          <IssueOverview issue={issue} key={issue.id} />
        ))}
      </div>
    </div>
  );
};
