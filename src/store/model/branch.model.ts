import { Repository } from "./repository.model"
import { User } from "./user.model"

export type Branch = {
    id: string
    name: string
    repositoryId:string
    repository: Repository
    isDefault: boolean
    ownerId: string
    owner: User
    Deleted: boolean 
}