import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"
import Login from "./pages/Login"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

const router = createBrowserRouter([
  {
    path: '/app/home',
    element: <Dashboard />,
  },
  {
    path: '/app/register',
    element: <Register />,
  },
  {
    path: '/app/login',
    element: <Login />,
  },
  {
    path: '/app/*',
    element: <Login />, // You might want to set this as the default route
  },
]);

function App() {
  return (
    <div role="application">
      <div className="app" role="main">
        <div className="container" role="region" aria-label="content">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}

export default App;
