import ReactDOM from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import Dashboard from "./pages/DashboardPage";
import Header from "./components/Header";
import AssetPage from "./pages/AssetPage";
import Clients from "./pages/Clients";
import Contract from "./pages/Contract";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Dashboard />
      </>
    ),
  },
  {
    path: "/assets",
    element: (
      <>
        <Header />
        <AssetPage />
      </>
    ),
  },
  {
    path: "/clients",
    element: (
      <>
        <Header />
        <Clients />
      </>
    ),
  },

  {
    path: "/contracts",
    element: (
      <>
        <Header />
        <Contract />
      </>
    ),
  },
]);

const root = document.getElementById("root");

if (root) {
  ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
} else {
  throw new Error("Root element not found");
}
