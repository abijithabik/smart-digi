import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  GraduationCap,
  Briefcase,
  X,
  CheckCircle,
  ArrowRight,
  UserCheck,
  Mail,
  Lock,
  User,
  Sparkles,
  LogIn,
  UserPlus,
  BookOpen
} from 'lucide-react';
import { UserRole } from '../../types';

export const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    login,
    signInWithGoogleAuth,
    signInWithEmailPass,
    signUpWithEmail,
    quickLogin,
    courses
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Sign in form state
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRollOrId, setSignupRollOrId] = useState('');
  const [signupCourse, setSignupCourse] = useState('IT');
  const [signupSem, setSignupSem] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (emailOrUser.includes('@')) {
        const res = await signInWithEmailPass(emailOrUser, password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => onClose(), 600);
        } else {
          setError(res.message);
        }
      } else {
        // Identifier based login
        const res = login(selectedRole, emailOrUser, password);
        if (res.success) {
          setSuccessMsg(res.message);
          setTimeout(() => onClose(), 600);
        } else {
          setError(res.message);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await signInWithGoogleAuth();
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => onClose(), 600);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError('Please fill in all required registration fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpWithEmail(
        signupEmail.trim(),
        signupPassword.trim(),
        signupName.trim(),
        selectedRole,
        signupRollOrId.trim(),
        signupCourse,
        signupSem
      );
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => onClose(), 600);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Sign up error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                <span>CampusOne AI</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Auth Hub
                </span>
              </div>
              <p className="text-[11px] text-slate-400">One Campus. One Platform. Smarter Student Services.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-3 p-1.5 m-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 rounded-xl font-bold transition-all ${
              mode === 'signin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 rounded-xl font-bold transition-all ${
              mode === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('demo'); setError(null); }}
            className={`py-2 rounded-xl font-bold transition-all ${
              mode === 'demo'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1-Click Demo
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-400 font-medium animate-in fade-in">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 border border-slate-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-slate-900 px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  or sign in with credentials
                </span>
                <div className="border-t border-slate-800 w-full"></div>
              </div>

              {/* Role selector */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setSelectedRole('student'); setEmailOrUser('1001'); setPassword('student@1001'); }}
                  className={`py-2 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedRole === 'student'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('faculty'); setEmailOrUser('101'); setPassword('faculty@101'); }}
                  className={`py-2 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedRole === 'faculty'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Faculty</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedRole('admin'); setEmailOrUser('admin'); setPassword('admin'); }}
                  className={`py-2 text-xs font-semibold rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500 shadow-sm'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Director</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Email or User ID / Roll No
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={emailOrUser}
                    onChange={e => setEmailOrUser(e.target.value)}
                    placeholder={selectedRole === 'admin' ? 'admin or admin@gecbhv.edu.in' : selectedRole === 'faculty' ? '101 or faculty@gecbhv.edu.in' : '1001 or student@gecbhv.edu.in'}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>
          )}

          {/* CREATE ACCOUNT FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              {/* Role selection */}
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Register As</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'faculty', 'admin'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRole(r)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all ${
                        selectedRole === r
                          ? 'bg-blue-600 text-white border-blue-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {r === 'admin' ? 'Director/Admin' : r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">College / Institute Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    placeholder="name@gecbhv.edu.in"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Set Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    {selectedRole === 'student' ? 'Roll Number' : selectedRole === 'faculty' ? 'Faculty ID' : 'Admin Code'}
                  </label>
                  <input
                    type="text"
                    value={signupRollOrId}
                    onChange={e => setSignupRollOrId(e.target.value)}
                    placeholder={selectedRole === 'student' ? '1051' : '106'}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={signupCourse}
                    onChange={e => setSignupCourse(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.courseCode}>{c.courseCode}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              </button>
            </form>
          )}

          {/* 1-CLICK DEMO PERSONA SWITCHER */}
          {mode === 'demo' && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-slate-400">
                Instant one-click presets to test role-based access, attendance logs, OD review, and result dashboards:
              </p>

              <button
                type="button"
                onClick={() => { quickLogin('student', '1001'); onClose(); }}
                className="w-full p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/Abhi Gaundani.jpeg"
                    alt="Student"
                    className="w-9 h-9 rounded-full border border-blue-500/30 object-cover bg-slate-900"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-300">Abhi Gaundani (Student)</div>
                    <div className="text-[10px] text-slate-400">Roll #1001 • IT Engineering Sem 1</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg group-hover:bg-blue-500 flex items-center gap-1">
                  <span>Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => { quickLogin('faculty', '101'); onClose(); }}
                className="w-full p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/Ajay Parmar.png"
                    alt="Faculty"
                    className="w-9 h-9 rounded-full border border-blue-500/30 object-cover bg-slate-900"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-300">Prof. Ajay Parmar (Faculty)</div>
                    <div className="text-[10px] text-slate-400">Faculty ID: 101 • IT Dept Mentor</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg group-hover:bg-blue-500 flex items-center gap-1">
                  <span>Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => { quickLogin('admin'); onClose(); }}
                className="w-full p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-blue-500 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/Admin.png"
                    alt="Director"
                    className="w-9 h-9 rounded-full border border-blue-500/30 object-cover bg-slate-900"
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-blue-300">Campus Director (Super Admin)</div>
                    <div className="text-[10px] text-slate-400">admin@gecbhv.edu.in • Full System Control</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg group-hover:bg-blue-500 flex items-center gap-1">
                  <span>Enter</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
