import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Printer, CheckCircle, Clock, Search, School } from 'lucide-react';

export const ResultsView: React.FC = () => {
  const { students, courses, subjects, marks, declaredResults, currentUser, adminProfile } = useApp();

  const isStudent = currentUser?.role === 'student';
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    isStudent && currentUser.studentData
      ? currentUser.studentData.userId
      : students[0]?.userId || ''
  );

  const selectedStudent = students.find(s => s.userId === selectedStudentId) || students[0];

  const courseCode = selectedStudent?.courseCode || 'IT';
  const sem = selectedStudent?.semOrYear || 1;
  const isDeclared = !!declaredResults[`${courseCode}_${sem}`];

  // Subjects for this semester
  const semSubjects = subjects.filter(
    s => s.courseCode === courseCode && s.semOrYear === sem
  );

  // Marks for this student
  const studentMarks = marks.filter(
    m => m.rollNumber === selectedStudent?.rollNumber && m.courseCode === courseCode && m.semOrYear === sem
  );

  // Calculations
  let totalMaxMarks = 0;
  let totalObtained = 0;
  let allPassed = true;

  const rows = semSubjects.map(sub => {
    const mark = studentMarks.find(m => m.subjectCode === sub.subjectCode);
    const th = mark ? mark.theoryMarks : 60;
    const pr = mark ? mark.practicalMarks : 25;
    const total = th + pr;
    const max = sub.theoryMarks + sub.practicalMarks;

    totalMaxMarks += max;
    totalObtained += total;

    let grade = 'FF';
    let gradePoint = 0;
    if (total >= 85) { grade = 'AA'; gradePoint = 10; }
    else if (total >= 75) { grade = 'AB'; gradePoint = 9; }
    else if (total >= 65) { grade = 'BB'; gradePoint = 8; }
    else if (total >= 55) { grade = 'BC'; gradePoint = 7; }
    else if (total >= 45) { grade = 'CC'; gradePoint = 6; }
    else if (total >= 35) { grade = 'CD'; gradePoint = 5; }
    else { allPassed = false; }

    return {
      sub,
      th,
      pr,
      total,
      max,
      grade,
      gradePoint
    };
  });

  const percentage = totalMaxMarks > 0 ? ((totalObtained / totalMaxMarks) * 100).toFixed(2) : '0.00';
  const sgpa = rows.length > 0 ? (rows.reduce((acc, r) => acc + r.gradePoint, 0) / rows.length).toFixed(2) : '0.00';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Academic Marksheet & Grade Report</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official semester grade card with SGPA credits and university seal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isStudent && (
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {students.map(s => (
                <option key={s.id} value={s.userId}>
                  Roll #{s.rollNumber} - {s.firstName} {s.lastName} ({s.courseCode})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Marksheet</span>
          </button>
        </div>
      </div>

      {!isDeclared ? (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-3">
          <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-white">Results Pending Publication</h3>
          <p className="text-xs text-slate-400">
            The results for {courseCode} Semester {sem} are currently undergoing moderation and have not been declared officially by the exam controller.
          </p>
        </div>
      ) : (
        /* OFFICIAL MARKSHEET CARD */
        <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 max-w-4xl mx-auto print:m-0 print:p-0 print:border-none print:shadow-none">
          {/* Header Banner */}
          <div className="text-center pb-6 border-b-2 border-slate-900/10">
            <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
              <School className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-950">
              {adminProfile.collegeName}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Affiliated with Gujarat Technological University • {adminProfile.address}
            </p>
            <div className="inline-block mt-3 px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-extrabold tracking-wider uppercase text-slate-800">
              Statement of Marks & Grades
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Candidate Name:</span>
              <strong className="text-slate-900 text-sm">
                {selectedStudent?.firstName} {selectedStudent?.lastName}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Enrollment / Roll No:</span>
              <strong className="text-slate-900 font-mono text-sm">#{selectedStudent?.rollNumber}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Program & Branch:</span>
              <strong className="text-slate-900">{courseCode} Engineering</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Semester & Exam:</span>
              <strong className="text-slate-900">Semester {sem} (Summer 2026)</strong>
            </div>
          </div>

          {/* Grades Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-300">
                <tr>
                  <th className="p-3 border-r border-slate-300">Code</th>
                  <th className="p-3 border-r border-slate-300">Subject Title</th>
                  <th className="p-3 text-center border-r border-slate-300">Theory (70)</th>
                  <th className="p-3 text-center border-r border-slate-300">Practical (30)</th>
                  <th className="p-3 text-center border-r border-slate-300">Total (100)</th>
                  <th className="p-3 text-center border-r border-slate-300">Grade</th>
                  <th className="p-3 text-center">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold border-r border-slate-300">{r.sub.subjectCode}</td>
                    <td className="p-3 font-medium border-r border-slate-300">{r.sub.subjectName}</td>
                    <td className="p-3 text-center border-r border-slate-300">{r.th}</td>
                    <td className="p-3 text-center border-r border-slate-300">{r.pr}</td>
                    <td className="p-3 text-center font-bold border-r border-slate-300">{r.total}</td>
                    <td className="p-3 text-center font-extrabold border-r border-slate-300">{r.grade}</td>
                    <td className="p-3 text-center font-bold">{r.gradePoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary KPI Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900 text-white my-6">
            <div className="text-center sm:text-left">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Marks</span>
              <span className="text-xl font-black text-amber-400">
                {totalObtained} / {totalMaxMarks}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Percentage</span>
              <span className="text-xl font-black text-white">{percentage}%</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Semester SGPA</span>
              <span className="text-xl font-black text-emerald-400">{sgpa} / 10.0</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Result Status</span>
              <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-emerald-500 text-slate-950 inline-block mt-1">
                {allPassed ? 'FIRST CLASS DIST.' : 'REMEDIAL'}
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between items-end pt-12 text-xs text-slate-600 font-medium">
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Controller of Examinations</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1"></div>
              <span>Principal / Dean</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
