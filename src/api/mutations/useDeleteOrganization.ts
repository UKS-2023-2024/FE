import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/toast";
import { useAxios } from "../useAxios";
import { useMutation } from "@tanstack/react-query";

export const useDeleteOrganization = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/organizations/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Organization successfully deleted!",
      });
      navigate("/home");
    },
    onError: () => {
      toast({
        title: "Something wrong with organization deletion!",
        variant: "error",
      });
    },
  });
};
