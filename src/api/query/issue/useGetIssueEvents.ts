import { useAxios } from "../../useAxios";
import { useQuery } from "@tanstack/react-query";

export const useGetIssueEvents = (id: string | null) => {
  const { axios } = useAxios();
  return useQuery<any[]>({
    //initialData: {},
    queryKey: ["issue-events", id],
    queryFn: () =>
      axios.get(`issues/${id ?? ""}/events`).then((res) => res.data),
  });
};
