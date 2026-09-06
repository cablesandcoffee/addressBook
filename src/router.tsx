import { createBrowserRouter } from "react-router";
import App from "./App";
import { EmployeeDetail, EmployeeList } from "./pages";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      { index: true, element: <EmployeeList /> },
      { path: "employee/:id", element: <EmployeeDetail /> },
    ],
  },
]);

export default router;
