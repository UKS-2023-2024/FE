export type SocialAccountParams = {
    id: string
    value: string
}

export type UpdateUserParams = {
    fullName: string;
    bio: string;
    location: string;
    company: string;
    website: string
    socialAccounts: SocialAccountParams[]
  };
  