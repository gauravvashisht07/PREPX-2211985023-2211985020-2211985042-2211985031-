import { useState, useEffect, useRef } from 'react';
import { questions, topics } from '../data/questions.js';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { QuestionSkeleton } from '../components/Skeleton.jsx';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Search } from 'lucide-react';

export default function QuestionBank() {
  const toast = useToast();
  const [topic, setTopic] = useState('All');
  const [diff, setDiff] = useState('All');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [solved, setSolved] = useState([]);
  const [loading, setLoading] = useState(true);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch progress with AbortController
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
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">Question Bank</h1>
        <p className="section-sub">{filtered.length} questions · {solved.length} solved</p>
      </div>

      <div className="qb-layout">
        <aside>
          <div className="glass" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 11, top: 11, color: 'var(--text-muted)' }} />
              <input className="input" placeholder="Search questions…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 34, fontSize: '0.85rem' }} />
            </div>
          </div>
          <div className="glass" style={{ padding: 16, marginBottom: 12 }}>
            <div className="filter-title">Topic</div>
            {topics.map(t => (
              <button key={t} className={`filter-btn ${topic === t ? 'active' : ''}`} onClick={() => setTopic(t)}>
                <span className={`badge badge-${t.toLowerCase()}`} style={{ padding: '1px 7px', fontSize: '0.7rem' }}>{topicCounts[t]}</span>
                {t}
              </button>
            ))}
          </div>
          <div className="glass" style={{ padding: 16 }}>
            <div className="filter-title">Difficulty</div>
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button key={d} className={`filter-btn ${diff === d ? 'active' : ''}`} onClick={() => setDiff(d)}>
                {d !== 'All' && <span className={`badge badge-${d.toLowerCase()}`} style={{ padding: '1px 6px', fontSize: '0.7rem' }}>{d}</span>}
                {d === 'All' && d}
              </button>
            ))}
          </div>
        </aside>

        <div>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <QuestionSkeleton key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <p>No questions match your filters.</p>
            </div>
          ) : filtered.map(q => {
            const isSolved = solved.includes(q.id);
            const isOpen = expanded === q.id;
            return (
              <div key={q.id} className="question-card" style={isSolved ? { borderColor: 'rgba(16,185,129,0.3)' } : {}}>
                <div className="question-header" onClick={() => setExpanded(isOpen ? null : q.id)}>
                  <button onClick={e => { e.stopPropagation(); toggleSolved(q); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSolved ? '#10b981' : 'var(--text-muted)', padding: 0, flexShrink: 0 }}>
                    {isSolved ? <CheckCircle size={20} /> : <Circle size={20} />}
                  </button>
                  <span className="question-text">{q.question}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <span className={`badge badge-${q.topic.toLowerCase()}`}>{q.topic}</span>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="question-body">
                    <div className="filter-title" style={{ marginBottom: 8 }}>💡 Answer</div>
                    <div className="answer-box">{q.answer}</div>
                    <div style={{ marginTop: 12 }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Subtopic: <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>{q.subtopic}</span></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
