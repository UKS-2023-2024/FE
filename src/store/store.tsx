import { atomWithStorage } from "jotai/utils";
import { User } from "./model/user.model";
import { Organization } from "./model/organization.model";
import { Repository } from "./model/repository.model";

export const tokenAtom = atomWithStorage<string | null>("token", null);

export const currentUserAtom = atomWithStorage<User | null>(
  "currentUser",
  null
);

export const currentOrganizationAtom = atomWithStorage<Organization | null>(
  "currentOrganization",
  null
);

export const currentRepositoryAtom = atomWithStorage<Repository | null>(
  "currentRepository",
  null
);

export const currentYourBranchesPageNumberAtom = atomWithStorage<number>(
  "currentYourBranchesPageNumber",
  1
);

export const currentActiveBranchesPageNumberAtom = atomWithStorage<number>(
  "currentActiveBranchesPageNumber",
  1
);