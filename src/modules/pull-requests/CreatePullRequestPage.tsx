/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button } from "../../components/button/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../components/input/Input";
import { useAtom } from "jotai";
import { useParams } from "react-router-dom";
import { currentRepositoryAtom } from "../../store/store";
import { CREATE_PULL_REQUEST_VALIDATION_SCHEMA } from "../../utils/pull-request.constants";
import { useGetAllRepositoryBranches } from "../../api/query/branch/useGetAllRepositoryBranches";
import { useEffect, useState } from "react";
import { PlusIcon, Trash2 } from "lucide-react";
import rightArrow from "../../assets/arrow.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { Branch } from "../../store/model/branch.model";
import { Popper } from "@mui/material";
import React from "react";
import { useGetRepositoryIssues } from "../../api/query/issue/useGetRepositoryIssues";
import { Issue } from "../../store/model/issue.model";
import { useCreatePullRequest } from "../../api/mutations/pull-request/useCreatePullRequest";
import { useGetRepositoryMilestones } from "../../api/query/milestone/useGetRepositoryMilestones";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { RepositoryMemberPresenter } from "../../store/model/repositoryMember.model";
import { Milestone } from "../../store/model/milestone.model";
import { Label } from "../../store/model/label.model";
import { useGetRepositoryLabels } from "../../api/query/labels/useGetRepositoryLabels";

export type CreatePullRequestValues = {
  title: string;
  description?: string;
  fromBranchId: string;
  toBranchId: string;
  issueIds: string[];
  assigneeIds: string[];
  milestoneId?: string;
  labelIds: string[];
};

export const CreatePullRequestPage = () => {
  const { mutateAsync: createPullRequest } = useCreatePullRequest();
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [selectedmilestoneId, setSelectedMilestoneId] = useState<string>("");
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<RepositoryMemberPresenter[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  const [search, setSearch] = useState<string>("");

  const { data: repositoryIssues } = useGetRepositoryIssues(selectedRepository);
  const { data: repositoryMilestones } = useGetRepositoryMilestones(selectedRepository);
  const { data: repositoryMembers } = useGetRepositoryMembers(selectedRepository.id ?? "");
  const { data: repositoryLabels } = useGetRepositoryLabels(selectedRepository, search);

  const [anchorElIssue, setAnchorElIssue] = React.useState<null | HTMLElement>(null);
  const [anchorElAssignee, setAnchorElAssignee] = React.useState<null | HTMLElement>(null);
  const [anchorElLabel, setAnchorElLabel] = React.useState<null | HTMLElement>(null);
  const handleClickIssue = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElIssue(anchorElIssue ? null : event.currentTarget);
  };
  const handleClickAssignee = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAssignee(anchorElAssignee ? null : event.currentTarget);
  };
  const handleClickLabel = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLabel(anchorElLabel ? null : event.currentTarget);
  };
  const { id } = useParams();
  const openIssue = Boolean(anchorElIssue);
  const openAssignee = Boolean(anchorElAssignee);
  const openLabel = Boolean(anchorElLabel);
  const popperIdIssue = openIssue ? "simple-popper" : undefined;
  const popperIdAssignee = openAssignee ? "simple-popper" : undefined;
  const popperIdLabel = openLabel ? "simple-popper" : undefined;

  const { data: repositoryBranches } = useGetAllRepositoryBranches(selectedRepository?.id ?? "");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<CreatePullRequestValues>({
    resolver: yupResolver(CREATE_PULL_REQUEST_VALIDATION_SCHEMA),
  });

  useEffect(() => {
    const toBranchId =
      repositoryBranches != undefined
        ? repositoryBranches.filter((branch) => branch.isDefault)[0].id
        : "";
    const fromBranch =
      repositoryBranches != undefined
        ? repositoryBranches.filter((branch) => !branch.isDefault)[0]
        : undefined;
    setFromBranchId(fromBranch == undefined ? toBranchId : fromBranch.id);
    setToBranchId(toBranchId);
  }, [repositoryBranches]);

  useEffect(() => {
    setValue(
      "issueIds",
      selectedIssues.map((issue) => {
        return issue.id;
      })
    );
  }, [selectedIssues]);

  useEffect(() => {
    setValue(
      "assigneeIds",
      selectedAssignees.map((assignee) => {
        return assignee.memberId;
      })
    );
  }, [selectedAssignees]);

  useEffect(() => {
    setValue(
      "labelIds",
      selectedLabels.map((label) => {
        return label.id;
      })
    );
  }, [selectedLabels]);

  useEffect(() => {
    setValue("fromBranchId", fromBranchId);
  }, [fromBranchId]);

  useEffect(() => {
    setValue("toBranchId", toBranchId);
  }, [toBranchId]);

  useEffect(() => {
    setValue("milestoneId", selectedmilestoneId == "" ? undefined : selectedmilestoneId);
  }, [selectedmilestoneId]);

  const handleOnSubmit = async (values: CreatePullRequestValues) => {
    await createPullRequest({
      title: values.title,
      description: values.description,
      repositoryId: selectedRepository.id,
      fromBranchId: values.fromBranchId,
      toBranchId: values.toBranchId,
      issueIds: values.issueIds,
      assigneeIds: values.assigneeIds,
      milestoneId: values.milestoneId,
      labelIds: values.labelIds,
    });
  };

  const isIssueSelected = (issueToCheck: Issue) => {
    return selectedIssues.findIndex((issue) => issue.id === issueToCheck.id) != -1;
  };
  const removeIssue = (issueToRemove: Issue) => {
    setSelectedIssues(selectedIssues.filter((issue) => issueToRemove.id !== issue.id));
  };
  const AddIssue = (issueToAdd: Issue) => {
    setSelectedIssues([...selectedIssues, issueToAdd]);
  };

  const isAssigneeSelected = (assigneeToCheck: RepositoryMemberPresenter) => {
    return selectedAssignees.findIndex((assignee) => assignee.id === assigneeToCheck.id) != -1;
  };
  const removeAssignee = (assigneeToRemove: RepositoryMemberPresenter) => {
    setSelectedAssignees(
      selectedAssignees.filter((assignee) => assigneeToRemove.id !== assignee.id)
    );
  };
  const AddAssignee = (assigneeToAdd: RepositoryMemberPresenter) => {
    setSelectedAssignees([...selectedAssignees, assigneeToAdd]);
  };

  const isLabelSelected = (labelToCheck: Label) => {
    return selectedLabels.findIndex((label) => label.id === labelToCheck.id) != -1;
  };
  const removeLabel = (labelToRemove: Label) => {
    setSelectedLabels(selectedLabels.filter((label) => labelToRemove.id !== label.id));
  };
  const AddLabel = (labelToAdd: Label) => {
    setSelectedLabels([...selectedLabels, labelToAdd]);
  };

  return (
    <div className="pt-12 w-[1028px] mx-auto">
      <div className="pb-6 border-b border-gray-600 flex justify-between">
        <p className="text-white text-2xl">New pull request</p>
        <div className="flex gap-4">
          <Select
            onValueChange={async (value: string) => {
              setFromBranchId(value);
            }}
            value={fromBranchId}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {repositoryBranches?.map((branch: Branch) => {
                return (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <img
            src={rightArrow}
            alt="right arrow"
            className="w-[16px] my-auto h-[16px] rounded-md"
          />
          <Select
            defaultValue={repositoryBranches?.filter((branch) => branch.isDefault)[0]?.id}
            onValueChange={async (value: string) => {
              setToBranchId(value);
            }}
            value={toBranchId}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {repositoryBranches?.map((branch: Branch) => {
                return (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-6 pb-6 border-b border-gray-600 flex gap-12">
        <div className="flex flex-col flex-grow">
          <Input
            label="Add a title"
            placeholder="Title"
            className="w-full"
            {...register("title")}
            hasError={errors.title}
            errorMessage={errors.title?.message}
          />
          <span className="text-white">Add a description</span>
          <textarea className="w-full rounded-sm" {...register("description")} />
        </div>
        <div className="flex-grow pr-10 flex gap-4">
          <div className="flex-grow">
            <div>
              <span className="text-white text-lg font-bold">Selected issues :</span>
              <div className="p-2">
                {selectedIssues.map((issue) => (
                  <div className="text-white text-sm" key={issue.id}>
                    #{issue.number} {issue.title}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-white text-lg font-bold">Selected assignees :</span>
              <div className="p-2">
                {selectedAssignees.map((assignee) => (
                  <div className="text-white text-sm" key={assignee.id}>
                    {assignee.username}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-white text-lg font-bold">Selected labels :</span>
              <div className="gap-2 flex flex-wrap w-[255px]">
                {selectedLabels.map((label) => (
                  <div
                    style={{ color: label.color, borderColor: label.color }}
                    className="border rounded-md px-2 text-md"
                  >
                    {label.title}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-grow w-[212.63px]">
            <span className="text-white text-lg font-bold mb-1"> Pick milestone</span>
            <Select
              onValueChange={async (value: string) => {
                setSelectedMilestoneId(value);
              }}
              value={selectedmilestoneId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pick milestone" />
              </SelectTrigger>
              <SelectContent>
                {repositoryMilestones?.map((milestone: Milestone) => {
                  return (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.title}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <span
                className="text-gray-600 text-sm cursor-pointer"
                onClick={() => {
                  setSelectedMilestoneId("");
                }}
              >
                clear milestone
              </span>
            </div>
            <div className="flex gap-2 justify-end my-2">
              <div className="text-gray-500">Issues</div>
              <button aria-describedby={id} type="button" onClick={handleClickIssue}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={popperIdIssue}
              open={openIssue}
              anchorEl={anchorElIssue}
              className="bg-gray-700 rounded w-[250px] p-4"
            >
              <div className="text-white flex flex-col gap-2">
                {repositoryIssues.map((issue: Issue) => (
                  <div className="flex gap-2 justify-end" key={issue.id}>
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
            <div className="flex gap-2 justify-end">
              <div className="text-gray-500">Assignees</div>
              <button aria-describedby={id} type="button" onClick={handleClickAssignee}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={popperIdAssignee}
              open={openAssignee}
              anchorEl={anchorElAssignee}
              className="bg-gray-700 rounded w-[250px] p-4"
            >
              <div className="text-white flex flex-col gap-2">
                {repositoryMembers.map((member: RepositoryMemberPresenter) => (
                  <div className="flex gap-2 justify-end" key={member.memberId}>
                    <div>{member.username}</div>
                    {isAssigneeSelected(member) ? (
                      <div onClick={() => removeAssignee(member)}>
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div onClick={() => AddAssignee(member)}>
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>

            <div className="flex gap-2 justify-end">
              <div className="text-gray-500">Labels</div>
              <button aria-describedby={id} type="button" onClick={handleClickLabel}>
                <PlusIcon color="white" />
              </button>
            </div>
            <Popper
              id={popperIdLabel}
              open={openLabel}
              anchorEl={anchorElLabel}
              className="bg-gray-700 rounded w-[250px] p-4"
            >
              <div className="text-white flex flex-col gap-2">
                {repositoryLabels.map((label: Label) => (
                  <div className="flex gap-2 justify-end" key={label.id}>
                    <div
                      style={{ color: label.color, borderColor: label.color }}
                      className="border rounded-md px-2 text-md"
                    >
                      {label.title}
                    </div>
                    {isLabelSelected(label) ? (
                      <div onClick={() => removeLabel(label)}>
                        <Trash2 color="white" />
                      </div>
                    ) : (
                      <div onClick={() => AddLabel(label)}>
                        <PlusIcon color="white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Popper>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-6">
        <Button onClick={handleSubmit(handleOnSubmit)}>Submit new pull request</Button>
      </div>
    </div>
  );
};
