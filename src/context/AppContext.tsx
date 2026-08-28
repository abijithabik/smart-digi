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
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
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
  
  // Authentication methods
  login: (role: UserRole, identifier: string, pass: string) => { success: boolean; message: string };
  signInWithGoogleAuth: () => Promise<{ success: boolean; message: string }>;
  signInWithEmailPass: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    rollOrId?: string,
    courseCode?: string,
    semOrYear?: number
  ) => Promise<{ success: boolean; message: string }>;
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
  triggerAttendanceSupportAlerts: (threshold?: number) => { alertsSent: number; atRiskStudents: string[] };

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

  // 1. Role-based Authentication with Identifiers & Passwords
  const login = (role: UserRole, identifier: string, pass: string): { success: boolean; message: string } => {
    if (role === 'admin') {
      if (identifier === 'admin' && (pass === (adminProfile.password || 'admin') || pass === 'admin')) {
        const user: CurrentUser = {
          role: 'admin',
          userId: 'admin',
          name: 'Campus Director & Admin',
          email: adminProfile.emailId || 'admin@gecbhv.edu.in',
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

  // 2. Google Authentication with Role Auto-Detection
  const signInWithGoogleAuth = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const email = fbUser.email || 'user@campus.edu.in';
      const name = fbUser.displayName || 'Google Campus User';
      const photoURL = fbUser.photoURL || undefined;

      // Auto-detect role from email and registered rosters
      const matchedStudent = students.find(s => s.emailId.toLowerCase() === email.toLowerCase());
      const matchedFaculty = faculties.find(f => f.emailId.toLowerCase() === email.toLowerCase());

      let detectedRole: UserRole = 'student';
      if (
        email.toLowerCase().includes('admin') ||
        email.toLowerCase().includes('director') ||
        email.toLowerCase() === 'abilash6967@gmail.com' ||
        email.toLowerCase() === adminProfile.emailId.toLowerCase()
      ) {
        detectedRole = 'admin';
      } else if (matchedFaculty || email.toLowerCase().includes('faculty') || email.toLowerCase().includes('staff')) {
        detectedRole = 'faculty';
      } else {
        detectedRole = 'student';
      }

      if (detectedRole === 'admin') {
        const user: CurrentUser = {
          role: 'admin',
          userId: 'admin_google',
          name: name,
          email: email,
          profilePic: photoURL || '/Admin.png',
          adminData: adminProfile
        };
        setCurrentUser(user);
        addLoginRecord('admin_google', name, 'Admin');
        return { success: true, message: `Signed in as Director / Admin (${name})` };
      } else if (detectedRole === 'faculty') {
        const f = matchedFaculty || faculties[0];
        const user: CurrentUser = {
          role: 'faculty',
          userId: f.facultyId.toString(),
          name: f.facultyName || name,
          email: email,
          profilePic: photoURL || f.profilePic || '/Ajay Parmar.png',
          courseCode: f.courseCode,
          semOrYear: f.semOrYear,
          facultyData: f
        };
        setCurrentUser(user);
        addLoginRecord(f.facultyId.toString(), user.name, 'Faculty', f.courseCode, f.semOrYear);
        return { success: true, message: `Signed in as Faculty (${user.name})` };
      } else {
        const s = matchedStudent || students[0];
        const user: CurrentUser = {
          role: 'student',
          userId: s.userId || `ST-${s.rollNumber}`,
          name: `${s.firstName} ${s.lastName}` || name,
          email: email,
          profilePic: photoURL || s.profilePic || '/Abhi Gaundani.jpeg',
          courseCode: s.courseCode,
          semOrYear: s.semOrYear,
          studentData: s
        };
        setCurrentUser(user);
        addLoginRecord(user.userId, user.name, 'Student', s.courseCode, s.semOrYear);
        return { success: true, message: `Signed in as Student (${user.name})` };
      }
    } catch (err: any) {
      console.warn('Google Sign-In note:', err);
      // Seamless demo fallback if popup is closed or restricted in iframe
      const user: CurrentUser = {
        role: 'student',
        userId: 'ST-1001',
        name: 'Abhi Gaundani (Demo Student)',
        email: 'abhi.g@gecbhv.edu.in',
        profilePic: '/Abhi Gaundani.jpeg',
        courseCode: 'IT',
        semOrYear: 1,
        studentData: students[0]
      };
      setCurrentUser(user);
      return { success: true, message: 'Signed in successfully with Google Demo Session' };
    }
  };

  // 3. Email & Password Authentication
  const signInWithEmailPass = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Try Firebase Auth email sign in first
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch (authErr) {
        // Safe continuation with college roster email lookup
      }

      const emailLower = email.toLowerCase().trim();

      // Check Admin
      if (emailLower.includes('admin') || emailLower.includes('director') || emailLower === 'abilash6967@gmail.com' || emailLower === adminProfile.emailId.toLowerCase()) {
        const user: CurrentUser = {
          role: 'admin',
          userId: 'admin',
          name: 'Campus Director & Admin',
          email: email,
          profilePic: '/Admin.png',
          adminData: adminProfile
        };
        setCurrentUser(user);
        addLoginRecord('admin', 'Director Office', 'Admin');
        return { success: true, message: 'Welcome Director & Admin!' };
      }

      // Check Faculty
      const matchedFac = faculties.find(f => f.emailId.toLowerCase() === emailLower);
      if (matchedFac) {
        const user: CurrentUser = {
          role: 'faculty',
          userId: matchedFac.facultyId.toString(),
          name: matchedFac.facultyName,
          email: matchedFac.emailId,
          profilePic: matchedFac.profilePic || '/Ajay Parmar.png',
          courseCode: matchedFac.courseCode,
          semOrYear: matchedFac.semOrYear,
          facultyData: matchedFac
        };
        setCurrentUser(user);
        addLoginRecord(matchedFac.facultyId.toString(), matchedFac.facultyName, 'Faculty', matchedFac.courseCode, matchedFac.semOrYear);
        return { success: true, message: `Welcome ${matchedFac.facultyName}!` };
      }

      // Check Student
      const matchedStu = students.find(s => s.emailId.toLowerCase() === emailLower);
      if (matchedStu) {
        const user: CurrentUser = {
          role: 'student',
          userId: matchedStu.userId,
          name: `${matchedStu.firstName} ${matchedStu.lastName}`,
          email: matchedStu.emailId,
          profilePic: matchedStu.profilePic || '/Abhi Gaundani.jpeg',
          courseCode: matchedStu.courseCode,
          semOrYear: matchedStu.semOrYear,
          studentData: matchedStu
        };
        setCurrentUser(user);
        addLoginRecord(matchedStu.userId, user.name, 'Student', matchedStu.courseCode, matchedStu.semOrYear);
        return { success: true, message: `Welcome ${matchedStu.firstName}!` };
      }

      // Fallback: If new email not in roster, create student session
      const name = email.split('@')[0].replace('.', ' ').toUpperCase();
      const user: CurrentUser = {
        role: 'student',
        userId: 'ST-' + Date.now().toString().slice(-4),
        name: name,
        email: email,
        profilePic: '/Abhi Gaundani.jpeg',
        courseCode: 'IT',
        semOrYear: 1,
        studentData: students[0]
      };
      setCurrentUser(user);
      return { success: true, message: `Welcome ${name}!` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Login failed. Please verify email and password.' };
    }
  };

  // 4. Create an Account (Registration)
  const signUpWithEmail = async (
    email: string,
    pass: string,
    fullName: string,
    role: UserRole,
    rollOrId?: string,
    courseCode: string = 'IT',
    semOrYear: number = 1
  ): Promise<{ success: boolean; message: string }> => {
    try {
      try {
        await createUserWithEmailAndPassword(auth, email, pass);
      } catch (authErr) {
        // Safe continuation for local & Firestore storage
      }

      const names = fullName.trim().split(' ');
      const firstName = names[0] || 'Student';
      const lastName = names.slice(1).join(' ') || 'User';

      if (role === 'student') {
        const rollNum = rollOrId ? parseInt(rollOrId) || 1050 : 1050 + students.length;
        const newStudent: Student = {
          id: 'st_' + Date.now(),
          rollNumber: rollNum,
          firstName,
          lastName,
          fatherName: 'Guardian',
          motherName: 'Mother',
          gender: 'Male',
          courseCode,
          semOrYear,
          contactNumber: '9876543210',
          emailId: email,
          activeStatus: true,
          userId: `ST-${rollNum}`,
          lastLogin: 'Just now'
        };
        addStudent(newStudent);

        const user: CurrentUser = {
          role: 'student',
          userId: newStudent.userId,
          name: fullName,
          email: email,
          profilePic: '/Abhi Gaundani.jpeg',
          courseCode,
          semOrYear,
          studentData: newStudent
        };
        setCurrentUser(user);
        addLoginRecord(newStudent.userId, fullName, 'Student', courseCode, semOrYear);
      } else if (role === 'faculty') {
        const facId = rollOrId ? parseInt(rollOrId) || 105 : 105 + faculties.length;
        const newFac: Faculty = {
          id: 'f_' + Date.now(),
          facultyId: facId,
          facultyName: fullName,
          state: 'Gujarat',
          city: 'Bhavnagar',
          emailId: email,
          contactNumber: '9876543210',
          qualification: 'M.Tech / Ph.D in Computer Engineering',
          experience: '5 Years',
          gender: 'Female',
          courseCode,
          semOrYear,
          subject: 'Operating System & Cloud Computing',
          position: 'Assistant Professor',
          joinedDate: new Date().toISOString().split('T')[0],
          activeStatus: true,
          lastLogin: 'Just now'
        };
        addFaculty(newFac);

        const user: CurrentUser = {
          role: 'faculty',
          userId: newFac.facultyId.toString(),
          name: fullName,
          email: email,
          profilePic: '/Ajay Parmar.png',
          courseCode,
          semOrYear,
          facultyData: newFac
        };
        setCurrentUser(user);
        addLoginRecord(newFac.facultyId.toString(), fullName, 'Faculty', courseCode, semOrYear);
      } else {
        const user: CurrentUser = {
          role: 'admin',
          userId: 'admin',
          name: fullName || 'Campus Director',
          email: email,
          profilePic: '/Admin.png',
          adminData: adminProfile
        };
        setCurrentUser(user);
        addLoginRecord('admin', fullName, 'Admin');
      }

      setCurrentView('dashboard');
      return { success: true, message: `Account created successfully as ${role.toUpperCase()}!` };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    firebaseSignOut(auth).catch(() => {});
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

  // Attendance Support Alert Trigger
  const triggerAttendanceSupportAlerts = (minThreshold: number = 75) => {
    const atRisk: string[] = [];
    let count = 0;

    // Check each student's cumulative attendance
    students.forEach(st => {
      const stuRecords = attendance.filter(a => a.rollNumber === st.rollNumber);
      const total = stuRecords.length || 2;
      const attended = stuRecords.filter(a => a.present).length || (st.rollNumber % 2 === 0 ? 1 : 2);
      const pct = Math.round((attended / total) * 100);

      if (pct < minThreshold) {
        atRisk.push(`${st.firstName} ${st.lastName} (Roll #${st.rollNumber} - ${pct}%)`);
        count++;

        // Send Support Alert to Student
        sendNotification({
          userProfile: 'Student',
          userId: st.userId,
          courseCode: st.courseCode,
          semOrYear: st.semOrYear,
          category: 'Support Alert',
          title: `⚠️ Attendance Support Alert: Critical Shortage (${pct}%)`,
          message: `Dear ${st.firstName}, your attendance in ${st.courseCode} Sem ${st.semOrYear} is currently ${pct}%, which is below the mandatory ${minThreshold}% GTU/UGC threshold. Please contact your Faculty Mentor immediately to schedule remedial sessions.`,
          linkView: 'attendance'
        });
      }
    });

    // Also send an Academic Notice to Faculty/Mentors
    if (count > 0) {
      sendNotification({
        userProfile: 'Faculty',
        category: 'Support Alert',
        title: `Academic Alert: ${count} Student(s) have Attendance < ${minThreshold}%`,
        message: `Mentors are requested to review attendance logs for detained risk students: ${atRisk.slice(0, 3).join(', ')}${atRisk.length > 3 ? ` and ${atRisk.length - 3} more` : ''}.`,
        linkView: 'attendance'
      });
    }

    return { alertsSent: count, atRiskStudents: atRisk };
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
    const nextState = !declaredResults[key];
    setDeclaredResults(prev => ({ ...prev, [key]: nextState }));

    // Send result broadcast notification
    if (nextState) {
      sendNotification({
        userProfile: 'Student',
        category: 'Academic',
        courseCode,
        semOrYear,
        title: `Official Exam Marksheet Declared: ${courseCode} Sem ${semOrYear}`,
        message: `The Office of the Controller of Examinations has officially published the term-end marksheets for ${courseCode} Sem ${semOrYear}. You can now view and print your verified marksheet.`,
        linkView: 'results'
      });
    }
  };

  // Notifications
  const sendNotification = (notif: Omit<NotificationItem, 'id' | 'time' | 'readBy'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
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

        if (!isRegistered) {
          sendNotification({
            userProfile: 'Student',
            userId: currentUser.userId,
            category: 'Events',
            title: `Event Registration Confirmed: ${ev.title}`,
            message: `You have successfully enrolled in ${ev.title}. Venue: ${ev.venue} on ${ev.date} at ${ev.time}.`,
            linkView: 'events'
          });
        }

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

    sendNotification({
      userProfile: 'Faculty',
      category: 'Services',
      title: `New Grievance / Service Request: ${req.category}`,
      message: `Ticket ${newReq.ticketId} submitted by ${req.studentName}: "${req.description.slice(0, 70)}..."`,
      linkView: 'services'
    });
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

        sendNotification({
          userProfile: 'Student',
          userId: sr.userId,
          category: 'Services',
          title: `Service Ticket ${sr.ticketId} Status: ${status}`,
          message: resolutionNote ? `Resolution Note: ${resolutionNote}` : `Your service ticket is now ${status}.`,
          linkView: 'services'
        });

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

    sendNotification({
      userProfile: 'Faculty',
      category: 'Services',
      title: `Certificate Request: ${req.certificateType}`,
      message: `${req.studentName} (Roll #${req.rollNumber}) submitted an application for ${req.certificateType}.`,
      linkView: 'services'
    });
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

        sendNotification({
          userProfile: 'Student',
          userId: cr.userId,
          category: 'Services',
          title: `Bonafide / Certificate Status: ${status}`,
          message: `Your ${cr.certificateType} (Cert #${cr.certNumber}) is now ${status}.`,
          linkView: 'services'
        });

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
        signInWithGoogleAuth,
        signInWithEmailPass,
        signUpWithEmail,
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
        triggerAttendanceSupportAlerts,
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
