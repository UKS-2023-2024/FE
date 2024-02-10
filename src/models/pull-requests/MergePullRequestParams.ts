import { MergeType } from "../../store/model/pullRequest.model";

export type MergePullRequestParams = {
  pullRequestId: string;
  repositoryId: string;
  mergeType: MergeType;
};
