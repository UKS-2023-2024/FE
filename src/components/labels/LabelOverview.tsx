import { useAtom } from "jotai";
import { useDeleteLabel } from "../../api/mutations/label/useDeleteLabel";
import { Button } from "../button/Button";
import { useQueryClient } from "@tanstack/react-query";
import { currentRepositoryAtom } from "../../store/store";
import { Label } from "../../store/model/label.model";
import { useState } from "react";
import { dividerClasses } from "@mui/material";
import { Input } from "../input/Input";
import { useUpdateLabel } from "../../api/mutations/label/useUpdateLabel";

interface Props {
  label: Label;
}

export const LabelOverview = ({ label }: Props) => {
  const queryClient = useQueryClient();
  const [selectedRepository] = useAtom(currentRepositoryAtom);
  const [editingMode, setEditingMode] = useState<boolean>(false);

  const [labelName, setLabelName] = useState<string>(label.title);
  const [description, setDescription] = useState<string>(label.description);
  const [color, setColor] = useState<string>(label.color);

  const { mutateAsync: deleteLabel } = useDeleteLabel();
  const { mutateAsync: updateLabel } = useUpdateLabel();

  const handleDeleteLabel = async (labelId: string) => {
    await deleteLabel(labelId);
    queryClient.invalidateQueries(["repository-labels", selectedRepository.id]);
  };

  const handleUpdateLabel = async (label: Label) => {
    await updateLabel({
      id: label.id,
      title: labelName,
      description,
      color,
    });
    queryClient.invalidateQueries(["repository-labels", selectedRepository.id]);
    disableEditingMode();
  };

  const enableEditingMode = () => {
    setEditingMode(true);
  };

  const disableEditingMode = () => {
    setEditingMode(false);
  };

  return (
    <div className="flex justify-between items-center border border-gray-700 p-6 mt-2 rounded">
      {editingMode ? (
        <>
          <Input
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          ></Input>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></Input>
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
          ></Input>
          <Button onClick={disableEditingMode}>Cancel</Button>
          <Button onClick={() => handleUpdateLabel(label)}>Save changes</Button>
        </>
      ) : (
        <>
          <span
            style={{ color: label.color, borderColor: label.color }}
            className={`border rounded-lg p-2`}
          >
            {label.title}
          </span>
          <span className="text-gray-400">{label.description}</span>
        </>
      )}

      <div className="flex gap-2">
        {!editingMode && <Button onClick={enableEditingMode}>Edit</Button>}
        <Button
          onClick={() => handleDeleteLabel(label.id)}
          className="bg-red-600 hover:bg-red-500"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
