import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  alertsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  alertsCount = 4,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'forecast', label: 'Forecast', icon: 'routine' },
    { id: 'radar', label: 'Radar', icon: 'radar' },
    { id: 'analytics', label: 'Analytics', icon: 'query_stats' },
    { id: 'alerts', label: 'Alerts', icon: 'warning' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-[#121315]/95 backdrop-blur-xl border-t border-[#2b3038] shadow-[0_-1px_12px_rgba(0,0,0,0.6)]">
      <div className="h-16 max-w-4xl mx-auto px-3 grid grid-cols-4 items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full transition-colors cursor-pointer group ${
                isActive ? 'text-white font-semibold' : 'text-[#8e9193] hover:text-[#c4c7c9]'
              }`}
            >
              {/* Top border active accent */}
              {isActive && (
                <span className="absolute top-0 left-4 right-4 h-[2px] bg-white shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
              )}

              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                >
                  {tab.icon}
                </span>

                {/* Badge for Alerts */}
                {tab.id === 'alerts' && alertsCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-white text-[#121315] font-geist text-[8px] font-bold flex items-center justify-center">
                    {alertsCount}
                  </span>
                )}
              </div>

              <span
                className={`font-geist text-[10px] uppercase mt-1 tracking-wider ${
                  isActive ? 'text-white font-semibold' : 'text-[#8e9193]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
