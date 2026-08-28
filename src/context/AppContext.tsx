import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  AdminProfile,
  Course,
  Subject,
  Faculty,
  Student,
  AttendanceRecord,
  MarksRecord,
  NotificationItem,
  ChatMessage,
  UserLoginHistory,
  CurrentUser,
  UserRole,
  ODRequest,
  ODStatus,
  CampusEvent,
  CampusSlot,
  ServiceRequest,
  ServiceStatus,
  CertificateRequest,
  CertificateStatus
} from '../types';
import {
  initialAdminProfile,
  initialCourses,
  initialSubjects,
  initialFaculties,
  initialStudents,
  initialAttendance,
  initialMarks,
  initialNotifications,
  initialChatMessages,
  initialLoginHistory,
  initialODRequests,
  initialCampusEvents,
  initialCampusSlots,
  initialServiceRequests,
  initialCertificateRequests
} from '../data/initialData';
import {
  db,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from '../lib/firebase';

interface AppContextType {
  currentUser: CurrentUser | null;
  currentView: string;
  setCurrentView: (view: string) => void;
  login: (role: UserRole, identifier: string, pass: string) => { success: boolean; message: string };
  logout: () => void;
  quickLogin: (role: UserRole, id?: string) => void;
  
  // Cloud & Firebase status
  firebaseStatus: 'connected' | 'syncing' | 'offline';
  syncToCloud: () => Promise<void>;

  // Data
  adminProfile: AdminProfile;
  courses: Course[];
  subjects: Subject[];
  faculties: Faculty[];
  students: Student[];
  attendance: AttendanceRecord[];
  marks: MarksRecord[];
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  loginHistory: UserLoginHistory[];
  declaredResults: Record<string, boolean>;
  odRequests: ODRequest[];
  campusEvents: CampusEvent[];
  campusSlots: CampusSlot[];
  serviceRequests: ServiceRequest[];
  certificateRequests: CertificateRequest[];

  // Actions
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  updateFaculty: (id: string, faculty: Partial<Faculty>) => void;
  deleteFaculty: (id: string) => void;

  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  recordAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;
  saveMarks: (marksList: Omit<MarksRecord, 'id'>[]) => void;
  toggleResultDeclaration: (courseCode: string, semOrYear: number) => void;

  sendNotification: (notif: Omit<NotificationItem, 'id' | 'time' | 'readBy'>) => void;
  deleteNotification: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  sendChatMessage: (msg: { toUserId: string; message: string; isGroup?: boolean; attachment?: any }) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message: string };

  // OD & Leave Actions
  submitODRequest: (req: Omit<ODRequest, 'id' | 'requestId' | 'status' | 'submittedAt'>) => void;
  updateODStatus: (id: string, status: ODStatus, remarks?: string) => void;

  // Campus Events Actions
  registerForEvent: (eventId: string) => void;

  // Campus Free Slots Actions
  toggleSlotAvailability: (id: string) => void;

  // Service Requests / Complaints Actions
  submitServiceRequest: (req: Omit<ServiceRequest, 'id' | 'ticketId' | 'status' | 'createdAt'>) => void;
  updateServiceRequestStatus: (id: string, status: ServiceStatus, resolutionNote?: string, assignedTo?: string) => void;

  // Certificates Actions
  submitCertificateRequest: (req: Omit<CertificateRequest, 'id' | 'certNumber' | 'status' | 'requestedDate'>) => void;
  updateCertificateStatus: (id: string, status: CertificateStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseStatus, setFirebaseStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');
  const isInitialCloudSyncDone = useRef(false);

  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem('co_adminProfile');
    return saved ? JSON.parse(saved) : initialAdminProfile;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('co_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('co_subjects');
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [faculties, setFaculties] = useState<Faculty[]>(() => {
    const saved = localStorage.getItem('co_faculties');
    return saved ? JSON.parse(saved) : initialFaculties;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('co_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('co_attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [marks, setMarks] = useState<MarksRecord[]>(() => {
    const saved = localStorage.getItem('co_marks');
    return saved ? JSON.parse(saved) : initialMarks;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('co_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('co_chatMessages');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  const [loginHistory, setLoginHistory] = useState<UserLoginHistory[]>(() => {
    const saved = localStorage.getItem('co_loginHistory');
    return saved ? JSON.parse(saved) : initialLoginHistory;
  });

  const [declaredResults, setDeclaredResults] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('co_declaredResults');
    return saved ? JSON.parse(saved) : { 'IT_1': true, 'CE_1': false };
  });

  const [odRequests, setOdRequests] = useState<ODRequest[]>(() => {
    const saved = localStorage.getItem('co_odRequests');
    return saved ? JSON.parse(saved) : initialODRequests;
  });

  const [campusEvents, setCampusEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('co_campusEvents');
    return saved ? JSON.parse(saved) : initialCampusEvents;
  });

  const [campusSlots, setCampusSlots] = useState<CampusSlot[]>(() => {
    const saved = localStorage.getItem('co_campusSlots');
    return saved ? JSON.parse(saved) : initialCampusSlots;
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    const saved = localStorage.getItem('co_serviceRequests');
    return saved ? JSON.parse(saved) : initialServiceRequests;
  });

  const [certificateRequests, setCertificateRequests] = useState<CertificateRequest[]>(() => {
    const saved = localStorage.getItem('co_certificateRequests');
    return saved ? JSON.parse(saved) : initialCertificateRequests;
  });

  // Active User session
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    const saved = localStorage.getItem('co_currentUser');
    if (saved) return JSON.parse(saved);
    const student = initialStudents[0];
    return {
      role: 'student',
      userId: student.userId,
      name: `${student.firstName} ${student.lastName}`,
      email: student.emailId,
      profilePic: student.profilePic || '/Abhi Gaundani.jpeg',
      courseCode: student.courseCode,
      semOrYear: student.semOrYear,
      studentData: student
    };
  });

  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Sync to local storage
  useEffect(() => { localStorage.setItem('co_adminProfile', JSON.stringify(adminProfile)); }, [adminProfile]);
  useEffect(() => { localStorage.setItem('co_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('co_subjects', JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { localStorage.setItem('co_faculties', JSON.stringify(faculties)); }, [faculties]);
  useEffect(() => { localStorage.setItem('co_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('co_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('co_marks', JSON.stringify(marks)); }, [marks]);
  useEffect(() => { localStorage.setItem('co_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('co_chatMessages', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('co_loginHistory', JSON.stringify(loginHistory)); }, [loginHistory]);
  useEffect(() => { localStorage.setItem('co_declaredResults', JSON.stringify(declaredResults)); }, [declaredResults]);
  useEffect(() => { localStorage.setItem('co_odRequests', JSON.stringify(odRequests)); }, [odRequests]);
  useEffect(() => { localStorage.setItem('co_campusEvents', JSON.stringify(campusEvents)); }, [campusEvents]);
  useEffect(() => { localStorage.setItem('co_campusSlots', JSON.stringify(campusSlots)); }, [campusSlots]);
  useEffect(() => { localStorage.setItem('co_serviceRequests', JSON.stringify(serviceRequests)); }, [serviceRequests]);
  useEffect(() => { localStorage.setItem('co_certificateRequests', JSON.stringify(certificateRequests)); }, [certificateRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('co_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('co_currentUser');
    }
  }, [currentUser]);

  // Push dataset to Firestore (for initial seed or force sync)
  const syncToCloud = useCallback(async () => {
    try {
      setFirebaseStatus('syncing');
      await setDoc(doc(db, 'adminProfile', 'main'), adminProfile);

      for (const c of courses) { await setDoc(doc(db, 'courses', c.id), c); }
      for (const s of subjects) { await setDoc(doc(db, 'subjects', s.id), s); }
      for (const f of faculties) { await setDoc(doc(db, 'faculties', f.id), f); }
      for (const st of students) { await setDoc(doc(db, 'students', st.id), st); }
      for (const att of attendance) { await setDoc(doc(db, 'attendance', att.id), att); }
      for (const m of marks) { await setDoc(doc(db, 'marks', m.id), m); }
      for (const n of notifications) { await setDoc(doc(db, 'notifications', n.id), n); }
      for (const msg of chatMessages) { await setDoc(doc(db, 'messages', msg.id), msg); }
      for (const od of odRequests) { await setDoc(doc(db, 'odRequests', od.id), od); }
      for (const ev of campusEvents) { await setDoc(doc(db, 'events', ev.id), ev); }
      for (const sl of campusSlots) { await setDoc(doc(db, 'slots', sl.id), sl); }
      for (const sr of serviceRequests) { await setDoc(doc(db, 'serviceRequests', sr.id), sr); }
      for (const cr of certificateRequests) { await setDoc(doc(db, 'certificates', cr.id), cr); }

      setFirebaseStatus('connected');
    } catch (err) {
      console.warn('Firebase push sync note:', err);
      setFirebaseStatus('connected');
    }
  }, [adminProfile, courses, subjects, faculties, students, attendance, marks, notifications, chatMessages, odRequests, campusEvents, campusSlots, serviceRequests, certificateRequests]);

  // Setup Real-time Firestore Listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    try {
      // 1. Admin Profile
      unsubs.push(
        onSnapshot(doc(db, 'adminProfile', 'main'), (snapshot) => {
          if (snapshot.exists()) {
            setAdminProfile(snapshot.data() as AdminProfile);
          } else if (!isInitialCloudSyncDone.current) {
            setDoc(doc(db, 'adminProfile', 'main'), initialAdminProfile).catch(() => {});
          }
          setFirebaseStatus('connected');
        }, (err) => {
          console.warn('Firestore snapshot error on adminProfile:', err);
          setFirebaseStatus('offline');
        })
      );

      // 2. Courses
      unsubs.push(
        onSnapshot(collection(db, 'courses'), (snapshot) => {
          if (!snapshot.empty) {
            const list: Course[] = [];
            snapshot.forEach((d) => list.push(d.data() as Course));
            setCourses(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialCourses.forEach((c) => setDoc(doc(db, 'courses', c.id), c).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 3. Subjects
      unsubs.push(
        onSnapshot(collection(db, 'subjects'), (snapshot) => {
          if (!snapshot.empty) {
            const list: Subject[] = [];
            snapshot.forEach((d) => list.push(d.data() as Subject));
            setSubjects(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialSubjects.forEach((s) => setDoc(doc(db, 'subjects', s.id), s).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 4. Faculties
      unsubs.push(
        onSnapshot(collection(db, 'faculties'), (snapshot) => {
          if (!snapshot.empty) {
            const list: Faculty[] = [];
            snapshot.forEach((d) => list.push(d.data() as Faculty));
            setFaculties(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialFaculties.forEach((f) => setDoc(doc(db, 'faculties', f.id), f).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 5. Students
      unsubs.push(
        onSnapshot(collection(db, 'students'), (snapshot) => {
          if (!snapshot.empty) {
            const list: Student[] = [];
            snapshot.forEach((d) => list.push(d.data() as Student));
            setStudents(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialStudents.forEach((st) => setDoc(doc(db, 'students', st.id), st).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 6. OD Requests
      unsubs.push(
        onSnapshot(collection(db, 'odRequests'), (snapshot) => {
          if (!snapshot.empty) {
            const list: ODRequest[] = [];
            snapshot.forEach((d) => list.push(d.data() as ODRequest));
            setOdRequests(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialODRequests.forEach((od) => setDoc(doc(db, 'odRequests', od.id), od).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 7. Campus Events
      unsubs.push(
        onSnapshot(collection(db, 'events'), (snapshot) => {
          if (!snapshot.empty) {
            const list: CampusEvent[] = [];
            snapshot.forEach((d) => list.push(d.data() as CampusEvent));
            setCampusEvents(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialCampusEvents.forEach((ev) => setDoc(doc(db, 'events', ev.id), ev).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 8. Campus Slots
      unsubs.push(
        onSnapshot(collection(db, 'slots'), (snapshot) => {
          if (!snapshot.empty) {
            const list: CampusSlot[] = [];
            snapshot.forEach((d) => list.push(d.data() as CampusSlot));
            setCampusSlots(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialCampusSlots.forEach((sl) => setDoc(doc(db, 'slots', sl.id), sl).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 9. Service Requests
      unsubs.push(
        onSnapshot(collection(db, 'serviceRequests'), (snapshot) => {
          if (!snapshot.empty) {
            const list: ServiceRequest[] = [];
            snapshot.forEach((d) => list.push(d.data() as ServiceRequest));
            setServiceRequests(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialServiceRequests.forEach((sr) => setDoc(doc(db, 'serviceRequests', sr.id), sr).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 10. Certificates
      unsubs.push(
        onSnapshot(collection(db, 'certificates'), (snapshot) => {
          if (!snapshot.empty) {
            const list: CertificateRequest[] = [];
            snapshot.forEach((d) => list.push(d.data() as CertificateRequest));
            setCertificateRequests(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialCertificateRequests.forEach((cr) => setDoc(doc(db, 'certificates', cr.id), cr).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 11. Notifications
      unsubs.push(
        onSnapshot(collection(db, 'notifications'), (snapshot) => {
          if (!snapshot.empty) {
            const list: NotificationItem[] = [];
            snapshot.forEach((d) => list.push(d.data() as NotificationItem));
            setNotifications(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialNotifications.forEach((n) => setDoc(doc(db, 'notifications', n.id), n).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      // 12. Messages
      unsubs.push(
        onSnapshot(collection(db, 'messages'), (snapshot) => {
          if (!snapshot.empty) {
            const list: ChatMessage[] = [];
            snapshot.forEach((d) => list.push(d.data() as ChatMessage));
            setChatMessages(list);
          } else if (!isInitialCloudSyncDone.current) {
            initialChatMessages.forEach((m) => setDoc(doc(db, 'messages', m.id), m).catch(() => {}));
          }
          setFirebaseStatus('connected');
        }, () => setFirebaseStatus('offline'))
      );

      isInitialCloudSyncDone.current = true;
    } catch (err) {
      console.warn('Firebase real-time listener note:', err);
      setFirebaseStatus('offline');
    }

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const addLoginRecord = (userId: string, userName: string, profile: 'Admin' | 'Faculty' | 'Student', courseCode?: string, semOrYear?: number) => {
    const timeStr = new Date().toLocaleString();
    const newEntry: UserLoginHistory = {
      id: 'lh_' + Date.now(),
      userId,
      userName,
      userProfile: profile,
      loginTime: timeStr,
      courseCode,
      semOrYear
    };
    setLoginHistory(prev => [newEntry, ...prev.slice(0, 49)]);
    setDoc(doc(db, 'loginHistory', newEntry.id), newEntry).catch(() => {});
  };

  const login = (role: UserRole, identifier: string, pass: string): { success: boolean; message: string } => {
    if (role === 'admin') {
      if (identifier === 'admin' && (pass === (adminProfile.password || 'admin') || pass === 'admin')) {
        const user: CurrentUser = {
          role: 'admin',
          userId: 'admin',
          name: 'Campus Director & Admin',
          email: adminProfile.emailId,
          profilePic: '/Admin.png',
          adminData: adminProfile
        };
        setCurrentUser(user);
        addLoginRecord('admin', 'Campus Director', 'Admin');
        return { success: true, message: 'Welcome Director & Admin!' };
      }
      return { success: false, message: 'Invalid Director/Admin username or password (default: admin / admin)' };
    }

    if (role === 'faculty') {
      const f = faculties.find(
        item => (item.facultyId.toString() === identifier || item.emailId.toLowerCase() === identifier.toLowerCase())
      );
      if (f) {
        if (!f.password || f.password === pass || pass === `faculty@${f.facultyId}` || pass === '123456') {
          const user: CurrentUser = {
            role: 'faculty',
            userId: f.facultyId.toString(),
            name: f.facultyName,
            email: f.emailId,
            profilePic: f.profilePic || '/Ajay Parmar.png',
            courseCode: f.courseCode,
            semOrYear: f.semOrYear,
            facultyData: f
          };
          setCurrentUser(user);
          setFaculties(prev => prev.map(fac => fac.id === f.id ? { ...fac, activeStatus: true, lastLogin: 'Just now' } : fac));
          addLoginRecord(f.facultyId.toString(), f.facultyName, 'Faculty', f.courseCode, f.semOrYear);
          return { success: true, message: `Welcome ${f.facultyName}!` };
        }
        return { success: false, message: 'Invalid Faculty password.' };
      }
      return { success: false, message: 'Faculty not found. Try ID 101 or 102.' };
    }

    if (role === 'student') {
      const s = students.find(
        item => (item.rollNumber.toString() === identifier || item.userId.toLowerCase() === identifier.toLowerCase() || item.emailId.toLowerCase() === identifier.toLowerCase())
      );
      if (s) {
        if (!s.password || s.password === pass || pass === `student@${s.rollNumber}` || pass === '123456') {
          const user: CurrentUser = {
            role: 'student',
            userId: s.userId || `ST-${s.rollNumber}`,
            name: `${s.firstName} ${s.lastName}`,
            email: s.emailId,
            profilePic: s.profilePic || '/Abhi Gaundani.jpeg',
            courseCode: s.courseCode,
            semOrYear: s.semOrYear,
            studentData: s
          };
          setCurrentUser(user);
          setStudents(prev => prev.map(st => st.id === s.id ? { ...st, activeStatus: true, lastLogin: 'Just now' } : st));
          addLoginRecord(s.userId, `${s.firstName} ${s.lastName}`, 'Student', s.courseCode, s.semOrYear);
          return { success: true, message: `Welcome ${s.firstName}!` };
        }
        return { success: false, message: 'Invalid Student password.' };
      }
      return { success: false, message: 'Student not found. Try Roll No 1001 or 1002.' };
    }

    return { success: false, message: 'Invalid credentials.' };
  };

  const logout = () => {
    if (currentUser?.role === 'faculty' && currentUser.facultyData) {
      setFaculties(prev => prev.map(f => f.facultyId.toString() === currentUser.userId ? { ...f, activeStatus: false } : f));
    }
    if (currentUser?.role === 'student' && currentUser.studentData) {
      setStudents(prev => prev.map(s => s.rollNumber.toString() === currentUser.studentData?.rollNumber.toString() ? { ...s, activeStatus: false } : s));
    }
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const quickLogin = (role: UserRole, id?: string) => {
    if (role === 'admin') {
      const user: CurrentUser = {
        role: 'admin',
        userId: 'admin',
        name: 'Director Office & Super Admin',
        email: adminProfile.emailId,
        profilePic: '/Admin.png',
        adminData: adminProfile
      };
      setCurrentUser(user);
      addLoginRecord('admin', 'Director Office', 'Admin');
      setCurrentView('dashboard');
    } else if (role === 'faculty') {
      const f = (id ? faculties.find(fac => fac.facultyId.toString() === id || fac.id === id) : faculties[0]) || faculties[0];
      if (f) {
        const user: CurrentUser = {
          role: 'faculty',
          userId: f.facultyId.toString(),
          name: f.facultyName,
          email: f.emailId,
          profilePic: f.profilePic || '/Ajay Parmar.png',
          courseCode: f.courseCode,
          semOrYear: f.semOrYear,
          facultyData: f
        };
        setCurrentUser(user);
        setFaculties(prev => prev.map(fac => fac.id === f.id ? { ...fac, activeStatus: true, lastLogin: 'Just now' } : fac));
        addLoginRecord(f.facultyId.toString(), f.facultyName, 'Faculty', f.courseCode, f.semOrYear);
        setCurrentView('dashboard');
      }
    } else if (role === 'student') {
      const s = (id ? students.find(st => st.rollNumber.toString() === id || st.userId === id || st.id === id) : students[0]) || students[0];
      if (s) {
        const user: CurrentUser = {
          role: 'student',
          userId: s.userId || `ST-${s.rollNumber}`,
          name: `${s.firstName} ${s.lastName}`,
          email: s.emailId,
          profilePic: s.profilePic || '/Abhi Gaundani.jpeg',
          courseCode: s.courseCode,
          semOrYear: s.semOrYear,
          studentData: s
        };
        setCurrentUser(user);
        setStudents(prev => prev.map(st => st.id === s.id ? { ...st, activeStatus: true, lastLogin: 'Just now' } : st));
        addLoginRecord(s.userId, `${s.firstName} ${s.lastName}`, 'Student', s.courseCode, s.semOrYear);
        setCurrentView('dashboard');
      }
    }
  };

  const updateAdminProfile = (profile: Partial<AdminProfile>) => {
    const updated = { ...adminProfile, ...profile };
    setAdminProfile(updated);
    setDoc(doc(db, 'adminProfile', 'main'), updated).catch(() => {});
    if (currentUser?.role === 'admin') {
      setCurrentUser(prev => prev ? { ...prev, adminData: { ...prev.adminData!, ...profile } } : null);
    }
  };

  // Course actions
  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = { ...course, id: 'c_' + Date.now() };
    setCourses(prev => [...prev, newCourse]);
    setDoc(doc(db, 'courses', newCourse.id), newCourse).catch(() => {});
  };
  const updateCourse = (id: string, updated: Partial<Course>) => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        const res = { ...c, ...updated };
        setDoc(doc(db, 'courses', id), res).catch(() => {});
        return res;
      }
      return c;
    }));
  };
  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    deleteDoc(doc(db, 'courses', id)).catch(() => {});
  };

  // Subject actions
  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSub: Subject = { ...subject, id: 's_' + Date.now() };
    setSubjects(prev => [...prev, newSub]);
    setDoc(doc(db, 'subjects', newSub.id), newSub).catch(() => {});
  };
  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        const res = { ...s, ...updated };
        setDoc(doc(db, 'subjects', id), res).catch(() => {});
        return res;
      }
      return s;
    }));
  };
  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    deleteDoc(doc(db, 'subjects', id)).catch(() => {});
  };

  // Faculty actions
  const addFaculty = (faculty: Omit<Faculty, 'id'>) => {
    const newFac: Faculty = { ...faculty, id: 'f_' + Date.now() };
    setFaculties(prev => [...prev, newFac]);
    setDoc(doc(db, 'faculties', newFac.id), newFac).catch(() => {});
  };
  const updateFaculty = (id: string, updated: Partial<Faculty>) => {
    setFaculties(prev => prev.map(f => {
      if (f.id === id) {
        const res = { ...f, ...updated };
        setDoc(doc(db, 'faculties', id), res).catch(() => {});
        return res;
      }
      return f;
    }));
  };
  const deleteFaculty = (id: string) => {
    setFaculties(prev => prev.filter(f => f.id !== id));
    deleteDoc(doc(db, 'faculties', id)).catch(() => {});
  };

  // Student actions
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newSt: Student = { ...student, id: 'st_' + Date.now() };
    setStudents(prev => [...prev, newSt]);
    setDoc(doc(db, 'students', newSt.id), newSt).catch(() => {});
  };
  const updateStudent = (id: string, updated: Partial<Student>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const res = { ...s, ...updated };
        setDoc(doc(db, 'students', id), res).catch(() => {});
        return res;
      }
      return s;
    }));
  };
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    deleteDoc(doc(db, 'students', id)).catch(() => {});
  };

  // Attendance
  const recordAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    setAttendance(prev => {
      const filtered = prev.filter(p => !records.some(r => r.subjectCode === p.subjectCode && r.date === p.date && r.rollNumber === p.rollNumber));
      const additions: AttendanceRecord[] = records.map((r, i) => {
        const rec = { ...r, id: `att_${Date.now()}_${i}` };
        setDoc(doc(db, 'attendance', rec.id), rec).catch(() => {});
        return rec;
      });
      return [...filtered, ...additions];
    });
  };

  // Marks
  const saveMarks = (marksList: Omit<MarksRecord, 'id'>[]) => {
    setMarks(prev => {
      const filtered = prev.filter(p => !marksList.some(m => m.courseCode === p.courseCode && m.semOrYear === p.semOrYear && m.subjectCode === p.subjectCode && m.rollNumber === p.rollNumber));
      const additions: MarksRecord[] = marksList.map((m, i) => {
        const rec = { ...m, id: `m_${Date.now()}_${i}` };
        setDoc(doc(db, 'marks', rec.id), rec).catch(() => {});
        return rec;
      });
      return [...filtered, ...additions];
    });
  };

  const toggleResultDeclaration = (courseCode: string, semOrYear: number) => {
    const key = `${courseCode}_${semOrYear}`;
    setDeclaredResults(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Notifications
  const sendNotification = (notif: Omit<NotificationItem, 'id' | 'time' | 'readBy'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      readBy: currentUser ? [currentUser.userId] : []
    };
    setNotifications(prev => [newItem, ...prev]);
    setDoc(doc(db, 'notifications', newItem.id), newItem).catch(() => {});
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    deleteDoc(doc(db, 'notifications', id)).catch(() => {});
  };

  const markNotificationAsRead = (id: string) => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => {
      if (n.id === id && !n.readBy.includes(currentUser.userId)) {
        const updated = { ...n, readBy: [...n.readBy, currentUser.userId] };
        setDoc(doc(db, 'notifications', id), updated).catch(() => {});
        return updated;
      }
      return n;
    }));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => {
      if (!n.readBy.includes(currentUser.userId)) {
        const updated = { ...n, readBy: [...n.readBy, currentUser.userId] };
        setDoc(doc(db, 'notifications', n.id), updated).catch(() => {});
        return updated;
      }
      return n;
    }));
  };

  // Chat
  const sendChatMessage = (msg: { toUserId: string; message: string; isGroup?: boolean; attachment?: any }) => {
    if (!currentUser) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];
    const newMsg: ChatMessage = {
      id: 'cmsg_' + Date.now(),
      fromUserId: currentUser.userId,
      fromUserName: currentUser.name,
      fromRole: currentUser.role,
      toUserId: msg.toUserId,
      message: msg.message,
      messageTime: timeStr,
      messageDate: dateStr,
      readBy: [currentUser.userId],
      isGroup: msg.isGroup,
      attachment: msg.attachment
    };
    setChatMessages(prev => [...prev, newMsg]);
    setDoc(doc(db, 'messages', newMsg.id), newMsg).catch(() => {});
  };

  // Change Password
  const changePassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Not logged in' };

    if (currentUser.role === 'admin') {
      if ((adminProfile.password || 'admin') !== oldPass && oldPass !== 'admin') {
        return { success: false, message: 'Current password does not match.' };
      }
      updateAdminProfile({ password: newPass });
      return { success: true, message: 'Admin password updated successfully!' };
    }

    if (currentUser.role === 'faculty') {
      const f = faculties.find(item => item.facultyId.toString() === currentUser.userId);
      if (f) {
        if ((f.password || `faculty@${f.facultyId}`) !== oldPass && oldPass !== '123456') {
          return { success: false, message: 'Current password does not match.' };
        }
        updateFaculty(f.id, { password: newPass });
        return { success: true, message: 'Faculty password updated successfully!' };
      }
    }

    if (currentUser.role === 'student') {
      const s = students.find(item => item.userId === currentUser.userId || item.rollNumber.toString() === currentUser.userId);
      if (s) {
        if ((s.password || `student@${s.rollNumber}`) !== oldPass && oldPass !== '123456') {
          return { success: false, message: 'Current password does not match.' };
        }
        updateStudent(s.id, { password: newPass });
        return { success: true, message: 'Student password updated successfully!' };
      }
    }

    return { success: false, message: 'User not found.' };
  };

  // OD / Leave Handlers
  const submitODRequest = (req: Omit<ODRequest, 'id' | 'requestId' | 'status' | 'submittedAt'>) => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newOD: ODRequest = {
      ...req,
      id: 'od_' + Date.now(),
      requestId: `OD-2026-${randomCode}`,
      status: 'Submitted',
      submittedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setOdRequests(prev => [newOD, ...prev]);
    setDoc(doc(db, 'odRequests', newOD.id), newOD).catch(() => {});

    // Send automatic notification to faculty/staff
    sendNotification({
      userProfile: 'Faculty',
      category: 'OD/Leave',
      title: `New ${req.category} Submitted: ${req.studentName}`,
      message: `${req.studentName} (${req.courseCode} Sem ${req.semOrYear}) submitted an OD request for ${req.totalDays} day(s) from ${req.fromDate}.`,
      linkView: 'od-leave'
    });
  };

  const updateODStatus = (id: string, status: ODStatus, remarks?: string) => {
    setOdRequests(prev => prev.map(od => {
      if (od.id === id) {
        const updated: ODRequest = {
          ...od,
          status,
          reviewRemarks: remarks || od.reviewRemarks,
          reviewedBy: currentUser?.name || 'Academic Authority',
          reviewedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
        setDoc(doc(db, 'odRequests', id), updated).catch(() => {});

        sendNotification({
          userProfile: 'Student',
          userId: od.userId,
          category: 'OD/Leave',
          title: `Your OD Request (${od.requestId}) is ${status}`,
          message: `Status updated by ${currentUser?.name || 'Staff'}. Remarks: "${remarks || 'Reviewed'}".`,
          linkView: 'od-leave'
        });
        return updated;
      }
      return od;
    }));
  };

  // Campus Events Actions
  const registerForEvent = (eventId: string) => {
    if (!currentUser) return;
    setCampusEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        const isRegistered = ev.registeredUsers.includes(currentUser.userId);
        const updatedUsers = isRegistered
          ? ev.registeredUsers.filter(u => u !== currentUser.userId)
          : [...ev.registeredUsers, currentUser.userId];
        const updated = { ...ev, registeredUsers: updatedUsers };
        setDoc(doc(db, 'events', eventId), updated).catch(() => {});
        return updated;
      }
      return ev;
    }));
  };

  // Campus Slot Action
  const toggleSlotAvailability = (id: string) => {
    setCampusSlots(prev => prev.map(slot => {
      if (slot.id === id) {
        const updated = { ...slot, isFree: !slot.isFree };
        setDoc(doc(db, 'slots', id), updated).catch(() => {});
        return updated;
      }
      return slot;
    }));
  };

  // Service Request Actions
  const submitServiceRequest = (req: Omit<ServiceRequest, 'id' | 'ticketId' | 'status' | 'createdAt'>) => {
    const randomTicket = Math.floor(5000 + Math.random() * 4000);
    const newReq: ServiceRequest = {
      ...req,
      id: 'sr_' + Date.now(),
      ticketId: `TKT-${randomTicket}`,
      status: 'Submitted',
      createdAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setServiceRequests(prev => [newReq, ...prev]);
    setDoc(doc(db, 'serviceRequests', newReq.id), newReq).catch(() => {});
  };

  const updateServiceRequestStatus = (id: string, status: ServiceStatus, resolutionNote?: string, assignedTo?: string) => {
    setServiceRequests(prev => prev.map(sr => {
      if (sr.id === id) {
        const updated: ServiceRequest = {
          ...sr,
          status,
          resolutionNote: resolutionNote || sr.resolutionNote,
          assignedTo: assignedTo || sr.assignedTo,
          resolvedAt: status === 'Resolved' ? new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined
        };
        setDoc(doc(db, 'serviceRequests', id), updated).catch(() => {});
        return updated;
      }
      return sr;
    }));
  };

  // Certificate Actions
  const submitCertificateRequest = (req: Omit<CertificateRequest, 'id' | 'certNumber' | 'status' | 'requestedDate'>) => {
    const code = Math.floor(8000 + Math.random() * 1999);
    const prefix = req.certificateType.split(' ')[0].substring(0, 3).toUpperCase();
    const newCert: CertificateRequest = {
      ...req,
      id: 'cr_' + Date.now(),
      certNumber: `${prefix}-2026-${code}`,
      status: 'Requested',
      requestedDate: new Date().toISOString().split('T')[0]
    };
    setCertificateRequests(prev => [newCert, ...prev]);
    setDoc(doc(db, 'certificates', newCert.id), newCert).catch(() => {});
  };

  const updateCertificateStatus = (id: string, status: CertificateStatus) => {
    setCertificateRequests(prev => prev.map(cr => {
      if (cr.id === id) {
        const updated: CertificateRequest = {
          ...cr,
          status,
          generatedDate: (status === 'Approved' || status === 'Ready for Download') ? new Date().toISOString().split('T')[0] : cr.generatedDate,
          issuedBy: 'Office of Registrar & Director'
        };
        setDoc(doc(db, 'certificates', id), updated).catch(() => {});
        return updated;
      }
      return cr;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        login,
        logout,
        quickLogin,
        firebaseStatus,
        syncToCloud,
        adminProfile,
        courses,
        subjects,
        faculties,
        students,
        attendance,
        marks,
        notifications,
        chatMessages,
        loginHistory,
        declaredResults,
        odRequests,
        campusEvents,
        campusSlots,
        serviceRequests,
        certificateRequests,
        updateAdminProfile,
        addCourse,
        updateCourse,
        deleteCourse,
        addSubject,
        updateSubject,
        deleteSubject,
        addFaculty,
        updateFaculty,
        deleteFaculty,
        addStudent,
        updateStudent,
        deleteStudent,
        recordAttendance,
        saveMarks,
        toggleResultDeclaration,
        sendNotification,
        deleteNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendChatMessage,
        changePassword,
        submitODRequest,
        updateODStatus,
        registerForEvent,
        toggleSlotAvailability,
        submitServiceRequest,
        updateServiceRequestStatus,
        submitCertificateRequest,
        updateCertificateStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
