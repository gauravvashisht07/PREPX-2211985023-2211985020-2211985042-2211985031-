import { useState } from 'react';
import { notes } from '../data/notes.js';
import { roadmaps } from '../data/roadmaps.js';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

function NotesTab() {
  const [openTopic, setOpenTopic] = useState(0);
  const [openSub, setOpenSub] = useState(null);

  return (
    <div>
      {/* Topic tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {notes.map((n, i) => (
          <button key={n.topic} className={`filter-chip ${openTopic === i ? 'active' : ''}`} onClick={() => { setOpenTopic(i); setOpenSub(null); }}>
            {n.icon} {n.topic}
          </button>
        ))}
      </div>

      {/* Subtopic cards */}
      {notes[openTopic]?.subtopics.map((s, i) => (
        <div key={s.title} className="note-card">
          <div className="note-card-header" onClick={() => setOpenSub(openSub === i ? null : i)}>
            <span className="note-topic">{s.title}</span>
            {openSub === i ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
          </div>
          {openSub === i && (
            <div className="note-content">
              <ul>{s.points.map((p, j) => <li key={j}>{p}</li>)}</ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function RoadmapTab() {
  const [selRm, setSelRm] = useState('dsa');
  const rm = roadmaps.find(r => r.id === selRm);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {roadmaps.map(r => (
          <button key={r.id} className={`filter-chip ${selRm === r.id ? 'active' : ''}`} onClick={() => setSelRm(r.id)}>
            {r.icon} {r.title}
          </button>
        ))}
      </div>

      {rm && (
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: 24, color: rm.color }}>{rm.icon} {rm.title}</h2>
          {rm.steps.map((s, i) => (
            <div key={i} className="roadmap-step">
              <div className="roadmap-line">
                <div className="roadmap-dot" style={{ background: rm.color, boxShadow: `0 0 10px ${rm.color}66` }} />
                {i < rm.steps.length - 1 && <div className="roadmap-connector" style={{ background: `linear-gradient(180deg, ${rm.color}44, transparent)` }} />}
              </div>
              <div className="roadmap-content">
                <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 4 }}>
                  <div className="roadmap-title">{s.title}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Weeks {s.weeks}</span>
                </div>
                <div className="roadmap-desc">{s.desc}</div>
                <div className="roadmap-resources">
                  {s.resources.map(r => <span key={r} className="roadmap-resource">{r}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Notes() {
  const [tab, setTab] = useState('notes');

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">Notes & Roadmap</h1>
        <p className="section-sub">Quick revision notes and structured learning paths</p>
      </div>

      <div className="notes-tabs">
        <button className={`notes-tab ${tab === 'notes' ? 'active' : ''}`} onClick={() => setTab('notes')}>📝 Quick Notes</button>
        <button className={`notes-tab ${tab === 'roadmap' ? 'active' : ''}`} onClick={() => setTab('roadmap')}><MapPin size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> Roadmaps</button>
      </div>

      {tab === 'notes' ? <NotesTab /> : <RoadmapTab />}
    </div>
  );
}
