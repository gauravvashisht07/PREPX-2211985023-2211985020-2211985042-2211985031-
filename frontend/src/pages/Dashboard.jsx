import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { dailyChallenges } from '../data/dailyChallenges.js';
import { BookOpen, Mic2, FileText, BarChart2, Star, Building2, StickyNote, CheckSquare, Flame, Target, Award, Zap } from 'lucide-react';

const features = [
  { to: '/questions', icon: '📚', title: 'Question Bank', desc: '45+ curated questions across DSA, OS, DBMS, CN & HR', color: '#8b5cf6' },
  { to: '/mock', icon: '🎯', title: 'Mock Interview', desc: 'Timed interview sessions with self-evaluation', color: '#06b6d4' },
  { to: '/daily', icon: '⚡', title: 'Daily Challenge', desc: 'A fresh challenge every day to stay sharp', color: '#f59e0b' },
  { to: '/progress', icon: '📈', title: 'My Progress', desc: 'Streaks, solved questions & topic coverage', color: '#10b981' },
  { to: '/companies', icon: '🏢', title: 'Company-Wise', desc: 'Questions from Amazon, Google, TCS & more', color: '#f472b6' },
  { to: '/resume', icon: '📄', title: 'Resume Builder', desc: 'Build and export your resume as PDF', color: '#fb923c' },
  { to: '/notes', icon: '📝', title: 'Notes & Roadmap', desc: 'Quick revision notes & structured learning paths', color: '#a78bfa' },
  { to: '/todos', icon: '✅', title: 'To-Do Planner', desc: 'Organise your daily prep tasks & schedule', color: '#34d399' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [daily, setDaily] = useState(null);

  useEffect(() => {
    api.get('/progress').then(r => setProgress(r.data)).catch(() => {});
    api.get('/daily/challenge').then(r => setDaily(r.data)).catch(() => {});
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const solved = progress?.solvedQuestions?.length || 0;
  const streak = progress?.streak || 0;
  const topics = progress ? Object.values(progress.topicStats || {}).filter(t => t.solved > 0).length : 0;
  const todayChallenge = daily ? dailyChallenges[daily.challengeIndex] : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Welcome Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.12))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 'var(--radius-lg)', padding: '28px 32px', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -20, fontSize: '8rem', opacity: 0.07 }}>🎓</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 6 }}>{today}</div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: 8 }}>
          {greeting()}, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Student'}!</span> 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Ready to ace your placements? Let's keep the streak going!
        </p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: BookOpen, label: 'Questions Solved', value: solved, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
          { icon: Flame, label: 'Current Streak', value: `${streak}d`, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
          { icon: Target, label: 'Topics Covered', value: `${topics}/5`, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
          { icon: Award, label: 'Best Streak', value: `${progress?.maxStreak || 0}d`, color: '#f472b6', bg: 'rgba(244,114,182,0.15)' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div className="stat-value" style={{ color }}>{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Challenge Preview */}
      {todayChallenge && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ fontSize: '2rem' }}>⚡</div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4 }}>Today's Daily Challenge</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{todayChallenge.title}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className={`badge badge-${todayChallenge.difficulty.toLowerCase()}`}>{todayChallenge.difficulty}</span>
              <span className="badge badge-primary">{todayChallenge.topic}</span>
              {daily?.completed && <span className="badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}>✓ Done</span>}
            </div>
          </div>
          <Link to="/daily" className="btn btn-ghost btn-sm">Solve Now →</Link>
        </div>
      )}

      {/* Feature Cards */}
      <div className="section-header">
        <h2 className="section-title" style={{ fontSize: '1.3rem' }}>All Features</h2>
      </div>
      <div className="feature-grid">
        {features.map(f => (
          <Link key={f.to} to={f.to} className="feature-card" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>{f.icon}</div>
            <div className="feature-title" style={{ color: f.color }}>{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
