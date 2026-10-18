import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

export default function ProfileSettings() {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', avatarUrl: user?.avatarUrl || '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setBusy(true); setMessage(''); setError('');
    try {
      const { data } = await api.put('/users/me', form);
      login({ user: data.user, token });
      setMessage('Profile updated successfully.');
    } catch (err) { setError(err.response?.data?.message || 'Could not update profile.'); }
    finally { setBusy(false); }
  }
  return <main className="container settings-container">
    <button className="back-link back-button" onClick={() => navigate(-1)}>← Back</button>
    <div className="page-title-block"><p className="eyebrow">ACCOUNT</p><h1>Profile settings</h1><p>Help readers learn a little about you.</p></div>
    <form className="settings-card form-stack" onSubmit={submit}>
      <label>Display name<input required maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      <label>Short bio <span className="optional">({form.bio.length}/200)</span><textarea rows="4" maxLength="200" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="What do you build or enjoy learning?" /></label>
      <label>Avatar image URL <span className="optional">(optional)</span><input type="url" value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://example.com/avatar.jpg" /></label>
      {error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}
      <div className="settings-actions"><button className="button button-outline" type="button" onClick={() => navigate(-1)}>Cancel</button><button className="button" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div>
    </form>
  </main>;
}
