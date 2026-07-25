import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/generate', icon: 'bi-magic', label: 'Generate Video' },
  { to: '/history', icon: 'bi-clock-history', label: 'History' },
  { to: '/profile', icon: 'bi-person-circle', label: 'Profile' },
  { to: '/settings', icon: 'bi-gear', label: 'Settings' }
];

export default function Sidebar({ collapsed, onNavigate }) {
  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand d-flex align-items-center gap-2 px-3 py-3">
        <i className="bi bi-camera-reels-fill fs-4 text-primary"></i>
        {!collapsed && <span className="fw-bold">AI Video Studio</span>}
      </div>
      <nav className="nav flex-column px-2 gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `nav-link sidebar-link d-flex align-items-center gap-2 rounded ${isActive ? 'active' : ''}`
            }
          >
            <i className={`bi ${link.icon}`}></i>
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
