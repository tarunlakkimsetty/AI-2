import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner label="Checking session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
