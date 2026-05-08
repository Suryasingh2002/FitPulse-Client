import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import api from '../lib/api';
import WorkoutCard from '../components/ui/WorkoutCard';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Weight Loss', 'Muscle Gain', 'Home Workout', 'Yoga'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Workouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const params = new URLSearchParams({ limit: 100 });
      if (category !== 'All') params.set('category', category);
      if (difficulty !== 'All') params.set('difficulty', difficulty);
      if (search) params.set('search', search);
      const res = await api.get(`/workouts?${params}`);
      setWorkouts(res.data);
      setLoading(false);
    };
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [category, difficulty, search]);

  useEffect(() => {
    if (user) {
      api.get('/users/me/bookmarks').then(r => setBookmarks(r.data.map(b => b._id)));
    }
  }, [user]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Library</p>
          <h1 className="font-display text-6xl font-800 text-white">WORKOUTS</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search workouts..."
              className="w-full bg-surface-card border border-surface-border rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  category === c ? 'bg-primary text-white' : 'bg-surface-card border border-surface-border text-white/60 hover:text-white'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Difficulty tabs */}
          <div className="flex gap-2">
            {difficulties.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  difficulty === d ? 'bg-surface-elevated border-primary/50 border text-white' : 'bg-surface-card border border-surface-border text-white/40 hover:text-white/70'
                }`}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-white/40 text-sm mb-6">{loading ? 'Loading...' : `${workouts.length} workouts found`}</p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="card aspect-[3/4] animate-pulse bg-surface-elevated" />
            ))}
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-24 text-white/40">
            <div className="text-5xl mb-4">🏋️</div>
            <p className="font-display text-2xl">No workouts found</p>
            <p className="text-sm mt-2">Try changing your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {workouts.map(w => (
              <WorkoutCard key={w._id} workout={w} bookmarked={bookmarks.includes(w._id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
