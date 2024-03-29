import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../utils/helper";
import { EventPresenter, PullRequest } from "../../store/model/pullRequest.model";

interface Props {
  pullRequest: PullRequest;
}

export const PullRequestOverview = ({ pullRequest }: Props) => {
  const navigate = useNavigate();
  const { name } = useParams();
  const sortedEvents = pullRequest.events.slice().sort((a: EventPresenter, b: EventPresenter) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  const initialEvent = sortedEvents && sortedEvents.length > 0 ? sortedEvents[0] : null;
  return (
    <div className="w-full border rounded p-6">
      <div
        onClick={() => navigate(`/repository/${name}/pull-requests/${pullRequest.id}`)}
        className="text-xl text-white cursor-pointer"
      >
        {pullRequest.title}
      </div>
      <div className="text-gray-500">
        <span>
          #{pullRequest.number} opened{" "}
          {formatDate(initialEvent?.createdAt ?? new Date()).toString() ?? ""} by{" "}
          {initialEvent?.creator}
        </span>
      </div>
    </div>
  );
};
