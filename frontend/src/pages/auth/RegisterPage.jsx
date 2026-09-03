import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Bot, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser({ name: data.name, email: data.email, password: data.password });
    if (result.success) {
      toast.success('Account created! Let\'s get started 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      {/* Brand & Portal Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <Bot className="w-5 h-5 text-cyan-300" />
        </div>
        <div>
          <span className="text-xl font-display font-bold text-white tracking-tight">InterviewAI</span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>NEW CANDIDATE REGISTRATION</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1 tracking-tight">Create Account</h2>
      <p className="text-slate-400 text-xs sm:text-sm mb-5">Start practicing with real-time AI interviewers</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/80" />
            <input
              type="text"
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#080d1a]/85 border border-slate-700/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-inner"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
          </div>
          {errors.name && <p className="text-red-400 text-xs mt-1 font-medium">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/80" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#080d1a]/85 border border-slate-700/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-inner"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
              })}
            />
          </div>
          {errors.email && <p className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/80" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 chars, uppercase & number"
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl bg-[#080d1a]/85 border border-slate-700/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-inner"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must include uppercase, lowercase, and number',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1 font-mono">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/80" />
            <input
              type="password"
              placeholder="Repeat your password"
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-[#080d1a]/85 border border-slate-700/70 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/25 transition-all shadow-inner"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_35px_rgba(6,182,212,0.55)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-cyan-200" />
          )}
          <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline ml-1">
          Sign in
        </Link>
      </p>
    </div>
  );
}
