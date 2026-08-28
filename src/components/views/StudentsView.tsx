import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, Plus, Trash2, Edit3, X, Search, Mail, Phone, MapPin, Eye, UserCheck } from 'lucide-react';
import { Student } from '../../types';

export const StudentsView: React.FC = () => {
  const { students, courses, subjects, addStudent, updateStudent, deleteStudent, currentUser, quickLogin } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedSem, setSelectedSem] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rollNumber, setRollNumber] = useState(1008);
  const [courseCode, setCourseCode] = useState(courses[0]?.courseCode || 'IT');
  const [semOrYear, setSemOrYear] = useState(1);
  const [optionalSubject, setOptionalSubject] = useState('English Communication Skills');
  const [emailId, setEmailId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2005-01-01');
  const [gender, setGender] = useState('Male');
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('Bhavnagar');
  const [fatherName, setFatherName] = useState('');
  const [fatherOccupation, setFatherOccupation] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherOccupation, setMotherOccupation] = useState('');
  const [parentContact, setParentContact] = useState('');

  const isAdmin = currentUser?.role === 'admin';
  const isFaculty = currentUser?.role === 'faculty';

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFirstName('');
    setLastName('');
    const nextRoll = Math.max(...students.map(s => s.rollNumber), 1000) + 1;
    setRollNumber(nextRoll);
    setCourseCode(courses[0]?.courseCode || 'IT');
    setSemOrYear(1);
    setOptionalSubject('English Communication Skills');
    setEmailId('');
    setContactNumber('');
    setDateOfBirth('2005-01-01');
    setGender('Male');
    setState('Gujarat');
    setCity('Bhavnagar');
    setFatherName('');
    setFatherOccupation('');
    setMotherName('');
    setMotherOccupation('');
    setParentContact('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setFirstName(s.firstName);
    setLastName(s.lastName);
    setRollNumber(s.rollNumber);
    setCourseCode(s.courseCode);
    setSemOrYear(s.semOrYear);
    setOptionalSubject(s.optionalSubject || '');
    setEmailId(s.emailId);
    setContactNumber(s.contactNumber);
    setDateOfBirth(s.dateOfBirth || s.birthDate || '2005-01-01');
    setGender(s.gender);
    setState(s.state || '');
    setCity(s.city || '');
    setFatherName(s.fatherName);
    setFatherOccupation(s.fatherOccupation || '');
    setMotherName(s.motherName);
    setMotherOccupation(s.motherOccupation || '');
    setParentContact(s.parentContact || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const userId = `${courseCode}-${semOrYear}-${rollNumber}`;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        firstName,
        lastName,
        rollNumber: Number(rollNumber),
        userId,
        courseCode,
        semOrYear: Number(semOrYear),
        optionalSubject,
        emailId: emailId || `${firstName.toLowerCase()}.${lastName[0]?.toLowerCase()}@student.gecbhv.edu.in`,
        contactNumber,
        dateOfBirth,
        birthDate: dateOfBirth,
        gender,
        state,
        city,
        fatherName,
        fatherOccupation,
        motherName,
        motherOccupation,
        parentContact
      });
    } else {
      addStudent({
        firstName,
        lastName,
        rollNumber: Number(rollNumber),
        userId,
        courseCode,
        semOrYear: Number(semOrYear),
        optionalSubject,
        emailId: emailId || `${firstName.toLowerCase()}.${lastName[0]?.toLowerCase()}@student.gecbhv.edu.in`,
        contactNumber,
        dateOfBirth,
        birthDate: dateOfBirth,
        gender,
        state,
        city,
        fatherName,
        fatherOccupation,
        motherName,
        motherOccupation,
        parentContact,
        profilePic: '/Abhi Gaundani.jpeg',
        admissionDate: new Date().toISOString().split('T')[0],
        password: `student@${rollNumber}`,
        activeStatus: false,
        lastLogin: 'Never'
      });
    }
    setIsModalOpen(false);
  };

  const filteredStudents = students.filter(s => {
    const matchCourse = selectedCourse === 'All' || s.courseCode === selectedCourse;
    const matchSem = selectedSem === 'All' || s.semOrYear.toString() === selectedSem;
    const matchSearch =
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toString().includes(searchTerm) ||
      s.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCourse && matchSem && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-amber-500" />
            <span>Student Registry</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Student enrollments, roll numbers, parent credentials, and academic cohorts.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, roll number, or ID..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="All">All Departments</option>
          {courses.map(c => (
            <option key={c.id} value={c.courseCode}>{c.courseCode}</option>
          ))}
        </select>

        <select
          value={selectedSem}
          onChange={e => setSelectedSem(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
        >
          <option value="All">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <option key={s} value={s.toString()}>Semester {s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Department & Sem</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">City</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredStudents.map(st => (
                <tr key={st.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-amber-400">#{st.rollNumber}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={st.profilePic || '/Abhi Gaundani.jpeg'}
                        alt={st.firstName}
                        className="w-8 h-8 rounded-full border border-slate-700 object-cover bg-slate-800"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-white">{st.firstName} {st.lastName}</div>
                        <div className="text-[10px] text-slate-400">{st.emailId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-300">{st.userId}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {st.courseCode} - Sem {st.semOrYear}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-400">{st.contactNumber}</td>
                  <td className="px-5 py-3 text-slate-400">{st.city}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingStudent(st)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(st)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                            title="Edit Student"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete student ${st.firstName} ${st.lastName}?`)) {
                                deleteStudent(st.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                            title="Delete Student"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white">Student Academic Profile</h3>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={viewingStudent.profilePic || '/Abhi Gaundani.jpeg'}
                  alt={viewingStudent.firstName}
                  className="w-16 h-16 rounded-2xl border-2 border-amber-500/40 object-cover bg-slate-800"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <h2 className="text-base font-bold text-white">
                    {viewingStudent.firstName} {viewingStudent.lastName}
                  </h2>
                  <p className="text-xs text-amber-400 font-medium">Roll #{viewingStudent.rollNumber} • ID: {viewingStudent.userId}</p>
                  <p className="text-xs text-slate-400">{viewingStudent.courseCode} Engineering (Semester {viewingStudent.semOrYear})</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Date of Birth:</span>
                  <span className="text-white font-medium">{viewingStudent.dateOfBirth || viewingStudent.birthDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Gender:</span>
                  <span className="text-white font-medium">{viewingStudent.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone:</span>
                  <span className="text-white font-medium">{viewingStudent.contactNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Student Email:</span>
                  <span className="text-white font-medium truncate">{viewingStudent.emailId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Father's Name:</span>
                  <span className="text-white font-medium">{viewingStudent.fatherName} ({viewingStudent.fatherOccupation})</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mother's Name:</span>
                  <span className="text-white font-medium">{viewingStudent.motherName} ({viewingStudent.motherOccupation})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Residential Address / City:</span>
                  <span className="text-white font-medium">{viewingStudent.city}, {viewingStudent.state}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    quickLogin('student', viewingStudent.userId);
                    setViewingStudent(null);
                  }}
                  className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Impersonate Student</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white">
                {editingStudent ? 'Edit Student Details' : 'Register New Student'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Abhi"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Gaundani"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll No</label>
                  <input
                    type="number"
                    value={rollNumber}
                    onChange={e => setRollNumber(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.courseCode}>{c.courseCode}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
                  <select
                    value={semOrYear}
                    onChange={e => setSemOrYear(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Student Contact</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    placeholder="+91 9123456780"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Father's Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={e => setFatherName(e.target.value)}
                    placeholder="Father Name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={e => setMotherName(e.target.value)}
                    placeholder="Mother Name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 bg-slate-800 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md"
                >
                  {editingStudent ? 'Save Changes' : 'Register Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
