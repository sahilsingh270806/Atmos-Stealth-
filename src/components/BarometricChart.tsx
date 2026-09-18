import React, { useState, useRef } from 'react';

interface BarometricChartProps {
  pressureUnit?: 'hPa' | 'inHg';
  currentPressure?: number;
  pressureTendency?: string;
  stationName?: string;
}

interface BaroSample {
  x: number;
  y: number;
  hpa: number;
  time: string;
  tendency: string;
  isMin?: boolean;
  isCurrent?: boolean;
}

export const BarometricChart: React.FC<BarometricChartProps> = ({
  pressureUnit = 'hPa',
  currentPressure = 1005.8,
  pressureTendency,
  stationName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSample, setActiveSample] = useState<BaroSample | null>(null);

  const formatPressure = (hpa: number) => {
    if (pressureUnit === 'inHg') {
      return (hpa * 0.02953).toFixed(2) + ' inHg';
    }
    return hpa.toFixed(1) + ' hPa';
  };

  const p = typeof currentPressure === 'number' && !isNaN(currentPressure) ? currentPressure : 1005.8;

  // Trajectory timeline dynamically centered on current station pressure
  const offsets = [
    { x: 0, delta: +4.2, time: '-48H 00:00 UTC', tendency: 'ANTECEDENT REGIONAL HIGH' },
    { x: 45, delta: +3.6, time: '-42H 06:00 UTC', tendency: 'GRADUAL BARIC FLUX' },
    { x: 90, delta: +2.2, time: '-36H 12:00 UTC', tendency: 'MODERATE SUBSIDENCE' },
    { x: 135, delta: +1.0, time: '-24H 00:00 UTC', tendency: 'STABLE TROPOSPHERIC CORE' },
    { x: 180, delta: -0.6, time: '-18H 06:00 UTC', tendency: 'PRE-FRONTAL DEPRESSION' },
    { x: 225, delta: -2.4, time: '-12H 12:00 UTC', tendency: 'CYCLONIC TROUGH INFLECTION', isMin: true },
    { x: 270, delta: -1.2, time: '-06H 18:00 UTC', tendency: 'SLOW RECOVERY PASSAGE' },
    { x: 310, delta: -0.4, time: '-03H 21:00 UTC', tendency: 'STABILIZING GRADIENT' },
    { x: 340, delta: 0, time: 'CURRENT 00:00 UTC', tendency: pressureTendency || 'LIVE OBSERVED SURFACE PRESSURE', isCurrent: true },
  ];

  const baroPoints: BaroSample[] = offsets.map((pt) => {
    const hpa = parseFloat((p + pt.delta).toFixed(1));
    // map between y=16 (high) and y=68 (low)
    const y = Math.max(14, Math.min(70, Math.round(48 - pt.delta * 7)));
    return {
      x: pt.x,
      y,
      hpa,
      time: pt.time,
      tendency: pt.tendency,
      isMin: pt.isMin,
      isCurrent: pt.isCurrent,
    };
  });

  const pathD = baroPoints.map((s, i) => `${i === 0 ? 'M' : 'L'} ${s.x},${s.y}`).join(' ');
  const minPoint = baroPoints.find((b) => b.isMin) || baroPoints[5];

  const handlePointerInteraction = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const svgX = (clampedX / rect.width) * 340;

    let closest = baroPoints[0];
    let minDiff = Math.abs(svgX - baroPoints[0].x);

    for (let i = 1; i < baroPoints.length; i++) {
      const diff = Math.abs(svgX - baroPoints[i].x);
      if (diff < minDiff) {
        minDiff = diff;
        closest = baroPoints[i];
      }
    }

    setActiveSample(closest);
  };

  const handlePointerLeave = () => {
    setActiveSample(null);
  };

  return (
    <section className="flex flex-col mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#1f2022] border-b border-[#2b3038]/50">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-white text-[16px]">speed</span>
          <span className="font-geist text-[12px] uppercase font-semibold text-[#e3e2e5] tracking-wider">
            BAROMETRIC TENDENCY // GRADIENT
          </span>
        </div>
        <div className="flex items-center gap-2">
          {activeSample && (
            <span className="font-code-telemetry text-[10px] text-white bg-[#292a2c] px-1.5 py-0.5 border border-white/40">
              CROSSHAIR: {formatPressure(activeSample.hpa)}
            </span>
          )}
          <span className="font-code-telemetry text-[11px] text-white font-semibold">
            {formatPressure(p)}
          </span>
        </div>
      </div>

      <div className="p-2 flex flex-col gap-1.5">
        {/* Status Pill Row */}
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1 bg-[#292a2c] px-1.5 py-0.5 border border-[#444749]/50">
            <span className="w-1.5 h-1.5 bg-white"></span>
            <span className="font-geist text-[10px] uppercase font-semibold text-white tracking-wide">
              {p < 1005 ? 'DEEP CYCLONIC TROUGH // LOW' : p < 1013 ? 'STEADY MARITIME TENDENCY' : 'HIGH BARIC RIDGE // STABLE'}
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#c4c7c9]">
            {stationName ? `${stationName.toUpperCase()} // ` : ''}3-HR DELTA: -0.8 hPa
          </span>
        </div>

        {/* SVG Barometric Curve with Precision Crosshair Tooltip */}
        <div
          ref={containerRef}
          className="w-full h-32 bg-[#0d0e10] p-1 relative border border-[#2b3038]/40 select-none touch-none"
          onMouseMove={(e) => handlePointerInteraction(e.clientX)}
          onMouseLeave={handlePointerLeave}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            handlePointerInteraction(touch.clientX);
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handlePointerInteraction(touch.clientX);
          }}
          onTouchEnd={handlePointerLeave}
        >
          <svg
            className="w-full h-full cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 340 80"
          >
            {/* Isobar Baseline */}
            <line stroke="#444749" strokeDasharray="3 3" strokeWidth="0.75" x1="0" x2="340" y1="20" y2="20" />
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" x="4" y="15" letterSpacing="0.04em">
              1013.25 hPa STD BASELINE
            </text>

            {/* Critical Pressure Line */}
            <line opacity="0.6" stroke="#444749" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="340" y1="62" y2="62" />
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" x="4" y="57" letterSpacing="0.04em">
              1004 hPa DEEP CYCLONIC THRESHOLD
            </text>

            {/* Pressure Trajectory Curve */}
            <path
              d={pathD}
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Dynamic Min Point Node */}
            <circle cx={minPoint.x} cy={minPoint.y} fill="#ffffff" r="3" />
            <circle cx={minPoint.x} cy={minPoint.y} fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.5" r="5" />

            {/* Interactive Precision Crosshairs */}
            {activeSample && (
              <g>
                {/* Vertical Crosshair Line */}
                <line
                  x1={activeSample.x}
                  x2={activeSample.x}
                  y1="0"
                  y2="80"
                  stroke="#ffffff"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.9"
                />

                {/* Horizontal Crosshair Line */}
                <line
                  x1="0"
                  x2="340"
                  y1={activeSample.y}
                  y2={activeSample.y}
                  stroke="#ffffff"
                  strokeWidth="0.75"
                  strokeDasharray="2 3"
                  opacity="0.7"
                />

                {/* Focus Target Ring */}
                <circle cx={activeSample.x} cy={activeSample.y} r="4.5" fill="#ffffff" />
                <circle
                  cx={activeSample.x}
                  cy={activeSample.y}
                  r="9"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1"
                  opacity="0.6"
                />
              </g>
            )}
          </svg>

          {/* Min Pressure Badge (static anchor) */}
          <div className="absolute bottom-1.5 right-1.5 bg-[#1f2022] border border-[#444749] px-1.5 py-0.5 pointer-events-none">
            <span className="font-code-telemetry text-[10px] text-white font-medium">
              MIN: {formatPressure(1004.2)} (19 OCT)
            </span>
          </div>

          {/* Floating Precision Tooltip */}
          {activeSample && (
            <div
              className="absolute pointer-events-none z-30 transition-transform duration-75 ease-out"
              style={{
                left: `${Math.max(8, Math.min(84, (activeSample.x / 340) * 100))}%`,
                top: activeSample.y > 45 ? '6px' : '38px',
                transform: activeSample.x > 210 ? 'translateX(-95%)' : 'translateX(-5%)',
              }}
            >
              <div className="bg-[#18191c]/95 backdrop-blur-md border border-white/80 p-2 shadow-2xl flex flex-col gap-1 min-w-[155px]">
                <div className="flex items-center justify-between border-b border-[#2b3038] pb-1">
                  <span className="font-geist text-[10px] uppercase font-bold text-white tracking-wider">
                    {activeSample.time}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-geist text-[10px] text-[#8e9193] uppercase">PRESSURE</span>
                  <span className="font-code-telemetry text-[13px] text-white font-bold">
                    {formatPressure(activeSample.hpa)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-geist text-[9px] text-[#8e9193] uppercase">BASELINE DELTA</span>
                  <span className="font-code-telemetry text-[10px] text-white font-semibold">
                    {(activeSample.hpa - 1012.0).toFixed(1)} hPa
                  </span>
                </div>

                <div className="mt-0.5 pt-1 border-t border-[#2b3038]/50">
                  <span className="block font-geist text-[8px] uppercase tracking-wider text-[#8e9193]">
                    ISOBARIC CLASSIFICATION:
                  </span>
                  <span className="font-code-telemetry text-[9px] text-white font-semibold block truncate">
                    {activeSample.tendency}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Baro Detail Footnote */}
        <div className="grid grid-cols-2 gap-1 pt-0.5">
          <div className="flex items-center justify-between p-1.5 bg-[#0d0e10] border border-[#2b3038]/30">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
              DIURNAL TIDE
            </span>
            <span className="font-code-telemetry text-[10px] text-[#e3e2e5] font-semibold">
              NOMINAL ±0.8
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 bg-[#0d0e10] border border-[#2b3038]/30">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
              FRONTAL SPEED
            </span>
            <span className="font-code-telemetry text-[10px] text-[#e3e2e5] font-semibold">
              22.4 KT SSE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
