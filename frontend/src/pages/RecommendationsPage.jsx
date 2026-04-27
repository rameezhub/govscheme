import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { recommendationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import MatchBar from '../components/ui/MatchBar';
import InfoBox from '../components/ui/InfoBox';
import { SkeletonCard } from '../components/ui/Skeleton';
import { getCategoryMeta, CATEGORY_META } from '../components/icons/CategoryIcons';
import { ChevronRight, Award, Filter, Star, AlertCircle } from 'lucide-react';

const CAT_FILTERS = [{ key: 'all', label: 'All' }, ...Object.entries(CATEGORY_META).map(([k, v]) => ({ key: k, label: v.label }))];

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recs, setRecs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (category !== 'all') params.category = category;
      const [recsRes, summaryRes] = await Promise.all([
        recommendationsAPI.get(params),
        page === 1 ? recommendationsAPI.getSummary() : Promise.resolve(null),
      ]);
      setRecs(recsRes.data.data.recommendations || []);
      setTotal(recsRes.data.data.total || 0);
      setPages(recsRes.data.data.pages || 1);
      if (summaryRes) setSummary(summaryRes.data.data);
    } catch { setRecs([]); }
    finally { setLoading(false); }
  }, [page, category]);

  useEffect(() => { fetchRecs(); }, [fetchRecs]);
  useEffect(() => { setPage(1); }, [category]);

  const profileComplete = Boolean(user?.age && user?.annualIncome && user?.state);

  return (
    <Layout title="Recommended Schemes">
      <div className="space-y-4">

        {!profileComplete && (
          <div className="card p-4" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div className="flex items-start gap-2">
              <AlertCircle size={18} style={{ color: '#F59E0B' }} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm" style={{ color: '#92400E' }}>Profile incomplete</p>
                <p className="text-xs mt-1" style={{ color: '#78350F' }}>
                  Add your age, income, and state for accurate recommendations.{' '}
                  <Link to="/profile" className="underline font-semibold" style={{ color: '#1A4FA0' }}>Update Profile →</Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Summary stats */}
        {summary && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} style={{ color: '#1A4FA0' }} />
              <h2 className="font-bold text-sm" style={{ color: '#1A1F36' }}>
                Schemes Matched to Your Profile
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Eligible Schemes', val: summary.totalEligible, color: '#2E7D32', bg: '#E8F5E9' },
                { label: 'Total Schemes',    val: summary.totalSchemes,   color: '#1A4FA0', bg: '#E8EFFC' },
                { label: 'Best Match',       val: `${summary.topMatches?.[0]?.matchPercentage ?? 0}%`, color: '#E65100', bg: '#FFF3E0' },
              ].map(({ label, val, color, bg }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: bg }}>
                  <p className="font-bold text-xl" style={{ color }}>{val}</p>
                  <p className="text-xs mt-0.5 leading-tight" style={{ color }}>{label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: '#6B7A99' }}>
              Profile: {user?.occupation} · {user?.state} · {user?.category} · Age {user?.age} · ₹{Number(user?.annualIncome || 0).toLocaleString('en-IN')}/yr
            </p>
          </div>
        )}

        {/* Category filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter size={14} style={{ color: '#6B7A99' }} />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B7A99' }}>Filter by Category</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CAT_FILTERS.map(({ key, label }) => {
              const isActive = category === key;
              return (
                <button key={key} onClick={() => setCategory(key)}
                  className="shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: isActive ? '#1A4FA0' : '#fff',
                    color:      isActive ? '#fff'    : '#3D4966',
                    border:     `1.5px solid ${isActive ? '#1A4FA0' : '#D0D7E8'}`,
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {!loading && (
          <p className="text-xs font-medium" style={{ color: '#6B7A99' }}>
            {total} eligible scheme{total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Results */}
        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : recs.length === 0 ? (
          <div className="card p-8 text-center">
            <Award size={36} style={{ color: '#A0AFCA' }} className="mx-auto mb-3" />
            <p className="font-semibold" style={{ color: '#1A1F36' }}>No matching schemes found</p>
            <p className="text-sm mt-1 mb-4" style={{ color: '#6B7A99' }}>
              Try selecting a different category, or update your profile for better results.
            </p>
            <Link to="/profile" className="btn-primary inline-flex text-sm py-2.5 px-5">
              Update Profile
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recs.map(({ scheme, matchPercentage, unmetCriteria }, idx) => {
              const { Icon, label: catLabel, bg, color } = getCategoryMeta(scheme.category);
              const isExpanded = expandedId === scheme.id;
              return (
                <div key={scheme.id} className="card overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="cat-icon-box w-12 h-12 rounded-xl shrink-0" style={{ background: bg }}>
                        <Icon size={22} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <h3 className="font-semibold text-sm leading-snug flex-1" style={{ color: '#1A1F36' }}>
                            {scheme.name}
                          </h3>
                          {idx === 0 && category === 'all' && (
                            <span className="badge badge-green text-xs shrink-0">Top Match</span>
                          )}
                        </div>
                        <p className="text-xs mt-1 line-clamp-1" style={{ color: '#6B7A99' }}>{scheme.benefits}</p>
                        <div className="mt-2.5">
                          <MatchBar value={matchPercentage} showLabel />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why recommended expandable */}
                  <div style={{ borderTop: '1px solid #E8ECF4' }}>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : scheme.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold hover:bg-gov-bg transition-colors"
                      style={{ color: '#1A4FA0' }}>
                      <span>Why is this recommended for you?</span>
                      <span style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-3 space-y-1.5" style={{ background: '#FAFBFE' }}>
                        {[
                          scheme.eligibility?.allowedStates?.includes('All') || scheme.eligibility?.allowedStates?.includes(user?.state)
                            ? `✅ Available in ${user?.state}` : null,
                          scheme.eligibility?.categories?.includes('All') || scheme.eligibility?.categories?.includes(user?.category)
                            ? `✅ Open to ${user?.category} category` : null,
                          scheme.eligibility?.occupations?.includes('All') || scheme.eligibility?.occupations?.includes(user?.occupation)
                            ? `✅ Applicable for ${user?.occupation}` : null,
                          scheme.eligibility?.maxIncome && Number(user?.annualIncome) <= scheme.eligibility.maxIncome
                            ? `✅ Your income is within the ₹${(scheme.eligibility.maxIncome / 100000).toFixed(1)}L limit` : null,
                          user?.age >= (scheme.eligibility?.minAge ?? 0) && user?.age <= (scheme.eligibility?.maxAge ?? 120)
                            ? `✅ Age requirement met (${user?.age} years)` : null,
                        ].filter(Boolean).map((r, i) => (
                          <p key={i} className="text-xs" style={{ color: '#1B5E20' }}>{r}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link to={`/schemes/${scheme.id}`}
                    className="flex items-center justify-between px-4 py-3 font-semibold text-sm transition-colors hover:bg-gov-blue-light"
                    style={{ borderTop: '1px solid #E8ECF4', color: '#1A4FA0' }}>
                    View Full Details & Apply
                    <ChevronRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && !loading && (
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-40">← Previous</button>
            <span className="text-sm font-medium" style={{ color: '#6B7A99' }}>Page {page} of {pages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page === pages}
              className="btn-ghost text-sm py-2 px-4 disabled:opacity-40">Next →</button>
          </div>
        )}

        <InfoBox variant="info">
          Results are based on your profile. Keep your income, age, and state up to date for accurate matches.
        </InfoBox>
      </div>
    </Layout>
  );
}
