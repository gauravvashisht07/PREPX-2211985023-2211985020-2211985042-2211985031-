import { useState } from 'react';
import { analyzeResume } from '../utils/aiResumeFeedback.js';
import { Brain, Loader2, AlertTriangle, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AIResumeFeedbackPanel
 * Embeds a one-click AI Resume Analyzer panel inside the Resume Studio page.
 * Props: resumeData (object from ResumeBuilder state)
 */
export default function AIResumeFeedbackPanel({ resumeData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setResult(null);

    // Short delay for perceived AI "thinking" time
    setTimeout(() => {
      setResult(analyzeResume(resumeData));
      setLoading(false);
    }, 800);
  };

  // Score color band
  const scoreColor = result
    ? result.overallScore >= 75 ? '#10b981'
    : result.overallScore >= 50 ? '#f59e0b'
    : '#ef4444'
    : 'var(--primary)';

  return (
    <div style={{ marginTop: '24px' }}>
      <button
        onClick={() => { setOpen(v => !v); setResult(null); }}
        className="btn btn-secondary btn-glow"
        style={{ borderRadius: '12px', gap: '8px' }}
      >
        <Brain size={18} />
        {open ? 'Close AI Analyzer' : 'Analyze Resume with AI'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden', marginTop: '20px' }}
          >
            <div className="glass" style={{ padding: '28px', borderRadius: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Brain size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Resume Intelligence Report</h3>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.6 }}>
                Our AI analyzes your resume for completeness, ATS compatibility, and section quality. Click Analyze to get a detailed report.
              </p>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="btn btn-primary"
                style={{ borderRadius: '10px', marginBottom: result ? '28px' : '0' }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><TrendingUp size={16} /> Run Analysis</>}
              </button>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Overall Score */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '28px', padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px' }}>
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: '2.8rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{result.overallScore}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>/ 100</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
                          {result.overallScore >= 75 ? '✅ Resume is strong and interview-ready.' : result.overallScore >= 50 ? '⚠️ Resume needs key improvements.' : '❌ Resume requires significant work.'}
                        </div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.overallScore}%` }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            style={{ height: '100%', background: `linear-gradient(to right, ${scoreColor}, ${scoreColor}88)` }}
                          />
                        </div>
                        <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ATS Compatibility Score</div>
                      </div>
                    </div>

                    {/* Section breakdown */}
                    <div style={{ marginBottom: '24px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Section Analysis</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {result.sections.map((sec, i) => (
                          <div key={i}>
                            {sec.score !== undefined ? (
                              // Scored section
                              <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{sec.label}</span>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: sec.score / sec.max >= 0.7 ? '#10b981' : '#f59e0b' }}>{sec.score}/{sec.max}</span>
                                </div>
                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px' }}>
                                  <div style={{ height: '100%', width: `${(sec.score / sec.max) * 100}%`, background: sec.score / sec.max >= 0.7 ? '#10b981' : '#f59e0b', transition: '1s' }} />
                                </div>
                                {sec.issues?.length > 0 && (
                                  <div style={{ marginTop: '8px' }}>
                                    {sec.issues.map((issue, j) => (
                                      <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                        <AlertTriangle size={13} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        {issue}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Status note section
                              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.85rem', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                                {sec.status === 'good'
                                  ? <CheckCircle size={15} color="#10b981" />
                                  : sec.status === 'warning'
                                  ? <AlertTriangle size={15} color="#f59e0b" />
                                  : <AlertTriangle size={15} color="#ef4444" />}
                                <span style={{ color: 'var(--text-secondary)' }}>{sec.note}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Improvement Tips */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
                        <Lightbulb size={14} /> Improvement Roadmap
                      </div>
                      <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {result.tips.map((tip, i) => (
                          <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <span style={{ color: '#f59e0b', fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>
                            {tip}
                          </div>
                        ))}
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
