import React from "react";
import { useLocation } from "react-router-dom";
import { Organization } from "../../store/model/organization.model";

export const OrganizationPage = () => {
  const { state } = useLocation();
  const organization: Organization = state;
  return <div>{organization.name}</div>;
};
