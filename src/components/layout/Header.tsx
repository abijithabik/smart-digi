import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  LogOut,
  User,
  Key,
  Shield,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronDown,
  Cloud,
  RefreshCw,
  LogIn,
  Sparkles
} from 'lucide-react';
import { ChangePasswordModal } from '../common/ChangePasswordModal';
import { NotificationPanel } from '../common/NotificationPanel';

export const Header: React.FC<{
  onOpenLoginModal?: () => void;
}> = ({ onOpenLoginModal }) => {
  const {
    currentUser,
    logout,
    adminProfile,
    notifications,
    setCurrentView,
    firebaseStatus,
    syncToCloud,
    signInWithGoogleAuth
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [isSyncingManually, setIsSyncingManually] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificationPanel(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    setIsSyncingManually(true);
    await syncToCloud();
    setTimeout(() => setIsSyncingManually(false), 800);
  };

  const unreadCount = notifications.filter(
    n => currentUser && !n.readBy.includes(currentUser.userId) && (n.userProfile === 'All' || n.userProfile.toLowerCase() === currentUser.role)
  ).length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => setCurrentView('dashboard')}
        >
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 font-black">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-tight tracking-tight text-white flex items-center gap-2">
              <span>CampusOne</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                AI
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-xs md:max-w-md hidden sm:block">
              {adminProfile.collegeName || 'Intelligent Campus Ecosystem'}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Firebase Cloud Live Sync Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/80 text-xs">
            <Cloud className={`w-3.5 h-3.5 ${firebaseStatus === 'connected' ? 'text-emerald-400' : firebaseStatus === 'syncing' ? 'text-blue-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-slate-300 font-medium hidden lg:inline text-[11px]">
              {firebaseStatus === 'connected' ? 'Cloud Synced' : firebaseStatus === 'syncing' ? 'Syncing...' : 'Local Cache'}
            </span>
            <button
              onClick={handleManualSync}
              disabled={isSyncingManually}
              className="text-slate-400 hover:text-blue-400 transition-colors p-0.5"
              title="Sync now to Firebase Firestore"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingManually ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {/* Notifications Button & Dropdown (When logged in) */}
          {currentUser && (
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="CampusOne Central Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center animate-pulse shadow-md shadow-blue-600/40">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel Popover */}
              {showNotificationPanel && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <NotificationPanel onClose={() => setShowNotificationPanel(false)} isModal={false} />
                </div>
              )}
            </div>
          )}

          {/* User Profile / Sign In */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700 bg-slate-900"
              >
                {currentUser.profilePic ? (
                  <img
                    src={currentUser.profilePic}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover bg-slate-700 border border-blue-500/40"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden md:block pr-1">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-blue-400 capitalize font-medium flex items-center gap-1">
                    {currentUser.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                    {currentUser.role === 'faculty' && <Briefcase className="w-2.5 h-2.5" />}
                    {currentUser.role === 'student' && <GraduationCap className="w-2.5 h-2.5" />}
                    <span>{currentUser.role === 'admin' ? 'Director / Admin' : currentUser.role === 'faculty' ? 'Faculty Staff' : 'Student'}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 text-xs animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-[11px] text-slate-400">Authenticated via Google</p>
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-semibold">
                      UID: {currentUser.userId.slice(0, 10)}...
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (currentUser.role === 'admin') setCurrentView('admin-profile');
                      else if (currentUser.role === 'faculty') setCurrentView('faculties');
                      else setCurrentView('students');
                    }}
                    className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>View Profile</span>
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                if (onOpenLoginModal) onOpenLoginModal();
                else signInWithGoogleAuth();
              }}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 border border-slate-200"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
