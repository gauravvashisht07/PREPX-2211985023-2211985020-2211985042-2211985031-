import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questions, topics } from '../data/questions.js';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { QuestionSkeleton } from '../components/Skeleton.jsx';
import {
  ChevronDown, CheckCircle, Circle, Search, Filter,
  BookOpen, Zap, Brain, Loader2, Eye, EyeOff,
  Star, Lightbulb, AlertCircle, RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultQState = () => ({
  userAnswer: '',
  result: null,
  showAnswer: false,
  loading: false,
  error: '',
});

export default function QuestionBank() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [topic, setTopic]                 = useState(() => sessionStorage.getItem('qb_topic') || 'All');
  const [diff, setDiff]                   = useState(() => sessionStorage.getItem('qb_diff') || 'All');
  const [search, setSearch]               = useState(() => sessionStorage.getItem('qb_search') || '');
  const [debouncedSearch, setDebounced]   = useState(search);
  const [expanded, setExpanded]           = useState(null);
  const [evaluations, setEvaluations]     = useState({});

  useEffect(() => {
    sessionStorage.setItem('qb_topic', topic);
    sessionStorage.setItem('qb_diff', diff);
    sessionStorage.setItem('qb_search', search);
  }, [topic, diff, search]);

  const setQState = useCallback((qId, patch) => {
    setEvaluations(prev => ({
      ...prev,
      [qId]: { ...(prev[qId] || defaultQState()), ...patch },
    }));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch Solved Progress
  const { data: solved, isLoading: loading } = useQuery({
    queryKey: ['solvedQuestions'],
    queryFn: async () => {
      const res = await api.get('/progress');
      return res.data.solvedQuestions || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Mutation for toggling solved
  const { mutate: toggleSolvedMutation } = useMutation({
    mutationFn: async ({ qId, isSolved }) => {
      if (isSolved) {
        await api.delete(`/progress/solved/${qId}`);
        return { qId, action: 'removed' };
      } else {
        const res = await api.post('/progress/solved', { questionId: qId, topic: questions.find(q => q.id === qId).topic });
        return { qId, action: 'added', solvedList: res.data.solvedQuestions };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solvedQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });
      if (data.action === 'added') toast.success('Question marked as solved! 🎯');
      else toast.info('Question unmarked');
    },
    onError: () => toast.error('Failed to update progress'),
  });

  const toggleSolved = (q) => {
    const isSolved = solved?.includes(q.id);
    toggleSolvedMutation({ qId: q.id, isSolved });
  };

  const filtered = questions.filter(q =>
    (topic === 'All' || q.topic === topic) &&
    (diff === 'All' || q.difficulty === diff) &&
    (debouncedSearch === '' || q.question.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const toggleExpand = (qId) => {
    if (expanded === qId) {
      setExpanded(null);
    } else {
      setExpanded(qId);
      if (!evaluations[qId]) {
        setQState(qId, defaultQState());
      }
    }
  };

  // AI Evaluation Mutation
  const { mutate: evaluateMutation } = useMutation({
    mutationFn: async ({ q, userAnswer }) => {
      const { data } = await api.post('/ai/evaluate', {
        question: q.question,
        userAnswer,
        correctAnswer: q.answer,
      });
      return { qId: q.id, result: data };
    },
    onMutate: ({ qId }) => {
      setQState(qId, { loading: true, result: null, error: '', showAnswer: false });
    },
    onSuccess: (data) => {
      setQState(data.qId, { loading: false, result: data.result, showAnswer: true });
    },
    onError: (err, { qId }) => {
      setQState(qId, {
        loading: false,
        error: err.response?.data?.error || 'Evaluation failed. Please try again.',
      });
    },
  });

  const handleEvaluate = (q) => {
    const qs = evaluations[q.id] || defaultQState();
    if (!qs.userAnswer.trim()) return;
    evaluateMutation({ q, userAnswer: qs.userAnswer });
  };

  const handleReset = (qId) => setQState(qId, defaultQState());

  const topicCounts = {};
  topics.forEach(t => {
    topicCounts[t] = t === 'All' ? questions.length : questions.filter(q => q.topic === t).length;
  });

  return (
    <div className="animate-fade-up">
      <div className="section-header page-content" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Question Bank</h1>
        <p className="section-sub">
          {filtered.length} questions available ·{' '}
          <span className="gradient-text" style={{ fontWeight: 700 }}>{solved?.length || 0} solved</span>
        </p>
      </div>

      <div className="qb-layout flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* ── Sidebar ── */}
        <aside className="w-full-mobile">
          <div className="glass" style={{ padding: '24px', position: 'sticky', top: '100px' }} id="qb-sidebar">
            <style>{`
              @media (max-width: 768px) {
                #qb-sidebar { position: static !important; margin-bottom: 24px; padding: 16px !important; }
              }
            `}</style>
            {/* Search */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '1px' }}>
                <Search size={14} /> Search
              </div>
              <input
                className="input"
                placeholder="Find questions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ fontSize: '0.85rem' }}
                aria-label="Search questions"
              />
            </div>

            {/* Topic filter */}
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
                    aria-pressed={topic === t}
                    style={{ background: 'none', border: 'none', padding: '10px 12px', fontSize: '0.88rem', justifyContent: 'space-between' }}
                  >
                    <span>{t}</span>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '2px 8px' }}>{topicCounts[t]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty filter */}
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
                    aria-pressed={diff === d}
                    style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '8px' }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Question list ── */}
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
                const isSolved = solved?.includes(q.id) || false;
                const isOpen   = expanded === q.id;
                const qs       = evaluations[q.id] || defaultQState();
                const hasAttempted = qs.userAnswer.trim().length > 0;
                const wordCount    = qs.userAnswer.trim().split(/\s+/).filter(Boolean).length;

                // Score colour band
                const scoreColor = qs.result
                  ? qs.result.score >= 8 ? '#10b981'
                  : qs.result.score >= 5 ? '#f59e0b'
                  : '#ef4444'
                  : 'var(--primary)';

                return (
                  <motion.div
                    layout
                    key={q.id}
                    className="glass"
                    style={{
                      overflow: 'hidden',
                      borderLeft: isSolved ? '4px solid #10b981' : '1px solid var(--border)',
                      transition: 'border 0.3s',
                    }}
                  >
                    {/* ── Question header (click to expand) ── */}
                    <div
                      onClick={() => toggleExpand(q.id)}
                      className="flex-col-mobile"
                      style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}
                    >
                      <div className="flex items-center gap-16" style={{ flex: 1 }}>
                        {/* Solved toggle */}
                        <button
                          onClick={e => { e.stopPropagation(); toggleSolved(q); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isSolved ? '#10b981' : 'var(--text-muted)', padding: 0, flexShrink: 0 }}
                        >
                          {isSolved ? <CheckCircle size={22} /> : <Circle size={22} />}
                        </button>

                        <span style={{ fontWeight: 600, fontSize: '0.95rem', color: isSolved ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.4 }}>
                          {q.question}
                        </span>
                      </div>

                      <div className="flex gap-10 items-center flex-shrink-0 justify-end-mobile w-full-mobile mt-8-mobile">
                        {qs.result && (
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: scoreColor, background: `${scoreColor}15`, padding: '3px 10px', borderRadius: '99px', border: `1px solid ${scoreColor}30` }}>
                            {qs.result.score}/10
                          </span>
                        )}
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{q.topic}</span>
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                          <ChevronDown size={18} color="var(--text-muted)" />
                        </div>
                      </div>
                    </div>

                    {/* ── Expanded workspace ── */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          key={`workspace-${q.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div id={`ws-${q.id}`} style={{ padding: '0 24px 28px 62px' }}>
                            <style>{`
                              @media (max-width: 768px) {
                                #ws-${q.id} { padding: 0 16px 20px 16px !important; }
                              }
                            `}</style>
                            <div style={{ height: '1px', background: 'var(--border)', marginBottom: '24px' }} />

                            {/* Focus area */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Focus Area:</span>
                              <span className="gradient-text" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{q.subtopic}</span>
                            </div>

                            {/* ── Answer textarea ── */}
                            <div style={{ marginBottom: '16px' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Your Answer
                              </label>
                              <textarea
                                value={qs.userAnswer}
                                onChange={e => setQState(q.id, { userAnswer: e.target.value, result: null, showAnswer: false, error: '' })}
                                placeholder="Write your answer here — include definitions, examples, and complexity where relevant."
                                rows={5}
                                style={{
                                  width: '100%', padding: '14px',
                                  background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                                  borderRadius: '12px', color: 'white', fontFamily: 'inherit',
                                  fontSize: '0.9rem', resize: 'vertical', outline: 'none',
                                  transition: 'border-color 0.2s', lineHeight: 1.7, boxSizing: 'border-box',
                                }}
                                onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                              />
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                                <span style={{ fontSize: '0.72rem', color: wordCount < 30 && hasAttempted ? '#f59e0b' : 'var(--text-muted)' }}>
                                  {hasAttempted
                                    ? wordCount < 30
                                      ? `${wordCount} words — aim for 30+`
                                      : `${wordCount} words ✓`
                                    : 'Type your answer above to begin'}
                                </span>
                                {qs.result && (
                                  <button
                                    onClick={() => handleReset(q.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: 'var(--text-muted)' }}
                                  >
                                    <RotateCcw size={11} /> Reset
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* ── Action buttons ── */}
                            <div className="flex gap-12 mb-20 flex-col-mobile">
                              {/* Evaluate */}
                              <button
                                onClick={() => handleEvaluate(q)}
                                disabled={qs.loading || !hasAttempted}
                                className="btn btn-primary w-full-mobile"
                                style={{ borderRadius: '10px', fontSize: '0.88rem', padding: '10px 20px', opacity: !hasAttempted ? 0.5 : 1 }}
                              >
                                {qs.loading
                                  ? <><Loader2 size={15} className="animate-spin" /> Evaluating...</>
                                  : <><Brain size={15} /> Evaluate Answer</>}
                              </button>

                              {/* Show / Hide Answer */}
                              <button
                                onClick={() => setQState(q.id, { showAnswer: !qs.showAnswer })}
                                disabled={!hasAttempted}
                                className="btn btn-ghost w-full-mobile"
                                style={{ borderRadius: '10px', fontSize: '0.88rem', padding: '10px 20px', opacity: !hasAttempted ? 0.4 : 1, cursor: !hasAttempted ? 'not-allowed' : 'pointer' }}
                              >
                                {qs.showAnswer ? <><EyeOff size={15} /> Hide Answer</> : <><Eye size={15} /> Show Answer</>}
                              </button>
                            </div>

                            {/* ── Error ── */}
                            {qs.error && (
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#ef4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.07)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '16px' }}>
                                <AlertCircle size={15} /> {qs.error}
                              </div>
                            )}

                            {/* ── Correct answer (revealed after evaluate or manual show) ── */}
                            <AnimatePresence>
                              {qs.showAnswer && (
                                <motion.div
                                  key={`answer-${q.id}`}
                                  initial={{ opacity: 0, y: -8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -8 }}
                                  transition={{ duration: 0.3 }}
                                  style={{ marginBottom: '20px' }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.73rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                                    <BookOpen size={14} /> Model Answer
                                  </div>
                                  <p style={{ lineHeight: 1.8, fontSize: '0.95rem', color: 'var(--text-primary)', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', margin: 0 }}>
                                    {q.answer}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* ── AI Evaluation result ── */}
                            <AnimatePresence>
                              {qs.result && (
                                <motion.div
                                  key={`result-${q.id}`}
                                  initial={{ opacity: 0, y: 12 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 12 }}
                                  transition={{ duration: 0.4 }}
                                  className="glass-strong"
                                  style={{ padding: '24px', borderRadius: '16px', borderLeft: `4px solid ${scoreColor}` }}
                                >
                                  {/* Score row */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                      <div style={{ fontSize: '2.6rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                                        {qs.result.score}
                                      </div>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>/10</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>AI Evaluation Score</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: scoreColor, background: `${scoreColor}15`, padding: '3px 12px', borderRadius: '99px', border: `1px solid ${scoreColor}30` }}>
                                          {qs.result.score >= 8 ? 'Excellent' : qs.result.score >= 5 ? 'Good' : 'Needs Work'}
                                        </span>
                                      </div>
                                      <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${qs.result.score * 10}%` }}
                                          transition={{ duration: 1.2, ease: 'easeOut' }}
                                          style={{ height: '100%', background: scoreColor, borderRadius: '4px' }}
                                        />
                                      </div>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        Keyword match · Phrase similarity · Answer depth
                                      </div>
                                    </div>
                                  </div>

                                  {/* Feedback */}
                                  <div style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                                      <Star size={13} /> Detailed Feedback
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px', fontSize: '0.87rem', lineHeight: 2, whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>
                                      {qs.result.feedback}
                                    </div>
                                  </div>

                                  {/* Suggestions */}
                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
                                      <Lightbulb size={13} /> How to Improve
                                    </div>
                                    <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)', padding: '14px', borderRadius: '10px', fontSize: '0.87rem', lineHeight: 1.9, whiteSpace: 'pre-line', color: 'var(--text-secondary)' }}>
                                      {qs.result.suggestions}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

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
