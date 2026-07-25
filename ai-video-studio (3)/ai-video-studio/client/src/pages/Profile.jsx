import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';
import Spinner from '../components/Spinner';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [projectsCount, setProjectsCount] = useState(null);
  const [name, setName] = useState(user?.name || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState('');

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get('/users/me').then((res) => setProjectsCount(res.data.data.projectsCount));
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/me', { name });
      updateUser(res.data.data.user);
      showToast('Profile updated.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed.', 'danger');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    setSavingPw(true);
    try {
      await api.put('/users/me/password', pwForm);
      showToast('Password changed successfully.', 'success');
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    try {
      await api.delete('/users/me');
      showToast('Account deleted.', 'success');
      logout();
      navigate('/login');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete account.', 'danger');
      setDeleting(false);
    }
  };

  if (projectsCount === null) return <Spinner label="Loading profile..." />;

  return (
    <div>
      <h3 className="fw-bold mb-4">Profile</h3>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm mb-4">
            <div className="card-header"><i className="bi bi-person-circle me-2"></i>Account Details</div>
            <div className="card-body">
              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={user?.email} disabled />
                  <div className="form-text">Email cannot be changed.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Projects</label>
                  <input className="form-control" value={projectsCount} disabled />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header"><i className="bi bi-shield-lock me-2"></i>Change Password</div>
            <div className="card-body">
              {pwError && <div className="alert alert-danger py-2">{pwError}</div>}
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    minLength={6}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={savingPw}>
                  {savingPw ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-danger">
            <div className="card-header text-danger"><i className="bi bi-exclamation-triangle me-2"></i>Danger Zone</div>
            <div className="card-body">
              <p className="text-secondary">
                Deleting your account permanently removes your profile and all {projectsCount} project(s).
                This action cannot be undone.
              </p>
              <label className="form-label small">Type <strong>DELETE</strong> to confirm</label>
              <input
                className="form-control mb-3"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
              />
              <button
                className="btn btn-danger"
                disabled={deleteConfirm !== 'DELETE' || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? 'Deleting...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
