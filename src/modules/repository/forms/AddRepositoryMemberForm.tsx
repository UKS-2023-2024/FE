import { Modal } from "flowbite-react";
import { useState } from "react";
import { useSearchUsers } from "../../../api/query/useSearchUsers";
import { SearchableDropdown } from "../../../components/dropdown/SearchableDropdown";
import { User } from "../../../store/model/user.model";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { useAddRepositoryMember } from "../../../api/mutations/repository-member/useAddRepositoryMember";
import { Button } from "../../../components/button/Button";

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddRepositoryMemberForm = ({ isOpen, setOpen }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { mutateAsync: addRepositoryMember } = useAddRepositoryMember();
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: searchedUsers } = useSearchUsers(searchValue);
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);

  const handleChangeOptions = (value: string) => {
    setSearchValue(value);
  };

  const handleSelect = (values: any[]) => {
    setPendingMembers(values);
  };

  const addMembers = () => {
    pendingMembers.forEach((user) => {
      addRepositoryMember({ repositoryId: repository?.id ?? "", userId: user.value.id });
    });
    setOpen(false);
  };

  const mapOptions = () => {
    if (!searchedUsers) return [];
    return searchedUsers.map((user: User) => ({
      label: user.username,
      value: user,
    }));
  };

  return (
    <Modal
      show={isOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className="bg-[#30363d] rounded-md">
        <Modal.Header>
          <span className="text-white">Add member</span>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col align-middle mb-4">
            <div className=" w-2/3 mx-auto">
              <SearchableDropdown
                options={mapOptions()}
                handleChangeOptions={(value) => handleChangeOptions(value)}
                handleSelect={(values) => handleSelect(values)}
              ></SearchableDropdown>
              <Button onClick={() => addMembers()} className="w-full mt-6">
                Add members
              </Button>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};
