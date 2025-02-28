import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"
import Login from "./pages/Login"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

const router = createBrowserRouter([
  {
    path: '/*',
    element: <Login />, // You might want to set this as the default route
  },
  {
    path: '/home',
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
]);

function App() {
  return (
    <div>
      <div className="app">
        <div className="container">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}

export default App;
