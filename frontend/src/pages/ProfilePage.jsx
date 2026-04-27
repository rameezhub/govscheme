import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import InfoBox from '../components/ui/InfoBox';
import toast from 'react-hot-toast';
import { Save, LogOut, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Chandigarh','Puducherry'];
const OCCUPATIONS = [
  { v: 'farmer',       l: 'Farmer' }, { v: 'student',       l: 'Student' },
  { v: 'salaried',     l: 'Salaried' }, { v: 'self-employed', l: 'Self-Employed' },
  { v: 'business',     l: 'Business Owner' }, { v: 'unemployed',    l: 'Unemployed' },
  { v: 'retired',      l: 'Retired' }, { v: 'homemaker',     l: 'Homemaker' },
  { v: 'other',        l: 'Other' },
];
const CATEGORIES = ['General', 'OBC', 'SC', 'ST'];
const EDUCATION = [
  { v: 'illiterate',       l: 'Illiterate' }, { v: 'primary',          l: 'Primary (Class 5)' },
  { v: 'secondary',        l: 'Secondary (Class 10)' }, { v: 'higher_secondary', l: 'Higher Secondary (Class 12)' },
  { v: 'graduate',         l: 'Graduate' }, { v: 'post_graduate',    l: 'Post Graduate' },
  { v: 'doctorate',        l: 'Doctorate' },
];
const LANGS = [
  { code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },  { code: 'ta', label: 'தமிழ்' },
  { code: 'kn', label: 'ಕನ್ನಡ' },  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
];

const FieldGroup = ({ title, children }) => (
  <div className="card p-4">
    <h3 className="font-bold text-sm mb-4 pb-3" style={{ color: '#1A1F36', borderBottom: '1px solid #E8ECF4' }}>
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const buildForm = (u) => ({
    name:              u?.name || '',
    age:               u?.age || '',
    gender:            u?.gender || 'male',
    annualIncome:      u?.annualIncome || '',
    occupation:        u?.occupation || 'farmer',
    state:             u?.state || 'Maharashtra',
    category:          u?.category || 'General',
    educationLevel:    u?.educationLevel || 'secondary',
    preferredLanguage: u?.preferredLanguage || 'en',
  });

  const [form, setForm] = useState(() => buildForm(user));
  useEffect(() => { setForm(buildForm(user)); }, [user]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Name cannot be empty'); return; }
    if (!form.age || Number(form.age) < 1) { toast.error('Please enter a valid age'); return; }
    setLoading(true);
    try {
      const res = await userAPI.updateProfile({ ...form, age: Number(form.age), annualIncome: Number(form.annualIncome) });
      updateUser(res.data.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Layout title="My Profile">
      <div className="space-y-4 pb-4">

        {/* Profile header */}
        <div className="card p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl shrink-0"
            style={{ background: '#1A4FA0', color: '#fff' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base truncate" style={{ color: '#1A1F36' }}>{user?.name}</p>
            <p className="text-sm truncate" style={{ color: '#6B7A99' }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="badge badge-blue text-xs">
                {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
              </span>
              <span className="badge badge-gray text-xs">{user?.state}</span>
              <span className="badge badge-gray text-xs">{user?.category}</span>
            </div>
          </div>
        </div>

        <InfoBox variant="info">
          Keeping your profile accurate ensures you receive the most relevant scheme recommendations.
        </InfoBox>

        {/* Personal details */}
        <FieldGroup title="Personal Information">
          <div>
            <label className="field-label" htmlFor="p-name">Full Name</label>
            <input id="p-name" className="input-field" value={form.name}
              onChange={e => set('name', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor="p-age">Age (years)</label>
              <input id="p-age" type="number" className="input-field" value={form.age}
                onChange={e => set('age', e.target.value)} min="1" max="120" />
            </div>
            <div>
              <label className="field-label" htmlFor="p-gender">Gender</label>
              <select id="p-gender" className="input-field" value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </FieldGroup>

        {/* Income & occupation */}
        <FieldGroup title="Income & Occupation">
          <div>
            <label className="field-label" htmlFor="p-income">Annual Income (₹)</label>
            <input id="p-income" type="number" className="input-field" value={form.annualIncome}
              onChange={e => set('annualIncome', e.target.value)} placeholder="e.g. 150000" />
            <p className="field-hint">Total yearly household income in rupees</p>
          </div>
          <div>
            <label className="field-label" htmlFor="p-occ">Occupation</label>
            <select id="p-occ" className="input-field" value={form.occupation} onChange={e => set('occupation', e.target.value)}>
              {OCCUPATIONS.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </FieldGroup>

        {/* Location & category */}
        <FieldGroup title="Location & Category">
          <div>
            <label className="field-label" htmlFor="p-state">State / Union Territory</label>
            <select id="p-state" className="input-field" value={form.state} onChange={e => set('state', e.target.value)}>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="p-cat">Social Category</label>
            <select id="p-cat" className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="field-hint">As per your government-issued certificate</p>
          </div>
          <div>
            <label className="field-label" htmlFor="p-edu">Education Level</label>
            <select id="p-edu" className="input-field" value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)}>
              {EDUCATION.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </FieldGroup>

        {/* Language */}
        <FieldGroup title="Preferred Language">
          <div>
            <p className="field-hint mb-3">Scheme information will be shown in your selected language</p>
            <div className="grid grid-cols-3 gap-2">
              {LANGS.map(({ code, label }) => (
                <label key={code}
                  className="flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors"
                  style={{
                    borderColor: form.preferredLanguage === code ? '#1A4FA0' : '#D0D7E8',
                    background:  form.preferredLanguage === code ? '#E8EFFC' : '#fff',
                  }}>
                  <input type="radio" name="lang" value={code}
                    checked={form.preferredLanguage === code} onChange={() => set('preferredLanguage', code)}
                    className="accent-gov-blue" />
                  <span className="text-sm font-medium" style={{ color: form.preferredLanguage === code ? '#1A4FA0' : '#1A1F36' }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </FieldGroup>

        {/* Save */}
        <button onClick={handleSave} disabled={loading} className="btn-primary w-full py-4">
          {loading
            ? <span className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full animate-spin"
                  style={{ border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff' }} />
                Saving…
              </span>
            : <><Save size={18} /> Save Changes</>}
        </button>

        {/* Sign out */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-between p-4 rounded-xl border transition-colors"
          style={{ borderColor: '#FFCDD2', background: '#fff' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FEEBEB'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
          <div className="flex items-center gap-3">
            <LogOut size={18} style={{ color: '#C62828' }} />
            <span className="font-semibold text-sm" style={{ color: '#C62828' }}>Sign Out</span>
          </div>
          <ChevronRight size={16} style={{ color: '#FFAAAA' }} />
        </button>
      </div>
    </Layout>
  );
}
