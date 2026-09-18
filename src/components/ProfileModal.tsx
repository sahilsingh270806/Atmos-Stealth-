import React from 'react';
import { StationInfo } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationInfo;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  station,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1b1c1e] border border-white/80 shadow-2xl p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2b3038] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[18px]">badge</span>
            <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-widest">
              OPERATOR CREDENTIALS // ATMOS COMMAND
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-[#8e9193] hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Identity block */}
        <div className="flex items-center gap-3 p-3 bg-[#0d0e10] border border-[#2b3038]">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-geist font-bold text-[18px]">
            OP
          </div>
          <div className="flex flex-col">
            <span className="font-geist text-[13px] uppercase font-bold text-white leading-tight">
              OPERATOR 8821 // MET-SPEC
            </span>
            <span className="font-geist text-[10px] text-[#8e9193] tracking-wide mt-0.5">
              HALDIA MARITIME COMMAND // DIVISION 04
            </span>
            <span className="font-code-telemetry text-[9px] text-[#e3e2e5] mt-1">
              SECURITY CLEARANCE: LEVEL 3 TACTICAL
            </span>
          </div>
        </div>

        {/* Technical Specification Matrix */}
        <div className="space-y-1 bg-[#0d0e10] p-2.5 border border-[#2b3038]/40 text-[10px] font-code-telemetry">
          <div className="flex justify-between border-b border-[#2b3038]/30 pb-1">
            <span className="text-[#8e9193]">ASSIGNED STATION:</span>
            <span className="text-white font-semibold">{station.cluster}</span>
          </div>
          <div className="flex justify-between border-b border-[#2b3038]/30 py-1">
            <span className="text-[#8e9193]">GEO COORDINATES:</span>
            <span className="text-white">{station.coordinates}</span>
          </div>
          <div className="flex justify-between border-b border-[#2b3038]/30 py-1">
            <span className="text-[#8e9193]">STATION ELEVATION:</span>
            <span className="text-white">{station.elevation}</span>
          </div>
          <div className="flex justify-between border-b border-[#2b3038]/30 py-1">
            <span className="text-[#8e9193]">NETWORK LATENCY:</span>
            <span className="text-white">{station.latency} // JITTER &lt;0.5ms</span>
          </div>
          <div className="flex justify-between border-b border-[#2b3038]/30 py-1">
            <span className="text-[#8e9193]">FIRMWARE CORE:</span>
            <span className="text-white">v4.18.2-STEALTH TITANIUM</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[#8e9193]">ENCRYPTION STANDARD:</span>
            <span className="text-white">AES-256-GCM TELEMETRY BUS</span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full mt-1 py-2 bg-white text-black font-geist text-[11px] uppercase tracking-widest font-semibold hover:bg-[#e0e3e5] cursor-pointer"
        >
          CLOSE CONSOLE
        </button>
      </div>
    </div>
  );
};
