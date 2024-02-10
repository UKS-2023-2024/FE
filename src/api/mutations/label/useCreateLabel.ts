import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { CreateLabelParams } from "../../../models/labels/CreateLabelParams";

export const useCreateLabel = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (params: CreateLabelParams) =>
      axios.post(`/labels`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Label successfully created!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with label creation!",
        variant: "error",
      });
    },
  });
};
