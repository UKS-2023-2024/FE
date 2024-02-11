import { useState } from "react";
import { useGetRepositoryLabels } from "../../api/query/labels/useGetRepositoryLabels";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { Button } from "../../components";
import { Input } from "../../components/input/Input";
import { useCreateLabel } from "../../api/mutations/label/useCreateLabel";
import { useQueryClient } from "@tanstack/react-query";
import { LabelOverview } from "../../components/labels/LabelOverview";

export const LabelOverviewPage = () => {
  const queryClient = useQueryClient();
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const [search, setSearch] = useState<string>("");

  const { data: repositoryLabels } = useGetRepositoryLabels(
    selectedRepository,
    search
  );

  const { mutateAsync: createLabel } = useCreateLabel();

  const [isNewLabelFormVisible, setIsNewLabelFormVisible] =
    useState<boolean>(false);

  const [labelName, setLabelName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const setFormVisibility = () => {
    setIsNewLabelFormVisible(!isNewLabelFormVisible);
  };

  const handleCreateLabel = async () => {
    await createLabel({
      title: labelName,
      description,
      color,
      repositoryId: selectedRepository.id,
      isDefaultLabel: true,
    });
    queryClient.invalidateQueries(["repository-labels", selectedRepository.id]);
  };

  const handleSearchLabels = async (searchValue: string) => {
    setSearch(searchValue);
  };

  return (
    <div className="flex flex-col p-16">
      <div className="w-full flex justify-between p-2">
        <Input
          onChange={(e) => handleSearchLabels(e.target.value)}
          placeholder="Search labels"
        ></Input>
        <Button onClick={setFormVisibility} className="w-[100px]">
          New label
        </Button>
      </div>
      {isNewLabelFormVisible && (
        <div className="flex">
          <Input
            placeholder="Label name"
            onChange={(e) => setLabelName(e.target.value)}
          ></Input>
          <Input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
          ></Input>
          <Input
            placeholder="Color"
            onChange={(e) => setColor(e.target.value)}
          ></Input>
          <div className="flex gap-1">
            <Button onClick={setFormVisibility}>Cancel</Button>
            <Button onClick={handleCreateLabel}>Create label</Button>
          </div>
        </div>
      )}

      {repositoryLabels.map((label) => (
        <LabelOverview label={label}></LabelOverview>
      ))}
    </div>
  );
};
