import React, { useState } from 'react';
import { StationInfo, TimeHorizon } from '../types';
import { THERMAL_DATA_7D, HYDROMETEOR_DATA_7D } from '../data/mockData';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: StationInfo;
  timeHorizon: TimeHorizon;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  station,
  timeHorizon,
}) => {
  const [format, setFormat] = useState<'CSV' | 'JSON' | 'GRIB2'>('CSV');
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExport = () => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `ATMOS_TELEMETRY_${station.id.toUpperCase()}_${timeHorizon}.${format.toLowerCase()}`;

    if (format === 'CSV') {
      mimeType = 'text/csv';
      content = `STATION_ID,CLUSTER,TIMESTAMP_UTC,AMBIENT_TEMP_C,DEW_POINT_C,BARO_HPA,RAIN_ACCUM_MM,WIND_DIR_DEG,WIND_SPEED_KMH,QUALITY_FLAG\n`;
      THERMAL_DATA_7D.forEach((item, idx) => {
        const rain = HYDROMETEOR_DATA_7D[idx]?.value || 0;
        content += `${station.id},"${station.cluster}",2024-10-${15 + idx}T12:00:00Z,${item.temp},${item.dewPoint},1005.8,${rain},180,14.2,NIST_VERIFIED\n`;
      });
    } else if (format === 'JSON') {
      mimeType = 'application/json';
      const exportObject = {
        station: {
          id: station.id,
          name: station.name,
          cluster: station.cluster,
          coordinates: station.coordinates,
          elevation: station.elevation,
        },
        timeHorizon,
        generatedAt: new Date().toISOString(),
        telemetry: THERMAL_DATA_7D.map((item, idx) => ({
          date: item.date,
          day: item.day,
          ambientTempC: item.temp,
          dewPointC: item.dewPoint,
          rainMm: HYDROMETEOR_DATA_7D[idx]?.value || 0,
          baroHpa: 1005.8,
          windDirDeg: 180,
          windSpeedKmh: 14.2,
        })),
      };
      content = JSON.stringify(exportObject, null, 2);
    } else {
      // GRIB2 pseudo-binary meteorological structure
      mimeType = 'application/octet-stream';
      filename = `ATMOS_CLUSTER09_${timeHorizon}.grib2`;
      content = `GRIB\x00\x00\x02\x00HALDIA_METEOROLOGICAL_GRIB2_BINARY_ARCHIVE_DATASET_CLUSTER_09_UTC_WMO_77`;
    }

    // Trigger file download in browser
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#1b1c1e] border border-white/80 shadow-2xl p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2b3038] pb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-white text-[18px]">download</span>
            <span className="font-geist text-[12px] uppercase font-semibold text-white tracking-widest">
              EXPORT RAW METEOROLOGICAL TELEMETRY
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center text-[#8e9193] hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Station Summary */}
        <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/40 text-[10px] font-code-telemetry text-[#8e9193]">
          <div>TARGET: <span className="text-white font-semibold">{station.cluster}</span></div>
          <div>COORDINATES: <span className="text-white">{station.coordinates}</span></div>
          <div>HORIZON: <span className="text-white">{timeHorizon}</span></div>
        </div>

        {/* Format Selection */}
        <div className="flex flex-col gap-1">
          <span className="font-geist text-[10px] uppercase text-[#8e9193] tracking-wider">
            FILE FORMAT ENCODING
          </span>
          <div className="grid grid-cols-3 gap-1 bg-[#0d0e10] p-0.5 border border-[#2b3038]">
            {(['CSV', 'JSON', 'GRIB2'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-1.5 text-center font-code-telemetry text-[11px] font-semibold cursor-pointer ${
                  format === fmt ? 'bg-white text-black' : 'text-[#8e9193] hover:text-white'
                }`}
              >
                .{fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox for metadata */}
        <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
          <input
            type="checkbox"
            checked={includeMetadata}
            onChange={(e) => setIncludeMetadata(e.target.checked)}
            className="w-3.5 h-3.5 accent-white rounded-none cursor-pointer"
          />
          <span className="font-geist text-[11px] text-[#c4c7c9]">
            Include NIST sensor drift calibration matrix & WMO station metadata
          </span>
        </label>

        {/* CTA */}
        <button
          onClick={handleExport}
          className={`w-full mt-2 py-2.5 font-geist text-[11px] uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            downloadSuccess
              ? 'bg-white text-black font-bold'
              : 'bg-white text-black hover:bg-[#e0e3e5]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">
            {downloadSuccess ? 'check_circle' : 'file_download'}
          </span>
          <span>{downloadSuccess ? 'EXPORT COMPLETE!' : `DOWNLOAD ${format} ARCHIVE`}</span>
        </button>
      </div>
    </div>
  );
};
