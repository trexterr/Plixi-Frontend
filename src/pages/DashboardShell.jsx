import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DashboardTopbar from '../components/DashboardTopbar';

export default function DashboardShell() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dashboard-app">
      <Sidebar />
      <main className="dashboard-main">
        <DashboardTopbar isReady={ready} />
        <div className="dashboard-content">
          <Outlet context={{ ready }} />
        </div>
      </main>
    </div>
  );
}
