import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { schemesAPI, recommendationsAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import MatchBar from '../components/ui/MatchBar';
import InfoBox from '../components/ui/InfoBox';
import { getCategoryMeta } from '../components/icons/CategoryIcons';
import {
  CheckCircle, XCircle, ExternalLink, Bookmark, BookmarkCheck,
  FileText, HelpCircle, AlertTriangle, Users, IndianRupee,
  MapPin, GraduationCap, Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

const DetailRow = ({ icon: Icon, label, value, hint }) => (
  <div className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: '#E8ECF4' }}>
    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#E8EFFC' }}>
      <Icon size={16} style={{ color: '#1A4FA0' }} />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium" style={{ color: '#6B7A99' }}>{label}</p>
      <p className="text-sm font-semibold mt-0.5" style={{ color: '#1A1F36' }}>{value}</p>
      {hint && <p className="text-xs mt-0.5" style={{ color: '#9AA5BC' }}>{hint}</p>}
    </div>
  </div>
);

export default function SchemeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scheme, setScheme] = useState(null);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(() =>
    user?.savedSchemes?.map(String).includes(id) ?? false
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.savedSchemes) setSaved(user.savedSchemes.map(String).includes(id));
  }, [user, id]);

  useEffect(() => {
    Promise.all([schemesAPI.getById(id), recommendationsAPI.checkEligibility(id)])
      .then(([s, e]) => { setScheme(s.data.data.scheme); setEligibility(e.data.data); })
      .catch(() => navigate('/schemes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (saved) {
        await userAPI.removeSavedScheme(id);
        setSaved(false);
        toast.success('Removed from saved schemes');
      } else {
        await userAPI.saveScheme(id);
        setSaved(true);
        toast.success('Scheme saved successfully');
      }
    } catch (err) {
      if (err.response?.status === 409) { setSaved(true); toast('Already saved'); }
      else toast.error('Could not save scheme. Please try again.');
    } finally { setSaving(false); }
  };

  if (loading) return (
    <Layout showBack title="Scheme Details">
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => <div key={i} className="card p-4 h-24 skeleton" />)}
      </div>
    </Layout>
  );
  if (!scheme) return null;

  const { Icon, label: catLabel, bg, color } = getCategoryMeta(scheme.category);
  const eligible = eligibility?.eligible;
  const matchPct = eligibility?.matchPercentage ?? 0;

  return (
    <Layout showBack title={scheme.name}>
      <div className="space-y-4 pb-4">

        {/* Scheme header card */}
        <div className="card p-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="cat-icon-box w-14 h-14 rounded-xl shrink-0" style={{ background: bg }}>
              <Icon size={26} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base leading-snug" style={{ color: '#1A1F36' }}>
                {scheme.name}
              </h1>
              {scheme.ministry && (
                <p className="text-xs mt-1 font-medium" style={{ color: '#1A4FA0' }}>
                  {scheme.ministry}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="badge badge-gray text-xs">{catLabel}</span>
                {scheme.launchYear && (
                  <span className="badge badge-blue text-xs">Est. {scheme.launchYear}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              aria-label={saved ? 'Remove from saved' : 'Save scheme'}
              className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors shrink-0"
              style={{
                borderColor: saved ? '#1A4FA0' : '#D0D7E8',
                background:  saved ? '#E8EFFC' : '#fff',
                color:       saved ? '#1A4FA0' : '#6B7A99',
              }}>
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>

          {/* Eligibility result */}
          <div className="rounded-xl p-3.5"
            style={{
              background: eligible ? '#E8F5E9' : '#FEEBEB',
              border: `1px solid ${eligible ? '#A5D6A7' : '#FFCDD2'}`,
            }}>
            <div className="flex items-center gap-2.5 mb-2">
              {eligible
                ? <CheckCircle size={20} style={{ color: '#2E7D32' }} />
                : <XCircle size={20} style={{ color: '#C62828' }} />}
              <p className="font-bold text-base" style={{ color: eligible ? '#1B5E20' : '#B71C1C' }}>
                {eligible ? 'You are eligible for this scheme' : 'You may not be eligible currently'}
              </p>
            </div>
            {eligible ? (
              <MatchBar value={matchPct} showLabel size="lg" />
            ) : (
              <div className="space-y-1.5 mt-1">
                {eligibility?.unmetCriteria?.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <AlertTriangle size={13} className="shrink-0 mt-0.5" style={{ color: '#E53E3E' }} />
                    <p className="text-xs leading-relaxed" style={{ color: '#7B241C' }}>{c}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Why recommended — "What's in it for you" */}
        {eligible && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle size={18} style={{ color: '#1A4FA0' }} />
              <h2 className="font-bold text-sm" style={{ color: '#1A1F36' }}>
                Why This Scheme Is Recommended For You
              </h2>
            </div>
            <div className="space-y-2">
              {[
                user?.state && (scheme.eligibility?.allowedStates?.includes('All') || scheme.eligibility?.allowedStates?.includes(user.state))
                  && `✅ Available in your state — ${user.state}`,
                user?.category && (scheme.eligibility?.categories?.includes('All') || scheme.eligibility?.categories?.includes(user.category))
                  && `✅ Open for ${user.category} category`,
                user?.occupation && (scheme.eligibility?.occupations?.includes('All') || scheme.eligibility?.occupations?.includes(user.occupation))
                  && `✅ Designed for ${user.occupation} occupation`,
                user?.annualIncome && scheme.eligibility?.maxIncome && Number(user.annualIncome) <= scheme.eligibility.maxIncome
                  && `✅ Your income (₹${Number(user.annualIncome).toLocaleString('en-IN')}/yr) is within the limit`,
                user?.age && user.age >= (scheme.eligibility?.minAge ?? 0) && user.age <= (scheme.eligibility?.maxAge ?? 120)
                  && `✅ Your age (${user.age} years) meets the requirement`,
                user?.gender && (scheme.eligibility?.allowedGenders?.includes('All') || scheme.eligibility?.allowedGenders?.includes(user.gender))
                  && `✅ Eligible for your gender`,
              ].filter(Boolean).map((reason, i) => (
                <p key={i} className="text-sm leading-relaxed" style={{ color: '#1B5E20' }}>{reason}</p>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-2" style={{ color: '#1A1F36' }}>
            Benefits / Labh (लाभ)
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#3D4966' }}>{scheme.benefits}</p>
        </div>

        {/* About */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-2" style={{ color: '#1A1F36' }}>About This Scheme</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#3D4966' }}>{scheme.description}</p>
        </div>

        {/* Eligibility criteria */}
        <div className="card p-4">
          <h2 className="font-bold text-sm mb-1" style={{ color: '#1A1F36' }}>Eligibility Criteria</h2>
          <p className="text-xs mb-3" style={{ color: '#6B7A99' }}>You must meet all these conditions to apply</p>
          <div>
            <DetailRow icon={Users}
              label="Age Requirement"
              value={`${scheme.eligibility?.minAge ?? 0} to ${scheme.eligibility?.maxAge ?? 120} years`}
              hint="Your current age must be within this range" />
            <DetailRow icon={IndianRupee}
              label="Income Limit"
              value={scheme.eligibility?.maxIncome
                ? `Up to ₹${scheme.eligibility.maxIncome.toLocaleString('en-IN')} per year`
                : 'No income restriction'}
              hint="Annual household income" />
            <DetailRow icon={MapPin}
              label="Applicable States"
              value={scheme.eligibility?.allowedStates?.includes('All')
                ? 'All India (pan-India scheme)'
                : scheme.eligibility?.allowedStates?.join(', ')}
            />
            <DetailRow icon={Briefcase}
              label="Occupation"
              value={scheme.eligibility?.occupations?.includes('All')
                ? 'All occupations'
                : scheme.eligibility?.occupations?.join(', ')}
            />
            <DetailRow icon={GraduationCap}
              label="Minimum Education"
              value={scheme.eligibility?.minEducation
                ? scheme.eligibility.minEducation.replace('_', ' ')
                : 'No educational requirement'}
            />
          </div>
        </div>

        {/* Required documents */}
        {scheme.requiredDocuments?.length > 0 && (
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} style={{ color: '#1A4FA0' }} />
              <h2 className="font-bold text-sm" style={{ color: '#1A1F36' }}>
                Required Documents ({scheme.requiredDocuments.length})
              </h2>
            </div>
            <InfoBox variant="warning">
              Keep these documents ready before applying. Originals and photocopies may both be required.
            </InfoBox>
            <div className="mt-3 space-y-2">
              {scheme.requiredDocuments.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: '#FAFBFE', border: '1px solid #E8ECF4' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: '#1A4FA0', color: '#fff' }}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium" style={{ color: '#1A1F36' }}>{doc}</span>
                  <CheckCircle size={15} className="ml-auto shrink-0" style={{ color: '#A0AFCA' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apply button */}
        {scheme.officialLink && (
          <a
            href={scheme.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-base py-4">
            <ExternalLink size={18} />
            Apply on Official Government Website
          </a>
        )}

        <InfoBox variant="info">
          YojanaPath helps you discover schemes. For official application, always visit the government portal directly.
        </InfoBox>

        <div className="flex gap-3">
          <Link to="/schemes" className="btn-secondary flex-1 text-sm py-3">
            ← Browse More Schemes
          </Link>
          <Link to="/recommendations" className="btn-ghost flex-1 text-sm py-3">
            My Recommendations
          </Link>
        </div>
      </div>
    </Layout>
  );
}
