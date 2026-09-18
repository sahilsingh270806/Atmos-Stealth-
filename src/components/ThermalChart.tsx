import React, { useState, useRef } from 'react';
import { DayThermalPoint } from '../types';

interface ThermalChartProps {
  data: DayThermalPoint[];
  temperatureUnit?: 'C' | 'F';
  stationName?: string;
}

interface PointSample {
  x: number;
  label: string;
  date: string;
  temp: number;
  dew: number;
  yTemp: number;
  yDew: number;
  rh: number;
  isPeak?: boolean;
  isTrough?: boolean;
}

export const ThermalChart: React.FC<ThermalChartProps> = ({
  data,
  temperatureUnit = 'C',
  stationName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePoint, setActivePoint] = useState<PointSample | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  const convertTemp = (celsius: number) => {
    if (temperatureUnit === 'F') {
      return ((celsius * 9) / 5 + 32).toFixed(1) + '°F';
    }
    return celsius.toFixed(1) + '°C';
  };

  // Dynamically compute point samples from incoming station data
  const rawData = data && data.length > 0 ? data : [
    { day: '15 MON', date: '15 OCT', temp: 29.4, dewPoint: 24.2 },
    { day: '16 TUE', date: '16 OCT', temp: 27.6, dewPoint: 23.5 },
    { day: '17 WED', date: '17 OCT', temp: 24.0, dewPoint: 22.8, isTrough: true },
    { day: '18 THU', date: '18 OCT', temp: 33.1, dewPoint: 25.1, isPeak: true },
    { day: '19 FRI', date: '19 OCT', temp: 26.8, dewPoint: 24.8 },
    { day: '20 SAT', date: '20 OCT', temp: 28.9, dewPoint: 23.2 },
    { day: '21 SUN', date: '21 OCT', temp: 27.8, dewPoint: 23.4 },
  ];

  const temps = rawData.map((d) => d.temp);
  const dews = rawData.map((d) => d.dewPoint);
  const minVal = Math.min(...temps, ...dews) - 2;
  const maxVal = Math.max(...temps, ...dews) + 2;
  const range = Math.max(1, maxVal - minVal);

  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const meanTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  const meanDew = dews.reduce((a, b) => a + b, 0) / dews.length;

  const samples: PointSample[] = rawData.map((d, i) => {
    const x = Math.round(24 + (i / (rawData.length - 1 || 1)) * 292);
    const yTemp = Math.round(115 - ((d.temp - minVal) / range) * 88);
    const yDew = Math.round(115 - ((d.dewPoint - minVal) / range) * 88);
    // Approximate relative humidity from temp and dew point difference
    const rh = Math.max(15, Math.min(100, Math.round(100 - 5 * (d.temp - d.dewPoint))));

    return {
      x,
      label: d.day,
      date: `${d.date} 12:00 UTC`,
      temp: d.temp,
      dew: d.dewPoint,
      yTemp,
      yDew,
      rh,
      isPeak: d.temp === maxTemp,
      isTrough: d.temp === minTemp,
    };
  });

  const peakSample = samples.find((s) => s.isPeak) || samples[0];

  const tempPath = samples.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x},${s.yTemp}`).join(' ');
  const dewPath = samples.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x},${s.yDew}`).join(' ');
  const tempArea = `${tempPath} L ${samples[samples.length - 1].x},130 L ${samples[0].x},130 Z`;
  const dewArea = `${dewPath} L ${samples[samples.length - 1].x},130 L ${samples[0].x},130 Z`;

  const handlePointerInteraction = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const clampedY = Math.max(0, Math.min(rect.height, clientY - rect.top));

    // Convert to SVG 340x140 space
    const svgX = (clampedX / rect.width) * 340;
    const svgY = (clampedY / rect.height) * 140;

    setCrosshairPos({ x: svgX, y: svgY });

    // Find closest sample point
    let closest = samples[0];
    let minDiff = Math.abs(svgX - samples[0].x);

    for (let i = 1; i < samples.length; i++) {
      const diff = Math.abs(svgX - samples[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = samples[i];
      }
    }

    setActivePoint(closest);
  };

  const handlePointerLeave = () => {
    setActivePoint(null);
    setCrosshairPos(null);
  };

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
        <div className="flex items-center gap-2">
          {activePoint && (
            <span className="font-code-telemetry text-[10px] text-white bg-[#292a2c] px-1.5 py-0.5 border border-white/40">
              CROSSHAIR: {convertTemp(activePoint.temp)}
            </span>
          )}
          <span className="font-code-telemetry text-[11px] text-[#c4c7c9]">
            {stationName ? `${stationName.toUpperCase()} // ` : ''}°{temperatureUnit}
          </span>
        </div>
      </div>

      <div className="p-2 flex flex-col">
        {/* Readout Grid */}
        <div className="grid grid-cols-4 gap-1 mb-2 bg-[#0d0e10] p-1.5 border border-[#2b3038]/30">
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              PEAK (MAX)
            </span>
            <span className="font-code-telemetry text-[15px] text-white font-semibold leading-tight mt-0.5">
              {convertTemp(maxTemp)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              TROUGH (MIN)
            </span>
            <span className="font-code-telemetry text-[15px] text-[#c0c7d3] font-semibold leading-tight mt-0.5">
              {convertTemp(minTemp)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              MEAN AVG
            </span>
            <span className="font-code-telemetry text-[15px] text-[#e3e2e5] leading-tight mt-0.5">
              {convertTemp(meanTemp)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase font-semibold tracking-wider">
              DEW MEAN
            </span>
            <span className="font-code-telemetry text-[15px] text-[#8e9193] leading-tight mt-0.5">
              {convertTemp(meanDew)}
            </span>
          </div>
        </div>

        {/* Graph Container */}
        <div
          ref={containerRef}
          className="relative w-full h-48 bg-[#0d0e10] p-1 overflow-hidden border border-[#2b3038]/40 select-none touch-none"
          onMouseMove={(e) => handlePointerInteraction(e.clientX, e.clientY)}
          onMouseLeave={handlePointerLeave}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handlePointerInteraction(touch.clientX, touch.clientY);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handlePointerInteraction(touch.clientX, touch.clientY);
          }}
          onTouchEnd={handlePointerLeave}
        >
          <svg
            className="w-full h-full cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 340 140"
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
            <line opacity="0.35" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="20" y2="20" />
            <line opacity="0.35" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="50" y2="50" />
            <line opacity="0.35" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="80" y2="80" />
            <line opacity="0.35" stroke="#444749" strokeDasharray="2 3" strokeWidth="0.75" x1="0" x2="340" y1="110" y2="110" />

            {/* Day divider columns */}
            {samples.map((s, idx) => (
              <line key={idx} opacity="0.25" stroke="#444749" strokeWidth="0.5" x1={s.x} x2={s.x} y1="0" y2="130" />
            ))}

            {/* Dew Point Shaded Area & Line */}
            <path d={dewArea} fill="url(#dew-point-grad)" />
            <path d={dewPath} fill="none" stroke="#8e9193" strokeDasharray="3 2" strokeWidth="1.2" />

            {/* Ambient Temperature Shaded Area & Line */}
            <path d={tempArea} fill="url(#titanium-temp-grad)" />
            <path d={tempPath} fill="none" stroke="#ffffff" strokeWidth="1.75" />

            {/* Dynamic Highlight Nodes */}
            {samples.map((s, idx) => (
              <circle
                key={idx}
                cx={s.x}
                cy={s.yTemp}
                fill={s.isPeak ? '#ffffff' : s.isTrough ? '#c4c7c9' : '#8e9193'}
                r={s.isPeak ? 3.5 : 2}
              />
            ))}

            {/* Precision Crosshairs on Hover / Touch */}
            {activePoint && (
              <g className="transition-all duration-75">
                {/* Vertical Crosshair Line */}
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1="0"
                  y2="130"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.9"
                />

                {/* Horizontal Crosshair Line for Ambient Temp */}
                <line
                  x1="0"
                  x2="340"
                  y1={activePoint.yTemp}
                  y2={activePoint.yTemp}
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeDasharray="2 3"
                  opacity="0.7"
                />

                {/* Horizontal Crosshair Line for Dew Point */}
                <line
                  x1="0"
                  x2="340"
                  y1={activePoint.yDew}
                  y2={activePoint.yDew}
                  stroke="#8e9193"
                  strokeWidth="0.75"
                  strokeDasharray="1 2"
                  opacity="0.5"
                />

                {/* Crosshair Intersecting Node Markers */}
                <circle cx={activePoint.x} cy={activePoint.yTemp} r="4.5" fill="#ffffff" />
                <circle cx={activePoint.x} cy={activePoint.yTemp} r="8" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5" />

                <circle cx={activePoint.x} cy={activePoint.yDew} r="3.5" fill="#8e9193" />
                <circle cx={activePoint.x} cy={activePoint.yDew} r="6" fill="none" stroke="#8e9193" strokeWidth="0.75" opacity="0.4" />
              </g>
            )}
          </svg>

          {/* Peak Static Indicator Flag */}
          <div
            className="absolute top-2 bg-[#1f2022] border border-[#444749] px-1.5 py-0.5 flex items-center gap-1 shadow-md pointer-events-none"
            style={{ left: `${Math.max(10, Math.min(75, (peakSample.x / 340) * 100))}%` }}
          >
            <span className="w-1.5 h-1.5 bg-white"></span>
            <span className="font-geist text-[10px] text-white font-semibold tracking-tight">
              PEAK {convertTemp(maxTemp)}
            </span>
          </div>

          {/* Interactive Floating Precision Tooltip */}
          {activePoint && (
            <div
              className="absolute pointer-events-none z-30 transition-transform duration-75 ease-out"
              style={{
                left: `${Math.max(10, Math.min(85, (activePoint.x / 340) * 100))}%`,
                top: activePoint.yTemp > 70 ? '12px' : '68px',
                transform: activePoint.x > 220 ? 'translateX(-95%)' : 'translateX(-5%)',
              }}
            >
              <div className="bg-[#18191c]/95 backdrop-blur-md border border-white/80 p-2 shadow-2xl flex flex-col gap-1 min-w-[145px]">
                {/* Header tag */}
                <div className="flex items-center justify-between border-b border-[#2b3038] pb-1">
                  <span className="font-geist text-[10px] uppercase font-bold text-white tracking-wider">
                    {activePoint.label}
                  </span>
                  <span className="font-code-telemetry text-[9px] text-[#8e9193]">
                    {activePoint.date.split(' ')[0]}
                  </span>
                </div>

                {/* Readout stats */}
                <div className="flex items-center justify-between">
                  <span className="font-geist text-[10px] text-[#8e9193] uppercase">AMBIENT</span>
                  <span className="font-code-telemetry text-[13px] text-white font-bold">
                    {convertTemp(activePoint.temp)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-geist text-[10px] text-[#8e9193] uppercase">DEW POINT</span>
                  <span className="font-code-telemetry text-[11px] text-[#c4c7c9] font-medium">
                    {convertTemp(activePoint.dew)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-0.5 border-t border-[#2b3038]/50">
                  <span className="font-geist text-[9px] text-[#8e9193] uppercase">RELATIVE HUMIDITY</span>
                  <span className="font-code-telemetry text-[10px] text-white font-semibold">
                    {activePoint.rh}% RH
                  </span>
                </div>

                {activePoint.isPeak && (
                  <div className="mt-0.5 px-1 py-0.5 bg-white text-black font-geist text-[8px] uppercase font-bold text-center tracking-widest">
                    MAX RECORDED PEAK
                  </div>
                )}
                {activePoint.isTrough && (
                  <div className="mt-0.5 px-1 py-0.5 bg-[#292a2c] text-[#e3e2e5] border border-[#444749] font-geist text-[8px] uppercase font-bold text-center tracking-widest">
                    MIN CONVECTIVE TROUGH
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* X-Axis Labels */}
        <div className="grid grid-cols-7 text-center pt-1.5 font-code-telemetry text-[10px] text-[#8e9193]">
          {samples.map((s, idx) => {
            const isHovered = activePoint?.label === s.label;
            return (
              <span
                key={s.label}
                className={`${
                  isHovered
                    ? 'text-white font-bold bg-[#292a2c] py-0.5 border-b border-white'
                    : s.isPeak
                    ? 'text-white font-semibold'
                    : ''
                }`}
              >
                {s.label}
              </span>
            );
          })}
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
