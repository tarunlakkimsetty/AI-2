import { useState } from 'react';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import useToast from '../hooks/useToast';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [language, setLanguage] = useState(user?.language || 'English');
  const [tone, setTone] = useState(user?.tone || 'Casual');
  const [temperature, setTemperature] = useState(user?.temperature ?? 0.4);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/me', { theme, language, tone, temperature });
      updateUser(res.data.data.user);
      showToast('Settings saved.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save settings.', 'danger');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-4">Settings</h3>

      <div className="card shadow-sm mb-3">
        <div className="card-header"><i className="bi bi-palette me-2"></i>Appearance</div>
        <div className="card-body">
          <label className="form-label">Theme</label>
          <div className="btn-group w-100" role="group">
            {['light', 'dark', 'system'].map((t) => (
              <button
                key={t}
                type="button"
                className={`btn ${theme === t ? 'btn-primary' : 'btn-outline-secondary'} text-capitalize`}
                onClick={() => setTheme(t)}
              >
                <i className={`bi ${t === 'light' ? 'bi-sun' : t === 'dark' ? 'bi-moon-stars' : 'bi-circle-half'} me-1`}></i>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-header"><i className="bi bi-sliders me-2"></i>Default Generation Preferences</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Default Language</label>
            <select className="form-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Default Tone</label>
            <select className="form-select" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Casual</option>
              <option>Professional</option>
              <option>Energetic</option>
              <option>Educational</option>
              <option>Humorous</option>
              <option>Inspirational</option>
            </select>
          </div>
          <div className="mb-1">
            <label className="form-label d-flex justify-content-between">
              <span>AI Creativity (Temperature)</span>
              <span className="text-secondary">{temperature}</span>
            </label>
            <input
              type="range"
              className="form-range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <div className="d-flex justify-content-between small text-secondary">
              <span>More focused</span>
              <span>More creative</span>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
