import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { questions, topics } from '../data/questions.js';
import { Play, SkipForward, CheckCircle, RefreshCw, Timer, Settings2, Trophy, BarChart3, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [userAnswers, setUserAnswers] = useState({});

  const timerRef = useRef(null);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

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
  const timerColor = timeLeft > 60 ? 'var(--success)' : timeLeft > 30 ? 'var(--warning)' : 'var(--danger)';

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (phase === 'setup') return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="animate-fade-up"
    >
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Mock Interview Studio</h1>
        <p className="section-sub">Simulate high-pressure technical interviews with real-time feedback.</p>
      </div>

      <div className="mock-layout page-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-strong" style={{ padding: '32px' }} id="mock-setup-card">
          <style>{`
            @media (max-width: 768px) {
              #mock-setup-card { padding: 20px !important; }
            }
          `}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div className="feature-icon-wrapper" style={{ marginBottom: 0, width: '40px', height: '40px' }}>
               <Settings2 size={20} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Session Configuration</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
            <div>
              <label className="label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', display: 'block' }}>
                Select Focus Topic
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {topics.map(t => (
                  <button 
                    key={t} 
                    className={`btn ${selTopic === t ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setSelTopic(t)}
                    style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px', display: 'block' }}>
                Question Count
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[3, 5, 10].map(n => (
                  <button 
                    key={n} 
                    className={`btn ${count === n ? 'btn-primary' : 'btn-ghost'}`} 
                    onClick={() => setCount(n)}
                    style={{ flex: 1, padding: '10px', borderRadius: '10px', fontSize: '0.85rem' }}
                  >
                    {n} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass" style={{ margin: '40px 0', padding: '24px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
                <Timer size={24} color="var(--accent)" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>2:00 / Q</div>
            </div>
            <div style={{ width: '1px', height: '30px', background: 'var(--border)' }} />

            <div style={{ textAlign: 'center' }}>
                <CheckCircle size={24} color="var(--success)" style={{ marginBottom: '8px' }} />
                <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Self-Rating</div>
            </div>
          </div>

          <button id="mock-start" className="btn btn-primary btn-glow btn-lg w-full" onClick={start} style={{ borderRadius: '14px', height: '56px', fontSize: '1.1rem' }}>
            <Play size={20} fill="currentColor" /> Initialize Session
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (phase === 'session') {
    const q = sessionQs[idx];
    return (
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="animate-fade-up"
      >
        <div className="mock-session page-content" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Step <span className="gradient-text" style={{ fontSize: '1.2rem', fontWeight: 800 }}>{idx + 1}</span> of {sessionQs.length}
            </div>
            <div style={{ width: '250px', maxWidth: '40%', background: 'rgba(255,255,255,0.05)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${((idx + 1) / sessionQs.length) * 100}%` }}
                 style={{ height: '100%', background: 'var(--primary)', borderRadius: '4px' }} 
              />
            </div>
          </div>

          <div className="flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
            <div className="flex flex-col gap-24">
              <div className="glass-strong" style={{ padding: '32px' }} id="mock-q-card">
                <style>{`
                  @media (max-width: 768px) {
                    #mock-q-card { padding: 20px !important; }
                  }
                `}</style>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <span className={`badge badge-${q.topic.toLowerCase()}`} style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent)' }}>{q.topic}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', lineHeight: 1.5, fontWeight: 700 }}>{q.question}</h2>
                
                <AnimatePresence mode="wait">
                  {!revealed ? (
                    <motion.div 
                      key="input"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <textarea
                        placeholder="Draft your technical response here..."
                        value={userAnswers[idx] || ''}
                        onChange={(e) => setUserAnswers(curr => ({ ...curr, [idx]: e.target.value }))}
                        className="custom-scrollbar"
                        style={{
                          width: '100%', minHeight: '240px', marginTop: '24px',
                          padding: '20px', borderRadius: '16px', border: '1px solid var(--border)',
                          background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)',
                          fontFamily: 'inherit', fontSize: '1rem', resize: 'none', outline: 'none',
                          lineHeight: '1.6'
                        }}
                      />
                      <button className="btn btn-primary btn-glow" style={{ marginTop: '24px', padding: '12px 32px', borderRadius: '12px' }} onClick={() => setRevealed(true)}>
                        Finalize & Reveal
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="reveal"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                         <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Your Response</div>
                            <div className="glass" style={{ padding: '20px', fontSize: '0.95rem', background: 'rgba(124, 58, 237, 0.05)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                                {userAnswers[idx] || 'No response provided.'}
                            </div>
                         </div>
                         
                         <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Ideal Methodology</div>
                            <div className="glass" style={{ padding: '20px', fontSize: '0.95rem', background: 'rgba(0,0,0,0.2)' }}>
                                {q.answer}
                            </div>
                         </div>


                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }} className="flex-col-mobile">
                <button className="btn btn-ghost w-full-mobile order-2-mobile" onClick={() => { stopTimer(); setPhase('results'); }} style={{ borderRadius: '12px' }}>End Studio</button>
                <button id="mock-next" className="btn btn-primary btn-glow w-full-mobile order-1-mobile" onClick={next} style={{ borderRadius: '12px', padding: '12px 40px' }}>
                  {idx + 1 === sessionQs.length ? <><CheckCircle size={18} /> Finish Session</> : <><SkipForward size={18} /> Next Protocol</>}
                </button>
              </div>
            </div>

            <aside className="flex flex-col gap-24">
              <div className="glass-strong" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <Timer size={16} color="var(--text-muted)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Response Clock</span>
                </div>
                <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto' }}>
                    <svg width="160" height="160" viewBox="0 0 160 160">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                      <motion.circle 
                        cx="80" cy="80" r="70" fill="none" stroke={timerColor} strokeWidth="10"
                        strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 70}`}
                        animate={{ strokeDashoffset: 2 * Math.PI * 70 * (1 - timerPct / 100) }}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }} 
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: timerColor }}>
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>REMAINING</div>
                    </div>
                </div>
              </div>

              {revealed && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-strong" style={{ padding: '24px' }}
                >
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1px', textAlign: 'center' }}>Self-Audit Profile</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(r => (
                        <button key={r} onClick={() => setRatings(rat => ({ ...rat, [idx]: r }))} style={{
                            height: '44px', borderRadius: '10px',
                            border: `1px solid ${ratings[idx] === r ? 'var(--primary)' : 'var(--border)'}`,
                            background: ratings[idx] === r ? 'rgba(124, 58, 237, 0.2)' : 'rgba(0,0,0,0.2)',
                            color: ratings[idx] === r ? 'var(--accent)' : 'var(--text-muted)',
                            cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem', transition: '0.2s'
                        }}>{r}</button>
                        ))}
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        Rate your response accuracy from 1 to 5 to update your preparation score.
                    </p>
                </motion.div>
              )}
            </aside>
          </div>
        </div>


      </motion.div>
    );
  }

  const ratedCount = Object.keys(ratings).length;
  const highRated = Object.values(ratings).filter(r => r >= 4).length;
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="animate-fade-up page-content"
      style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
    >
      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto 40px' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(124, 58, 237, 0.2)', filter: 'blur(30px)', position: 'absolute', top: 0, left: 0 }} />
          <Trophy size={80} color="var(--primary)" style={{ position: 'relative' }} />
      </div>
      
      <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '12px' }} id="debrief-title">
        <style>{`@media (max-width: 768px) { #debrief-title { font-size: 2.2rem !important; } }`}</style>
        Session Debrief
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '48px', fontSize: '1.1rem' }}>Excellent focus. Your session data has been compiled below.</p>

      <div className="grid-res-4" style={{ marginBottom: '40px' }}>
        {[
          { label: 'Modules', value: sessionQs.length, icon: BookOpen, color: 'var(--accent)' },
          { label: 'Audited', value: ratedCount, icon: CheckCircle, color: 'var(--success)' },
          { label: 'Performance', value: `${avgRating()}/5`, icon: BarChart3, color: 'var(--secondary)' },
          { label: 'Mastered', value: highRated, icon: Trophy, color: 'var(--primary)' },
        ].map((stat, i) => (
          <div key={i} className="glass" style={{ padding: '24px', borderBottom: `2px solid ${stat.color}44` }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-strong" style={{ padding: '32px', textAlign: 'left', marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}> 
            <BarChart3 size={18} color="var(--accent)" /> Detailed Protocol Analysis 
        </h3>
        {sessionQs.map((q, i) => (
          <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < sessionQs.length - 1 ? '1px solid var(--border)' : 'none', gap: '24px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.question}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{q.topic} • {q.difficulty}</div>
            </div>
            <div style={{ 
                width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyCenter: 'center',
                background: ratings[i] >= 4 ? 'rgba(16, 185, 129, 0.1)' : ratings[i] >= 2 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: ratings[i] >= 4 ? 'var(--success)' : ratings[i] >= 2 ? 'var(--warning)' : 'var(--danger)',
                fontWeight: 800, flexShrink: 0 
            }}>
              <span style={{ margin: '0 auto' }}>{ratings[i] ? ratings[i] : '—'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }} className="flex-col-mobile">
          <button className="btn btn-ghost btn-lg w-full-mobile order-2-mobile" onClick={() => setPhase('setup')} style={{ borderRadius: '12px' }}>New Session</button>
          <Link to="/notes" className="btn btn-primary btn-glow btn-lg w-full-mobile order-1-mobile" style={{ borderRadius: '12px', padding: '12px 48px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            View Preparation Roadmap <ChevronRight size={18} />
          </Link>
      </div>
    </motion.div>
  );
}
