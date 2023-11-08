import { useToast } from "../../../components/toast";
import { CreateOrganizationRepositoryParams } from "../../../modules/repository/model/CreateOrganizationRepositoryParams copy";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useCreateOrganizationRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateOrganizationRepositoryParams) =>
      axios.post("/repositories/organization", data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Repository successfully created!",
      });
    },
    onError: (e: any) => {
      toast({
        title: e.response.data.Message,
        variant: "error",
      });
    },
  });
};
