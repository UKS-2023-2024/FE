import { ChangeEvent, useState } from "react";
import { Button } from "../../components/button/Button";
import { AddRepositoryMemberForm } from "./forms/AddRepositoryMemberForm";
import { useGetRepositoryMembers } from "../../api/query/repository-member/useGetRepositoryMembers";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";
import {
  RepositoryMemberPresenter,
  RepositoryMemberRole,
} from "../../store/model/repositoryMember.model";
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
    <div className="w-full flex flex-col items-center pt-6">
      <div className="p-6 text-white w-[1024px]">
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
                <div className="w-[150px]">
                  <select
                    className="text-[#232323] rounded-md"
                    defaultValue={member.role}
                    disabled={!hasPrivileges}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const role = e.target.value;
                      handleRoleChange(member.id, +role);
                      if (!isErrorChange) member.role = +role;
                    }}
                  >
                    <option
                      value={RepositoryMemberRole.ADMIN}
                      className={
                        member.role == RepositoryMemberRole.ADMIN ? "bg-[#0E7490] text-white" : ""
                      }
                    >
                      Admin
                    </option>
                    <option
                      value={RepositoryMemberRole.OWNER}
                      className={
                        member.role == RepositoryMemberRole.OWNER ? "bg-[#0E7490] text-white " : ""
                      }
                    >
                      Owner
                    </option>
                    <option
                      value={RepositoryMemberRole.CONTRIBUTOR}
                      className={
                        member.role == RepositoryMemberRole.CONTRIBUTOR
                          ? "bg-[#0E7490] text-white"
                          : ""
                      }
                    >
                      Contributor
                    </option>
                  </select>
                </div>
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
                    disabled
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
