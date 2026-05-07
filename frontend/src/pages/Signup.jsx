import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Loader2, UserPlus, CheckCircle, XCircle, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function PasswordStrength({ password }) {
  const checks = [
    { label: '6+ Characters', ok: password.length >= 6 },
    { label: 'Numerical Digit', ok: /\d/.test(password) },
    { label: 'Alpha Sequence', ok: /[a-zA-Z]/.test(password) },
  ];
  if (!password) return null;
  const score = checks.filter(c => c.ok).length;
  const color = score === 3 ? 'var(--success)' : score === 2 ? 'var(--warning)' : 'var(--danger)';

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 99, background: i < score ? color : 'rgba(255,255,255,0.05)', transition: '0.3s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {checks.map(c => (
          <span key={c.label} style={{ fontSize: '0.7rem', color: c.ok ? 'var(--text-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            {c.ok ? <CheckCircle size={12} color="var(--success)" /> : <XCircle size={12} color="var(--text-muted)" />} {c.label}
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
    if (form.password !== form.confirm) return setError('Encryption keys do not match');
    if (form.password.length < 6) return setError('Key must be at least 6 characters');
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page flex justify-center items-center" style={{ 
      minHeight: '100vh', 
      padding: '40px 20px',
      background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background Accents */}
      <div style={{ position: 'absolute', top: '15%', left: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '350px', height: '350px', borderRadius: '50%', background: 'var(--secondary)', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: '520px', zIndex: 10 }}
      >
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '16px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.3)',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: 900
            }}
          >
            P
          </motion.div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '2px', marginBottom: '8px' }}>
            JOIN THE <span className="gradient-text">STUDIO</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Engineer your future with elite-level preparation</p>
        </div>

        {/* Signup Card */}
        <div className="glass-strong" style={{ 
          padding: '48px', 
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Create Protocol</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Initialize your professional mastery journey</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ 
                    padding: '14px', 
                    background: 'rgba(239, 68, 68, 0.05)', 
                    border: '1px solid rgba(239, 68, 68, 0.3)', 
                    borderRadius: '12px', 
                    marginBottom: '24px', 
                    color: 'var(--danger)', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}
              >
                <XCircle size={18} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submit} className="flex flex-col gap-20">
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Full Name
              </label>
              <input 
                type="text" name="name" placeholder="Arjun Sharma"
                value={form.name} onChange={handle} required 
                className="input"
                style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '14px' }}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Email Correspondence
              </label>
              <input 
                type="email" name="email" placeholder="name@example.com"
                value={form.email} onChange={handle} required 
                className="input"
                style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '14px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Encryption
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••"
                    value={form.password} onChange={handle} required 
                    className="input"
                    style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '14px' }}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Verify Key
                </label>
                <input 
                  type={showPw ? 'text' : 'password'} name="confirm" placeholder="••••••••"
                  value={form.confirm} onChange={handle} required 
                  className="input"
                  style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.1)', padding: '14px 18px', borderRadius: '14px' }}
                />
              </div>
            </div>

            <PasswordStrength password={form.password} />

            <button 
                type="submit" 
                className="btn btn-primary btn-glow" 
                disabled={loading}
                style={{ 
                    width: '100%', padding: '16px', borderRadius: '14px', fontSize: '1rem',
                    fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px'
                }}
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : <UserPlus size={22} />}
              {loading ? 'Creating Identity...' : 'Join Protocol'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already registered?</span>{' '}
            <Link to="/login" className="gradient-text" style={{ fontWeight: 800, textDecoration: 'none' }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Security Badges */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '32px', opacity: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                <Shield size={14} color="var(--success)" /> End-to-End Secure
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                <CheckCircle size={14} color="var(--success)" /> Verified Engineering Track
            </div>
        </div>
      </motion.div>
    </div>
  );
}
