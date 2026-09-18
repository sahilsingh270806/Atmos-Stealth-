import React, { useState } from 'react';
import { WeatherAlert } from '../types';
import { WEATHER_ALERTS } from '../data/mockData';

export const AlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<WeatherAlert[]>(WEATHER_ALERTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const toggleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: !a.acknowledged } : a))
    );
  };

  const criticalCount = alerts.filter((a) => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter((a) => a.severity === 'WARNING').length;
  const advisoryCount = alerts.filter((a) => a.severity === 'ADVISORY').length;

  const filteredAlerts = alerts.filter((a) => {
    if (selectedCategory === 'ALL') return true;
    return a.severity === selectedCategory;
  });

  return (
    <div className="flex flex-col w-full pb-6">
      {/* Alert Status Ribbon */}
      <section className="mx-4 mt-3 bg-[#1b1c1e] border border-[#2b3038]/60 p-2.5">
        <div className="flex items-center justify-between border-b border-[#2b3038]/50 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">warning</span>
            <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-wider">
              TELEMETRY TRIPWIRES & BULLETINS
            </span>
          </div>
          <span className="font-code-telemetry text-[11px] text-white font-semibold">
            STATUS: ACTIVE
          </span>
        </div>

        {/* Severity Metrics Bar */}
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          <button
            onClick={() => setSelectedCategory(selectedCategory === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
            className={`p-2 border flex flex-col items-center transition-colors cursor-pointer ${
              selectedCategory === 'CRITICAL'
                ? 'bg-[#292a2c] border-white'
                : 'bg-[#0d0e10] border-[#2b3038] hover:border-[#525866]'
            }`}
          >
            <span className="font-geist text-[9px] uppercase text-[#8e9193]">CRITICAL</span>
            <span className="font-code-telemetry text-[16px] text-white font-bold">
              {criticalCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'WARNING' ? 'ALL' : 'WARNING')}
            className={`p-2 border flex flex-col items-center transition-colors cursor-pointer ${
              selectedCategory === 'WARNING'
                ? 'bg-[#292a2c] border-white'
                : 'bg-[#0d0e10] border-[#2b3038] hover:border-[#525866]'
            }`}
          >
            <span className="font-geist text-[9px] uppercase text-[#8e9193]">WARNING</span>
            <span className="font-code-telemetry text-[16px] text-[#e3e2e5] font-bold">
              {warningCount}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory(selectedCategory === 'ADVISORY' ? 'ALL' : 'ADVISORY')}
            className={`p-2 border flex flex-col items-center transition-colors cursor-pointer ${
              selectedCategory === 'ADVISORY'
                ? 'bg-[#292a2c] border-white'
                : 'bg-[#0d0e10] border-[#2b3038] hover:border-[#525866]'
            }`}
          >
            <span className="font-geist text-[9px] uppercase text-[#8e9193]">ADVISORY</span>
            <span className="font-code-telemetry text-[16px] text-[#8e9193] font-bold">
              {advisoryCount}
            </span>
          </button>
        </div>
      </section>

      {/* Alert List */}
      <section className="mx-4 mt-2 flex flex-col gap-2">
        {filteredAlerts.map((alert) => {
          const isCrit = alert.severity === 'CRITICAL';
          const isWarn = alert.severity === 'WARNING';

          return (
            <div
              key={alert.id}
              className={`p-2.5 bg-[#1b1c1e] border transition-all ${
                isCrit
                  ? 'border-white/80'
                  : isWarn
                  ? 'border-[#8e9193]'
                  : 'border-[#2b3038]'
              }`}
            >
              {/* Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 ${
                      isCrit ? 'bg-white animate-ping' : isWarn ? 'bg-white' : 'bg-[#8e9193]'
                    }`}
                  />
                  <span className="font-geist text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-[#292a2c] text-white font-semibold">
                    {alert.severity} // {alert.category}
                  </span>
                </div>
                <span className="font-code-telemetry text-[10px] text-[#8e9193]">
                  {alert.timestamp}
                </span>
              </div>

              {/* Title & Metric */}
              <div className="mt-2">
                <h4 className="font-geist text-[12px] font-semibold text-white uppercase tracking-wide">
                  {alert.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 font-code-telemetry text-[11px]">
                  <span className="text-white font-bold bg-[#0d0e10] px-1.5 py-0.5 border border-[#2b3038]">
                    {alert.metric}
                  </span>
                  <span className="text-[#8e9193] text-[10px]">GATE: {alert.threshold}</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-hanken text-[12px] text-[#c4c7c9] mt-2 leading-relaxed">
                {alert.details}
              </p>

              {/* Bottom Action bar */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2b3038]/50">
                <span className="font-code-telemetry text-[9px] text-[#8e9193]">
                  ID: {alert.id} // SENSOR TRIPWIRE #09
                </span>
                <button
                  onClick={() => toggleAcknowledge(alert.id)}
                  className={`px-2.5 py-1 font-geist text-[9px] uppercase font-semibold transition-colors cursor-pointer ${
                    alert.acknowledged
                      ? 'bg-[#292a2c] text-[#8e9193] border border-[#444749]'
                      : 'bg-white text-black hover:bg-[#e0e3e5]'
                  }`}
                >
                  {alert.acknowledged ? '✓ ACKNOWLEDGED' : 'ACKNOWLEDGE TRIPWIRE'}
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
