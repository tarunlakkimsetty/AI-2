import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project, onFavourite, onDelete, onDuplicate, onRename }) {
  const navigate = useNavigate();

  return (
    <div className="col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm project-card">
        <div className="card-body d-flex flex-column">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="badge text-bg-primary-subtle text-primary-emphasis">{project.platform}</span>
            <button
              className={`btn btn-sm ${project.isFavourite ? 'text-warning' : 'text-secondary'}`}
              onClick={() => onFavourite(project.id)}
              title="Toggle favourite"
            >
              <i className={`bi ${project.isFavourite ? 'bi-star-fill' : 'bi-star'}`}></i>
            </button>
          </div>

          <h5 className="card-title text-truncate" title={project.title}>{project.title}</h5>
          <p className="text-secondary small mb-3">
            {project.tone} &middot; {project.audience} &middot; {project.language}
          </p>
          <p className="text-muted small mt-auto mb-2">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-sm btn-primary" onClick={() => navigate(`/result/${project.id}`)}>
              <i className="bi bi-eye me-1"></i>View
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onRename(project)}>
              <i className="bi bi-pencil"></i>
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => onDuplicate(project.id)}>
              <i className="bi bi-files"></i>
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(project.id)}>
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
