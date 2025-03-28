import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"
import Login from "./pages/Login"
import SessionReplay from "./pages/SessionReplay"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Heatmap from "./pages/Heatmap";

const router = createBrowserRouter([
  {
    path: 'app/dashboard',
    element: <Dashboard />,
  },
  {
    path: 'app/register',
    element: <Register />,
  },
  {
    path: 'app/login',
    element: <Login />,
  },
  {
    path: 'app/heatmap',
    element: <Heatmap />,
  },
  {
    path: 'app/session-replay',
    element: <SessionReplay />,
  },
  {// You might want to set this as the default route
    path: '/*',
    element: <Login />, // default route
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