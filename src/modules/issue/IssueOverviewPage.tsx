import { useParams } from "react-router-dom";
import { useGetRepositoryIssue } from "../../api/query/issue/useGetRepositoryIssue";
import { formatDate } from "../../utils/helper";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { RepositoryMemberPresenter } from "../../store/model/repositoryMember.model";
import { useAssignIssueToUser } from "../../api/mutations/issue/useAssignIssueToUser";
import { PlusIcon, Trash2 } from "lucide-react";
import React from "react";
import { Popper } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Event } from "../../store/model/event.model";

export const IssueOverviewPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: issue } = useGetRepositoryIssue(id ?? "");
  const { data: repositoryMembers } = useGetRepositoryMembers(
    selectedRepository.id ?? ""
  );
  const { mutateAsync: assignIssueToUser } = useAssignIssueToUser();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? "simple-popper" : undefined;

  const handleAssignUserToIssue = async (
    member: RepositoryMemberPresenter,
    flag: string
  ) => {
    let assigneeIds = issue?.assignees.map((assignee) => assignee.id);
    if (flag === "remove")
      assigneeIds = assigneeIds?.filter(
        (assigneeId) => assigneeId !== member.id
      );
    else {
      assigneeIds?.push(member.id);
    }
    await assignIssueToUser({
      id: issue?.id ?? "",
      title: issue?.title ?? "",
      description: issue?.description ?? "",
      repositoryId: issue?.repositoryId ?? "",
      labelsIds: issue?.labels ?? [],
      milestoneId: issue?.milestone,
      state: issue?.state ?? -1,
      number: issue?.number ?? -1,
      assigneesIds: assigneeIds ?? [],
    });
    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const isMemberAnAssignee = (member: RepositoryMemberPresenter): boolean => {
    return issue?.assignees.find((assignee) => assignee.id === member.id);
  };

  const constructEventMessage = (event: Event) => {
    if (event.eventType === 0) return;
    if (event.eventType === 2)
      return (
        <div>
          <span className="text-white text-lg font-bold">
            {event.creator.username}
          </span>
          <span className="text-gray-500"> assigned this issue to </span>
          <span className="text-white text-lg font-bold">
            {event.assignee.member.username}
          </span>
          <span className="text-gray-500">
            {" "}
            on {formatDate(event.createdAt)}
          </span>
        </div>
      );
    if (event.eventType === 3)
      return (
        <div>
          <span className="text-white text-lg font-bold">
            {event.creator.username}{" "}
          </span>
          <span className="text-gray-500"> unassigned this issue from </span>
          <span className="text-white text-lg font-bold">
            {event.assignee.member.username}
          </span>
          <span className="text-gray-500">
            {" "}
            on {formatDate(event.createdAt)}
          </span>
        </div>
      );
  };

  return (
    <div className="p-10">
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-4 pt-4 pb-2">
          <div className="text-3xl text-white">{issue?.title}</div>
          <div className="text-3xl text-gray-500">#{issue?.number}</div>
        </div>
        <div className="flex gap-4 text-lg text-gray-500 pb-4">
          {issue?.state === 0 ? (
            <div className="w-[80px] flex justify-center rounded-3xl bg-green-600 text-white">
              Open
            </div>
          ) : (
            <div>Closed</div>
          )}
          <div>
            <span className="font-bold">
              {issue?.events[0].creator.username}{" "}
            </span>{" "}
            opened this issue{" "}
            {formatDate(issue?.events[0].createdAt ?? new Date())}
          </div>
        </div>
        <div className="border"></div>
      </div>

      <div className="flex">
        <div className="w-[70%] flex flex-col pl-14 ">
          {issue?.events.map((event) => (
            <div className="p-4">{constructEventMessage(event)}</div>
          ))}
        </div>

        <div className="w-[30%]">
          <div>
            <div className="flex gap-2 pt-10">
              <div className="text-gray-600">Assignees</div>
              <button aria-describedby={id} type="button" onClick={handleClick}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={popperId}
              open={open}
              anchorEl={anchorEl}
              className="bg-gray-700 rounded w-[200px] p-4"
            >
              <div className="text-white">
                {repositoryMembers.map((member) => (
                  <div className="flex gap-2">
                    <div>{member.username}</div>
                    {isMemberAnAssignee(member) ? (
                      <div
                        onClick={() =>
                          handleAssignUserToIssue(member, "remove")
                        }
                      >
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div
                        onClick={() => handleAssignUserToIssue(member, "add")}
                      >
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>
            <div className="p-2">
              {issue?.assignees.map((assignee) => (
                <div className="text-white text-xl">
                  {assignee.member.username}
                </div>
              ))}
            </div>
          </div>
          <div className="border"></div>
        </div>
      </div>
    </div>
  );
};