import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  const themeIcon = theme === 'light' ? 'bi-sun' : theme === 'dark' ? 'bi-moon-stars' : 'bi-circle-half';

  return (
    <nav className="app-navbar navbar navbar-expand px-3 py-2 border-bottom d-flex align-items-center">
      <button className="btn btn-sm btn-outline-secondary me-2" onClick={onToggleSidebar}>
        <i className="bi bi-list"></i>
      </button>
      <span className="fw-semibold flex-grow-1">AI Video Content Studio</span>

      <button className="btn btn-sm btn-outline-secondary me-2" onClick={cycleTheme} title={`Theme: ${theme}`}>
        <i className={`bi ${themeIcon}`}></i>
      </button>

      <div className="dropdown">
        <button
          className="btn btn-sm btn-primary dropdown-toggle d-flex align-items-center gap-2"
          data-bs-toggle="dropdown"
        >
          <i className="bi bi-person-fill"></i>
          {user?.name}
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
          <li>
            <button className="dropdown-item" onClick={() => navigate('/profile')}>
              <i className="bi bi-person-circle me-2"></i>Profile
            </button>
          </li>
          <li>
            <button className="dropdown-item" onClick={() => navigate('/settings')}>
              <i className="bi bi-gear me-2"></i>Settings
            </button>
          </li>
          <li><hr className="dropdown-divider" /></li>
          <li>
            <button className="dropdown-item text-danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
