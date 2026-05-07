import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { User, Mail, Shield, Target, Award, Zap, BarChart3, Settings, BookOpen, Clock, Camera, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileOverview from '../components/profile/ProfileOverview.jsx';
import ProfileProgress from '../components/profile/ProfileProgress.jsx';
import ProfileSettings from '../components/profile/ProfileSettings.jsx';

export default function Profile() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const res = await api.get('/user/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [location.pathname]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="animate-fade-up">
      {/* Header / Hero Section */}
      <section className="glass-strong" style={{ padding: '40px', borderRadius: '32px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(120px)', opacity: 0.15 }} />

        <div className="flex items-center gap-40 flex-col-mobile" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div className="avatar-large" style={{ width: '140px', height: '140px', fontSize: '3rem', cursor: 'default' }}>
              {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : userInitial}
            </div>
            <button className="btn-ghost" style={{ position: 'absolute', bottom: '5px', right: '5px', padding: '10px', borderRadius: '50%', background: 'var(--accent)', border: 'none', cursor: 'pointer' }}>
              <Camera size={18} color="white" />
            </button>
          </div>

          <div style={{ flex: 1 }} className="flex flex-col items-center-mobile text-center-mobile">
            <div className="flex items-center gap-12 mb-8 justify-center-mobile">
              <h1 style={{ fontSize: '2.4rem', fontWeight: 800 }}>{user?.name}</h1>
              <span className="badge badge-success" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>{user?.role || 'Student'}</span>
            </div>
            <div className="flex flex-wrap gap-20 color-text-muted justify-center-mobile" style={{ fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> {user?.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={16} /> {user?.targetRole || 'Full Stack Developer'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> {user?.skillLevel || 'Intermediate'}</div>
            </div>
          </div>

          <div className="hidden lg:flex" style={{ gap: '16px' }}>
            <button onClick={logout} className="btn btn-danger" style={{ padding: '12px 24px', borderRadius: '12px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </section>

      {/* Stats Quick View */}
      <div className="grid-res-4" style={{ marginBottom: '32px' }}>
        {[
          { label: 'Solved Questions', value: stats?.solvedQuestions || 0, icon: Award, color: '#a78bfa' },
          { label: 'Current Streak', value: `${stats?.streak || 0}d`, icon: Zap, color: '#f59e0b' },
          { label: 'Accuracy', value: `${stats?.accuracy || 0}%`, icon: Target, color: '#06b6d4' },
          { label: 'Mock Interviews', value: stats?.mockSessionsCount || 0, icon: Clock, color: '#10b981' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyCenter: 'center', color: stat.color, flexShrink: 0 }}>
              <stat.icon size={24} style={{ margin: '0 auto' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{loadingStats ? '--' : stat.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="glass" style={{ padding: '8px', borderRadius: '16px', display: 'flex', gap: '8px', marginBottom: '32px', width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            style={{
              padding: '10px 24px', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600
            }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <ProfileOverview stats={stats} />}
          {activeTab === 'progress' && <ProfileProgress />}
          {activeTab === 'settings' && <ProfileSettings />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
