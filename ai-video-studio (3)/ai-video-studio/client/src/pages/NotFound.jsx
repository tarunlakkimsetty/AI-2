import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3">
      <i className="bi bi-camera-reels display-1 text-primary mb-3"></i>
      <h1 className="fw-bold">404</h1>
      <p className="text-secondary mb-4">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary">
        <i className="bi bi-house-door me-2"></i>Back to Dashboard
      </Link>
    </div>
  );
}
