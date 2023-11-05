import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import { useGetUserOrganizations } from "../../api/query/useGetUserOrganizations";
import { Organization } from "../../store/model/organization.model";

export const Sidenav = () => {
  const navigate = useNavigate();
  const { data: userOrganizations } = useGetUserOrganizations();
  return (
    <div className="w-[300px] h-full flex flex-col p-6 bg-[#11151C] border-r-[1px] border-gray-600">
      <Button onClick={() => navigate("/new-organization")}>
        New organization
      </Button>
      <div className="border-b border-gray-600 mt-6 mb-6"></div>
      <div>
        {userOrganizations.map((org: Organization) => (
          <div
            className="h-[30px] text-white text-lg hover:underline hover:cursor-pointer"
            onClick={() =>
              navigate(`/organizations/${org.name}`, { state: org })
            }
          >
            {org.name}
          </div>
        ))}
      </div>
    </div>
  );
};
