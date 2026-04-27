import React from 'react';
export const SkeletonLine = ({ w = 'w-full', h = 'h-4', className = '' }) => (
  <div className={`skeleton rounded ${w} ${h} ${className}`} />
);
export const SkeletonCard = () => (
  <div className="card p-4 space-y-3">
    <div className="flex gap-3">
      <div className="skeleton w-12 h-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <SkeletonLine w="w-3/4" h="h-4" />
        <SkeletonLine w="w-1/2" h="h-3" />
      </div>
    </div>
    <SkeletonLine h="h-3" />
    <SkeletonLine w="w-2/3" h="h-3" />
  </div>
);
