import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, Star, User, Shield } from 'lucide-react';

const BASE_ITEMS = [
  { to: '/dashboard',       icon: LayoutDashboard, label: 'Home'    },
  { to: '/schemes',         icon: BookOpen,        label: 'Schemes' },
  { to: '/recommendations', icon: Star,            label: 'For You' },
  { to: '/profile',         icon: User,            label: 'Profile' },
];

export default function BottomNav() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const items = isAdmin
    ? [...BASE_ITEMS, { to: '/admin', icon: Shield, label: 'Admin' }]
    : BASE_ITEMS;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gov-border pb-safe"
      style={{ boxShadow: '0 -2px 12px rgba(26,79,160,0.08)' }}
      aria-label="Main navigation">
      <div className="max-w-2xl mx-auto flex">
        {items.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to ||
            (to === '/schemes' && location.pathname.startsWith('/schemes/'));
          return (
            <NavLink
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative"
              aria-label={label}>
              {/* Active top-bar indicator */}
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                  style={{ background: '#1A4FA0' }}
                />
              )}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.2 : 1.8}
                style={{ color: isActive ? '#1A4FA0' : '#6B7A99' }}
              />
              <span
                className="text-[10px] font-semibold leading-none"
                style={{ color: isActive ? '#1A4FA0' : '#6B7A99' }}>
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
