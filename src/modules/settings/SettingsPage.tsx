import { Outlet, useLocation } from "react-router-dom"
import { SettingsMenu } from "./SettingsMenu/SettingsMenu"
import { useEffect } from "react";

export const SettingsPage = () => {
    return <div className="flex w-full min-h-full p-2 bg-black gap-2">
        <div className="flex-1">
            <SettingsMenu />
        </div>
        <div className="flex flex-col flex-[5] bg-[#11151C] p-4 gap-2">
            <Outlet />
        </div>
    </div>
}