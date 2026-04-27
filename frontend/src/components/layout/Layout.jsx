import React from 'react';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

export default function Layout({ children, title, showBack = false, noPad = false }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F4F6FB' }}>
      <TopBar title={title} showBack={showBack} />
      <main className={`flex-1 max-w-2xl mx-auto w-full ${noPad ? '' : 'px-4 py-4'} pb-24`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
