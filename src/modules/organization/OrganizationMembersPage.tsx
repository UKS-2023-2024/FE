import { useState } from "react";
import { Button } from "../../components/button/Button";
import { useAtom } from "jotai";
import { currentOrganizationAtom } from "../../store/store";
import { cn } from "../../utils/cn";
import githubPerson from "./../../assets/githubPerson.png";
import { AddOrganizationMemberForm } from "./forms/AddOrganizationMemberForm";
import { useGetOrganizationMembers } from "../../api/query/organization-member/useGetOrganizationMembers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/select";
import {
  OrganizationMemberPresenter,
  OrganizationMemberRole,
} from "../../store/model/organizationMember.model";
import { useGetOrganizationMemberRole } from "../../api/query/organization-member/useGetOrganizationMemberRole";
import { useRemoveOrganizationMember } from "../../api/mutations/organization-member/useRemoveOrganizationMember";
import { useChangeOrganizationMemberRole } from "../../api/mutations/organization-member/useChangeOrganizationMemberRole";

export const OrganizationMembersPage = () => {
  const [openForm, setOpenForm] = useState(false);
  const [organization] = useAtom(currentOrganizationAtom);
  const { data: organizationMembers } = useGetOrganizationMembers(organization?.id ?? "");
  const { data: userRole } = useGetOrganizationMemberRole(organization?.id ?? "");
  const { mutateAsync: removeOrganizationMember, isError: isErrorDelete } =
    useRemoveOrganizationMember();
  const hasPrivileges =
    userRole == OrganizationMemberRole.OWNER || userRole == OrganizationMemberRole.MODERATOR;
  const { mutateAsync: changeOrganizationMemberRole, isError: isErrorChange } =
    useChangeOrganizationMemberRole();

  const handleRemove = async (organizationMemberId: string) => {
    await removeOrganizationMember({
      organizationId: organization?.id ?? "",
      organizationMemberId: organizationMemberId,
    });
    if (!isErrorDelete) {
      const indexToRemove = organizationMembers.findIndex(
        (mem) => mem.memberId === organizationMemberId
      );
      if (indexToRemove !== -1) {
        organizationMembers.splice(indexToRemove, 1);
      }
    }
  };
  const handleRoleChange = async (
    organizationMember: OrganizationMemberPresenter,
    role: OrganizationMemberRole
  ) => {
    await changeOrganizationMemberRole({
      organizationId: organization?.id ?? "",
      organizationMemberId: organizationMember.memberId,
      organizationRole: role,
    });
    if (!isErrorChange) organizationMember.role = role;
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
          {organizationMembers.map((member: OrganizationMemberPresenter, key: number) => {
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
                {member.role == OrganizationMemberRole.OWNER ? (
                  <div className="w-[150px] h-9 text-[#A2A2A2] rounded-md border px-3 py-2 text-sm my-auto">
                    Owner
                  </div>
                ) : (
                  <div className="w-[150px] my-auto">
                    <Select
                      onValueChange={async (value: string) => {
                        const role = +value as OrganizationMemberRole;
                        await handleRoleChange(member, +role);
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
                        <SelectItem value={OrganizationMemberRole.MODERATOR.toString()}>
                          Moderator
                        </SelectItem>
                        <SelectItem value={OrganizationMemberRole.MEMBER.toString()}>
                          Member
                        </SelectItem>
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
                      handleRemove(member.memberId);
                    }}
                    disabled={false}
                  >
                    Remove
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <AddOrganizationMemberForm isOpen={openForm} setOpen={setOpenForm} />
    </div>
  );
};
