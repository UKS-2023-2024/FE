import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useGetRepositoryMilestones } from "../../api/query/milestone/useGetRepositoryMilestones";
import { Button } from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { MilestoneOverview } from "../../components/milestone/MilestoneOverview";

export const RepositoryMilestonePage = () => {
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: repositoryMilestones } =
    useGetRepositoryMilestones(selectedRepository);

  return (
    <div className="w-full flex flex-col items-center pt-6 gap-10">
      <div className="w-[70%] flex justify-end">
        <Button onClick={() => navigate("new")}>New milestone</Button>
      </div>
      {repositoryMilestones.map((milestone) => (
        <MilestoneOverview milestone={milestone} key={milestone.id} />
      ))}
    </div>
  );
};
