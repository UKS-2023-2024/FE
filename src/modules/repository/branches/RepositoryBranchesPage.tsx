import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../../components/button/Button";
import { CreateBranchForm } from "./CreateBranchForm";

export const RepositoryBranchesPage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const navigate = useNavigate();
  const [isOverviewButtonClicked, setIsOverviewButtonClicked] = useState(false);
  const [isYoursButtonClicked, setIsYoursButtonClicked] = useState(false);
  const [isActiveButtonClicked, setIsActiveButtonClicked] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);


  const handleOverviewButtonClick = () => {
    navigate(`/repository/${repository?.name}/branches`);
    setIsOverviewButtonClicked(true);
    setIsYoursButtonClicked(false)
    setIsActiveButtonClicked(false)
  };
  const handleYoursButtonClick = () => {
    navigate(`/repository/${repository?.name}/branches/yours`);
    setIsYoursButtonClicked(true);
    setIsOverviewButtonClicked(false)
    setIsActiveButtonClicked(false)
  };
  const handleActiveButtonClick = () => {
    navigate(`/repository/${repository?.name}/branches/active`);
    setIsActiveButtonClicked(true)
    setIsOverviewButtonClicked(false)
    setIsYoursButtonClicked(false)
  };

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="w-full flex flex-row justify-center items-center">
        <button
          className={`w-1/8 border p-3 rounded cursor-pointer text-white border-gray-500 ${
            isOverviewButtonClicked ? "bg-blue-500" : ""
          }`}
          onClick={handleOverviewButtonClick}
        >
          Overview
        </button>
        <button
          className={`w-1/8 border p-3 rounded cursor-pointer text-white border-gray-500 ${
            isYoursButtonClicked ? "bg-blue-500" : ""
          }`
        }
        onClick={handleYoursButtonClick}
        >
          Yours
        </button>
        <button
          className={`w-1/8 border p-3 rounded cursor-pointer text-white border-gray-500 ${
            isActiveButtonClicked ? "bg-blue-500" : ""
          }`}
          onClick={handleActiveButtonClick}
        >
          Active
        </button>
        <Button
          className="w-1/8 ml-5"
          onClick={() => setOpenCreate(true)}
        >
          New branch
        </Button>
      </div>
      <Outlet></Outlet>
      <CreateBranchForm isOpen={openCreate} setOpen={setOpenCreate}/>
    </div>
  );
};