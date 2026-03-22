import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { dailyChallenges } from '../data/dailyChallenges.js';
import { useToast } from '../context/ToastContext.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { Flame, CheckCircle, ChevronDown } from 'lucide-react';

export default function DailyChallenge() {
  const toast = useToast();
  const [dailyInfo, setDailyInfo] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/daily/challenge', { signal: controller.signal })
      .then(r => { setDailyInfo(r.data); setLoading(false); })
      .catch(err => { if (err.name !== 'CanceledError') { setLoading(false); toast.error('Failed to load challenge'); } });
    return () => controller.abort();
  }, []);

  const challenge = dailyInfo ? dailyChallenges[dailyInfo.challengeIndex] : null;

  const markComplete = async () => {
    if (dailyInfo?.completed || completing) return;
    setCompleting(true);
    try {
      await api.post('/daily/complete');
      setDailyInfo(d => ({ ...d, completed: true }));
      toast.success('🎉 Daily challenge completed! Streak updated!');
    } catch { toast.error('Failed to mark complete'); }
    finally { setCompleting(false); }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header"><h1 className="section-title">Daily Challenge</h1></div>
      <div style={{ maxWidth: 740 }}>
        <div className="glass" style={{ padding: 32 }}>
          <Skeleton height={24} width="50%" style={{ marginBottom: 16 }} />
          <Skeleton height={64} style={{ marginBottom: 16 }} />
          <Skeleton height={40} width="30%" />
        </div>
      </div>
    </div>
  );

  if (!challenge) return <div style={{ textAlign: 'center', padding: 80 }}>No challenge for today.</div>;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">Daily Challenge</h1>
        <p className="section-sub">{today}</p>
      </div>

      <div style={{ maxWidth: 740 }}>
        <div className="glass" style={{ padding: 32, marginBottom: 20, border: dailyInfo?.completed ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(245,158,11,0.3)', background: dailyInfo?.completed ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2rem' }}>⚡</span>
            <div>
              <div style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Today's Challenge</div>
              <h2 style={{ fontSize: '1.4rem', lineHeight: 1.2 }}>{challenge.title}</h2>
            </div>
            {dailyInfo?.completed && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: '#10b981', fontWeight: 700 }}>
                <CheckCircle size={20} /> Completed!
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <span className={`badge badge-${challenge.difficulty.toLowerCase()}`}>{challenge.difficulty}</span>
            <span className="badge badge-primary">{challenge.topic}</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', marginBottom: 20, lineHeight: 1.7 }}>
            {challenge.question}
          </div>

          {!revealed ? (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" onClick={() => setRevealed(true)}>
                <ChevronDown size={16} /> Show Hint & Answer
              </button>
              {!dailyInfo?.completed && (
                <button className="btn btn-success" onClick={markComplete} disabled={completing}>
                  <CheckCircle size={16} /> {completing ? 'Saving…' : 'Mark as Complete'}
                </button>
              )}
            </div>
          ) : (
            <div>
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem', marginBottom: 6 }}>💡 Hint</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{challenge.hint}</div>
              </div>
              <div className="answer-box" style={{ marginBottom: 14 }}>
                <div style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.82rem', marginBottom: 8 }}>✅ Solution</div>
                {challenge.solution}
              </div>
              {!dailyInfo?.completed && (
                <button className="btn btn-success" onClick={markComplete} disabled={completing}>
                  <CheckCircle size={16} /> {completing ? 'Saving…' : 'Mark as Complete'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Flame size={28} color="#f59e0b" />
          <div>
            <div style={{ fontWeight: 700 }}>Keep your streak alive!</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Complete today's challenge before midnight. View streaks on the Progress page.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
