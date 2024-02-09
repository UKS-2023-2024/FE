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

export type CreatePullRequestValues = {
  title: string;
  description?: string;
  fromBranchId: string;
  toBranchId: string;
  issueIds: string[];
};

export const CreatePullRequestPage = () => {
  const { mutateAsync: createPullRequest } = useCreatePullRequest();
  const [fromBranchId, setFromBranchId] = useState("");
  const [toBranchId, setToBranchId] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const { data: repositoryIssues } = useGetRepositoryIssues(selectedRepository);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const { id } = useParams();
  const open = Boolean(anchorEl);
  const popperId = open ? "simple-popper" : undefined;

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
    setValue("fromBranchId", fromBranchId);
  }, [fromBranchId]);

  useEffect(() => {
    setValue("toBranchId", toBranchId);
  }, [toBranchId]);

  const handleOnSubmit = async (values: CreatePullRequestValues) => {
    await createPullRequest({
      title: values.title,
      description: values.description ?? "",
      repositoryId: selectedRepository.id,
      fromBranchId: values.fromBranchId,
      toBranchId: values.toBranchId,
      issueIds: values.issueIds,
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

  return (
    <div className="p-20">
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

      <div className=" flex flex-col pt-6 pb-6 border-b border-gray-600">
        <Input
          label="Add a title"
          placeholder="Title"
          className="w-[60%]"
          {...register("title")}
          hasError={errors.title}
          errorMessage={errors.title?.message}
        />
        <span className="text-white">Add a description</span>
        <textarea className="w-[60%]" {...register("description")} />
      </div>
      <div>
        <div className="flex gap-2 pt-10">
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
            {repositoryIssues.map((issue: Issue) => (
              <div className="flex gap-2">
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
        <div className="p-2">
          {selectedIssues.map((issue) => (
            <div className="text-white text-xl">
              #{issue.number} {issue.title}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end pt-6">
        <Button onClick={handleSubmit(handleOnSubmit)}>Submit new pull request</Button>
      </div>
    </div>
  );
};
