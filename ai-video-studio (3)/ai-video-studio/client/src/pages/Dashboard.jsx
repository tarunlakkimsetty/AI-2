import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';
import ProjectCard from '../components/ProjectCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, projectsRes] = await Promise.all([
        api.get('/projects/stats'),
        api.get('/projects', { params: { sortBy: 'created_at', order: 'DESC' } })
      ]);
      setStats(statsRes.data.data);
      setRecent(projectsRes.data.data.projects.slice(0, 6));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load dashboard.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFavourite = async (id) => {
    await api.patch(`/projects/${id}/favourite`);
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    await api.delete(`/projects/${id}`);
    showToast('Project deleted.', 'success');
    loadData();
  };

  const handleDuplicate = async (id) => {
    await api.post(`/projects/${id}/duplicate`);
    showToast('Project duplicated.', 'success');
    loadData();
  };

  const handleRename = async (project) => {
    const title = window.prompt('Rename project:', project.title);
    if (!title || title === project.title) return;
    await api.patch(`/projects/${project.id}/rename`, { title });
    loadData();
  };

  if (loading) return <Spinner label="Loading dashboard..." />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h3 className="fw-bold mb-0">Welcome back, {user?.name?.split(' ')[0]} 👋</h3>
          <p className="text-secondary mb-0">Here's a snapshot of your content studio.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/generate')}>
          <i className="bi bi-magic me-2"></i>Generate New Video
        </button>
      </div>

      <div className="row g-3 mb-4">
        <StatCard icon="bi-collection-play" label="Total Projects" value={stats?.total ?? 0} color="primary" />
        <StatCard icon="bi-star-fill" label="Favourites" value={stats?.favourites ?? 0} color="warning" />
        <StatCard icon="bi-calendar-month" label="This Month" value={stats?.thisMonth ?? 0} color="success" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Recent Projects</h5>
        <Link to="/history" className="small">View all</Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
          No projects yet. Generate your first video package!
        </div>
      ) : (
        <div className="row g-3">
          {recent.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onFavourite={handleFavourite}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm">
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`stat-icon bg-${color}-subtle text-${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>
          <div>
            <div className="fs-4 fw-bold">{value}</div>
            <div className="text-secondary small">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
