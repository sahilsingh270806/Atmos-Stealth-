import React from 'react';

interface BarometricChartProps {
  pressureUnit?: 'hPa' | 'inHg';
}

export const BarometricChart: React.FC<BarometricChartProps> = ({
  pressureUnit = 'hPa',
}) => {
  const formatPressure = (hpa: number) => {
    if (pressureUnit === 'inHg') {
      return (hpa * 0.02953).toFixed(2) + ' inHg';
    }
    return hpa.toFixed(1) + ' hPa';
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
        <span className="font-code-telemetry text-[11px] text-white font-semibold">
          {formatPressure(1005.8)}
        </span>
      </div>

      <div className="p-2 flex flex-col gap-1.5">
        {/* Status Pill Row */}
        <div className="flex items-center justify-between flex-wrap gap-1">
          <div className="flex items-center gap-1 bg-[#292a2c] px-1.5 py-0.5 border border-[#444749]/50">
            <span className="w-1.5 h-1.5 bg-white"></span>
            <span className="font-geist text-[10px] uppercase font-semibold text-white tracking-wide">
              FALLING RAPIDLY // CONVECTIVE TROUGH
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#c4c7c9]">
            3-HR DELTA: -2.4 hPa
          </span>
        </div>

        {/* SVG Barometric Curve */}
        <div className="w-full h-24 bg-[#0d0e10] p-1 relative border border-[#2b3038]/40">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 340 80">
            {/* Isobar Baseline (1012 hPa) */}
            <line stroke="#444749" strokeDasharray="3 3" strokeWidth="0.75" x1="0" x2="340" y1="20" y2="20" />
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" x="4" y="15" letterSpacing="0.04em">
              1012 hPa BASELINE
            </text>

            {/* Critical Pressure Line (1004 hPa) */}
            <line opacity="0.6" stroke="#444749" strokeDasharray="2 2" strokeWidth="0.75" x1="0" x2="340" y1="62" y2="62" />
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" x="4" y="57" letterSpacing="0.04em">
              1004 hPa DEEP CYCLONIC THRESHOLD
            </text>

            {/* Pressure Trajectory */}
            <path
              d="M 0,22 L 50,24 L 95,28 L 140,36 L 180,48 L 220,68 L 260,65 L 300,56 L 340,58"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Low Point Node */}
            <circle cx="220" cy="68" fill="#ffffff" r="3" />
            <circle cx="220" cy="68" fill="none" stroke="#ffffff" strokeWidth="0.75" opacity="0.5" r="5" />
          </svg>

          {/* Min Pressure Badge */}
          <div className="absolute bottom-1.5 right-1.5 bg-[#1f2022] border border-[#444749] px-1.5 py-0.5">
            <span className="font-code-telemetry text-[10px] text-white font-medium">
              MIN: {formatPressure(1004.2)} (19 OCT)
            </span>
          </div>
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
