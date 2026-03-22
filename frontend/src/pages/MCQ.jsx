import { useState, useEffect, useRef } from 'react';
import { mcqQuestions, mcqTopics, mcqDifficulties } from '../data/mcqQuestions.js';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { QuestionSkeleton } from '../components/Skeleton.jsx';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Search, Volume2 } from 'lucide-react';

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
  const [showResults, setShowResults] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch attempted questions & answers
  useEffect(() => {
    const controller = new AbortController();
    api.get('/mcq', { signal: controller.signal })
      .then(r => {
        setAttempted(r.data.attemptedQuestions || []);
        setAnswers(r.data.answers || {});
        setLoading(false);
      })
      .catch(err => { if (err.name !== 'CanceledError') setLoading(false); });
    return () => controller.abort();
  }, []);

  const filtered = mcqQuestions.filter(q =>
    (topic === 'All' || q.topic === topic) &&
    (diff === 'All' || q.difficulty === diff) &&
    (debouncedSearch === '' || q.question.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const handleAnswerSubmit = async (questionId, selectedOption) => {
    const isMCQAnswered = Object.hasOwn(answers, questionId);
    try {
      const res = await api.post('/mcq/answer', { questionId, selectedOption });
      setAnswers(res.data.answers || {});
      setAttempted(res.data.attemptedQuestions || []);
      
      const question = mcqQuestions.find(q => q.id === questionId);
      const isCorrect = selectedOption === question.correctAnswer;
      
      if (!isMCQAnswered) {
        if (isCorrect) {
          toast.success('Correct answer! 🎉');
        } else {
          toast.error(`Incorrect! The correct answer is: ${question.options[question.correctAnswer]}`);
        }
      } else {
        toast.info('Answer updated');
      }
    } catch {
      toast.error('Failed to submit answer');
    }
  };

  const topicCounts = {};
  mcqTopics.forEach(t => {
    topicCounts[t] = t === 'All' ? mcqQuestions.length : mcqQuestions.filter(q => q.topic === t).length;
  });

  const correctCount = Object.keys(answers).filter(qid => {
    const q = mcqQuestions.find(m => m.id === parseInt(qid));
    return q && answers[qid] === q.correctAnswer;
  }).length;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      {/* Header Section */}
      <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.12))', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 8, color: 'var(--text-primary)' }}>📋 Multiple Choice Questions</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 12 }}>Test your knowledge with MCQs across all topics</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', fontSize: '1.8rem', fontWeight: 'bold' }}>{filtered.length}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Available MCQs</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ color: 'var(--success)', fontSize: '1.8rem', fontWeight: 'bold' }}>{correctCount}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Correct Answers</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent)', fontSize: '1.8rem', fontWeight: 'bold' }}>{Object.keys(answers).length}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Attempted</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, position: 'relative' }}>
        {/* Sidebar Filters */}
        <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: 14, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Topic</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mcqTopics.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: topic === t ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: topic === t ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: topic === t ? '600' : '400',
                    transition: 'all var(--transition)',
                    borderLeft: topic === t ? '2px solid var(--primary)' : 'none',
                    paddingLeft: topic === t ? '10px' : '12px'
                  }}
                >
                  {t} ({topicCounts[t]})
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: 20, marginBottom: 14, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.5px' }}>Difficulty</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mcqDifficulties.map(d => (
                <button
                  key={d}
                  onClick={() => setDiff(d)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: diff === d ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    color: diff === d ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    fontWeight: diff === d ? '600' : '400',
                    transition: 'all var(--transition)',
                    borderLeft: diff === d ? '2px solid var(--primary)' : 'none',
                    paddingLeft: diff === d ? '10px' : '12px'
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Search Bar */}
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color var(--transition)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* MCQ List */}
          {loading ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {[...Array(5)].map((_, i) => <QuestionSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
              <p>No MCQs found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filtered.map(q => {
                const isAttempted = Object.hasOwn(answers, q.id);
                const selectedAnswer = answers[q.id];
                const isCorrect = isAttempted && selectedAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    style={{
                      background: 'var(--bg-card)',
                      border: `1px solid ${isAttempted ? (isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)') : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: 12,
                        alignItems: 'start',
                        color: 'inherit'
                      }}
                    >
                      {/* Status Icon */}
                      <div style={{ marginTop: 2 }}>
                        {isAttempted ? (
                          <CheckCircle size={18} style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }} />
                        ) : (
                          <Circle size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>

                      {/* Question Text & Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: 'var(--primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {q.topic}
                          </span>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            background: q.difficulty === 'Easy' ? 'rgba(16, 185, 129, 0.1)' : q.difficulty === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: q.difficulty === 'Easy' ? 'var(--success)' : q.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)'
                          }}>
                            {q.difficulty}
                          </span>
                        </div>
                        <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: '500', marginBottom: 4 }}>
                          {q.question}
                        </p>
                        {isAttempted && (
                          <p style={{
                            color: isCorrect ? 'var(--success)' : 'var(--danger)',
                            fontSize: '0.85rem'
                          }}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'} • Answer: {q.options[selectedAnswer]}
                          </p>
                        )}
                      </div>

                      {/* Expand Icon */}
                      {expanded === q.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {/* Expanded Options */}
                    {expanded === q.id && (
                      <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px' }}>
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 12, fontWeight: '500' }}>Select your answer:</p>
                          <div style={{ display: 'grid', gap: 10 }}>
                            {q.options.map((opt, idx) => {
                              const isSelected = selectedAnswer === idx;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleAnswerSubmit(q.id, idx)}
                                  style={{
                                    padding: '12px 16px',
                                    background: isSelected ? (isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)') : 'rgba(255, 255, 255, 0.03)',
                                    border: `1px solid ${isSelected ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--border)'}`,
                                    borderRadius: 'var(--radius-sm)',
                                    color: isSelected ? (isCorrect ? 'var(--success)' : 'var(--danger)') : 'var(--text-primary)',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    textAlign: 'left',
                                    transition: 'all var(--transition)',
                                    fontWeight: isSelected ? '500' : '400'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                                  }}
                                >
                                  <span style={{ display: 'inline-block', marginRight: 10, fontWeight: '600' }}>
                                    {String.fromCharCode(65 + idx)}.
                                  </span>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation */}
                        <div style={{ background: 'rgba(139, 92, 246, 0.08)', border: '1px solid rgba(139, 92, 246, 0.15)', borderRadius: 'var(--radius-sm)', padding: 12 }}>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6, fontWeight: '600' }}>💡 Explanation</p>
                          <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && Object.keys(answers).length > 0 && (
            <div style={{ marginTop: 24, padding: '20px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.08))', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-primary)', marginBottom: 8 }}>Your Score</p>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, var(--primary), var(--accent))', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {correctCount} / {Object.keys(answers).length}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
                Accuracy: {Math.round((correctCount / Object.keys(answers).length) * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
