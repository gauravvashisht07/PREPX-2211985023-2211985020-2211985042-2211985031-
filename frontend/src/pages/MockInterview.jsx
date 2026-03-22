import { useState, useEffect, useRef } from 'react';
import { questions, topics } from '../data/questions.js';
import { Play, SkipForward, CheckCircle, RefreshCw } from 'lucide-react';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function MockInterview() {
  const [phase, setPhase] = useState('setup');
  const [selTopic, setSelTopic] = useState('All');
  const [count, setCount] = useState(5);
  const [sessionQs, setSessionQs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [ratings, setRatings] = useState({});
  const [timeLeft, setTimeLeft] = useState(120);

  // ✅ Fix: useRef instead of useState to avoid re-render on timer ID change
  const timerRef = useRef(null);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  // ✅ Fix: cleanup timer on unmount to prevent memory leak
  useEffect(() => () => stopTimer(), []);

  const startTimer = (sec) => {
    stopTimer();
    setTimeLeft(sec);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const start = () => {
    const pool = selTopic === 'All' ? questions : questions.filter(q => q.topic === selTopic);
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length));
    setSessionQs(picked);
    setIdx(0); setRevealed(false); setRatings({});
    setPhase('session');
    startTimer(120);
  };

  const next = () => {
    if (idx + 1 >= sessionQs.length) { stopTimer(); setPhase('results'); }
    else { setIdx(i => i + 1); setRevealed(false); startTimer(120); }
  };

  const avgRating = () => {
    const vals = Object.values(ratings);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
  };

  const timerPct = (timeLeft / 120) * 100;
  const timerColor = timeLeft > 60 ? '#10b981' : timeLeft > 30 ? '#f59e0b' : '#ef4444';

  if (phase === 'setup') return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">Mock Interview</h1>
        <p className="section-sub">Simulate a real interview with timed questions and self-evaluation.</p>
      </div>
      <div className="mock-setup">
        <div className="glass" style={{ padding: 32 }}>
          <h2 style={{ marginBottom: 24, fontSize: '1.2rem' }}>⚙️ Configure Your Session</h2>
          <div className="form-group">
            <label className="label">Topic</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {topics.map(t => (
                <button key={t} className={`filter-chip ${selTopic === t ? 'active' : ''}`} onClick={() => setSelTopic(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 20 }}>
            <label className="label">Number of Questions</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[5, 10, 15].map(n => (
                <button key={n} className={`filter-chip ${count === n ? 'active' : ''}`} onClick={() => setCount(n)}>{n} Questions</button>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 12, padding: 16, margin: '24px 0', fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span>⏱ 2 min per question</span>
              <span>⭐ Self-rate 1–5 after reveal</span>
              <span>📊 Score summary at end</span>
            </div>
          </div>
          <button id="mock-start" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }} onClick={start}>
            <Play size={18} /> Start Mock Interview
          </button>
        </div>
      </div>
    </div>
  );

  if (phase === 'session') {
    const q = sessionQs[idx];
    return (
      <div style={{ animation: 'fadeInUp 0.4s ease' }}>
        <div className="mock-session">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Question {idx + 1} of {sessionQs.length}</span>
            <div className="progress-bar-track" style={{ width: 200 }}>
              <div className="progress-bar-fill" style={{ width: `${((idx + 1) / sessionQs.length) * 100}%` }} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="60" cy="60" r="54" fill="none" stroke={timerColor} strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - timerPct / 100)}`}
                style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s', transform: 'rotate(-90deg)', transformOrigin: 'center' }} />
              <text x="60" y="56" textAnchor="middle" fill={timerColor} fontSize="24" fontWeight="800" fontFamily="Space Grotesk">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </text>
              <text x="60" y="74" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="Inter">seconds</text>
            </svg>
          </div>

          <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <span className={`badge badge-${q.topic.toLowerCase()}`}>{q.topic}</span>
              <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
            </div>
            <h2 style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>{q.question}</h2>

            {!revealed ? (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setRevealed(true)}>
                Reveal Answer
              </button>
            ) : (
              <div style={{ marginTop: 20 }}>
                <div className="answer-box">{q.answer}</div>
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    How well did you know this? (1 = Poor, 5 = Perfect)
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[1, 2, 3, 4, 5].map(r => (
                      <button key={r} onClick={() => setRatings(rat => ({ ...rat, [idx]: r }))} style={{
                        width: 40, height: 40, borderRadius: 10,
                        border: `2px solid ${ratings[idx] === r ? '#8b5cf6' : 'var(--border)'}`,
                        background: ratings[idx] === r ? 'rgba(139,92,246,0.25)' : 'var(--bg-card)',
                        color: ratings[idx] === r ? '#a78bfa' : 'var(--text-secondary)',
                        cursor: 'pointer', fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s'
                      }}>{r}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={() => { stopTimer(); setPhase('results'); }}>End Session</button>
            <button id="mock-next" className="btn btn-primary" onClick={next}>
              {idx + 1 === sessionQs.length ? <><CheckCircle size={17} /> Finish</> : <><SkipForward size={17} /> Next</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ratedCount = Object.keys(ratings).length;
  const highRated = Object.values(ratings).filter(r => r >= 4).length;
  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
      <h1 style={{ marginBottom: 8 }}>Session Complete!</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>You answered {sessionQs.length} questions in your mock interview.</p>

      <div className="stats-grid" style={{ textAlign: 'left', marginBottom: 28 }}>
        {[
          { label: 'Questions', value: sessionQs.length },
          { label: 'Self-Rated', value: ratedCount },
          { label: 'Avg Score', value: `${avgRating()}/5` },
          { label: 'Strong (≥4)', value: highRated },
        ].map(({ label, value }) => (
          <div key={label} className="stat-card">
            <div><div className="stat-value gradient-text">{value}</div><div className="stat-label">{label}</div></div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
        {sessionQs.map((q, i) => (
          <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < sessionQs.length - 1 ? '1px solid var(--border)' : 'none', fontSize: '0.87rem', gap: 12 }}>
            <span style={{ flex: 1, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.question}</span>
            <span style={{ color: ratings[i] >= 4 ? '#10b981' : ratings[i] >= 2 ? '#f59e0b' : '#ef4444', fontWeight: 700, flexShrink: 0 }}>
              {ratings[i] ? `${ratings[i]}/5` : '—'}
            </span>
          </div>
        ))}
      </div>

      <button className="btn btn-primary btn-lg" onClick={() => setPhase('setup')}>
        <RefreshCw size={18} /> Try Again
      </button>
    </div>
  );
}
