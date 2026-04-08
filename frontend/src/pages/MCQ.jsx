import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { mcqQuestions, mcqTopics, mcqDifficulties } from '../data/mcqQuestions.js';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { QuestionSkeleton } from '../components/Skeleton.jsx';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Search, Filter, Target, BarChart3, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MCQ() {
  const toast = useToast();
  const [topic, setTopic] = useState('All');
  const [diff, setDiff] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [attempted, setAttempted] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const location = useLocation();

  useEffect(() => {
    console.log('[MCQ] Syncing assessment data:', location.key);
    const controller = new AbortController();
    setLoading(true);
    api.get('/mcq', { signal: controller.signal })
      .then(r => {
        setAttempted(r.data.attemptedQuestions || []);
        const answersMap = {};
        Object.entries(r.data.answers || {}).forEach(([key, value]) => {
          answersMap[parseInt(key)] = value;
        });
        setAnswers(answersMap);
        setLoading(false);
      })
      .catch(err => { if (err.name !== 'CanceledError') setLoading(false); });
    return () => controller.abort();
  }, [location.pathname]);

  const filtered = mcqQuestions.filter(q =>
    (topic === 'All' || q.topic === topic) &&
    (diff === 'All' || q.difficulty === diff) &&
    (debouncedSearch === '' || q.question.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const handleAnswerSubmit = async (questionId, selectedOption) => {
    if (submitting === questionId) return;
    const isMCQAnswered = Object.hasOwn(answers, questionId);
    setSubmitting(questionId);

    try {
      const question = mcqQuestions.find(q => q.id === questionId);
      const isCorrect = selectedOption === question.correctAnswer;
      const res = await api.post('/mcq/answer', { questionId, selectedOption, topic: question.topic, isCorrect });
      
      const answersMap = {};
      Object.entries(res.data.answers || {}).forEach(([key, value]) => {
        answersMap[parseInt(key)] = value;
      });
      setAnswers(answersMap);
      setAttempted(res.data.attemptedQuestions || []);

      if (!isMCQAnswered) {
        if (isCorrect) toast.success('Correct answer! 🎉');
        else toast.error(`Incorrect choice`);
      } else {
        toast.info('Answer updated');
      }
    } catch { toast.error('Submission failed'); }
    setSubmitting(null);
  };



  const correctCount = Object.keys(answers).filter(qid => {
    const q = mcqQuestions.find(m => m.id === parseInt(qid));
    return q && answers[parseInt(qid)] === q.correctAnswer;
  }).length;

  return (
    <div className="animate-fade-up">
      <div className="section-header page-content" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">MCQ Assessment</h1>
        <p className="section-sub">Validate your conceptual depth with precision-targeted assessments.</p>
      </div>

      <div className="flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '32px' }}>
        <aside className="w-full-mobile">
          <div className="glass-strong" style={{ padding: '24px', position: 'sticky', top: '100px' }} id="mcq-sidebar">
            <style>{`
              @media (max-width: 768px) {
                #mcq-sidebar { position: static !important; margin-bottom: 24px; padding: 16px !important; }
              }
            `}</style>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>{correctCount}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Successes</div>
                <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(correctCount / mcqQuestions.length) * 100}%` }} style={{ height: '100%', background: 'var(--accent)' }} />
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                <Search size={14} /> Intelligence Search
              </div>
              <input 
                className="input" placeholder="Search parameters..." 
                value={search} onChange={e => setSearch(e.target.value)} 
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                <Filter size={14} /> Knowledge Domain
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {mcqTopics.map(t => (
                  <button 
                    key={t} className={`nav-link ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}
                    style={{ background: 'none', border: 'none', padding: '10px 12px', fontSize: '0.85rem' }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px' }}>
                <Target size={14} /> Complexity
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {mcqDifficulties.map(d => (
                  <button 
                    key={d} onClick={() => setDiff(d)}
                    className={`btn ${diff === d ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-16 w-full-mobile">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <QuestionSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 40px', color: 'var(--text-muted)' }}>No modules matched your query criteria.</div>
          ) : (
            filtered.map(q => {
              const selected = answers[q.id];
              const isDone = selected !== undefined;
              const isCorrect = isDone && selected === q.correctAnswer;
              const isOpen = expanded === q.id;

              return (
                <div key={q.id} className="glass" style={{ padding: 0, overflow: 'hidden', borderLeft: isDone ? `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}` : '1px solid var(--border)' }}>
                    <div 
                        onClick={() => setExpanded(isOpen ? null : q.id)}
                        className="flex-col-mobile"
                        style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'start', gap: '20px' }}
                    >
                        <div className="flex items-start gap-16" style={{ flex: 1 }}>
                            <div style={{ marginTop: '2px', flexShrink: 0 }}>
                                {isDone ? (
                                    isCorrect ? <CheckCircle size={22} color="var(--success)" /> : <HelpCircle size={22} color="var(--danger)" />
                                ) : <Circle size={22} color="var(--border)" />}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.7rem' }}>{q.topic}</span>
                                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                                </div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5, color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{q.question}</h3>
                            </div>
                        </div>
                        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--text-muted)', marginLeft: 'auto' }} className="mt-8-mobile">
                            <ChevronDown size={20} />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                <div id={`mcq-ws-${q.id}`} style={{ padding: '0 24px 24px 66px' }}>
                                    <style>{`
                                        @media (max-width: 768px) {
                                            #mcq-ws-${q.id} { padding: 0 16px 20px 16px !important; }
                                        }
                                    `}</style>
                                    <div className="grid-res-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }} id={`mcq-opts-${q.id}`}>
                                        <style>{`
                                            @media (max-width: 640px) {
                                                #mcq-opts-${q.id} { grid-template-columns: 1fr !important; }
                                            }
                                        `}</style>
                                        {q.options.map((opt, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => handleAnswerSubmit(q.id, i)}
                                                disabled={submitting === q.id}
                                                style={{ 
                                                    padding: '16px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                                                    background: selected === i ? (isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)') : 'rgba(255,255,255,0.02)',
                                                    border: `1px solid ${selected === i ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--border)'}`,
                                                    color: selected === i ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--text-primary)',
                                                    fontSize: '0.85rem', transition: '0.2s', display: 'flex', gap: '12px'
                                                }}
                                            >
                                                <span style={{ fontWeight: 800, opacity: 0.5 }}>{String.fromCharCode(65+i)}</span>
                                                <span>{opt}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="glass-strong" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
                                                <BarChart3 size={14} /> Logic Synthesis
                                            </div>

                                        </div>
                                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{q.explanation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>


    </div>
  );
}
