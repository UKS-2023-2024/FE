/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAcceptOrganizationInvite } from "../../api/mutations/organization-member/useAcceptOrganizationInvite";

export const OrganizationInviteAcceptPage = () => {
  const { token } = useParams();
  const { mutateAsync: acceptOrganizationInvite } = useAcceptOrganizationInvite();
  const navigate = useNavigate();
  useEffect(() => {
    handleInviteAccept();
    navigate("/");
  }, []);
  const handleInviteAccept = async () => {
    if (token === undefined) return;
    await acceptOrganizationInvite(token);
  };

  return <div className="h-full bg-[#11151C]"></div>;
};
