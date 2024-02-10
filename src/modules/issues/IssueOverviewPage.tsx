import { useParams } from "react-router-dom";
import { useGetRepositoryIssue } from "../../api/query/issue/useGetRepositoryIssue";
import { formatDate } from "../../utils/helper";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { RepositoryMemberPresenter } from "../../store/model/repositoryMember.model";
import { useAssignIssueToUser } from "../../api/mutations/issue/useAssignIssueToUser";
import { PlusIcon, Trash2, SmilePlus, SmilePlusIcon } from "lucide-react";
import React from "react";
import {
  FormControl,
  MenuItem,
  Popper,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { Event } from "../../store/model/event.model";
import { useGetRepositoryMilestones } from "../../api/query/milestone/useGetRepositoryMilestones";
import { useAssignMilestoneToIssue } from "../../api/mutations/issue/useAssignMilestoneToIssue";
import { useUnassignMilestoneFromIssue } from "../../api/mutations/issue/useUnassignMilestoneFromIssue";
import { useGetIssueEvents } from "../../api/query/issue/useGetIssueEvents";
import { Button } from "../../components";
import { useCloseIssue } from "../../api/mutations/issue/useCloseIssue";
import { useReopenIssue } from "../../api/mutations/issue/useReopenIssue";
import MilestoneProgressBar from "../../components/milestoneProgressBar/milestoneProgressBar";
import { useAddIssueComment } from "../../api/mutations/comment/useAddIssueComment";
import EmojiPicker from "emoji-picker-react";
import { useAddReaction } from "../../api/mutations/reaction/useAddReaction";
import { Reaction } from "../../store/model/reaction.model";
import { Comment } from "../../store/model/comment.model";

export const IssueOverviewPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const { data: issue } = useGetRepositoryIssue(id ?? "");
  const { data: repositoryMembers } = useGetRepositoryMembers(
    selectedRepository.id ?? ""
  );
  const { data: repositoryMilestones } =
    useGetRepositoryMilestones(selectedRepository);
  const { data: issueEvents } = useGetIssueEvents(id ?? "");

  const { mutateAsync: assignIssueToUser } = useAssignIssueToUser();
  const { mutateAsync: assignMilestoneToIssue } = useAssignMilestoneToIssue();
  const { mutateAsync: unassignMilestoneFromIssue } =
    useUnassignMilestoneFromIssue();
  const { mutateAsync: closeIssue } = useCloseIssue();
  const { mutateAsync: reopenIssue } = useReopenIssue();
  const { mutateAsync: addComment } = useAddIssueComment();
  const { mutateAsync: addReaction } = useAddReaction();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [emojiPopper, setEmojiPopper] = React.useState<null | HTMLElement>(
    null
  );
  const [reactionPopper, setReactionPopper] =
    React.useState<null | HTMLElement>(null);

  const [selectedMilestone, setSelectedMilestone] = React.useState(
    issue?.milestone?.id ?? ""
  );
  const [currentComment, setCurrentComment] = React.useState("");
  const [displayedReactions, setDisplayedReactions] = React.useState<string[]>(
    []
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleOpenEmojiPicker = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiPopper(emojiPopper ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const emojiOpen = Boolean(emojiPopper);
  const reactionsOpen = Boolean(reactionPopper);

  const popperId = open ? "simple-popper" : undefined;
  const emojiPopperId = emojiOpen ? "simple-popper" : undefined;
  const reactionsPopperId = reactionsOpen ? "simple-popper" : undefined;

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
      milestoneId: issue?.milestone.id,
      state: issue?.state ?? -1,
      number: issue?.number ?? -1,
      assigneesIds: assigneeIds ?? [],
    });
    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const isMemberAnAssignee = (member: RepositoryMemberPresenter): boolean => {
    return issue?.assignees.find((assignee) => assignee.id === member.id);
  };

  const handleMilestoneChange = async (event: SelectChangeEvent) => {
    setSelectedMilestone(event.target.value);
    if (issue?.milestone) {
      await unassignMilestoneFromIssue({
        id: issue?.id ?? "",
        title: issue?.title ?? "",
        description: issue?.description ?? "",
        repositoryId: issue?.repositoryId ?? "",
        labelsIds: issue?.labels ?? [],
        milestoneId: event.target.value,
        state: issue?.state ?? -1,
        number: issue?.number ?? -1,
        assigneesIds: issue?.assignees.map((assignee) => assignee.id) ?? [],
      });
    } else {
      await assignMilestoneToIssue({
        id: issue?.id ?? "",
        title: issue?.title ?? "",
        description: issue?.description ?? "",
        repositoryId: issue?.repositoryId ?? "",
        labelsIds: issue?.labels ?? [],
        milestoneId: event.target.value,
        state: issue?.state ?? -1,
        number: issue?.number ?? -1,
        assigneesIds: issue?.assignees.map((assignee) => assignee.id) ?? [],
      });
    }

    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const handleCloseIssue = async () => {
    await closeIssue(issue?.id ?? "");
    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const handleReopenIssue = async () => {
    await reopenIssue(issue?.id ?? "");
    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const handleAddComment = async () => {
    await addComment({
      taskId: issue?.id ?? "",
      content: currentComment,
    });
    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const handleEmojiClicked = async (event, commentId: string) => {
    await addReaction({
      commentId,
      emojiCode: event.unified,
    });
    queryClient.invalidateQueries(["repository-issue", id]);
  };

  const getUniqueValues = (reactions: Reaction[]): Reaction[] => {
    const seenReactions = new Set<string>();
    return reactions.filter((reaction) => {
      if (!seenReactions.has(reaction.emojiCode)) {
        seenReactions.add(reaction.emojiCode);
        return true;
      }
      return false;
    });
  };

  const displayUsersWithReaction = (
    reaction: Reaction,
    comment: Comment,
    event
  ) => {
    const reactions = comment.reactions.filter(
      (r) => r.emojiCode === reaction.emojiCode
    );
    const usernames = reactions?.map((r) => r.creator.username);
    setDisplayedReactions(usernames);
    console.log("evnt", event);
    setReactionPopper(reactionPopper ? null : event.currentTarget);
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
    if (event.eventType === 4)
      return (
        <div>
          <span className="text-white text-lg font-bold">
            {event.creator.username}{" "}
          </span>
          <span className="text-gray-500"> added this issue to </span>
          <span className="text-white text-lg font-bold">
            {event?.milestone?.title ?? ""} milestone
          </span>
          <span className="text-gray-500">
            {" "}
            on {formatDate(event.createdAt)}
          </span>
        </div>
      );
    if (event.eventType === 5)
      return (
        <div>
          <span className="text-white text-lg font-bold">
            {event.creator.username}{" "}
          </span>
          <span className="text-gray-500"> removed this issue from </span>
          <span className="text-white text-lg font-bold">
            {event?.milestone?.title ?? ""} milestone
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
          <div className="text-3xl text-white">{issue?.title ?? ""}</div>
          <div className="text-3xl text-gray-500">#{issue?.number}</div>
        </div>
        <div className="flex gap-4 text-lg text-gray-500 pb-4">
          {issue?.state === 0 ? (
            <div className="w-[80px] flex justify-center rounded-3xl bg-green-600 text-white">
              Open
            </div>
          ) : (
            <div className="w-[80px] flex justify-center rounded-3xl bg-red-600 text-white">
              Closed
            </div>
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
          {issueEvents?.map((event) => (
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

          <div>
            <div className="flex gap-2 mt-4">
              <div className="text-gray-600">Milestone</div>
            </div>
            <FormControl fullWidth variant="standard">
              <Select
                labelId="demo-simple-select-standard-label"
                defaultValue={issue?.milestone?.title ?? ""}
                id="demo-simple-select-standard"
                value={selectedMilestone}
                onChange={handleMilestoneChange}
                className="bg-white"
              >
                <MenuItem value={""} className="w-full flex gap-3">
                  <span>Clear</span>
                </MenuItem>
                {repositoryMilestones.map((milestone) => (
                  <MenuItem
                    key={milestone.id}
                    value={milestone.id}
                    className="w-full flex gap-3"
                  >
                    <span>{milestone.title ?? ""}</span>
                    {milestone.closed ? (
                      <span className="bg-red-600 text-white rounded-xl p-1">
                        closed
                      </span>
                    ) : (
                      <span className="bg-green-600 text-white rounded-xl p-1">
                        open
                      </span>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="mt-2">
              {selectedMilestone && (
                <MilestoneProgressBar
                  milestoneId={selectedMilestone}
                ></MilestoneProgressBar>
              )}
            </div>
          </div>
          <div className="mt-5 border"></div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-white text-xl">Leave comment</span>
        <textarea
          name=""
          onChange={(e) => setCurrentComment(e.target.value)}
        ></textarea>
        <div className="flex justify-end">
          <Button onClick={handleAddComment} className="w-[150px]">
            Comment
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-white text-xl">Comments</span>
        {issue?.comments.map((comment) => (
          <div className="text-white text border rounded-xl">
            <div className="bg-blue-900 rounded-xl p-2">
              {comment.creator.username} added this at{" "}
              {formatDate(comment.createdAt)}
            </div>
            <div className="p-2">
              <div className="text-xl p-4">{comment.content}</div>
              <div className="flex gap-4">
                {getUniqueValues(comment.reactions).map(
                  (reaction: Reaction) => (
                    <>
                      <div
                        onClick={(e) =>
                          displayUsersWithReaction(reaction, comment, e)
                        }
                      >
                        {String.fromCodePoint(
                          parseInt(`0x${reaction.emojiCode}`)
                        )}
                      </div>
                      <Popper
                        className="bg-white p-4 flex flex-col"
                        id={reactionsPopperId}
                        open={reactionsOpen}
                        anchorEl={reactionPopper}
                      >
                        {displayedReactions.map((reaction) => (
                          <div>{reaction}</div>
                        ))}
                      </Popper>
                    </>
                  )
                )}
              </div>
              <div className="flex justify-end pr-6">
                <SmilePlusIcon onClick={handleOpenEmojiPicker}></SmilePlusIcon>
                <Popper
                  id={emojiPopperId}
                  open={emojiOpen}
                  anchorEl={emojiPopper}
                >
                  <EmojiPicker
                    onEmojiClick={(e) => handleEmojiClicked(e, comment.id)}
                  />
                </Popper>
              </div>
            </div>
          </div>
        ))}
        <div></div>
      </div>
      {issue?.state === 0 ? (
        <Button onClick={handleCloseIssue}>Close issue</Button>
      ) : (
        <Button onClick={handleReopenIssue}>Reopen issue</Button>
      )}
    </div>
  );
};
