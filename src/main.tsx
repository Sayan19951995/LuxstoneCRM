import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import App from "./App";
import Dashboard from "./pages/Dashboard";
import Sales from "./pages/Sales";
import Inventory from "./pages/Inventory";
import InTransit from "./pages/InTransit";
import Materials from "./pages/Materials";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "sales", element: <Sales /> },
      { path: "inventory", element: <Inventory /> },
      { path: "in-transit", element: <InTransit /> },
      { path: "materials", element: <Materials /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
