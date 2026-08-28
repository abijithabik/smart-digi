import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Save, Check, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const MarksView: React.FC = () => {
  const {
    students,
    courses,
    subjects,
    marks,
    saveMarks,
    declaredResults,
    toggleResultDeclaration,
    currentUser
  } = useApp();

  const [selectedCourse, setSelectedCourse] = useState<string>(currentUser?.courseCode || 'IT');
  const [selectedSem, setSelectedSem] = useState<number>(currentUser?.semOrYear || 1);
  const [selectedSubject, setSelectedSubject] = useState<string>('IT103');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter subjects
  const availableSubjects = subjects.filter(
    s => s.courseCode === selectedCourse && s.semOrYear === selectedSem
  );
  const currentSub = subjects.find(s => s.subjectCode === selectedSubject) || availableSubjects[0];

  // Filter students
  const classStudents = students.filter(
    s => s.courseCode === selectedCourse && s.semOrYear === selectedSem
  );

  // State map: { [rollNumber]: { theory: number; practical: number } }
  const [marksState, setMarksState] = useState<Record<number, { theory: number; practical: number }>>({});

  // Result declaration key
  const declarationKey = `${selectedCourse}_${selectedSem}`;
  const isDeclared = !!declaredResults[declarationKey];

  React.useEffect(() => {
    const nextMap: Record<number, { theory: number; practical: number }> = {};
    classStudents.forEach(st => {
      const existing = marks.find(
        m =>
          m.courseCode === selectedCourse &&
          m.semOrYear === selectedSem &&
          m.subjectCode === selectedSubject &&
          m.rollNumber === st.rollNumber
      );
      nextMap[st.rollNumber] = {
        theory: existing ? existing.theoryMarks : 55,
        practical: existing ? existing.practicalMarks : 25
      };
    });
    setMarksState(nextMap);
  }, [selectedCourse, selectedSem, selectedSubject, marks]);

  const handleMarksChange = (roll: number, field: 'theory' | 'practical', val: number) => {
    const max = field === 'theory' ? (currentSub?.theoryMarks || 70) : (currentSub?.practicalMarks || 30);
    const clamped = Math.max(0, Math.min(max, val));
    setMarksState(prev => ({
      ...prev,
      [roll]: {
        ...prev[roll],
        [field]: clamped
      }
    }));
  };

  const handleSave = () => {
    if (!currentSub) return;
    const records = classStudents.map(st => {
      const item = marksState[st.rollNumber] || { theory: 50, practical: 20 };
      return {
        courseCode: selectedCourse,
        semOrYear: selectedSem,
        subjectCode: currentSub.subjectCode,
        subjectName: currentSub.subjectName,
        rollNumber: st.rollNumber,
        theoryMarks: item.theory,
        practicalMarks: item.practical
      };
    });

    saveMarks(records);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Marks Evaluation & Result Moderation</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Input university theoretical scores, practical viva marks, and publish official grade sheets.
          </p>
        </div>

        {/* Result Declaration Toggle (Admin / Faculty) */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <div className="text-right">
            <div className="text-xs font-bold text-white">Result Declaration</div>
            <div className="text-[10px] text-slate-400">
              {isDeclared ? 'Results Published' : 'Results Pending'}
            </div>
          </div>
          <button
            onClick={() => toggleResultDeclaration(selectedCourse, selectedSem)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              isDeclared
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-rose-500 text-white hover:bg-rose-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isDeclared ? 'PUBLISHED' : 'DECLARE NOW'}</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Department</label>
          <select
            value={selectedCourse}
            onChange={e => {
              setSelectedCourse(e.target.value);
              const firstSub = subjects.find(s => s.courseCode === e.target.value);
              if (firstSub) setSelectedSubject(firstSub.subjectCode);
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {courses.map(c => (
              <option key={c.id} value={c.courseCode}>{c.courseCode} - {c.courseName}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Semester</label>
          <select
            value={selectedSem}
            onChange={e => setSelectedSem(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-slate-400 mb-1">Subject</label>
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {availableSubjects.map(s => (
              <option key={s.id} value={s.subjectCode}>{s.subjectCode} - {s.subjectName}</option>
            ))}
          </select>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Marks updated and synchronized successfully!</span>
        </div>
      )}

      {/* Marks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Evaluating: <strong className="text-amber-400">{currentSub?.subjectName || selectedSubject}</strong>{' '}
            (Max Theory: {currentSub?.theoryMarks || 70} | Max Practical: {currentSub?.practicalMarks || 30})
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save All Marks</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Theory (Max {currentSub?.theoryMarks || 70})</th>
                <th className="px-5 py-3.5">Practical (Max {currentSub?.practicalMarks || 30})</th>
                <th className="px-5 py-3.5 text-center">Total (100)</th>
                <th className="px-5 py-3.5 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {classStudents.map(st => {
                const entry = marksState[st.rollNumber] || { theory: 0, practical: 0 };
                const total = entry.theory + entry.practical;

                let grade = 'FF';
                let gradeClass = 'text-rose-400';
                if (total >= 85) { grade = 'AA'; gradeClass = 'text-emerald-400'; }
                else if (total >= 75) { grade = 'AB'; gradeClass = 'text-emerald-400'; }
                else if (total >= 65) { grade = 'BB'; gradeClass = 'text-amber-400'; }
                else if (total >= 55) { grade = 'BC'; gradeClass = 'text-amber-400'; }
                else if (total >= 45) { grade = 'CC'; gradeClass = 'text-blue-400'; }
                else if (total >= 35) { grade = 'CD'; gradeClass = 'text-slate-400'; }

                return (
                  <tr key={st.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-amber-400">#{st.rollNumber}</td>
                    <td className="px-5 py-3 font-semibold text-white">
                      {st.firstName} {st.lastName}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400">{st.userId}</td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        min="0"
                        max={currentSub?.theoryMarks || 70}
                        value={entry.theory}
                        onChange={e => handleMarksChange(st.rollNumber, 'theory', Number(e.target.value))}
                        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <input
                        type="number"
                        min="0"
                        max={currentSub?.practicalMarks || 30}
                        value={entry.practical}
                        onChange={e => handleMarksChange(st.rollNumber, 'practical', Number(e.target.value))}
                        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-semibold text-white focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    <td className="px-5 py-3 text-center font-extrabold text-sm text-white">
                      {total}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <span className={`font-mono font-extrabold text-xs px-2.5 py-1 rounded-md bg-slate-800 ${gradeClass}`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
