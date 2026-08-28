import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Trash2, Edit3, X, Search, Mail, Phone, MapPin, Award, BookOpen, UserCheck } from 'lucide-react';
import { Faculty } from '../../types';

export const FacultiesView: React.FC = () => {
  const { faculties, courses, subjects, addFaculty, updateFaculty, deleteFaculty, currentUser, quickLogin } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

  const [facultyName, setFacultyName] = useState('');
  const [facultyId, setFacultyId] = useState(105);
  const [emailId, setEmailId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [qualification, setQualification] = useState('M.Tech (Computer Science)');
  const [experience, setExperience] = useState('5 Years');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [gender, setGender] = useState('Male');
  const [state, setState] = useState('Gujarat');
  const [city, setCity] = useState('Bhavnagar');
  const [courseCode, setCourseCode] = useState(courses[0]?.courseCode || 'IT');
  const [semOrYear, setSemOrYear] = useState(1);
  const [subject, setSubject] = useState('');
  const [position, setPosition] = useState('Assistant Professor');
  const [profilePic, setProfilePic] = useState('/Ajay Parmar.png');

  const isAdmin = currentUser?.role === 'admin';

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFacultyName('');
    const nextId = Math.max(...faculties.map(f => f.facultyId), 100) + 1;
    setFacultyId(nextId);
    setEmailId('');
    setContactNumber('');
    setQualification('M.Tech (Computer Science)');
    setExperience('5 Years');
    setBirthDate('1990-01-01');
    setGender('Male');
    setState('Gujarat');
    setCity('Bhavnagar');
    setCourseCode(courses[0]?.courseCode || 'IT');
    setSemOrYear(1);
    setSubject(subjects[0]?.subjectName || '');
    setPosition('Assistant Professor');
    setProfilePic('/Ajay Parmar.png');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f: Faculty) => {
    setEditingFaculty(f);
    setFacultyName(f.facultyName);
    setFacultyId(f.facultyId);
    setEmailId(f.emailId);
    setContactNumber(f.contactNumber);
    setQualification(f.qualification);
    setExperience(f.experience);
    setBirthDate(f.birthDate || f.dateOfBirth || '1990-01-01');
    setGender(f.gender);
    setState(f.state);
    setCity(f.city);
    setCourseCode(f.courseCode);
    setSemOrYear(f.semOrYear);
    setSubject(f.subject);
    setPosition(f.position);
    setProfilePic(f.profilePic || '/Ajay Parmar.png');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName.trim() || !emailId.trim()) return;

    if (editingFaculty) {
      updateFaculty(editingFaculty.id, {
        facultyName,
        facultyId: Number(facultyId),
        emailId,
        contactNumber,
        qualification,
        experience,
        birthDate,
        dateOfBirth: birthDate,
        gender,
        state,
        city,
        courseCode,
        semOrYear: Number(semOrYear),
        subject,
        position,
        profilePic
      });
    } else {
      addFaculty({
        facultyName,
        facultyId: Number(facultyId),
        emailId,
        contactNumber,
        qualification,
        experience,
        birthDate,
        dateOfBirth: birthDate,
        gender,
        state,
        city,
        courseCode,
        semOrYear: Number(semOrYear),
        subject,
        position,
        profilePic,
        joinedDate: new Date().toISOString().split('T')[0],
        password: `faculty@${facultyId}`,
        activeStatus: false,
        lastLogin: 'Never'
      });
    }
    setIsModalOpen(false);
  };

  const filteredFaculties = faculties.filter(f => {
    const matchCourse = selectedCourse === 'All' || f.courseCode === selectedCourse;
    const matchSearch =
      f.facultyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.facultyId.toString().includes(searchTerm);
    return matchCourse && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-500" />
            <span>Faculty Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Faculty credentials, department allocations, subjects, and contact profiles.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Faculty</span>
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
            placeholder="Search by name, ID, or subject..."
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
            <option key={c.id} value={c.courseCode}>{c.courseCode} Department</option>
          ))}
        </select>
      </div>

      {/* Grid of Faculty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFaculties.map(fac => (
          <div
            key={fac.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={fac.profilePic || '/Ajay Parmar.png'}
                    alt={fac.facultyName}
                    className="w-12 h-12 rounded-full border border-amber-500/30 object-cover bg-slate-800"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{fac.facultyName}</h3>
                    <p className="text-[11px] text-amber-400 font-medium">{fac.position}</p>
                    <span className="text-[10px] text-slate-500">ID: #{fac.facultyId}</span>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(fac)}
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                      title="Edit Faculty"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete faculty ${fac.facultyName}?`)) {
                          deleteFaculty(fac.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                      title="Delete Faculty"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">
                    <strong>{fac.courseCode}</strong> Sem {fac.semOrYear}: {fac.subject}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Award className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate">{fac.qualification} ({fac.experience})</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{fac.emailId}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{fac.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{fac.city}, {fac.state}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className={`w-2 h-2 rounded-full ${fac.activeStatus ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                <span>{fac.activeStatus ? 'Active Online' : `Last: ${fac.lastLogin}`}</span>
              </span>

              {isAdmin && (
                <button
                  onClick={() => quickLogin('faculty', fac.facultyId.toString())}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3 h-3" />
                  <span>Login As</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white">
                {editingFaculty ? 'Edit Faculty Details' : 'Register New Faculty'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    value={facultyName}
                    onChange={e => setFacultyName(e.target.value)}
                    placeholder="Prof. John Doe"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Faculty ID</label>
                  <input
                    type="number"
                    value={facultyId}
                    onChange={e => setFacultyId(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email ID</label>
                  <input
                    type="email"
                    value={emailId}
                    onChange={e => setEmailId(e.target.value)}
                    placeholder="faculty@gecbhv.edu.in"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={e => setContactNumber(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Programming for Problem Solving"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={e => setQualification(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Experience</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
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
                  {editingFaculty ? 'Save Changes' : 'Register Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
