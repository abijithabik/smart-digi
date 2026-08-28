import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { ChangePasswordModal } from '../common/ChangePasswordModal';

export const Header: React.FC<{ onOpenQuickSwitch?: () => void }> = ({ onOpenQuickSwitch }) => {
  const { currentUser, logout, adminProfile, notifications, setCurrentView, firebaseStatus, syncToCloud } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSyncingManually, setIsSyncingManually] = useState(false);

  const handleManualSync = async () => {
    setIsSyncingManually(true);
    await syncToCloud();
    setTimeout(() => setIsSyncingManually(false), 800);
  };

  const unreadCount = notifications.filter(
    n => currentUser && !n.readBy.includes(currentUser.userId) && (n.userProfile === 'All' || n.userProfile.toLowerCase() === currentUser.role)
  ).length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Branding */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg leading-tight tracking-tight text-white flex items-center gap-2">
              <span>SmartDigi</span>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-medium px-2 py-0.5 rounded-full border border-amber-500/30">
                CMS
              </span>
            </div>
            <div className="text-xs text-slate-400 truncate max-w-xs md:max-w-md">
              {adminProfile.collegeName}
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Firebase Cloud Live Sync Pill */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/80 text-xs">
            <Cloud className={`w-3.5 h-3.5 ${firebaseStatus === 'connected' ? 'text-emerald-400' : firebaseStatus === 'syncing' ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-slate-300 font-medium hidden lg:inline">
              {firebaseStatus === 'connected' ? 'Cloud Synced' : firebaseStatus === 'syncing' ? 'Syncing...' : 'Local Cache'}
            </span>
            <button
              onClick={handleManualSync}
              disabled={isSyncingManually}
              className="text-slate-400 hover:text-amber-400 transition-colors p-0.5"
              title="Sync now to Firebase Firestore"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncingManually ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Quick Role Switcher pill */}
          <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => onOpenQuickSwitch && onOpenQuickSwitch()}
              className="text-xs px-2.5 py-1 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              title="Quickly test another role"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Switch Role</span>
            </button>
          </div>

          {/* Notifications button */}
          <button
            onClick={() => setCurrentView('notifications')}
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notice Board & Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700"
              >
                <img
                  src={currentUser.profilePic || '/Admin.png'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover bg-slate-700 border border-slate-600"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-400 capitalize font-medium flex items-center gap-1">
                    {currentUser.role === 'admin' && <Shield className="w-2.5 h-2.5" />}
                    {currentUser.role === 'faculty' && <Briefcase className="w-2.5 h-2.5" />}
                    {currentUser.role === 'student' && <GraduationCap className="w-2.5 h-2.5" />}
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-xl shadow-xl border border-slate-800 py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
                    <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (currentUser.role === 'admin') setCurrentView('admin-profile');
                      else if (currentUser.role === 'faculty') setCurrentView('faculties');
                      else setCurrentView('students');
                    }}
                    className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowPasswordModal(true);
                    }}
                    className="w-full px-4 py-2 text-left text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Key className="w-4 h-4 text-slate-400" />
                    <span>Change Password</span>
                  </button>

                  <div className="border-t border-slate-800 my-1"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </header>
  );
};
