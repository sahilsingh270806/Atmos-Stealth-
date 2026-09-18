import React, { useState, useEffect } from 'react';
import { StationInfo } from '../types';

interface RadarViewProps {
  station: StationInfo;
}

export const RadarView: React.FC<RadarViewProps> = ({ station }) => {
  const [rangeNM, setRangeNM] = useState<number>(50);
  const [product, setProduct] = useState<'REFLECTIVITY' | 'VELOCITY' | 'ECHO_TOPS'>('REFLECTIVITY');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [loopSpeed, setLoopSpeed] = useState<1 | 2 | 4>(1);
  const [frameIndex, setFrameIndex] = useState<number>(5); // 0 to 5 (5 is LIVE)
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  const frames = ['-60m', '-45m', '-30m', '-15m', '-5m', 'LIVE'];

  // Frame trajectory coordinates for simulated cell drift (335° NNW @ 22 KT)
  const cellPositions = [
    { cxA: 215, cyA: 225, cxB: 125, cyB: 195, intensityA: 45, intensityB: 32 }, // -60m
    { cxA: 210, cyA: 218, cxB: 120, cyB: 190, intensityA: 48, intensityB: 34 }, // -45m
    { cxA: 204, cyA: 211, cxB: 116, cyB: 184, intensityA: 50, intensityB: 36 }, // -30m
    { cxA: 198, cyA: 204, cxB: 111, cyB: 178, intensityA: 52, intensityB: 38 }, // -15m
    { cxA: 193, cyA: 197, cxB: 107, cyB: 173, intensityA: 53, intensityB: 38 }, // -5m
    { cxA: 188, cyA: 190, cxB: 103, cyB: 168, intensityA: 52, intensityB: 38 }, // LIVE
  ];

  const currentCell = cellPositions[frameIndex] || cellPositions[5];

  // Automatic Frame looping when playing
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = 1600 / loopSpeed;
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, loopSpeed, frames.length]);

  const handleStepPrev = () => {
    setIsPlaying(false);
    setFrameIndex((prev) => (prev === 0 ? frames.length - 1 : prev - 1));
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    setFrameIndex((prev) => (prev + 1) % frames.length);
  };

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
            <span
              className={`w-1.5 h-1.5 rounded-none ${
                isPlaying ? 'bg-white animate-ping' : 'bg-[#8e9193]'
              }`}
            />
            <span className="font-code-telemetry text-[11px] text-white font-semibold">
              {isPlaying ? `SCANNING // ${loopSpeed}X CADENCE` : 'PAUSED // FRAME HOLD'}
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
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">TILT: 0.5° PPI</span>
            <span className="text-[#8e9193]">|</span>
            <span className="text-white font-bold">{frames[frameIndex]}</span>
          </div>
        </div>

        {/* Circular Radar Scope */}
        <div className="relative w-full max-w-[340px] aspect-square bg-[#0a0b0d] border border-[#2b3038] overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 300 300">
            <defs>
              {/* Radar sweep beam gradient */}
              <linearGradient id="sweep-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
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

            {/* Simulated Coastline: Bay of Bengal Maritime & Hooghly Estuary */}
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

            {/* Animated CSS Sonar Pulse Waves (Active during loop play) */}
            {isPlaying && (
              <>
                <circle
                  cx="150"
                  cy="150"
                  r="10"
                  fill="none"
                  stroke="#ffffff"
                  className="animate-radar-pulse-1 pointer-events-none"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="10"
                  fill="none"
                  stroke="#ffffff"
                  className="animate-radar-pulse-2 pointer-events-none"
                />
              </>
            )}

            {/* Convective Storm Cell 09A (Moves across frames to simulate weather loop) */}
            <g
              className="cursor-pointer transition-all duration-300 animate-radar-blip"
              onClick={() => setSelectedCell('CELL-09A')}
            >
              {/* Outer moderate reflectivity */}
              <ellipse
                cx={currentCell.cxA}
                cy={currentCell.cyA}
                rx="34"
                ry="22"
                fill="#343537"
                opacity="0.65"
              />
              {/* Core reflectivity */}
              <ellipse
                cx={currentCell.cxA + 2}
                cy={currentCell.cyA - 1}
                rx="20"
                ry="14"
                fill="#8e9193"
                opacity="0.75"
              />
              {/* Severe Convective Core */}
              <ellipse
                cx={currentCell.cxA + 4}
                cy={currentCell.cyA - 2}
                rx="11"
                ry="7"
                fill="#ffffff"
                opacity="0.95"
              />

              {/* Storm Vector Arrow pointing NNW */}
              <line
                x1={currentCell.cxA + 4}
                y1={currentCell.cyA - 2}
                x2={currentCell.cxA - 16}
                y2={currentCell.cyA - 30}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <polygon
                points={`${currentCell.cxA - 16},${currentCell.cyA - 30} ${currentCell.cxA - 19},${currentCell.cyA - 22} ${currentCell.cxA - 11},${currentCell.cyA - 24}`}
                fill="#ffffff"
              />
              <text
                fill="#ffffff"
                fontFamily="Geist"
                fontSize="7"
                fontWeight="600"
                x={currentCell.cxA + 8}
                y={currentCell.cyA - 7}
              >
                CELL-09A [{currentCell.intensityA} dBZ]
              </text>
            </g>

            {/* Secondary Cell 09B */}
            <g
              className="cursor-pointer transition-all duration-300"
              onClick={() => setSelectedCell('CELL-09B')}
            >
              <ellipse
                cx={currentCell.cxB}
                cy={currentCell.cyB}
                rx="16"
                ry="12"
                fill="#444749"
                opacity="0.6"
              />
              <ellipse
                cx={currentCell.cxB - 1}
                cy={currentCell.cyB - 1}
                rx="7"
                ry="5"
                fill="#c4c7c9"
                opacity="0.8"
              />
              <text
                fill="#c4c7c9"
                fontFamily="Geist"
                fontSize="6"
                x={currentCell.cxB - 22}
                y={currentCell.cyB + 18}
              >
                CELL-09B [{currentCell.intensityB} dBZ]
              </text>
            </g>

            {/* CSS-Animated Radar Sweep Beam */}
            <g
              className="animate-radar-sweep"
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused',
                animationDuration: `${4 / loopSpeed}s`,
              }}
            >
              {/* Sweep Wedge */}
              <path
                d="M 150,150 L 150,10 A 140,140 0 0,0 85,28 Z"
                fill="url(#sweep-beam)"
              />
              {/* Leading beam line */}
              <line x1="150" y1="150" x2="150" y2="10" stroke="#ffffff" strokeWidth="1.75" />
            </g>

            {/* Center Station Transmitter Node */}
            <circle cx="150" cy="150" r="3.5" fill="#ffffff" />
            <circle cx="150" cy="150" r="7" fill="none" stroke="#ffffff" strokeWidth="0.8" />

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

        {/* Playback & Timeline Controls with prominent Play Button */}
        <div className="w-full mt-2 p-2 bg-[#1b1c1e] border border-[#2b3038]/40 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* Play/Pause & Step Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-3 py-1 flex items-center gap-1 font-geist text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-white text-black shadow-lg hover:bg-[#e0e3e5]'
                    : 'bg-[#292a2c] text-white border border-[#444749] hover:bg-[#343537]'
                }`}
                title={isPlaying ? 'Pause radar scan' : 'Start radar scan loop'}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlaying ? 'PAUSE SCAN' : 'PLAY LOOP'}</span>
              </button>

              {/* Frame Step Buttons */}
              <button
                onClick={handleStepPrev}
                className="w-7 h-7 flex items-center justify-center bg-[#0d0e10] border border-[#2b3038] text-[#c4c7c9] hover:text-white hover:border-white cursor-pointer"
                title="Step backward one frame"
              >
                <span className="material-symbols-outlined text-[14px]">skip_previous</span>
              </button>
              <button
                onClick={handleStepNext}
                className="w-7 h-7 flex items-center justify-center bg-[#0d0e10] border border-[#2b3038] text-[#c4c7c9] hover:text-white hover:border-white cursor-pointer"
                title="Step forward one frame"
              >
                <span className="material-symbols-outlined text-[14px]">skip_next</span>
              </button>
            </div>

            {/* Loop Playback Speed Selector */}
            <div className="flex items-center gap-1">
              <span className="font-geist text-[9px] uppercase text-[#8e9193]">SPEED:</span>
              <div className="flex bg-[#0d0e10] p-0.5 border border-[#2b3038] gap-0.5 font-code-telemetry text-[9px]">
                {([1, 2, 4] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setLoopSpeed(spd)}
                    className={`px-1.5 py-0.5 transition-colors cursor-pointer ${
                      loopSpeed === spd ? 'bg-white text-black font-bold' : 'text-[#8e9193] hover:text-white'
                    }`}
                  >
                    {spd}X
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stepper bar across 6 frames */}
          <div className="grid grid-cols-6 gap-1">
            {frames.map((f, i) => (
              <button
                key={f}
                onClick={() => {
                  setFrameIndex(i);
                  setIsPlaying(false);
                }}
                className={`py-1 text-center font-code-telemetry text-[9px] border transition-all cursor-pointer ${
                  frameIndex === i
                    ? 'bg-white text-black font-bold border-white shadow-sm'
                    : 'bg-[#0d0e10] text-[#8e9193] border-[#2b3038] hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Reflectivity Grayscale Color Scale */}
          <div className="pt-1 border-t border-[#2b3038]/40 flex flex-col gap-1">
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
