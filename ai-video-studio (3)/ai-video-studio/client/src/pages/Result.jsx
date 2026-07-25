import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';
import CopyButton from '../components/CopyButton';
import { downloadResultAsJson, downloadResultAsTxt } from '../utils/download';

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/projects/${id}`)
      .then((res) => setProject(res.data.data.project))
      .catch((err) => {
        showToast(err.response?.data?.message || 'Project not found.', 'danger');
        navigate('/history');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Spinner label="Loading project..." />;
  if (!project) return null;

  const r = project.result;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
        <div>
          <Link to="/history" className="small d-block mb-1">
            <i className="bi bi-arrow-left me-1"></i>Back to History
          </Link>
          <h3 className="fw-bold mb-0">{r.title}</h3>
          <p className="text-secondary mb-0">
            {project.platform} &middot; {project.tone} &middot; {project.audience} &middot; {project.language}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => downloadResultAsTxt(r, r.title)}>
            <i className="bi bi-file-earmark-text me-1"></i>Download TXT
          </button>
          <button className="btn btn-outline-secondary" onClick={() => downloadResultAsJson(r, r.title)}>
            <i className="bi bi-filetype-json me-1"></i>Download JSON
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <InfoBadge icon="bi-stopwatch" label="Duration" value={r.duration} />
        <InfoBadge icon="bi-music-note-beamed" label="Music" value={r.musicSuggestion} />
        <InfoBadge icon="bi-image" label="Thumbnail Prompt" value={r.thumbnailPrompt} />
      </div>

      <Section title="Hook" icon="bi-magnet" text={r.hook} />
      <Section title="Introduction" icon="bi-play-circle" text={r.introduction} />
      <Section title="Full Script" icon="bi-file-earmark-richtext" text={r.script} multiline />
      <Section title="Voice-Over Only" icon="bi-mic" text={r.voiceOver} multiline />
      <Section title="Summary" icon="bi-card-text" text={r.summary} />
      <Section title="Call To Action" icon="bi-megaphone" text={r.callToAction} />
      <Section title="Subtitle / Captions Track" icon="bi-badge-cc" text={r.subtitle} multiline />

      {/* Scenes */}
      <div className="card shadow-sm mb-3">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span><i className="bi bi-film me-2"></i>Scenes ({r.scenes?.length || 0})</span>
        </div>
        <div className="card-body">
          {(r.scenes || []).map((scene) => (
            <div key={scene.scene} className="border rounded p-3 mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <strong>Scene {scene.scene}: {scene.title}</strong>
                <span className="badge text-bg-secondary">{scene.duration}</span>
              </div>
              <p className="mb-1 small"><strong>Visual:</strong> {scene.visual}</p>
              <p className="mb-0 small text-secondary"><strong>Notes:</strong> {scene.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="card shadow-sm mb-3">
        <div className="card-header"><i className="bi bi-graph-up-arrow me-2"></i>SEO</div>
        <div className="card-body">
          <Section title="SEO Title" text={r.seo?.title} compact />
          <Section title="SEO Description" text={r.seo?.description} compact />
          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold small">Keywords</span>
              <CopyButton text={(r.seo?.keywords || []).join(', ')} />
            </div>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {(r.seo?.keywords || []).map((k) => <span key={k} className="badge text-bg-light border">{k}</span>)}
            </div>
          </div>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold small">Tags</span>
              <CopyButton text={(r.seo?.tags || []).join(', ')} />
            </div>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {(r.seo?.tags || []).map((t) => <span key={t} className="badge text-bg-light border">#{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Captions */}
      <div className="card shadow-sm mb-3">
        <div className="card-header"><i className="bi bi-chat-square-text me-2"></i>Social Captions</div>
        <div className="card-body">
          <Section title="YouTube" text={r.captions?.youtube} compact />
          <Section title="Instagram" text={r.captions?.instagram} compact />
          <Section title="LinkedIn" text={r.captions?.linkedin} compact />
          <Section title="Twitter / X" text={r.captions?.twitter} compact />
          <Section title="Facebook" text={r.captions?.facebook} compact last />
        </div>
      </div>

      {/* B-roll */}
      <div className="card shadow-sm mb-4">
        <div className="card-header"><i className="bi bi-collection-play me-2"></i>B-Roll Ideas</div>
        <div className="card-body">
          <ul className="mb-0">
            {(r.brollIdeas || []).map((idea, i) => <li key={i}>{idea}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoBadge({ icon, label, value }) {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm h-100">
        <div className="card-body py-2 px-3">
          <div className="small text-secondary"><i className={`bi ${icon} me-1`}></i>{label}</div>
          <div className="fw-semibold text-truncate" title={value}>{value}</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, text, multiline = false, compact = false, last = false }) {
  if (compact) {
    return (
      <div className={`mb-${last ? '0' : '3'}`}>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold small">{title}</span>
          <CopyButton text={text || ''} />
        </div>
        <p className="mb-0 small text-secondary">{text}</p>
      </div>
    );
  }
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span>{icon && <i className={`bi ${icon} me-2`}></i>}{title}</span>
        <CopyButton text={text || ''} />
      </div>
      <div className="card-body">
        <p className={`mb-0 ${multiline ? 'text-body' : ''}`} style={multiline ? { whiteSpace: 'pre-wrap' } : {}}>
          {text}
        </p>
      </div>
    </div>
  );
}
