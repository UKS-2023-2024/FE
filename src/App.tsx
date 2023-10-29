import { Outlet } from "react-router-dom";
import "./App.css";
import { Menu } from "./components/navigation/Menu";

function App() {
  return (
    <div className="h-screen w-full">
      <Menu />
      <div className="h-[95%]">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
