import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { StatCardSkeleton, Skeleton } from '../components/Skeleton.jsx';
import { Flame, Trophy, BookOpen, Target, BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Progress() {
  const toast = useToast();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    console.log('[Progress] Fetching analytics data:', location.key);
    const controller = new AbortController();
    setLoading(true);
    api.get('/progress', { signal: controller.signal })
      .then(r => { setProgress(r.data); setLoading(false); })
      .catch(err => { if (err.name !== 'CanceledError') { setLoading(false); toast.error('Failed to load progress'); } });
    return () => controller.abort();
  }, [location.pathname]);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  if (loading) return (
    <div className="animate-fade-up">
      <div className="section-header">
        <h1 className="section-title">My Progress</h1>
      </div>
      <div className="stats-grid" style={{ marginBottom: 28, gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}
      </div>
      <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
        <Skeleton height={24} width="30%" style={{ marginBottom: 20 }} />
        {[1,2,3,4,5].map(i => <div key={i} style={{ marginBottom: 20 }}><Skeleton height={14} width="80%" style={{ marginBottom: 8 }} /><Skeleton height={12} borderRadius={6} /></div>)}
      </div>
    </div>
  );

  if (!progress) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>No progress data yet. Start solving questions!</div>;

  const solved = progress.solvedQuestions?.length || 0;
  const total = Object.values(progress.topicStats || {}).reduce((a, t) => a + t.total, 0);
  const streak = progress.streak || 0;
  const activity = new Set(progress.activityLog || []);
  const topicList = Object.entries(progress.topicStats || {});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="animate-fade-up">
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Preparation Analytics</h1>
        <p className="section-sub">A deep dive into your technical learning journey.</p>
      </div>

      <motion.div 
        className="stats-grid" 
        style={{ marginBottom: 32, gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { icon: Trophy, label: 'Questions Solved', value: `${solved}/${total || 45}`, color: '#a78bfa', bg: 'rgba(124, 58, 237, 0.1)' },
          { icon: Flame, label: 'Current Streak', value: `${streak} days`, color: '#f87171', bg: 'rgba(239, 68, 68, 0.1)' },
          { icon: TrendingUp, label: 'Preparation Score', value: '780', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
          { icon: Target, label: 'Daily Goals', value: progress.completedDailyChallenges?.length || 0, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div key={i} variants={itemVariants} className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', borderBottom: `2px solid ${color}33` }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: bg, display: 'flex', alignItems: 'center', justifyCenter: 'center', color: color }}>
              <Icon size={24} style={{ margin: '0 auto' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass" style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <BarChart3 size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Topic Mastery</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {topicList.map(([topic, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
              const colors = { DSA: '#a78bfa', OS: '#38bdf8', DBMS: '#fb923c', CN: '#f472b6', HR: '#10b981' };
              const color = colors[topic] || '#94a3b8';
              return (
                <div key={topic}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{topic}</span>
                    <span style={{ color: color, fontWeight: 800 }}>{pct}% <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>({stats.solved}/{stats.total})</span></span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                    <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${pct}%` }} 
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: `linear-gradient(to right, ${color}cc, ${color})`, borderRadius: '99px' }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass" style={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Calendar size={20} color="var(--secondary)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Consistency Map</h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Your activity over the last 30 days. Stay consistent to boost your preparation score.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
            {days.map(d => {
              const isActive = activity.has(d);
              const isToday = d === new Date().toISOString().slice(0, 10);
              return (
                <motion.div 
                  key={d} 
                  whileHover={{ scale: 1.1 }}
                  title={d} 
                  style={{
                    aspectRatio: '1', borderRadius: '8px',
                    background: isToday ? 'rgba(167, 139, 250, 0.4)' : isActive ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                    border: isToday ? '2px solid var(--accent)' : isActive ? 'none' : '1px solid rgba(255,255,255,0.03)',
                    boxShadow: isActive ? '0 0 15px rgba(124, 58, 237, 0.3)' : 'none',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }} 
                />
              );
            })}
          </div>
          
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.75rem', fontWeight: 600 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '3px' }} /> Solved</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '3px' }} /> Inactive</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '12px', height: '12px', background: 'rgba(167, 139, 250, 0.4)', border: '1px solid var(--accent)', borderRadius: '3px' }} /> Today</div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-strong" 
        style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}
      >
        <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Zap size={20} color="#f59e0b" fill="#f59e0b" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Elite Tip</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Focus more on <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>OS Fundamentals</span> this week. Strengthening your core OS concepts through the question bank will significantly improve your overall interview readiness.
            </p>
        </div>
        <button className="btn btn-primary" style={{ padding: '14px 28px', borderRadius: '12px' }}>Personalized Roadmap</button>
      </motion.div>
    </div>
  );
}
