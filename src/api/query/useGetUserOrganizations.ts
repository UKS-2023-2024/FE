import { Organization } from "../../store/model/organization.model";
import { useAxios } from "../useAxios";
import { useQuery } from "@tanstack/react-query";

export const useGetUserOrganizations = () => {
  const { axios } = useAxios();
  return useQuery<Organization[]>({
    initialData: [],
    queryKey: ["user-organizations"],
    queryFn: () => axios.get(`/organizations/member`).then((res) => res.data),
  });
};
