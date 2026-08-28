import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ODRequest, ODStatus } from '../../types';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
  Calendar,
  User,
  Filter,
  Plus,
  Eye,
  FileCheck,
  Building,
  Paperclip,
  Check,
  X,
  Printer,
  Download,
  Info
} from 'lucide-react';

export const ODLeaveView: React.FC = () => {
  const {
    currentUser,
    odRequests,
    submitODRequest,
    updateODStatus,
    students
  } = useApp();

  const role = currentUser?.role || 'student';
  const isStaffOrAdmin = role === 'faculty' || role === 'admin';

  // Filters & State
  const [activeTab, setActiveTab] = useState<'all' | 'my-requests' | 'review-queue' | 'submit'>(
    isStaffOrAdmin ? 'review-queue' : 'my-requests'
  );
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedOD, setSelectedOD] = useState<ODRequest | null>(null);
  const [showProofModal, setShowProofModal] = useState<ODRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState<ODRequest | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState<ODRequest | null>(null);

  // Form State for new OD
  const [formCategory, setFormCategory] = useState<'On-Duty (OD)' | 'Medical Leave' | 'Casual Leave' | 'Event/Competition'>('On-Duty (OD)');
  const [formReason, setFormReason] = useState('');
  const [formEventName, setFormEventName] = useState('');
  const [formFromDate, setFormFromDate] = useState('');
  const [formToDate, setFormToDate] = useState('');
  const [formTotalDays, setFormTotalDays] = useState(1);
  const [formProofDocName, setFormProofDocName] = useState('');
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Calculate days when dates change
  const handleDateChange = (from: string, to: string) => {
    setFormFromDate(from);
    setFormToDate(to);
    if (from && to) {
      const d1 = new Date(from);
      const d2 = new Date(to);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormTotalDays(diffDays > 0 ? diffDays : 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormProofDocName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const studentName = currentUser.name;
    const rollNo = currentUser.studentData?.rollNumber || 1001;
    const courseCode = currentUser.courseCode || 'IT';
    const semOrYear = currentUser.semOrYear || 1;

    submitODRequest({
      userId: currentUser.userId,
      studentName,
      rollNumber: rollNo,
      courseCode,
      semOrYear,
      category: formCategory,
      reason: formReason,
      eventName: formEventName || undefined,
      fromDate: formFromDate || new Date().toISOString().split('T')[0],
      toDate: formToDate || new Date().toISOString().split('T')[0],
      totalDays: formTotalDays,
      documentUrl: formProofDocName ? `/docs/${formProofDocName}` : undefined,
      proofDocument: formProofDocName ? `/docs/${formProofDocName}` : undefined,
      proofDocumentName: formProofDocName || 'Event_Invitation_Letter.pdf'
    });

    setFormSuccessMessage('OD / Leave request submitted successfully! Assigned faculty has been notified.');
    setFormReason('');
    setFormEventName('');
    setFormFromDate('');
    setFormToDate('');
    setFormProofDocName('');
    setTimeout(() => {
      setFormSuccessMessage('');
      setActiveTab('my-requests');
    }, 1800);
  };

  // Filter requests
  const userRequests = isStaffOrAdmin
    ? odRequests
    : odRequests.filter(r => r.userId === currentUser?.userId || r.rollNumber === currentUser?.studentData?.rollNumber);

  const displayedRequests = userRequests.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
    return true;
  });

  // Stats
  const totalCount = userRequests.length;
  const approvedCount = userRequests.filter(r => r.status === 'Approved').length;
  const pendingCount = userRequests.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length;
  const rejectedCount = userRequests.filter(r => r.status === 'Rejected').length;

  const getStatusBadge = (status: ODStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Under Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <FileCheck className="w-4 h-4" />
            <span>Digital Approval & Workflow Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            On-Duty (OD) & Leave Management
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Submit duty leaves for hackathons, competitions, industrial visits, or medical leaves with proof verification and digital faculty approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {role === 'student' && (
            <button
              onClick={() => setActiveTab('submit')}
              className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Apply for OD / Leave</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-400">Total Applications</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
          <div className="text-[11px] text-slate-500 mt-1">This academic semester</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-emerald-400">Approved Passes</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</p>
          <div className="text-[11px] text-slate-500 mt-1">Attendance credited</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-amber-400">Pending Review</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting staff action</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-rose-400">Rejected</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{rejectedCount}</p>
          <div className="text-[11px] text-slate-500 mt-1">Remarks available</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {isStaffOrAdmin && (
          <button
            onClick={() => setActiveTab('review-queue')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'review-queue'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Staff Review Queue ({pendingCount})</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('my-requests')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'my-requests'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{isStaffOrAdmin ? 'All Records' : 'My OD & Leave Records'}</span>
        </button>
        {role === 'student' && (
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'submit'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        )}
      </div>

      {/* Tab 1: Submit Form */}
      {activeTab === 'submit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Apply for On-Duty (OD) / Leave</h2>
              <p className="text-xs text-slate-400">Provide official details, duration, and supporting event circular or medical prescription.</p>
            </div>
          </div>

          {formSuccessMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Leave / OD Category *
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                >
                  <option value="On-Duty (OD)">On-Duty (OD) - Hackathon / Symposium</option>
                  <option value="Event/Competition">Inter-College Competition</option>
                  <option value="Medical Leave">Medical Leave (Doctor Certificate)</option>
                  <option value="Casual Leave">Casual / Personal Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Event / Organization Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Smart India Hackathon 2026 / IIT Bombay"
                  value={formEventName}
                  onChange={(e) => setFormEventName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  From Date *
                </label>
                <input
                  type="date"
                  value={formFromDate}
                  onChange={(e) => handleDateChange(e.target.value, formToDate)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  To Date *
                </label>
                <input
                  type="date"
                  value={formToDate}
                  onChange={(e) => handleDateChange(formFromDate, e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Total Day(s)
                </label>
                <input
                  type="number"
                  value={formTotalDays}
                  readOnly
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Detailed Purpose / Justification *
              </label>
              <textarea
                rows={3}
                placeholder="Explain the reason for OD or leave, team members, venue, and how you will cover missed lectures..."
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                required
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Supporting Document / Event Proof (PDF or Image)
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-4 text-center bg-slate-800/40 transition-colors">
                <input
                  type="file"
                  id="od-file-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <label
                  htmlFor="od-file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <Paperclip className="w-6 h-6 text-amber-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    {formProofDocName ? (
                      <span className="text-amber-300 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" /> Attached: {formProofDocName}
                      </span>
                    ) : (
                      'Click to browse or drop Acceptance Letter, Ticket, or Medical Certificate'
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500">PDF, PNG, JPG up to 10MB</span>
                </label>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('my-requests')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-sm rounded-xl hover:bg-amber-400 shadow-lg transition-all"
              >
                Submit for Staff Approval
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Review Queue & All Requests Table */}
      {activeTab !== 'submit' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 font-semibold">Filter Status:</span>
              {['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="All">All Categories</option>
                <option value="On-Duty (OD)">On-Duty (OD)</option>
                <option value="Event/Competition">Event/Competition</option>
                <option value="Medical Leave">Medical Leave</option>
                <option value="Casual Leave">Casual Leave</option>
              </select>
            </div>
          </div>

          {/* Records Table / List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {displayedRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <FileCheck className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                <p className="text-base font-semibold text-slate-300">No OD or Leave requests found</p>
                <p className="text-xs mt-1">Try changing filters or submit a new OD application.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Request ID</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Category & Purpose</th>
                      <th className="py-3 px-4">Dates / Duration</th>
                      <th className="py-3 px-4">Proof</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-normal">
                    {displayedRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{req.requestId}</div>
                          <div className="text-[10px] text-slate-500">{req.submittedAt}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{req.studentName}</div>
                          <div className="text-xs text-slate-400">
                            Roll #{req.rollNumber} • {req.courseCode} Sem {req.semOrYear}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <span className="inline-block text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mb-1">
                            {req.category}
                          </span>
                          {req.eventName && (
                            <div className="text-xs font-medium text-slate-200 truncate">{req.eventName}</div>
                          )}
                          <div className="text-xs text-slate-400 line-clamp-1">{req.reason}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-xs font-medium text-white flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{req.fromDate}</span>
                            {req.fromDate !== req.toDate && <span> to {req.toDate}</span>}
                          </div>
                          <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
                            {req.totalDays} Day{req.totalDays > 1 ? 's' : ''}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {req.proofDocumentName ? (
                            <button
                              onClick={() => setShowProofModal(req)}
                              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
                            >
                              <Paperclip className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[90px]">{req.proofDocumentName}</span>
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          {getStatusBadge(req.status)}
                          {req.reviewedBy && (
                            <div className="text-[10px] text-slate-400 mt-1">
                              By {req.reviewedBy}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Action for Staff / Admin */}
                            {isStaffOrAdmin && req.status !== 'Approved' && (
                              <button
                                onClick={() => {
                                  setShowApprovalModal(req);
                                  setReviewRemarks(req.reviewRemarks || '');
                                }}
                                className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                title="Review / Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Review</span>
                              </button>
                            )}

                            {/* Download Pass for Approved */}
                            {req.status === 'Approved' && (
                              <button
                                onClick={() => setShowCertificateModal(req)}
                                className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                                title="Download / Print OD Pass"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>OD Slip</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedOD(req)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: View Details */}
      {selectedOD && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">OD Application Details</h3>
              </div>
              <button
                onClick={() => setSelectedOD(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Request ID</span>
                <span className="font-bold text-white">{selectedOD.requestId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Student Name</span>
                <span className="font-bold text-white">{selectedOD.studentName} (Roll #{selectedOD.rollNumber})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Course & Semester</span>
                <span className="font-semibold text-slate-200">{selectedOD.courseCode} - Semester {selectedOD.semOrYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Category</span>
                <span className="font-semibold text-amber-400">{selectedOD.category}</span>
              </div>
              {selectedOD.eventName && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Event / Host</span>
                  <span className="font-semibold text-slate-200">{selectedOD.eventName}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Date Range</span>
                <span className="font-semibold text-white">{selectedOD.fromDate} to {selectedOD.toDate} ({selectedOD.totalDays} Days)</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Reason / Statement:</span>
                <p className="text-slate-300 bg-slate-800 p-2.5 rounded-lg">{selectedOD.reason}</p>
              </div>

              {selectedOD.proofDocumentName && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Attached Proof:</span>
                  <button
                    onClick={() => setShowProofModal(selectedOD)}
                    className="text-amber-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    {selectedOD.proofDocumentName}
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center py-1 border-t border-slate-800 pt-2">
                <span className="text-slate-400">Current Status:</span>
                {getStatusBadge(selectedOD.status)}
              </div>

              {selectedOD.reviewRemarks && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                  <span className="font-bold block">Authority Remarks ({selectedOD.reviewedBy}):</span>
                  {selectedOD.reviewRemarks}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedOD(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Staff Review / Approval Action */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Faculty / Director Review</h3>
              </div>
              <button
                onClick={() => setShowApprovalModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-2">
              <p className="text-slate-300">
                Reviewing OD request <strong className="text-white">{showApprovalModal.requestId}</strong> submitted by{' '}
                <strong className="text-amber-400">{showApprovalModal.studentName}</strong> for {showApprovalModal.totalDays} day(s).
              </p>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="font-medium text-slate-400 text-[11px]">Event / Purpose:</div>
                <div className="text-slate-200 mt-0.5">{showApprovalModal.eventName || showApprovalModal.category} - "{showApprovalModal.reason}"</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Review Remarks / Instructions
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Approved. Ensure lab practical submission is completed by Friday."
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  updateODStatus(showApprovalModal.id, 'Rejected', reviewRemarks || 'OD application rejected by faculty reviewer.');
                  setShowApprovalModal(null);
                }}
                className="px-4 py-2.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  updateODStatus(showApprovalModal.id, 'Approved', reviewRemarks || 'OD verified and attendance waiver granted.');
                  setShowApprovalModal(null);
                }}
                className="px-5 py-2.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve & Grant OD</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Proof Preview */}
      {showProofModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Attached Verification Document</h3>
              </div>
              <button
                onClick={() => setShowProofModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 text-center space-y-3">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl mx-auto flex items-center justify-center text-amber-400">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{showProofModal.proofDocumentName}</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Submitted by {showProofModal.studentName} on {showProofModal.submittedAt}
                </p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-left text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Event:</span>
                  <span className="font-medium text-amber-400">{showProofModal.eventName || showProofModal.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates:</span>
                  <span>{showProofModal.fromDate} - {showProofModal.toDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verification Hash:</span>
                  <span className="font-mono text-[10px] text-slate-400">SHA256:7e8d9a4...</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowProofModal(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Stamped OD Authorization Slip */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6">
            {/* Header of Certificate */}
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                Smart Digi College of Engineering & Technology
              </div>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1">
                OFFICIAL ON-DUTY (OD) AUTHORIZATION PASS
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Pass Reference No: {showCertificateModal.requestId}
              </p>
            </div>

            {/* Body */}
            <div className="space-y-4 text-xs leading-relaxed">
              <p>
                This is to officially certify that <strong>{showCertificateModal.studentName}</strong>, bearing Roll Number{' '}
                <strong>{showCertificateModal.rollNumber}</strong> of Department of{' '}
                <strong>{showCertificateModal.courseCode} Engineering (Semester {showCertificateModal.semOrYear})</strong> has been granted approved On-Duty (OD) status for the following institutional/academic activity:
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Activity / Event:</span>
                  <strong className="text-slate-900">{showCertificateModal.eventName || showCertificateModal.category}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration:</span>
                  <strong>{showCertificateModal.fromDate} to {showCertificateModal.toDate} ({showCertificateModal.totalDays} Days)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nature of Leave:</span>
                  <strong>{showCertificateModal.category}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authority Endorsement:</span>
                  <strong className="text-emerald-700">{showCertificateModal.reviewedBy || 'Academic Dean'} (Verified)</strong>
                </div>
              </div>

              <p className="text-slate-600 italic">
                Note: Respective subject instructors are instructed to mark attendance as "Present (On-Duty)" in the central ERP records for the specified dates.
              </p>

              {/* Digital Stamp & Signatures */}
              <div className="pt-6 flex items-center justify-between border-t border-slate-200">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center p-1 text-[9px] font-bold text-emerald-700 leading-tight">
                    DIGITALLY VERIFIED CAMPUS ERP
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{showCertificateModal.reviewedAt}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-sm text-slate-950 font-serif">Dr. K. R. Sharma</div>
                  <div className="text-[10px] text-slate-600">Director & Dean of Academics</div>
                  <div className="text-[9px] text-slate-400">Campus Authorization Seal</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowCertificateModal(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-bold shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
