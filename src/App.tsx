import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RoleSwitcherModal, LoginModal } from './components/auth/RoleSwitcherModal';

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

export const App: React.FC = () => {
  const { currentView, currentUser } = useApp();
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Global Header */}
      <Header onOpenQuickSwitch={() => setShowRoleSwitcher(true)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {renderView()}
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
