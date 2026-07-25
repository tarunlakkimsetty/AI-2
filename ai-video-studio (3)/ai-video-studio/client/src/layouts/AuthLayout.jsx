import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="auth-shell d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-100" style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-camera-reels-fill fs-1 text-primary"></i>
          <h3 className="fw-bold mt-2">AI Video Content Studio</h3>
          <p className="text-secondary">Topic to full video package in one click.</p>
        </div>
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
