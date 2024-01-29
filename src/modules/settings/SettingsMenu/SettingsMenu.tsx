import { useNavigate } from "react-router-dom"
import { SettingsMenuItem } from "./SettingsMenuItem"

export const SettingsMenu = () => {
    const navigate = useNavigate()
    return <div className="h-full w-[300px] flex flex-col gap-4">
        <SettingsMenuItem content="Profile" onClick={() => navigate("/settings/profile")} />
        <SettingsMenuItem content="Access" onClick={() => navigate("/settings/access")} />
        <SettingsMenuItem content="Notifications" onClick={() => navigate("/settings/notifications")} />
    </div>
}