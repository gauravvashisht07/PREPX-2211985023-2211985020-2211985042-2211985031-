import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Eye, EyeOff, Loader2, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    setError(''); 
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page flex justify-center items-center" style={{ 
      minHeight: '100vh', 
      padding: '20px',
      background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Abstract Background Accents */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.1, zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'var(--secondary)', filter: 'blur(120px)', opacity: 0.1, zIndex: 0 }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: '480px', zIndex: 10 }}
      >
        {/* Branding Area */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ 
              width: '72px', 
              height: '72px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              borderRadius: '18px',
              margin: '0 auto 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 30px rgba(124, 58, 237, 0.4)',
              color: '#fff',
              fontSize: '2.5rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)'
            }}
          >
            P
          </motion.div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 800, 
            fontFamily: 'var(--font-display)', 
            letterSpacing: '2px',
            marginBottom: '8px'
          }}>
            PREP<span className="gradient-text">X</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>The Elite Studio for Engineering Excellence</p>
        </div>

        {/* Login Card */}
        <div className="glass-strong" style={{ 
          padding: '48px', 
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure access to your preparation dashboard</p>
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
                <div style={{ width: '4px', height: '100%', background: 'var(--danger)', borderRadius: '2px' }} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={submit} className="flex flex-col gap-24">
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Access Identifier
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handle}
                  required
                  className="input"
                  style={{ 
                    background: 'rgba(0,0,0,0.2)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    fontSize: '0.95rem',
                    transition: '0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Encryption Key
                </label>
                <Link to="#" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Forgot Key?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPw ? 'text' : 'password'} 
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle}
                  required
                  className="input"
                  style={{ 
                    background: 'rgba(0,0,0,0.2)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    fontSize: '0.95rem',
                    transition: '0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
                type="submit" 
                className="btn btn-primary btn-glow" 
                disabled={loading}
                style={{ 
                    width: '100%', 
                    padding: '16px', 
                    borderRadius: '14px', 
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px'
                }}
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <ShieldCheck size={22} />
              )}
              {loading ? 'Decrypting Access...' : 'Authenticate'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>New to the Studio?</span>{' '}
            <Link to="/signup" className="gradient-text" style={{ fontWeight: 800, textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>

        {/* Bottom Security Badges */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '32px', opacity: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                <Zap size={14} color="var(--warning)" /> Cloud Sync Active
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
                <ShieldCheck size={14} color="var(--success)" /> Secure Authenticated Access
            </div>
        </div>
      </motion.div>
    </div>
  );
}
