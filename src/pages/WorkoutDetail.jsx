import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Zap, Bookmark, BookmarkCheck, CheckCircle, ArrowLeft, User } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function WorkoutDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/workouts/${id}`).then(r => {
      setWorkout(r.data);
      setLoading(false);
    });
    if (user) {
      api.get('/users/me/bookmarks').then(r => {
        setBookmarked(r.data.some(b => b._id === id));
      });
    }
  }, [id, user]);

  const toggleBookmark = async () => {
    if (!user) { window.location.href = '/login'; return; }
    await api.post(`/workouts/${id}/bookmark`);
    setBookmarked(!bookmarked);
  };

  const markComplete = async () => {
    if (!user) { window.location.href = '/login'; return; }
    await api.post(`/workouts/${id}/complete`);
    setCompleted(true);
  };

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!workout) return (
    <div className="min-h-screen pt-24 text-center text-white/40">Workout not found</div>
  );

  const getVideoId = (url) => {
    const match = url?.match(/embed\/([^?]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link to="/workouts" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Workouts
        </Link>

        {/* Video */}
        <div className="card mb-8 overflow-hidden">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={workout.videoUrl}
              title={workout.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge bg-primary/20 text-primary">{workout.category}</span>
              <span className="badge bg-surface-elevated text-white/60">{workout.difficulty}</span>
            </div>
            <h1 className="font-display text-5xl font-800 text-white mb-4">{workout.title}</h1>
            <p className="text-white/60 leading-relaxed mb-6">{workout.description}</p>

            <div className="flex items-center gap-4 text-sm text-white/50 mb-8">
              <span className="flex items-center gap-2"><Clock size={14} /> {workout.duration} minutes</span>
              <span className="flex items-center gap-2"><User size={14} /> {workout.trainer}</span>
              <span className="flex items-center gap-2"><Zap size={14} /> {workout.completions} completions</span>
            </div>

            {/* Tags */}
            {workout.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {workout.tags.map(t => (
                  <span key={t} className="text-xs bg-surface-elevated border border-surface-border px-3 py-1 rounded-full text-white/40">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="card p-6 space-y-4">
              <h3 className="font-display text-xl font-700 text-white">Actions</h3>

              <button
                onClick={markComplete}
                disabled={completed}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${
                  completed
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'btn-primary'
                }`}
              >
                <CheckCircle size={16} />
                {completed ? 'Completed!' : 'Mark as Complete'}
              </button>

              <button
                onClick={toggleBookmark}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-surface-border hover:border-primary/40 font-semibold text-white/70 hover:text-white transition-all"
              >
                {bookmarked ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
                {bookmarked ? 'Bookmarked' : 'Save Workout'}
              </button>
            </div>

            {/* Quick stats */}
            <div className="card p-6">
              <h3 className="font-display text-lg font-700 text-white mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Duration', `${workout.duration} min`],
                  ['Difficulty', workout.difficulty],
                  ['Category', workout.category],
                  ['Trainer', workout.trainer],
                  ['Total Completions', workout.completions?.toLocaleString()]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-white/40">{k}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
