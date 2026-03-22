import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { useToast } from '../context/ToastContext.jsx';
import { Skeleton } from '../components/Skeleton.jsx';
import { Plus, Trash2, Check } from 'lucide-react';

const FILTERS = ['All', 'Today', 'Pending', 'Completed'];
const todayStr = () => new Date().toISOString().slice(0, 10);

export default function TodoPlanner() {
  const toast = useToast();
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', priority: 'medium', dueDate: '', topic: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api.get('/todos', { signal: controller.signal })
      .then(r => { setTodos(r.data); setLoading(false); })
      .catch(err => { if (err.name !== 'CanceledError') { setLoading(false); toast.error('Failed to load tasks'); } });
    return () => controller.abort();
  }, []);

  const create = async e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const res = await api.post('/todos', form);
      setTodos(t => [res.data, ...t]);
      setForm({ title: '', priority: 'medium', dueDate: '', topic: '' });
      toast.success('Task added! ✅');
    } catch { toast.error('Failed to create task'); }
  };

  const toggle = async (todo) => {
    try {
      const res = await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
      setTodos(ts => ts.map(t => t._id === todo._id ? res.data : t));
      toast.info(res.data.completed ? 'Task completed! 🎉' : 'Task reopened');
    } catch { toast.error('Failed to update task'); }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(ts => ts.filter(t => t._id !== id));
      toast.info('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  const filtered = todos.filter(t => {
    if (filter === 'Today') return t.dueDate === todayStr();
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const pending = todos.filter(t => !t.completed).length;
  const done = todos.filter(t => t.completed).length;
  const priorityColors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div className="section-header">
        <h1 className="section-title">To-Do Planner</h1>
        <p className="section-sub">{pending} pending · {done} completed</p>
      </div>

      <div className="todo-layout">
        <aside>
          <div className="glass" style={{ padding: 20 }}>
            <h3 style={{ fontSize: '1rem', marginBottom: 16 }}>➕ Add Task</h3>
            <form onSubmit={create}>
              <div className="form-group">
                <label className="label">Task</label>
                <input id="todo-title" className="input" placeholder="e.g. Solve 5 DP problems" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="label">Priority</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['high', 'medium', 'low'].map(p => (
                    <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                      style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: `2px solid ${form.priority === p ? priorityColors[p] : 'var(--border)'}`, background: form.priority === p ? `${priorityColors[p]}22` : 'var(--bg-card)', color: form.priority === p ? priorityColors[p] : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, textTransform: 'capitalize', transition: 'all 0.15s' }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="label">Due Date</label>
                <input type="date" className="input" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={{ colorScheme: 'dark' }} />
              </div>
              <div className="form-group">
                <label className="label">Topic (optional)</label>
                <input className="input" placeholder="e.g. DSA, OS" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
              </div>
              <button id="todo-submit" type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', marginTop: 4 }}>
                <Plus size={16} /> Add Task
              </button>
            </form>
          </div>
        </aside>

        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ padding: '14px 16px', marginBottom: 8 }} className="glass">
                <Skeleton height={16} width="70%" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
              <p>{filter === 'Completed' ? 'No completed tasks yet.' : 'No tasks here. Add one!'}</p>
            </div>
          ) : filtered.map(todo => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <div className="priority-dot" style={{ background: priorityColors[todo.priority] || '#f59e0b' }} />
              <button onClick={() => toggle(todo)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: todo.completed ? '#10b981' : 'var(--text-muted)', flexShrink: 0 }}>
                <div className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}>
                  {todo.completed && <Check size={13} color="#fff" strokeWidth={3} />}
                </div>
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={`todo-title ${todo.completed ? 'done-text' : ''}`}>{todo.title}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
                  {todo.topic && <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{todo.topic}</span>}
                  {todo.dueDate && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📅 {todo.dueDate}</span>}
                </div>
              </div>
              <button onClick={() => remove(todo._id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 6, flexShrink: 0 }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
