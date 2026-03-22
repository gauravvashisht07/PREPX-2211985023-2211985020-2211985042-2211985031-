import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';

function PasswordStrength({ password }) {
  const checks = [
    { label: 'At least 6 characters', ok: password.length >= 6 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains a letter', ok: /[a-zA-Z]/.test(password) },
  ];
  if (!password) return null;
  const score = checks.filter(c => c.ok).length;
  const color = score === 3 ? '#10b981' : score === 2 ? '#f59e0b' : '#ef4444';
  const label = score === 3 ? 'Strong' : score === 2 ? 'Medium' : 'Weak';

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < score ? color : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: '0.72rem', color: c.ok ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            {c.ok ? <CheckCircle size={11} /> : <XCircle size={11} />} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async e => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(form.email)) return setError('Please enter a valid email address');
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
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: '0.87rem', display: 'flex', gap: 8, alignItems: 'center' }}>
            <XCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input id="signup-name" name="name" type="text" className="input" placeholder="Arjun Sharma" value={form.name} onChange={handle} required autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input id="signup-email" name="email" type="email" className="input"
              placeholder="you@college.edu" value={form.email} onChange={handle} required autoComplete="email"
              style={{ borderColor: form.email && !isValidEmail(form.email) ? 'rgba(239,68,68,0.6)' : undefined }}
            />
            {form.email && !isValidEmail(form.email) && (
              <div style={{ fontSize: '0.75rem', color: '#f87171', marginTop: 4 }}>Invalid email format</div>
            )}
          </div>
          <div className="form-row">
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="label">Password</label>
              <input id="signup-password" name="password" type={showPw ? 'text' : 'password'} className="input"
                placeholder="Min 6 chars" value={form.password} onChange={handle} required />
              <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: 12, bottom: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
              <PasswordStrength password={form.password} />
            </div>
            <div className="form-group">
              <label className="label">Confirm</label>
              <input id="signup-confirm" name="confirm" type={showPw ? 'text' : 'password'} className="input"
                placeholder="Repeat" value={form.confirm} onChange={handle} required
                style={{ borderColor: form.confirm && form.confirm !== form.password ? 'rgba(239,68,68,0.6)' : form.confirm && form.confirm === form.password ? 'rgba(16,185,129,0.6)' : undefined }}
              />
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
