import React from 'react';
import { useNotifications } from '../context/NotificationContext.jsx';
import { Bell, Check, Trash2, Zap, Target, Award, Brain, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const getIcon = (type) => {
    switch (type) {
        case 'AI_SUGGESTION': return <Brain size={16} color="var(--primary)" />;
        case 'DAILY_REMINDER': return <Clock size={16} color="var(--accent)" />;
        case 'ACHIEVEMENT': return <Award size={16} color="#f59e0b" />;
        case 'PROGRESS_UPDATE': return <Target size={16} color="#10b981" />;
        default: return <Bell size={16} />;
    }
};

const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
};

export default function NotificationDropdown({ onClose }) {
    const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

    return (
        <>
            <div 
                style={{ position: 'fixed', inset: 0, zIndex: 98 }} 
                onClick={onClose} 
            />
            <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="glass-strong" 
                style={{ 
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '360px', 
                    borderRadius: '20px', zIndex: 99, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden'
                }}
            >
                {/* Header */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Notifications <span style={{ fontSize: '0.7rem', background: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>{notifications.length}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={markAllAsRead} className="btn-ghost" title="Mark all as read" style={{ padding: '6px', borderRadius: '8px' }}>
                            <Check size={16} />
                        </button>
                        <button onClick={clearAll} className="btn-ghost" title="Clear all" style={{ padding: '6px', borderRadius: '8px', color: 'var(--danger)' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <div style={{ marginBottom: '12px', opacity: 0.2 }}><Bell size={40} style={{ margin: '0 auto' }} /></div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Operational silence</div>
                            <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>We'll alert you when something shifts.</div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {notifications.map(note => (
                                <div 
                                    key={note.id} 
                                    onClick={() => markAsRead(note.id)}
                                    className={`notification-item ${note.read ? '' : 'unread'}`}
                                    style={{ cursor: 'pointer', display: 'flex', gap: '12px' }}
                                >
                                    <div style={{ paddingTop: '4px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {getIcon(note.type)}
                                        </div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{note.title}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '8px' }}>{formatTime(note.date)}</div>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{note.message}</div>
                                    </div>
                                    <div style={{ width: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="notification-marker" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
                    <button onClick={onClose} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                        CLOSE PANEL
                    </button>
                </div>
            </motion.div>
        </>
    );
}
