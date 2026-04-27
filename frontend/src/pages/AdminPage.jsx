import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import { SkeletonLine } from '../components/ui/Skeleton';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Users, BookOpen, Activity, TrendingUp,
  RefreshCw, AlertCircle, CheckCircle, XCircle, Shield
} from 'lucide-react';

const COLORS = ['#1A4FA0','#2E7D32','#E65100','#6A1B9A','#00695C','#880E4F','#0D47A1','#BF360C'];

const StatCard = ({ icon: Icon, label, value, sub, color, bg }) => (
  <div className="card p-4">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="font-bold text-2xl leading-none" style={{ color }}>{value ?? '—'}</p>
        <p className="text-sm font-medium mt-1" style={{ color: '#1A1F36' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#6B7A99' }}>{sub}</p>}
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="card p-4">
    <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid #E8ECF4' }}>
      <Icon size={16} style={{ color: '#1A4FA0' }} />
      <h3 className="font-bold text-sm" style={{ color: '#1A1F36' }}>{title}</h3>
    </div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-3 py-2">
      <p className="text-xs font-semibold mb-1" style={{ color: '#6B7A99' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await adminAPI.getAnalytics();
      setData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics. Please try again.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <Layout title="Admin Panel">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <SkeletonLine w="w-10" h="h-10" className="rounded-xl" />
              <SkeletonLine w="w-16" h="h-7" />
              <SkeletonLine w="w-24" h="h-4" />
            </div>
          ))}
        </div>
        {[...Array(3)].map((_, i) => <div key={i} className="card h-52 skeleton" />)}
      </div>
    </Layout>
  );

  if (error) return (
    <Layout title="Admin Panel">
      <div className="card p-8 text-center">
        <AlertCircle size={32} style={{ color: '#C62828' }} className="mx-auto mb-3" />
        <p className="font-bold text-base mb-1" style={{ color: '#1A1F36' }}>Could not load analytics</p>
        <p className="text-sm mb-4" style={{ color: '#6B7A99' }}>{error}</p>
        <button onClick={fetchData} className="btn-primary inline-flex px-6 py-2.5 text-sm">
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    </Layout>
  );

  const { overview, users, schemes } = data;

  const genderData = users.byGender.map(g => ({
    name: g._id ? (g._id.charAt(0).toUpperCase() + g._id.slice(1)) : 'Unknown',
    value: g.count,
  }));

  const categoryData = users.byCategory.map(c => ({
    name: c._id || 'Other',
    count: c.count,
  }));

  const schemeCatData = schemes.byCategory.map(c => ({
    name: (c._id || 'Other').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()).substring(0, 10),
    active:   c.active,
    inactive: c.total - c.active,
  }));

  return (
    <Layout title="Admin Panel">
      <div className="space-y-4 pb-4">

        {/* Admin badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#E8EFFC', border: '1px solid #B8CCEE' }}>
            <Shield size={15} style={{ color: '#1A4FA0' }} />
            <span className="text-xs font-bold" style={{ color: '#1A4FA0' }}>ADMIN ACCESS — Dashboard Analytics</span>
          </div>
          <button onClick={fetchData} className="btn-ghost py-2 px-3 text-xs">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Overview stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={Users}     label="Total Users"      value={overview.totalUsers}
            sub="Registered accounts" color="#1A4FA0" bg="#E8EFFC" />
          <StatCard icon={BookOpen}  label="Total Schemes"    value={overview.totalSchemes}
            sub={`${overview.activeSchemes} active`} color="#2E7D32" bg="#E8F5E9" />
          <StatCard icon={CheckCircle} label="Active Schemes" value={overview.activeSchemes}
            sub="Currently live" color="#2E7D32" bg="#E8F5E9" />
          <StatCard icon={XCircle}   label="Inactive Schemes" value={overview.inactiveSchemes}
            sub="Temporarily paused" color="#C62828" bg="#FEEBEB" />
        </div>

        {/* Users by category */}
        <SectionCard title="Users by Social Category" icon={Users}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
              <XAxis dataKey="name"
                tick={{ fill: '#6B7A99', fontSize: 11, fontFamily: 'Noto Sans' }}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,79,160,0.04)' }} />
              <Bar dataKey="count" name="Users" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Gender distribution */}
        <SectionCard title="Gender Distribution" icon={Activity}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genderData} cx="50%" cy="50%"
                outerRadius={70} innerRadius={35}
                dataKey="value" nameKey="name" paddingAngle={3}>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}
                    stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle" iconSize={9}
                formatter={(val) => (
                  <span style={{ color: '#3D4966', fontSize: 12 }}>{val}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Schemes by category */}
        <SectionCard title="Schemes by Category (Active vs Inactive)" icon={BookOpen}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={schemeCatData} margin={{ top: 4, right: 8, left: -28, bottom: 20 }}>
              <XAxis dataKey="name"
                tick={{ fill: '#6B7A99', fontSize: 10, fontFamily: 'Noto Sans' }}
                axisLine={false} tickLine={false} angle={-30} textAnchor="end" />
              <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,79,160,0.04)' }} />
              <Bar dataKey="active"   name="Active"   fill="#2E7D32" radius={[4, 4, 0, 0]} stackId="a" maxBarSize={32} />
              <Bar dataKey="inactive" name="Inactive" fill="#E8ECF4" radius={[0, 0, 0, 0]} stackId="a" maxBarSize={32} />
              <Legend
                iconType="circle" iconSize={9}
                formatter={(val) => <span style={{ color: '#3D4966', fontSize: 12 }}>{val}</span>}
              />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Users by state */}
        <SectionCard title="Top States by User Count" icon={TrendingUp}>
          <div className="space-y-3">
            {users.byState.slice(0, 8).map((s, i) => {
              const pct = overview.totalUsers
                ? Math.round((s.count / overview.totalUsers) * 100)
                : 0;
              return (
                <div key={s._id} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-5 shrink-0 text-center"
                    style={{ color: '#A0AFCA' }}>{i + 1}</span>
                  <span className="text-sm font-medium flex-1 truncate"
                    style={{ color: '#1A1F36' }}>{s._id}</span>
                  <div className="w-24 h-2 rounded-full overflow-hidden shrink-0"
                    style={{ background: '#E8ECF4' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right shrink-0"
                    style={{ color: '#6B7A99' }}>{s.count}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Income distribution */}
        <SectionCard title="Income Distribution of Users" icon={Activity}>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={users.incomeDistribution} margin={{ top: 4, right: 8, left: -28, bottom: 0 }}>
              <XAxis dataKey="range"
                tick={{ fill: '#6B7A99', fontSize: 10, fontFamily: 'Noto Sans' }}
                axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6B7A99', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26,79,160,0.04)' }} />
              <Bar dataKey="count" name="Users" fill="#6A1B9A" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Recent signups */}
        <SectionCard title="Recent User Registrations" icon={Users}>
          <div>
            {users.recentSignups.map((u, i) => (
              <div key={u._id}
                className="flex items-center gap-3 py-3"
                style={{ borderBottom: i < users.recentSignups.length - 1 ? '1px solid #E8ECF4' : 'none' }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: '#1A4FA0', color: '#fff' }}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1A1F36' }}>{u.name}</p>
                  <p className="text-xs" style={{ color: '#6B7A99' }}>
                    {u.state} · {u.occupation}
                  </p>
                </div>
                <p className="text-xs font-mono shrink-0" style={{ color: '#A0AFCA' }}>
                  {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>

      </div>
    </Layout>
  );
}
