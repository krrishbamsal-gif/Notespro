import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../common/Sidebar';
import { Header } from '../common/Header';
import { DemoBanner } from '../common/DemoBanner';
import { SearchModal } from '../common/SearchModal';
import { AnimatedBackground } from '../common/AnimatedBackground';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white relative">
      {/* Animated Floating Glow Orbs & Star Particles */}
      <AnimatedBackground showParticles={true} />

      {/* Live / Demo AI Status Alert Banner */}
      <DemoBanner />

      <div className="flex-1 flex w-full relative z-10">
        {/* Responsive Dashboard Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onOpenSearch={() => setSearchOpen(true)}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
