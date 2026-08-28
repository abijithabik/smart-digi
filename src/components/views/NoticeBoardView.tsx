import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Plus, Trash2, CheckCircle, Send, X, Filter } from 'lucide-react';

export const NoticeBoardView: React.FC = () => {
  const {
    notifications,
    sendNotification,
    deleteNotification,
    markNotificationAsRead,
    courses,
    currentUser
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterProfile, setFilterProfile] = useState<string>('All');

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetProfile, setTargetProfile] = useState<'All' | 'Faculty' | 'Student'>('All');
  const [targetCourse, setTargetCourse] = useState<string>('All');
  const [targetSem, setTargetSem] = useState<number>(1);

  const canPost = currentUser?.role === 'admin' || currentUser?.role === 'faculty';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    sendNotification({
      userProfile: targetProfile,
      title: title.trim(),
      message: message.trim(),
      courseCode: targetCourse !== 'All' ? targetCourse : undefined,
      semOrYear: targetCourse !== 'All' ? targetSem : undefined
    });

    setTitle('');
    setMessage('');
    setIsModalOpen(false);
  };

  const filteredNotifs = notifications.filter(n => {
    if (filterProfile === 'All') return true;
    return n.userProfile === filterProfile;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-amber-500" />
            <span>Campus Notice Board</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Broadcast official circulars, exam dates, academic deadlines, and department alerts.
          </p>
        </div>

        {canPost && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl w-fit">
        {(['All', 'Faculty', 'Student'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterProfile(tab)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterProfile === tab
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'All' ? 'All Notices' : `For ${tab}s`}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotifs.map(notif => {
          const isRead = currentUser && notif.readBy.includes(currentUser.userId);
          return (
            <div
              key={notif.id}
              onClick={() => markNotificationAsRead(notif.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isRead
                  ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5 hover:border-amber-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      notif.userProfile === 'All'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : notif.userProfile === 'Faculty'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    Target: {notif.userProfile}
                  </span>
                  {notif.courseCode && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {notif.courseCode} {notif.semOrYear ? `Sem ${notif.semOrYear}` : ''}
                    </span>
                  )}
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{notif.time}</span>
                  {canPost && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif.id);
                      }}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-white mt-1">{notif.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">{notif.message}</p>
            </div>
          );
        })}

        {filteredNotifs.length === 0 && (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
            No notices available for the selected audience.
          </div>
        )}
      </div>

      {/* Publish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white">Publish Notice / Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['All', 'Faculty', 'Student'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTargetProfile(p)}
                      className={`py-2 text-xs font-semibold rounded-xl border ${
                        targetProfile === p
                          ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {p === 'All' ? 'Everyone' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Notice Headline / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Exam Timetable Announced"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Announcement Message</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Write full circular details..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-800 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
