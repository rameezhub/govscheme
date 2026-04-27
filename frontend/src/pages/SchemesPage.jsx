import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { schemesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import { SkeletonCard } from '../components/ui/Skeleton';
import { getCategoryMeta, CATEGORY_META } from '../components/icons/CategoryIcons';
import {
  Search, X, Filter, ChevronRight, BookOpen,
  ChevronDown, ChevronUp, MapPin, Users, SlidersHorizontal
} from 'lucide-react';

/* ─── Constants ──────────────────────────────────────────────────────────── */
const ALL_CATS = [
  { key: 'all', label: 'All' },
  ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k, label: v.label }))
];

const STATES = [
  'All States',
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi',
  'Jammu and Kashmir','Ladakh','Chandigarh','Puducherry',
];

const GENDERS = [
  { key: 'all',    label: 'All Genders', icon: '👥' },
  { key: 'male',   label: 'Male',        icon: '👨' },
  { key: 'female', label: 'Female',      icon: '👩' },
  { key: 'other',  label: 'Other',       icon: '🧑' },
];

/* ─── Small helpers ──────────────────────────────────────────────────────── */
function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      className="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
      style={{
        background: active ? '#1A4FA0' : '#fff',
        color:      active ? '#fff'    : '#3D4966',
        border:     `1.5px solid ${active ? '#1A4FA0' : '#D0D7E8'}`,
        whiteSpace: 'nowrap',
      }}>
      {children}
    </button>
  );
}

function ActiveBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ background: '#E8EFFC', color: '#1A4FA0', border: '1px solid #B8CCEE' }}>
      {label}
      <button onClick={onRemove} className="hover:opacity-60 transition-opacity">
        <X size={12} />
      </button>
    </span>
  );
}

/* ─── State section (collapsible) ────────────────────────────────────────── */
function StateSection({ icon, title, subtitle, schemes, accentColor }) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 mb-3 text-left hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
          style={{ background: accentColor + '22' }}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: '#1A1F36' }}>{title}</p>
          <p className="text-xs" style={{ color: '#6B7A99' }}>{subtitle}</p>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded-full"
          style={{ background: accentColor + '18', color: accentColor }}>
          {schemes.length}
        </span>
        {open ? <ChevronUp size={15} style={{ color: '#A0AFCA' }} /> : <ChevronDown size={15} style={{ color: '#A0AFCA' }} />}
      </button>
      {open && (
        <div className="space-y-2.5">
          {schemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      )}
    </div>
  );
}

/* ─── Single scheme card ─────────────────────────────────────────────────── */
function SchemeCard({ scheme }) {
  const { Icon, label: catLabel, bg, color } = getCategoryMeta(scheme.category);
  const allowedStates  = scheme.eligibility?.allowedStates  || ['All'];
  const allowedGenders = scheme.eligibility?.allowedGenders || ['All'];
  const isAllIndia  = allowedStates.includes('All');
  const isAllGender = allowedGenders.includes('All');

  return (
    <Link to={`/schemes/${scheme.id}`} className="card card-hover block p-4">
      <div className="flex items-start gap-3">
        <div className="cat-icon-box w-12 h-12 rounded-xl shrink-0" style={{ background: bg }}>
          <Icon size={22} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug" style={{ color: '#1A1F36' }}>
            {scheme.name}
          </h3>
          <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: '#6B7A99' }}>
            {scheme.description}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <span className="badge badge-gray text-xs">{catLabel}</span>

            {/* State badge */}
            <span className="badge text-xs" style={{
              background: isAllIndia ? '#E8F5E9' : '#FFF8E1',
              color:      isAllIndia ? '#2E7D32' : '#92400E',
              border:     `1px solid ${isAllIndia ? '#A5D6A7' : '#FFD54F'}`,
            }}>
              📍 {isAllIndia
                ? 'All India'
                : allowedStates.slice(0, 2).join(', ') + (allowedStates.length > 2 ? ` +${allowedStates.length - 2}` : '')}
            </span>

            {/* Gender badge */}
            <span className="badge text-xs" style={{
              background: isAllGender ? '#F3E5F5' : '#E3F2FD',
              color:      isAllGender ? '#6A1B9A' : '#0D47A1',
              border:     `1px solid ${isAllGender ? '#CE93D8' : '#90CAF9'}`,
            }}>
              {isAllGender
                ? '👥 All Genders'
                : allowedGenders.map(g =>
                    g === 'male' ? '👨 Male' : g === 'female' ? '👩 Female' : '🧑 Other'
                  ).join(', ')}
            </span>

            {scheme.eligibility?.maxIncome && (
              <span className="badge badge-blue text-xs">
                ≤ ₹{(scheme.eligibility.maxIncome / 100000).toFixed(1)}L
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={18} className="shrink-0 mt-1" style={{ color: '#A0AFCA' }} />
      </div>
    </Link>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function SchemesPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Server response
  const [schemes, setSchemes] = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [pages,   setPages]   = useState(1);
  const [loading, setLoading] = useState(true);

  // Summary stats from /api/schemes/states and /api/schemes/genders
  const [statsSummary,  setStatsSummary]  = useState(null);
  const [genderSummary, setGenderSummary] = useState(null);

  // Filters
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const [search,      setSearch]      = useState(searchParams.get('q') || '');
  const [state,       setState]       = useState('All States');
  const [gender,      setGender]      = useState('all');
  const [filterOpen,  setFilterOpen]  = useState(false);
  const category = searchParams.get('category') || 'all';
  const debounceRef = useRef(null);

  // Load state/gender summary once on mount
  useEffect(() => {
    Promise.all([schemesAPI.getStates(), schemesAPI.getGenders()])
      .then(([s, g]) => {
        setStatsSummary(s.data.data);
        setGenderSummary(g.data.data);
      })
      .catch(() => {});
  }, []);

  // Debounced search input
  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearchInput(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setSearch(v.trim().length >= 2 ? v.trim() : ''), 450
    );
  };
  const clearSearch = () => { setSearchInput(''); setSearch(''); clearTimeout(debounceRef.current); };
  useEffect(() => () => clearTimeout(debounceRef.current), []);
  useEffect(() => { setPage(1); }, [category, search, state, gender]);

  // Fetch from server — state and gender are now sent as query params
  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    try {
      let res;

      if (search.length >= 2) {
        // Text search with optional state + gender refinement
        const params = { page, limit: 20 };
        if (state  !== 'All States') params.state  = state;
        if (gender !== 'all')        params.gender = gender;
        if (category !== 'all')      params.category = category;
        res = await schemesAPI.search(search, params);
        setSchemes(res.data.data.schemes || []);
        setTotal(res.data.data.count || 0);
        setPages(1);
      } else {
        // Normal listing with server-side state + gender + category filter
        const params = { page, limit: 20 };
        if (category !== 'all')      params.category = category;
        if (state  !== 'All States') params.state    = state;
        if (gender !== 'all')        params.gender   = gender;
        res = await schemesAPI.getAll(params);
        setSchemes(res.data.data.schemes || []);
        setTotal(res.data.data.total  || 0);
        setPages(res.data.data.pages  || 1);
      }
    } catch { setSchemes([]); }
    finally { setLoading(false); }
  }, [page, category, search, state, gender]);

  useEffect(() => { fetchSchemes(); }, [fetchSchemes]);

  // Group by state when no state filter is active and no search
  const grouped = useMemo(() => {
    if (state !== 'All States' || search || category !== 'all' || gender !== 'all') return null;
    const allIndia   = schemes.filter(s => (s.eligibility?.allowedStates || ['All']).includes('All'));
    const byStateMap = {};
    schemes
      .filter(s => !(s.eligibility?.allowedStates || ['All']).includes('All'))
      .forEach(s => {
        (s.eligibility?.allowedStates || []).forEach(st => {
          if (!byStateMap[st]) byStateMap[st] = [];
          byStateMap[st].push(s);
        });
      });
    return { allIndia, byStateMap };
  }, [schemes, state, search, category, gender]);

  const activeFilters = [
    state !== 'All States' && state,
    gender !== 'all' && GENDERS.find(g => g.key === gender)?.label,
    category !== 'all' && CATEGORY_META[category]?.label,
    search && `"${search}"`,
  ].filter(Boolean);

  const clearAll = () => {
    clearSearch();
    setState('All States');
    setGender('all');
    setSearchParams({});
  };

  return (
    <Layout title="Schemes">
      <div className="space-y-4">

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#6B7A99' }} />
          <input type="search" placeholder="Search by name, benefit, keyword…"
            value={searchInput} onChange={handleSearchChange}
            className="input-field pl-10 pr-10 text-sm" />
          {searchInput && (
            <button onClick={clearSearch} className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ color: '#6B7A99' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Summary stats row */}
        {statsSummary && genderSummary && !loading && (
          <div className="grid grid-cols-3 gap-2">
            <div className="card p-3 text-center">
              <p className="font-bold text-base" style={{ color: '#1A4FA0' }}>
                {statsSummary.allIndiaSchemes}
              </p>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: '#6B7A99' }}>All India Schemes</p>
            </div>
            <div className="card p-3 text-center">
              <p className="font-bold text-base" style={{ color: '#2E7D32' }}>
                {statsSummary.stateSpecific?.length || 0}
              </p>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: '#6B7A99' }}>State-specific</p>
            </div>
            <div className="card p-3 text-center">
              <p className="font-bold text-base" style={{ color: '#880E4F' }}>
                {genderSummary.summary?.find(g => g.gender === 'female')?.schemeCount || 0}
              </p>
              <p className="text-xs mt-0.5 leading-tight" style={{ color: '#6B7A99' }}>Women Schemes</p>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: '#6B7A99' }}>Category</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {ALL_CATS.map(({ key, label }) => (
              <FilterPill key={key}
                active={category === key || (key === 'all' && !searchParams.get('category'))}
                onClick={() => setSearchParams(key === 'all' ? {} : { category: key })}>
                {label}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Advanced filter panel */}
        <div>
          <button onClick={() => setFilterOpen(p => !p)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border font-semibold text-sm transition-colors"
            style={{
              background:  filterOpen ? '#E8EFFC' : '#fff',
              borderColor: filterOpen ? '#1A4FA0' : '#D0D7E8',
              color:       filterOpen ? '#1A4FA0' : '#3D4966',
            }}>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              <span>Filter by State &amp; Gender</span>
              {(state !== 'All States' || gender !== 'all') && (
                <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                  style={{ background: '#1A4FA0', color: '#fff' }}>
                  {[state !== 'All States', gender !== 'all'].filter(Boolean).length}
                </span>
              )}
            </div>
            {filterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {filterOpen && (
            <div className="mt-2 card p-4 space-y-5 animate-fade-in">

              {/* ── State ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={14} style={{ color: '#1A4FA0' }} />
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#3D4966' }}>
                    Filter by State
                  </p>
                  {user?.state && state !== user.state && (
                    <button onClick={() => setState(user.state)}
                      className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full transition-colors"
                      style={{ background: '#E8EFFC', color: '#1A4FA0', border: '1px solid #B8CCEE' }}>
                      Use my state ({user.state})
                    </button>
                  )}
                </div>
                <select value={state} onChange={e => setState(e.target.value)}
                  className="input-field text-sm" aria-label="Filter by state">
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* State-specific scheme count */}
                {state !== 'All States' && statsSummary && (
                  <div className="mt-2 p-2.5 rounded-lg flex items-center gap-2"
                    style={{ background: '#E8F5E9', border: '1px solid #A5D6A7' }}>
                    <MapPin size={13} style={{ color: '#2E7D32' }} />
                    <p className="text-xs" style={{ color: '#1B5E20' }}>
                      {(() => {
                        const found = statsSummary.stateSpecific?.find(s2 => s2.state === state);
                        const count = (found?.schemeCount || 0) + statsSummary.allIndiaSchemes;
                        return `~${count} schemes available in ${state} (including All India)`;
                      })()}
                    </p>
                  </div>
                )}
              </div>

              <hr className="divider" />

              {/* ── Gender ── */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Users size={14} style={{ color: '#1A4FA0' }} />
                  <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#3D4966' }}>
                    Filter by Gender
                  </p>
                  {genderSummary && (
                    <span className="ml-auto text-xs" style={{ color: '#6B7A99' }}>
                      {genderSummary.summary?.find(g => g.gender === 'female')?.schemeCount || 0} women-specific schemes
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {GENDERS.map(({ key, label, icon }) => (
                    <label key={key}
                      className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                      style={{
                        borderColor: gender === key ? '#1A4FA0' : '#D0D7E8',
                        background:  gender === key ? '#E8EFFC' : '#FAFBFE',
                      }}>
                      <input type="radio" name="gender-filter" value={key}
                        checked={gender === key} onChange={() => setGender(key)}
                        className="accent-blue-700 w-4 h-4" />
                      <span className="text-base">{icon}</span>
                      <div>
                        <p className="text-sm font-medium leading-tight"
                          style={{ color: gender === key ? '#1A4FA0' : '#1A1F36' }}>
                          {label}
                        </p>
                        {genderSummary && key !== 'all' && (
                          <p className="text-xs" style={{ color: '#6B7A99' }}>
                            {genderSummary.summary?.find(g => g.gender === key)?.schemeCount || 0} schemes
                          </p>
                        )}
                        {key === 'all' && genderSummary && (
                          <p className="text-xs" style={{ color: '#6B7A99' }}>
                            {genderSummary.summary?.reduce((a, g) => a + (g.gender === 'All' ? g.schemeCount : 0), 0) || 0} open schemes
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => { setState('All States'); setGender('all'); setFilterOpen(false); }}
                className="btn-ghost w-full text-sm py-2.5">
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium" style={{ color: '#6B7A99' }}>Active:</span>
            {state !== 'All States' && (
              <ActiveBadge label={`📍 ${state}`} onRemove={() => setState('All States')} />
            )}
            {gender !== 'all' && (
              <ActiveBadge
                label={`${GENDERS.find(g => g.key === gender)?.icon} ${GENDERS.find(g => g.key === gender)?.label}`}
                onRemove={() => setGender('all')} />
            )}
            {category !== 'all' && (
              <ActiveBadge label={`🏷 ${CATEGORY_META[category]?.label}`} onRemove={() => setSearchParams({})} />
            )}
            {search && <ActiveBadge label={`🔍 "${search}"`} onRemove={clearSearch} />}
            <button onClick={clearAll} className="text-xs font-semibold underline"
              style={{ color: '#C62828' }}>
              Clear all
            </button>
          </div>
        )}

        {/* Result count */}
        {!loading && (
          <p className="text-xs font-medium" style={{ color: '#6B7A99' }}>
            {total} scheme{total !== 1 ? 's' : ''}
            {state !== 'All States' && <> in <strong>{state}</strong></>}
            {gender !== 'all' && <> for <strong>{GENDERS.find(g => g.key === gender)?.label}</strong></>}
            {search && <> matching <strong>"{search}"</strong></>}
          </p>
        )}

        {/* Results */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>

        ) : schemes.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              style={{ background: '#E8EFFC' }}>
              <BookOpen size={26} style={{ color: '#1A4FA0' }} />
            </div>
            <p className="font-semibold" style={{ color: '#1A1F36' }}>No schemes found</p>
            <p className="text-sm mt-1 mb-4" style={{ color: '#6B7A99' }}>
              {search
                ? `No results for "${search}". Try different keywords.`
                : state !== 'All States'
                  ? `No schemes found for ${state} with current filters.`
                  : gender !== 'all'
                    ? `No ${GENDERS.find(g => g.key === gender)?.label}-specific schemes in this category.`
                    : 'No schemes match current filters.'}
            </p>
            <button onClick={clearAll} className="btn-secondary inline-flex text-sm py-2.5 px-5">
              Clear All Filters
            </button>
          </div>

        ) : grouped ? (
          /* Grouped by state (default view — no active filters) */
          <div className="space-y-6">
            {grouped.allIndia.length > 0 && (
              <StateSection
                icon="🇮🇳" title="All India Schemes"
                subtitle="Available across all states"
                schemes={grouped.allIndia} accentColor="#1A4FA0" />
            )}
            {Object.keys(grouped.byStateMap).sort().map(st => (
              <StateSection key={st}
                icon="📍" title={`${st}`}
                subtitle="State-specific scheme"
                schemes={grouped.byStateMap[st]} accentColor="#2E7D32" />
            ))}
          </div>

        ) : (
          /* Flat list (when filters or search active) */
          <div className="space-y-3">
            {schemes.map(s => <SchemeCard key={s.id} scheme={s} />)}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed">
              ← Previous
            </button>
            <span className="text-sm font-medium" style={{ color: '#6B7A99' }}>
              Page {page} of {pages}
            </span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pages}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed">
              Next →
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
