import { SocialAccount } from "./socialAccount.model";

export type User = {
  primaryEmail: string;
  fullName: string;
  username: string;
  bio: string;
  location: string;
  company: string;
  website: string
  socialAccounts: SocialAccount[]
};
