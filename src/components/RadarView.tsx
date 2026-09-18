import React, { useState, useEffect } from 'react';
import { StationInfo } from '../types';

interface RadarViewProps {
  station: StationInfo;
}

export const RadarView: React.FC<RadarViewProps> = ({ station }) => {
  const [rangeNM, setRangeNM] = useState<number>(50);
  const [product, setProduct] = useState<'REFLECTIVITY' | 'VELOCITY' | 'ECHO_TOPS'>('REFLECTIVITY');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [frameIndex, setFrameIndex] = useState<number>(5); // 0 to 5 (5 is LIVE)
  const [sweepAngle, setSweepAngle] = useState<number>(0);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const frames = ['-60m', '-45m', '-30m', '-15m', '-5m', 'LIVE'];

  // Radar sweep animation
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;
      setSweepAngle((prev) => (prev + (delta * 0.08)) % 360);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Frame looping when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [isPlaying, frames.length]);

  return (
    <div className="flex flex-col w-full pb-6">
      {/* Scope Header */}
      <section className="mx-4 mt-3 bg-[#1b1c1e] border border-[#2b3038]/60 p-2.5">
        <div className="flex items-center justify-between border-b border-[#2b3038]/50 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">radar</span>
            <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-wider">
              DOPPLER RADAR // HALDIA COASTAL ARRAY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white animate-ping" />
            <span className="font-code-telemetry text-[11px] text-white font-semibold">
              SWEEP 4.2 RPM
            </span>
          </div>
        </div>

        {/* Product & Range Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
          {/* Products */}
          <div className="flex bg-[#0d0e10] p-0.5 border border-[#2b3038] divide-x divide-[#2b3038]">
            {(['REFLECTIVITY', 'VELOCITY', 'ECHO_TOPS'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProduct(p)}
                className={`px-2 py-1 font-geist text-[9px] uppercase tracking-wider transition-colors cursor-pointer ${
                  product === p ? 'bg-white text-black font-semibold' : 'text-[#8e9193] hover:text-white'
                }`}
              >
                {p === 'REFLECTIVITY' ? 'REFLECT (dBZ)' : p === 'VELOCITY' ? 'VELOCITY (VAD)' : 'ECHO TOPS'}
              </button>
            ))}
          </div>

          {/* Range Selection */}
          <div className="flex items-center gap-1">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">RANGE:</span>
            <div className="flex bg-[#0d0e10] p-0.5 border border-[#2b3038] gap-0.5">
              {[25, 50, 100].map((r) => (
                <button
                  key={r}
                  onClick={() => setRangeNM(r)}
                  className={`px-1.5 py-0.5 font-code-telemetry text-[9px] transition-colors cursor-pointer ${
                    rangeNM === r ? 'bg-[#343537] text-white font-bold' : 'text-[#8e9193] hover:text-white'
                  }`}
                >
                  {r}NM
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Radar Canvas / SVG Display */}
      <section className="mx-4 mt-2 bg-[#0d0e10] border border-[#2b3038]/60 p-2 relative flex flex-col items-center">
        {/* Status overlay */}
        <div className="w-full flex items-center justify-between text-[10px] font-code-telemetry text-[#8e9193] mb-1 px-1">
          <span>CENTER: {station.coordinates}</span>
          <span className="text-white font-semibold">TILT: 0.5° PPI</span>
        </div>

        {/* Circular Radar Scope */}
        <div className="relative w-full max-w-[340px] aspect-square bg-[#0a0b0d] border border-[#2b3038] overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 300 300">
            <defs>
              {/* Radar sweep beam gradient */}
              <linearGradient id="sweep-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="radar-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Scope Glow */}
            <circle cx="150" cy="150" r="140" fill="url(#radar-core-glow)" />

            {/* Concentric Range Rings */}
            <circle cx="150" cy="150" r="35" fill="none" stroke="#2b3038" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="150" cy="150" r="70" fill="none" stroke="#2b3038" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="150" cy="150" r="105" fill="none" stroke="#343537" strokeWidth="1" />
            <circle cx="150" cy="150" r="140" fill="none" stroke="#444749" strokeWidth="1.2" />

            {/* Crosshairs & Azimuth lines */}
            <line x1="150" y1="10" x2="150" y2="290" stroke="#2b3038" strokeWidth="1" />
            <line x1="10" y1="150" x2="290" y2="150" stroke="#2b3038" strokeWidth="1" />
            <line x1="51" y1="51" x2="249" y2="249" stroke="#1f2022" strokeWidth="0.75" />
            <line x1="249" y1="51" x2="51" y2="249" stroke="#1f2022" strokeWidth="0.75" />

            {/* Synthetic Coastline: Bay of Bengal Maritime & Hooghly Estuary */}
            <path
              d="M 20,80 Q 70,85 110,120 T 140,160 T 130,220 T 100,280"
              fill="none"
              stroke="#525866"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <text fill="#8e9193" fontFamily="Geist" fontSize="7" x="40" y="115">
              COASTLINE // ESTUARY
            </text>

            {/* Convective Storm Cells (Cluster 1 - Heavy Convective Core) */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedCell('CELL-09A')}
            >
              {/* Outer light rain (20 dBZ) */}
              <ellipse cx="190" cy="195" rx="36" ry="24" fill="#343537" opacity="0.6" />
              {/* Moderate core (35 dBZ) */}
              <ellipse cx="192" cy="193" rx="22" ry="15" fill="#8e9193" opacity="0.7" />
              {/* Severe Convective Core (50 dBZ) */}
              <ellipse cx="194" cy="192" rx="12" ry="8" fill="#ffffff" opacity="0.95" />

              {/* Storm Vector Arrow pointing NNW */}
              <line x1="194" y1="192" x2="175" y2="160" stroke="#ffffff" strokeWidth="1.5" />
              <polygon points="175,160 172,168 180,166" fill="#ffffff" />
              <text fill="#ffffff" fontFamily="Geist" fontSize="7" fontWeight="600" x="198" y="185">
                CELL-09A [52 dBZ]
              </text>
            </g>

            {/* Secondary Scatter Cell */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedCell('CELL-09B')}
            >
              <ellipse cx="105" cy="170" rx="18" ry="14" fill="#444749" opacity="0.6" />
              <ellipse cx="104" cy="169" rx="8" ry="6" fill="#c4c7c9" opacity="0.8" />
              <text fill="#c4c7c9" fontFamily="Geist" fontSize="6" x="80" y="190">
                CELL-09B [38 dBZ]
              </text>
            </g>

            {/* Rotating Radar Sweep Arm */}
            <g transform={`rotate(${sweepAngle} 150 150)`}>
              {/* Sweep Wedge */}
              <path
                d="M 150,150 L 150,10 A 140,140 0 0,0 90,26 Z"
                fill="url(#sweep-beam)"
              />
              {/* Leading beam line */}
              <line x1="150" y1="150" x2="150" y2="10" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* Center Station Transmitter Node */}
            <circle cx="150" cy="150" r="3" fill="#ffffff" />
            <circle cx="150" cy="150" r="6" fill="none" stroke="#ffffff" strokeWidth="0.8" />

            {/* Cardinal Marks */}
            <text fill="#ffffff" fontFamily="Geist" fontSize="8" fontWeight="600" textAnchor="middle" x="150" y="22">
              000° N
            </text>
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" textAnchor="middle" x="150" y="288">
              180° S
            </text>
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" textAnchor="middle" x="280" y="153">
              090° E
            </text>
            <text fill="#8e9193" fontFamily="Geist" fontSize="8" textAnchor="middle" x="20" y="153">
              270° W
            </text>
          </svg>

          {/* Selected Cell Floating Telemetry */}
          {selectedCell && (
            <div className="absolute bottom-2 left-2 bg-[#1b1c1e] border border-white p-2 text-[10px] font-code-telemetry shadow-2xl z-20">
              <div className="flex items-center justify-between gap-3 text-white font-semibold mb-1">
                <span>{selectedCell}</span>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-[#8e9193] hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="text-[#8e9193] space-y-0.5 text-[9px]">
                <div>PEAK REFLECTIVITY: <span className="text-white font-bold">52.4 dBZ</span></div>
                <div>DRIFT VECTOR: <span className="text-white">335° NNW @ 22 KT</span></div>
                <div>ECHO TOP: <span className="text-white">38,000 FT MSL</span></div>
                <div>HAIL PROBABILITY: <span className="text-white">15% [LOW]</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Playback & Timeline Controls */}
        <div className="w-full mt-2 p-2 bg-[#1b1c1e] border border-[#2b3038]/40 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 flex items-center justify-center bg-white text-black font-bold hover:bg-[#e0e3e5] cursor-pointer"
                title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
              <span className="font-geist text-[10px] uppercase font-semibold text-white tracking-wider">
                RADAR LOOP ({frames[frameIndex]})
              </span>
            </div>

            <span className="font-code-telemetry text-[10px] text-[#8e9193]">
              15-MIN COMPOSITE SCAN
            </span>
          </div>

          {/* Stepper bar */}
          <div className="grid grid-cols-6 gap-1">
            {frames.map((f, i) => (
              <button
                key={f}
                onClick={() => {
                  setFrameIndex(i);
                  setIsPlaying(false);
                }}
                className={`py-1 text-center font-code-telemetry text-[9px] border transition-colors cursor-pointer ${
                  frameIndex === i
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-[#0d0e10] text-[#8e9193] border-[#2b3038] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Reflectivity Grayscale Color Scale */}
          <div className="mt-1 pt-1.5 border-t border-[#2b3038]/40 flex flex-col gap-1">
            <div className="flex justify-between text-[8px] font-code-telemetry text-[#8e9193]">
              <span>5 dBZ (MIST)</span>
              <span>25 dBZ (SHOWERS)</span>
              <span>45 dBZ (HEAVY)</span>
              <span className="text-white font-bold">65 dBZ (SEVERE)</span>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-[#121315] via-[#525866] to-[#ffffff] border border-[#2b3038]" />
          </div>
        </div>
      </section>
    </div>
  );
};
