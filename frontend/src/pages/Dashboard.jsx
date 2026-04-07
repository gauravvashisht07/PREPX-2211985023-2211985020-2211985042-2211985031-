import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { StatCardSkeleton } from '../components/Skeleton.jsx';
import { BookOpen, Flame, Target, Award, ArrowRight, Zap, Code2, Users, Trophy, BarChart2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { to: '/questions', title: 'Question Bank', desc: '45+ curated technical questions across core CS fundamentals.', icon: BookOpen, color: '#a78bfa' },
  { to: '/mcq', title: 'MCQ Practice', desc: 'Mock tests with instant detailed feedback and explanations.', icon: Target, color: '#06b6d4' },
  { to: '/mock', title: 'Mock Interview', desc: 'Professional real-time interview simulations.', icon: Users, color: '#10b981' },
  { to: '/daily', title: 'Daily Challenge', desc: 'Stay sharp with daily algorithm challenges.', icon: Zap, color: '#f59e0b' },
  { to: '/resume', title: 'Resume Builder', desc: 'Build ATS-optimized resumes in minutes.', icon: Code2, color: '#fb7185' },
  { to: '/progress', title: 'Analytics', desc: 'Track your growth and identify weak areas.', icon: BarChart2, color: '#38bdf8' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/progress', { signal: controller.signal })
      .then(r => setProgress(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const solved = progress?.solvedQuestions?.length || 0;
  const streak = progress?.streak || 0;

  return (
    <div className="dashboard-container">
      {/* Hero Section */}
      <section className="hero-section" style={{ minHeight: '60vh', padding: '60px 40px' }}>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="hero-tagline">Achieve Technical Excellence</span>
          <h1 className="hero-title">
            Master Your <br />
            <span className="gradient-text">Engineering</span> <br />
            Interviews.
          </h1>
          <p className="hero-desc">
            Welcome back, <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{user?.name?.split(' ')[0] || 'User'}</span>. 
            Prepx is your high-performance studio for mastering technical interviews with precision and speed.
          </p>
          <div className="flex gap-16" style={{ marginTop: '20px' }}>
            <Link to="/questions" className="btn btn-primary btn-glow btn-lg" style={{ borderRadius: '12px' }}>
              Explore Questions <ArrowRight size={18} />
            </Link>
            <Link to="/mock" className="btn btn-ghost btn-lg" style={{ borderRadius: '12px' }}>
              Practice Mock
            </Link>
          </div>
        </motion.div>

        {/* Hero Illustration (CSS/SVG) */}
        <div className="hidden lg:flex" style={{ flex: 1, justifyContent: 'center', position: 'relative' }}>
          <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
             style={{ width: '400px', height: '400px', border: '1px dashed rgba(124, 58, 237, 0.2)', borderRadius: '50%', position: 'absolute' }}
          />
          <motion.div 
             animate={{ rotate: -360 }}
             transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
             style={{ width: '320px', height: '320px', border: '1px solid rgba(6, 182, 212, 0.1)', borderRadius: '50%', position: 'absolute' }}
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="glass-strong"
            style={{ width: '280px', height: '320px', borderRadius: '24px', display: 'flex', flexDirection: 'column', padding: '32px', position: 'relative', zIndex: 1, gap: '20px' }}
          >
            <div style={{ height: '40px', width: '70%', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} />
            <div style={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
            <div style={{ height: '12px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
            <div style={{ height: '12px', width: '60%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)' }} />
                <div style={{ flex: 1 }}>
                    <div style={{ height: '12px', width: '80%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '8px' }} />
                    <div style={{ height: '8px', width: '40%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
                </div>
            </div>
          </motion.div>

          <div style={{ position: 'absolute', top: '-10px', right: '40px', zIndex: 2 }}>
            <motion.div 
               animate={{ y: [0, -15, 0] }} 
               transition={{ duration: 4, repeat: Infinity }}
               className="glass" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16, 185, 129, 0.4)' }}
            >
              <Award size={18} color="#10b981" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>84% Progress</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '0 40px 60px' }}>
        <motion.div 
          className="stats-grid" 
          style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Total Solved', value: solved, icon: Trophy, color: '#f59e0b' },
            { label: 'Current Streak', value: `${streak}d`, icon: Flame, color: '#ef4444' },
            { label: 'Global Rank', value: '#12', icon: Target, color: '#7c3aed' },
            { label: 'Accuracy Rate', value: '84%', icon: Star, color: '#06b6d4' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className="glass" 
              style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyCenter: 'center', color: stat.color, flexShrink: 0 }}>
                <stat.icon size={24} style={{ margin: '0 auto' }} />
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginTop: '4px', letterSpacing: '0.5px' }}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Feature Section */}
      <section style={{ padding: '40px' }}>
        <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Explore Studio</h2>
            <p style={{ color: 'var(--text-muted)' }}>Curated paths to master every aspect of your preparation.</p>
        </div>

        <motion.div 
          className="feature-grid"
          style={{ padding: 0 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={itemVariants}>
                <Link to={f.to} className="feature-card glass" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <div className="feature-icon-wrapper" style={{ background: `${f.color}15`, color: f.color }}>
                        <f.icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>{f.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                    
                    <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', opacity: 0, transform: 'translateX(-10px)', transition: '0.3s' }} className="explore-btn">
                        Explore <ArrowRight size={14} />
                    </div>
                </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <style>{`
        .feature-card:hover .explore-btn {
            opacity: 1;
            transform: translateX(0);
        }
      `}</style>
    </div>
  );
}

