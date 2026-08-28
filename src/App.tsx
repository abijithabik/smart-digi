import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RoleSwitcherModal } from './components/auth/RoleSwitcherModal';
import { LoginModal } from './components/auth/LoginModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { CoursesView } from './components/views/CoursesView';
import { SubjectsView } from './components/views/SubjectsView';
import { FacultiesView } from './components/views/FacultiesView';
import { StudentsView } from './components/views/StudentsView';
import { AttendanceView } from './components/views/AttendanceView';
import { MarksView } from './components/views/MarksView';
import { ResultsView } from './components/views/ResultsView';
import { NoticeBoardView } from './components/views/NoticeBoardView';
import { ChatView } from './components/views/ChatView';
import { AdminProfileView } from './components/views/AdminProfileView';
import { LoginHistoryView } from './components/views/LoginHistoryView';
import { ODLeaveView } from './components/views/ODLeaveView';
import { EventsView } from './components/views/EventsView';
import { FreeSlotsView } from './components/views/FreeSlotsView';
import { ServicesView } from './components/views/ServicesView';
import { LogIn, Sparkles, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const { currentView, currentUser, quickLogin } = useApp();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'od-leave':
        return <ODLeaveView />;
      case 'events':
        return <EventsView />;
      case 'free-slots':
        return <FreeSlotsView />;
      case 'services':
        return <ServicesView />;
      case 'courses':
        return <CoursesView />;
      case 'subjects':
        return <SubjectsView />;
      case 'faculties':
        return <FacultiesView />;
      case 'students':
        return <StudentsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'marks':
        return <MarksView />;
      case 'results':
        return <ResultsView />;
      case 'notifications':
        return <NoticeBoardView />;
      case 'chat':
        return <ChatView />;
      case 'admin-profile':
        return <AdminProfileView />;
      case 'login-history':
        return <LoginHistoryView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Header */}
      <Header
        onOpenQuickSwitch={() => setShowRoleSwitcher(true)}
        onOpenLoginModal={() => setShowLoginModal(true)}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {!currentUser ? (
            <div className="p-8 sm:p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl max-w-xl mx-auto my-12 shadow-2xl space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-600/30 font-black">
                <GraduationCap className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Welcome to CampusOne AI
                </h2>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                  One Campus. One Platform. Smarter Student Services. Sign in with your Google account or institute credentials to access attendance, OD passes, marks, and notifications.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Firebase</span>
                </button>

                <button
                  onClick={() => quickLogin('student')}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
                >
                  <span>Quick Demo Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            renderView()
          )}
        </main>
      </div>

      {/* Modals */}
      {showRoleSwitcher && (
        <RoleSwitcherModal onClose={() => setShowRoleSwitcher(false)} />
      )}

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default App;
