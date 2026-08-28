import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  FileText,
  Users,
  GraduationCap,
  CalendarCheck,
  Award,
  Bell,
  ArrowRight,
  TrendingUp,
  Activity,
  Sparkles,
  School,
  Clock,
  Trophy,
  FileCheck,
  Building2,
  Wrench,
  CheckCircle2,
  Flame,
  Check
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    courses,
    subjects,
    faculties,
    students,
    attendance,
    marks,
    notifications,
    loginHistory,
    odRequests,
    campusEvents,
    campusSlots,
    serviceRequests,
    registerForEvent,
    setCurrentView
  } = useApp();

  const role = currentUser?.role || 'admin';

  // Stats
  const totalCourses = courses.length;
  const totalSubjects = subjects.length;
  const totalFaculties = faculties.length;
  const totalStudents = students.length;

  // Calculate attendance overall rate
  const totalAttRecords = attendance.length;
  const presentCount = attendance.filter(a => a.present).length;
  const attendanceRate = totalAttRecords > 0 ? Math.round((presentCount / totalAttRecords) * 100) : 100;

  // Student specific stats
  const studentData = currentUser?.studentData;
  const myAttendance = studentData
    ? attendance.filter(a => a.rollNumber === studentData.rollNumber)
    : [];
  const myPresentCount = myAttendance.filter(a => a.present).length;
  const myAttendanceRate = myAttendance.length > 0 ? Math.round((myPresentCount / myAttendance.length) * 100) : 100;

  const myMarks = studentData
    ? marks.filter(m => m.rollNumber === studentData.rollNumber)
    : [];

  // OD stats
  const pendingODs = odRequests.filter(r => r.status === 'Submitted' || r.status === 'Under Review');
  const myODs = odRequests.filter(r => r.userId === currentUser?.userId || r.rollNumber === studentData?.rollNumber);

  // Free slots available
  const currentFreeSlots = campusSlots.filter(s => s.isFree);

  // Recommendations
  const recommendedEvents = campusEvents.filter(e => e.isRecommended);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 md:p-8 border border-slate-700 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CampusOne AI • Connected Ecosystem</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name}!
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              {role === 'admin' && 'You have master administrative authority across faculties, departments, enrollment, OD approvals, and facility management.'}
              {role === 'faculty' && `Assigned Department: ${currentUser?.courseCode || 'IT'} (Sem ${currentUser?.semOrYear || 1}). Review student OD applications, record marks, and monitor free laboratory slots.`}
              {role === 'student' && `Department of ${studentData?.courseCode || 'IT'} Engineering, Semester ${studentData?.semOrYear || 1}. Track your academic performance, apply for On-Duty passes, and discover workshops.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {role === 'student' && (
              <>
                <button
                  onClick={() => setCurrentView('od-leave')}
                  className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-lg transition-all flex items-center gap-2 shrink-0"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Apply for OD / Leave</span>
                </button>
                <button
                  onClick={() => setCurrentView('events')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-2 shrink-0"
                >
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Explore Hackathons</span>
                </button>
              </>
            )}

            {role === 'faculty' && (
              <>
                <button
                  onClick={() => setCurrentView('od-leave')}
                  className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-lg transition-all flex items-center gap-2 shrink-0"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Review OD Requests ({pendingODs.length})</span>
                </button>
                <button
                  onClick={() => setCurrentView('attendance')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-2 shrink-0"
                >
                  <CalendarCheck className="w-4 h-4 text-amber-400" />
                  <span>Take Attendance</span>
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => setCurrentView('od-leave')}
                  className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-lg transition-all flex items-center gap-2 shrink-0"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>OD Approval Desk</span>
                </button>
                <button
                  onClick={() => setCurrentView('students')}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-2 shrink-0"
                >
                  <span>Manage Enrollment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Role Action Alert Banners */}
      {role === 'student' && myODs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Latest OD Application: {myODs[0].requestId} ({myODs[0].category})
              </div>
              <div className="text-[11px] text-slate-400">
                Status: <strong className="text-amber-400">{myODs[0].status}</strong> {myODs[0].reviewRemarks ? `• "${myODs[0].reviewRemarks}"` : ''}
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('od-leave')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Track Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {(role === 'faculty' || role === 'admin') && pendingODs.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300">
                {pendingODs.length} Student On-Duty & Leave Request(s) Awaiting Review
              </div>
              <div className="text-[11px] text-slate-300">
                Verify student proofs and authorize attendance exemptions for hackathons and symposiums.
              </div>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('od-leave')}
            className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-amber-400 transition-colors"
          >
            Review Now
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === 'admin' ? (
          <>
            <div
              onClick={() => setCurrentView('courses')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Total Courses</p>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">{totalCourses}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{totalSubjects} Active Subjects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('faculties')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Faculty Members</p>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">{totalFaculties}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Professors & Instructors</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('students')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Enrolled Students</p>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">{totalStudents}</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>All Departments</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('free-slots')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Free Campus Rooms</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">{currentFreeSlots.length} Available</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Block A, B, C & Central</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </>
        ) : role === 'faculty' ? (
          <>
            <div
              onClick={() => setCurrentView('subjects')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">My Subject</p>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-400 transition-colors truncate max-w-[150px]">
                    {currentUser?.facultyData?.subject || 'Programming C'}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{currentUser?.courseCode} - Sem {currentUser?.semOrYear}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('students')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Class Students</p>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                    {students.filter(s => s.courseCode === currentUser?.courseCode && s.semOrYear === currentUser?.semOrYear).length}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Registered Students</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('od-leave')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-400">OD Review Queue</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{pendingODs.length} Pending</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FileCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Approve Attendance Waivers</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('free-slots')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">Free Lab Slots</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">{currentFreeSlots.length} Free</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Extra Practical Sessions</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => setCurrentView('attendance')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">My Attendance</p>
                  <h3 className="text-2xl font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">{myAttendanceRate}%</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{myPresentCount} / {myAttendance.length} Lectures</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('events')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-400">Hackathons & Events</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{campusEvents.length} Active</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>{recommendedEvents.length} Matched to Your Track</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('od-leave')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400">My OD & Leaves</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{myODs.length} Filed</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>On-Duty & Medical Passes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div
              onClick={() => setCurrentView('free-slots')}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-emerald-400">Free Rooms Now</p>
                  <h3 className="text-2xl font-bold text-emerald-400 mt-1">{currentFreeSlots.length} Available</h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Study & Project Spaces</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Personalized Hackathon / Workshop Recommendations Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-white">Curated Competitions & Workshop Recommendations</h2>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
              For {currentUser?.courseCode || 'IT'} Track
            </span>
          </div>
          <button
            onClick={() => setCurrentView('events')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>View All ({campusEvents.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedEvents.slice(0, 2).map((event) => {
            const isRegistered = currentUser ? event.registeredUsers.includes(currentUser.userId) : false;
            return (
              <div
                key={event.id}
                className="bg-slate-800/60 border border-slate-700/60 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {event.category}
                    </span>
                    {event.prizePool && (
                      <span className="text-xs font-bold text-emerald-400">
                        {event.prizePool}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm">{event.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{event.description}</p>
                </div>

                <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-700/60 text-xs">
                  <span className="text-slate-400">{event.date} • {event.location}</span>
                  <button
                    onClick={() => registerForEvent(event.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      isRegistered
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {isRegistered ? <Check className="w-3 h-3" /> : null}
                    <span>{isRegistered ? 'Enrolled' : 'Register'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dual Section: Notice Board & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notice Board Preview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Recent College Announcements</h2>
            </div>
            <button
              onClick={() => setCurrentView('notifications')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {notifications.slice(0, 3).map(notif => (
              <div
                key={notif.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {notif.userProfile}
                  </span>
                  <span className="text-[11px] text-slate-400">{notif.time}</span>
                </div>
                <h4 className="text-sm font-semibold text-white mt-1">{notif.title}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{notif.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Audit / Login Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-white">Recent Logins</h2>
            </div>
            {role === 'admin' && (
              <button
                onClick={() => setCurrentView('login-history')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
              >
                Audit Log
              </button>
            )}
          </div>

          <div className="space-y-3">
            {loginHistory.slice(0, 5).map(hist => (
              <div key={hist.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
                    {hist.userProfile[0]}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-medium text-white truncate">{hist.userName}</p>
                    <p className="text-[10px] text-slate-400">{hist.userProfile} • {hist.userId}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0 ml-2">{hist.loginTime.split(',')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
