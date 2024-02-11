import { useState } from "react";
import { Button } from "../../components/button/Button";
import { AddRepositoryMemberForm } from "./forms/AddRepositoryMemberForm";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";
import {
  RepositoryMemberPresenter,
  RepositoryMemberRole,
} from "../../store/model/repositoryMember.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import { cn } from "../../utils/cn";
import githubPerson from "./../../assets/githubPerson.png";
import { useGetRepositoryMemberRole } from "../../api/query/repository-member/useGetRepositoryMemberRole";
import { useRemoveRepositoryMember } from "../../api/mutations/repository-member/useRemoveRepositoryMember";
import { useChangeRepositoryMemberRole } from "../../api/mutations/repository-member/useChangeRepositoryMemberRole";

export const RepositoryMembersPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: repositoryMembers } = useGetRepositoryMembers(repository?.id ?? "");
  const { data: userRole } = useGetRepositoryMemberRole(repository?.id ?? "");
  const { mutateAsync: removeRepositoryMember, isError: isErrorDelete } =
    useRemoveRepositoryMember();
  const { mutateAsync: changeRepositoryMemberRole, isError: isErrorChange } =
    useChangeRepositoryMemberRole();
  const hasPrivileges =
    userRole == RepositoryMemberRole.ADMIN || userRole == RepositoryMemberRole.OWNER;

  const handleRemove = async (repositoryMemberId: string) => {
    await removeRepositoryMember({
      repositoryId: repository?.id ?? "",
      repositoryMemberId: repositoryMemberId,
    });
    if (!isErrorDelete) {
      const indexToRemove = repositoryMembers.findIndex((mem) => mem.id === repositoryMemberId);
      if (indexToRemove !== -1) {
        repositoryMembers.splice(indexToRemove, 1);
      }
    }
  };
  const handleRoleChange = async (repositoryMemberId: string, role: RepositoryMemberRole) => {
    await changeRepositoryMemberRole({
      repositoryId: repository?.id ?? "",
      repositoryMemberId: repositoryMemberId,
      repositoryRole: role,
    });
  };
  return (
    <div className="w-full flex flex-col items-center pt-12">
      <div className="text-white w-[1024px]">
        <div className="flex justify-between mb-4">
          <p className="font-sans text-left text-xl">Members</p>
          <Button className="px-6" onClick={() => setOpenForm(true)}>
            Add people
          </Button>
        </div>
        <div className="rounded-sm border-[#30363d] border-[2px] py-2">
          {repositoryMembers.map((member: RepositoryMemberPresenter, key: number) => {
            return (
              <div
                key={key}
                className={cn(
                  "py-4 px-8 flex justify-between ",
                  key == 0 ? "" : "border-t-[1px] border-[#30363d]"
                )}
              >
                <img
                  src={githubPerson}
                  alt="githoob person"
                  className="w-[50px] h-[50px] rounded-md"
                />
                <span className="h-[24px] my-auto w-[200px]">{member.username}</span>
                {member.role == RepositoryMemberRole.OWNER ? (
                  <div className="w-[150px] h-9 text-[#A2A2A2] rounded-md border px-3 py-2 text-sm my-auto">
                    Owner
                  </div>
                ) : (
                  <div className="w-[150px] my-auto">
                    <Select
                      onValueChange={async (value: string) => {
                        const role = +value as RepositoryMemberRole;
                        await handleRoleChange(member.id, +role);
                        if (!isErrorChange) member.role = role;
                      }}
                      defaultValue={member.role.toString()}
                      disabled={!hasPrivileges}
                      value={member.role.toString()}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Member role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={RepositoryMemberRole.READ.toString()}>Read</SelectItem>
                        <SelectItem value={RepositoryMemberRole.WRITE.toString()}>Write</SelectItem>
                        <SelectItem value={RepositoryMemberRole.ADMIN.toString()}>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {hasPrivileges && (
                  <Button
                    className={cn(
                      "px-6 text-sm h-10 my-auto",
                      hasPrivileges
                        ? "bg-red-500 hover:bg-red-400"
                        : "bg-gray-500 hover:bg-gray-500 cursor-default"
                    )}
                    onClick={() => {
                      handleRemove(member.id);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <AddRepositoryMemberForm isOpen={openForm} setOpen={setOpenForm} />
    </div>
  );
};
