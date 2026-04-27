import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn, Info } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const fillDemo = (type) => {
    if (type === 'user') setForm({ email: 'ramesh.farmer@test.com', password: 'Test@1234' });
    else setForm({ email: 'admin@govtschemes.in', password: 'Admin@123456' });
    toast('Credentials filled — click Sign In', { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F6FB' }}>
      <div className="tricolor-stripe" />

      {/* Blue header */}
      <div style={{ background: '#1A4FA0' }} className="py-8 px-4 text-center">
        <div className="max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            🏛
          </div>
          <h1 className="text-white font-bold text-2xl">YojanaPath</h1>
          <p className="text-white text-sm mt-1" style={{ opacity: 0.75 }}>
            Government Scheme Finder · सरकारी योजना खोजें
          </p>
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 mt-3">
            {['🇮🇳 Made in India', '🔒 Secure', '✅ Free'].map((t) => (
              <span key={t} className="text-white text-xs" style={{ opacity: 0.6 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-10">
        <div className="w-full max-w-sm">
          <div className="card p-6">
            <h2 className="font-bold text-xl mb-1" style={{ color: '#1A1F36' }}>Sign In to Your Account</h2>
            <p className="text-sm mb-6" style={{ color: '#6B7A99' }}>
              Enter your registered email and password
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="field-label" htmlFor="email">Email Address</label>
                <input id="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-field" autoComplete="email" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="field-label" style={{ marginBottom: 0 }} htmlFor="password">Password</label>
                  <button type="button" className="text-xs font-medium hover:underline" style={{ color: '#1A4FA0' }}>
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input id="password" type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="input-field pr-11" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: '#6B7A99' }}>
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading
                  ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full animate-spin"
                        style={{ border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff' }} />
                      Signing in…
                    </span>
                  : <><LogIn size={18} /> Sign In</>}
              </button>
            </form>

            <hr className="divider my-5" />

            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Info size={14} style={{ color: '#1A4FA0' }} />
                <p className="text-xs font-semibold" style={{ color: '#3D4966' }}>Try Demo Accounts</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: '👨‍🌾 Demo User', sub: 'Farmer, Maharashtra', type: 'user' },
                  { label: '👑 Admin User', sub: 'Full admin access', type: 'admin' },
                ].map(({ label, sub, type }) => (
                  <button key={type} onClick={() => fillDemo(type)}
                    className="text-left p-3 rounded-lg border transition-colors"
                    style={{ borderColor: '#D0D7E8' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1A4FA0'; e.currentTarget.style.background = '#E8EFFC'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#D0D7E8'; e.currentTarget.style.background = ''; }}>
                    <p className="font-semibold text-sm" style={{ color: '#1A4FA0' }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>{sub}</p>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm mt-5" style={{ color: '#6B7A99' }}>
              New user?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: '#1A4FA0' }}>
                Create Account →
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-4 px-4 leading-relaxed" style={{ color: '#9AA5BC' }}>
            This portal is for informational purposes only. Your data is secure and not shared with third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
