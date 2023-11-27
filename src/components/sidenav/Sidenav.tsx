import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import { useGetUserOrganizations } from "../../api/query/useGetUserOrganizations";
import { Organization } from "../../store/model/organization.model";
import { currentOrganizationAtom } from "../../store/store";
import { useAtom } from "jotai";

export const Sidenav = () => {
  const navigate = useNavigate();
  const { data: userOrganizations } = useGetUserOrganizations();
  const [, setSelectedOrganization] = useAtom(currentOrganizationAtom);

  const handleOrganizationClick = (org: Organization) => {
    navigate(`/organizations/${org.name}`);
    setSelectedOrganization(org);
  };
  return (
    <div className="w-[300px] h-full flex flex-col p-6 bg-[#11151C] border-r-[1px] border-gray-600">
      <Button className="mb-5" onClick={() => navigate("/repositories")}>
        My Repositories
      </Button>
      <Button onClick={() => navigate("/new-organization")}>New organization</Button>
      <div className="border-b border-gray-600 mt-6 mb-6"></div>
      <div>
        {userOrganizations.map((org: Organization) => (
          <div
            key={org.id}
            className="h-[30px] text-white text-lg hover:underline hover:cursor-pointer"
            onClick={() => handleOrganizationClick(org)}
          >
            {org.name}
          </div>
        ))}
      </div>
    </div>
  );
};
