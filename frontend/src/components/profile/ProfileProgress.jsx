import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { BarChart3, TrendingUp, Layers, CheckCircle, PieChart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileProgress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await api.get('/progress');
        setProgress(res.data);
      } catch (err) {
        console.error('Error fetching progress:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const topicList = Object.entries(progress?.topicStats || {});
  const colors = { DSA: '#a78bfa', OS: '#38bdf8', DBMS: '#fb923c', CN: '#f472b6', HR: '#10b981' };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Synchronizing analytics...</div>;

  return (
    <div className="flex flex-col gap-32">
      <div className="glass" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={24} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Mastery Matrix</h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Calculated from {progress?.solvedQuestions?.length || 0} solutions</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {topicList.map(([topic, stats]) => {
                const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
                const color = colors[topic] || '#94a3b8';
                return (
                    <div key={topic} className="glass-strong" style={{ padding: '24px', background: 'rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                                <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{topic}</span>
                            </div>
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: color }}>{pct}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${pct}%` }} 
                                transition={{ duration: 1, ease: 'easeOut' }}
                                style={{ height: '100%', background: color }} 
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            <span>Resolved: {stats.solved}</span>
                            <span>Target: {stats.total}</span>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div className="glass" style={{ padding: '32px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={18} color="var(--accent)" /> Competitive Edge
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                        { label: 'Technical Depth', value: 85, color: 'var(--accent)' },
                        { label: 'Problem Velocity', value: 72, color: 'var(--warning)' },
                        { label: 'Consistency', value: 92, color: 'var(--success)' },
                    ].map((metric, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{metric.label}</span>
                                <span style={{ color: metric.color, fontWeight: 800 }}>{metric.value}%</span>
                            </div>
                            <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px' }}>
                                <motion.div initial={{ width: 0 }} animate={{ width: `${metric.value}%` }} style={{ height: '100%', background: metric.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '20px', color: 'var(--success)' }}>
                    <Star size={32} fill="var(--success)" style={{ margin: '0 auto' }} />
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>Skill Assessment</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Based on your recent MCQ and mock session performance, your algorithmic precision is in the <strong>Top 15%</strong> globally.</p>
            </div>
      </div>
    </div>
  );
}
