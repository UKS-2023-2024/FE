import { useNavigate, useParams } from "react-router-dom";
import { Issue } from "../../store/model/issue.model";
import { Event } from "../../store/model/event.model";
import { formatDate } from "../../utils/helper";

interface Props {
  issue: Issue;
}

export const IssueOverview = ({ issue }: Props) => {
  const navigate = useNavigate();
  const { name } = useParams();

  const getOpenedIssueEvent = (events: Event[]) => {
    return events.find((event) => event.eventType === 0);
  };

  return (
    <div className="w-full border rounded p-6">
      <div
        onClick={() => navigate(`/repository/${name}/issues/${issue.id}`)}
        className="text-xl text-white cursor-pointer"
      >
        {issue.title}
      </div>
      <div className="text-gray-500">
        <span>
          #{issue.number} opened{" "}
          {formatDate(getOpenedIssueEvent(issue.events)?.createdAt ?? new Date()).toString() ?? ""}{" "}
          by {getOpenedIssueEvent(issue.events)?.creator.username}
        </span>
      </div>
    </div>
  );
};
