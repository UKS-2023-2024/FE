import { Outlet } from "react-router-dom";
import "./App.css";
import { Menu } from "./components/navigation/Menu";
import { Toaster } from "./components/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen">
        <Menu />
        <div className="h-[calc(100%-57px)]">
          <Outlet />
        </div>
        <Toaster />
      </div>
      <ReactQueryDevtools initialIsOpen={false} position="top" />
    </QueryClientProvider>
  );
}

export default App;
