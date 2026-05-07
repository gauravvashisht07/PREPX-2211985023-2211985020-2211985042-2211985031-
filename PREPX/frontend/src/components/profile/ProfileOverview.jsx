import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Cpu, Target, Award, Rocket, CheckCircle, Code } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileOverview({ stats }) {
  const { user } = useAuth();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
      <div className="flex flex-col gap-24">
        <div className="glass" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code size={20} color="var(--primary)" /> Professional Context
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
             <div className="glass-strong" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Target Domain</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.targetRole || 'Full Stack Developer'}</div>
             </div>
             <div className="glass-strong" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Experience Tier</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.skillLevel || 'Intermediate'}</div>
             </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '32px' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Rocket size={20} color="var(--accent)" /> Achievement Milestones
             </h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[
                    { label: 'Consistent Learner', unlocked: stats?.streak >= 3 },
                    { label: 'DSA Specialist', unlocked: stats?.solvedQuestions >= 20 },
                    { label: 'Interview Ready', unlocked: stats?.mockSessionsCount >= 1 },
                    { label: 'Precision Master', unlocked: stats?.accuracy >= 80 },
                    { label: 'Daily Champion', unlocked: stats?.streak >= 7 },
                ].map((badge, i) => (
                    <motion.div 
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="glass" 
                        style={{ 
                            padding: '12px 20px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '10px',
                            background: badge.unlocked ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.02)',
                            border: badge.unlocked ? '1px solid var(--primary)' : '1px solid var(--border)',
                            opacity: badge.unlocked ? 1 : 0.4,
                            filter: badge.unlocked ? 'none' : 'grayscale(1)'
                        }}
                    >
                        <Award size={18} color={badge.unlocked ? 'var(--primary)' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{badge.label}</span>
                    </motion.div>
                ))}
             </div>
        </div>
      </div>

      <aside className="flex flex-col gap-24">
        <div className="glass-strong" style={{ padding: '28px', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Target size={20} color="var(--accent)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Next Blueprint</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
                You're on track to master the <strong>Backend Architecture</strong> track. Solving 5 more Node.js questions will unlock the next tier.
            </p>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ height: '100%', background: 'var(--accent)' }} />
            </div>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '16px' }}>Contribution Heatmap</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px' }}>
                {Array.from({ length: 28 }).map((_, i) => (
                    <div 
                        key={i} 
                        style={{ 
                            aspectRatio: '1', 
                            borderRadius: '3px', 
                            background: i % 4 === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            opacity: i % 4 === 0 ? Math.random() * 0.8 + 0.2 : 1
                        }} 
                    />
                ))}
            </div>
            <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last 4 weeks</div>
        </div>
      </aside>
    </div>
  );
}
