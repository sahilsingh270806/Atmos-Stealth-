import React, { useState } from 'react';

interface WindVectorCardProps {
  windSpeedUnit?: 'km/h' | 'kt';
  windSpeed?: number;
  windDirection?: string;
  peakGust?: number;
  stationName?: string;
}

export const WindVectorCard: React.FC<WindVectorCardProps> = ({
  windSpeedUnit = 'km/h',
  windSpeed,
  windDirection = '180° S',
  peakGust,
  stationName,
}) => {
  const [interactiveAngle, setInteractiveAngle] = useState<number | null>(null);

  const formatSpeed = (kmh: number) => {
    if (windSpeedUnit === 'kt') {
      return (kmh * 0.539957).toFixed(1) + ' KT';
    }
    return kmh.toFixed(1) + ' km/h';
  };

  // Parse angle from windDirection string (e.g. "180° S" or "22° NNE")
  const parsedAngle = (() => {
    if (!windDirection) return 180;
    const match = windDirection.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 180;
  })();

  const angle = interactiveAngle !== null ? interactiveAngle : parsedAngle;
  const currentSpeed = typeof windSpeed === 'number' && !isNaN(windSpeed) ? windSpeed : 14.2;
  const currentGust = typeof peakGust === 'number' && !isNaN(peakGust) ? peakGust : parseFloat((currentSpeed * 1.6).toFixed(1));

  return (
    <section className="flex flex-col mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038]/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#1f2022] border-b border-[#2b3038]/50">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-white text-[16px]">air</span>
          <span className="font-geist text-[12px] uppercase font-semibold text-[#e3e2e5] tracking-wider">
            WIND VECTOR & GUST PROFILE
          </span>
        </div>
        <span className="font-code-telemetry text-[11px] text-[#c4c7c9]">
          VECTOR {angle}° {windDirection ? windDirection.split(' ')[1] || '' : ''}
        </span>
      </div>

      <div className="p-2 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 items-center">
          {/* Monochrome Vector Compass Ring */}
          <div className="relative flex items-center justify-center p-2 bg-[#0d0e10] aspect-square border border-[#2b3038]/40">
            <svg
              className="w-full h-full cursor-pointer select-none"
              viewBox="0 0 100 100"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const rad = Math.atan2(e.clientY - cy, e.clientX - cx);
                let deg = Math.round((rad * 180) / Math.PI) + 90;
                if (deg < 0) deg += 360;
                setInteractiveAngle(deg);
              }}
            >
              {/* Outer Dial Ring */}
              <circle cx="50" cy="50" fill="none" r="42" stroke="#444749" strokeWidth="1" />
              <circle cx="50" cy="50" fill="none" r="28" stroke="#444749" strokeDasharray="2 2" strokeWidth="0.5" />
              <circle cx="50" cy="50" fill="none" r="14" stroke="#444749" strokeDasharray="2 2" strokeWidth="0.5" />

              {/* Axis markers */}
              <line stroke="#ffffff" strokeWidth="1.5" x1="50" x2="50" y1="4" y2="12" />
              <line stroke="#ffffff" strokeWidth="2" x1="50" x2="50" y1="88" y2="96" />
              <line stroke="#8e9193" strokeWidth="1" x1="4" x2="12" y1="50" y2="50" />
              <line stroke="#8e9193" strokeWidth="1" x1="88" x2="96" y1="50" y2="50" />

              {/* Dynamic or Default Vector Group */}
              <g transform={`rotate(${angle - 180} 50 50)`}>
                {/* Primary Wind Influx Vector (Bay of Bengal Drift - 180 deg) */}
                <polygon fill="#ffffff" points="50,50 44,78 50,86 56,78" />

                {/* Secondary Scatter (SW drift) */}
                <polygon fill="#8e9193" opacity="0.6" points="50,50 36,68 40,74 44,66" />
              </g>

              {/* Cardinal Text */}
              <text fill="#8e9193" fontFamily="Geist" fontSize="7" textAnchor="middle" x="50" y="22">
                N
              </text>
              <text fill="#ffffff" fontFamily="Geist" fontSize="8" fontWeight="600" textAnchor="middle" x="50" y="84">
                S
              </text>
              <text fill="#8e9193" fontFamily="Geist" fontSize="7" textAnchor="middle" x="80" y="52">
                E
              </text>
              <text fill="#8e9193" fontFamily="Geist" fontSize="7" textAnchor="middle" x="20" y="52">
                W
              </text>
            </svg>

            {interactiveAngle !== null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setInteractiveAngle(null);
                }}
                className="absolute top-1 right-1 font-code-telemetry text-[9px] text-[#8e9193] hover:text-white px-1 bg-[#1f2022] border border-[#444749]"
                title="Reset to 180° S"
              >
                RESET
              </button>
            )}
          </div>

          {/* Velocity Breakdown */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-col p-1.5 bg-[#0d0e10] border border-[#2b3038]/30">
              <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
                PREDOMINANT DRIFT
              </span>
              <span className="font-code-telemetry text-[13px] text-white font-semibold leading-tight mt-0.5">
                {angle}° {windDirection ? windDirection.split(' ')[1] || '' : ''}
              </span>
              <span className="font-geist text-[9px] text-[#8e9193] tracking-wide mt-0.5 uppercase">
                {stationName ? `${stationName} SECTOR` : 'LOCAL OBSERVED VECTOR'}
              </span>
            </div>

            <div className="flex flex-col p-1.5 bg-[#0d0e10] border border-[#2b3038]/30">
              <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
                SUSTAINED MEAN
              </span>
              <span className="font-code-telemetry text-[13px] text-[#e3e2e5] font-semibold leading-tight mt-0.5">
                {formatSpeed(currentSpeed)}
              </span>
              <span className="font-geist text-[9px] text-[#8e9193] tracking-wide mt-0.5">
                10M ANEMOMETER PROBE
              </span>
            </div>

            <div className="flex flex-col p-1.5 bg-[#0d0e10] border border-[#2b3038]/30">
              <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
                PEAK RECORDED GUST
              </span>
              <span className="font-code-telemetry text-[13px] text-white font-semibold leading-tight mt-0.5">
                {formatSpeed(currentGust)}
              </span>
              <span className="font-geist text-[9px] text-[#8e9193] tracking-wide mt-0.5">
                SURFACE BOUNDARY LAYER
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
