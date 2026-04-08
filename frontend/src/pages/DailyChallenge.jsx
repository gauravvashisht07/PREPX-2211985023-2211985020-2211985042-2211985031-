import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios.js';
import { dailyChallenges } from '../data/dailyChallenges.js';
import { useToast } from '../context/ToastContext.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { Flame, CheckCircle, ChevronDown, Zap, Lightbulb, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DailyChallenge() {
  const toast = useToast();
  const [dailyInfo, setDailyInfo] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    console.log('[DailyChallenge] Activating protocol:', location.key);
    const controller = new AbortController();
    setLoading(true);
    api.get('/daily/challenge', { signal: controller.signal })
      .then(r => { setDailyInfo(r.data); setLoading(false); })
      .catch(err => { if (err.name !== 'CanceledError') { setLoading(false); toast.error('Failed to load challenge'); } });
    return () => controller.abort();
  }, [location.pathname]);

  const challenge = dailyInfo ? dailyChallenges[dailyInfo.challengeIndex] : null;

  const markComplete = async () => {
    if (dailyInfo?.completed || completing) return;
    setCompleting(true);
    try {
      await api.post('/daily/complete');
      setDailyInfo(d => ({ ...d, completed: true }));
      toast.success('Challenge completed! Your streak is intensifying! 🔥');
    } catch { toast.error('Marking failed'); }
    finally { setCompleting(false); }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) return (
    <div className="animate-fade-up">
      <div className="section-header"><h1 className="section-title">Daily Challenge</h1></div>
      <div style={{ maxWidth: '800px' }}>
        <div className="glass-strong" style={{ padding: '40px' }}>
          <Skeleton height={20} width="40%" style={{ marginBottom: '20px' }} />
          <Skeleton height={60} style={{ marginBottom: '32px' }} />
          <Skeleton height={150} style={{ marginBottom: '32px' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <Skeleton height={44} width="160px" borderRadius="12px" />
            <Skeleton height={44} width="160px" borderRadius="12px" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!challenge) return <div style={{ textAlign: 'center', padding: '100px 40px', color: 'var(--text-muted)' }}>No challenge protocols active for today.</div>;

  return (
    <div className="animate-fade-up">
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Daily Challenge</h1>
        <p className="section-sub">{today} • <span className="gradient-text" style={{ fontWeight: 800 }}>Protocol Active</span></p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(500px, 1fr) 300px', gap: '32px', alignItems: 'start' }}>
        <div className="flex flex-col gap-24">
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass-strong" 
               style={{ 
                   padding: '40px',
                   borderTop: dailyInfo?.completed ? '4px solid var(--success)' : '4px solid var(--warning)',
                   boxShadow: dailyInfo?.completed ? '0 20px 50px -10px rgba(16, 185, 129, 0.1)' : '0 20px 50px -10px rgba(245, 158, 11, 0.1)'
               }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                    <Zap size={14} fill="var(--warning)" /> Daily Module
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2 }}>{challenge.title}</h2>
                </div>
                {dailyInfo?.completed && (
                  <div className="glass" style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                    <CheckCircle size={18} /> SUCCESS
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
                <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>{challenge.topic}</span>
              </div>

              <div className="glass" style={{ padding: '28px', background: 'rgba(0,0,0,0.2)', marginBottom: '32px', lineHeight: 1.8, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {challenge.question}
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <button 
                    className={`btn ${revealed ? 'btn-ghost' : 'btn-primary'}`} 
                    onClick={() => setRevealed(!revealed)}
                    style={{ borderRadius: '12px', padding: '12px 24px' }}
                >
                  <Lightbulb size={18} /> {revealed ? 'Hide Resources' : 'Analyze Hint & Solution'}
                </button>
                
                {!dailyInfo?.completed && (
                  <button className="btn btn-success btn-glow" onClick={markComplete} disabled={completing} style={{ borderRadius: '12px', padding: '12px 24px' }}>
                    {completing ? 'Synchronizing...' : <><CheckCircle size={18} /> Confirm Completion</>}
                  </button>
                )}
              </div>

              <AnimatePresence>
                {revealed && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass" style={{ padding: '24px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '12px' }}>
                                <Lightbulb size={14} /> Cognitive Hint
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{challenge.hint}</p>
                        </div>
                        
                        <div className="glass-strong" style={{ padding: '32px', background: 'rgba(0,0,0,0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '16px' }}>
                                <CheckCircle size={14} /> Expert Implementation
                            </div>
                            <p style={{ color: 'var(--text-primary)', fontSize: '1rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{challenge.solution}</p>
                        </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
        </div>

        <aside className="flex flex-col gap-24">
            <div className="glass-strong" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto 16px' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--warning)', filter: 'blur(20px)', opacity: 0.3, position: 'absolute', top: 0, left: 0 }} />
                    <Flame size={48} color="var(--warning)" style={{ position: 'relative' }} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Active Streak</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>12 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>DAYS</span></div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '12px' }}>Maintain your daily momentum to unlock high-tier preparation badges.</p>
            </div>

            <div className="glass" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Trophy size={20} color="var(--accent)" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Next Milestone</h4>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Complete 3 more challenges to unlock "Consistent Engineer" rank.</div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', background: 'linear-gradient(to right, var(--primary), var(--accent))' }} />
                </div>
            </div>

            <button className="btn btn-ghost w-full" style={{ borderRadius: '12px', justifyContent: 'space-between', padding: '16px 20px' }}>
                View Leaderboard <ArrowRight size={16} />
            </button>
        </aside>
      </div>
    </div>
  );
}
