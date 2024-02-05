import { useToast } from "../../components/toast";
import { CreateOrganizationParams } from "../../models/organization/CreateOrganizationParams";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useCreateOrganization = () => {
  const { axios } = useAxios();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateOrganizationParams) =>
      axios.post("/organizations", data).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Organization successfully created!",
      });
    },
    onError: () => {
      toast({
        title: "Something wrong with organization creation!",
        variant: "error",
      });
    },
  });
};
