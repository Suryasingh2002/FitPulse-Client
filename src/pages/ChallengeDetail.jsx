import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, CheckCircle, Trophy } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ChallengeDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [userChallenge, setUserChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/challenges/${id}`).then(r => setChallenge(r.data));
    if (user) {
      api.get('/users/me/challenges').then(r => {
        const uc = r.data.find(u => u.challenge?._id === id);
        setUserChallenge(uc);
      });
    }
    setLoading(false);
  }, [id, user]);

  const joinChallenge = async () => {
    if (!user) { window.location.href = '/login'; return; }
    const res = await api.post(`/challenges/${id}/join`);
    setUserChallenge(res.data);
  };

  const markDay = async (day) => {
    const res = await api.post(`/challenges/${id}/progress`, { day });
    setUserChallenge(res.data);
  };

  if (!challenge) return <div className="min-h-screen pt-24 flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const completedDays = userChallenge?.completedDays || [];
  const isCompleted = userChallenge?.isCompleted;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/challenges" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Challenges
        </Link>

        {/* Hero */}
        <div className="card mb-8 overflow-hidden">
          <div className="relative h-64">
            <img src={challenge.thumbnail} alt={challenge.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <div className="text-5xl mb-2">{challenge.badge}</div>
              <h1 className="font-display text-4xl font-800 text-white">{challenge.title}</h1>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-6 mb-4 text-sm text-white/50">
              <span className="flex items-center gap-2"><Calendar size={14} /> {challenge.duration} Days</span>
              <span className="flex items-center gap-2"><Users size={14} /> {challenge.participants?.toLocaleString()} participants</span>
              <span className="badge bg-primary/20 text-primary ml-0">{challenge.difficulty}</span>
            </div>
            <p className="text-white/60 leading-relaxed">{challenge.description}</p>
          </div>
        </div>

        {/* Action */}
        {!userChallenge ? (
          <div className="card p-8 text-center mb-8">
            <Trophy size={40} className="text-primary mx-auto mb-4" />
            <h2 className="font-display text-3xl font-800 text-white mb-2">Ready to start?</h2>
            <p className="text-white/50 mb-6">Complete all {challenge.duration} days to earn your badge.</p>
            <button onClick={joinChallenge} className="btn-primary px-10">Join Challenge</button>
          </div>
        ) : isCompleted ? (
          <div className="card p-8 text-center mb-8 border-primary/30 glow-pulse">
            <div className="text-6xl mb-4">{challenge.badge}</div>
            <h2 className="font-display text-3xl font-800 text-primary mb-2">Challenge Complete!</h2>
            <p className="text-white/50">Amazing work! You earned the {challenge.title} badge.</p>
          </div>
        ) : null}

        {/* Day tracker */}
        {userChallenge && !isCompleted && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-700 text-white">Daily Tracker</h2>
              <span className="text-primary font-semibold">{completedDays.length}/{challenge.duration} days</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-surface-elevated rounded-full h-2 mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedDays.length / challenge.duration) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: challenge.duration }, (_, i) => i + 1).map(day => {
                const done = completedDays.includes(day);
                const isToday = completedDays.length + 1 === day;
                return (
                  <button
                    key={day}
                    onClick={() => !done && markDay(day)}
                    disabled={done || (!isToday && !completedDays.includes(day - 1) && day > 1)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      done
                        ? 'bg-primary text-white'
                        : isToday
                        ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        : 'bg-surface-elevated text-white/20 cursor-not-allowed'
                    }`}
                  >
                    {done ? <CheckCircle size={16} /> : day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
