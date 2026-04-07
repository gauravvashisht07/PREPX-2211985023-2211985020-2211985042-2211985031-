import { useState, useEffect, useRef } from 'react';
import { questions, topics } from '../data/questions.js';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { QuestionSkeleton } from '../components/Skeleton.jsx';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Search, Filter, BookOpen, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuestionBank() {
  const toast = useToast();
  const [topic, setTopic] = useState('All');
  const [diff, setDiff] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch progress
  useEffect(() => {
    const controller = new AbortController();
    api.get('/progress', { signal: controller.signal })
      .then(r => { setSolved(r.data.solvedQuestions || []); setLoading(false); })
      .catch(err => { if (err.name !== 'CanceledError') setLoading(false); });
    return () => controller.abort();
  }, []);

  const filtered = questions.filter(q =>
    (topic === 'All' || q.topic === topic) &&
    (diff === 'All' || q.difficulty === diff) &&
    (debouncedSearch === '' || q.question.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const toggleSolved = async (q) => {
    const isSolved = solved.includes(q.id);
    try {
      if (isSolved) {
        await api.delete(`/progress/solved/${q.id}`);
        setSolved(s => s.filter(id => id !== q.id));
        toast.info('Question unmarked');
      } else {
        const res = await api.post('/progress/solved', { questionId: q.id, topic: q.topic });
        setSolved(res.data.solvedQuestions || []);
        toast.success('Question marked as solved! 🎯');
      }
    } catch { toast.error('Failed to update progress'); }
  };

  const topicCounts = {};
  topics.forEach(t => {
    topicCounts[t] = t === 'All' ? questions.length : questions.filter(q => q.topic === t).length;
  });

  return (
    <div className="animate-fade-up">
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Question Bank</h1>
        <p className="section-sub">
          {filtered.length} questions available · <span className="gradient-text" style={{ fontWeight: 700 }}>{solved.length} solved</span>
        </p>
      </div>

      <div className="qb-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        <aside>
          <div className="glass" style={{ padding: '24px', position: 'sticky', top: '100px', marginBottom: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                <Search size={14} /> Search
              </div>
              <div style={{ position: 'relative' }}>
                <input 
                  className="input" 
                  placeholder="Find questions..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', fontSize: '0.85rem' }} 
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                <Filter size={14} /> Topic
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {topics.map(t => (
                  <button 
                    key={t} 
                    className={`nav-link ${topic === t ? 'active' : ''}`} 
                    onClick={() => setTopic(t)}
                    style={{ background: 'none', border: 'none', padding: '10px 12px', fontSize: '0.88rem', justifyContent: 'space-between' }}
                  >
                    <span>{t}</span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '2px 8px' }}>{topicCounts[t]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                <Zap size={14} /> Difficulty
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setDiff(d)}
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

        <div>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <QuestionSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>🔍</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>No matches found</h3>
              <p>Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map(q => {
                const isSolved = solved.includes(q.id);
                const isOpen = expanded === q.id;
                return (
                  <motion.div 
                    layout
                    key={q.id} 
                    className="glass" 
                    style={{ 
                        overflow: 'hidden', 
                        borderLeft: isSolved ? '4px solid #10b981' : '1px solid var(--border)',
                        transition: '0.3s'
                    }}
                  >
                    <div 
                        className="question-header" 
                        onClick={() => setExpanded(isOpen ? null : q.id)}
                        style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                    >
                      <button 
                        onClick={e => { e.stopPropagation(); toggleSolved(q); }} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSolved ? '#10b981' : 'var(--text-muted)', padding: 0 }}
                      >
                        {isSolved ? <CheckCircle size={22} /> : <Circle size={22} />}
                      </button>
                      <span style={{ flex: 1, fontWeight: 600, fontSize: '1rem', color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                        {q.question}
                      </span>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span className="badge badge-medium" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{q.topic}</span>
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyCenter: 'center', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}>
                            <ChevronDown size={18} color="var(--text-muted)" style={{ margin: '0 auto' }} />
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div style={{ padding: '0 24px 24px 62px' }}>
                            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
                                <BookOpen size={14} /> Expert Solution
                            </div>
                            <p style={{ lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px' }}>
                                {q.answer}
                            </p>
                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focus Area:</span>
                                <span className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{q.subtopic}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
