import React from 'react';

interface SensorHealthGridProps {
  onDownloadTelemetry: () => void;
}

export const SensorHealthGrid: React.FC<SensorHealthGridProps> = ({
  onDownloadTelemetry,
}) => {
  return (
    <section className="flex flex-col mx-4 mt-2 mb-4 bg-[#1b1c1e] border border-[#2b3038]/60 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-[#1f2022] border-b border-[#2b3038]/50">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-white text-[16px]">dns</span>
          <span className="font-geist text-[12px] uppercase font-semibold text-[#e3e2e5] tracking-wider">
            STATION SENSOR HEALTH // TELEMETRY
          </span>
        </div>
        <span className="font-code-telemetry text-[11px] text-white font-semibold">
          ONLINE
        </span>
      </div>

      {/* 2x2 Micro-Grid */}
      <div className="grid grid-cols-2 gap-1 p-2 bg-[#0d0e10]">
        {/* Sensor Calibration */}
        <div className="flex flex-col p-1.5 bg-[#1f2022] border border-[#2b3038]/40">
          <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
            SENSOR CALIBRATION
          </span>
          <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5 leading-tight">
            99.8% ACCURACY
          </span>
          <span className="font-geist text-[9px] text-[#8e9193] mt-0.5 tracking-wide">
            NIST CERTIFIED // 0.2% DRIFT
          </span>
        </div>

        {/* Baro Core Drift */}
        <div className="flex flex-col p-1.5 bg-[#1f2022] border border-[#2b3038]/40">
          <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
            BARO CORE DRIFT
          </span>
          <span className="font-code-telemetry text-[13px] text-[#e3e2e5] font-semibold mt-0.5 leading-tight">
            &lt; 0.02 hPa / mo
          </span>
          <span className="font-geist text-[9px] text-[#8e9193] mt-0.5 tracking-wide">
            QUARTZ RESONATOR STABLE
          </span>
        </div>

        {/* Solar Rad Peak */}
        <div className="flex flex-col p-1.5 bg-[#1f2022] border border-[#2b3038]/40">
          <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
            SOLAR RAD PEAK
          </span>
          <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5 leading-tight">
            7.4 UVI
          </span>
          <span className="font-geist text-[9px] text-[#8e9193] mt-0.5 tracking-wide">
            ALL-TIME HIGH 8.1 UVI
          </span>
        </div>

        {/* Air Purity Mean */}
        <div className="flex flex-col p-1.5 bg-[#1f2022] border border-[#2b3038]/40">
          <span className="font-geist text-[9px] text-[#8e9193] uppercase tracking-wider">
            AIR PURITY MEAN
          </span>
          <span className="font-code-telemetry text-[13px] text-[#e3e2e5] font-semibold mt-0.5 leading-tight">
            38 PM2.5
          </span>
          <span className="font-geist text-[9px] text-[#8e9193] mt-0.5 tracking-wide">
            AQI 54 // CLEAN MARITIME
          </span>
        </div>
      </div>

      {/* Data Export Tactical Button */}
      <div className="p-2 pt-0 bg-[#0d0e10]">
        <button
          onClick={onDownloadTelemetry}
          className="w-full py-2.5 bg-white text-[#090a0c] font-geist text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 hover:bg-[#e0e3e5] active:scale-[0.99] transition-all cursor-pointer shadow-sm border border-transparent"
        >
          <span className="material-symbols-outlined text-[16px]">file_download</span>
          <span>DOWNLOAD RAW CSV TELEMETRY (.GRIB2 / JSON)</span>
        </button>
      </div>
    </section>
  );
};
