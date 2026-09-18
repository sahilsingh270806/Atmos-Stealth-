import React, { useState } from 'react';
import { HydrometeorDay } from '../types';

interface HydrometeorChartProps {
  data: HydrometeorDay[];
}

export const HydrometeorChart: React.FC<HydrometeorChartProps> = ({ data }) => {
  const [activeDay, setActiveDay] = useState<HydrometeorDay | null>(null);

  const maxVal = 55; // scaling headroom

  return (
    <section className="flex flex-col mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#1f2022] border-b border-[#2b3038]/50">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-white text-[16px]">rainy</span>
          <span className="font-geist text-[12px] uppercase font-semibold text-[#e3e2e5] tracking-wider">
            HYDROMETEOR ACCUMULATION // 7-DAY
          </span>
        </div>
        <span className="font-code-telemetry text-[11px] text-[#e3e2e5] font-semibold">
          TOTAL: 94.2 mm
        </span>
      </div>

      <div className="p-2 flex flex-col gap-1.5">
        {/* Histogram Bars */}
        <div className="bg-[#0d0e10] p-2 border border-[#2b3038]/30">
          <div className="flex items-end justify-between h-28 gap-2 pt-2">
            {data.map((item, idx) => {
              const heightPercent = Math.max(3, Math.round((item.value / maxVal) * 100));
              const isPeak = item.isPeak;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveDay(item)}
                  onMouseEnter={() => setActiveDay(item)}
                  className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
                >
                  <span
                    className={`font-code-telemetry text-[10px] ${
                      isPeak ? 'text-white font-bold' : 'text-[#c4c7c9]'
                    }`}
                  >
                    {item.value.toFixed(1)}
                  </span>
                  <div
                    className={`w-full transition-all duration-150 ${
                      isPeak
                        ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.2)]'
                        : 'bg-[#343537] group-hover:bg-[#404752]'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span
                    className={`font-geist text-[10px] font-medium uppercase ${
                      isPeak ? 'text-white font-bold' : 'text-[#8e9193]'
                    }`}
                  >
                    {item.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active bar tooltip indicator if inspected */}
          {activeDay && (
            <div className="mt-2 pt-1 border-t border-[#2b3038]/40 flex items-center justify-between text-[10px] font-code-telemetry">
              <span className="text-[#8e9193]">SELECTED: {activeDay.fullDate}</span>
              <span className="text-white font-semibold">
                {activeDay.value} mm {activeDay.isPeak ? '(MAX INFLUX BURST)' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Peak Callout Card */}
        <div className="flex items-center justify-between p-1.5 bg-[#1f2022] border border-[#2b3038]/40">
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
              PEAK INTENSITY FLUX
            </span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold leading-tight">
              48.5 mm // 22.4 mm/h MAX RATE
            </span>
          </div>
          <span className="font-geist text-[9px] uppercase px-1.5 py-0.5 bg-[#292a2c] text-[#e3e2e5] font-semibold border border-[#444749]/40 tracking-wider">
            19 OCT CONVECTIVE
          </span>
        </div>

        {/* Relative Humidity Range Strip */}
        <div className="flex flex-col p-1.5 bg-[#0d0e10] gap-1 border border-[#2b3038]/30">
          <div className="flex justify-between items-center">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider font-semibold">
              RELATIVE HUMIDITY SPAN
            </span>
            <span className="font-code-telemetry text-[11px] text-[#e3e2e5] font-medium">
              58% — 92% (MEAN 76%)
            </span>
          </div>

          {/* Gauge Bar */}
          <div className="w-full h-2 bg-[#1f2022] relative overflow-hidden">
            <div
              className="absolute top-0 bottom-0 bg-white opacity-90 shadow-sm"
              style={{ left: '58%', width: '34%' }}
            />
          </div>

          <div className="flex justify-between font-code-telemetry text-[9px] text-[#8e9193]">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
