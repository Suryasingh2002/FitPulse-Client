import { Link } from 'react-router-dom';
import { Users, Calendar } from 'lucide-react';

export default function ChallengeCard({ challenge }) {
  return (
    <Link to={`/challenges/${challenge._id}`} className="group card block hover:border-primary/30 transition-all duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={challenge.thumbnail || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600'}
          alt={challenge.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 text-3xl">{challenge.badge}</div>
        <div className="absolute bottom-3 left-3">
          <span className="badge bg-primary/20 text-primary">{challenge.duration}-Day Challenge</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-700 text-white mb-1 group-hover:text-primary transition-colors">
          {challenge.title}
        </h3>
        <p className="text-white/50 text-sm mb-3 line-clamp-2">{challenge.description}</p>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span className="flex items-center gap-1.5"><Calendar size={12} /> {challenge.duration} days</span>
          <span className="flex items-center gap-1.5"><Users size={12} /> {challenge.participants?.toLocaleString()} joined</span>
        </div>
      </div>
    </Link>
  );
}
