import { useState } from 'react';
import { notes } from '../data/notes.js';
import { roadmaps } from '../data/roadmaps.js';
import { ChevronDown, ChevronUp, MapPin, BookOpen, Clock, Layers, Target, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function NotesTab() {
  const [openTopic, setOpenTopic] = useState(0);
  const [openSub, setOpenSub] = useState(0);

  return (
    <div className="flex flex-col gap-32">
      {/* Topic tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {notes.map((n, i) => (
          <button 
            key={n.topic} 
            className={`btn ${openTopic === i ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => { setOpenTopic(i); setOpenSub(0); }}
            style={{ padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem' }}
          >
            {n.icon} {n.topic}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '32px' }}>
          <aside className="flex flex-col gap-12">
            {notes[openTopic]?.subtopics.map((s, i) => (
                <button 
                    key={s.title} 
                    onClick={() => setOpenSub(i)}
                    className={`glass ${openSub === i ? 'active' : ''}`}
                    style={{ 
                        padding: '16px 20px', border: 'none', textAlign: 'left', cursor: 'pointer', transition: '0.3s',
                        background: openSub === i ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.02)',
                        borderLeft: openSub === i ? '4px solid var(--accent)' : '4px solid transparent',
                        color: openSub === i ? 'var(--text-primary)' : 'var(--text-muted)',
                        fontWeight: openSub === i ? 700 : 500, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                >
                    {s.title}
                    {openSub === i && <ChevronDown size={16} color="var(--accent)" style={{ transform: 'rotate(-90deg)' }} />}
                </button>
            ))}
          </aside>

          <main>
            <AnimatePresence mode="wait">
                <motion.div 
                    key={`${openTopic}-${openSub}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-strong" style={{ padding: '40px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                        <div className="feature-icon-wrapper" style={{ margin: 0, width: '36px', height: '36px', color: 'var(--accent)' }}>
                            <BookOpen size={18} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{notes[openTopic]?.subtopics[openSub]?.title}</h2>
                    </div>

                    <div className="flex flex-col gap-16">
                        {notes[openTopic]?.subtopics[openSub]?.points.map((p, j) => (
                            <div key={j} className="glass" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'start', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: '2px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#fff', margin: '0 auto' }}>{j+1}</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{p}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
          </main>
      </div>
    </div>
  );
}

function RoadmapTab() {
  const [selRm, setSelRm] = useState('dsa');
  const rm = roadmaps.find(r => r.id === selRm);

  return (
    <div className="flex flex-col gap-40">
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {roadmaps.map(r => (
          <button 
            key={r.id} 
            className={`btn ${selRm === r.id ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => setSelRm(r.id)}
            style={{ padding: '12px 24px', borderRadius: '12px', fontSize: '0.9rem' }}
          >
            {r.icon} {r.title}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {rm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={rm.id}
          >
            <div className="glass-strong" style={{ padding: '40px', borderLeft: `6px solid ${rm.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ fontSize: '2.5rem' }}>{rm.icon}</div>
                    <div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{rm.title} <span className="gradient-text">Matrix</span></h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Automated progression path for {rm.title} technical mastery.</p>
                    </div>
                </div>

                <div className="flex flex-col gap-0">
                    {rm.steps.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ 
                                    width: '32px', height: '32px', borderRadius: '50%', background: rm.color, zIndex: 1,
                                    boxShadow: `0 0 20px ${rm.color}66`, display: 'flex', alignItems: 'center', justifyCenter: 'center'
                                }}>
                                    <CheckCircle2 size={16} color="#fff" style={{ margin: '0 auto' }} />
                                </div>
                                {i < rm.steps.length - 1 && (
                                    <div style={{ width: '2px', flex: 1, background: `linear-gradient(180deg, ${rm.color}, ${rm.color}11)` }} />
                                )}
                            </div>
                            <div style={{ paddingBottom: '40px', flex: 1 }}>
                                <div className="glass" style={{ padding: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{s.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                            <Clock size={14} /> WEEKS {s.weeks}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>{s.desc}</p>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {s.resources.map(r => (
                                            <span key={r} className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 800 }}>{r}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Notes() {
  const [tab, setTab] = useState('notes');

  return (
    <div className="animate-fade-up">
      <div className="section-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Matrix Intelligence</h1>
        <p className="section-sub">Synthesized knowledge protocols and structured engineering roadmaps.</p>
      </div>

      <div className="flex justify-center" style={{ marginBottom: '48px' }}>
          <div className="glass" style={{ padding: '6px', borderRadius: '14px', display: 'flex', gap: '4px' }}>
            <button 
                className={`notes-tab ${tab === 'notes' ? 'active' : ''}`} 
                onClick={() => setTab('notes')}
                style={{ 
                    padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: tab === 'notes' ? 'var(--primary)' : 'none',
                    color: tab === 'notes' ? '#fff' : 'var(--text-muted)',
                    fontWeight: 800, transition: '0.3s', fontSize: '0.9rem'
                }}
            >
                Knowledge Base
            </button>
            <button 
                className={`notes-tab ${tab === 'roadmap' ? 'active' : ''}`} 
                onClick={() => setTab('roadmap')}
                style={{ 
                    padding: '12px 32px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    background: tab === 'roadmap' ? 'var(--primary)' : 'none',
                    color: tab === 'roadmap' ? '#fff' : 'var(--text-muted)',
                    fontWeight: 800, transition: '0.3s', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '8px'
                }}
            >
                <MapPin size={16} /> Progression Matrix
            </button>
          </div>
      </div>

      <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'notes' ? <NotesTab /> : <RoadmapTab />}
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
