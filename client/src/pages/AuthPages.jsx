import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data); navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'Login failed.'); }
    finally { setBusy(false); }
  }
  return <AuthLayout title="Welcome back" subtitle="Log in to continue sharing what you learn.">
    <form className="form-stack" onSubmit={submit}>
      <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Your password" /></label>
      {error && <div className="alert error">{error}</div>}
      <button className="button full-width" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
    </form>
    <p className="auth-switch">New to Hashnode? <Link to="/register">Create an account</Link></p>
  </AuthLayout>;
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data); navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); }
    finally { setBusy(false); }
  }
  return <AuthLayout title="Join the community" subtitle="Create an account and publish your first story.">
    <form className="form-stack" onSubmit={submit}>
      <label>Display name<input required maxLength="80" autoComplete="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>
      <label>Email address<input type="email" required autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input type="password" required minLength="8" autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>
      {error && <div className="alert error">{error}</div>}
      <button className="button full-width" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
    </form>
    <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
  </AuthLayout>;
}

function AuthLayout({ title, subtitle, children }) {
  return <main className="auth-page"><div className="auth-card"><Link to="/" className="brand auth-brand"><span className="brand-mark">h</span> hashnode</Link><div className="auth-heading"><h1>{title}</h1><p>{subtitle}</p></div>{children}<p className="privacy-note">By continuing, you agree to keep the community helpful and respectful.</p></div></main>;
}
