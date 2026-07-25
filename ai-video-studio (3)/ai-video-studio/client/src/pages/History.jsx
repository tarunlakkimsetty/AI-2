import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';
import ProjectCard from '../components/ProjectCard';

export default function History() {
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects', {
        params: { search: search || undefined, favourites: favouritesOnly || undefined, sortBy, order }
      });
      setProjects(res.data.data.projects);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load history.', 'danger');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, favouritesOnly, sortBy, order]);

  useEffect(() => {
    const debounce = setTimeout(loadData, 300);
    return () => clearTimeout(debounce);
  }, [loadData]);

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
    showToast('Project renamed.', 'success');
    loadData();
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Project History</h3>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by title..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={`${sortBy}:${order}`}
                onChange={(e) => {
                  const [sb, o] = e.target.value.split(':');
                  setSortBy(sb);
                  setOrder(o);
                }}
              >
                <option value="created_at:DESC">Newest first</option>
                <option value="created_at:ASC">Oldest first</option>
                <option value="title:ASC">Title (A-Z)</option>
                <option value="title:DESC">Title (Z-A)</option>
              </select>
            </div>
            <div className="col-md-4">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="favSwitch"
                  checked={favouritesOnly}
                  onChange={(e) => setFavouritesOnly(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="favSwitch">
                  Favourites only
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading projects..." />
      ) : projects.length === 0 ? (
        <div className="text-center py-5 text-secondary">
          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
          No projects found.
        </div>
      ) : (
        <div className="row g-3">
          {projects.map((project) => (
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
