/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAcceptRepositoryInvite } from "../../api/mutations/repository-member/useAcceptRepositoryInvite";

export const RepositoryInviteAcceptPage = () => {
  const { token } = useParams();
  const { mutateAsync: acceptRepositoryInvite } = useAcceptRepositoryInvite();
  const navigate = useNavigate();
  useEffect(() => {
    handleInviteAccept();
    navigate("/");
  }, []);
  const handleInviteAccept = async () => {
    if (token === undefined) return;
    await acceptRepositoryInvite(token);
  };

  return <div className="h-full bg-[#11151C]"></div>;
};
