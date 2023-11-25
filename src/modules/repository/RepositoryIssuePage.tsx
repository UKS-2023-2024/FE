import React from "react";
import { Button } from "../../components/button/Button";
import { useNavigate, useParams } from "react-router-dom";

export const RepositoryIssuePage = () => {
  const navigate = useNavigate();
  const { name } = useParams();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[80%]">
        <Button onClick={() => navigate(`/repository/${name}/milestones`)}>
          Milestones
        </Button>
      </div>
    </div>
  );
};
