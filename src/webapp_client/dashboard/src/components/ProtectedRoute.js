import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {

  if (!localStorage.getItem('userId')) return <Navigate to="/app/login" replace />;

  return element;
};

export default ProtectedRoute;
