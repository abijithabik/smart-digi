import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Users,
  User,
  Hash,
  Sparkles,
  Paperclip,
  Search,
  Shield,
  Briefcase,
  GraduationCap,
  CheckCheck,
  FileText,
  X,
  Phone,
  Video,
  Info
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { chatMessages, sendChatMessage, currentUser, faculties, students, adminProfile } = useApp();
  const [activeChannel, setActiveChannel] = useState<string>('GROUP_ALL');
  const [activeChannelName, setActiveChannelName] = useState<string>('Campus General Channel');
  const [activeRecipientRole, setActiveRecipientRole] = useState<string>('all');
  const [textInput, setTextInput] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Director' | 'Faculty' | 'Student' | 'Groups'>('All');
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Channels definition
  const channels = [
    { id: 'GROUP_ALL', name: 'Campus General Channel', type: 'group', desc: 'All Students & Staff' },
    { id: 'GROUP_IT_1', name: 'IT Engineering - Sem 1', type: 'group', desc: 'Department of Information Technology' },
    { id: 'GROUP_CE_1', name: 'CE Engineering - Sem 1', type: 'group', desc: 'Department of Computer Engineering' },
    { id: 'GROUP_FACULTY', name: 'Faculty Staff Room', type: 'group', desc: 'Staff & HOD Discussions' },
  ];

  // Direct contact list: Director, Faculty, Students
  const directContacts = [
    {
      id: 'admin',
      name: 'Dr. K. R. Sharma (Director)',
      sub: 'College Director & Dean',
      role: 'Director',
      pic: '/Admin.png',
      online: true
    },
    ...faculties.map(f => ({
      id: f.facultyId.toString(),
      name: f.facultyName,
      sub: `Faculty (${f.courseCode}) - ${f.designation || 'Professor'}`,
      role: 'Faculty',
      pic: f.profilePic || '/Ajay Parmar.png',
      online: f.activeStatus ?? true
    })),
    ...students.map(s => ({
      id: s.userId,
      name: `${s.firstName} ${s.lastName}`,
      sub: `Roll #${s.rollNumber} (${s.courseCode} Sem ${s.semOrYear})`,
      role: 'Student',
      pic: s.profilePic || '/Abhi Gaundani.jpeg',
      online: s.activeStatus ?? false
    }))
  ].filter(c => c.id !== currentUser?.userId);

  const filteredContacts = directContacts.filter(contact => {
    if (roleFilter !== 'All' && roleFilter !== 'Groups' && contact.role !== roleFilter) {
      return false;
    }
    if (searchContact.trim()) {
      const q = searchContact.toLowerCase();
      return contact.name.toLowerCase().includes(q) || contact.sub.toLowerCase().includes(q);
    }
    return true;
  });

  // Filter messages for active channel/direct conversation
  const currentMessages = chatMessages.filter(m => {
    if (activeChannel.startsWith('GROUP_')) {
      return m.toUserId === activeChannel;
    } else {
      if (!currentUser) return false;
      return (
        (m.fromUserId === currentUser.userId && m.toUserId === activeChannel) ||
        (m.fromUserId === activeChannel && m.toUserId === currentUser.userId)
      );
    }
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!textInput.trim() && !attachedFile) || !currentUser) return;

    sendChatMessage({
      toUserId: activeChannel,
      message: textInput.trim() || (attachedFile ? `Attached: ${attachedFile.name}` : ''),
      isGroup: activeChannel.startsWith('GROUP_'),
      attachment: attachedFile ? { name: attachedFile.name, type: attachedFile.type } : undefined
    });

    setTextInput('');
    setAttachedFile(null);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const getRoleIcon = (roleName?: string) => {
    switch (roleName?.toLowerCase()) {
      case 'admin':
      case 'director':
        return <Shield className="w-3 h-3 text-amber-400" />;
      case 'faculty':
        return <Briefcase className="w-3 h-3 text-blue-400" />;
      default:
        return <GraduationCap className="w-3 h-3 text-emerald-400" />;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Channels & Contacts Sidebar */}
      <div className="w-full md:w-80 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        {/* Search & Header */}
        <div className="p-3.5 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Campus Connect Chat</span>
            </div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
              Live Hub
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty, director, or student..."
              value={searchContact}
              onChange={(e) => setSearchContact(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            {['All', 'Groups', 'Director', 'Faculty', 'Student'].map((rf) => (
              <button
                key={rf}
                onClick={() => setRoleFilter(rf as any)}
                className={`px-2 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  roleFilter === rf
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>
        </div>

        {/* Directory List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Groups */}
          {(roleFilter === 'All' || roleFilter === 'Groups') && !searchContact && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-amber-400" />
                <span>Department & General Channels</span>
              </div>
              <div className="space-y-1">
                {channels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setActiveChannel(ch.id);
                      setActiveChannelName(ch.name);
                      setActiveRecipientRole('Group');
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      activeChannel === ch.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <div className="truncate">
                      <div className="truncate font-semibold">{ch.name}</div>
                      <div className="text-[10px] opacity-70 truncate">{ch.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct 1-to-1 Messages */}
          {roleFilter !== 'Groups' && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 mb-1.5 flex items-center gap-1.5">
                <User className="w-3 h-3 text-blue-400" />
                <span>Direct 1-on-1 Contacts</span>
              </div>
              <div className="space-y-1">
                {filteredContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setActiveChannel(contact.id);
                      setActiveChannelName(contact.name);
                      setActiveRecipientRole(contact.role);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      activeChannel === contact.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={contact.pic}
                        alt={contact.name}
                        className="w-7 h-7 rounded-full object-cover bg-slate-800 border border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                      )}
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate font-semibold">{contact.name}</span>
                        {getRoleIcon(contact.role)}
                      </div>
                      <div className="text-[10px] opacity-70 truncate">{contact.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeChannel.startsWith('GROUP_') ? (
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Hash className="w-5 h-5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <User className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{activeChannelName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-semibold">
                  {activeChannel.startsWith('GROUP_') ? 'Broadcasting Room' : `Direct ${activeRecipientRole} Chat`}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                <span>Active encrypted campus session • Fast response guaranteed</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-xs hidden sm:inline text-slate-500">Logged in as {currentUser?.name}</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">No messages in this chat yet</p>
              <p className="text-xs max-w-sm mt-1">
                Say hello to start the conversation with {activeChannelName}. Direct student-faculty messaging is logged for academic transparency.
              </p>
            </div>
          ) : (
            currentMessages.map(msg => {
              const isMe = msg.fromUserId === currentUser?.userId;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isMe ? 'You' : msg.fromUserName}
                    </span>
                    {msg.fromRole && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 border border-slate-700">
                        {msg.fromRole}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{msg.messageTime}</span>
                  </div>

                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-md space-y-1 ${
                      isMe
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs'
                        : 'bg-slate-800 text-slate-100 border border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>

                    {msg.attachment && (
                      <div className="mt-2 p-2 bg-slate-950/20 rounded-lg flex items-center gap-2 border border-slate-900/30">
                        <FileText className="w-4 h-4" />
                        <span className="font-bold text-xs truncate">{msg.attachment.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachment preview banner */}
        {attachedFile && (
          <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-amber-400">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Attached: <strong>{attachedFile.name}</strong></span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          {/* File attach button */}
          <label className="p-2 text-slate-400 hover:text-amber-400 cursor-pointer rounded-xl hover:bg-slate-800 transition-colors">
            <Paperclip className="w-4 h-4" />
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAttachedFile({ name: file.name, type: file.type });
                }
              }}
            />
          </label>

          <input
            type="text"
            placeholder={`Message ${activeChannelName}...`}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!textInput.trim() && !attachedFile}
            className="p-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
