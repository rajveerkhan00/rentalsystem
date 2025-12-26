'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useTheme } from '../components/ThemeProvider';
import Link from 'next/link';

export default function AdminLogin() {
  useTheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        userType: 'admin', // Specify user type
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push('/AdminDashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setError('Password reset email sent! Check your inbox.');
      setForgotPasswordMode(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eye icon SVG
  const EyeIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );

  // Eye off icon SVG
  const EyeOffIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background Orbs & Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[rgb(var(--primary))]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[rgb(var(--secondary))]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <svg className="w-10 h-10 text-[rgb(var(--primary))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold text-white">
          {forgotPasswordMode ? 'Reset your password' : 'Admin Login'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {forgotPasswordMode ? 'Enter your email to receive a reset link' : 'Access your admin control panel'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        <div className="bg-white/[0.03] backdrop-blur-2xl py-12 px-8 shadow-2xl border border-white/10 rounded-[2rem] relative overflow-hidden group">
          {/* Subtle Glow on Card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[rgb(var(--primary))]/10 rounded-full blur-3xl group-hover:bg-[rgb(var(--primary))]/20 transition-all duration-1000" />

          {forgotPasswordMode ? (
            <form className="space-y-6 relative z-10" onSubmit={handleForgotPassword}>
              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-300 ml-1 mb-2">
                  Email Address
                </label>
                <div className="relative group/input">
                  <input
                    id="resetEmail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 focus:border-[rgb(var(--primary))]/50 transition-all duration-300 font-medium"
                    placeholder="Enter recovery email"
                  />
                  <div className="absolute right-4 top-4 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-[rgb(var(--primary))] hover:brightness-110 disabled:bg-gray-800 rounded-2xl font-bold text-white transition-all duration-300 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending reset link...
                    </span>
                  ) : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(false)}
                  className="w-full py-3 px-6 bg-transparent border border-white/10 hover:border-white/20 rounded-2xl font-medium text-gray-400 hover:text-white transition-all duration-300 text-sm"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
              {error && (
                <div className={`${error.includes('sent') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-[rgb(var(--secondary))]/10 border-[rgb(var(--secondary))]/20 text-[rgb(var(--secondary))]'} px-6 py-4 rounded-2xl border text-sm font-medium animate-in fade-in zoom-in-95 duration-500`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-1 rounded-md ${error.includes('sent') ? 'bg-emerald-500/20' : 'bg-[rgb(var(--secondary))]/20'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    {error}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 ml-1 mb-2">
                  Email Address
                </label>
                <div className="relative group/input">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="appearance-none block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 focus:border-[rgb(var(--primary))]/50 transition-all duration-300 font-medium"
                    placeholder="admin@protocol.com"
                  />
                  <div className="absolute right-5 top-4.5 text-gray-600 transition-colors group-hover/input:text-[rgb(var(--primary))]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 ml-1 mb-2">
                  Password
                </label>
                <div className="relative group/input">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="appearance-none block w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--primary))]/50 focus:border-[rgb(var(--primary))]/50 transition-all duration-300 font-medium pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-[rgb(var(--primary))] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setForgotPasswordMode(true)}
                  className="text-sm font-medium text-gray-400 hover:text-[rgb(var(--primary))] transition-colors duration-300"
                >
                  Forgot your password?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-6 bg-gradient-to-r from-[rgb(var(--gradient-from))] via-[rgb(var(--primary))] to-[rgb(var(--gradient-to))] hover:brightness-110 disabled:from-gray-800 disabled:to-gray-900 rounded-2xl font-bold text-white transition-all duration-300 shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_50px_rgba(var(--primary),0.5)] active:scale-[0.98] group/btn"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}

          {!forgotPasswordMode && (
            <div className="mt-10 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-[#0A0A0A] text-gray-500">
                    Or sign in as
                  </span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/SuperLogin"
                  className="group flex items-center justify-center gap-3 w-full py-3 px-6 bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl text-sm font-bold text-gray-400 hover:text-white transition-all duration-500"
                >
                  <svg className="w-4 h-4 text-[rgb(var(--secondary))] transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Super Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}