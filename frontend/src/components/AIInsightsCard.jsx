import { useMemo } from 'react';
import { generateInsights } from '../utils/aiInsights.js';
import { Brain, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * AIInsightsCard
 * Dashboard card that renders personalized AI suggestions based on user progress.
 * Props: progress (object from /api/progress API)
 */
export default function AIInsightsCard({ progress }) {
  // Memoize so insights only recompute when progress changes
  const { insights, priority } = useMemo(() => generateInsights(progress), [progress]);

  const borderColor = priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981';
  const badgeLabel = priority === 'high' ? 'Action Required' : priority === 'medium' ? 'Active' : 'On Track';
  const badgeBg = priority === 'high' ? 'rgba(239,68,68,0.1)' : priority === 'medium' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass"
      style={{ padding: '28px', borderLeft: `4px solid ${borderColor}` }}
    >
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(124,58,237,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={20} color="var(--primary)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2px' }}>AI Insights</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Personalized study plan</p>
          </div>
        </div>

        <span style={{ background: badgeBg, color: borderColor, border: `1px solid ${borderColor}30`, padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {badgeLabel}
        </span>
      </div>

      {/* Insight items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: '12px 14px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              border: '1px solid var(--border)',
            }}
          >
            {insight}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <Link
        to="/progress"
        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent)', textDecoration: 'none' }}
      >
        <Sparkles size={14} /> View Full Analytics <ChevronRight size={14} />
      </Link>
    </motion.div>
  );
}
