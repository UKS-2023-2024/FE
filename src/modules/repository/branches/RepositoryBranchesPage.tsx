import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../../components/button/Button";
import { CreateBranchForm } from "./modals/CreateBranchForm";

export const RepositoryBranchesPage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const navigate = useNavigate();
  const [isOverviewButtonClicked, setIsOverviewButtonClicked] = useState(false);
  const [isYoursButtonClicked, setIsYoursButtonClicked] = useState(false);
  const [isAllButtonClicked, setIsAllButtonClicked] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);


  const handleOverviewButtonClick = () => {
    navigate(`/repository/${repository?.name}/branches`);
    setIsOverviewButtonClicked(true);
    setIsYoursButtonClicked(false)
    setIsAllButtonClicked(false)
  };
  const handleYoursButtonClick = () => {
    navigate(`/repository/${repository?.name}/branches/yours`);
    setIsYoursButtonClicked(true);
    setIsOverviewButtonClicked(false)
    setIsAllButtonClicked(false)
  };
  const handleAllButtonClick = () => {
    navigate(`/repository/${repository?.name}/branches/all`);
    setIsAllButtonClicked(true)
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
            isAllButtonClicked ? "bg-blue-500" : ""
          }`}
          onClick={handleAllButtonClick}
        >
          All branches
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