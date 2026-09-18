import React, { useState } from 'react';
import { StationInfo } from '../types';
import { HOURLY_FORECAST_DATA, DAILY_FORECAST_DATA } from '../data/mockData';

interface ForecastViewProps {
  station: StationInfo;
  temperatureUnit?: 'C' | 'F';
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  station,
  temperatureUnit = 'C',
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const formatTemp = (celsius: number) => {
    if (temperatureUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32) + '°F';
    }
    return Math.round(celsius) + '°C';
  };

  const formatVal = (celsius: number) => {
    if (temperatureUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  return (
    <div className="flex flex-col w-full pb-6">
      {/* Synoptic Header Card */}
      <section className="mx-4 mt-3 bg-[#1b1c1e] border border-[#2b3038]/60 p-3">
        <div className="flex items-center justify-between border-b border-[#2b3038]/50 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white animate-pulse" />
            <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-wider">
              SYNOPTIC OUTLOOK // {station.name.toUpperCase()}
            </span>
          </div>
          <span className="font-code-telemetry text-[11px] text-[#8e9193]">
            VALID THRU +72H UTC
          </span>
        </div>

        <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-geist text-[10px] uppercase text-[#8e9193] tracking-wider">
              ACTIVE SYNOPTIC REGIME
            </span>
            <span className="font-geist text-[9px] uppercase px-1.5 py-0.5 bg-[#292a2c] text-white font-semibold">
              TROUGH PASSAGE
            </span>
          </div>
          <p className="font-geist text-[13px] text-white font-medium leading-snug">
            Low-pressure monsoon depression propagating northward across Northern Bay of Bengal. Convective bursts expected with localized squalls up to 34 KT.
          </p>
          <div className="flex items-center gap-3 mt-1 text-[10px] font-code-telemetry text-[#8e9193]">
            <span>COORDS: {station.coordinates}</span>
            <span>ELEV: {station.elevation}</span>
          </div>
        </div>
      </section>

      {/* Atmospheric Stability Indices Matrix */}
      <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/60 p-2">
        <div className="flex items-center justify-between p-1.5 bg-[#1f2022] border-b border-[#2b3038]/40 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">equalizer</span>
            <span className="font-geist text-[11px] uppercase font-semibold text-white tracking-wider">
              ATMOSPHERIC & MARITIME INDICES
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#8e9193]">SOUNDING MODEL</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          <div className="p-1.5 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">CAPE INDEX</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              1,840 J/kg
            </span>
            <span className="font-geist text-[9px] text-white/80 mt-0.5 font-medium">
              [HIGH INSTABILITY]
            </span>
          </div>

          <div className="p-1.5 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">LIFTED INDEX</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              -4.2 LI
            </span>
            <span className="font-geist text-[9px] text-white/80 mt-0.5 font-medium">
              [SEVERE CONVECTION]
            </span>
          </div>

          <div className="p-1.5 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">SEA SURFACE TEMP</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              28.6°C
            </span>
            <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">
              ANOMALY +0.8°C
            </span>
          </div>

          <div className="p-1.5 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">WAVE / SWELL</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              2.4m ROUGH
            </span>
            <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">
              PERIOD 8.2s SSE
            </span>
          </div>

          <div className="p-1.5 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">TIDAL SURGE</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              +0.42m NEAP
            </span>
            <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">
              NEXT HIGH 18:40 UTC
            </span>
          </div>

          <div className="p-1.5 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">K-INDEX</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              34 THUNDER
            </span>
            <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">
              80% PROBABILITY
            </span>
          </div>
        </div>
      </section>

      {/* Next 24-Hour Stepped Hourly Breakdown */}
      <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/60 p-2">
        <div className="flex items-center justify-between p-1.5 bg-[#1f2022] border-b border-[#2b3038]/40 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">schedule</span>
            <span className="font-geist text-[11px] uppercase font-semibold text-white tracking-wider">
              24-HOUR STEPPED HOURLY TELEMETRY
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#8e9193]">3-HR INTERVALS</span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar">
          {HOURLY_FORECAST_DATA.map((hr, index) => {
            const isSelected = selectedHour === index;
            return (
              <div
                key={hr.time}
                onClick={() => setSelectedHour(isSelected ? null : index)}
                className={`flex-shrink-0 w-28 p-2 bg-[#0d0e10] border transition-all cursor-pointer flex flex-col items-center text-center ${
                  isSelected ? 'border-white bg-[#1f2022]' : 'border-[#2b3038]/40 hover:border-[#525866]'
                }`}
              >
                <span className="font-code-telemetry text-[10px] text-[#8e9193] uppercase font-medium">
                  {hr.time}
                </span>
                <span className="material-symbols-outlined text-white text-[20px] my-1">
                  {hr.icon}
                </span>
                <span className="font-code-telemetry text-[14px] text-white font-semibold">
                  {formatTemp(hr.temp)}
                </span>
                <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">
                  DEW {formatVal(hr.dewPoint)}°
                </span>

                {/* PoP bar */}
                <div className="w-full mt-2 pt-1 border-t border-[#2b3038]/40 flex flex-col gap-0.5">
                  <div className="flex justify-between text-[8px] font-code-telemetry text-[#8e9193]">
                    <span>POP</span>
                    <span className="text-white font-semibold">{hr.pop}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1f2022]">
                    <div className="h-full bg-white" style={{ width: `${hr.pop}%` }} />
                  </div>
                </div>

                <div className="mt-1 text-[8px] font-code-telemetry text-[#c4c7c9] truncate w-full">
                  {hr.windDir}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7-Day Synoptic Outlook Table */}
      <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/60 p-2">
        <div className="flex items-center justify-between p-1.5 bg-[#1f2022] border-b border-[#2b3038]/40 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">calendar_view_week</span>
            <span className="font-geist text-[11px] uppercase font-semibold text-white tracking-wider">
              7-DAY SYNOPTIC OUTLOOK MATRIX
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#8e9193]">ENSEMBLE RUN</span>
        </div>

        <div className="flex flex-col divide-y divide-[#2b3038]/40 bg-[#0d0e10] border border-[#2b3038]/30">
          {DAILY_FORECAST_DATA.map((d) => (
            <div key={d.day} className="p-2 flex items-center justify-between hover:bg-[#151619] transition-colors">
              {/* Day and icon */}
              <div className="flex items-center gap-2 w-28">
                <span className="material-symbols-outlined text-white text-[18px]">
                  {d.icon}
                </span>
                <div className="flex flex-col">
                  <span className="font-geist text-[11px] uppercase font-semibold text-white leading-tight">
                    {d.day}
                  </span>
                  <span className="font-code-telemetry text-[9px] text-[#8e9193]">
                    {d.date}
                  </span>
                </div>
              </div>

              {/* Condition & Wind */}
              <div className="hidden sm:flex flex-col flex-1 px-2">
                <span className="font-geist text-[11px] text-[#e3e2e5] font-medium leading-tight">
                  {d.condition}
                </span>
                <span className="font-code-telemetry text-[9px] text-[#8e9193]">
                  {d.wind} • {d.waveHeight}
                </span>
              </div>

              {/* Precip & Probability */}
              <div className="flex flex-col items-end pr-3">
                <span className="font-code-telemetry text-[11px] text-white font-medium">
                  {d.precipMm > 0 ? `${d.precipMm} mm` : '0.0 mm'}
                </span>
                <span className="font-code-telemetry text-[9px] text-[#8e9193]">
                  PoP {d.pop}%
                </span>
              </div>

              {/* Temp Range Bar */}
              <div className="flex items-center gap-1.5 font-code-telemetry text-[11px] w-24 justify-end">
                <span className="text-[#8e9193]">{formatVal(d.low)}°</span>
                <div className="w-10 h-1 bg-[#292a2c] relative">
                  <div
                    className="absolute top-0 bottom-0 bg-white"
                    style={{
                      left: `${((d.low - 20) / 15) * 100}%`,
                      width: `${((d.high - d.low) / 15) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-white font-semibold">{formatVal(d.high)}°</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
