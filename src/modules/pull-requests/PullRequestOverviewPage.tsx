/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components";
import { useClosePullRequest } from "../../api/mutations/pull-request/useClosePullRequest";
import { useReopenPullRequest } from "../../api/mutations/pull-request/useReopenPullRequest";
import { useGetPullRequest } from "../../api/query/pull-request/useGetPullRequest";
import { useGetPullRequestEvents } from "../../api/query/pull-request/useGetPullRequestEvents";
import { FormControl, Input, MenuItem, Popper, Select, SelectChangeEvent } from "@mui/material";
import { PlusIcon, SmilePlusIcon, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetRepositoryIssues } from "../../api/query/issue/useGetRepositoryIssues";
import { useAtom } from "jotai";
import { currentRepositoryAtom, currentUserAtom } from "../../store/store";
import { useAssignIssuesToPullRequest } from "../../api/mutations/pull-request/useAssignIssuesToPullRequest";
import MilestoneProgressBar from "../../components/milestoneProgressBar/milestoneProgressBar";
import { useGetRepositoryMilestones } from "../../api/query/milestone/useGetRepositoryMilestones";
import { useAssignMilestoneToPullRequest } from "../../api/mutations/pull-request/useAssignMilestoneToPullRequest";
import { useUnassignMilestoneFromPullRequest } from "../../api/mutations/pull-request/useUnassignMilestoneFromPullRequest";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { RepositoryMemberPresenter } from "../../store/model/repositoryMember.model";
import { useAssignUsersToPullRequest } from "../../api/mutations/pull-request/useAssignUsersToPullRequest";
import { SelectMergeTypeForm } from "./forms/SelectMergeTypeForm";
import { useMergePullRequest } from "../../api/mutations/pull-request/useMergePullRequest";
import {
  IssuePullRequestPresenter,
  MergeType,
  mapIssueToPresenter,
} from "../../store/model/pullRequest.model";
import { useToast } from "../../components/toast";
import { Label } from "../../store/model/label.model";
import { useGetRepositoryLabels } from "../../api/query/labels/useGetRepositoryLabels";
import { useAssignLabelsToPullRequest } from "../../api/mutations/pull-request/useAssignLabelsToPullRequest";
import { useGetTaskComments } from "../../api/query/comment/useGetTaskComments";
import { useAddIssueComment } from "../../api/mutations/comment/useAddIssueComment";
import { useAddReaction } from "../../api/mutations/reaction/useAddReaction";
import { useDeleteReaction } from "../../api/mutations/reaction/useDeleteReaction";
import { Reaction } from "../../store/model/reaction.model";
import { Comment } from "../../store/model/comment.model";
import EmojiPicker from "emoji-picker-react";
import { CommentView } from "../../components/comment/CommentView";
import { Reply } from "../../components/comment/Reply";

export const PullRequestOverviewPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openForm, setOpenForm] = useState(false);
  const [search, setSearch] = useState<string>("");

  const [repository] = useAtom(currentRepositoryAtom);
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const [selectedIssues, setSelectedIssues] = useState<IssuePullRequestPresenter[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<RepositoryMemberPresenter[]>([]);
  const [selectedmilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [commentToReply, setCommentToReply] = useState<any>();
  const [commentForReaction, setCommentForReaction] = useState<Comment>();
  const [displayedReactions, setDisplayedReactions] = React.useState<string[]>([]);
  const [commentReactionForDeletion, setCommentReactionForDeletion] = useState<Comment>();
  const [reactionForDeletion, setReactionForDeletion] = useState<Reaction>();
  const [replyComment, setReplyComment] = React.useState("");
  const [currentComment, setCurrentComment] = React.useState("");
  const [currentUser] = useAtom(currentUserAtom);

  const { data: pr } = useGetPullRequest(id ?? "");
  const { data: prEvents } = useGetPullRequestEvents(id ?? "");
  const { data: repositoryMembers } = useGetRepositoryMembers(selectedRepository.id ?? "");
  const { data: repositoryMilestones } = useGetRepositoryMilestones(selectedRepository);
  const { data: repositoryIssues } = useGetRepositoryIssues(selectedRepository);
  const { data: repositoryLabels } = useGetRepositoryLabels(selectedRepository, search);
  const { data: comments } = useGetTaskComments(id ?? "");

  const { mutateAsync: mergePullRequest } = useMergePullRequest();
  const { mutateAsync: closePr } = useClosePullRequest();
  const { mutateAsync: reopenPr } = useReopenPullRequest();
  const { mutateAsync: assignIssuesToPullRequest } = useAssignIssuesToPullRequest();
  const { mutateAsync: assignMilestoneToPullRequest } = useAssignMilestoneToPullRequest();
  const { mutateAsync: unassignMilestoneFromPullRequest } = useUnassignMilestoneFromPullRequest();
  const { mutateAsync: assignUsersToPullRequest, isError: isErrorUpdateAssignee } =
    useAssignUsersToPullRequest();
  const { mutateAsync: assignLabelsToPullRequest } = useAssignLabelsToPullRequest();
  const { mutateAsync: addComment } = useAddIssueComment();
  const { mutateAsync: addReaction } = useAddReaction();
  const { mutateAsync: deleteReaction } = useDeleteReaction();

  useEffect(() => {
    setSelectedIssues(pr?.issues == undefined ? [] : pr?.issues);
    setSelectedMembers(pr?.assignees == undefined ? [] : pr?.assignees);
    setSelectedMilestoneId(pr?.milestone?.id ?? "");
    setSelectedLabels(pr?.labels == undefined ? [] : pr?.labels);
  }, [pr]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElAssignee, setAnchorElAssignee] = React.useState<null | HTMLElement>(null);
  const [labelPopper, setLabelPopper] = React.useState<null | HTMLElement>(null);
  const [emojiPopper, setEmojiPopper] = React.useState<null | HTMLElement>(null);
  const [reactionPopper, setReactionPopper] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const emojiOpen = Boolean(emojiPopper);
  const reactionsOpen = Boolean(reactionPopper);
  const openAssignee = Boolean(anchorElAssignee);
  const labelPopperOpen = Boolean(labelPopper);

  const popperId = open ? "simple-popper" : undefined;
  const popperIdAssignee = openAssignee ? "simple-popper" : undefined;
  const labelPopperId = labelPopperOpen ? "simple-popper" : undefined;
  const emojiPopperId = emojiOpen ? "simple-popper" : undefined;
  const reactionsPopperId = reactionsOpen ? "simple-popper" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickAssignee = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAssignee(anchorElAssignee ? null : event.currentTarget);
  };

  const handleAddLabelClick = (event: React.MouseEvent<HTMLElement>) => {
    setLabelPopper(labelPopper ? null : event.currentTarget);
  };

  const handleLabelsClick = () => {
    navigate(`/repository/${selectedRepository.name}/issues/labels`);
  };

  const handleFilterLabels = (searchValue: string) => {
    setSearch(searchValue);
  };

  const handleOpenEmojiPicker = (event: React.MouseEvent<HTMLElement>, comment: Comment) => {
    setCommentForReaction(comment);
    setEmojiPopper(emojiPopper ? null : event.currentTarget);
  };

  const isIssueSelected = (issueToCheck: IssuePullRequestPresenter) => {
    return selectedIssues.findIndex((issue) => issue.id === issueToCheck.id) != -1;
  };

  const isMemberSelected = (memberToCheck: RepositoryMemberPresenter) => {
    return selectedMembers.findIndex((member) => member.id === memberToCheck.id) != -1;
  };

  const isLabelSelected = (labelToCheck: Label) => {
    return selectedLabels.findIndex((label) => label.id === labelToCheck.id) != -1;
  };

  const removeIssue = async (issueToRemove: IssuePullRequestPresenter) => {
    setSelectedIssues(selectedIssues.filter((issue) => issueToRemove.id !== issue.id));
    await assignIssuesToPullRequest({
      id: pr?.id ?? "",
      issueIds: selectedIssues
        .filter((issue) => issueToRemove.id !== issue.id)
        .map((issue) => issue.id),
    });
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };
  const AddIssue = async (issueToAdd: IssuePullRequestPresenter) => {
    setSelectedIssues([...selectedIssues, issueToAdd]);
    await assignIssuesToPullRequest({
      id: pr?.id ?? "",
      issueIds: [...selectedIssues, issueToAdd].map((issue) => issue.id),
    });
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const removeMember = async (memberToRemove: RepositoryMemberPresenter) => {
    setSelectedMembers(selectedMembers.filter((member) => memberToRemove.id !== member.id));
    await assignUsersToPullRequest({
      id: pr?.id ?? "",
      assigneeIds: selectedMembers
        .filter((member) => memberToRemove.id !== member.id)
        .map((member) => member.id),
    });
    if (!isErrorUpdateAssignee) {
      toast({
        title: "User successfully unassigned!",
      });
    }
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleAddComment = async () => {
    await addComment({
      taskId: pr?.id ?? "",
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

  const handleReplyToComment = async () => {
    await addComment({
      taskId: pr?.id ?? "",
      content: replyComment,
      parentId: commentToReply.id,
    });
    queryClient.invalidateQueries({ queryKey: ["task-comments", id] });
  };

  const handleEmojiClicked = async (event) => {
    await addReaction({
      commentId: commentForReaction?.id ?? "",
      emojiCode: event.unified,
    });
    queryClient.invalidateQueries({ queryKey: ["task-comments", id] });
  };

  const AddMember = async (memberToAdd: RepositoryMemberPresenter) => {
    setSelectedMembers([...selectedMembers, memberToAdd]);
    await assignUsersToPullRequest({
      id: pr?.id ?? "",
      assigneeIds: [...selectedMembers, memberToAdd].map((member) => member.id),
    });
    if (!isErrorUpdateAssignee) {
      toast({
        title: "User successfully assigned!",
      });
    }
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleUnassignLabel = async (labelToRemove: Label) => {
    setSelectedLabels(selectedLabels.filter((label) => labelToRemove.id !== label.id));
    await assignLabelsToPullRequest({
      id: pr?.id ?? "",
      labelIds: selectedLabels
        .filter((label) => labelToRemove.id !== label.id)
        .map((label) => label.id),
    });
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleAssignLabel = async (labelToAdd: Label) => {
    setSelectedLabels([...selectedLabels, labelToAdd]);
    await assignLabelsToPullRequest({
      id: pr?.id ?? "",
      labelIds: [...selectedLabels, labelToAdd].map((label) => label.id),
    });
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleMilestoneChange = async (event: SelectChangeEvent) => {
    setSelectedMilestoneId(event.target.value);
    if (pr?.milestone) {
      await unassignMilestoneFromPullRequest({
        id: pr?.id ?? "",
      });
    } else {
      await assignMilestoneToPullRequest({
        id: pr?.id ?? "",
        milestoneId: event.target.value,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };
  const openSelectMergeTypeForm = async () => {
    setOpenForm(true);
  };

  const handleMergePullRequest = async (mergeType: MergeType) => {
    await mergePullRequest({ repositoryId: repository.id, pullRequestId: pr?.id ?? "", mergeType });
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleClosePr = async () => {
    await closePr(pr?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleReopenPr = async () => {
    await reopenPr(pr?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  return (
    <div className="pt-12 w-[1028px] mx-auto">
      <div className="w-full flex flex-col">
        <div className="flex items-center gap-4 pb-2">
          <div className="text-3xl text-white">{pr?.title ?? ""}</div>
          <div className="text-3xl text-gray-500">#{pr?.number}</div>
        </div>
        <div className="flex gap-4 text-lg text-gray-500 pb-4">
          {pr?.state === 0 && (
            <div className="w-[80px] flex justify-center rounded-3xl bg-green-600 text-white">
              Open
            </div>
          )}
          {pr?.state === 1 && (
            <div className="w-[80px] flex justify-center rounded-3xl bg-red-600 text-white">
              Closed
            </div>
          )}
          {pr?.state === 2 && (
            <div className="w-[80px] flex justify-center rounded-3xl bg-purple-600 text-white">
              Merged
            </div>
          )}
          <div>
            <span className="font-bold">{pr?.events[0].creator} </span> wants to merge into{" "}
            {pr?.toBranch} from {pr?.fromBranch}
          </div>
        </div>
        <div className="border"></div>
      </div>

      <div className="flex flex-col">
        <div className="flex">
          <div className="flex flex-col flex-grow max-h-[500px] overflow-y-auto mr-4">
            {prEvents?.map((event) => (
              <div key={event.id} className="mt-1">
                <span className="text-white text-lg font-bold">{event.creator}</span>
                <span className="text-gray-500"> {event.title}</span>
                <span className="text-gray-500"> on {formatDate(event.createdAt)}</span>
              </div>
            ))}
          </div>

          <div className="w-[285px]">
            <div className="flex mt-5">
              <div className="text-gray-600">Assignees</div>
              <button aria-describedby={id} type="button" onClick={handleClickAssignee}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={popperIdAssignee}
              open={openAssignee}
              anchorEl={anchorElAssignee}
              className="bg-gray-700 rounded w-[200px] p-4"
            >
              <div className="text-white">
                {repositoryMembers.map((member: RepositoryMemberPresenter) => (
                  <div className="flex gap-2" key={member.id}>
                    <div>{member.username}</div>
                    {isMemberSelected(member) ? (
                      <div onClick={() => removeMember(member)}>
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div onClick={() => AddMember(member)}>
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>
            <div className="p-1">
              {selectedMembers.map((member) => (
                <div key={member.id} className="text-white text-lg">
                  {member.username}
                </div>
              ))}
            </div>
            <div className="border"></div>

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
                    <div key={label.id} className={`flex justify-between gap-2 items-center`}>
                      <div
                        style={{ color: label.color, borderColor: label.color }}
                        className="border rounded-md px-2 text-md"
                      >
                        {label.title}
                      </div>
                      {isLabelSelected(label) ? (
                        <div onClick={() => handleUnassignLabel(label)}>
                          <Trash2 color="white" />
                        </div>
                      ) : (
                        <div onClick={() => handleAssignLabel(label)}>
                          <PlusIcon color="white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Popper>
              <div className="flex gap-2 p-2 flex-wrap">
                {pr?.labels.map((label) => (
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

              <div className="flex gap-2 mt-4">
                <div className="text-gray-600">Milestone</div>
              </div>

              <FormControl fullWidth variant="standard">
                <Select
                  label="demo-simple-select-standard-label"
                  defaultValue={pr?.milestone?.title ?? ""}
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

            <div className="border mt-5 mb-5"></div>
            <div className="flex">
              <div className="text-gray-600">Issues</div>
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
                {repositoryIssues
                  .map((issue) => {
                    return mapIssueToPresenter(issue);
                  })
                  .map((issue: IssuePullRequestPresenter) => (
                    <div className="flex gap-2" key={issue.id}>
                      <div>
                        #{issue.number} {issue.title}
                      </div>
                      {isIssueSelected(issue) ? (
                        <div onClick={() => removeIssue(issue)}>
                          <Trash2 color="white" />
                        </div>
                      ) : (
                        <div onClick={() => AddIssue(issue)}>
                          <PlusIcon color="white" />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </Popper>
            <div className="p-1">
              {selectedIssues.map((issue) => (
                <div key={issue.id} className="text-white text-l">
                  #{issue.number} {issue.title}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div
            className="border border-white p-3 text-white hover:bg-gray-500 cursor-pointer"
            onClick={() => navigate("commits")}
          >
            See Commits
          </div>
          <div
            className="border border-white p-3 text-white hover:bg-gray-500 cursor-pointer"
            onClick={() => navigate("preview")}
          >
            See File Changes @@@
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
            comments.map((quotedComment: any) => (
              <>
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
                    {getUniqueValues(quotedComment.comment.reactions).map((reaction: Reaction) => (
                      <>
                        <div
                          onClick={(e) =>
                            displayUsersWithReaction(reaction, quotedComment.comment, e)
                          }
                          className="flex flex-col"
                        >
                          {String.fromCodePoint(parseInt(`0x${reaction.emojiCode}`))}
                          <Popper
                            className="bg-white p-4 flex flex-col"
                            id={reactionsPopperId}
                            open={reactionsOpen}
                            anchorEl={reactionPopper}
                          >
                            {displayedReactions.map((username) => (
                              <div className="flex">
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
                      </>
                    ))}
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
              </>
            ))}
        </div>

        <div className="flex justify-center items-center h-full mt-10 gap-4">
          {pr?.state === 0 ? (
            <Button onClick={handleClosePr}>Close pull request</Button>
          ) : (
            <Button onClick={handleReopenPr}>Reopen pull request</Button>
          )}
          <Button onClick={openSelectMergeTypeForm}>Merge pull request</Button>
        </div>

        <SelectMergeTypeForm
          isOpen={openForm}
          setOpen={setOpenForm}
          onClick={handleMergePullRequest}
        />
      </div>
    </div>
  );
};
