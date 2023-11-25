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
