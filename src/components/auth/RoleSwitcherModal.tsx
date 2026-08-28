import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, GraduationCap, Briefcase, X, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

export const RoleSwitcherModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { faculties, students, quickLogin, currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'student');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-600/30">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
                <span>CampusOne Persona Switcher</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full border border-blue-500/30">
                  Role Simulation
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Switch personas to test real-time permissions & dashboards.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedRole('student')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'student'
                  ? 'border-blue-500 bg-blue-500/15 text-blue-300 shadow-md ring-1 ring-blue-500/30'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <GraduationCap className="w-6 h-6 text-blue-400" />
              <div className="text-center">
                <div className="text-xs font-bold">Student Portal</div>
                <div className="text-[10px] text-slate-500">Attendance, OD & Marks</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('faculty')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'faculty'
                  ? 'border-blue-500 bg-blue-500/15 text-blue-300 shadow-md ring-1 ring-blue-500/30'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Briefcase className="w-6 h-6 text-blue-400" />
              <div className="text-center">
                <div className="text-xs font-bold">Faculty Portal</div>
                <div className="text-[10px] text-slate-500">Take Roll Call & Marks</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('admin')}
              className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                selectedRole === 'admin'
                  ? 'border-blue-500 bg-blue-500/15 text-blue-300 shadow-md ring-1 ring-blue-500/30'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Shield className="w-6 h-6 text-blue-400" />
              <div className="text-center">
                <div className="text-xs font-bold">Director Portal</div>
                <div className="text-[10px] text-slate-500">Campus Master Admin</div>
              </div>
            </button>
          </div>

          {/* List of personas for selected role */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Select Profile Persona:
            </div>

            {selectedRole === 'admin' && (
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/Admin.png"
                    alt="Admin"
                    className="w-10 h-10 rounded-full border border-blue-500/30 object-cover bg-slate-900"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">Campus Director & Super Admin</div>
                    <div className="text-xs text-slate-400">admin@gecbhv.edu.in • Full System Control</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    quickLogin('admin');
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/30"
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
                    className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between hover:border-blue-500/50 transition-colors"
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
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-sm"
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
                    className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 flex items-center justify-between hover:border-blue-500/50 transition-colors"
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
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-sm"
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
