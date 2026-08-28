import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusSlot } from '../../types';
import {
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Users,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Laptop
} from 'lucide-react';

export const FreeSlotsView: React.FC = () => {
  const {
    currentUser,
    campusSlots,
    toggleSlotAvailability
  } = useApp();

  const [selectedBlock, setSelectedBlock] = useState<string>('All');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [searchQuery, setSearchQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [slotTypeFilter, setSlotTypeFilter] = useState<string>('All');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const blocks = ['All', 'Block A', 'Block B', 'Block C', 'Central Library', 'Auditorium Complex'];

  const filteredSlots = campusSlots.filter(slot => {
    if (selectedDay !== 'All' && slot.dayOfWeek !== selectedDay) return false;
    if (selectedBlock !== 'All' && slot.block !== selectedBlock) return false;
    if (freeOnly && !slot.isFree) return false;
    if (slotTypeFilter !== 'All' && slot.type !== slotTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        slot.roomNumber.toLowerCase().includes(q) ||
        slot.block.toLowerCase().includes(q) ||
        slot.department.toLowerCase().includes(q) ||
        (slot.facultyName && slot.facultyName.toLowerCase().includes(q)) ||
        (slot.occupiedBy && slot.occupiedBy.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalSlotsCount = filteredSlots.length;
  const freeSlotsCount = filteredSlots.filter(s => s.isFree).length;
  const occupiedCount = totalSlotsCount - freeSlotsCount;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Campus Infrastructure & Facility Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Department & Block Free-Slot Discovery
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Real-time availability of classrooms, computer labs, seminar halls, and project spaces across all campus blocks. Find empty rooms instantly for study groups or club meetings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              freeOnly
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Show Only Free Spaces ({campusSlots.filter(s => s.isFree).length})</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-400">Total Timetable Slots</p>
          <p className="text-2xl font-bold text-white mt-1">{totalSlotsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Filtered across campus</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-400">Available / Free</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{freeSlotsCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Ready for occupancy</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-rose-400">Classes in Session</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{occupiedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Scheduled lectures/labs</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-400">Active Campus Blocks</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">4 Academic Wings</p>
          <p className="text-[11px] text-slate-500 mt-1">Block A, B, C & Central</p>
        </div>
      </div>

      {/* Day of Week Selector */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {days.map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room (e.g. Lab 201, Room 304), faculty name, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Block Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Block / Wing:</span>
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            {blocks.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Space Type Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">Space Type:</span>
          <select
            value={slotTypeFilter}
            onChange={(e) => setSlotTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Types</option>
            <option value="Classroom">Classrooms</option>
            <option value="Lab">Computer & Hardware Labs</option>
            <option value="Auditorium">Auditorium / Halls</option>
          </select>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSlots.map(slot => (
          <div
            key={slot.id}
            className={`border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden ${
              slot.isFree
                ? 'bg-slate-900 border-emerald-500/40 hover:border-emerald-500'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-90'
            }`}
          >
            {/* Status indicator bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-1.5 ${
                slot.isFree ? 'bg-emerald-500' : 'bg-rose-500/80'
              }`}
            />

            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-white text-lg tracking-tight">
                    {slot.roomNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                    {slot.type}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{slot.block} ({slot.department})</span>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  slot.isFree
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {slot.isFree ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {slot.isFree ? 'VACANT' : 'OCCUPIED'}
              </span>
            </div>

            <div className="space-y-2 text-xs py-2 border-y border-slate-800/80">
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Time Window:</span>
                </div>
                <span className="font-semibold text-white">{slot.timeSlot}</span>
              </div>

              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Capacity:</span>
                </div>
                <span className="font-semibold text-white">{slot.capacity} Seats</span>
              </div>

              {!slot.isFree && (
                <div className="p-2.5 bg-slate-800/70 rounded-xl border border-slate-700/60 mt-2 space-y-1">
                  <div className="text-[11px] font-bold text-rose-300">Ongoing Session:</div>
                  <div className="text-white font-medium text-xs">{slot.occupiedBy || 'Scheduled Lecture'}</div>
                  {slot.facultyName && (
                    <div className="text-[11px] text-slate-400">Instructor: {slot.facultyName}</div>
                  )}
                </div>
              )}

              {slot.isFree && (
                <div className="p-2.5 bg-emerald-950/20 rounded-xl border border-emerald-500/20 mt-2">
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Free for Project / Self Study</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    No active lecture scheduled. Students and faculty may utilize this room.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">Day: {slot.dayOfWeek}</span>
              {currentUser?.role === 'admin' || currentUser?.role === 'faculty' ? (
                <button
                  onClick={() => toggleSlotAvailability(slot.id)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
                >
                  Toggle State
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
