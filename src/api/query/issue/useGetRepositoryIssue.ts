import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";
import { Issue } from "../../../store/model/issue.model";

export const useGetRepositoryIssue = (id: string | null) => {
  const { axios } = useAxios();
  return useQuery<Issue>({
    //initialData: {},
    queryKey: ["repository-issues", id],
    queryFn: () => axios.get(`issues/${id ?? ""}/`).then((res) => res.data),
  });
};
