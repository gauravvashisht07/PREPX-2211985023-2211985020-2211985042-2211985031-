import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { StatCardSkeleton } from '../components/Skeleton.jsx'; // Using StatCardSkeleton instead of generic Skeleton
import { Plus, Trash2, Check, Calendar, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = ['All', 'Today', 'Pending', 'Completed'];
const todayStr = () => new Date().toISOString().slice(0, 10);

export default function TodoPlanner() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', priority: 'medium', dueDate: '', topic: '' });

  // Query for todos
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await api.get('/todos');
      return res.data;
    }
  });

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (newTodo) => {
      const res = await api.post('/todos', newTodo);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setForm({ title: '', priority: 'medium', dueDate: '', topic: '' });
      toast.success('Task added! ✅');
    },
    onError: () => toast.error('Failed to create task')
  });

  // Toggle Mutation
  const toggleMutation = useMutation({
    mutationFn: async (todo) => {
      const res = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.info(updated.completed ? 'Task completed! 🎉' : 'Task reopened');
    },
    onError: () => toast.error('Failed to update task')
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/todos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.info('Task deleted');
    },
    onError: () => toast.error('Failed to delete task')
  });

  const create = e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    createMutation.mutate(form);
  };

  const toggle = (todo) => toggleMutation.mutate(todo);
  const remove = (id) => deleteMutation.mutate(id);

  const filtered = todos.filter(t => {
    if (filter === 'Today') return t.dueDate === todayStr();
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const pendingCount = todos.filter(t => !t.completed).length;
  const doneCount = todos.filter(t => t.completed).length;
  const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div className="animate-fade-up">
      <div className="section-header page-content" style={{ marginBottom: '40px' }}>
        <h1 className="section-title">Preparation Planner</h1>
        <p className="section-sub">
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{pendingCount}</span> pending tasks · {doneCount} completed
        </p>
      </div>

      <div className="flex-col-mobile" id="todo-grid" style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>
        <style>{`
          @media (max-width: 900px) {
            #todo-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          }
        `}</style>
        <aside className="w-full-mobile">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-strong" 
            style={{ padding: '28px', position: 'sticky', top: '100px' }}
            id="todo-sidebar-card"
          >
            <style>{`
              @media (max-width: 900px) {
                #todo-sidebar-card { position: static !important; padding: 20px !important; }
              }
            `}</style>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <Plus size={20} color="var(--accent)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>New Task</h3>
            </div>
            <form onSubmit={create}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="label" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>TITLE</label>
                <input 
                  id="todo-title" className="input" 
                  placeholder="e.g. Solve 5 DP problems" 
                  value={form.title} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                  required 
                  style={{ padding: '12px 14px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="label" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>PRIORITY</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['high', 'medium', 'low'].map(p => (
                    <button 
                      key={p} type="button" 
                      onClick={() => setForm(f => ({ ...f, priority: p }))}
                      style={{ 
                        flex: 1, padding: '10px 0', borderRadius: '10px', 
                        border: '1px solid var(--border)',
                        background: form.priority === p ? `${priorityColors[p]}15` : 'transparent',
                        color: form.priority === p ? priorityColors[p] : 'var(--text-muted)',
                        borderColor: form.priority === p ? `${priorityColors[p]}44` : 'var(--border)',
                        cursor: 'pointer', 
                        fontSize: '0.78rem', fontWeight: 700, 
                        textTransform: 'capitalize', transition: '0.2s' 
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="label" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>DUE DATE</label>
                <div style={{ position: 'relative' }}>
                    <Calendar size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="date" className="input" 
                      value={form.dueDate} 
                      onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} 
                      min={todayStr()} 
                      style={{ paddingLeft: '36px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }} 
                    />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="label" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>TOPIC</label>
                <div style={{ position: 'relative' }}>
                    <Tag size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      className="input" 
                      placeholder="e.g. DSA, OS" 
                      value={form.topic} 
                      onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} 
                      style={{ paddingLeft: '36px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}
                    />
                </div>
              </div>

              <button 
                id="todo-submit" type="submit" 
                disabled={createMutation.isPending}
                className="btn btn-primary btn-glow w-full" 
                style={{ padding: '14px', borderRadius: '12px' }}
              >
                {createMutation.isPending ? 'Syncing...' : <><Plus size={18} /> Add to Schedule</>}
              </button>
            </form>
          </motion.div>
        </aside>

        <div className="w-full-mobile">
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '8px' }} className="custom-scrollbar">
            {FILTERS.map(f => (
              <button 
                key={f} 
                className={`btn ${filter === f ? 'btn-primary' : 'btn-ghost'}`} 
                onClick={() => setFilter(f)}
                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.8rem', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {f}
              </button>
            ))}
          </div>

          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} style={{ marginBottom: 12, height: '80px' }} />)
          ) : filtered.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               style={{ textAlign: 'center', padding: '100px 40px', color: 'var(--text-muted)' }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.5 }}>✨</div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>All caught up!</h3>
              <p>No tasks found for "{filter}". Start planning your prep.</p>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <AnimatePresence initial={false}>
                {filtered.map(todo => (
                  <motion.div 
                    layout
                    key={todo._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass flex-col-mobile" 
                    style={{ 
                        padding: '16px 20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '16px',
                        borderLeft: `4px solid ${todo.completed ? 'var(--text-muted)' : priorityColors[todo.priority]}`,
                        transition: '0.3s'
                    }}
                  >
                    <button 
                      onClick={() => toggle(todo)} 
                      style={{ 
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer', 
                        color: todo.completed ? 'var(--success)' : 'var(--text-muted)',
                        flexShrink: 0 
                      }}
                    >
                      <div style={{ 
                        width: '24px', height: '24px', borderRadius: '7px', 
                        border: `2px solid ${todo.completed ? 'var(--success)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyCenter: 'center',
                        background: todo.completed ? `${priorityColors.low}22` : 'transparent'
                      }}>
                        {todo.completed && <Check size={16} strokeWidth={3} style={{ margin: '0 auto' }} />}
                      </div>
                    </button>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        fontSize: '1.05rem', fontWeight: 600, 
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        transition: '0.3s'
                      }}>
                        {todo.title}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {todo.topic && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '6px' }}>
                                {todo.topic}
                            </span>
                        )}
                        {todo.dueDate && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} /> {todo.dueDate}
                            </span>
                        )}
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: priorityColors[todo.priority], letterSpacing: '0.5px' }}>
                            {todo.priority}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => remove(todo._id)} 
                      className="btn-ghost"
                      style={{ 
                        width: '36px', height: '36px', borderRadius: '8px', border: 'none', 
                        background: 'none', color: 'var(--text-muted)', cursor: 'pointer', 
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyCenter: 'center' 
                      }}
                    >
                      <Trash2 size={16} style={{ margin: '0 auto' }} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
