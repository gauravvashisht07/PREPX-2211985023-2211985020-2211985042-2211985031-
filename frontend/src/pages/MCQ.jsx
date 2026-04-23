import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mcqQuestions, mcqTopics, mcqDifficulties } from '../data/mcqQuestions.js';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { QuestionSkeleton } from '../components/Skeleton.jsx';
import { ChevronDown, CheckCircle, Circle, Search, Filter, Target, BarChart3, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MCQ() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState(() => sessionStorage.getItem('mcq_topic') || 'All');
  const [diff, setDiff] = useState(() => sessionStorage.getItem('mcq_diff') || 'All');
  const [search, setSearch] = useState(() => sessionStorage.getItem('mcq_search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('mcq_topic', topic);
    sessionStorage.setItem('mcq_diff', diff);
    sessionStorage.setItem('mcq_search', search);
  }, [topic, diff, search]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch MCQ progress
  const { data: mcqData, isLoading: loading } = useQuery({
    queryKey: ['mcqProgress'],
    queryFn: async () => {
      const r = await api.get('/mcq');
      const answersMap = {};
      Object.entries(r.data.answers || {}).forEach(([key, value]) => {
        answersMap[parseInt(key)] = value;
      });
      return { 
        attempted: r.data.attemptedQuestions || [], 
        answers: answersMap 
      };
    },
    staleTime: 2 * 60 * 1000,
  });

  const attempted = mcqData?.attempted || [];
  const answers = mcqData?.answers || {};

  // Mutation for submitting answers
  const { mutate: submitAnswer, isPending: submittingId } = useMutation({
    mutationFn: async ({ questionId, selectedOption, topic, isCorrect }) => {
      const res = await api.post('/mcq/answer', { questionId, selectedOption, topic, isCorrect });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['mcqProgress'], (old) => {
        const newAnswers = { ...old.answers };
        newAnswers[variables.questionId] = variables.selectedOption;
        return {
          ...old,
          attempted: data.attemptedQuestions || [],
          answers: newAnswers
        };
      });
      // Also invalidate progress to keep Dashboard updated
      queryClient.invalidateQueries({ queryKey: ['userProgress'] });

      const isAlreadyAnswered = Object.hasOwn(answers, variables.questionId);
      if (!isAlreadyAnswered) {
        if (variables.isCorrect) toast.success('Correct answer! 🎉');
        else toast.error(`Incorrect choice`);
      } else {
        toast.info('Answer updated');
      }
    },
    onError: () => toast.error('Submission failed'),
  });

  const filtered = mcqQuestions.filter(q =>
    (topic === 'All' || q.topic === topic) &&
    (diff === 'All' || q.difficulty === diff) &&
    (debouncedSearch === '' || q.question.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

  const handleAnswerSubmit = (questionId, selectedOption) => {
    if (submittingId === questionId) return;
    const question = mcqQuestions.find(q => q.id === questionId);
    const isCorrect = selectedOption === question.correctAnswer;
    
    submitAnswer({ questionId, selectedOption, topic: question.topic, isCorrect });
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
                aria-label="Search MCQ questions"
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
                    aria-pressed={topic === t}
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
                                                disabled={submittingId}
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
