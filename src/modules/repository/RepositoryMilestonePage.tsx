import React from "react";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useGetRepositoryMilestones } from "../../api/query/milestone/useGetRepositoryMilestones";
import { Button } from "../../components/button/Button";
import { Milestone } from "../../store/model/milestone.model";
import { useDeleteMilestone } from "../../api/mutations/milestone/useDeleteMilestone";

export const RepositoryMilestonePage = () => {
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: repositoryMilestones } =
    useGetRepositoryMilestones(selectedRepository);
  const { mutateAsync: deleteMilestone } = useDeleteMilestone();

  const handleDeleteMilestone = async (milestone: Milestone) => {
    await deleteMilestone(milestone?.id ?? "");
  };
  return (
    <div className="w-full flex flex-col items-center pt-6">
      {repositoryMilestones.map((milestone) => (
        <div className="w-[70%] h-[150px] flex text-gray-400 border rounded p-6">
          <div className="w-1/2">
            <div className="text-2xl">{milestone?.title}</div>
            <div className="flex flex-col gap-4">
              <div>{milestone?.dueDate?.toString()}</div>
              <div>last edited...</div>
            </div>
          </div>
          <div className="w-1/2 flex items-end gap-2">
            <Button
              className="bg-red-600 hover:bg-red-500 w-[70px]"
              onClick={() => handleDeleteMilestone(milestone)}
            >
              Delete
            </Button>
            <Button className="w-[70px]">Edit</Button>
            <Button className="w-[70px]">Close</Button>
          </div>
          <div></div>
        </div>
      ))}
    </div>
  );
};
