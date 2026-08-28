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
  onOpenQuickSwitch?: () => void;
  onOpenLoginModal?: () => void;
}> = ({ onOpenQuickSwitch, onOpenLoginModal }) => {
  const {
    currentUser,
    logout,
    adminProfile,
    notifications,
    setCurrentView,
    firebaseStatus,
    syncToCloud
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
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

          {/* Quick Role Switcher pill */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700/80">
            <button
              onClick={() => onOpenQuickSwitch && onOpenQuickSwitch()}
              className="text-xs px-2.5 py-1 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
              title="Switch role persona"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Role Persona</span>
            </button>
          </div>

          {/* Notifications Button & Dropdown */}
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

          {/* User Profile / Sign In */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700"
              >
                <img
                  src={currentUser.profilePic || '/Abhi Gaundani.jpeg'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover bg-slate-700 border border-blue-500/40"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="text-left hidden md:block pr-1">
                  <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-blue-400 capitalize font-medium flex items-center gap-1">
                    {currentUser.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                    {currentUser.role === 'faculty' && <Briefcase className="w-2.5 h-2.5" />}
                    {currentUser.role === 'student' && <GraduationCap className="w-2.5 h-2.5" />}
                    <span>{currentUser.role === 'admin' ? 'Director' : currentUser.role}</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 text-xs animate-in fade-in">
                  <div className="px-4 py-2.5 border-b border-slate-800">
                    <p className="text-[11px] text-slate-400">Signed in as</p>
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
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

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onOpenLoginModal) onOpenLoginModal();
                    }}
                    className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5 text-blue-400" />
                    <span>Sign in with another account</span>
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
              onClick={() => onOpenLoginModal && onOpenLoginModal()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </header>
  );
};
