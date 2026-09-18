import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempUnit: 'C' | 'F';
  setTempUnit: (u: 'C' | 'F') => void;
  pressureUnit: 'hPa' | 'inHg';
  setPressureUnit: (u: 'hPa' | 'inHg') => void;
  windUnit: 'km/h' | 'kt';
  setWindUnit: (u: 'km/h' | 'kt') => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  tempUnit,
  setTempUnit,
  pressureUnit,
  setPressureUnit,
  windUnit,
  setWindUnit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1b1c1e] border border-white/80 shadow-2xl p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#2b3038] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[18px]">tune</span>
            <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-widest">
              TELEMETRY PARAMETER FILTERS
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-[#8e9193] hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Temperature Unit */}
        <div className="flex flex-col gap-1">
          <span className="font-geist text-[10px] uppercase text-[#8e9193] tracking-wider">
            THERMAL UNIT (CHAN_01)
          </span>
          <div className="grid grid-cols-2 gap-1 bg-[#0d0e10] p-0.5 border border-[#2b3038]">
            <button
              onClick={() => setTempUnit('C')}
              className={`py-1 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                tempUnit === 'C' ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
              }`}
            >
              CELSIUS (°C)
            </button>
            <button
              onClick={() => setTempUnit('F')}
              className={`py-1 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                tempUnit === 'F' ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
              }`}
            >
              FAHRENHEIT (°F)
            </button>
          </div>
        </div>

        {/* Barometric Unit */}
        <div className="flex flex-col gap-1">
          <span className="font-geist text-[10px] uppercase text-[#8e9193] tracking-wider">
            BAROMETRIC GRADIENT UNIT
          </span>
          <div className="grid grid-cols-2 gap-1 bg-[#0d0e10] p-0.5 border border-[#2b3038]">
            <button
              onClick={() => setPressureUnit('hPa')}
              className={`py-1 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                pressureUnit === 'hPa' ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
              }`}
            >
              HECTOPASCALS (hPa)
            </button>
            <button
              onClick={() => setPressureUnit('inHg')}
              className={`py-1 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                pressureUnit === 'inHg' ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
              }`}
            >
              INCHES MERCURY (inHg)
            </button>
          </div>
        </div>

        {/* Wind Speed Unit */}
        <div className="flex flex-col gap-1">
          <span className="font-geist text-[10px] uppercase text-[#8e9193] tracking-wider">
            ANEMOMETRY VELOCITY UNIT
          </span>
          <div className="grid grid-cols-2 gap-1 bg-[#0d0e10] p-0.5 border border-[#2b3038]">
            <button
              onClick={() => setWindUnit('km/h')}
              className={`py-1 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                windUnit === 'km/h' ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
              }`}
            >
              KILOMETERS/HOUR (km/h)
            </button>
            <button
              onClick={() => setWindUnit('kt')}
              className={`py-1 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                windUnit === 'kt' ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
              }`}
            >
              NAUTICAL KNOTS (KT)
            </button>
          </div>
        </div>

        {/* Signal Processing / Smoothing */}
        <div className="flex flex-col gap-1">
          <span className="font-geist text-[10px] uppercase text-[#8e9193] tracking-wider">
            SIGNAL NOISE FILTER
          </span>
          <div className="grid grid-cols-3 gap-1 bg-[#0d0e10] p-0.5 border border-[#2b3038]">
            <button className="py-1 text-center font-code-telemetry text-[10px] bg-[#343537] text-white font-semibold">
              KALMAN
            </button>
            <button className="py-1 text-center font-code-telemetry text-[10px] text-[#8e9193]">
              GAUSSIAN
            </button>
            <button className="py-1 text-center font-code-telemetry text-[10px] text-[#8e9193]">
              RAW 100Hz
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 py-2 bg-white text-black font-geist text-[11px] uppercase tracking-widest font-semibold hover:bg-[#e0e3e5] cursor-pointer"
        >
          APPLY CONFIGURATION
        </button>
      </div>
    </div>
  );
};
