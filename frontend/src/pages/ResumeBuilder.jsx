import { useState, useEffect, useRef } from 'react';
import api from '../api/axios.js';
import { Save, Download, Plus, Trash2 } from 'lucide-react';

const defaultData = {
  personal: { name: '', role: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
  education: [{ institution: '', degree: '', field: '', startYear: '', endYear: '', cgpa: '' }],
  experience: [],
  projects: [{ title: '', tech: '', description: '', link: '' }],
  skills: [{ category: 'Technical Skills', items: '' }],
};

const STEPS = ['Personal', 'Education', 'Experience', 'Projects', 'Skills'];

export default function ResumeBuilder() {
  const [data, setData] = useState(defaultData);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    api.get('/resume').then(r => {
      const d = r.data;
      setData({
        personal: d.personal?.name ? d.personal : defaultData.personal,
        education: d.education?.length ? d.education : defaultData.education,
        experience: d.experience || [],
        projects: d.projects?.length ? d.projects : defaultData.projects,
        skills: d.skills?.length ? d.skills : defaultData.skills,
      });
    }).catch(() => {});
  }, []);

  const setP = (field, val) => setData(d => ({ ...d, personal: { ...d.personal, [field]: val } }));

  const setArr = (key, idx, field, val) => setData(d => {
    const arr = [...d[key]]; arr[idx] = { ...arr[idx], [field]: val }; return { ...d, [key]: arr };
  });

  const addItem = (key, template) => setData(d => ({ ...d, [key]: [...d[key], template] }));
  const removeItem = (key, idx) => setData(d => ({ ...d, [key]: d[key].filter((_, i) => i !== idx) }));

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/resume', data);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const exportPDF = async () => {
    const el = previewRef.current;
    if (!el) return;
    const html2pdf = (await import('html2pdf.js')).default;
    html2pdf().set({ margin: 0.4, filename: `${data.personal.name || 'resume'}.pdf`, jsPDF: { unit: 'in', format: 'a4' }, image: { type: 'jpeg', quality: 0.98 } }).from(el).save();
  };

  const inp = (lbl, val, onChange, type = 'text', ph = '') => (
    <div className="form-group">
      <label className="label">{lbl}</label>
      <input type={type} className="input" value={val} onChange={e => onChange(e.target.value)} placeholder={ph} />
    </div>
  );

  const p = data.personal;

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div><h1 className="section-title" style={{ marginBottom: 4 }}>Resume Builder</h1><p className="section-sub">Fill in your details and export as PDF</p></div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={save} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save'}
          </button>
          <button id="resume-export" className="btn btn-primary" onClick={exportPDF}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="resume-layout">
        {/* Form */}
        <div className="resume-form">
          <div className="step-tabs">
            {STEPS.map((s, i) => <button key={s} className={`step-tab ${step === i ? 'active' : ''}`} onClick={() => setStep(i)}>{s}</button>)}
          </div>

          {step === 0 && (
            <div className="glass" style={{ padding: 20 }}>
              <div className="form-row">{inp('Full Name', p.name, v => setP('name', v), 'text', 'Arjun Sharma')}{inp('Target Role', p.role, v => setP('role', v), 'text', 'Software Engineer')}</div>
              <div className="form-row">{inp('Email', p.email, v => setP('email', v), 'email', 'arjun@email.com')}{inp('Phone', p.phone, v => setP('phone', v), 'text', '+91-9876543210')}</div>
              <div className="form-row">{inp('Location', p.location, v => setP('location', v), 'text', 'Bangalore, India')}{inp('GitHub', p.github, v => setP('github', v), 'text', 'github.com/arjun')}</div>
              {inp('LinkedIn', p.linkedin, v => setP('linkedin', v), 'text', 'linkedin.com/in/arjun')}
              <div className="form-group"><label className="label">Professional Summary</label><textarea className="input textarea" value={p.summary} onChange={e => setP('summary', e.target.value)} placeholder="Passionate CS student with strong DSA and full-stack skills..." /></div>
            </div>
          )}

          {step === 1 && data.education.map((ed, i) => (
            <div key={i} className="glass" style={{ padding: 20, marginBottom: 12, position: 'relative' }}>
              {i > 0 && <button onClick={() => removeItem('education', i)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={15} /></button>}
              <div className="form-row">{inp('Institution', ed.institution, v => setArr('education', i, 'institution', v), 'text', 'IIT Bombay')}{inp('Degree', ed.degree, v => setArr('education', i, 'degree', v), 'text', 'B.Tech')}</div>
              <div className="form-row">{inp('Field/Branch', ed.field, v => setArr('education', i, 'field', v), 'text', 'Computer Science')}{inp('CGPA/%', ed.cgpa, v => setArr('education', i, 'cgpa', v), 'text', '8.5/10')}</div>
              <div className="form-row">{inp('Start Year', ed.startYear, v => setArr('education', i, 'startYear', v), 'text', '2021')}{inp('End Year', ed.endYear, v => setArr('education', i, 'endYear', v), 'text', '2025')}</div>
            </div>
          ))}
          {step === 1 && <button className="btn btn-ghost btn-sm" onClick={() => addItem('education', { institution: '', degree: '', field: '', startYear: '', endYear: '', cgpa: '' })}><Plus size={14} /> Add Education</button>}

          {step === 2 && data.experience.map((ex, i) => (
            <div key={i} className="glass" style={{ padding: 20, marginBottom: 12, position: 'relative' }}>
              <button onClick={() => removeItem('experience', i)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={15} /></button>
              <div className="form-row">{inp('Company', ex.company, v => setArr('experience', i, 'company', v), 'text', 'Google')}{inp('Role', ex.role, v => setArr('experience', i, 'role', v), 'text', 'SWE Intern')}</div>
              <div className="form-row">{inp('Start Date', ex.startDate, v => setArr('experience', i, 'startDate', v), 'text', 'May 2024')}{inp('End Date', ex.endDate, v => setArr('experience', i, 'endDate', v), 'text', 'Jul 2024')}</div>
              <div className="form-group"><label className="label">Description</label><textarea className="input textarea" style={{ minHeight: 70 }} value={ex.description} onChange={e => setArr('experience', i, 'description', e.target.value)} placeholder="• Built REST APIs using Spring Boot..." /></div>
            </div>
          ))}
          {step === 2 && <button className="btn btn-ghost btn-sm" onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })}><Plus size={14} /> Add Experience</button>}
          {step === 2 && data.experience.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.87rem', margin: '16px 0' }}>No experience yet — click Add to add internships or part-time work.</p>}

          {step === 3 && data.projects.map((pr, i) => (
            <div key={i} className="glass" style={{ padding: 20, marginBottom: 12, position: 'relative' }}>
              {i > 0 && <button onClick={() => removeItem('projects', i)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={15} /></button>}
              <div className="form-row">{inp('Project Title', pr.title, v => setArr('projects', i, 'title', v), 'text', 'E-Commerce App')}{inp('Tech Stack', pr.tech, v => setArr('projects', i, 'tech', v), 'text', 'React, Node.js, MongoDB')}</div>
              {inp('GitHub/Live Link', pr.link, v => setArr('projects', i, 'link', v), 'text', 'github.com/arjun/project')}
              <div className="form-group"><label className="label">Description</label><textarea className="input textarea" style={{ minHeight: 70 }} value={pr.description} onChange={e => setArr('projects', i, 'description', e.target.value)} placeholder="• Built a full-stack e-commerce platform with 1000+ products..." /></div>
            </div>
          ))}
          {step === 3 && <button className="btn btn-ghost btn-sm" onClick={() => addItem('projects', { title: '', tech: '', description: '', link: '' })}><Plus size={14} /> Add Project</button>}

          {step === 4 && data.skills.map((sk, i) => (
            <div key={i} className="glass" style={{ padding: 20, marginBottom: 12, position: 'relative' }}>
              {i > 0 && <button onClick={() => removeItem('skills', i)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={15} /></button>}
              {inp('Category', sk.category, v => setArr('skills', i, 'category', v), 'text', 'Technical Skills')}
              {inp('Skills (comma separated)', sk.items, v => setArr('skills', i, 'items', v), 'text', 'Java, Python, React, Node.js, SQL')}
            </div>
          ))}
          {step === 4 && <button className="btn btn-ghost btn-sm" onClick={() => addItem('skills', { category: '', items: '' })}><Plus size={14} /> Add Skill Section</button>}
        </div>

        {/* Live Preview */}
        <div style={{ overflow: 'auto' }}>
          <div ref={previewRef} className="resume-preview" id="resume-preview">
            <div className="rv-name">{p.name || 'Your Name'}</div>
            {p.role && <div className="rv-role">{p.role}</div>}
            <div className="rv-contact">
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>📞 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
              {p.github && <span>💻 {p.github}</span>}
            </div>

            {p.summary && <><div className="rv-section-title">Summary</div><p style={{ fontSize: '0.83rem', color: '#475569', marginBottom: 14, lineHeight: 1.6 }}>{p.summary}</p></>}

            {data.education.some(e => e.institution) && <>
              <div className="rv-section-title">Education</div>
              {data.education.filter(e => e.institution).map((e, i) => (
                <div key={i} className="rv-entry">
                  <div className="rv-entry-top"><span className="rv-entry-title">{e.institution}</span><span className="rv-entry-date">{e.startYear}{e.endYear ? ` – ${e.endYear}` : ''}</span></div>
                  <div className="rv-entry-sub">{e.degree}{e.field ? `, ${e.field}` : ''}{e.cgpa ? ` | CGPA: ${e.cgpa}` : ''}</div>
                </div>
              ))}
            </>}

            {data.experience.some(e => e.company) && <>
              <div className="rv-section-title">Experience</div>
              {data.experience.filter(e => e.company).map((e, i) => (
                <div key={i} className="rv-entry">
                  <div className="rv-entry-top"><span className="rv-entry-title">{e.role}</span><span className="rv-entry-date">{e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}</span></div>
                  <div className="rv-entry-sub">{e.company}</div>
                  {e.description && <div className="rv-entry-desc" style={{ whiteSpace: 'pre-line' }}>{e.description}</div>}
                </div>
              ))}
            </>}

            {data.projects.some(p => p.title) && <>
              <div className="rv-section-title">Projects</div>
              {data.projects.filter(p => p.title).map((pr, i) => (
                <div key={i} className="rv-entry">
                  <div className="rv-entry-top"><span className="rv-entry-title">{pr.title}</span>{pr.link && <span className="rv-entry-date" style={{ color: '#6d28d9' }}>{pr.link}</span>}</div>
                  {pr.tech && <div className="rv-entry-sub">Tech: {pr.tech}</div>}
                  {pr.description && <div className="rv-entry-desc" style={{ whiteSpace: 'pre-line' }}>{pr.description}</div>}
                </div>
              ))}
            </>}

            {data.skills.some(s => s.items) && <>
              <div className="rv-section-title">Skills</div>
              {data.skills.filter(s => s.items).map((sk, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  {sk.category && <div className="rv-entry-sub" style={{ fontWeight: 600, marginBottom: 4 }}>{sk.category}</div>}
                  <div className="rv-skills">
                    {sk.items.split(',').map(s => s.trim()).filter(Boolean).map(s => <span key={s} className="rv-skill">{s}</span>)}
                  </div>
                </div>
              ))}
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}
