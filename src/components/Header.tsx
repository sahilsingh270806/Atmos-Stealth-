import React, { useState, useRef, useEffect } from 'react';
import { StationInfo } from '../types';
import { STATIONS } from '../data/mockData';

interface HeaderProps {
  currentStation: StationInfo;
  onSelectStation: (station: StationInfo) => void;
  onOpenFilter: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStation,
  onSelectStation,
  onOpenFilter,
  onOpenProfile,
}) => {
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setStationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#121315]/90 backdrop-blur-xl border-b border-[#2b3038]/60 shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
      <div className="h-14 max-w-4xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Brand + Station Selector */}
        <div className="flex items-center gap-2.5 relative" ref={dropdownRef}>
          <div className="flex items-center justify-center w-7 h-7 bg-[#343537] border border-[#444749]">
            <span className="material-symbols-outlined text-white text-[15px]">terminal</span>
          </div>
          
          <div className="flex flex-col">
            <span className="font-geist text-[10px] uppercase tracking-widest text-[#c4c7c9] leading-none">
              ATMOS // STEALTH
            </span>
            <button
              onClick={() => setStationDropdownOpen(!stationDropdownOpen)}
              className="flex items-center gap-1 mt-0.5 text-left group cursor-pointer focus:outline-none"
              title="Switch Observation Cluster"
            >
              <span className="material-symbols-outlined text-white text-[14px]">location_on</span>
              <span className="font-geist text-[12px] uppercase text-white tracking-wider font-semibold group-hover:text-white/80">
                {currentStation.name}
              </span>
              <span className="material-symbols-outlined text-[#8e9193] text-[14px] transition-transform duration-150">
                {stationDropdownOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {/* Station Selector Dropdown */}
          {stationDropdownOpen && (
            <div className="absolute top-12 left-0 w-72 bg-[#1b1c1e] border border-[#444749] shadow-2xl z-50 py-1 divide-y divide-[#292a2c]">
              <div className="px-3 py-1.5 bg-[#0d0e10]">
                <span className="font-geist text-[9px] uppercase tracking-widest text-[#8e9193]">
                  SELECT TELEMETRY CLUSTER
                </span>
              </div>
              {STATIONS.map((station) => (
                <button
                  key={station.id}
                  onClick={() => {
                    onSelectStation(station);
                    setStationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex flex-col transition-colors cursor-pointer ${
                    station.id === currentStation.id
                      ? 'bg-[#292a2c] text-white border-l-2 border-white'
                      : 'text-[#c4c7c9] hover:bg-[#202225] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-geist text-[12px] uppercase font-semibold">
                      {station.name}
                    </span>
                    <span className="font-geist text-[10px] text-[#8e9193]">
                      {station.status}
                    </span>
                  </div>
                  <span className="font-geist text-[9px] text-[#8e9193] mt-0.5 tracking-wider">
                    {station.cluster}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[9px] text-[#8e9193] font-code-telemetry">
                    <span>{station.coordinates}</span>
                    <span>{station.latency}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenFilter}
            className="w-9 h-9 flex items-center justify-center text-[#c4c7c9] hover:text-white hover:bg-[#1f2022] border border-transparent hover:border-[#2b3038] transition-colors cursor-pointer"
            title="Telemetry Filter Settings"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
          </button>
          
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:opacity-90 active:scale-95 transition cursor-pointer"
            title="Operator Profile"
          >
            <span className="material-symbols-outlined text-[#2d3133] text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
