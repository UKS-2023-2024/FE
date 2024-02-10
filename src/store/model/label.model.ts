import { Repository } from "./repository.model";

export type Label = {
  id: string;
  title: string;
  description: string;
  repository: Repository;
  repositoryId: string;
  color: string;
};
