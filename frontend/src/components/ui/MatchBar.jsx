import React from 'react';

const getColor = (val) => {
  if (val >= 80) return '#2E7D32';
  if (val >= 55) return '#E65100';
  return '#C62828';
};
const getLabel = (val) => {
  if (val >= 80) return 'High Match';
  if (val >= 55) return 'Moderate Match';
  return 'Low Match';
};

export default function MatchBar({ value, showLabel = false, size = 'md' }) {
  const color = getColor(value);
  const h = size === 'sm' ? 4 : size === 'lg' ? 8 : 6;
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium" style={{ color }}>{getLabel(value)}</span>
          <span className="text-sm font-bold" style={{ color }}>{value}%</span>
        </div>
      )}
      <div className="w-full rounded-full overflow-hidden" style={{ height: h, background: '#E8ECF4' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}
