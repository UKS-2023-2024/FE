import { useEffect, useState } from "react";
import { currentUserAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useUpdateNotificationPreferences } from "../../api/mutations/notification/useUpdateNotificationPreferences";


export const UserNotificationPreferencesPage = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [notifications, setNotifications] = useState({email: false, github: false});
  const [showDropdown, setShowDropdown] = useState(false);
  const { mutateAsync: updateNotifications } = useUpdateNotificationPreferences();


  const handleCheckboxEmailChange = (event: any) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      email: event.target.checked,
    }));
  };


  const handleCheckboxGithubChange = (event: any) => {
    setNotifications((prevNotifications) => ({
      ...prevNotifications,
      github: event.target.checked,
    }));
  };

  const handleSaveNotificationPreferences = () => {
    updateNotifications({email: notifications.email, github: notifications.github})
  };

  useEffect(() => {
    if (currentUser?.notificationPreferences == 2)
      setNotifications({email: true, github: true})
    else if (currentUser?.notificationPreferences == 0) 
      setNotifications({email: true, github: false})
    else if (currentUser?.notificationPreferences == 1)
      setNotifications({email: false, github: true})
    else
      setNotifications({email: false, github: false})
  }, [currentUser])

  return (
    <div className="min-h-screen bg-[#11151C]">
      <div className="w-full flex justify-center items-center">
        <div className="w-1/2 flex flex-col items-center shadow-lg p-6 rounded">
          <h1 className="text-white text-2xl font-bold mb-4">Subscriptions</h1>

          <label className="text-white mb-2">
            Watching:</label>

            <div className="p-2 w-1/3">
          <div
            className="p-2 border border-gray-300 dark:border-gray-600 rounded appearance-none bg-gray-900 text-white text-sm w-full cursor-pointer flex justify-between items-center"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentUser?.notificationPreferences == 3 &&
              <span>Don't notify</span>
            }
            {currentUser?.notificationPreferences != 3 &&
              <span>Notify me on {notifications.email && <span>Email </span>} {notifications.github && <span>Github</span>}</span>
            }
            <svg
              className={`w-3 h-3 transition-transform transform ${
                showDropdown ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 15a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 15z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {showDropdown && (
            <div className="absolute mt-1 w-1/4 bg-gray-900 border border-gray-300 dark:border-gray-600 rounded text-sm">
              <div className="flex flex-col">
                <label className="text-white mb-2"> 
                  <input
                  type="checkbox"
                  name="email"
                  checked={notifications.email}
                  onChange={handleCheckboxEmailChange}/>
                  Email
                </label>

                <label className="text-white mb-2">
                  <input
                    type="checkbox"
                    name="github"
                    checked={notifications.github}
                    onChange={handleCheckboxGithubChange}/>
                  GitHub
                </label>
                <div className="flex justify-center">
                  <button className="bg-green-500 text-white w-1/2 rounded" onClick={handleSaveNotificationPreferences}>Save</button>
                </div>
              </div>
            </div>
          )}
        </div>

          
      </div>
    </div>
    </div>
  );
};