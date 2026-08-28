import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CalendarCheck,
  Trophy,
  ShieldCheck,
  Building2,
  FileText,
  Bell,
  ArrowRight
} from 'lucide-react';

export const PublicLandingView: React.FC<{ onOpenLoginModal: () => void }> = ({ onOpenLoginModal }) => {
  const { adminProfile, courses, notifications, campusEvents, signInWithGoogleAuth } = useApp();

  const publicNotices = notifications.filter(n => n.userProfile === 'All').slice(0, 3);
  const upcomingEvents = campusEvents.slice(0, 3);

  return (
    <div className="space-y-10 py-4 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>CampusOne AI • Official Institutional Portal</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              One Campus. One Platform. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Smarter Student Services.
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Welcome to {adminProfile.collegeName || 'Government Engineering College Bhavnagar'}. 
              Experience seamless academic management, automated attendance support alerts, On-Duty passes, real-time results, and interactive campus facilities.
            </p>
          </div>

          {/* Primary Action Button: Continue with Google */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => onOpenLoginModal()}
              className="px-8 py-4 bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-900 font-extrabold text-sm rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 border border-slate-200 cursor-pointer group"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="group-hover:text-blue-600 transition-colors">Continue with Google</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Firebase Authenticated</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>Role-Protected Portals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Public Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Academic Departments */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Academic Departments</h3>
              <p className="text-xs text-slate-400">{courses.length} Accredited Engineering Programs</p>
            </div>
          </div>

          <div className="space-y-2">
            {courses.slice(0, 4).map(c => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{c.courseName}</div>
                  <div className="text-[10px] text-slate-400">{c.courseCode} • {c.totalSemOrYear} Semesters</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold">
                  B.Tech
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Public Circulars */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Notice Board</h3>
              <p className="text-xs text-slate-400">Latest campus communications</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {publicNotices.length > 0 ? (
              publicNotices.map(n => (
                <div
                  key={n.id}
                  className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{n.title}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{n.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">No active circulars.</p>
            )}
          </div>
        </div>

        {/* Events & Hackathons */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Campus Hackathons</h3>
              <p className="text-xs text-slate-400">Innovations & Competitions</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {upcomingEvents.map(e => (
              <div
                key={e.id}
                className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{e.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                    {e.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {e.date} • {e.venue}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Access Gate Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-xl space-y-4 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/30">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Ready to access your dashboard?
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Sign in with your Google account to access your attendance records, marksheets, OD leave applications, and support alerts.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onOpenLoginModal()}
            className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 mx-auto border border-slate-200 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};
