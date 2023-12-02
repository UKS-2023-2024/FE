import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useGetRepositoryMilestones } from "../../api/query/milestone/useGetRepositoryMilestones";
import { Button } from "../../components/button/Button";
import { useNavigate } from "react-router-dom";
import { MilestoneOverview } from "../../components/milestone/MilestoneOverview";
import { Tab } from "../../components/tab/Tab";
import { useEffect, useState } from "react";
import { Milestone } from "../../store/model/milestone.model";
import { useGetRepositoryClosedMilestones } from "../../api/query/milestone/useGetRepositoryClosedMilestones";

enum Flag {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export const RepositoryMilestonePage = () => {
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const { data: repositoryMilestones } =
    useGetRepositoryMilestones(selectedRepository);
  const { data: repositoryClosedMilestones } =
    useGetRepositoryClosedMilestones(selectedRepository);
  const [milestones, setMilestones] =
    useState<Milestone[]>(repositoryMilestones);

  useEffect(() => {
    setMilestones(repositoryMilestones);
  }, [repositoryMilestones]);

  const handleTabChange = (flag: Flag) => {
    if (flag === Flag.OPEN) {
      setMilestones(repositoryMilestones);
      return;
    }
    setMilestones(repositoryClosedMilestones);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center pt-6 gap-10">
        <div className="w-[70%] flex text-sm font-medium text-gray-500 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <Tab onClick={() => handleTabChange(Flag.OPEN)}>Open</Tab>
            <Tab onClick={() => handleTabChange(Flag.CLOSED)}>Closed</Tab>
          </ul>
        </div>
        <div className="w-[70%] flex justify-end">
          <Button onClick={() => navigate("new")}>New milestone</Button>
        </div>
        {milestones.map((milestone) => (
          <MilestoneOverview milestone={milestone} key={milestone.id} />
        ))}
      </div>
    </>
  );
};
