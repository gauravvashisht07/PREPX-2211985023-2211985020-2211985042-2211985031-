import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Mic2, FileText, BarChart2, 
  Star, Building2, StickyNote, CheckSquare, ChevronLeft, ChevronRight,
  Target, Award
} from 'lucide-react';
import { useState } from 'react';

const sidebarGroups = [
  {
    title: 'Preparation',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/questions', icon: BookOpen, label: 'Question Bank' },
      { to: '/mcq', icon: Target, label: 'MCQ Practice' },
      { to: '/mock', icon: Mic2, label: 'Mock Interview' },
    ]
  },
  {
    title: 'Tools',
    items: [
      { to: '/resume', icon: FileText, label: 'Resume Builder' },
      { to: '/todos', icon: CheckSquare, label: 'To-Do Planner' },
      { to: '/notes', icon: StickyNote, label: 'Notes & Roadmap' },
    ]
  },
  {
    title: 'Analytics',
    items: [
      { to: '/progress', icon: BarChart2, label: 'My Progress' },
      { to: '/daily', icon: Star, label: 'Daily Challenge' },
      { to: '/companies', icon: Building2, label: 'Company-Wise' },
    ]
  }
];

export default function Sidebar({ collapsed, setCollapsed }) {
  return (
    <aside className={`sidebar-container ${collapsed ? 'collapsed' : 'expanded'}`} style={{ width: collapsed ? 'var(--sidebar-collapsed-w)' : 'var(--sidebar-w)' }}>
      <div className="sidebar-header">
        <div className="logo-box">P</div>
        {!collapsed && <span className="logo-text">PREPX</span>}
      </div>

      <nav className="nav-list custom-scrollbar">
        {sidebarGroups.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '24px' }}>
            {!collapsed && <div className="nav-section-title" style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', paddingLeft: '14px', letterSpacing: '1px', fontWeight: 700 }}>{group.title}</div>}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={collapsed ? label : ''}
              >
                <Icon size={20} className="nav-icon" strokeWidth={collapsed ? 2 : 1.5} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : 'space-between', padding: '8px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {!collapsed && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Collapse</span>}
          {collapsed ? <ChevronRight size={20} color="var(--text-secondary)" /> : <ChevronLeft size={20} color="var(--text-secondary)" />}
        </button>
      </div>
    </aside>
  );
}
