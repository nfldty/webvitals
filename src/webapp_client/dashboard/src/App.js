import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"
import Login from "./pages/Login"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/*',
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
