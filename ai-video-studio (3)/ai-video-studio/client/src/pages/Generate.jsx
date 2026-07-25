import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useToast from '../hooks/useToast';

const INPUT_TABS = [
  { key: 'topic', label: 'Topic', icon: 'bi-lightbulb' },
  { key: 'url', label: 'Blog URL', icon: 'bi-link-45deg' },
  { key: 'text', label: 'Plain Text', icon: 'bi-file-text' },
  { key: 'file', label: 'Upload .txt', icon: 'bi-upload' }
];

const TONES = ['Casual', 'Professional', 'Energetic', 'Educational', 'Humorous', 'Inspirational'];
const AUDIENCES = ['General Audience', 'Teens', 'Young Adults', 'Professionals', 'Entrepreneurs', 'Students'];

export default function Generate() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [inputType, setInputType] = useState('topic');
  const [topic, setTopic] = useState('');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const [platform, setPlatform] = useState('YouTube');
  const [tone, setTone] = useState('Casual');
  const [audience, setAudience] = useState('General Audience');
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (inputType === 'topic' && !topic.trim()) return setError('Please enter a topic.');
    if (inputType === 'url' && !url.trim()) return setError('Please enter a blog URL.');
    if (inputType === 'text' && !text.trim()) return setError('Please enter some text.');
    if (inputType === 'file' && !file) return setError('Please upload a .txt file.');

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('inputType', inputType);
      formData.append('platform', platform);
      formData.append('tone', tone);
      formData.append('audience', audience);
      formData.append('language', language);
      if (inputType === 'topic') formData.append('topic', topic);
      if (inputType === 'url') formData.append('url', url);
      if (inputType === 'text') formData.append('text', text);
      if (inputType === 'file') formData.append('file', file);

      const res = await api.post('/projects/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showToast('Video package generated!', 'success');
      navigate(`/result/${res.data.data.project.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-1">Generate Video Package</h3>
      <p className="text-secondary mb-4">
        One click, one AI call — a complete script, scenes, SEO, and captions.
      </p>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Input type tabs */}
            <ul className="nav nav-pills mb-3">
              {INPUT_TABS.map((tab) => (
                <li className="nav-item" key={tab.key}>
                  <button
                    type="button"
                    className={`nav-link ${inputType === tab.key ? 'active' : ''}`}
                    onClick={() => setInputType(tab.key)}
                  >
                    <i className={`bi ${tab.icon} me-1`}></i>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            {inputType === 'topic' && (
              <div className="mb-3">
                <label className="form-label">Topic</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 5 morning habits that boost productivity"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            )}

            {inputType === 'url' && (
              <div className="mb-3">
                <label className="form-label">Blog / Article URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/my-article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            {inputType === 'text' && (
              <div className="mb-3">
                <label className="form-label">Plain Text</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Paste your article, notes, or idea here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
            )}

            {inputType === 'file' && (
              <div className="mb-3">
                <label className="form-label">Upload .txt File</label>
                <input
                  type="file"
                  accept=".txt,text/plain"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            )}

            <hr className="my-4" />

            <div className="row g-3 mb-3">
              <div className="col-md-3">
                <label className="form-label">Platform</label>
                <select className="form-select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option>YouTube</option>
                  <option>Shorts</option>
                  <option>Reels</option>
                  <option>TikTok</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Tone</label>
                <select className="form-select" value={tone} onChange={(e) => setTone(e.target.value)}>
                  {TONES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Audience</label>
                <select className="form-select" value={audience} onChange={(e) => setAudience(e.target.value)}>
                  {AUDIENCES.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Language</label>
                <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                </select>
              </div>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Generating your video package...
                </>
              ) : (
                <>
                  <i className="bi bi-stars me-2"></i>
                  Generate Video Package
                </>
              )}
            </button>
            {loading && (
              <p className="text-center text-secondary small mt-2 mb-0">
                This can take 10-30 seconds depending on content length.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
