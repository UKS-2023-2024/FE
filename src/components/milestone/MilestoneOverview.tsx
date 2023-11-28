import { Milestone } from "../../store/model/milestone.model";
import { Button } from "../button/Button";
import { useDeleteMilestone } from "../../api/mutations/milestone/useDeleteMilestone";
import { useEffect } from "react";
import { currentMilestoneAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

interface Props {
  milestone: Milestone;
}

export const MilestoneOverview = ({ milestone }: Props) => {
  const { mutateAsync: deleteMilestone } = useDeleteMilestone();
  const [, setSelectedMilestone] = useAtom(currentMilestoneAtom);
  const navigate = useNavigate();

  const handleEditMilestone = () => {
    setSelectedMilestone(milestone);
    navigate("edit");
  };

  const handleDeleteMilestone = async (milestone: Milestone) => {
    await deleteMilestone(milestone?.id ?? "");
  };
  return (
    <div className="w-[70%] h-[150px] flex text-gray-400 border rounded p-6">
      <div className="flex flex-col gap-8 w-1/2">
        <div className="text-2xl">{milestone?.title}</div>
        <div className="flex gap-4">
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
        <Button className="w-[70px]" onClick={handleEditMilestone}>
          Edit
        </Button>
        <Button className="w-[70px]">Close</Button>
      </div>
      <div></div>
    </div>
  );
};