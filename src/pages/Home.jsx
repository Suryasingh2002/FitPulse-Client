import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Trophy, Users, Zap } from 'lucide-react';
import api from '../lib/api';
import WorkoutCard from '../components/ui/WorkoutCard';
import ChallengeCard from '../components/ui/ChallengeCard';
import { useAuth } from '../context/AuthContext';

const categories = [
  { name: 'Weight Loss', icon: '🔥', description: 'Burn fat, feel light', color: 'from-orange-500/20' },
  { name: 'Muscle Gain', icon: '💪', description: 'Build strength, bulk up', color: 'from-blue-500/20' },
  { name: 'Home Workout', icon: '🏠', description: 'No gym, no problem', color: 'from-green-500/20' },
  { name: 'Yoga', icon: '🧘', description: 'Flex, breathe, balance', color: 'from-purple-500/20' },
];

const stats = [
  { label: 'Active Members', value: '50K+', icon: Users },
  { label: 'Workouts', value: '200+', icon: Zap },
  { label: 'Challenges', value: '30+', icon: Trophy },
  { label: 'Trainers', value: '15+', icon: Flame },
];

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    api.get('/workouts?limit=4').then(r => setWorkouts(r.data));
    api.get('/challenges').then(r => setChallenges(r.data.slice(0, 3)));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-card" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-primary text-sm font-semibold">Premium Fitness Platform</span>
            </div>

            <h1 className="font-display text-7xl md:text-9xl font-900 leading-none tracking-tight mb-6">
              TRAIN
              <br />
              <span className="text-primary">HARDER.</span>
              <br />
              LIVE
              <br />
              <span className="text-white/30">BETTER.</span>
            </h1>

            <p className="text-white/60 text-xl mb-10 max-w-xl leading-relaxed font-body">
              Expert-led workouts, 30-day challenges, and real-time progress tracking — everything you need to transform your fitness journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={user ? '/workouts' : '/register'} className="btn-primary text-center text-lg px-8 py-4 glow-pulse">
                {user ? 'Browse Workouts' : 'Start Free Today'} <ArrowRight className="inline ml-2" size={20} />
              </Link>
              <Link to="/challenges" className="btn-ghost text-center text-lg px-8 py-4">
                View Challenges
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span>SCROLL</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-surface-border bg-surface-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon size={28} className="text-primary mx-auto mb-3" />
                <div className="font-display text-4xl font-800 text-white">{stat.value}</div>
                <div className="text-white/40 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Categories</p>
            <h2 className="font-display text-5xl font-800 text-white">TRAIN YOUR WAY</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link key={cat.name} to={`/workouts?category=${encodeURIComponent(cat.name)}`}
              className={`group card bg-gradient-to-br ${cat.color} to-transparent p-6 hover:border-primary/30 transition-all duration-300 hover:scale-[1.02]`}>
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="font-display text-xl font-700 text-white mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-white/50 text-sm">{cat.description}</p>
              <ArrowRight size={16} className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Workouts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Popular</p>
            <h2 className="font-display text-5xl font-800 text-white">TRENDING WORKOUTS</h2>
          </div>
          <Link to="/workouts" className="btn-ghost py-2 px-5 text-sm hidden md:flex items-center gap-2">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {workouts.map(w => <WorkoutCard key={w._id} workout={w} />)}
        </div>
      </section>

      {/* Challenges */}
      <section className="bg-surface-card border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-3">Challenges</p>
              <h2 className="font-display text-5xl font-800 text-white">PUSH YOUR LIMITS</h2>
            </div>
            <Link to="/challenges" className="btn-ghost py-2 px-5 text-sm hidden md:flex items-center gap-2">
              All Challenges <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {challenges.map(c => <ChallengeCard key={c._id} challenge={c} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="relative card p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="relative">
            <div className="text-5xl mb-6">🏆</div>
            <h2 className="font-display text-5xl md:text-6xl font-800 text-white mb-4">
              READY TO START?
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
              Join thousands already transforming their bodies. Your journey starts with a single rep.
            </p>
            <Link to={user ? '/workouts' : '/register'} className="btn-primary text-lg px-10 py-4">
              {user ? 'Continue Training' : 'Join FitPulse Free'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-display text-2xl font-800 text-white">FIT<span className="text-primary">PULSE</span></span>
            <p className="text-white/30 text-sm">© 2025 FitPulse. Built for champions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
