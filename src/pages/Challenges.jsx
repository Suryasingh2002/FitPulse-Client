import { useEffect, useState } from 'react';
import api from '../lib/api';
import ChallengeCard from '../components/ui/ChallengeCard';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/challenges').then(r => { setChallenges(r.data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Programs</p>
          <h1 className="font-display text-6xl font-800 text-white">CHALLENGES</h1>
          <p className="text-white/50 mt-4 max-w-xl">Commit to a multi-day program, track your daily progress, and earn a completion badge.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => <div key={i} className="card h-72 animate-pulse bg-surface-elevated" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {challenges.map(c => <ChallengeCard key={c._id} challenge={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
