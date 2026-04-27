// Professional SVG icons for each scheme category
// Sized at 24x24, all use currentColor for easy theming

export const FarmerIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 3C7.5 3 3 6 3 11c0 2.5 1 4.5 2.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 3c4.5 0 9 3 9 8 0 2.5-1 4.5-2.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M12 3v10M8 8l4 5M16 8l-4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 17c1.5 2 3.5 3.5 6.5 3.5s5-1.5 6.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <rect x="9" y="18.5" width="6" height="2.5" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
);

export const HealthIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 7v10M7 12h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

export const EducationIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M12 4L2 9l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M6 11.5v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M22 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const BankingIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 10h18M3 14h18M12 4l9 6H3l9-6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M5 10v8M9 10v8M15 10v8M19 10v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const EmploymentIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="2" y="8" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 13v3M10 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const WomenIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 12v8M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M19 11l-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const SeniorIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="6" r="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M8 21l1.5-7.5M16 21l-1.5-7.5M6 13h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 13.5C8 13.5 7 16 5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 13.5C16 13.5 17 16 19 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

export const HousingIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M3 12l9-9 9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const OtherIcon = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

// Map category string → component + colours
export const CATEGORY_META = {
  farmer:         { Icon: FarmerIcon,     label: 'Farmers',      bg: '#E8F5E9', color: '#2E7D32',  border: '#A5D6A7' },
  healthcare:     { Icon: HealthIcon,     label: 'Healthcare',   bg: '#FBE9E7', color: '#BF360C',  border: '#FFAB91' },
  education:      { Icon: EducationIcon,  label: 'Education',    bg: '#E3F2FD', color: '#0D47A1',  border: '#90CAF9' },
  banking:        { Icon: BankingIcon,    label: 'Banking',      bg: '#EDE7F6', color: '#4527A0',  border: '#B39DDB' },
  employment:     { Icon: EmploymentIcon, label: 'Employment',   bg: '#FFF8E1', color: '#E65100',  border: '#FFD54F' },
  women_child:    { Icon: WomenIcon,      label: 'Women & Child',bg: '#FCE4EC', color: '#880E4F',  border: '#F48FB1' },
  senior_citizen: { Icon: SeniorIcon,     label: 'Senior Citizen',bg:'#F3E5F5', color: '#6A1B9A',  border: '#CE93D8' },
  housing:        { Icon: HousingIcon,    label: 'Housing',      bg: '#E0F2F1', color: '#00695C',  border: '#80CBC4' },
  other:          { Icon: OtherIcon,      label: 'Other',        bg: '#ECEFF1', color: '#37474F',  border: '#B0BEC5' },
};

export const getCategoryMeta = (cat) => CATEGORY_META[cat] || CATEGORY_META.other;
