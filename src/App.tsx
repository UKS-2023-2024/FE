import { Outlet } from "react-router-dom";
import "./App.css";
import { Menu } from "./components/navigation/Menu";
import { Toaster, useToast } from "./components/toast";
import { useEffect } from "react";

function App() {
  const { toast } = useToast();

  useEffect(() => {
    console.log("component has mounted");
    toast({
      description: "Component has mounted",
    });
  }, []);
  return (
    <div className="h-screen w-full">
      <Menu />
      <div className="h-[95%]">
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
