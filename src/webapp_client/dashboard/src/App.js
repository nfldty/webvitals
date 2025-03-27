import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register"
import Login from "./pages/Login"
import { BrowserRouter } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router";

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
