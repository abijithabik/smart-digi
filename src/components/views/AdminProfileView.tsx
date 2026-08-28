import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, School, Mail, Phone, Globe, MapPin, Save, Check } from 'lucide-react';

export const AdminProfileView: React.FC = () => {
  const { adminProfile, updateAdminProfile } = useApp();

  const [collegeName, setCollegeName] = useState(adminProfile.collegeName);
  const [address, setAddress] = useState(adminProfile.address);
  const [emailId, setEmailId] = useState(adminProfile.emailId);
  const [contactNumber, setContactNumber] = useState(adminProfile.contactNumber);
  const [website, setWebsite] = useState(adminProfile.website);
  const [facebook, setFacebook] = useState(adminProfile.facebook);
  const [instagram, setInstagram] = useState(adminProfile.instagram);
  const [twitter, setTwitter] = useState(adminProfile.twitter);
  const [linkedin, setLinkedin] = useState(adminProfile.linkedin);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile({
      collegeName,
      address,
      emailId,
      contactNumber,
      website,
      facebook,
      instagram,
      twitter,
      linkedin
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <School className="w-6 h-6 text-amber-500" />
          <span>Institution & Administrative Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure university branding, campus location, official portals, and public contact directories.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 font-medium flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>College profile updated successfully across all mark sheets and portals!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <img
            src="/Admin.png"
            alt="Admin Logo"
            className="w-16 h-16 rounded-2xl border-2 border-amber-500/40 object-cover bg-slate-800"
          />
          <div>
            <h3 className="text-base font-bold text-white">Main University Institution</h3>
            <p className="text-xs text-slate-400">Master Account Profile • Government of Gujarat</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">College / University Name</label>
            <input
              type="text"
              value={collegeName}
              onChange={e => setCollegeName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Campus Full Address</label>
            <textarea
              rows={2}
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Official Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailId}
                  onChange={e => setEmailId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Administrative Contact</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Official Website</label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Facebook Handle</label>
              <input
                type="text"
                value={facebook}
                onChange={e => setFacebook(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Twitter / X Handle</label>
              <input
                type="text"
                value={twitter}
                onChange={e => setTwitter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="text"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
