import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Mode } from '../types';
import { signIn } from '../store';
import { VersionTag } from './VersionTag';
import { SparkBackground } from './SparkBackground';

interface SignInProps {
  mode: Mode;
}

export function SignIn({ mode }: SignInProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username.trim().length < 2) {
      setError('Username needs at least 2 characters! ⚡');
      return;
    }
    if (password.length < 3) {
      setError('Password needs at least 3 characters! 🔒');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn(username.trim(), password, mode);
      if (result.success) {
        setShowSuccess(result.isNew ? 'Account created! Welcome aboard! 🎉' : `Welcome back, ${username}! ⚡`);
        setTimeout(() => {
          navigate('/setup');
        }, 1200);
      } else {
        setError(result.error || 'Something went wrong!');
      }
    } catch {
      setError('Oops! Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  const modeEmoji = mode === 'home' ? '🏠' : '🏫';
  const modeLabel = mode === 'home' ? 'Home' : 'School';
  const modeColor = mode === 'home' ? 'blue' : 'green';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <SparkBackground />
      <VersionTag />

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Mode badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6
          ${modeColor === 'blue' ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300' : 'bg-green-500/20 border border-green-400/30 text-green-300'}
        `}>
          <span className="text-xl">{modeEmoji}</span>
          <span className="font-bold text-sm">{modeLabel} Mode</span>
        </div>

        {/* Title */}
        <div className="text-5xl mb-4 animate-float select-none">🔌</div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-2">
          Plug In!
        </h1>
        <p className="text-cyan-200/60 text-center mb-8">
          Enter a username & password to get started
        </p>

        {/* Success overlay */}
        {showSuccess && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-3xl">
            <div className="text-center animate-celebrate">
              <div className="text-6xl mb-4">⚡</div>
              <p className="text-2xl font-extrabold text-green-400">{showSuccess}</p>
            </div>
          </div>
        )}

        {/* Sign in form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-cyan-200/80 font-semibold text-sm mb-2 ml-1">
              ⚡ Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a cool name..."
              autoComplete="off"
              autoFocus
              className="w-full px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm
                border-2 border-white/10 text-white text-lg font-bold
                placeholder:text-white/30 placeholder:font-normal
                focus:outline-none focus:border-cyan-400/50 focus:bg-white/15
                transition-all duration-200"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-cyan-200/80 font-semibold text-sm mb-2 ml-1">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Make it memorable..."
              autoComplete="off"
              className="w-full px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-sm
                border-2 border-white/10 text-white text-lg font-bold
                placeholder:text-white/30 placeholder:font-normal
                focus:outline-none focus:border-cyan-400/50 focus:bg-white/15
                transition-all duration-200"
              maxLength={30}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3 text-red-300 text-center font-medium animate-zap">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-extrabold text-xl
              transition-all duration-200 transform
              ${loading
                ? 'bg-gray-600 text-gray-400 cursor-wait'
                : `bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500
                   text-gray-900 shadow-xl shadow-yellow-500/30
                   hover:scale-[1.02] active:scale-95 hover:shadow-yellow-500/50`
              }
              border-2 border-yellow-300/30`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⚡</span> Connecting...
              </span>
            ) : (
              '⚡ Power On! ⚡'
            )}
          </button>
        </form>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mt-6 text-cyan-300/50 hover:text-cyan-300/80 text-sm font-medium transition-colors"
        >
          ← Back to mode select
        </button>

        {/* Info */}
        <div className="mt-8 text-center">
          <p className="text-cyan-300/25 text-xs">
            🔒 No personal data stored • Just a username & password
          </p>
          <p className="text-cyan-300/20 text-xs mt-1">
            New user? Your account will be created automatically!
          </p>
        </div>
      </div>
    </div>
  );
}
