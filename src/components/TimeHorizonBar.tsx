import React from 'react';
import { StationInfo, TimeHorizon } from '../types';
import { TIMEFRAME_LABELS } from '../data/mockData';

interface TimeHorizonBarProps {
  currentStation: StationInfo;
  activeHorizon: TimeHorizon;
  onChangeHorizon: (horizon: TimeHorizon) => void;
  onOpenFilter: () => void;
  onOpenExport: () => void;
}

export const TimeHorizonBar: React.FC<TimeHorizonBarProps> = ({
  currentStation,
  activeHorizon,
  onChangeHorizon,
  onOpenFilter,
  onOpenExport,
}) => {
  const horizons: TimeHorizon[] = ['24H', '7D', '30D', 'SEASON', 'ALL'];

  return (
    <section className="flex flex-col px-4 py-2 bg-[#0d0e10] border-b border-[#2b3038]/40">
      {/* Cluster Status Line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-1.5 h-1.5 bg-white animate-pulse"></span>
          <span className="font-geist text-[10px] uppercase tracking-widest text-[#e3e2e5] truncate font-medium">
            {currentStation.cluster}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#c4c7c9] font-code-telemetry text-[11px]">
          <span>TTL {currentStation.ttl}</span>
          <span className="text-[#444749]">//</span>
          <span>{currentStation.latency}</span>
        </div>
      </div>

      {/* Time Horizon Segmented Control */}
      <div className="grid grid-cols-5 mt-2 bg-[#1b1c1e] p-0.5 gap-0.5 border border-[#2b3038]">
        {horizons.map((h) => {
          const isActive = activeHorizon === h;
          return (
            <button
              key={h}
              onClick={() => onChangeHorizon(h)}
              className={`py-1 text-center font-geist text-[10px] uppercase transition-colors cursor-pointer ${
                isActive
                  ? 'bg-white text-[#2d3133] font-semibold'
                  : 'text-[#c4c7c9] hover:text-white hover:bg-[#292a2c]'
              }`}
            >
              {h}
            </button>
          );
        })}
      </div>

      {/* Quick Meta Strip */}
      <div className="flex items-center justify-between mt-1.5 pt-1 text-[11px]">
        <div className="flex items-center gap-1 overflow-hidden">
          <span className="font-geist text-[10px] uppercase text-[#c4c7c9] shrink-0">TIMEFRAME:</span>
          <span className="font-code-telemetry text-[11px] text-[#e3e2e5] truncate">
            {TIMEFRAME_LABELS[activeHorizon] || TIMEFRAME_LABELS['7D']}
          </span>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 pl-2">
          <button
            onClick={onOpenFilter}
            className="flex items-center gap-1 font-geist text-[10px] uppercase text-[#c4c7c9] hover:text-white cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span>FILTER</span>
          </button>
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1 font-geist text-[10px] uppercase text-[#c4c7c9] hover:text-white cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            <span>EXPORT</span>
          </button>
        </div>
      </div>
    </section>
  );
};
