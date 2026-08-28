import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Plus, Trash2, Edit3, X, Search, Filter } from 'lucide-react';
import { Subject } from '../../types';

export const SubjectsView: React.FC = () => {
  const { subjects, courses, addSubject, updateSubject, deleteSubject, currentUser } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<string>('All');
  const [selectedSem, setSelectedSem] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [courseCode, setCourseCode] = useState(courses[0]?.courseCode || 'IT');
  const [semOrYear, setSemOrYear] = useState(1);
  const [subjectType, setSubjectType] = useState<'Core' | 'Optional'>('Core');
  const [theoryMarks, setTheoryMarks] = useState(70);
  const [practicalMarks, setPracticalMarks] = useState(30);

  const isAdmin = currentUser?.role === 'admin';

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setSubjectCode('');
    setSubjectName('');
    setCourseCode(courses[0]?.courseCode || 'IT');
    setSemOrYear(1);
    setSubjectType('Core');
    setTheoryMarks(70);
    setPracticalMarks(30);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Subject) => {
    setEditingSubject(s);
    setSubjectCode(s.subjectCode);
    setSubjectName(s.subjectName);
    setCourseCode(s.courseCode);
    setSemOrYear(s.semOrYear);
    setSubjectType(s.subjectType);
    setTheoryMarks(s.theoryMarks);
    setPracticalMarks(s.practicalMarks);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectCode.trim() || !subjectName.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: subjectName.trim(),
        courseCode,
        semOrYear: Number(semOrYear),
        subjectType,
        theoryMarks: Number(theoryMarks),
        practicalMarks: Number(practicalMarks)
      });
    } else {
      addSubject({
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: subjectName.trim(),
        courseCode,
        semOrYear: Number(semOrYear),
        subjectType,
        theoryMarks: Number(theoryMarks),
        practicalMarks: Number(practicalMarks)
      });
    }
    setIsModalOpen(false);
  };

  const filteredSubjects = subjects.filter(s => {
    const matchCourse = selectedCourse === 'All' || s.courseCode === selectedCourse;
    const matchSem = selectedSem === 'All' || s.semOrYear.toString() === selectedSem;
    const matchSearch =
      s.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCourse && matchSem && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-amber-500" />
            <span>Subject Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curriculum subjects, theoretical weightages, and practical lab assignments.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </button>
        )}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search subjects by name or code..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>
            ))}
          </select>

          <select
            value={selectedSem}
            onChange={e => setSelectedSem(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem.toString()}>Semester {sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Subject Code</th>
                <th className="px-5 py-3.5">Subject Name</th>
                <th className="px-5 py-3.5">Department</th>
                <th className="px-5 py-3.5">Semester</th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Marks (Theory / Practical)</th>
                {isAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredSubjects.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-amber-400">{sub.subjectCode}</td>
                  <td className="px-5 py-3 font-semibold text-white">{sub.subjectName}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {sub.courseCode}
                    </span>
                  </td>
                  <td className="px-5 py-3">Sem {sub.semOrYear}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.subjectType === 'Core'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {sub.subjectType}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-white">{sub.theoryMarks}</span> (Th) +{' '}
                    <span className="font-semibold text-white">{sub.practicalMarks}</span> (Pr) ={' '}
                    <strong className="text-amber-400">{sub.theoryMarks + sub.practicalMarks}</strong>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(sub)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                          title="Edit Subject"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete subject ${sub.subjectName}?`)) {
                              deleteSubject(sub.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-5 py-8 text-center text-slate-500">
                    No subjects found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={e => setSubjectCode(e.target.value)}
                    placeholder="e.g. IT101"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white uppercase focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course/Dept</label>
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
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject Name</label>
                <input
                  type="text"
                  value={subjectName}
                  onChange={e => setSubjectName(e.target.value)}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject Type</label>
                  <select
                    value={subjectType}
                    onChange={e => setSubjectType(e.target.value as 'Core' | 'Optional')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Core">Core</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Theory Marks</label>
                  <input
                    type="number"
                    value={theoryMarks}
                    onChange={e => setTheoryMarks(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Practical Marks</label>
                  <input
                    type="number"
                    value={practicalMarks}
                    onChange={e => setPracticalMarks(Number(e.target.value))}
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
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
