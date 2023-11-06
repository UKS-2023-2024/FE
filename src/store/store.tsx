import { atomWithStorage } from "jotai/utils";
import { User } from "./model/user.model";
import { Organization } from "./model/organization.model";

export const tokenAtom = atomWithStorage<string | null>("token", null);

export const currentUserAtom = atomWithStorage<User | null>(
  "currentUser",
  null
);

export const currentOrganizationAtom = atomWithStorage<Organization | null>(
  "currentOrganization",
  null
);
