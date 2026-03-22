import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { StatCardSkeleton, Skeleton } from '../components/Skeleton.jsx';
import { Flame, Trophy, BookOpen, Target } from 'lucide-react';

export default function Progress() {
  const toast = useToast();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/progress', { signal: controller.signal })
      .then(r => { setProgress(r.data); setLoading(false); })
      .catch(err => { if (err.name !== 'CanceledError') { setLoading(false); toast.error('Failed to load progress'); } });
    return () => controller.abort();
  }, []);

  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  if (loading) return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">My Progress</h1>
      </div>
      <div className="stats-grid" style={{ marginBottom: 28 }}>{[1,2,3,4].map(i => <StatCardSkeleton key={i} />)}</div>
      <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
        <Skeleton height={24} width="30%" style={{ marginBottom: 20 }} />
        {[1,2,3,4,5].map(i => <div key={i} style={{ marginBottom: 16 }}><Skeleton height={14} width="80%" style={{ marginBottom: 8 }} /><Skeleton height={8} /></div>)}
      </div>
    </div>
  );

  if (!progress) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>No progress data yet. Start solving questions!</div>;

  const solved = progress.solvedQuestions?.length || 0;
  const total = Object.values(progress.topicStats || {}).reduce((a, t) => a + t.total, 0);
  const streak = progress.streak || 0;
  const activity = new Set(progress.activityLog || []);
  const topicList = Object.entries(progress.topicStats || {});

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">My Progress</h1>
        <p className="section-sub">Track your preparation journey</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { icon: BookOpen, label: 'Total Solved', value: `${solved}/${total}`, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
          { icon: Flame, label: 'Current Streak', value: `${streak} days`, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
          { icon: Trophy, label: 'Best Streak', value: `${progress.maxStreak || 0} days`, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
          { icon: Target, label: 'Daily Challenges', value: progress.completedDailyChallenges?.length || 0, color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}><Icon size={22} color={color} /></div>
            <div><div className="stat-value" style={{ color }}>{value}</div><div className="stat-label">{label}</div></div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 20 }}>📊 Topic Progress</h2>
        {topicList.map(([topic, stats]) => {
          const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
          const colors = { DSA: '#8b5cf6', OS: '#06b6d4', DBMS: '#fb923c', CN: '#f472b6', HR: '#34d399' };
          return (
            <div key={topic} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 600 }}>{topic}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{stats.solved}/{stats.total} · <span style={{ color: colors[topic], fontWeight: 700 }}>{pct}%</span></span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${colors[topic]}, ${colors[topic]}88)` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 16 }}>🗓️ Activity — Last 30 Days</h2>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {days.map(d => {
            const isActive = activity.has(d);
            const isToday = d === new Date().toISOString().slice(0, 10);
            return (
              <div key={d} title={d} style={{
                width: 28, height: 28, borderRadius: 6,
                background: isToday ? 'rgba(139,92,246,0.6)' : isActive ? 'rgba(139,92,246,0.9)' : 'rgba(255,255,255,0.05)',
                border: isToday ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.05)',
                flexShrink: 0, cursor: 'default',
                transition: 'transform 0.2s',
              }} />
            );
          })}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span style={{ color: '#8b5cf6' }}>■ Active day</span>
          <span>■ No activity</span>
          <span style={{ color: '#8b5cf6', opacity: 0.6 }}>■ Today</span>
        </div>
      </div>
    </div>
  );
}
