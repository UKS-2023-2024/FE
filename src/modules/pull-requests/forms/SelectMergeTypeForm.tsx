import { Modal } from "flowbite-react";
import { useState } from "react";
import { Button } from "../../../components/button/Button";
import { MergeType } from "../../../store/model/pullRequest.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/select";

interface Props {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: (mergeType: MergeType) => void;
}

export const SelectMergeTypeForm = ({ isOpen, setOpen, onClick }: Props) => {
  const [mergeType, setMergeType] = useState<MergeType>(MergeType.MERGE);

  return (
    <Modal
      show={isOpen}
      onClose={() => {
        setOpen(false);
      }}
    >
      <div className="bg-[#30363d] rounded-md">
        <Modal.Header>
          <span className="text-white">Merge pull request</span>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col align-middle mb-4">
            <div className="w-1/2 mx-auto">
              <Select
                onValueChange={async (value: string) => {
                  setMergeType(+value);
                }}
                value={mergeType.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Merge type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MergeType.MERGE.toString()}>Merge</SelectItem>
                  <SelectItem value={MergeType.REBASE.toString()}>Rebase</SelectItem>
                  <SelectItem value={MergeType.SQUASH.toString()}>Squash</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full mt-4"
                onClick={() => {
                  onClick(mergeType);
                  setOpen(false);
                }}
              >
                Merge pull request
              </Button>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};
