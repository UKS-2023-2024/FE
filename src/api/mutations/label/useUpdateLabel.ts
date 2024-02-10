import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { UpdateLabelParams } from "../../../models/labels/UpdateLabelParams";

export const useUpdateLabel = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (label: UpdateLabelParams) =>
      axios.post(`/labels/update`, label).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Label successfully updated!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with label update!",
        variant: "error",
      });
    },
  });
};
