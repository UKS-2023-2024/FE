import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../../store/store";
import { useGetUserActiveBranchesByRepositoryId } from "../../../api/query/branch/useGetUserActiveBranchesByRepositoryId";
import { Branch } from "../../../store/model/branch.model";
import { useState } from "react";

export const RepositoryYoursBranchesPage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10; 

  const { data: yourBranches, refetch } = useGetUserActiveBranchesByRepositoryId(repository?.id ?? "", pageNumber);

  const handlePageChange = async (newPageNumber: number) => {
    await new Promise<void>((resolve) => {
      setPageNumber(newPageNumber);
      resolve();
    });
    refetch();
  };

  const showPreviousButton = pageNumber > 1;
  const showNextButton = yourBranches?.totalItems > pageNumber * pageSize;

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="w-1/2 border border-white text-white rounded mt-5">
        <div className="p-2">Your branches</div>
        {yourBranches?.data.map((b: Branch) => (
          <div className="border border-white p-3" key={b.id}>
            {b?.name}
          </div>
        ))}
      </div>
      <div className="flex justify-between w-1/2 mt-4">
        {showPreviousButton && (
          <div className="text-center py-1 px-3 text-blue-500 cursor-pointer underline" onClick={() => handlePageChange(pageNumber - 1)}>
            Previous
          </div>
        )}
        {showNextButton && (
          <div className="text-center py-1 px-3 text-blue-500 cursor-pointer underline" onClick={() => handlePageChange(pageNumber + 1)}>
            Next
          </div>
        )}
      </div>
    </div>
  );
};