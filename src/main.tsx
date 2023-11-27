import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routing";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
