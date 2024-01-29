import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";
import { useToast } from "../../../components/toast";
import { CreateMilestoneParams } from "../../../models/milestones/CreateMilestoneParams";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";

export const useEditMilestone = () => {
  const { axios } = useAxios();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedRepository] = useAtom(currentRepositoryAtom);

  return useMutation({
    mutationFn: (params: CreateMilestoneParams) =>
      axios.put(`/milestones/update`, params).then((res) => res.data),
    onSuccess: () => {
      toast({
        title: "Milestone successfully edited!",
      });
      navigate(`/repository/${selectedRepository.name}/milestones`);
    },
    onError: () => {
      toast({
        title: "Something wrong with milestone editing!",
        variant: "error",
      });
    },
  });
};
