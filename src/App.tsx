import { Outlet } from "react-router-dom";
import "./App.css";
import { Menu } from "./components/navigation/Menu";
import { Toaster } from "./components/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-full">
        <Menu />
        <div className="h-[95%]">
          <Outlet />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
