import { User } from "./user.model";

export type RepositoryMember = {
    id: string;
    member: User;
    role: number;
};