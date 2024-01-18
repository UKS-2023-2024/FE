import { currentOrganizationAtom, currentRepositoryAtom, currentUserAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { useGetUserOrganizations } from "../../api/query/useGetUserOrganizations";
import { Organization } from "../../store/model/organization.model";
import { useEffect } from "react";

export const AllOrganizationsPage = () => {

    const navigate = useNavigate();

    const { data: userOrganizations } = useGetUserOrganizations();
    const [, setSelectedOrganization] = useAtom(currentOrganizationAtom);
  
    const handleOrganizationClick = (org: Organization) => {
      navigate(`/organizations/${org.name}`);
      setSelectedOrganization(org);
    };

  return (
    <div className="h-full bg-[#11151C]">
      <div className="w-full flex flex-col items-center pt-6">
        <Button onClick={() => navigate("/new-organization")} className="mb-5">New organization</Button>
        {userOrganizations.map((org: Organization) => (
          <div key={org.id} className="flex gap-8 border border-white rounded p-10 w-1/2">
            <div className="flex flex-col">
              <div
                className="h-[30px] text-white text-lg hover:underline hover:cursor-pointer"
                onClick={() => handleOrganizationClick(org)}
              >
                {org.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
