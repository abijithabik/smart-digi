import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceRequest, ServiceStatus, CertificateRequest, CertificateStatus } from '../../types';
import {
  HelpCircle,
  FileCheck2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Filter,
  Download,
  Printer,
  X,
  Building,
  User,
  Sparkles,
  Award,
  Wrench,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const {
    currentUser,
    serviceRequests,
    submitServiceRequest,
    updateServiceRequestStatus,
    certificateRequests,
    submitCertificateRequest,
    updateCertificateStatus,
    adminProfile
  } = useApp();

  const role = currentUser?.role || 'student';
  const isStaffOrAdmin = role === 'admin' || role === 'faculty';

  const [activeTab, setActiveTab] = useState<'helpdesk' | 'certificates'>('helpdesk');

  // Helpdesk Request Form State
  const [showHelpdeskModal, setShowHelpdeskModal] = useState(false);
  const [hdCategory, setHdCategory] = useState<'Academic' | 'Hostel/Mess' | 'Lab/Equipment' | 'WiFi/IT' | 'Library' | 'Administrative'>('Lab/Equipment');
  const [hdSubject, setHdSubject] = useState('');
  const [hdDescription, setHdDescription] = useState('');
  const [hdPriority, setHdPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [hdLocation, setHdLocation] = useState('');

  // Certificate Request Form State
  const [showCertModal, setShowCertModal] = useState(false);
  const [certType, setCertType] = useState<'Bonafide Certificate' | 'Course Completion' | 'Custodian Certificate' | 'No Objection Certificate (NOC)' | 'Letter of Recommendation (LOR)'>('Bonafide Certificate');
  const [certPurpose, setCertPurpose] = useState('');

  // Certificate Stamped Preview Modal
  const [previewCert, setPreviewCert] = useState<CertificateRequest | null>(null);

  // Status updating modal for Staff
  const [updatingTicket, setUpdatingTicket] = useState<ServiceRequest | null>(null);
  const [ticketStatus, setTicketStatus] = useState<ServiceStatus>('In Progress');
  const [ticketResolution, setTicketResolution] = useState('');
  const [ticketAssignee, setTicketAssignee] = useState('');

  // Filter
  const [helpdeskFilter, setHelpdeskFilter] = useState<string>('All');
  const [certFilter, setCertFilter] = useState<string>('All');

  const filteredTickets = serviceRequests.filter(t => {
    if (helpdeskFilter !== 'All' && t.status !== helpdeskFilter) return false;
    if (!isStaffOrAdmin && t.userId !== currentUser?.userId) return false;
    return true;
  });

  const filteredCerts = certificateRequests.filter(c => {
    if (certFilter !== 'All' && c.status !== certFilter) return false;
    if (!isStaffOrAdmin && c.userId !== currentUser?.userId) return false;
    return true;
  });

  const handleHelpdeskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    submitServiceRequest({
      userId: currentUser.userId,
      studentName: currentUser.name,
      rollNumber: currentUser.studentData?.rollNumber || 1001,
      courseCode: currentUser.courseCode || 'IT',
      semOrYear: currentUser.semOrYear || 1,
      category: hdCategory,
      subject: hdSubject,
      description: hdDescription,
      priority: hdPriority,
      location: hdLocation || undefined
    });

    setShowHelpdeskModal(false);
    setHdSubject('');
    setHdDescription('');
    setHdLocation('');
  };

  const handleCertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    submitCertificateRequest({
      userId: currentUser.userId,
      studentName: currentUser.name,
      rollNumber: currentUser.studentData?.rollNumber || 1001,
      courseCode: currentUser.courseCode || 'IT',
      semOrYear: currentUser.semOrYear || 1,
      certificateType: certType,
      purpose: certPurpose
    });

    setShowCertModal(false);
    setCertPurpose('');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'High':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">High</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">Normal</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
      case 'Approved':
      case 'Ready for Download':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'In Progress':
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3.5 h-3.5" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4" />
            <span>Student Services & Administrative Helpdesk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Services & Bonafide Certificates
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Raise grievance service tickets for campus facilities, Wi-Fi, lab equipment, and apply for digitally verified Bonafide & LOR certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'helpdesk' && role === 'student' && (
            <button
              onClick={() => setShowHelpdeskModal(true)}
              className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Helpdesk Ticket</span>
            </button>
          )}

          {activeTab === 'certificates' && role === 'student' && (
            <button
              onClick={() => setShowCertModal(true)}
              className="px-4 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 shadow-md transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Apply for Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('helpdesk')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'helpdesk'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Campus Helpdesk & Grievances ({filteredTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'certificates'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Official Certificates & Documents ({filteredCerts.length})</span>
        </button>
      </div>

      {/* TAB 1: Helpdesk Service Requests */}
      {activeTab === 'helpdesk' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 font-semibold">Filter Status:</span>
              {['All', 'Submitted', 'Assigned', 'In Progress', 'Resolved'].map(st => (
                <button
                  key={st}
                  onClick={() => setHelpdeskFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    helpdeskFilter === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <span className="text-slate-500">
              Average Resolution Time: <strong>24 - 48 Hours</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{ticket.ticketId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                        {ticket.category}
                      </span>
                      {getPriorityBadge(ticket.priority)}
                    </div>
                    <h4 className="font-bold text-white text-sm mt-1">{ticket.subject}</h4>
                  </div>
                  {getStatusBadge(ticket.status)}
                </div>

                <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  {ticket.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <div className="flex items-center justify-between">
                    <span>Submitted by: <strong>{ticket.studentName}</strong> (Roll #{ticket.rollNumber})</span>
                    <span>{ticket.createdAt}</span>
                  </div>
                  {ticket.location && (
                    <div className="text-slate-400">
                      Location: <span className="text-amber-400">{ticket.location}</span>
                    </div>
                  )}
                  {ticket.assignedTo && (
                    <div className="text-slate-300">
                      Assigned Engineer/Staff: <span className="text-emerald-400 font-semibold">{ticket.assignedTo}</span>
                    </div>
                  )}
                  {ticket.resolutionNote && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] mt-2">
                      <strong>Resolution Note:</strong> {ticket.resolutionNote} ({ticket.resolvedAt})
                    </div>
                  )}
                </div>

                {isStaffOrAdmin && (
                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setUpdatingTicket(ticket);
                        setTicketStatus(ticket.status);
                        setTicketResolution(ticket.resolutionNote || '');
                        setTicketAssignee(ticket.assignedTo || '');
                      }}
                      className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                    >
                      Update Status / Assign
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Bonafide Certificates */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400 font-semibold">Filter Status:</span>
              {['All', 'Requested', 'Approved', 'Ready for Download'].map(st => (
                <button
                  key={st}
                  onClick={() => setCertFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    certFilter === st
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
            <span className="text-slate-400 text-xs">
              Directly signed by Academic Registrar & College Director
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/80 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Certificate ID</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Certificate Type & Purpose</th>
                    <th className="py-3 px-4">Date Requested</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-xs">
                        {cert.certNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{cert.studentName}</div>
                        <div className="text-xs text-slate-400">Roll #{cert.rollNumber} • {cert.courseCode}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-amber-400 text-xs">{cert.certificateType}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{cert.purpose}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {cert.requestedDate}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(cert.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isStaffOrAdmin && cert.status === 'Requested' && (
                            <button
                              onClick={() => updateCertificateStatus(cert.id, 'Approved')}
                              className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs hover:bg-emerald-400 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          {(cert.status === 'Approved' || cert.status === 'Ready for Download') && (
                            <button
                              onClick={() => setPreviewCert(cert)}
                              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View / Print</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Helpdesk Ticket */}
      {showHelpdeskModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Raise Campus Helpdesk Ticket</h3>
              </div>
              <button
                onClick={() => setShowHelpdeskModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHelpdeskSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Issue Category *</label>
                  <select
                    value={hdCategory}
                    onChange={(e) => setHdCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lab/Equipment">Lab Computer / Projector</option>
                    <option value="WiFi/IT">Wi-Fi & ERP Access</option>
                    <option value="Hostel/Mess">Hostel / Mess Maintenance</option>
                    <option value="Library">Library Resources</option>
                    <option value="Academic">Academic / Class Schedule</option>
                    <option value="Administrative">Administrative Office</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority Level *</label>
                  <select
                    value={hdPriority}
                    onChange={(e) => setHdPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Low">Low - Normal Request</option>
                    <option value="Medium">Medium - Standard Issue</option>
                    <option value="High">High - Impeding Studies</option>
                    <option value="Urgent">Urgent - Exam/Class Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Specific Location / Room</label>
                <input
                  type="text"
                  placeholder="e.g. Block B, Computer Lab 204, System #18"
                  value={hdLocation}
                  onChange={(e) => setHdLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Summary / Subject *</label>
                <input
                  type="text"
                  placeholder="Brief description of the problem..."
                  value={hdSubject}
                  onChange={(e) => setHdSubject(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Detailed Explanation *</label>
                <textarea
                  rows={3}
                  placeholder="Please provide details to help technicians resolve this quickly..."
                  value={hdDescription}
                  onChange={(e) => setHdDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHelpdeskModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 shadow-md text-xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Certificate Request */}
      {showCertModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Apply for College Certificate</h3>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCertSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Certificate Type *</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Bonafide Certificate">Bonafide Certificate (General Study Proof)</option>
                  <option value="Course Completion">Course Completion Certificate</option>
                  <option value="Custodian Certificate">Custodian Certificate (Original Docs)</option>
                  <option value="No Objection Certificate (NOC)">No Objection Certificate (NOC for Internship)</option>
                  <option value="Letter of Recommendation (LOR)">Letter of Recommendation (Higher Studies)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Purpose / Submission To *</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Required for Passport Application / State Scholarship Portal / TCS Internship"
                  value={certPurpose}
                  onChange={(e) => setCertPurpose(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 shadow-md text-xs"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Official Stamped Certificate Viewer */}
      {previewCert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-950 rounded-2xl max-w-xl w-full p-8 shadow-2xl space-y-6">
            <div className="text-center border-b-2 border-slate-900 pb-4">
              <div className="text-xs font-bold tracking-widest text-slate-600 uppercase">
                {adminProfile.collegeName}
              </div>
              <h2 className="text-xl font-extrabold text-slate-950 mt-1 uppercase">
                {previewCert.certificateType}
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Serial No: {previewCert.certNumber}
              </p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <p>
                This is to certify that <strong>{previewCert.studentName}</strong>, bearing Roll Number{' '}
                <strong>{previewCert.rollNumber}</strong> is a bonafide student of this institution, currently studying in{' '}
                <strong>{previewCert.courseCode} Engineering (Semester {previewCert.semOrYear})</strong> during the academic session 2025–2026.
              </p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Stated Purpose:</span>
                  <strong className="text-slate-900">{previewCert.purpose}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <strong className="text-emerald-700">{previewCert.issuedBy || 'Registrar & Director'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date of Issue:</span>
                  <strong>{previewCert.generatedDate || new Date().toISOString().split('T')[0]}</strong>
                </div>
              </div>

              <p className="text-slate-600 italic">
                To the best of our knowledge, his/her character and conduct during the tenure at our institution have been exemplary.
              </p>

              <div className="pt-6 flex items-center justify-between border-t border-slate-200">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center p-1 text-[9px] font-bold text-emerald-700 leading-tight">
                    OFFICIAL INSTITUTION SEAL
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Ref: {previewCert.certNumber}</div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-sm text-slate-950 font-serif">Dr. K. R. Sharma</div>
                  <div className="text-[10px] text-slate-600">Director of Admissions & Dean</div>
                  <div className="text-[9px] text-slate-400">Campus Authorization Seal</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setPreviewCert(null)}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl hover:bg-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-xs font-bold shadow-md flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Update Helpdesk Ticket (Staff) */}
      {updatingTicket && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">Update Helpdesk Ticket ({updatingTicket.ticketId})</h3>
              </div>
              <button
                onClick={() => setUpdatingTicket(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Status</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Assigned Staff / Engineer</label>
                <input
                  type="text"
                  placeholder="e.g. IT Admin Team / Lab Asst. Ramesh"
                  value={ticketAssignee}
                  onChange={(e) => setTicketAssignee(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Resolution Note</label>
                <textarea
                  rows={3}
                  placeholder="Explain what work was performed or why status was changed..."
                  value={ticketResolution}
                  onChange={(e) => setTicketResolution(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUpdatingTicket(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateServiceRequestStatus(updatingTicket.id, ticketStatus, ticketResolution, ticketAssignee);
                    setUpdatingTicket(null);
                  }}
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 shadow-md text-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
