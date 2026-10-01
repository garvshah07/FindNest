import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <></>,
    children: [],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
