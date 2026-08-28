import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Trophy,
  Award,
  Sparkles,
  Trash2,
  ExternalLink,
  CheckCheck,
  X,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationPanelProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose, isModal = false }) => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    setCurrentView
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [showOnlyUnread, setShowOnlyUnread] = useState<boolean>(false);

  const role = currentUser?.role || 'student';

  // Filter notifications relevant to current role & user
  const relevantNotifications = notifications.filter(n => {
    // Role filter
    if (n.userProfile !== 'All') {
      if (role === 'student' && n.userProfile.toLowerCase() !== 'student') return false;
      if (role === 'faculty' && n.userProfile.toLowerCase() !== 'faculty') return false;
      if (role === 'admin' && n.userProfile.toLowerCase() === 'student' && n.userId) return false;
    }

    // Specific user target filter
    if (n.userId && currentUser && n.userId !== currentUser.userId && role === 'student') {
      return false;
    }

    // Category filter
    if (filterCategory !== 'All') {
      if (filterCategory === 'Support Alert' && n.category !== 'Support Alert' && !n.title.toLowerCase().includes('support') && !n.title.toLowerCase().includes('shortage')) {
        return false;
      }
      if (filterCategory === 'OD/Leave' && n.category !== 'OD/Leave' && !n.title.toLowerCase().includes('od') && !n.title.toLowerCase().includes('leave')) {
        return false;
      }
      if (filterCategory === 'Events' && n.category !== 'Events' && !n.title.toLowerCase().includes('event') && !n.title.toLowerCase().includes('hackathon')) {
        return false;
      }
      if (filterCategory === 'Academic' && n.category !== 'Academic' && !n.title.toLowerCase().includes('marksheet') && !n.title.toLowerCase().includes('result')) {
        return false;
      }
    }

    // Unread filter
    if (showOnlyUnread && currentUser && n.readBy.includes(currentUser.userId)) {
      return false;
    }

    return true;
  });

  const unreadTotal = notifications.filter(
    n => currentUser && !n.readBy.includes(currentUser.userId) && (n.userProfile === 'All' || n.userProfile.toLowerCase() === currentUser.role)
  ).length;

  const handleActionClick = (notif: NotificationItem) => {
    markNotificationAsRead(notif.id);
    if (notif.linkView) {
      setCurrentView(notif.linkView);
      if (onClose) onClose();
    } else if (notif.category === 'Support Alert' || notif.title.toLowerCase().includes('attendance')) {
      setCurrentView('attendance');
      if (onClose) onClose();
    } else if (notif.category === 'OD/Leave' || notif.title.toLowerCase().includes('od')) {
      setCurrentView('od-leave');
      if (onClose) onClose();
    } else if (notif.category === 'Events') {
      setCurrentView('events');
      if (onClose) onClose();
    } else if (notif.category === 'Services') {
      setCurrentView('services');
      if (onClose) onClose();
    }
  };

  const getNotificationIcon = (notif: NotificationItem) => {
    if (notif.category === 'Support Alert' || notif.title.toLowerCase().includes('attendance') || notif.title.toLowerCase().includes('shortage')) {
      return <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />;
    }
    if (notif.category === 'OD/Leave' || notif.title.toLowerCase().includes('od') || notif.title.toLowerCase().includes('pass')) {
      return <FileCheck className="w-5 h-5 text-blue-400 shrink-0" />;
    }
    if (notif.category === 'Events' || notif.title.toLowerCase().includes('hackathon') || notif.title.toLowerCase().includes('event')) {
      return <Trophy className="w-5 h-5 text-amber-400 shrink-0" />;
    }
    if (notif.category === 'Academic' || notif.title.toLowerCase().includes('marksheet') || notif.title.toLowerCase().includes('result')) {
      return <Award className="w-5 h-5 text-emerald-400 shrink-0" />;
    }
    return <Bell className="w-5 h-5 text-blue-400 shrink-0" />;
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col ${isModal ? 'w-full max-w-xl max-h-[85vh]' : 'w-full'}`}>
      {/* Header */}
      <div className="p-4 sm:px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>CampusOne Central Notifications</span>
              {unreadTotal > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                  {unreadTotal} new
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">
              Live updates synced with Firebase Firestore for {role === 'admin' ? 'Director Office' : role === 'faculty' ? 'Faculty Staff' : 'Student Portal'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadTotal > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-blue-300 font-medium rounded-lg transition-colors flex items-center gap-1 border border-slate-700"
              title="Mark all notifications as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills & Filters */}
      <div className="px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Support Alert', 'OD/Leave', 'Events', 'Academic'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat === 'Support Alert' ? '⚠️ Support Alerts' : cat === 'OD/Leave' ? '📋 OD & Leaves' : cat === 'Events' ? '🏆 Events' : cat === 'Academic' ? '🎓 Academic' : 'All Alerts'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowOnlyUnread(!showOnlyUnread)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors flex items-center gap-1.5 ${
            showOnlyUnread
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <Filter className="w-3 h-3" />
          <span>Unread Only</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 divide-y divide-slate-800/60 max-h-[60vh]">
        {relevantNotifications.map(notif => {
          const isRead = currentUser && notif.readBy.includes(currentUser.userId);
          const isSupportAlert = notif.category === 'Support Alert' || notif.title.toLowerCase().includes('support') || notif.title.toLowerCase().includes('shortage');

          return (
            <div
              key={notif.id}
              onClick={() => handleActionClick(notif)}
              className={`pt-3 first:pt-0 p-3.5 rounded-xl border transition-all cursor-pointer group ${
                isRead
                  ? 'bg-slate-850/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                  : isSupportAlert
                  ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500 shadow-md'
                  : 'bg-blue-950/20 border-blue-500/40 hover:border-blue-500 shadow-md'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 shrink-0 mt-0.5">
                    {getNotificationIcon(notif)}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isSupportAlert
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : notif.category === 'OD/Leave'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : notif.category === 'Events'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {notif.category || 'General Notice'}
                      </span>

                      {notif.courseCode && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                          {notif.courseCode} {notif.semOrYear ? `Sem ${notif.semOrYear}` : ''}
                        </span>
                      )}

                      {!isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                      )}

                      <span className="text-[10px] text-slate-400 ml-auto font-mono">
                        {notif.time}
                      </span>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isRead ? 'text-slate-200' : 'text-white'}`}>
                      {notif.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      {notif.message}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px]">
                      <div className="text-blue-400 group-hover:text-blue-300 font-semibold flex items-center gap-1">
                        <span>Click to view details</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>

                      {(currentUser?.role === 'admin' || currentUser?.role === 'faculty') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                          title="Delete notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {relevantNotifications.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-300">No alerts found</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {showOnlyUnread ? 'You are all caught up! No unread notifications.' : 'No announcements matching the selected filter.'}
            </p>
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-slate-400">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span>Real-time Firestore Push Delivery</span>
        </span>
        <button
          onClick={() => {
            if (onClose) onClose();
            setCurrentView('notifications');
          }}
          className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
        >
          View Full Notice Board &rarr;
        </button>
      </div>
    </div>
  );
};
