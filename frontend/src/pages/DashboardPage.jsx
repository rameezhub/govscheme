import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recommendationsAPI, schemesAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import MatchBar from '../components/ui/MatchBar';
import { SkeletonCard, SkeletonLine } from '../components/ui/Skeleton';
import { getCategoryMeta } from '../components/icons/CategoryIcons';
import { ChevronRight, AlertCircle, FileText, Award, BookOpen, MapPin, Users } from 'lucide-react';

const QUICK_STATS = [
  { icon: Award,    color: '#1A4FA0', bg: '#E8EFFC', label: 'Eligible Schemes', key: 'totalEligible' },
  { icon: BookOpen, color: '#2E7D32', bg: '#E8F5E9', label: 'Total Schemes',    key: 'totalSchemes' },
  { icon: FileText, color: '#E65100', bg: '#FFF3E0', label: 'Top Match %',      key: 'topMatch' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary]       = useState(null);
  const [topSchemes, setTopSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      recommendationsAPI.getSummary(),
      recommendationsAPI.get({ limit: 4 }),
      schemesAPI.getCategories(),
    ])
      .then(([s, r, c]) => {
        if (controller.signal.aborted) return;
        setSummary(s.data.data);
        setTopSchemes(r.data.data.recommendations || []);
        setCategories(c.data.data.categories || []);
      })
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const topMatchPct = useMemo(
    () => summary?.topMatches?.[0]?.matchPercentage ?? 0,
    [summary]
  );

  const profileComplete = Boolean(user?.age && user?.annualIncome && user?.state && user?.occupation);

  return (
    <Layout>
      <div className="space-y-4">

        {/* ── Welcome banner ── */}
        <div className="card p-4" style={{ borderLeft: '4px solid #1A4FA0' }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1A4FA0' }}>
                Welcome, {user?.name?.split(' ')[0]}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>
                {user?.occupation} · {user?.state} · {user?.category} Category
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0"
              style={{ background: '#1A4FA0', color: '#fff' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
          {!profileComplete && (
            <div className="mt-3 p-2.5 rounded-lg flex items-start gap-2"
              style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
              <AlertCircle size={15} className="shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
              <p className="text-xs" style={{ color: '#78350F' }}>
                <span className="font-semibold">Complete your profile</span> — Add income and state for accurate scheme recommendations.{' '}
                <Link to="/profile" className="underline font-medium">Update now →</Link>
              </p>
            </div>
          )}
        </div>

        {/* ── Quick stats ── */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_STATS.map(({ icon: Icon, color, bg, label, key }) => {
            const val = key === 'topMatch'
              ? (loading ? '—' : `${topMatchPct}%`)
              : (loading ? '—' : (summary?.[key] ?? '—'));
            return (
              <div key={label} className="card p-3 text-center">
                <div className="w-9 h-9 rounded-xl mx-auto mb-2 flex items-center justify-center"
                  style={{ background: bg }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <p className="font-bold text-xl leading-none" style={{ color }}>{val}</p>
                <p className="text-xs mt-1 leading-tight" style={{ color: '#6B7A99' }}>{label}</p>
              </div>
            );
          })}
        </div>

        {/* ── Quick filter shortcuts (State + Gender) ── */}
        <div className="card p-4">
          <p className="font-bold text-sm mb-3" style={{ color: '#1A1F36' }}>
            🔍 Quick Browse
          </p>
          <div className="grid grid-cols-2 gap-2">
            {/* Browse by my state */}
            <Link
              to={`/schemes?category=all`}
              state={{ filterState: user?.state }}
              className="flex items-center gap-2.5 p-3 rounded-xl border transition-colors hover:bg-gov-blue-light"
              style={{ borderColor: '#D0D7E8' }}
              onClick={() => {
                // Store in sessionStorage for SchemesPage to pick up
                if (user?.state) sessionStorage.setItem('prefState', user.state);
              }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: '#E8F5E9' }}>
                <MapPin size={18} style={{ color: '#2E7D32' }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs" style={{ color: '#1A1F36' }}>My State</p>
                <p className="text-xs truncate" style={{ color: '#6B7A99' }}>
                  {user?.state || 'Set in profile'}
                </p>
              </div>
            </Link>

            {/* Women-specific schemes */}
            <Link
              to="/schemes"
              onClick={() => sessionStorage.setItem('prefGender', 'female')}
              className="flex items-center gap-2.5 p-3 rounded-xl border transition-colors hover:bg-gov-blue-light"
              style={{ borderColor: '#D0D7E8' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: '#FCE4EC' }}>
                <Users size={18} style={{ color: '#880E4F' }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs" style={{ color: '#1A1F36' }}>Women Schemes</p>
                <p className="text-xs" style={{ color: '#6B7A99' }}>Female-specific</p>
              </div>
            </Link>

            {/* All India schemes */}
            <Link
              to="/schemes"
              onClick={() => { sessionStorage.setItem('prefState', 'All States'); }}
              className="flex items-center gap-2.5 p-3 rounded-xl border transition-colors hover:bg-gov-blue-light"
              style={{ borderColor: '#D0D7E8' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: '#E8EFFC' }}>
                <span className="text-lg">🇮🇳</span>
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs" style={{ color: '#1A1F36' }}>All India</p>
                <p className="text-xs" style={{ color: '#6B7A99' }}>Pan-India schemes</p>
              </div>
            </Link>

            {/* Gender-neutral */}
            <Link
              to="/schemes"
              onClick={() => sessionStorage.setItem('prefGender', 'all')}
              className="flex items-center gap-2.5 p-3 rounded-xl border transition-colors hover:bg-gov-blue-light"
              style={{ borderColor: '#D0D7E8' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: '#F3E5F5' }}>
                <Users size={18} style={{ color: '#6A1B9A' }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-xs" style={{ color: '#1A1F36' }}>All Genders</p>
                <p className="text-xs" style={{ color: '#6B7A99' }}>Open to everyone</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Browse by category ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="section-title">Browse by Category</h2>
              <p className="section-subtitle">Select a category to see relevant schemes</p>
            </div>
            <Link to="/schemes" className="btn-ghost py-1.5 px-3 text-sm">View All</Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="skeleton w-12 h-12 rounded-xl" />
                  <div className="skeleton h-3 w-14" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {categories.slice(0, 8).map(({ _id }) => {
                const { Icon, label, bg, color } = getCategoryMeta(_id);
                return (
                  <Link key={_id} to={`/schemes?category=${_id}`}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-transparent hover:border-gov-border hover:bg-white transition-all">
                    <div className="cat-icon-box w-12 h-12 rounded-xl" style={{ background: bg }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <span className="text-xs font-medium text-center leading-tight" style={{ color: '#3D4966' }}>
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Top recommended ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="section-title">Recommended for You</h2>
              <p className="section-subtitle">Based on your profile — {user?.state}, {user?.category}</p>
            </div>
            <Link to="/recommendations" className="btn-ghost py-1.5 px-3 text-sm">See All</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : topSchemes.length === 0 ? (
            <div className="card p-6 text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                style={{ background: '#E8EFFC' }}>
                <BookOpen size={22} style={{ color: '#1A4FA0' }} />
              </div>
              <p className="font-semibold" style={{ color: '#1A1F36' }}>No recommendations yet</p>
              <p className="text-sm mt-1 mb-4" style={{ color: '#6B7A99' }}>
                Complete your profile to get personalised scheme recommendations
              </p>
              <Link to="/profile" className="btn-primary inline-flex text-sm py-2.5 px-5">
                Complete Profile
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {topSchemes.map(({ scheme, matchPercentage }, idx) => {
                const { Icon, label: catLabel, bg, color } = getCategoryMeta(scheme.category);
                const isAllIndia = (scheme.eligibility?.allowedStates || ['All']).includes('All');
                const isAllGender = (scheme.eligibility?.allowedGenders || ['All']).includes('All');
                return (
                  <Link key={scheme.id} to={`/schemes/${scheme.id}`} className="card card-hover block p-4">
                    <div className="flex items-start gap-3">
                      <div className="cat-icon-box w-12 h-12 rounded-xl shrink-0" style={{ background: bg }}>
                        <Icon size={22} style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm leading-snug" style={{ color: '#1A1F36' }}>
                            {scheme.name}
                          </h3>
                          {idx === 0 && (
                            <span className="badge badge-blue shrink-0 text-xs">Best Match</span>
                          )}
                        </div>
                        <p className="text-xs mt-1 line-clamp-1" style={{ color: '#6B7A99' }}>
                          {scheme.benefits}
                        </p>

                        {/* State + Gender indicators */}
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: isAllIndia ? '#E8F5E9' : '#FFF8E1',
                              color:      isAllIndia ? '#2E7D32' : '#92400E',
                            }}>
                            📍 {isAllIndia ? 'All India' : scheme.eligibility?.allowedStates?.slice(0,1).join('')}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: '#F3E5F5', color: '#6A1B9A' }}>
                            {isAllGender ? '👥 All' : scheme.eligibility?.allowedGenders?.map(g =>
                              g === 'male' ? '👨' : g === 'female' ? '👩' : '🧑'
                            ).join('')}
                          </span>
                        </div>

                        <div className="mt-2.5">
                          <MatchBar value={matchPercentage} showLabel />
                        </div>
                      </div>
                      <ChevronRight size={18} className="shrink-0 mt-1" style={{ color: '#A0AFCA' }} />
                    </div>
                  </Link>
                );
              })}
              <Link to="/recommendations"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-colors hover:bg-gov-blue-light"
                style={{ borderColor: '#1A4FA0', color: '#1A4FA0', borderStyle: 'dashed' }}>
                View all eligible schemes <ChevronRight size={16} />
              </Link>
            </div>
          )}
        </div>

        {/* ── How it works ── */}
        <div className="card p-4" style={{ background: '#E8EFFC', border: '1px solid #B8CCEE' }}>
          <p className="font-semibold text-sm mb-2" style={{ color: '#1A4FA0' }}>
            📋 How YojanaPath Works
          </p>
          <ol className="space-y-1.5">
            {[
              'Fill your profile with correct age, income, state and gender',
              'Use State & Gender filters on Schemes page to narrow results',
              'We match you with eligible government schemes automatically',
              'View scheme details, required documents, and apply directly',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: '#1A4FA0' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold shrink-0 text-xs"
                  style={{ background: '#1A4FA0', color: '#fff', minWidth: 20 }}>
                  {i + 1}
                </span>
                {t}
              </li>
            ))}
          </ol>
        </div>

      </div>
    </Layout>
  );
}
