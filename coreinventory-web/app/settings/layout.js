'use client';

import Topbar from '../../components/layout/Topbar';

export default function SettingsLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F9F7FF]">
      <Topbar />
      <div className="flex">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
