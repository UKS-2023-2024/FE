import { atomWithStorage } from "jotai/utils";
import { User } from "./model/user.model";

export const tokenAtom = atomWithStorage<string | null>("token", null);

export const currentUserAtom = atomWithStorage<User | null>("currentUser", null);
