import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Bell, Search, X, ChevronRight, Globe } from 'lucide-react';
import { schemesAPI } from '../../services/api';

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'hi', label: 'हि', full: 'हिंदी' },
  { code: 'mr', label: 'म', full: 'मराठी' },
];

export default function TopBar({ title, showBack = false }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const res = await schemesAPI.search(val, { limit: 6 });
      setResults(res.data.data.schemes || []);
    } catch { setResults([]); }
    finally { setSearching(false); }
  };

  const CAT_LABELS = {
    farmer: 'Farmers', healthcare: 'Healthcare', education: 'Education',
    banking: 'Banking', employment: 'Employment', women_child: 'Women & Child',
    senior_citizen: 'Senior Citizen', housing: 'Housing', other: 'Other',
  };

  return (
    <>
      {/* Tricolor stripe */}
      <div className="tricolor-stripe" />

      <header className="bg-gov-blue sticky top-1 z-40 shadow-header">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Left */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                aria-label="Go back"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors shrink-0">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-base font-bold text-white">
                  🏛
                </div>
              </button>
            )}
            <div className="min-w-0">
              <p className="text-white font-semibold text-[15px] leading-tight truncate">
                {title || 'YojanaPath'}
              </p>
              {!title && (
                <p className="text-white/60 text-[11px] leading-none font-medium">
                  सरकारी योजना खोजें
                </p>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Language toggle */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(p => !p)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/80">
                <Globe size={15} />
                <span className="text-[12px] font-semibold">{activeLang.toUpperCase()}</span>
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gov-border rounded-xl shadow-card-hover z-50 min-w-[130px] py-1 overflow-hidden">
                    {LANGS.map(({ code, label, full }) => (
                      <button
                        key={code}
                        onClick={() => { setActiveLang(code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gov-bg transition-colors
                          ${activeLang === code ? 'text-gov-blue font-semibold bg-gov-blue-light' : 'text-gov-text-2'}`}>
                        <span className="text-base w-5 text-center">{label}</span>
                        <span>{full}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search schemes"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
              <Search size={18} />
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gov-saffron rounded-full ring-1 ring-gov-blue" />
            </button>

            {/* Avatar */}
            <button
              onClick={() => navigate('/profile')}
              aria-label="Profile"
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm ml-1">
              {user?.name?.[0]?.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(26,31,54,0.6)' }}
          onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}>
          <div
            className="bg-white w-full shadow-card-hover"
            onClick={e => e.stopPropagation()}>
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
              <Search size={18} className="text-gov-muted shrink-0" />
              <input
                autoFocus
                placeholder="Search for schemes, categories..."
                value={query}
                onChange={e => handleSearch(e.target.value)}
                className="flex-1 text-base text-gov-text outline-none placeholder-gov-muted bg-transparent"
              />
              <button onClick={() => { setSearchOpen(false); setQuery(''); setResults([]); }}
                className="text-gov-muted hover:text-gov-text transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Results */}
            {(searching || results.length > 0 || (query.length >= 2 && !searching)) && (
              <div className="border-t border-gov-border max-w-2xl mx-auto">
                {searching ? (
                  <div className="px-4 py-4 text-gov-muted text-sm">Searching…</div>
                ) : results.length > 0 ? (
                  <ul>
                    {results.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => { navigate(`/schemes/${s.id}`); setSearchOpen(false); setQuery(''); setResults([]); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gov-bg transition-colors text-left border-b border-gov-border last:border-0">
                          <div className="w-8 h-8 rounded-lg bg-gov-blue-light flex items-center justify-center shrink-0">
                            <Search size={14} className="text-gov-blue" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gov-text text-sm font-medium line-clamp-1">{s.name}</p>
                            <p className="text-gov-muted text-xs">{CAT_LABELS[s.category] || s.category}</p>
                          </div>
                          <ChevronRight size={15} className="text-gov-muted shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-4 text-gov-muted text-sm">No results for "{query}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
