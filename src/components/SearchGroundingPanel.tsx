import React, { useState } from 'react';
import { GroundedWeatherResponse } from '../services/groundingService';

interface SearchGroundingPanelProps {
  groundedData: GroundedWeatherResponse | null;
  isLoading: boolean;
  onRefresh: (customLocation?: string) => void;
  onApplyToDashboard?: (data: GroundedWeatherResponse) => void;
  tempUnit?: 'C' | 'F';
  pressureUnit?: 'hPa' | 'inHg';
  windUnit?: 'km/h' | 'kt';
}

export const SearchGroundingPanel: React.FC<SearchGroundingPanelProps> = ({
  groundedData,
  isLoading,
  onRefresh,
  onApplyToDashboard,
  tempUnit = 'C',
  pressureUnit = 'hPa',
  windUnit = 'km/h',
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTemp = (celsius: number) => {
    if (tempUnit === 'F') {
      return ((celsius * 9) / 5 + 32).toFixed(1) + '°F';
    }
    return celsius.toFixed(1) + '°C';
  };

  const formatPressure = (hpa: number) => {
    if (pressureUnit === 'inHg') {
      return (hpa * 0.02953).toFixed(2) + ' inHg';
    }
    return hpa.toFixed(1) + ' hPa';
  };

  const formatWind = (kmh: number) => {
    if (windUnit === 'kt') {
      return (kmh * 0.539957).toFixed(1) + ' kt';
    }
    return kmh.toFixed(1) + ' km/h';
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuery.trim()) {
      onRefresh(customQuery.trim());
    }
  };

  return (
    <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/70 shadow-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-2 bg-[#1f2022] border-b border-[#2b3038]/50">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-white text-[16px]">travel_explore</span>
          <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-wider">
            SEARCH GROUNDING // GEMINI-3.5-FLASH
          </span>
          <span className="font-code-telemetry text-[9px] uppercase px-1 py-0.2 bg-[#292a2c] text-white border border-[#444749]/60 font-semibold">
            LIVE WEB
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onRefresh()}
            disabled={isLoading}
            className="flex items-center gap-1 font-geist text-[10px] uppercase text-[#c4c7c9] hover:text-white px-2 py-0.5 bg-[#0d0e10] border border-[#2b3038] cursor-pointer disabled:opacity-50"
            title="Ingest live Google Search weather observations"
          >
            <span className={`material-symbols-outlined text-[14px] ${isLoading ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>{isLoading ? 'GROUNDING...' : 'SYNC SEARCH'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#8e9193] hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>
      </div>

      {/* Summary Strip (Always Visible) */}
      <div className="p-2 bg-[#0d0e10] flex flex-col gap-1.5 text-[11px]">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white animate-pulse" />
            <span className="font-code-telemetry text-white font-semibold">
              {groundedData ? groundedData.location : 'Haldia Port Coastal Zone'}
            </span>
          </div>

          <span className="font-code-telemetry text-[10px] text-[#8e9193]">
            {groundedData?.timestamp
              ? `INGESTED: ${new Date(groundedData.timestamp).toLocaleTimeString()} UTC`
              : 'LIVE READY'}
          </span>
        </div>

        {/* Live metric mini-strip */}
        {groundedData && (
          <div className="grid grid-cols-4 gap-1 p-1 bg-[#1f2022] border border-[#2b3038]/40 text-center font-code-telemetry text-[11px]">
            <div>
              <span className="block text-[8px] text-[#8e9193] font-geist uppercase">TEMP</span>
              <span className="text-white font-bold">{formatTemp(groundedData.temp)}</span>
            </div>
            <div>
              <span className="block text-[8px] text-[#8e9193] font-geist uppercase">DEW</span>
              <span className="text-[#c4c7c9]">{formatTemp(groundedData.dewPoint)}</span>
            </div>
            <div>
              <span className="block text-[8px] text-[#8e9193] font-geist uppercase">PRESSURE</span>
              <span className="text-white font-semibold">{formatPressure(groundedData.pressure)}</span>
            </div>
            <div>
              <span className="block text-[8px] text-[#8e9193] font-geist uppercase">WIND</span>
              <span className="text-white font-semibold">{formatWind(groundedData.windSpeed)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Deep Telemetry & Search Grounding Sources */}
      {isExpanded && (
        <div className="p-2.5 bg-[#141518] border-t border-[#2b3038]/50 flex flex-col gap-2">
          {/* Custom Search Input */}
          <form onSubmit={handleSearch} className="flex gap-1">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Search coastal zone (e.g. Paradip Port, Bay of Bengal buoy)..."
              className="flex-1 bg-[#090a0c] border border-[#2b3038] px-2 py-1 text-[11px] font-code-telemetry text-white placeholder:text-[#525866] focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black px-2.5 py-1 font-geist text-[10px] uppercase font-semibold hover:bg-[#e0e3e5] cursor-pointer disabled:opacity-50"
            >
              QUERY
            </button>
          </form>

          {/* Narrative Summary from Gemini with Search Grounding */}
          {groundedData?.summary && (
            <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/40">
              <span className="font-geist text-[9px] uppercase tracking-wider text-[#8e9193] block mb-1">
                SYNOPTIC SEARCH INTELLIGENCE // GOOGLE SEARCH GROUNDED
              </span>
              <p className="font-hanken text-[12px] text-[#e3e2e5] leading-relaxed whitespace-pre-line">
                {groundedData.summary}
              </p>
              {groundedData.notice && (
                <div className="mt-1.5 pt-1 border-t border-[#2b3038]/40 font-code-telemetry text-[9px] text-[#8e9193]">
                  STATUS NOTE: {groundedData.notice}
                </div>
              )}
            </div>
          )}

          {/* Web Grounding Citations */}
          {groundedData?.groundingSources && groundedData.groundingSources.length > 0 && (
            <div className="flex flex-col gap-1 mt-1">
              <span className="font-geist text-[9px] uppercase tracking-wider text-[#8e9193]">
                VERIFIED GOOGLE SEARCH GROUNDING SOURCES ({groundedData.groundingSources.length}):
              </span>
              <div className="flex flex-col divide-y divide-[#2b3038]/40 bg-[#0d0e10] border border-[#2b3038]/30">
                {groundedData.groundingSources.map((source, index) => (
                  <a
                    key={index}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 flex items-center justify-between hover:bg-[#1b1c1e] text-[#c4c7c9] hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 pr-2">
                      <span className="material-symbols-outlined text-[13px] text-[#8e9193] group-hover:text-white">
                        link
                      </span>
                      <span className="font-geist text-[11px] truncate">
                        {source.title}
                      </span>
                    </div>
                    <span className="font-code-telemetry text-[9px] text-[#8e9193] group-hover:text-white underline shrink-0">
                      VISIT SOURCE ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Apply to dashboard button */}
          {onApplyToDashboard && groundedData && (
            <button
              onClick={() => onApplyToDashboard(groundedData)}
              className="w-full mt-1 py-1.5 bg-[#292a2c] hover:bg-[#343537] text-white font-geist text-[10px] uppercase font-semibold tracking-wider border border-[#444749] transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">sync</span>
              <span>SYNCHRONIZE DASHBOARD WITH GROUNDED OBSERVATIONS</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
