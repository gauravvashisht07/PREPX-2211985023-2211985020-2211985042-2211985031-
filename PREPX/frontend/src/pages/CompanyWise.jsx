import { useState } from 'react';
import { companyQuestions } from '../data/companyQuestions.js';
import { ChevronDown, ChevronUp, Building2, Target, Zap, Globe, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function CompanyWise() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const company = selected ? companyQuestions.find(c => c.id === selected) : null;

  return (
    <div className="animate-fade-up">
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Industrial Intelligence</h1>
        <p className="section-sub">Targeted preparation modules curated from tier-1 engineering organizations.</p>
      </div>

      <motion.div 
        className="company-grid" 
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginBottom: '48px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {companyQuestions.map(c => (
          <motion.div 
            key={c.id} 
            variants={itemVariants}
            className={`glass-strong ${selected === c.id ? 'active' : ''}`} 
            onClick={() => { setSelected(selected === c.id ? null : c.id); setExpanded(null); }}
            style={{ 
                padding: '24px', cursor: 'pointer', transition: '0.3s', textAlign: 'center',
                border: selected === c.id ? `2px solid ${c.color || 'var(--primary)'}` : '1px solid var(--border)',
                background: selected === c.id ? `${c.color || 'var(--primary)'}11` : 'rgba(255,255,255,0.02)',
                boxShadow: selected === c.id ? `0 15px 40px -10px ${c.color || 'var(--primary)'}33` : 'none',
                position: 'relative', overflow: 'hidden'
            }}
          >
            {selected === c.id && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: c.color || 'var(--primary)' }} />
            )}
            <div style={{ fontSize: '3rem', marginBottom: '16px', display: 'block', height: '60px' }}>{c.logo}</div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: selected === c.id ? 'var(--text-primary)' : 'var(--text-secondary)', marginBottom: '4px' }}>{c.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Target size={12} /> {c.count} Question Protocol
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {company ? (
          <motion.div 
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-32"
          >
            <div className="glass-strong" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', background: `${company.color}08` }}>
              <div style={{ fontSize: '4rem' }}>{company.logo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{company.name} <span className="gradient-text">Studio</span></h2>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Verified Modules</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Accelerated preparation path for {company.name} technical assessments.</p>
              </div>
              <div className="hidden lg:flex" style={{ gap: '24px' }}>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>84%</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>RELEVANCE</div>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{company.count}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>MODULES</div>
                 </div>
              </div>
            </div>

            <div className="flex flex-col gap-12">
              {company.questions.map((q, i) => {
                const isOpen = expanded === i;
                return (
                  <div key={i} className="glass" style={{ padding: 0, overflow: 'hidden' }}>
                    <div 
                        className="question-header" 
                        onClick={() => setExpanded(isOpen ? null : i)}
                        style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px' }}
                    >
                      <span style={{ flex: 1, fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{q.q}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{q.topic}</span>
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s', color: 'var(--text-muted)' }}>
                            <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 24px 24px 64px' }}>
                             <div style={{ height: '1px', background: 'var(--border)', marginBottom: '20px' }} />
                             <div className="glass-strong" style={{ padding: '24px', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', marginBottom: '12px' }}>
                                    <Cpu size={14} /> Logic Framework
                                </div>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{q.answer}</p>
                             </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text-muted)' }}>
            <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto 24px' }}>
                <div style={{ width: '80px', height: '80px', background: 'var(--primary)', filter: 'blur(30px)', opacity: 0.2, position: 'absolute' }} />
                <Building2 size={60} color="var(--text-muted)" style={{ position: 'relative' }} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>Module Select Inactive</h3>
            <p>Initiate industrial analysis by selecting an organization above.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
