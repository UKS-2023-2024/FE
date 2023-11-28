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
import { cn } from "../../utils/cn";
import githubPerson from "./../../../public/githubPerson.png";
import { useGetRepositoryMemberRole } from "../../api/query/repository-member/useGetRepositoryMemberRole";
import { useRemoveRepositoryMember } from "../../api/mutations/repository-member/useRemoveRepositoryMember";

export const RepositoryMembersPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: repositoryMembers } = useGetRepositoryMembers(repository?.id ?? "");
  const { data: userRole } = useGetRepositoryMemberRole(repository?.id ?? "");
  const { mutateAsync: removeRepositoryMember } = useRemoveRepositoryMember();
  const hasPrivileges =
    userRole == RepositoryMemberRole.ADMIN || userRole == RepositoryMemberRole.OWNER;

  const handleRemove = (repositoryMemberId: string) => {
    removeRepositoryMember({
      repositoryId: repository?.id ?? "",
      repositoryMemberId: repositoryMemberId,
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
                  >
                    <option
                      value={RepositoryMemberRole.ADMIN}
                      className={
                        member.role == RepositoryMemberRole.ADMIN ? "bg-[#0E7490] text-white" : ""
                      }
                      onClick={() => console.log("yoyu")}
                    >
                      Admin
                    </option>
                    <option
                      value={RepositoryMemberRole.OWNER}
                      className={
                        member.role == RepositoryMemberRole.OWNER ? "bg-[#0E7490] text-white " : ""
                      }
                      onClick={() => console.log("yoyu")}
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
                      onClick={() => console.log("yoyu")}
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
                    onClick={() => handleRemove(member.id)}
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
