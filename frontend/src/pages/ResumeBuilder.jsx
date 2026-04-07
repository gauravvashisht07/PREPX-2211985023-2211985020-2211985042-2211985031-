import { useState, useEffect, useRef } from 'react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { Save, Download, Plus, Trash2, User, GraduationCap, Briefcase, Code2, Tags, ChevronRight, ChevronLeft, FileText, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultData = {
  personal: { name: '', role: '', email: '', phone: '', location: '', linkedin: '', github: '', summary: '' },
  education: [{ institution: '', degree: '', field: '', startYear: '', endYear: '', cgpa: '' }],
  experience: [],
  projects: [{ title: '', tech: '', description: '', link: '' }],
  skills: [{ category: 'Technical Skills', items: '' }],
};

const STEPS = [
  { id: 'personal', label: 'Identity', icon: User },
  { id: 'education', label: 'Academic', icon: GraduationCap },
  { id: 'experience', label: 'Industrial', icon: Briefcase },
  { id: 'projects', label: 'Portfolio', icon: Code2 },
  { id: 'skills', label: 'Expertise', icon: Tags },
];

export default function ResumeBuilder() {
  const toast = useToast();
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
      toast.success('Resume synchronized! ✅');
    } catch { toast.error('Sync failed'); }
    setSaving(false);
  };

  const exportPDF = async () => {
    const el = previewRef.current;
    if (!el) return;
    toast.info('Synthesizing PDF Document...');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `${data.personal.name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(el).save();
      toast.success('Resume downloaded!');
    } catch (err) { console.error(err); toast.error('Synthesis failed'); }
  };



  const inp = (lbl, val, onChange, type = 'text', ph = '') => (
    <div className="form-group">
      <label className="label" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{lbl}</label>
      <input 
        type={type} 
        className="input" 
        value={val} 
        onChange={e => onChange(e.target.value)} 
        placeholder={ph} 
        style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '12px 14px' }}
      />
    </div>
  );

  const p = data.personal;

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h1 className="section-title">Resume Studio</h1>
          <p className="section-sub">Engineer your professional identity for elite technical roles.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>

          <button className="btn btn-ghost" onClick={save} disabled={saving} style={{ borderRadius: '12px' }}>
            {saving ? <Save size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
            {saving ? 'Syncing...' : saved ? 'In Sync' : 'Sync Progress'}
          </button>
          <button id="resume-export" className="btn btn-primary btn-glow" onClick={exportPDF} style={{ borderRadius: '12px', padding: '0 24px' }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="resume-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 520px', gap: '40px', alignItems: 'start' }}>
        {/* Form Container */}
        <div className="flex flex-col gap-24">
          <div className="glass-strong" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="step-tabs" style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button 
                    key={s.id} 
                    className={`step-tab ${step === i ? 'active' : ''}`} 
                    onClick={() => setStep(i)}
                    style={{ 
                        flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        border: 'none', background: step === i ? 'rgba(124, 58, 237, 0.05)' : 'none',
                        color: step === i ? 'var(--accent)' : 'var(--text-muted)',
                        transition: '0.3s', cursor: 'pointer', borderBottom: step === i ? '2px solid var(--accent)' : '2px solid transparent'
                    }}
                  >
                    <Icon size={18} />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ padding: '32px' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 0 && (
                      <div className="flex flex-col gap-20">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                           {inp('Full Name', p.name, v => setP('name', v), 'text', 'Arjun Sharma')}
                           {inp('Target Role', p.role, v => setP('role', v), 'text', 'Software Engineer')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                           {inp('Email Address', p.email, v => setP('email', v), 'email', 'arjun@example.com')}
                           {inp('Phone Matrix', p.phone, v => setP('phone', v), 'text', '+91 98765 43210')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                           {inp('Global Location', p.location, v => setP('location', v), 'text', 'Cloud City, Earth')}
                           {inp('GitHub Repository', p.github, v => setP('github', v), 'text', 'github.com/profile')}
                        </div>
                        {inp('LinkedIn Protocol', p.linkedin, v => setP('linkedin', v), 'text', 'linkedin.com/in/profile')}
                        <div className="form-group">
                           <label className="label" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Professional Executive Summary</label>
                           <textarea className="input" style={{ minHeight: '120px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px', resize: 'none' }} value={p.summary} onChange={e => setP('summary', e.target.value)} placeholder="High-performance technical specialist with expertise in..." />
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="flex flex-col gap-12">
                        {data.education.map((ed, i) => (
                          <div key={i} className="glass" style={{ padding: '24px', position: 'relative', background: 'rgba(0,0,0,0.2)' }}>
                            {i > 0 && <button onClick={() => removeItem('education', i)} style={{ position: 'absolute', top: 16, right: 16, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                {inp('Educational Institution', ed.institution, v => setArr('education', i, 'institution', v), 'text', 'MIT')}
                                {inp('Certification Degree', ed.degree, v => setArr('education', i, 'degree', v), 'text', 'B.S.')}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                {inp('Focus Field', ed.field, v => setArr('education', i, 'field', v), 'text', 'Computer Science')}
                                {inp('Performance Index (GPA)', ed.cgpa, v => setArr('education', i, 'cgpa', v), 'text', '4.0/4.0')}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {inp('Launch Year', ed.startYear, v => setArr('education', i, 'startYear', v), 'text', '2020')}
                                {inp('Completion Year', ed.endYear, v => setArr('education', i, 'endYear', v), 'text', '2024')}
                            </div>
                          </div>
                        ))}
                        <button className="btn btn-ghost w-full" onClick={() => addItem('education', { institution: '', degree: '', field: '', startYear: '', endYear: '', cgpa: '' })} style={{ borderRadius: '10px', marginTop: '12px' }}>
                           <Plus size={16} /> Add Academic Node
                        </button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col gap-12">
                        {data.experience.map((ex, i) => (
                          <div key={i} className="glass" style={{ padding: '24px', position: 'relative', background: 'rgba(0,0,0,0.2)' }}>
                            <button onClick={() => removeItem('experience', i)} style={{ position: 'absolute', top: 16, right: 16, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                {inp('Corporation', ex.company, v => setArr('experience', i, 'company', v), 'text', 'NVIDIA')}
                                {inp('Engineering Role', ex.role, v => setArr('experience', i, 'role', v), 'text', 'Senior Engineer')}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                {inp('Deployment Start', ex.startDate, v => setArr('experience', i, 'startDate', v), 'text', 'Jan 2022')}
                                {inp('Deployment End', ex.endDate, v => setArr('experience', i, 'endDate', v), 'text', 'Present')}
                            </div>
                            <div className="form-group">
                               <label className="label" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Industrial Contributions</label>
                               <textarea className="input" style={{ minHeight: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px', resize: 'none' }} value={ex.description} onChange={e => setArr('experience', i, 'description', e.target.value)} placeholder="• Architected mission-critical systems..." />
                            </div>
                          </div>
                        ))}
                        <button className="btn btn-ghost w-full" onClick={() => addItem('experience', { company: '', role: '', startDate: '', endDate: '', description: '' })} style={{ borderRadius: '10px', marginTop: '12px' }}>
                           <Plus size={16} /> Add Industrial Deployment
                        </button>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="flex flex-col gap-12">
                        {data.projects.map((pr, i) => (
                          <div key={i} className="glass" style={{ padding: '24px', position: 'relative', background: 'rgba(0,0,0,0.2)' }}>
                            {i > 0 && <button onClick={() => removeItem('projects', i)} style={{ position: 'absolute', top: 16, right: 16, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                                {inp('Project Identifier', pr.title, v => setArr('projects', i, 'title', v), 'text', 'Neural Engine')}
                                {inp('Tech Architecture', pr.tech, v => setArr('projects', i, 'tech', v), 'text', 'PyTorch, CUDA')}
                            </div>
                            {inp('Source Repository Link', pr.link, v => setArr('projects', i, 'link', v), 'text', 'github.com/engine')}
                            <div className="form-group" style={{ marginTop: '16px' }}>
                               <label className="label" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Functional Overview</label>
                               <textarea className="input" style={{ minHeight: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px', resize: 'none' }} value={pr.description} onChange={e => setArr('projects', i, 'description', e.target.value)} placeholder="• Developed high-performance computation engine..." />
                            </div>
                          </div>
                        ))}
                        <button className="btn btn-ghost w-full" onClick={() => addItem('projects', { title: '', tech: '', description: '', link: '' })} style={{ borderRadius: '10px', marginTop: '12px' }}>
                           <Plus size={16} /> Add Portfolio Project
                        </button>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="flex flex-col gap-12">
                        {data.skills.map((sk, i) => (
                          <div key={i} className="glass" style={{ padding: '24px', position: 'relative', background: 'rgba(0,0,0,0.2)' }}>
                            {i > 0 && <button onClick={() => removeItem('skills', i)} style={{ position: 'absolute', top: 16, right: 16, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                            {inp('Expertise Domain', sk.category, v => setArr('skills', i, 'category', v), 'text', 'Kernel Development')}
                            {inp('Core Skills (Comma Separated)', sk.items, v => setArr('skills', i, 'items', v), 'text', 'C, Assembly, Rust, Debugging')}
                          </div>
                        ))}
                        <button className="btn btn-ghost w-full" onClick={() => addItem('skills', { category: '', items: '' })} style={{ borderRadius: '10px', marginTop: '12px' }}>
                           <Plus size={16} /> Add Expertise Cluster
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
             <button disabled={step === 0} className="btn btn-ghost" onClick={() => setStep(s => s - 1)} style={{ flex: 1, borderRadius: '12px' }}>
                <ChevronLeft size={18} /> Previous Protocol
             </button>
             <button disabled={step === STEPS.length - 1} className="btn btn-primary" onClick={() => setStep(s => s + 1)} style={{ flex: 1, borderRadius: '12px' }}>
                Next Protocol <ChevronRight size={18} />
             </button>
          </div>
        </div>

        {/* Live Preview Container */}
        <div>
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <FileText size={14} /> Real-time Synthesis Preview
            </div>
            <div className="glass-strong resume-preview-container" style={{ padding: '0', background: '#fff', color: '#1a1a1a', height: '1000px', overflowY: 'auto' }}>
              <div ref={previewRef} id="resume-preview-doc" style={{ padding: '30px', minHeight: '100%', borderRadius: 0 }}>
                {/* PDF content styles directly handled for fidelity */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '24pt', fontWeight: 800, textTransform: 'uppercase', color: '#000', marginBottom: '5px' }}>{p.name || 'ANONYMOUS ENTITY'}</div>
                  <div style={{ fontSize: '14pt', fontWeight: 600, color: '#444', marginBottom: '10px' }}>{p.role || 'Professional Engineer'}</div>
                  <div style={{ fontSize: '9pt', color: '#666', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                    {p.email && <span>✉ {p.email}</span>}
                    {p.phone && <span>📞 {p.phone}</span>}
                    {p.location && <span>📍 {p.location}</span>}
                  </div>
                  <div style={{ fontSize: '9pt', color: '#444', marginTop: '5px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
                    {p.linkedin && <span style={{ fontWeight: 600 }}>LinkedIn: {p.linkedin}</span>}
                    {p.github && <span style={{ fontWeight: 600 }}>GitHub: {p.github}</span>}
                  </div>
                </div>

                {p.summary && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: 800, textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px' }}>Executive Summary</div>
                    <p style={{ fontSize: '9.5pt', lineHeight: 1.5, color: '#333', textAlign: 'justify' }}>{p.summary}</p>
                  </div>
                )}

                {data.experience.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: 800, textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px' }}>Professional Experience</div>
                    {data.experience.map((ex, i) => (
                      <div key={i} style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '10pt', fontWeight: 700 }}>{ex.role}</span>
                          <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>{ex.startDate} – {ex.endDate}</span>
                        </div>
                        <div style={{ fontSize: '9.5pt', fontWeight: 600, color: '#444', marginBottom: '5px' }}>{ex.company}</div>
                        <p style={{ fontSize: '9pt', color: '#333', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{ex.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {data.projects.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: 800, textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px' }}>Projects & Implementations</div>
                    {data.projects.map((pr, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '10pt', fontWeight: 700 }}>{pr.title} <span style={{ fontWeight: 400, fontSize: '8pt', color: '#777' }}>| {pr.tech}</span></span>
                          {pr.link && <span style={{ fontSize: '8pt', color: '#6d28d9' }}>{pr.link}</span>}
                        </div>
                        <p style={{ fontSize: '9pt', color: '#333', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{pr.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {data.education.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: 800, textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px' }}>Academic Background</div>
                    {data.education.map((ed, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <span style={{ fontSize: '10pt', fontWeight: 700 }}>{ed.institution}</span>
                          <span style={{ fontSize: '9pt', fontStyle: 'italic' }}>{ed.startYear} – {ed.endYear}</span>
                        </div>
                        <div style={{ fontSize: '9.5pt', color: '#444' }}>{ed.degree} in {ed.field} {ed.cgpa && <span style={{ fontWeight: 600 }}>| GPA: {ed.cgpa}</span>}</div>
                      </div>
                    ))}
                  </div>
                )}

                {data.skills.length > 0 && (
                  <div>
                    <div style={{ fontSize: '10pt', fontWeight: 800, textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #ddd', paddingBottom: '3px', marginBottom: '10px' }}>Core Expertise</div>
                    {data.skills.map((sk, i) => (
                      <div key={i} style={{ fontSize: '9pt', marginBottom: '5px', display: 'flex' }}>
                        {sk.category && <span style={{ fontWeight: 700, minWidth: '130px' }}>{sk.category}:</span>}
                        <span style={{ color: '#333' }}>{sk.items}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


      
      <style>{`
        .resume-preview-container::-webkit-scrollbar {
          width: 6px;
        }
        .resume-preview-container::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 3px;
        }
        .resume-preview-container:hover::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
