export type UserRole = 'admin' | 'faculty' | 'student';

export interface AdminProfile {
  collegeName: string;
  collegeLogo?: string;
  address: string;
  contactNumber: string;
  emailId: string;
  website: string;
  establishedYear?: string;
  principalName?: string;
  affiliation?: string;
  password?: string;
  lastLogin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  semOrYear: 'Sem' | 'Year';
  totalSemOrYear: number;
}

export interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  courseCode: string;
  semOrYear: number;
  subjectType: 'Core' | 'Optional';
  theoryMarks: number;
  practicalMarks: number;
}

export interface Faculty {
  id: string;
  facultyId: number;
  facultyName: string;
  state: string;
  city: string;
  emailId: string;
  contactNumber: string;
  qualification: string;
  experience: string;
  birthDate?: string;
  dateOfBirth?: string;
  gender: string;
  profilePic?: string;
  courseCode: string;
  semOrYear: number;
  subject: string;
  position: string;
  designation?: string;
  joinedDate: string;
  password?: string;
  activeStatus: boolean;
  lastLogin: string;
}

export interface Student {
  id: string;
  rollNumber: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth?: string;
  birthDate?: string;
  courseCode: string;
  semOrYear: number;
  contactNumber: string;
  emailId: string;
  address?: string;
  city?: string;
  state?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  parentContact?: string;
  profilePic?: string;
  joinedDate?: string;
  admissionDate?: string;
  activeStatus: boolean;
  userId: string;
  password?: string;
  lastLogin: string;
  optionalSubject?: string;
  interests?: string[];
  cgpa?: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  courseCode: string;
  semOrYear: number;
  subject?: string;
  subjectCode?: string;
  facultyId?: number;
  studentId?: string;
  rollNumber: number;
  studentName?: string;
  present: boolean;
}

export interface MarksRecord {
  id: string;
  examType?: 'Mid-Sem' | 'End-Sem' | 'Internal' | 'Practical';
  courseCode: string;
  semOrYear: number;
  subject?: string;
  subjectName?: string;
  subjectCode?: string;
  rollNumber: number;
  studentName?: string;
  theoryMarks: number;
  maxTheoryMarks?: number;
  practicalMarks: number;
  maxPracticalMarks?: number;
  grade?: string;
  evaluatedBy?: string;
  date?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  category?: string;
  userProfile: 'All' | 'Faculty' | 'Student';
  postedBy?: string;
  time: string;
  readBy: string[];
  linkView?: string;
  userId?: string;
  courseCode?: string;
  semOrYear?: number;
}

export type NotificationItem = Notification;

export interface ChatAttachment {
  name: string;
  url?: string;
  type?: string;
  size?: string;
}

export interface ChatMessage {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromRole?: string;
  toUserId: string;
  message: string;
  messageTime: string;
  messageDate?: string;
  readBy?: string[];
  isGroup?: boolean;
  attachment?: ChatAttachment;
}

export interface UserLoginHistory {
  id: string;
  userId: string;
  userName: string;
  userProfile: 'Admin' | 'Faculty' | 'Student';
  loginTime: string;
  courseCode?: string;
  semOrYear?: number;
}

export interface CurrentUser {
  role: UserRole;
  userId: string;
  name: string;
  email: string;
  profilePic?: string;
  courseCode?: string;
  semOrYear?: number;
  studentData?: Student;
  facultyData?: Faculty;
  adminData?: AdminProfile;
}

// CAMPUSONE AI EXPANDED INTERFACES

export type ODStatus = 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';

export interface ODRequest {
  id: string;
  requestId: string;
  studentRoll?: number;
  rollNumber?: number;
  studentName: string;
  userId: string;
  courseCode: string;
  semOrYear: number;
  category: 'On-Duty (OD)' | 'Medical Leave' | 'Event Participation' | 'Internship' | 'Emergency Leave' | 'Casual Leave' | 'Event/Competition';
  eventName?: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  documentName?: string;
  proofDocumentName?: string;
  proofDocument?: string;
  documentUrl?: string;
  status: ODStatus;
  reviewedBy?: string;
  reviewRemarks?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Competition' | 'Hackathon' | 'Workshop' | 'Technical' | 'Cultural' | 'Sports' | 'Club';
  date: string;
  time: string;
  venue: string;
  location?: string;
  mode?: 'Online' | 'Offline' | 'Hybrid' | string;
  organizer: string;
  departmentTarget: string[];
  registrationDeadline: string;
  bannerImage: string;
  tags: string[];
  registeredUsers: string[];
  matchScore?: number;
  isRecommended?: boolean;
  eligibility?: string;
  prizes?: string;
  prizePool?: string;
}

export interface CampusSlot {
  id: string;
  department: string;
  block: string;
  roomNumber: string;
  roomType?: 'Lecture Hall' | 'Computer Lab' | 'Hardware Lab' | 'Seminar Hall' | 'Auditorium' | string;
  type?: string;
  capacity: number;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | string;
  timeSlot: string;
  isFree: boolean;
  occupiedBySubject?: string;
  occupiedByFaculty?: string;
  occupiedForClass?: string;
  occupiedBy?: string;
  facultyName?: string;
}

export type ServiceCategory = 'Hostel & Mess' | 'Laboratory & Equipment' | 'Campus WiFi & IT' | 'Classroom Infrastructure' | 'Academic & Library' | 'Sanitation & Water' | 'Academic' | 'Hostel/Mess' | 'Lab/Equipment' | 'WiFi/IT' | 'Library' | 'Administrative';
export type ServicePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ServiceStatus = 'Submitted' | 'Assigned' | 'In Progress' | 'Resolved' | 'Rejected';

export interface ServiceRequest {
  id: string;
  ticketId: string;
  studentName: string;
  rollNumber?: number;
  userId: string;
  courseCode: string;
  semOrYear?: number;
  category: ServiceCategory;
  priority: ServicePriority;
  title?: string;
  subject?: string;
  description: string;
  location?: string;
  status: ServiceStatus;
  assignedTo?: string;
  resolutionNote?: string;
  createdAt: string;
  resolvedAt?: string;
}

export type CertificateType = 'Bonafide Certificate' | 'Transfer Certificate (TC)' | 'Course Completion Certificate' | 'Course Completion' | 'Custodian Certificate' | 'Internship NOC Certificate' | 'No Objection Certificate (NOC)' | 'Letter of Recommendation (LOR)' | 'No Dues Clearance';
export type CertificateStatus = 'Requested' | 'Verification' | 'Approved' | 'Ready for Download';

export interface CertificateRequest {
  id: string;
  certNumber: string;
  certificateType: CertificateType;
  studentName: string;
  rollNumber: number;
  userId: string;
  courseCode: string;
  semOrYear: number;
  purpose: string;
  status: CertificateStatus;
  requestedDate: string;
  generatedDate?: string;
  issuedBy?: string;
}
