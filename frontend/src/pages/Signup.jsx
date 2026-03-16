import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ animation: 'fadeInUp 0.5s ease' }}>
        <div className="auth-logo">
          <h1 className="gradient-text" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>Prepx</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Create your account and start preparing!</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: '0.87rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input id="signup-name" name="name" type="text" className="input" placeholder="Arjun Sharma" value={form.name} onChange={handle} required autoComplete="name"/>
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input id="signup-email" name="email" type="email" className="input" placeholder="you@college.edu" value={form.email} onChange={handle} required autoComplete="email" />
          </div>
          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="label">Password</label>
              <input id="signup-password" name="password" type={showPw ? 'text' : 'password'} className="input" placeholder="Min 6 chars" value={form.password} onChange={handle} required />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, bottom: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            <div className="form-group">
              <label className="label">Confirm</label>
              <input id="signup-confirm" name="confirm" type={showPw ? 'text' : 'password'} className="input" placeholder="Repeat" value={form.confirm} onChange={handle} required />
            </div>
          </div>

          <button id="signup-submit" type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : null}
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 20 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
