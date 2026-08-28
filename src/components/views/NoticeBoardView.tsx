import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle,
  Send,
  X,
  Filter,
  Sparkles,
  AlertTriangle,
  FileCheck,
  Trophy,
  Award,
  CheckCheck
} from 'lucide-react';
import { NotificationPanel } from '../common/NotificationPanel';

export const NoticeBoardView: React.FC = () => {
  const {
    notifications,
    sendNotification,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    courses,
    currentUser,
    setCurrentView
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<string>('General Notice');
  const [targetProfile, setTargetProfile] = useState<'All' | 'Faculty' | 'Student'>('All');
  const [targetCourse, setTargetCourse] = useState<string>('All');
  const [targetSem, setTargetSem] = useState<number>(1);

  const canPost = currentUser?.role === 'admin' || currentUser?.role === 'faculty';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendNotification({
      userProfile: targetProfile,
      category,
      title: title.trim(),
      message: message.trim(),
      courseCode: targetCourse !== 'All' ? targetCourse : undefined,
      semOrYear: targetCourse !== 'All' ? targetSem : undefined
    });

    setTitle('');
    setMessage('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Intelligence Notice Board</span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-500" />
            <span>Notice Board & Central Alerts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast official circulars, Support Alerts for attendance shortage, OD approvals, and department events.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {canPost && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Circular</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Notification Panel Embedded */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 sm:p-6 shadow-xl">
        <NotificationPanel />
      </div>

      {/* Publish Circular Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Broadcast Announcement</h3>
                  <p className="text-[11px] text-slate-400">Published live to all connected devices</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Notice Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="General Notice">General Circular</option>
                  <option value="Support Alert">⚠️ Attendance / Academic Support Alert</option>
                  <option value="Academic">🎓 Academic / Examination</option>
                  <option value="Events">🏆 Hackathon / Campus Event</option>
                  <option value="OD/Leave">📋 OD & Leave Pass Update</option>
                  <option value="Services">🔧 Facility / Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Announcement Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Final Practical Examinations 2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Audience Target</label>
                  <select
                    value={targetProfile}
                    onChange={e => setTargetProfile(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Campus Users</option>
                    <option value="Faculty">Faculty & Staff Only</option>
                    <option value="Student">Students Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={targetCourse}
                    onChange={e => setTargetCourse(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Departments</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.courseCode}>{c.courseCode}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Full Detailed Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter the official details, instructions, date, time, and guidelines..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
