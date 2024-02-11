/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import { formatDate } from "../../utils/helper";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components";
import { useClosePullRequest } from "../../api/mutations/pull-request/useClosePullRequest";
import { useReopenPullRequest } from "../../api/mutations/pull-request/useReopenPullRequest";
import { useGetPullRequest } from "../../api/query/pull-request/useGetPullRequest";
import { useGetPullRequestEvents } from "../../api/query/pull-request/useGetPullRequestEvents";
import { FormControl, MenuItem, Popper, Select, SelectChangeEvent } from "@mui/material";
import { PlusIcon, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useGetRepositoryIssues } from "../../api/query/issue/useGetRepositoryIssues";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";
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

export const PullRequestOverviewPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: mergePullRequest } = useMergePullRequest();
  const [repository] = useAtom(currentRepositoryAtom);
  const [openForm, setOpenForm] = useState(false);

  const { data: pr } = useGetPullRequest(id ?? "");
  const { data: prEvents } = useGetPullRequestEvents(id ?? "");

  const { mutateAsync: closePr } = useClosePullRequest();
  const { mutateAsync: reopenPr } = useReopenPullRequest();
  const [selectedmilestoneId, setSelectedMilestoneId] = useState<string>("");

  const handleCloseIssue = async () => {
    await closePr(pr?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };

  const handleReopenIssue = async () => {
    await reopenPr(pr?.id ?? "");
    queryClient.invalidateQueries({ queryKey: ["repository-pull-request", id] });
    queryClient.invalidateQueries({ queryKey: ["pull-request-events", id] });
  };
  const { mutateAsync: assignIssuesToPullRequest } = useAssignIssuesToPullRequest();
  const [selectedIssues, setSelectedIssues] = useState<IssuePullRequestPresenter[]>([]);
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const { data: repositoryIssues } = useGetRepositoryIssues(selectedRepository);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const open = Boolean(anchorEl);
  const popperId = open ? "simple-popper" : undefined;

  const isIssueSelected = (issueToCheck: IssuePullRequestPresenter) => {
    return selectedIssues.findIndex((issue) => issue.id === issueToCheck.id) != -1;
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

  useEffect(() => {
    setSelectedIssues(pr?.issues == undefined ? [] : pr?.issues);
    setSelectedMembers(pr?.assignees == undefined ? [] : pr?.assignees);
    setSelectedMilestoneId(pr?.milestone?.id ?? "");
  }, [pr]);

  const { data: repositoryMilestones } = useGetRepositoryMilestones(selectedRepository);
  const { mutateAsync: assignMilestoneToPullRequest } = useAssignMilestoneToPullRequest();
  const { mutateAsync: unassignMilestoneFromPullRequest } = useUnassignMilestoneFromPullRequest();

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

  const [anchorElAssignee, setAnchorElAssignee] = React.useState<null | HTMLElement>(null);
  const handleClickAssignee = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAssignee(anchorElAssignee ? null : event.currentTarget);
  };
  const openAssignee = Boolean(anchorElAssignee);
  const popperIdAssignee = open ? "simple-popper" : undefined;

  const { data: repositoryMembers } = useGetRepositoryMembers(selectedRepository.id ?? "");
  const { mutateAsync: assignUsersToPullRequest, isError: isErrorUpdateAssignee } =
    useAssignUsersToPullRequest();
  const [selectedMembers, setSelectedMembers] = useState<RepositoryMemberPresenter[]>([]);
  const isMemberSelected = (memberToCheck: RepositoryMemberPresenter) => {
    return selectedMembers.findIndex((member) => member.id === memberToCheck.id) != -1;
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

  const handleMergePullRequest = async (mergeType: MergeType) => {
    await mergePullRequest({ repositoryId: repository.id, pullRequestId: pr?.id ?? "", mergeType });
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
          <div className="flex flex-col flex-grow max-h-[350px] overflow-y-auto mr-4">
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
                <div key={member.id} className="text-white text-l">
                  {member.username}
                </div>
              ))}
            </div>
            <div className="border"></div>

            <div>
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
        <div className="flex justify-center items-center h-full mt-10 gap-4">
          {pr?.state === 0 ? (
            <Button onClick={handleCloseIssue}>Close pull request</Button>
          ) : (
            <Button onClick={handleReopenIssue}>Reopen pull request</Button>
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
