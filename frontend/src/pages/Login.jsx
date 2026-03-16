import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ThreeBackground from '../components/ThreeBackground.jsx';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ animation: 'fadeInUp 0.5s ease' }}>
        <div className="auth-logo">
          <h1 className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>Prepx</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Welcome back! Sign in to continue.</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: '0.87rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input id="login-email" name="email" type="email" className="input" placeholder="you@college.edu" value={form.email} onChange={handle} required autoComplete="email" />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="label">Password</label>
            <input id="login-password" name="password" type={showPw ? 'text' : 'password'} className="input" placeholder="••••••••" value={form.password} onChange={handle} required autoComplete="current-password" />
            <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, bottom: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          <button id="login-submit" type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 20 }}>
          Don't have an account? <Link to="/signup">Create one free</Link>
        </div>

        <div style={{ marginTop: 20, padding: 14, background: 'rgba(139,92,246,0.08)', borderRadius: 10, border: '1px solid rgba(139,92,246,0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <strong style={{ color: 'var(--primary-light)' }}>Demo:</strong> Register first, then login with your credentials.
        </div>
      </div>
    </div>
  );
}
