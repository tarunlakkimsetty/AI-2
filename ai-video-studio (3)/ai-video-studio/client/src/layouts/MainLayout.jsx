import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="app-shell d-flex">
      <Sidebar collapsed={collapsed} />
      <div className="app-main flex-grow-1 d-flex flex-column">
        <Navbar onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="app-content flex-grow-1 p-3 p-md-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
