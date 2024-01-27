
import { useNavigate } from "react-router-dom";
import { useGetNotifications } from "../../api/query/notifications/useGetNotifications";
import { useEffect, useState } from "react";

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const { data: notifications, refetch } = useGetNotifications(pageNumber);
  
  const showPreviousButton = pageNumber > 1;
  const showNextButton = notifications?.totalItems > pageNumber * pageSize;

  const handlePageChange = async (newPageNumber: number) => {
    await new Promise<void>((resolve) => {
      setPageNumber(newPageNumber);
      resolve();
    });
    refetch();
  };

  return  (
    <div className="min-h-screen bg-[#11151C] flex justify-center">
    <div className="w-full max-w-md">
      {notifications &&
        notifications.data.map((notification) => (
          <div
            key={notification.id}
            className="bg-gray-800 p-4 rounded-md mt-2"
          >
            <p
              dangerouslySetInnerHTML={{ __html: notification.message }}
              className="text-white"
            ></p>
            <p className="text-sm text-gray-300 mt-2">
              Date: {new Date(notification.dateTime).toLocaleString()}
            </p>
          </div>
        ))}
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
  </div>
  );
};
