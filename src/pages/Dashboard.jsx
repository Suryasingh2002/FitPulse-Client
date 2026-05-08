import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Zap, Clock, Trophy, Bookmark } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users/me/stats'),
      api.get('/users/me/bookmarks'),
      api.get('/users/me/challenges')
    ]).then(([s, b, c]) => {
      setStats(s.data);
      setBookmarks(b.data);
      setChallenges(c.data);
      setLoading(false);
    });
  }, []);

  const statCards = stats ? [
    { icon: Flame, label: 'Day Streak', value: stats.streak, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { icon: Zap, label: 'Total Workouts', value: stats.totalWorkouts, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { icon: Clock, label: 'Total Minutes', value: stats.totalMinutes, color: 'text-green-400', bg: 'bg-green-400/10' },
    { icon: Trophy, label: 'Active Challenges', value: stats.activeChallenges, color: 'text-primary', bg: 'bg-primary/10' },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Your Space</p>
          <h1 className="font-display text-5xl font-800 text-white">
            WELCOME BACK, {user?.name?.toUpperCase().split(' ')[0]}
          </h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => <div key={i} className="card h-28 animate-pulse bg-surface-elevated" />)}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map(s => (
                <div key={s.label} className="card p-5">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon size={20} className={s.color} />
                  </div>
                  <div className={`font-display text-4xl font-800 ${s.color}`}>{s.value}</div>
                  <div className="text-white/40 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="card p-6 mb-8">
              <h2 className="font-display text-2xl font-700 text-white mb-6">7-Day Activity</h2>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.chartData || []}>
                    <XAxis dataKey="day" stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                    <YAxis stroke="#ffffff30" tick={{ fill: '#ffffff50', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#1C1C1C', border: '1px solid #2A2A2A', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="workouts" fill="#FF3B30" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Bookmarks */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-700 text-white flex items-center gap-2">
                    <Bookmark size={18} className="text-primary" /> Saved Workouts
                  </h2>
                  <Link to="/workouts" className="text-primary text-xs hover:underline">Browse more</Link>
                </div>
                {bookmarks.length === 0 ? (
                  <p className="text-white/30 text-sm py-4">No saved workouts yet.</p>
                ) : (
                  <div className="space-y-3">
                    {bookmarks.slice(0, 5).map(b => (
                      <Link key={b._id} to={`/workouts/${b._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-elevated transition-colors group">
                        <img src={b.thumbnail} alt={b.title} className="w-14 h-10 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white group-hover:text-primary transition-colors truncate">{b.title}</p>
                          <p className="text-xs text-white/40">{b.duration} min · {b.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Challenges */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl font-700 text-white flex items-center gap-2">
                    <Trophy size={18} className="text-primary" /> My Challenges
                  </h2>
                  <Link to="/challenges" className="text-primary text-xs hover:underline">Find challenges</Link>
                </div>
                {challenges.length === 0 ? (
                  <p className="text-white/30 text-sm py-4">No active challenges. Join one!</p>
                ) : (
                  <div className="space-y-3">
                    {challenges.map(uc => (
                      <Link key={uc._id} to={`/challenges/${uc.challenge?._id}`}
                        className="block p-3 rounded-xl hover:bg-surface-elevated transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">{uc.challenge?.title}</span>
                          {uc.isCompleted && <span className="text-xs text-green-400">✓ Done</span>}
                        </div>
                        <div className="w-full bg-surface rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full"
                            style={{ width: `${((uc.completedDays?.length || 0) / (uc.challenge?.duration || 1)) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-white/30 mt-1">{uc.completedDays?.length || 0}/{uc.challenge?.duration} days</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
