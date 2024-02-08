import { useNavigate, useParams } from "react-router-dom";
import { Event } from "../../store/model/event.model";
import { formatDate } from "../../utils/helper";
import { PullRequest } from "../../store/model/pullRequest.model";

interface Props {
  pullRequest: PullRequest;
}

export const PullRequestOverview = ({ pullRequest }: Props) => {
  const navigate = useNavigate();
  const { name } = useParams();
  const openedEvents = pullRequest.events.filter((event: Event) => event.eventType === 6);
  const initialEvent = openedEvents.reduce(function (a: Event, b: Event) {
    return a.createdAt < b.createdAt ? a : b;
  });
  return (
    <div className="w-[80%] border rounded p-6">
      <div
        // onClick={() => navigate(`/repository/${name}/pull-request/${pullRequest.id}`)}
        className="text-xl text-white cursor-pointer"
      >
        {pullRequest.title}
      </div>
      <div className="text-gray-500">
        <span>
          #{pullRequest.number} opened{" "}
          {formatDate(initialEvent.createdAt ?? new Date()).toString() ?? ""} by{" "}
          {initialEvent.creator.username}
        </span>
      </div>
    </div>
  );
};
