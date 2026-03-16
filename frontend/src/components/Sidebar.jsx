import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard, BookOpen, Mic2, FileText, BarChart2,
  Star, Building2, StickyNote, CheckSquare, LogOut, X
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/questions', icon: BookOpen, label: 'Question Bank' },
  { to: '/mock', icon: Mic2, label: 'Mock Interview' },
  { to: '/daily', icon: Star, label: 'Daily Challenge' },
  { to: '/progress', icon: BarChart2, label: 'My Progress' },
  { to: '/companies', icon: Building2, label: 'Company-Wise' },
  { to: '/resume', icon: FileText, label: 'Resume Builder' },
  { to: '/notes', icon: StickyNote, label: 'Notes & Roadmap' },
  { to: '/todos', icon: CheckSquare, label: 'To-Do Planner' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); onClose?.(); };
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">P</div>
          <span className="sidebar-logo-text gradient-text">Prepx</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'none' }} className="sidebar-close-btn">
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-nav">
          <div className="nav-section-title">Main Menu</div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to} to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} /> {label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-card-mini">
            <div className="user-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
            <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '6px', flexShrink: 0 }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
