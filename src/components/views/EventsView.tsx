import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusEvent } from '../../types';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Users,
  Tag,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Award,
  Flame,
  Check,
  X,
  Share2
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const {
    currentUser,
    campusEvents,
    registerForEvent
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [activeModalEvent, setActiveModalEvent] = useState<CampusEvent | null>(null);
  const [showRegisteredOnly, setShowRegisteredOnly] = useState(false);

  const categories = ['All', 'Hackathon', 'Workshop', 'Competition', 'Seminar', 'Cultural', 'Sports'];

  const filteredEvents = campusEvents.filter(ev => {
    if (showRegisteredOnly && (!currentUser || !ev.registeredUsers.includes(currentUser.userId))) {
      return false;
    }
    if (selectedCategory !== 'All' && ev.category !== selectedCategory) {
      return false;
    }
    if (selectedMode !== 'All' && ev.mode !== selectedMode) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ev.title.toLowerCase().includes(q) ||
        ev.organizer.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ev.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const recommendedEvents = campusEvents.filter(e => e.isRecommended);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Campus Competitions, Hackathons & Tech Hub</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Events & Workshop Recommendations
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Explore curated hackathons, robotics challenges, coding summits, and industry workshops personalized for your course and skill track.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegisteredOnly(!showRegisteredOnly)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              showRegisteredOnly
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>My Registered ({campusEvents.filter(e => currentUser && e.registeredUsers.includes(currentUser.userId)).length})</span>
          </button>
        </div>
      </div>

      {/* AI / Smart Recommendations Section */}
      {!showRegisteredOnly && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Recommended for Your Track</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">
                Personalized
              </span>
            </div>
            <span className="text-xs text-slate-400">Matched with {currentUser?.courseCode || 'IT'} Curriculum</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendedEvents.slice(0, 2).map((event) => {
              const isRegistered = currentUser ? event.registeredUsers.includes(currentUser.userId) : false;
              return (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-amber-500/60 transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-0 group-hover:bg-amber-500/10 transition-colors"></div>

                  <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-400" />
                          {event.category}
                        </span>
                        {event.prizePool && (
                          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Prize: {event.prizePool}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span>{event.location} ({event.mode})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>{event.registeredUsers.length} Students Registered</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActiveModalEvent(event)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => registerForEvent(event.id)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                              isRegistered
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                            }`}
                          >
                            {isRegistered ? <Check className="w-3.5 h-3.5" /> : null}
                            <span>{isRegistered ? 'Enrolled' : 'Register Now'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hackathons, workshops, AI summits, or guest speakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mode Selector */}
        <select
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        >
          <option value="All">All Formats</option>
          <option value="Offline">Offline / Campus</option>
          <option value="Online">Online / Webinar</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((event) => {
          const isRegistered = currentUser ? event.registeredUsers.includes(currentUser.userId) : false;
          return (
            <div
              key={event.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-md flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    {event.category}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    {event.mode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {event.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {event.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 space-y-3 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate max-w-[120px]">{event.location}</span>
                  </div>
                </div>

                {event.prizePool && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Reward / Prize:</span>
                    <span className="font-bold text-emerald-400">{event.prizePool}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setActiveModalEvent(event)}
                    className="text-xs text-slate-300 hover:text-amber-400 font-semibold flex items-center gap-1"
                  >
                    <span>View Info</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => registerForEvent(event.id)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                      isRegistered
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                    }`}
                  >
                    {isRegistered ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Full Event Details */}
      {activeModalEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">{activeModalEvent.title}</h3>
              </div>
              <button
                onClick={() => setActiveModalEvent(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed text-sm">
                {activeModalEvent.description}
              </p>

              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-bold text-amber-400">{activeModalEvent.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Organized By:</span>
                  <span className="font-semibold text-white">{activeModalEvent.organizer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="font-semibold text-white">{activeModalEvent.date} ({activeModalEvent.time})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Venue / Platform:</span>
                  <span className="font-semibold text-white">{activeModalEvent.location} [{activeModalEvent.mode}]</span>
                </div>
                {activeModalEvent.prizePool && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prizes / Perks:</span>
                    <span className="font-bold text-emerald-400">{activeModalEvent.prizePool}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Eligibility:</span>
                  <span className="font-medium text-slate-200">{activeModalEvent.eligibility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Deadline:</span>
                  <span className="font-bold text-rose-400">{activeModalEvent.registrationDeadline}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeModalEvent.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {activeModalEvent.registeredUsers.length} students have signed up
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    registerForEvent(activeModalEvent.id);
                    setActiveModalEvent(null);
                  }}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
                    currentUser && activeModalEvent.registeredUsers.includes(currentUser.userId)
                      ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md'
                  }`}
                >
                  {currentUser && activeModalEvent.registeredUsers.includes(currentUser.userId)
                    ? 'Cancel Registration'
                    : 'Confirm Registration'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
