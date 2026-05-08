import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Zap, CheckCircle, TrendingUp, Trash2, Plus, Edit, X } from 'lucide-react';
import api from '../lib/api';

const COLORS = ['#FF3B30', '#3B82F6', '#22C55E', '#A855F7'];

const WorkoutModal = ({ workout, onClose, onSave }) => {
  const [form, setForm] = useState(workout || {
    title: '', description: '', category: 'Weight Loss', difficulty: 'Beginner',
    duration: 30, trainer: '', videoUrl: '', thumbnail: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-surface-border">
          <h2 className="font-display text-xl font-700 text-white">{workout ? 'Edit Workout' : 'Add Workout'}</h2>
          <button onClick={onClose}><X size={20} className="text-white/40 hover:text-white" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[['title', 'Title', 'text'], ['trainer', 'Trainer', 'text'], ['videoUrl', 'YouTube Embed URL', 'text'], ['thumbnail', 'Thumbnail URL', 'text']].map(([key, label, type]) => (
            <div key={key}>
              <label className="text-xs text-white/50 mb-1 block">{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50" />
            </div>
          ))}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required
              className="w-full bg-surface-elevated border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary/50 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none">
                {['Weight Loss', 'Muscle Gain', 'Home Workout', 'Yoga'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none">
                {['Beginner', 'Intermediate', 'Advanced'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Duration (min)</label>
              <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })}
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none" />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full py-3">Save Workout</button>
        </form>
      </div>
    </div>
  );
};

export default function Admin() {
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [modal, setModal] = useState(null); // null | 'add' | workout object

  const fetchAll = async () => {
    const [a, u, w] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/admin/users'),
      api.get('/workouts?limit=100')
    ]);
    setAnalytics(a.data);
    setUsers(u.data);
    setWorkouts(w.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(u => u.filter(u => u._id !== id));
  };

  const saveWorkout = async (form) => {
    if (modal?._id) {
      await api.put(`/admin/workouts/${modal._id}`, form);
    } else {
      await api.post('/admin/workouts', form);
    }
    fetchAll();
  };

  const deleteWorkout = async (id) => {
    if (!confirm('Remove workout?')) return;
    await api.delete(`/admin/workouts/${id}`);
    setWorkouts(w => w.filter(w => w._id !== id));
  };

  const tabs = ['analytics', 'users', 'workouts'];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Control Center</p>
            <h1 className="font-display text-5xl font-800 text-white">ADMIN PANEL</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                tab === t ? 'bg-primary text-white' : 'bg-surface-card border border-surface-border text-white/60 hover:text-white'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Analytics */}
        {tab === 'analytics' && analytics && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: 'Total Users', value: analytics.totalUsers, color: 'text-blue-400' },
                { icon: Zap, label: 'Total Workouts', value: analytics.totalWorkouts, color: 'text-green-400' },
                { icon: CheckCircle, label: 'Completions', value: analytics.totalCompletions, color: 'text-primary' },
                { icon: TrendingUp, label: 'New This Week', value: analytics.newUsers, color: 'text-purple-400' },
              ].map(s => (
                <div key={s.label} className="card p-5">
                  <s.icon size={20} className={`${s.color} mb-3`} />
                  <div className={`font-display text-4xl font-800 ${s.color}`}>{s.value}</div>
                  <div className="text-white/40 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Workouts */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-700 text-white mb-4">Top Workouts</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.topWorkouts}>
                      <XAxis dataKey="title" stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 10 }} tickFormatter={v => v.split(' ')[0]} />
                      <YAxis stroke="#ffffff20" tick={{ fill: '#ffffff40', fontSize: 10 }} />
                      <Tooltip contentStyle={{ background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="completions" fill="#FF3B30" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Distribution */}
              <div className="card p-6">
                <h2 className="font-display text-xl font-700 text-white mb-4">Category Distribution</h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analytics.categoryDistribution} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} label={({ _id }) => _id}>
                        {analytics.categoryDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-surface-border">
              <h2 className="font-display text-xl font-700 text-white">Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-border">
                    {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-white/40 font-semibold text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-surface-border hover:bg-surface-elevated transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-white/50">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${u.role === 'trainer' ? 'bg-blue-500/20 text-blue-400' : 'bg-surface-elevated text-white/40'}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-4 text-white/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <button onClick={() => deleteUser(u._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Workouts */}
        {tab === 'workouts' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setModal('add')} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
                <Plus size={16} /> Add Workout
              </button>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Title', 'Category', 'Difficulty', 'Duration', 'Completions', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-white/40 font-semibold text-xs uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {workouts.map(w => (
                      <tr key={w._id} className="border-b border-surface-border hover:bg-surface-elevated transition-colors">
                        <td className="px-6 py-4 text-white font-medium">{w.title}</td>
                        <td className="px-6 py-4 text-white/50 text-xs">{w.category}</td>
                        <td className="px-6 py-4 text-white/50 text-xs">{w.difficulty}</td>
                        <td className="px-6 py-4 text-white/50">{w.duration}m</td>
                        <td className="px-6 py-4 text-primary font-semibold">{w.completions}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => setModal(w)} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400 transition-colors">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => deleteWorkout(w._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <WorkoutModal
          workout={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveWorkout}
        />
      )}
    </div>
  );
}
