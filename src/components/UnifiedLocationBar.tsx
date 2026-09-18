import React, { useState } from 'react';

interface UnifiedLocationBarProps {
  currentLocationName: string;
  isGpsActive: boolean;
  isLocating: boolean;
  onSearch: (query: string) => void;
  onRequestGps: () => void;
  permissionError?: string | null;
  onDismissPermissionPrompt?: () => void;
  isLoadingWeather?: boolean;
}

const POPULAR_REGIONS = [
  'New Delhi',
  'Mumbai',
  'Bengaluru',
  'Kolkata',
  'London',
  'Tokyo',
  'New York',
  'Haldia Port',
  'Singapore',
  'Dubai',
];

export const UnifiedLocationBar: React.FC<UnifiedLocationBarProps> = ({
  currentLocationName,
  isGpsActive,
  isLocating,
  onSearch,
  onRequestGps,
  permissionError,
  isLoadingWeather = false,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [promptDismissed, setPromptDismissed] = useState(() => {
    try {
      return localStorage.getItem('atmos_gps_prompt_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissPrompt = () => {
    setPromptDismissed(true);
    try {
      localStorage.setItem('atmos_gps_prompt_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <section className="mx-4 mt-3 flex flex-col gap-2">
      {/* Primary Unified Commercial Search Console */}
      <div className="bg-[#1b1c1e] border border-[#2b3038] shadow-sm">
        <form onSubmit={handleSubmit} className="p-2 flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-[#8e9193] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search station, city, or coordinates (e.g. New Delhi, Tokyo, Haldia Port)..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#0d0e10] border border-[#2b3038] text-[12px] font-code-telemetry text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#ffffff] transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 text-[#8e9193] hover:text-white cursor-pointer"
                title="Clear input"
              >
                <span className="material-symbols-outlined text-[15px]">close</span>
              </button>
            )}
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            disabled={!searchInput.trim() || isLoadingWeather}
            className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black font-geist text-[11px] uppercase font-bold tracking-wider cursor-pointer disabled:opacity-40 disabled:hover:bg-white transition-colors whitespace-nowrap"
          >
            {isLoadingWeather ? 'Querying...' : 'Search'}
          </button>

          {/* Device GPS Locator Button */}
          <button
            type="button"
            onClick={onRequestGps}
            disabled={isLocating}
            title={isGpsActive ? 'GPS position active' : 'Acquire current device location'}
            className={`px-3 py-1.5 flex items-center gap-1.5 border font-geist text-[11px] uppercase font-semibold cursor-pointer transition whitespace-nowrap ${
              isGpsActive
                ? 'bg-[#292a2d] text-white border-[#525866]'
                : 'bg-[#0d0e10] text-[#c4c7c9] border-[#2b3038] hover:text-white hover:border-[#444749]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isLocating ? 'animate-spin' : isGpsActive ? 'text-emerald-400' : 'text-[#8e9193]'
              }`}
            >
              {isLocating ? 'sync' : isGpsActive ? 'my_location' : 'near_me'}
            </span>
            <span className="hidden sm:inline">
              {isLocating ? 'Locating...' : isGpsActive ? 'GPS Active' : 'My Location'}
            </span>
          </button>
        </form>

        {/* Popular Telemetry Regions Bar */}
        <div className="px-2 pb-2 pt-1 border-t border-[#2b3038]/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="font-geist text-[9px] uppercase tracking-wider text-[#8e9193] whitespace-nowrap flex items-center gap-1">
            <span className="material-symbols-outlined text-[12px]">explore</span>
            REGIONS:
          </span>
          {POPULAR_REGIONS.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => onSearch(city)}
              className="px-2 py-0.5 bg-[#0d0e10] hover:bg-[#25282c] border border-[#2b3038] hover:border-[#525866] text-[10px] font-code-telemetry text-[#c4c7c9] hover:text-white cursor-pointer transition whitespace-nowrap"
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* GPS Active Confirmation Strip (Stealth Theme) */}
      {isGpsActive && (
        <div className="px-3 py-1.5 bg-[#17181a] border border-[#2b3038] flex items-center justify-between text-[11px] animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
            <span className="font-code-telemetry text-[11px] text-[#c4c7c9]">
              GEOLOCATION LOCK: <strong className="text-white font-medium">{currentLocationName}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={onRequestGps}
            disabled={isLocating}
            className="font-code-telemetry text-[10px] text-[#8e9193] hover:text-white flex items-center gap-1 cursor-pointer transition"
          >
            <span className={`material-symbols-outlined text-[13px] ${isLocating ? 'animate-spin' : ''}`}>
              refresh
            </span>
            <span>REFRESH GPS</span>
          </button>
        </div>
      )}

      {/* Location Permission Prompt (Commercial Atmos Stealth) */}
      {!isGpsActive && !promptDismissed && (
        <div className="p-3 bg-[#1b1c1e] border border-[#2b3038] shadow-sm relative animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 bg-[#0d0e10] border border-[#2b3038] flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                <span className="material-symbols-outlined text-[16px]">
                  {isLocating ? 'radar' : 'location_searching'}
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-geist text-[12px] uppercase font-bold text-white tracking-wider">
                    LOCAL METEOROLOGICAL TELEMETRY
                  </span>
                  <span className="font-code-telemetry text-[9px] uppercase px-1 py-0.2 bg-[#0d0e10] text-[#8e9193] border border-[#2b3038]">
                    GPS SENSOR
                  </span>
                </div>

                <p className="font-geist text-[11px] text-[#9ca3af] mt-1 leading-relaxed max-w-xl">
                  Allow device location access to automatically receive real-time surface observations, local barometric shifts, and 24-hour forecasts for your precise coordinates.
                </p>

                {permissionError && (
                  <p className="font-code-telemetry text-[11px] text-amber-300 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    {permissionError}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={onRequestGps}
                    disabled={isLocating}
                    className="px-3 py-1 bg-white hover:bg-neutral-200 text-black font-geist text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                  >
                    <span className={`material-symbols-outlined text-[14px] ${isLocating ? 'animate-spin' : ''}`}>
                      {isLocating ? 'sync' : 'near_me'}
                    </span>
                    <span>{isLocating ? 'ACQUIRING FIX...' : 'ENABLE DEVICE LOCATION'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDismissPrompt}
                    className="px-2.5 py-1 text-[#8e9193] hover:text-white font-geist text-[10px] uppercase font-semibold cursor-pointer transition"
                  >
                    DISMISS
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismissPrompt}
              className="text-[#8e9193] hover:text-white p-0.5 cursor-pointer transition"
              title="Close notification"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
