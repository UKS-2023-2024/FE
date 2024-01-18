import { atomWithStorage } from "jotai/utils";
import { User } from "./model/user.model";
import { Organization } from "./model/organization.model";
import { Repository } from "./model/repository.model";
import { Milestone } from "./model/milestone.model";
import { Issue } from "./model/issue.model";

export const tokenAtom = atomWithStorage<string | null>("token", null);

export const currentUserAtom = atomWithStorage<User | null>(
  "currentUser",
  null
);

export const currentOrganizationAtom = atomWithStorage<Organization | null>(
  "currentOrganization",
  null
);

export const currentRepositoryAtom = atomWithStorage<Repository>(
  "currentRepository",
  {
    description: "",
    id: "-1",
    isPrivate: true,
    members: [],
    name: "",
  }
);

export const currentMilestoneAtom = atomWithStorage<Milestone>(
  "currentMilestone",
  {
    id: "",
    title: "",
    dueDate: new Date(),
    description: "",
    repositoryId: "",
  }
);

export const currentYourBranchesPageNumberAtom = atomWithStorage<number>(
  "currentYourBranchesPageNumber",
  1
);

export const currentAllBranchesPageNumberAtom = atomWithStorage<number>(
  "currentAllBranchesPageNumber",
  1
);
