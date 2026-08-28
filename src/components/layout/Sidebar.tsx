import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Bell,
  MessageSquare,
  History,
  Settings,
  Sparkles,
  FileCheck,
  Trophy,
  Building2,
  Wrench,
  ShieldAlert
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, currentUser, notifications, odRequests, serviceRequests } = useApp();

  const role = currentUser?.role || 'admin';

  const unreadNotifs = notifications.filter(
    n => currentUser && !n.readBy.includes(currentUser.userId) && (n.userProfile === 'All' || n.userProfile.toLowerCase() === currentUser.role)
  ).length;

  const pendingODsCount = odRequests.filter(r => {
    if (role === 'student') return r.userId === currentUser?.userId && (r.status === 'Submitted' || r.status === 'Under Review');
    return r.status === 'Submitted' || r.status === 'Under Review';
  }).length;

  const pendingTicketsCount = serviceRequests.filter(s => {
    if (role === 'student') return s.userId === currentUser?.userId && s.status !== 'Resolved';
    return s.status === 'Submitted' || s.status === 'Assigned';
  }).length;

  const menuSections = [
    {
      title: 'Main Hub',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
        { id: 'notifications', label: 'Notice Board', icon: Bell, roles: ['admin', 'faculty', 'student'], badge: unreadNotifs },
        { id: 'chat', label: 'Campus Connect Chat', icon: MessageSquare, roles: ['admin', 'faculty', 'student'] },
      ]
    },
    {
      title: 'Campus Ecosystem',
      items: [
        { id: 'od-leave', label: 'OD & Leave Passes', icon: FileCheck, roles: ['admin', 'faculty', 'student'], badge: pendingODsCount },
        { id: 'events', label: 'Hackathons & Events', icon: Trophy, roles: ['admin', 'faculty', 'student'] },
        { id: 'free-slots', label: 'Free-Slot Discovery', icon: Building2, roles: ['admin', 'faculty', 'student'] },
        { id: 'services', label: 'Services & Bonafide', icon: Wrench, roles: ['admin', 'faculty', 'student'], badge: pendingTicketsCount },
      ]
    },
    {
      title: 'Academic Management',
      items: [
        { id: 'courses', label: 'Courses & Wings', icon: BookOpen, roles: ['admin', 'faculty', 'student'] },
        { id: 'subjects', label: 'Curriculum Subjects', icon: FileText, roles: ['admin', 'faculty', 'student'] },
        { id: 'faculties', label: 'Faculty Directory', icon: Users, roles: ['admin', 'faculty', 'student'] },
        { id: 'students', label: 'Student Roster', icon: GraduationCap, roles: ['admin', 'faculty', 'student'] },
        { id: 'attendance', label: 'Attendance Logs', icon: CalendarCheck, roles: ['admin', 'faculty', 'student'] },
        { id: 'marks', label: 'Marks Entry Desk', icon: Award, roles: ['admin', 'faculty'] },
        { id: 'results', label: 'Performance & Report', icon: Award, roles: ['admin', 'faculty', 'student'] },
      ]
    },
    {
      title: 'System & Security',
      items: [
        { id: 'login-history', label: 'Audit Log & History', icon: History, roles: ['admin'] },
        { id: 'admin-profile', label: 'Campus Organization', icon: Settings, roles: ['admin'] },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Banner */}
      <div className="p-4 border-b border-slate-800">
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold shrink-0">
            {role === 'admin' ? 'DIR' : role === 'faculty' ? 'FAC' : 'STU'}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-white truncate">
              {currentUser?.name || 'Guest User'}
            </div>
            <div className="text-[11px] text-amber-400 capitalize flex items-center gap-1 font-medium">
              <Sparkles className="w-3 h-3" />
              <span>{role === 'admin' ? 'Director / Admin' : role === 'faculty' ? 'Faculty Staff' : 'Student Portal'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {menuSections.map(section => {
          const visibleItems = section.items.filter(item => item.roles.includes(role));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} className="space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-1.5">
                {section.title}
              </div>
              {visibleItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
        CampusOne Integrated Ecosystem v2.5
      </div>
    </aside>
  );
};
