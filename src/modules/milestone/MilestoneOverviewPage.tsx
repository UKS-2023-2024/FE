import { useAtom } from "jotai";
import { currentMilestoneAtom, currentRepositoryAtom } from "../../store/store";
import { useGetMilestone } from "../../api/query/milestone/useGetMilestone";
import { Issue } from "../../store/model/issue.model";
import { Tab } from "../../components/tab/Tab";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/helper";
import { useGetMilestoneCompletionPercentage } from "../../api/query/milestone/useGetMilestoneCompletionPercentage";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from "react-router-dom";

enum Flag {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

export const MilestoneOverviewPage = () => {
  const [selectedMilestone, setSelectedMilestone] =
    useAtom(currentMilestoneAtom);
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: milestone } = useGetMilestone(selectedMilestone.id);
  const { data: milestonePercentage } = useGetMilestoneCompletionPercentage(
    selectedMilestone.id
  );
  const [issues, setIssues] = useState<Issue[]>(
    milestone?.tasks?.filter((task) => task.type === 0 && task.state === 0)
  );
  const navigate = useNavigate();

  const handleTabChange = (flag: Flag) => {
    if (flag === Flag.OPEN) {
      setIssues(
        milestone?.tasks?.filter((task) => task.type === 0 && task.state === 0)
      );
      return;
    }
    setIssues(
      milestone?.tasks?.filter((task) => task.type === 0 && task.state === 1)
    );
    return;
  };

  const getOpenedEvent = (issue: Issue) => {
    console.log(
      "aaa",
      issue.events.find((e) => e.eventType === 0)
    );
    return issue.events.find((e) => e.eventType === 0);
  };

  const handleIssueClicked = (issue: Issue) => {
    navigate(`/repository/${selectedRepository.name}/issues/${issue.id}`);
  };

  return (
    <div className="flex flex-col p-16">
      <div className="flex flex-col gap-4 p-4">
        <div className="text-3xl text-white">{milestone?.title}</div>
        <ProgressBar completed={milestonePercentage} bgColor="green" />
        <div className="text-lg text-gray-600">Due by {milestone?.dueDate}</div>
      </div>

      <div className="border p-8 rounded-lg">
        <div className="w-[70%] flex text-sm font-medium text-gray-500 dark:text-gray-400 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px">
            <Tab onClick={() => handleTabChange(Flag.OPEN)}>Open</Tab>
            <Tab onClick={() => handleTabChange(Flag.CLOSED)}>Closed</Tab>
          </ul>
        </div>
        {issues?.map((issue) => (
          <div
            key={issue.id}
            className="flex flex-col w-full gap-4 w-1/2 border p-4"
          >
            <div
              onClick={() => handleIssueClicked(issue)}
              className="flex items-center text-2xl hover:cursor-pointer p-1 gap-2"
            >
              <span className="text-gray-400">{issue?.title} </span>
              {issue?.labels?.map((label) => (
                <span
                  style={{ color: label.color, borderColor: label.color }}
                  className={`text-xl border rounded-lg p-1`}
                >
                  {label.title}
                </span>
              ))}
            </div>
            <div className="text-gray-500 text-lg flex gap-4">
              <div>
                <span>#{issue.number} </span>
                <span>
                  opened on{" "}
                  {formatDate(getOpenedEvent(issue)?.createdAt ?? new Date())}{" "}
                  by {issue?.creator.username}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
