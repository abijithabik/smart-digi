import React from 'react';
import { useApp } from '../../context/AppContext';
import { History, Shield, Users, GraduationCap } from 'lucide-react';

export const LoginHistoryView: React.FC = () => {
  const { loginHistory } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <History className="w-6 h-6 text-amber-500" />
          <span>Security & Login Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical log of authenticated sessions, credentials verification, and portal access timestamps.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User Role</th>
                <th className="px-5 py-3.5">User Name</th>
                <th className="px-5 py-3.5">Identifier / User ID</th>
                <th className="px-5 py-3.5">Department / Cohort</th>
                <th className="px-5 py-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {loginHistory.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
                        item.userProfile === 'Admin'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : item.userProfile === 'Faculty'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}
                    >
                      {item.userProfile === 'Admin' && <Shield className="w-2.5 h-2.5" />}
                      {item.userProfile === 'Faculty' && <Users className="w-2.5 h-2.5" />}
                      {item.userProfile === 'Student' && <GraduationCap className="w-2.5 h-2.5" />}
                      <span>{item.userProfile}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3 font-semibold text-white">{item.userName}</td>
                  <td className="px-5 py-3 font-mono text-slate-400">{item.userId}</td>
                  <td className="px-5 py-3">
                    {item.courseCode ? (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        {item.courseCode} {item.semOrYear ? `Sem ${item.semOrYear}` : ''}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-slate-400">{item.loginTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
