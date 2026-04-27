import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ChevronLeft, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import InfoBox from '../components/ui/InfoBox';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Chandigarh','Puducherry'];
const OCCUPATIONS = [
  { v: 'farmer',       l: 'Farmer / Kisaan' },
  { v: 'student',      l: 'Student' },
  { v: 'salaried',     l: 'Salaried Employee' },
  { v: 'self-employed',l: 'Self-Employed' },
  { v: 'business',     l: 'Business Owner' },
  { v: 'unemployed',   l: 'Unemployed' },
  { v: 'retired',      l: 'Retired' },
  { v: 'homemaker',    l: 'Homemaker' },
  { v: 'other',        l: 'Other' },
];
const CATEGORIES = [
  { v: 'General', desc: 'No reservation category',     hint: 'Open category, no caste-based benefit' },
  { v: 'OBC',     desc: 'Other Backward Class',        hint: 'Eligible for OBC reservation schemes' },
  { v: 'SC',      desc: 'Scheduled Caste',             hint: 'Eligible for SC-specific schemes' },
  { v: 'ST',      desc: 'Scheduled Tribe',             hint: 'Eligible for tribal welfare schemes' },
];
const EDUCATION = [
  { v: 'illiterate',      l: 'Illiterate' },
  { v: 'primary',         l: 'Primary (up to Class 5)' },
  { v: 'secondary',       l: 'Secondary (Class 10)' },
  { v: 'higher_secondary',l: 'Higher Secondary (Class 12)' },
  { v: 'graduate',        l: 'Graduate (B.A./B.Sc./B.Com etc.)' },
  { v: 'post_graduate',   l: 'Post Graduate (M.A./M.Sc. etc.)' },
  { v: 'doctorate',       l: 'Doctorate (Ph.D.)' },
];
const LANGS = [
  { code: 'en', label: 'English',   script: 'English' },
  { code: 'hi', label: 'हिंदी',    script: 'Hindi' },
  { code: 'mr', label: 'मराठी',    script: 'Marathi' },
  { code: 'ta', label: 'தமிழ்',    script: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ',    script: 'Kannada' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ',  script: 'Punjabi' },
];

const STEPS = [
  { title: 'Account Details',  desc: 'Create your login credentials' },
  { title: 'Personal Profile', desc: 'Helps us match the right schemes for you' },
  { title: 'Language & Review',desc: 'Choose your preferred language' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', gender: 'male',
    annualIncome: '', occupation: 'farmer', state: 'Maharashtra',
    category: 'General', educationLevel: 'secondary', preferredLanguage: 'en',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const validate = () => {
    if (step === 0) {
      if (!form.name.trim()) { toast.error('Please enter your full name'); return false; }
      if (!form.email.trim()) { toast.error('Please enter your email address'); return false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { toast.error('Please enter a valid email address'); return false; }
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return false; }
      if (!form.age || Number(form.age) < 1 || Number(form.age) > 120) { toast.error('Please enter a valid age (1–120)'); return false; }
    }
    if (step === 1) {
      if (!form.annualIncome || Number(form.annualIncome) < 0) { toast.error('Please enter your annual income'); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register({ ...form, age: Number(form.age), annualIncome: Number(form.annualIncome) });
      toast.success('Account created successfully! Welcome to YojanaPath.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
      setStep(0);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F6FB' }}>
      <div className="tricolor-stripe" />

      {/* Blue header with progress */}
      <div style={{ background: '#1A4FA0' }} className="px-4 pt-4 pb-5">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center gap-3 mb-4">
            {step > 0 ? (
              <button onClick={() => setStep(s => s - 1)} aria-label="Go back"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <ChevronLeft size={20} />
              </button>
            ) : (
              <Link to="/login"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <ChevronLeft size={20} />
              </Link>
            )}
            <div className="flex-1">
              <p className="text-white font-bold text-base leading-tight">{STEPS[step].title}</p>
              <p className="text-white text-xs mt-0.5" style={{ opacity: 0.7 }}>{STEPS[step].desc}</p>
            </div>
            <span className="text-white text-xs font-medium" style={{ opacity: 0.7 }}>
              Step {step + 1} of {STEPS.length}
            </span>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${i < step ? 'bg-green-400 text-white' : i === step ? 'bg-white text-gov-blue' : 'bg-white/20 text-white/50'}`}>
                    {i < step ? <CheckCircle size={14} /> : i + 1}
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 rounded-full"
                    style={{ background: i < step ? '#4ade80' : 'rgba(255,255,255,0.2)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="flex-1 px-4 py-5 pb-10">
        <div className="max-w-sm mx-auto">
          <div className="card p-5">

            {/* ── Step 0: Account ── */}
            {step === 0 && (
              <div className="space-y-4">
                <InfoBox variant="info">
                  Your information is used only to match you with eligible government schemes.
                  We do not share your data with anyone.
                </InfoBox>

                <div>
                  <label className="field-label" htmlFor="name">Full Name <span className="text-red-500">*</span></label>
                  <input id="name" type="text" placeholder="e.g. Ramesh Kumar"
                    value={form.name} onChange={e => set('name', e.target.value)}
                    className="input-field" autoComplete="name" />
                  <p className="field-hint">Enter your name as per official documents</p>
                </div>

                <div>
                  <label className="field-label" htmlFor="reg-email">Email Address <span className="text-red-500">*</span></label>
                  <input id="reg-email" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)}
                    className="input-field" autoComplete="email" />
                </div>

                <div>
                  <label className="field-label" htmlFor="reg-password">Password <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input id="reg-password" type={showPass ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={form.password} onChange={e => set('password', e.target.value)}
                      className="input-field pr-11" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6B7A99' }}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="field-hint">Use at least 8 characters, including a number</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="field-label" htmlFor="age">Age <span className="text-red-500">*</span></label>
                    <input id="age" type="number" placeholder="e.g. 35" min="1" max="120"
                      value={form.age} onChange={e => set('age', e.target.value)}
                      className="input-field" />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="gender">Gender</label>
                    <select id="gender" value={form.gender} onChange={e => set('gender', e.target.value)}
                      className="input-field">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Profile ── */}
            {step === 1 && (
              <div className="space-y-5">
                <InfoBox variant="info">
                  This information helps us show you schemes you are actually eligible for. Fill in accurate details for best results.
                </InfoBox>

                <div>
                  <label className="field-label" htmlFor="income">
                    Annual Income (₹) <span className="text-red-500">*</span>
                  </label>
                  <input id="income" type="number" placeholder="e.g. 150000 (1.5 Lakh per year)"
                    value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)}
                    className="input-field" min="0" />
                  <p className="field-hint">Enter your total yearly household income in rupees</p>
                </div>

                <div>
                  <label className="field-label">Occupation <span className="text-red-500">*</span></label>
                  <div className="space-y-2">
                    {OCCUPATIONS.map(({ v, l }) => (
                      <label key={v}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                        style={{
                          borderColor: form.occupation === v ? '#1A4FA0' : '#D0D7E8',
                          background: form.occupation === v ? '#E8EFFC' : '#fff',
                        }}>
                        <input type="radio" name="occupation" value={v}
                          checked={form.occupation === v} onChange={() => set('occupation', v)}
                          className="accent-gov-blue w-4 h-4" />
                        <span className="text-sm font-medium" style={{ color: form.occupation === v ? '#1A4FA0' : '#1A1F36' }}>
                          {l}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="state">State / Union Territory <span className="text-red-500">*</span></label>
                  <select id="state" value={form.state} onChange={e => set('state', e.target.value)} className="input-field">
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="field-label">
                    Social Category <span className="text-red-500">*</span>
                    <span className="ml-1 text-xs font-normal" style={{ color: '#6B7A99' }}>(as per government records)</span>
                  </label>
                  <div className="space-y-2">
                    {CATEGORIES.map(({ v, desc, hint }) => (
                      <label key={v}
                        className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                        style={{
                          borderColor: form.category === v ? '#1A4FA0' : '#D0D7E8',
                          background: form.category === v ? '#E8EFFC' : '#fff',
                        }}>
                        <input type="radio" name="category" value={v}
                          checked={form.category === v} onChange={() => set('category', v)}
                          className="accent-gov-blue w-4 h-4 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold" style={{ color: form.category === v ? '#1A4FA0' : '#1A1F36' }}>{v} — {desc}</p>
                          <p className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>{hint}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="field-label" htmlFor="edu">Education Level</label>
                  <select id="edu" value={form.educationLevel} onChange={e => set('educationLevel', e.target.value)} className="input-field">
                    {EDUCATION.map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ── Step 2: Language & Review ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="field-label">Preferred Language for Scheme Information</label>
                  <p className="field-hint mb-3">Scheme details will be shown in your selected language</p>
                  <div className="grid grid-cols-2 gap-2">
                    {LANGS.map(({ code, label, script }) => (
                      <label key={code}
                        className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                        style={{
                          borderColor: form.preferredLanguage === code ? '#1A4FA0' : '#D0D7E8',
                          background: form.preferredLanguage === code ? '#E8EFFC' : '#fff',
                        }}>
                        <input type="radio" name="lang" value={code}
                          checked={form.preferredLanguage === code} onChange={() => set('preferredLanguage', code)}
                          className="accent-gov-blue w-4 h-4" />
                        <div>
                          <p className="text-sm font-bold" style={{ color: form.preferredLanguage === code ? '#1A4FA0' : '#1A1F36' }}>
                            {label}
                          </p>
                          <p className="text-xs" style={{ color: '#6B7A99' }}>{script}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Summary review */}
                <div>
                  <p className="field-label mb-3">Review Your Details</p>
                  <div className="rounded-lg border overflow-hidden" style={{ borderColor: '#D0D7E8' }}>
                    {[
                      ['Full Name',    form.name],
                      ['Email',        form.email],
                      ['Age',          `${form.age} years`],
                      ['Gender',       form.gender],
                      ['State',        form.state],
                      ['Category',     form.category],
                      ['Occupation',   OCCUPATIONS.find(o => o.v === form.occupation)?.l || form.occupation],
                      ['Annual Income',`₹${Number(form.annualIncome).toLocaleString('en-IN')}`],
                      ['Education',    EDUCATION.find(e => e.v === form.educationLevel)?.l || form.educationLevel],
                      ['Language',     LANGS.find(l => l.code === form.preferredLanguage)?.label],
                    ].map(([k, v], i) => (
                      <div key={k}
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderBottom: i < 9 ? '1px solid #E8ECF4' : 'none', background: i % 2 === 0 ? '#FAFBFE' : '#fff' }}>
                        <span className="text-xs font-medium" style={{ color: '#6B7A99' }}>{k}</span>
                        <span className="text-sm font-semibold capitalize" style={{ color: '#1A1F36' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <p className="field-hint mt-2">
                    You can edit these details anytime from your Profile page.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Action buttons */}
          <div className="mt-4 space-y-3">
            {step < 2 ? (
              <button onClick={handleNext} className="btn-primary w-full">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary w-full">
                {loading
                  ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full animate-spin"
                        style={{ border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff' }} />
                      Creating Account…
                    </span>
                  : <><CheckCircle size={18} /> Create My Account</>}
              </button>
            )}
            {step === 0 && (
              <p className="text-center text-sm" style={{ color: '#6B7A99' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-semibold hover:underline" style={{ color: '#1A4FA0' }}>Sign In</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
