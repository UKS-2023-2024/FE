import { useEffect, useMemo, useState } from "react";
import { currentUserAtom } from "../../store/store";
import { useAtomValue } from "jotai";
import { useUpdateNotificationPreferences } from "../../api/mutations/notification/useUpdateNotificationPreferences";
import { Button, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "../../components";


export const SettingsNotifications = () => {
  const currentUser = useAtomValue(currentUserAtom);
  const [notifications, setNotifications] = useState({ email: false, github: false });
  const { mutateAsync: updateNotifications } = useUpdateNotificationPreferences();


  const handleChecking = (field: "email" | "github") =>
    (val: boolean) => setNotifications({
      ...notifications,
      [field]: val
    })
  const handleUpdateNotifications = async () => {
    await updateNotifications(notifications)
  }

  useEffect(() => {
    if (currentUser?.notificationPreferences == 2)
      setNotifications({ email: true, github: true })
    else if (currentUser?.notificationPreferences == 0)
      setNotifications({ email: true, github: false })
    else if (currentUser?.notificationPreferences == 1)
      setNotifications({ email: false, github: true })
    else
      setNotifications({ email: false, github: false })
  }, [currentUser])

  const notificationMessage = useMemo(() => {
    if (notifications.email && notifications.github) return "Email, Github";
    if (notifications.email && !notifications.github) return "Email"
    if (!notifications.email && notifications.github) return "Github"
    return "Don't notify!"
  }, [notifications])

  return (
    <div className="w-full h-full flex flex-col gap-2 text-white">
      <h2 className="text-3xl text-white">
        Notifications
      </h2>
      <hr className="w-full bg-gray" />
      <div className="w-full h-full">
        <div className="w-full flex flex-col gap-2">
          <DropdownMenu >
            <DropdownMenuTrigger className="text-white w-[400px]" asChild>
              <button className="border border-white p-2 rounded"> Notification Preferences: ({notificationMessage})</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuCheckboxItem
                checked={notifications.email}
                onCheckedChange={handleChecking("email")}
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={notifications.github}
                onCheckedChange={handleChecking("github")}
              >
                Github
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-1">
            <small>Current Settings:</small>
            <small>{notificationMessage}</small>
          </div>

          <Button onClick={handleUpdateNotifications} className="w-[200px]">Save</Button>
        </div>
      </div>
    </div>
  );
};