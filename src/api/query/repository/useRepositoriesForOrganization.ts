import { Repository } from "../../../store/model/repository.model";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../useAxios";

export const useGetRepositoriesForOrganization = (organizationId: string) => {
  const { axios } = useAxios();
  return useQuery<Repository[]>({
    initialData: [],
    queryKey: ["organization-repositories"],
    queryFn: () => axios.get(`/repositories/organization/${organizationId}`).then((res) => res.data),
  });
};
