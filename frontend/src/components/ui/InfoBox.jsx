import React from 'react';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

const VARIANTS = {
  info:    { box: 'info-box',    Icon: Info,          iconColor: '#1A4FA0' },
  success: { box: 'success-box', Icon: CheckCircle,   iconColor: '#2E7D32' },
  warning: { box: 'warning-box', Icon: AlertTriangle, iconColor: '#F59E0B' },
};

export default function InfoBox({ variant = 'info', children, title }) {
  const { box, Icon, iconColor } = VARIANTS[variant];
  return (
    <div className={box}>
      <div className="flex items-start gap-2.5">
        <Icon size={16} className="shrink-0 mt-0.5" style={{ color: iconColor }} />
        <div>
          {title && <p className="font-semibold text-sm mb-0.5" style={{ color: iconColor }}>{title}</p>}
          <p className="text-sm text-gov-text-2 leading-relaxed">{children}</p>
        </div>
      </div>
    </div>
  );
}
