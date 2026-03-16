import { useState } from 'react';
import { companyQuestions } from '../data/companyQuestions.js';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyWise() {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const company = selected ? companyQuestions.find(c => c.id === selected) : null;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">Company-Wise Questions</h1>
        <p className="section-sub">Explore frequently asked questions from top companies</p>
      </div>

      {/* Company grid */}
      <div className="company-grid">
        {companyQuestions.map(c => (
          <div key={c.id} className={`company-card ${selected === c.id ? 'selected' : ''}`} onClick={() => { setSelected(selected === c.id ? null : c.id); setExpanded(null); }}>
            <div className="company-logo">{c.logo}</div>
            <div className="company-name" style={{ color: selected === c.id ? c.color : undefined }}>{c.name}</div>
            <div className="company-count">{c.count} questions</div>
          </div>
        ))}
      </div>

      {/* Questions for selected company */}
      {company && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: '2rem' }}>{company.logo}</span>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: company.color }}>{company.name} Questions</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{company.questions.length} questions</p>
            </div>
          </div>

          {company.questions.map((q, i) => {
            const isOpen = expanded === i;
            return (
              <div key={i} className="question-card">
                <div className="question-header" onClick={() => setExpanded(isOpen ? null : i)}>
                  <span className="question-text">{q.q}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <span className="badge badge-primary">{q.topic}</span>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                    {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>
                {isOpen && (
                  <div className="question-body">
                    <div className="answer-box">{q.answer}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!selected && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🏢</div>
          <p>Select a company above to view their commonly asked questions.</p>
        </div>
      )}
    </div>
  );
}
