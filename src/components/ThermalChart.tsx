import React, { useState } from 'react';
import { DayThermalPoint } from '../types';

interface ThermalChartProps {
  data: DayThermalPoint[];
  temperatureUnit?: 'C' | 'F';
}

export const ThermalChart: React.FC<ThermalChartProps> = ({
  data,
  temperatureUnit = 'C',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const convertTemp = (celsius: number) => {
    if (temperatureUnit === 'F') {
      return ((celsius * 9) / 5 + 32).toFixed(1) + '°F';
    }
    return celsius.toFixed(1) + '°C';
  };

  const dayColumns = [
    { x: 24, label: '15 MON', date: '15 OCT', temp: 29.4, dew: 24.2 },
    { x: 72, label: '16 TUE', date: '16 OCT', temp: 27.6, dew: 23.5 },
    { x: 121, label: '17 WED', date: '17 OCT', temp: 24.0, dew: 22.8, isTrough: true },
    { x: 170, label: '18 THU', date: '18 OCT', temp: 33.1, dew: 25.1, isPeak: true },
    { x: 219, label: '19 FRI', date: '19 OCT', temp: 26.8, dew: 24.8 },
    { x: 267, label: '20 SAT', date: '20 OCT', temp: 28.9, dew: 23.2 },
    { x: 316, label: '21 SUN', date: '21 OCT', temp: 27.8, dew: 23.4 },
  ];

  return (
    <section className="flex flex-col mx-4 mt-3 bg-[#1b1c1e] border border-[#2b3038]/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#1f2022] border-b border-[#2b3038]/50">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-white text-[16px]">thermostat</span>
          <span className="font-geist text-[12px] uppercase font-semibold text-[#e3e2e5] tracking-wider">
            THERMAL OSCILLATION & DEW POINT
          </span>
        </div>
        <span className="font-code-telemetry text-[11px] text-[#c4c7c9]">
          CHAN_01 // °{temperatureUnit}
        </span>
      </div>

      <div className="p-2 flex flex-col">
        {/* Readout Grid */}
        <div className="grid grid-cols-4 gap-1 mb-2 bg-[#0d0e10] p-1.5 border border-[#2b3038]/30">
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              PEAK (MAX)
            </span>
            <span className="font-code-telemetry text-[15px] text-white font-semibold leading-tight mt-0.5">
              {convertTemp(33.1)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              TROUGH (MIN)
            </span>
            <span className="font-code-telemetry text-[15px] text-[#c0c7d3] font-semibold leading-tight mt-0.5">
              {convertTemp(24.0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              MEAN AVG
            </span>
            <span className="font-code-telemetry text-[15px] text-[#e3e2e5] leading-tight mt-0.5">
              {convertTemp(28.2)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              DEW MEAN
            </span>
            <span className="font-code-telemetry text-[15px] text-[#8e9193] leading-tight mt-0.5">
              {convertTemp(23.8)}
            </span>
          </div>
        </div>

        {/* Graph Container */}
        <div 
          className="relative w-full h-44 bg-[#0d0e10] p-1 overflow-hidden border border-[#2b3038]/40 select-none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <svg
            className="w-full h-full cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 340 140"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((e.clientX - rect.left) / rect.width) * 340;
              const index = Math.min(6, Math.max(0, Math.floor(relX / (340 / 7))));
              setHoverIndex(index);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              const rect = e.currentTarget.getBoundingClientRect();
              const relX = ((touch.clientX - rect.left) / rect.width) * 340;
              const index = Math.min(6, Math.max(0, Math.floor(relX / (340 / 7))));
              setHoverIndex(index);
            }}
          >
            <defs>
              <linearGradient id="titanium-temp-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="dew-point-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Hairline Grid Subdivisions */}
            <line opacity="0.4" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="20" y2="20" />
            <line opacity="0.4" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="50" y2="50" />
            <line opacity="0.4" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="80" y2="80" />
            <line opacity="0.4" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="110" y2="110" />

            {/* Day divider columns */}
            <line opacity="0.3" stroke="#444749" strokeWidth="0.5" x1="48" x2="48" y1="0" y2="125" />
            <line opacity="0.3" stroke="#444749" strokeWidth="0.5" x1="97" x2="97" y1="0" y2="125" />
            <line opacity="0.3" stroke="#444749" strokeWidth="0.5" x1="146" x2="146" y1="0" y2="125" />
            <line opacity="0.3" stroke="#444749" strokeWidth="0.5" x1="194" x2="194" y1="0" y2="125" />
            <line opacity="0.3" stroke="#444749" strokeWidth="0.5" x1="243" x2="243" y1="0" y2="125" />
            <line opacity="0.3" stroke="#444749" strokeWidth="0.5" x1="291" x2="291" y1="0" y2="125" />

            {/* Dew Point Shaded Area & Line */}
            <path
              d="M 0,86 Q 24,78 48,82 T 97,94 T 146,80 T 194,84 T 243,90 T 291,78 T 340,84 L 340,125 L 0,125 Z"
              fill="url(#dew-point-grad)"
            />
            <path
              d="M 0,86 Q 24,78 48,82 T 97,94 T 146,80 T 194,84 T 243,90 T 291,78 T 340,84"
              fill="none"
              stroke="#8e9193"
              strokeDasharray="3 2"
              strokeWidth="1.2"
            />

            {/* Ambient Temperature Shaded Area & Line */}
            <path
              d="M 0,64 Q 24,32 48,58 T 97,72 T 146,26 T 194,62 T 243,44 T 291,38 T 340,68 L 340,125 L 0,125 Z"
              fill="url(#titanium-temp-grad)"
            />
            <path
              d="M 0,64 Q 24,32 48,58 T 97,72 T 146,26 T 194,62 T 243,44 T 291,38 T 340,68"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.75"
            />

            {/* Highlight Nodes */}
            {/* Peak Node: Day 4 Max 33.1C */}
            <circle cx="146" cy="26" fill="#ffffff" r="3" />
            <circle cx="146" cy="26" fill="none" opacity="0.6" r="6" stroke="#ffffff" strokeWidth="0.75" />

            {/* Trough Node: Day 2 Min 24.0C */}
            <circle cx="97" cy="72" fill="#c4c7c9" r="2.5" />

            {/* Recent Node */}
            <circle cx="340" cy="68" fill="#ffffff" r="2.5" />

            {/* Hover Crosshair Guide */}
            {hoverIndex !== null && (
              <line
                x1={dayColumns[hoverIndex].x}
                x2={dayColumns[hoverIndex].x}
                y1="0"
                y2="125"
                stroke="#ffffff"
                strokeWidth="1"
                strokeDasharray="1 2"
              />
            )}
          </svg>

          {/* Peak Indicator Flag (shown in image) */}
          <div className="absolute top-2 left-32 bg-[#1f2022] border border-[#444749] px-1.5 py-0.5 flex items-center gap-1 shadow-md pointer-events-none">
            <span className="w-1.5 h-1.5 bg-white"></span>
            <span className="font-geist text-[10px] text-white font-semibold tracking-tight">
              PEAK {convertTemp(33.1)}
            </span>
          </div>

          {/* Interactive Inspection Popover */}
          {hoverIndex !== null && (
            <div className="absolute bottom-2 left-2 bg-[#1f2022] border border-white px-2 py-1 flex items-center gap-2 shadow-xl z-20">
              <span className="font-geist text-[10px] uppercase text-[#8e9193] font-semibold">
                {dayColumns[hoverIndex].label}:
              </span>
              <span className="font-code-telemetry text-[11px] text-white font-semibold">
                TEMP {convertTemp(dayColumns[hoverIndex].temp)}
              </span>
              <span className="font-code-telemetry text-[11px] text-[#8e9193]">
                DEW {convertTemp(dayColumns[hoverIndex].dew)}
              </span>
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="grid grid-cols-7 text-center pt-1.5 font-code-telemetry text-[10px] text-[#8e9193]">
          <span className={hoverIndex === 0 ? 'text-white font-semibold' : ''}>15 MON</span>
          <span className={hoverIndex === 1 ? 'text-white font-semibold' : ''}>16 TUE</span>
          <span className={hoverIndex === 2 ? 'text-white font-semibold' : ''}>17 WED</span>
          <span className={`text-white font-semibold ${hoverIndex === 3 ? 'underline' : ''}`}>18 THU</span>
          <span className={hoverIndex === 4 ? 'text-white font-semibold' : ''}>19 FRI</span>
          <span className={hoverIndex === 5 ? 'text-white font-semibold' : ''}>20 SAT</span>
          <span className={hoverIndex === 6 ? 'text-white font-semibold' : ''}>21 SUN</span>
        </div>

        {/* Anomaly Alert Ribbon */}
        <div className="mt-2 p-1.5 bg-[#1f2022] border border-[#2b3038] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[14px]">warning_amber</span>
            <span className="font-geist text-[10px] uppercase tracking-wider text-white font-medium">
              +1.8°C DEV FROM 30-YR CLIMATIC BASELINE
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#8e9193] font-semibold">
            SIGMA +1.4
          </span>
        </div>
      </div>
    </section>
  );
};
