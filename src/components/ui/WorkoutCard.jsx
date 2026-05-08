import { Link } from 'react-router-dom';
import { Clock, Zap, Bookmark, BookmarkCheck } from 'lucide-react';
import { useState } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const categoryColors = {
  'Weight Loss': 'tag-weight',
  'Muscle Gain': 'tag-muscle',
  'Home Workout': 'tag-home',
  'Yoga': 'tag-yoga'
};

const difficultyColors = {
  'Beginner': 'tag-beginner',
  'Intermediate': 'tag-intermediate',
  'Advanced': 'tag-advanced'
};

export default function WorkoutCard({ workout, bookmarked: initialBookmarked }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const toggleBookmark = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    setLoading(true);
    try {
      await api.post(`/workouts/${workout._id}/bookmark`);
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Link to={`/workouts/${workout._id}`} className="group card block hover:border-primary/30 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={workout.thumbnail || `https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600`}
          alt={workout.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <button
          onClick={toggleBookmark}
          disabled={loading}
          className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur rounded-lg hover:bg-black/60 transition-colors"
        >
          {bookmarked
            ? <BookmarkCheck size={16} className="text-primary" />
            : <Bookmark size={16} className="text-white" />
          }
        </button>
        <div className="absolute bottom-3 left-3">
          <span className={`badge ${categoryColors[workout.category] || 'bg-white/10 text-white'}`}>
            {workout.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-700 text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {workout.title}
        </h3>
        <p className="text-white/50 text-sm mb-3 line-clamp-2">{workout.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white/50 text-xs">
              <Clock size={12} /> {workout.duration} min
            </span>
            <span className={`badge text-xs ${difficultyColors[workout.difficulty] || ''}`}>
              {workout.difficulty}
            </span>
          </div>
          <span className="text-white/40 text-xs">{workout.trainer}</span>
        </div>
      </div>
    </Link>
  );
}
