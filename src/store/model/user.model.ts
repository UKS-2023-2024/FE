import { SocialAccount } from "./socialAccount.model";

export type User = {
  id: string;
  primaryEmail: string;
  fullName: string;
  username: string;
  bio: string;
  location: string;
  company: string;
  website: string;
  socialAccounts: SocialAccount[];
};

export type UserThatStarred = {
  username: string;
  location: string;
};
