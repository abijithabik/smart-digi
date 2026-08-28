import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Plus, Trash2, Edit3, X, Check, Search } from 'lucide-react';
import { Course } from '../../types';

export const CoursesView: React.FC = () => {
  const { courses, subjects, addCourse, updateCourse, deleteCourse, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [semOrYear, setSemOrYear] = useState<'Sem' | 'Year'>('Sem');
  const [totalSemOrYear, setTotalSemOrYear] = useState(8);

  const isAdmin = currentUser?.role === 'admin';

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setCourseCode('');
    setCourseName('');
    setSemOrYear('Sem');
    setTotalSemOrYear(8);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setCourseCode(c.courseCode);
    setCourseName(c.courseName);
    setSemOrYear(c.semOrYear);
    setTotalSemOrYear(c.totalSemOrYear);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseName.trim()) return;

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        courseCode: courseCode.toUpperCase().trim(),
        courseName: courseName.trim(),
        semOrYear,
        totalSemOrYear: Number(totalSemOrYear)
      });
    } else {
      addCourse({
        courseCode: courseCode.toUpperCase().trim(),
        courseName: courseName.trim(),
        semOrYear,
        totalSemOrYear: Number(totalSemOrYear)
      });
    }
    setIsModalOpen(false);
  };

  const filteredCourses = courses.filter(
    c =>
      c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <span>Courses & Departments</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage academic degree programs, duration structures, and curricula.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by code or course name..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map(course => {
          const subjectCount = subjects.filter(s => s.courseCode === course.courseCode).length;
          return (
            <div
              key={course.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold tracking-wide">
                    {course.courseCode}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                        title="Edit Course"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${course.courseName}?`)) {
                            deleteCourse(course.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mt-3 leading-snug">{course.courseName}</h3>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Duration: <strong className="text-slate-200">{course.totalSemOrYear} {course.semOrYear}s</strong>
                </span>
                <span className="bg-slate-800 px-2 py-0.5 rounded-md text-[11px] text-slate-300">
                  {subjectCount} Subjects
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="text-sm font-bold text-white">
                {editingCourse ? 'Edit Course Details' : 'Add New Course'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course Code</label>
                <input
                  type="text"
                  value={courseCode}
                  onChange={e => setCourseCode(e.target.value)}
                  placeholder="e.g. IT, CE, MECH"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course Name</label>
                <input
                  type="text"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="e.g. Information Technology"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Structure Type</label>
                  <select
                    value={semOrYear}
                    onChange={e => setSemOrYear(e.target.value as 'Sem' | 'Year')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sem">Semester</option>
                    <option value="Year">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Total Sem/Years</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={totalSemOrYear}
                    onChange={e => setTotalSemOrYear(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
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
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
