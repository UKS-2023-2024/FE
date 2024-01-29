import { useToast } from "../../../components/toast";
import { useAxios } from "../../useAxios";
import { useMutation } from "@tanstack/react-query";
import { UpdateRepositoryParams } from "../../../models/repositories/UpdateRepositoryParams";
import { Repository } from "../../../store/model/repository.model";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";

export const useUpdateRepository = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const [, setSelectedRepository] = useAtom(currentRepositoryAtom);
  return useMutation({
    mutationFn: (data: UpdateRepositoryParams) =>
      axios.patch("/repositories", data).then((res) => res.data),
    onSuccess: (repository: Repository) => {
      setSelectedRepository(repository)
      toast({
        title: "Successfully updated repository!",
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
