import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../api/axios.js';
import { useToast } from '../../context/ToastContext.jsx';
import { User, Mail, Shield, Target, Key, Image, Save, LogOut, Loader2 } from 'lucide-react';

export default function ProfileSettings() {
  const { user, updateUserProfile, logout } = useAuth();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    targetRole: user?.targetRole || '',
    skillLevel: user?.skillLevel || '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await api.put('/user/profile', formData);
      updateUserProfile(res.data);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-32">
        <div className="glass" style={{ padding: '32px' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <User size={20} color="var(--primary)" /> Basic Information
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div className="flex flex-col gap-8">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</label>
                <div className="input-group" style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input name="name" className="input" value={formData.name} onChange={handleChange} style={{ paddingLeft: '44px' }} placeholder="Enter name" required />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</label>
                <div className="input-group" style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input className="input" value={user?.email} disabled style={{ paddingLeft: '44px', opacity: 0.5, cursor: 'not-allowed' }} />
                </div>
              </div>
           </div>
           
           <div className="flex flex-col gap-8">
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avatar URL</label>
              <div className="input-group" style={{ position: 'relative' }}>
                  <Image size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input name="avatar" className="input" value={formData.avatar} onChange={handleChange} style={{ paddingLeft: '44px' }} placeholder="https://..." />
              </div>
           </div>
        </div>

        <div className="glass" style={{ padding: '32px' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Target size={20} color="var(--accent)" /> Professional Preferences
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="flex flex-col gap-8">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Role</label>
                <div className="input-group" style={{ position: 'relative' }}>
                    <Target size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select name="targetRole" className="input" value={formData.targetRole} onChange={handleChange} style={{ paddingLeft: '44px' }}>
                        <option value="Full Stack Developer">Full Stack Developer</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Data Engineer">Data Engineer</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                    </select>
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Skill Level</label>
                <div className="input-group" style={{ position: 'relative' }}>
                    <Shield size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <select name="skillLevel" className="input" value={formData.skillLevel} onChange={handleChange} style={{ paddingLeft: '44px' }}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
              </div>
           </div>
        </div>

        <div className="glass" style={{ padding: '32px' }}>
           <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <Key size={20} color="var(--danger)" /> Security Credentials
           </h3>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="flex flex-col gap-8">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Password</label>
                <div className="input-group" style={{ position: 'relative' }}>
                    <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input name="password" type="password" className="input" value={formData.password} onChange={handleChange} style={{ paddingLeft: '44px' }} placeholder="••••••••" />
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confirm Password</label>
                <div className="input-group" style={{ position: 'relative' }}>
                    <Key size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input name="confirmPassword" type="password" className="input" value={formData.confirmPassword} onChange={handleChange} style={{ paddingLeft: '44px' }} placeholder="••••••••" />
                </div>
              </div>
           </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
            <button type="button" onClick={logout} className="btn btn-ghost" style={{ borderRadius: '12px', padding: '12px 24px' }}>
                <LogOut size={18} /> Logout Session
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary btn-glow" style={{ borderRadius: '12px', padding: '12px 32px' }}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Synchronize Profile</>}
            </button>
        </div>
      </form>
    </div>
  );
}
