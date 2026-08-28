import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, GraduationCap, Briefcase, X, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const RoleSwitcherModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { faculties, students, quickLogin, currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'admin');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <UserCheck className="w-5 h-5 text-amber-500" />
            <span>Interactive Role & Persona Switcher</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-400">
            Switch between different portal personas to test access controls, attendance sheets, marks entry, and student reports.
          </p>

          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedRole('admin')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-md'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Shield className="w-6 h-6" />
              <div className="text-center">
                <div className="text-xs font-bold">Admin Portal</div>
                <div className="text-[10px] text-slate-500">Full System Control</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('faculty')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'faculty'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-md'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <div className="text-center">
                <div className="text-xs font-bold">Faculty Portal</div>
                <div className="text-[10px] text-slate-500">Attendance & Marks</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('student')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'student'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-md'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <div className="text-center">
                <div className="text-xs font-bold">Student Portal</div>
                <div className="text-[10px] text-slate-500">Result & Notices</div>
              </div>
            </button>
          </div>

          {/* List of personas for selected role */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Choose Profile to Impersonate:
            </div>

            {selectedRole === 'admin' && (
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/Admin.png"
                    alt="Admin"
                    className="w-10 h-10 rounded-full border border-amber-500/30 object-cover bg-slate-900"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Super Administrator</div>
                    <div className="text-xs text-slate-400">admin@gecbhv.edu.in • Master Access</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    quickLogin('admin');
                    onClose();
                  }}
                  className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Select</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {selectedRole === 'faculty' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {faculties.map(f => (
                  <div
                    key={f.id}
                    className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={f.profilePic || '/Ajay Parmar.png'}
                        alt={f.facultyName}
                        className="w-9 h-9 rounded-full border border-slate-600 object-cover bg-slate-900"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">{f.facultyName}</div>
                        <div className="text-[11px] text-slate-400">
                          ID: {f.facultyId} • {f.courseCode} Sem {f.semOrYear} ({f.subject})
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        quickLogin('faculty', f.facultyId.toString());
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors"
                    >
                      Login As
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedRole === 'student' && (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {students.map(s => (
                  <div
                    key={s.id}
                    className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 flex items-center justify-between hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={s.profilePic || '/Abhi Gaundani.jpeg'}
                        alt={s.firstName}
                        className="w-9 h-9 rounded-full border border-slate-600 object-cover bg-slate-900"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {s.firstName} {s.lastName} (Roll #{s.rollNumber})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {s.userId} • {s.courseCode} Sem {s.semOrYear}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        quickLogin('student', s.userId);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors"
                    >
                      Login As
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login } = useApp();
  const [role, setRole] = useState<UserRole>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(role, identifier, password);
    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="text-white font-bold text-base">Sign In to Smart Digi College</div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { setRole('admin'); setIdentifier('admin'); setPassword('admin'); }}
              className={`py-2 text-xs font-semibold rounded-xl border ${role === 'admin' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => { setRole('faculty'); setIdentifier('101'); setPassword('faculty@101'); }}
              className={`py-2 text-xs font-semibold rounded-xl border ${role === 'faculty' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => { setRole('student'); setIdentifier('1001'); setPassword('student@1001'); }}
              className={`py-2 text-xs font-semibold rounded-xl border ${role === 'student' ? 'bg-amber-500 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
            >
              Student
            </button>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {role === 'admin' ? 'Username' : role === 'faculty' ? 'Faculty ID or Email' : 'Roll Number or User ID'}
            </label>
            <input
              type="text"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder={role === 'admin' ? 'admin' : role === 'faculty' ? '101' : '1001'}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all"
            >
              Sign In
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
            <strong>Demo Credentials:</strong> Admin: <code className="text-amber-400">admin / admin</code> | Faculty: <code className="text-amber-400">101 / faculty@101</code> | Student: <code className="text-amber-400">1001 / student@1001</code>
          </div>
        </form>
      </div>
    </div>
  );
};
