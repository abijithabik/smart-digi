import React, { useState, useEffect } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LoginModal } from './components/auth/LoginModal';
import { PublicLandingView } from './components/views/PublicLandingView';

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
  const { currentView, currentUser, setCurrentView } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Role-Based Access Control: ensure unauthorized views cannot be accessed
  useEffect(() => {
    if (!currentUser) return;

    if (currentUser.role === 'student') {
      const forbiddenForStudents = ['admin-profile', 'login-history', 'courses', 'subjects', 'faculties'];
      if (forbiddenForStudents.includes(currentView)) {
        setCurrentView('dashboard');
      }
    } else if (currentUser.role === 'faculty') {
      const forbiddenForFaculty = ['admin-profile', 'login-history'];
      if (forbiddenForFaculty.includes(currentView)) {
        setCurrentView('dashboard');
      }
    }
  }, [currentUser, currentView, setCurrentView]);

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
        return currentUser?.role === 'admin' ? <CoursesView /> : <DashboardView />;
      case 'subjects':
        return currentUser?.role === 'admin' ? <SubjectsView /> : <DashboardView />;
      case 'faculties':
        return currentUser?.role === 'admin' || currentUser?.role === 'faculty' ? <FacultiesView /> : <DashboardView />;
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
        return currentUser?.role === 'admin' ? <AdminProfileView /> : <DashboardView />;
      case 'login-history':
        return currentUser?.role === 'admin' ? <LoginHistoryView /> : <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Header */}
      <Header onOpenLoginModal={() => setShowLoginModal(true)} />

      {/* Main Layout */}
      {!currentUser ? (
        // Public Website / Landing Page (Strictly shown when unauthenticated)
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PublicLandingView onOpenLoginModal={() => setShowLoginModal(true)} />
        </div>
      ) : (
        // Authenticated Dashboard Layout with Protected Sidebar and Views
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
            {renderView()}
          </main>
        </div>
      )}

      {/* Google Authentication Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default App;
