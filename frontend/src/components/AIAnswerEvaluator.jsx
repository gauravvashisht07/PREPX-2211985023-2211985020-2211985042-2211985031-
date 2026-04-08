import { useState } from 'react';
import api from '../api/axios.js';
import { Brain, Loader2, Star, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AIAnswerEvaluator
 *
 * Props:
 *   question      {string}  - The interview question text
 *   correctAnswer {string}  - The reference/model answer from the question bank
 *
 * Sends { question, userAnswer, correctAnswer } to POST /api/ai/evaluate
 * and displays score (0–10), feedback, and improvement suggestions.
 */
export default function AIAnswerEvaluator({ question, correctAnswer }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');

    try {
      const { data } = await api.post('/ai/evaluate', {
        question,
        userAnswer,
        correctAnswer,
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Evaluation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Color band based on score
  const scoreColor = result
    ? result.score >= 8 ? '#10b981'    // green  → excellent
    : result.score >= 5 ? '#f59e0b'    // amber  → good
    : '#ef4444'                         // red    → weak
    : 'var(--primary)';

  const scoreLabel = result
    ? result.score >= 8 ? 'Excellent'
    : result.score >= 5 ? 'Good'
    : 'Needs Work'
    : '';

  return (
    <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>

      {/* ── Toggle button ── */}
      <button
        onClick={() => { setOpen(v => !v); setResult(null); setUserAnswer(''); setError(''); }}
        className="btn btn-secondary"
        style={{ borderRadius: '10px', fontSize: '0.82rem', gap: '8px', padding: '8px 16px' }}
      >
        <Brain size={16} />
        {open ? 'Close AI Evaluator' : 'Evaluate with AI'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="evaluator-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ marginTop: '16px' }}>

              {/* ── Answer input ── */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontSize: '0.75rem', fontWeight: 700,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px',
                }}>
                  Your Answer
                </label>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Write your answer here — include definitions, examples, and complexity where relevant."
                  rows={5}
                  style={{
                    width: '100%', padding: '14px',
                    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                    borderRadius: '12px', color: 'white', fontFamily: 'inherit',
                    fontSize: '0.9rem', resize: 'vertical', outline: 'none',
                    transition: 'border-color 0.2s', lineHeight: 1.6,
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: wordCount < 30 ? '#ef4444' : 'var(--text-muted)' }}>
                    {wordCount < 30 ? `${wordCount} words — aim for 30+` : `${wordCount} words ✓`}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Evaluated against model answer
                  </span>
                </div>
              </div>

              {/* ── Submit button ── */}
              <button
                onClick={handleEvaluate}
                disabled={loading || !userAnswer.trim()}
                className="btn btn-primary"
                style={{ borderRadius: '10px', fontSize: '0.88rem', padding: '10px 24px' }}
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Evaluating...</>
                  : <><Brain size={16} /> Evaluate Answer</>}
              </button>

              {/* ── Error state ── */}
              {error && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', color: '#ef4444', fontSize: '0.85rem', background: 'rgba(239,68,68,0.07)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              {/* ── Result card ── */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    key="result-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.4 }}
                    className="glass-strong"
                    style={{
                      marginTop: '20px', padding: '24px',
                      borderRadius: '16px', borderLeft: `4px solid ${scoreColor}`,
                    }}
                  >
                    {/* Score display */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: '2.4rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                          {result.score}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>/10</div>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI Evaluation Score</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: scoreColor,
                            background: `${scoreColor}15`, padding: '3px 10px', borderRadius: '99px',
                            border: `1px solid ${scoreColor}30`,
                          }}>
                            {scoreLabel}
                          </span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.score * 10}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            style={{ height: '100%', background: scoreColor, borderRadius: '4px' }}
                          />
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Based on keyword match, phrase similarity, length, and structure
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.73rem',
                        fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase',
                        marginBottom: '10px', letterSpacing: '0.5px',
                      }}>
                        <CheckCircle size={14} /> Detailed Feedback
                      </div>
                      <div style={{
                        background: 'rgba(0,0,0,0.2)', padding: '14px', borderRadius: '10px',
                        fontSize: '0.87rem', lineHeight: 2, whiteSpace: 'pre-line',
                        color: 'var(--text-secondary)',
                      }}>
                        {result.feedback}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.73rem',
                        fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase',
                        marginBottom: '10px', letterSpacing: '0.5px',
                      }}>
                        <Lightbulb size={14} /> How to Improve
                      </div>
                      <div style={{
                        background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)',
                        padding: '14px', borderRadius: '10px', fontSize: '0.87rem',
                        lineHeight: 1.9, whiteSpace: 'pre-line', color: 'var(--text-secondary)',
                      }}>
                        {result.suggestions}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
