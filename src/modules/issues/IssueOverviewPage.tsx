import { useNavigate, useParams } from "react-router-dom";
import { useGetRepositoryIssue } from "../../api/query/issue/useGetRepositoryIssue";
import { formatDate } from "../../utils/helper";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { currentRepositoryAtom, currentUserAtom } from "../../store/store";
import { useAtom } from "jotai";
import { RepositoryMemberPresenter } from "../../store/model/repositoryMember.model";
import { useAssignIssueToUser } from "../../api/mutations/issue/useAssignIssueToUser";
import { PlusIcon, Trash2, SmilePlusIcon } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { FormControl, MenuItem, Popper, Select, SelectChangeEvent } from "@mui/material";
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
import { Comment, CommentHierarchy } from "../../store/model/comment.model";
import { useDeleteReaction } from "../../api/mutations/reaction/useDeleteReaction";
import { useGetRepositoryLabels } from "../../api/query/labels/useGetRepositoryLabels";
import { Label } from "../../store/model/label.model";
import { useAssignLabelToIssue } from "../../api/mutations/label/useAssignLabelToIssue";
import { useUnassignLabelFromIssue } from "../../api/mutations/label/useUnassignLabelFromIssue";
import { Input } from "../../components/input/Input";
import { Reply } from "../../components/comment/Reply";
import { CommentView } from "../../components/comment/CommentView";
import { useGetTaskComments } from "../../api/query/comment/useGetTaskComments";

export const IssueOverviewPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const [currentUser] = useAtom(currentUserAtom);

  const [search, setSearch] = useState<string>("");
  const [commentToReply, setCommentToReply] = useState<any>();
  const [commentForReaction, setCommentForReaction] = useState<Comment>();

  const { data: issue } = useGetRepositoryIssue(id ?? "");
  const { data: repositoryMembers } = useGetRepositoryMembers(selectedRepository.id ?? "");
  const { data: repositoryMilestones } = useGetRepositoryMilestones(selectedRepository);
  const { data: issueEvents } = useGetIssueEvents(id ?? "");
  const { data: repositoryLabels } = useGetRepositoryLabels(selectedRepository, search);
  const { data: comments } = useGetTaskComments(id ?? "");

  const { mutateAsync: assignIssueToUser } = useAssignIssueToUser();
  const { mutateAsync: assignMilestoneToIssue } = useAssignMilestoneToIssue();
  const { mutateAsync: unassignMilestoneFromIssue } = useUnassignMilestoneFromIssue();
  const { mutateAsync: closeIssue } = useCloseIssue();
  const { mutateAsync: reopenIssue } = useReopenIssue();
  const { mutateAsync: addComment } = useAddIssueComment();
  const { mutateAsync: addReaction } = useAddReaction();
  const { mutateAsync: deleteReaction } = useDeleteReaction();
  const { mutateAsync: assignLabel } = useAssignLabelToIssue();
  const { mutateAsync: unassignLabel } = useUnassignLabelFromIssue();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [emojiPopper, setEmojiPopper] = React.useState<null | HTMLElement>(null);
  const [reactionPopper, setReactionPopper] = React.useState<null | HTMLElement>(null);
  const [labelPopper, setLabelPopper] = React.useState<null | HTMLElement>(null);
  const [selectedmilestoneId, setSelectedMilestoneId] = useState<string>("");

  const [currentComment, setCurrentComment] = React.useState("");
  const [replyComment, setReplyComment] = React.useState("");

  const [displayedReactions, setDisplayedReactions] = React.useState<string[]>([]);
  const [commentReactionForDeletion, setCommentReactionForDeletion] = useState<Comment>();
  const [reactionForDeletion, setReactionForDeletion] = useState<Reaction>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleOpenEmojiPicker = (event: React.MouseEvent<HTMLElement>, comment: Comment) => {
    setCommentForReaction(comment);
    setEmojiPopper(emojiPopper ? null : event.currentTarget);
  };

  useEffect(() => {
    setSelectedMilestoneId(issue?.milestone?.id ?? "");
  }, [issue]);

  const handleAddLabelClick = (event: React.MouseEvent<HTMLElement>) => {
    setLabelPopper(labelPopper ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const emojiOpen = Boolean(emojiPopper);
  const reactionsOpen = Boolean(reactionPopper);
  const labelPopperOpen = Boolean(labelPopper);

  const popperId = open ? "simple-popper" : undefined;
  const emojiPopperId = emojiOpen ? "simple-popper" : undefined;
  const reactionsPopperId = reactionsOpen ? "simple-popper" : undefined;
  const labelPopperId = labelPopperOpen ? "simple-popper" : undefined;

  const handleAssignUserToIssue = async (member: RepositoryMemberPresenter, flag: string) => {
    let assigneeIds = issue?.assignees.map((assignee) => assignee.id);
    if (flag === "remove")
      assigneeIds = assigneeIds?.filter((assigneeId) => assigneeId !== member.id);
    else {
      assigneeIds?.push(member.id);
    }
    await assignIssueToUser({
      id: issue?.id ?? "",
      title: issue?.title ?? "",
      description: issue?.description ?? "",
      repositoryId: issue?.repositoryId ?? "",
      labelsIds: issue?.labels.map((l) => l.id) ?? [],
      milestoneId: issue?.milestone?.id ?? "",
      state: issue?.state ?? -1,
      number: issue?.number ?? -1,
      assigneesIds: assigneeIds ?? [],
    });
    queryClient.invalidateQueries({ queryKey: ["repository-issue", id] });
    queryClient.invalidateQueries({ queryKey: ["issue-events", id] });
  };

  const isMemberAnAssignee = (member: RepositoryMemberPresenter): boolean => {
    return issue?.assignees.find((assignee) => assignee.id === member.id);
  };

  const isLabelAssigned = (label: Label): boolean => {
    return issue?.labels.find((l) => l.title === label.title);
  };

  const handleMilestoneChange = async (event: SelectChangeEvent) => {
    setSelectedMilestoneId(event.target.value);
    if (issue?.milestone) {
      await unassignMilestoneFromIssue({
        id: issue?.id ?? "",
        title: issue?.title ?? "",
        description: issue?.description ?? "",
        repositoryId: issue?.repositoryId ?? "",
        labelsIds: issue?.labels.map((l) => l.id) ?? [],
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
        labelsIds: issue?.labels.map((l) => l.id) ?? [],
        milestoneId: event.target.value,
        state: issue?.state ?? -1,
        number: issue?.number ?? -1,
        assigneesIds: issue?.assignees.map((assignee) => assignee.id) ?? [],
      });
    }
    queryClient.invalidateQueries({ queryKey: ["repository-issue", id] });
    queryClient.invalidateQueries({ queryKey: ["issue-events", id] });
  };

  const handleAssignLabelToIssue = async (label: Label) => {
    await assignLabel({
      id: issue?.id ?? "",
      title: issue?.title ?? "",
      description: issue?.description ?? "",
      repositoryId: issue?.repositoryId ?? "",
      labelsIds: [...issue?.labels.map((l) => l.id), label.id],
      milestoneId: issue?.milestone?.id ?? "",
      state: issue?.state ?? -1,
      number: issue?.number ?? -1,
      assigneesIds: issue?.assignees.map((assignee) => assignee.id) ?? [],
    });
    queryClient.invalidateQueries({ queryKey: ["repository-issue", id] });
    queryClient.invalidateQueries({ queryKey: ["issue-events", id] });
  };

  const handleUnassignLabelToIssue = async (label: Label) => {
    await unassignLabel({
      id: issue?.id ?? "",
      title: issue?.title ?? "",
      description: issue?.description ?? "",
      repositoryId: issue?.repositoryId ?? "",
      labelsIds: [label.id],
      milestoneId: issue?.milestone?.id ?? "",
      state: issue?.state ?? -1,
      number: issue?.number ?? -1,
      assigneesIds: issue?.assignees.map((assignee) => assignee.id) ?? [],
    });
    queryClient.invalidateQueries({ queryKey: ["repository-issue", id] });
    queryClient.invalidateQueries({ queryKey: ["issue-events", id] });
  };

  const handleCloseIssue = async () => {
    await closeIssue(issue?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["repository-issue", id] });
    queryClient.invalidateQueries({ queryKey: ["issue-events", id] });
  };

  const handleReopenIssue = async () => {
    await reopenIssue(issue?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["repository-issue", id] });
    queryClient.invalidateQueries({ queryKey: ["issue-events", id] });
  };

  const handleAddComment = async () => {
    await addComment({
      taskId: issue?.id ?? "",
      content: currentComment,
      parentId: null,
    });
    queryClient.invalidateQueries({ queryKey: ["task-comments", id] });
  };

  const handleDeleteReaction = async (username: string) => {
    const reactions = commentReactionForDeletion?.reactions.filter(
      (r) => r.emojiCode === reactionForDeletion?.emojiCode
    );
    const foundReactionForDeletion = reactions?.find((r) => r.creator.username === username);
    await deleteReaction(foundReactionForDeletion?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["task-comments", id] });
  };

  const handleEmojiClicked = async (event) => {
    await addReaction({
      commentId: commentForReaction?.id ?? "",
      emojiCode: event.unified,
    });
    queryClient.invalidateQueries({ queryKey: ["task-comments", id] });
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

  const displayUsersWithReaction = (reaction: Reaction, comment: Comment, event) => {
    setCommentReactionForDeletion(comment);
    setReactionForDeletion(reaction);
    const reactions = comment.reactions.filter((r) => r.emojiCode === reaction.emojiCode);
    const usernames = reactions?.map((r) => r.creator.username);
    setDisplayedReactions(usernames);
    setReactionPopper(reactionPopper ? null : event.currentTarget);
  };

  const constructEventMessage = (event: Event) => {
    if (event.eventType === 0) return;
    if (event.eventType === 2)
      return (
        <div>
          <span className="text-white text-lg font-bold">{event.creator.username}</span>
          <span className="text-gray-500"> assigned this issue to </span>
          <span className="text-white text-lg font-bold">{event.assignee?.member?.username}</span>
          <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
        </div>
      );
    if (event.eventType === 3)
      return (
        <div>
          <span className="text-white text-lg font-bold">{event.creator.username} </span>
          <span className="text-gray-500"> unassigned this issue from </span>
          <span className="text-white text-lg font-bold">{event.assignee.member.username}</span>
          <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
        </div>
      );
    if (event.eventType === 4)
      return (
        <div>
          <span className="text-white text-lg font-bold">{event.creator.username} </span>
          <span className="text-gray-500"> added this issue to </span>
          <span className="text-white text-lg font-bold">
            {event?.milestone?.title ?? ""} milestone
          </span>
          <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
        </div>
      );
    if (event.eventType === 5)
      return (
        <div>
          <span className="text-white text-lg font-bold">{event.creator.username} </span>
          <span className="text-gray-500"> removed this issue from </span>
          <span className="text-white text-lg font-bold">
            {event?.milestone?.title ?? ""} milestone
          </span>
          <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
        </div>
      );
    if (event.eventType === 11)
      return (
        <div>
          <span className="text-white text-lg font-bold">{event.creator.username} </span>
          <span className="text-gray-500"> added the </span>
          <span className="text-white text-lg font-bold">
            <span
              style={{
                color: event?.label?.color,
                borderColor: event?.label?.color,
              }}
              className="border rounded-md px-2 text-md"
            >
              {event?.label?.title ?? ""}
            </span>{" "}
            label
          </span>
          <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
        </div>
      );
    if (event.eventType === 12)
      return (
        <div>
          <span className="text-white text-lg font-bold">{event.creator.username} </span>
          <span className="text-gray-500"> removed the </span>
          <span className="text-white text-lg font-bold">
            <span
              style={{
                color: event?.label?.color,
                borderColor: event?.label?.color,
              }}
              className="border rounded-md px-2 text-md"
            >
              {event?.label?.title ?? ""}
            </span>{" "}
            label
          </span>
          <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
        </div>
      );
  };

  const handleLabelsClick = () => {
    navigate(`/repository/${selectedRepository.name}/issues/labels`);
  };

  const handleFilterLabels = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleReplyToComment = async () => {
    await addComment({
      taskId: issue?.id ?? "",
      content: replyComment,
      parentId: commentToReply.id,
    });
    queryClient.invalidateQueries({ queryKey: ["task-comments", id] });
  };

  return (
    <div className="pt-12 w-[1028px] mx-auto">
      <div className="w-full">
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
            <span className="font-bold">{issue?.events[0].creator.username} </span> opened this
            issue {formatDate(issue?.events[0].createdAt ?? new Date())}
          </div>
        </div>
        <div className="border"></div>
      </div>

      <div className="flex">
        <div className="flex-grow">
          {issueEvents?.map((event) => (
            <div className="mt-1" key={event.id}>
              {constructEventMessage(event)}
            </div>
          ))}
        </div>

        <div className="w-[285px]">
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
                  <div className="flex gap-2" key={member.id}>
                    <div>{member.username}</div>
                    {isMemberAnAssignee(member) ? (
                      <div onClick={() => handleAssignUserToIssue(member, "remove")}>
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div onClick={() => handleAssignUserToIssue(member, "add")}>
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>
            <div className="p-2">
              {issue?.assignees.map((assignee, index) => (
                <div className="text-white text-xl" key={index}>
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
                label="demo-simple-select-standard-label"
                defaultValue={issue?.milestone?.title ?? ""}
                id="demo-simple-select-standard"
                value={selectedmilestoneId}
                onChange={handleMilestoneChange}
                className="bg-white"
              >
                <MenuItem value={""} className="w-full flex gap-3">
                  <span>Clear</span>
                </MenuItem>
                {repositoryMilestones.map((milestone) => (
                  <MenuItem key={milestone.id} value={milestone.id} className="w-full flex gap-3">
                    <span>{milestone.title ?? ""}</span>
                    {milestone.closed ? (
                      <span className="bg-red-600 text-white rounded-xl p-1">closed</span>
                    ) : (
                      <span className="bg-green-600 text-white rounded-xl p-1">open</span>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <div className="mt-2">
              {selectedmilestoneId && (
                <MilestoneProgressBar milestoneId={selectedmilestoneId}></MilestoneProgressBar>
              )}
            </div>
          </div>
          <div className="mt-5 border"></div>
          <div>
            <div className="flex gap-2 mt-4">
              <div className="text-gray-600">Labels</div>
              <button aria-describedby={id} type="button" onClick={handleAddLabelClick}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={labelPopperId}
              open={labelPopperOpen}
              anchorEl={labelPopper}
              className="bg-gray-700 rounded w-[220px] p-4"
            >
              <div className="flex flex-col gap-2 text-white">
                <Input
                  onChange={(e) => handleFilterLabels(e.target.value)}
                  placeholder="Filter labels"
                  className="text-black"
                ></Input>
                {repositoryLabels.map((label) => (
                  <div className={`flex justify-between gap-2 items-center`} key={label.id}>
                    <div
                      style={{ color: label.color, borderColor: label.color }}
                      className="border rounded-md px-2 text-md"
                    >
                      {label.title}
                    </div>
                    {isLabelAssigned(label) ? (
                      <div onClick={() => handleUnassignLabelToIssue(label)}>
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div onClick={() => handleAssignLabelToIssue(label)}>
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>
            <div className="flex flex-wrap gap-2 p-2">
              {issue?.labels.map((label) => (
                <div
                  style={{ color: label.color, borderColor: label.color }}
                  className={`flex justify-center border rounded-md px-2 text-md`}
                  key={label.id}
                >
                  {label.title}
                </div>
              ))}
            </div>
            <Button onClick={handleLabelsClick}>Labels</Button>
            <div className="mt-5 border"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-white text-xl">Leave comment</span>
        <textarea name="" onChange={(e) => setCurrentComment(e.target.value)}></textarea>
        <div className="flex justify-end">
          <Button onClick={handleAddComment} className="w-[150px]">
            Comment
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-white text-xl">Comments</span>
      </div>
      <div className="flex flex-col gap-2">
        {comments &&
          comments.map((quotedComment: CommentHierarchy) => (
            <Fragment key={quotedComment?.comment?.id}>
              <div className="text-white text border rounded-xl">
                <div className="bg-blue-900 rounded-xl p-2 mb-2">
                  {quotedComment.comment.creator.username} added this at{" "}
                  {formatDate(quotedComment.comment.createdAt)}
                </div>
                <Reply
                  comment={quotedComment.comment}
                  setCommentToReply={setCommentToReply}
                  setReplyComment={setReplyComment}
                  handleReplyToComment={handleReplyToComment}
                />
                <CommentView comment={quotedComment} classname="text-white" />
                <div className="mx-2 flex gap-2">
                  {getUniqueValues(quotedComment.comment.reactions).map(
                    (reaction: Reaction, index) => (
                      <div
                        onClick={(e) =>
                          displayUsersWithReaction(reaction, quotedComment.comment, e)
                        }
                        key={index}
                        className="flex flex-col"
                      >
                        {String.fromCodePoint(parseInt(`0x${reaction.emojiCode}`))}
                        <Popper
                          className="bg-white p-4 flex flex-col"
                          id={reactionsPopperId}
                          open={reactionsOpen}
                          anchorEl={reactionPopper}
                        >
                          {displayedReactions.map((username, index) => (
                            <div className="flex" key={index}>
                              <div>{username}</div>
                              {currentUser?.username === username && (
                                <Trash2
                                  onClick={() => handleDeleteReaction(username)}
                                  color="red"
                                />
                              )}
                            </div>
                          ))}
                        </Popper>
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-end pr-6 pb-2">
                  <Button className="mt-2">
                    <SmilePlusIcon
                      onClick={(e) => handleOpenEmojiPicker(e, quotedComment.comment)}
                    ></SmilePlusIcon>
                  </Button>

                  <Popper id={emojiPopperId} open={emojiOpen} anchorEl={emojiPopper}>
                    <EmojiPicker onEmojiClick={(e) => handleEmojiClicked(e)} />
                  </Popper>
                </div>
              </div>
            </Fragment>
          ))}
      </div>
      <div className="py-4">
        {issue?.state === 0 ? (
          <Button onClick={handleCloseIssue}>Close issue</Button>
        ) : (
          <Button onClick={handleReopenIssue}>Reopen issue</Button>
        )}
      </div>
    </div>
  );
};
