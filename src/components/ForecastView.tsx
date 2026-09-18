import React, { useState } from 'react';
import { StationInfo, HourlyForecast, DailyForecast } from '../types';
import { HOURLY_FORECAST_DATA, DAILY_FORECAST_DATA } from '../data/mockData';

interface ForecastViewProps {
  station: StationInfo;
  temperatureUnit?: 'C' | 'F';
  hourlyData?: HourlyForecast[];
  dailyData?: DailyForecast[];
  synopticSummary?: string;
  currentTemp?: number;
  feelsLike?: number;
  condition?: string;
  humidity?: number;
  dewPoint?: number;
  pressure?: number;
  windSpeed?: number;
  windDirection?: string;
  peakGust?: number;
  uvIndex?: number;
  visibilityKm?: number;
  sunrise?: string;
  sunset?: string;
  highToday?: number;
  lowToday?: number;
  locationName?: string;
  isGpsActive?: boolean;
  groundingSources?: Array<{ title: string; url: string }>;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  station,
  temperatureUnit = 'C',
  hourlyData,
  dailyData,
  synopticSummary,
  currentTemp = 29.4,
  feelsLike,
  condition = 'Scattered Cloud Field',
  humidity = 76,
  dewPoint = 23.8,
  pressure = 1005.8,
  windSpeed = 14.2,
  windDirection = '180° S',
  peakGust = 22.0,
  uvIndex = 5.2,
  visibilityKm = 10,
  sunrise = '05:45 AM',
  sunset = '06:15 PM',
  highToday,
  lowToday,
  locationName,
  isGpsActive = false,
  groundingSources,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily' | 'details'>('hourly');

  const activeHourly = hourlyData && hourlyData.length > 0 ? hourlyData : HOURLY_FORECAST_DATA;
  const activeDaily = dailyData && dailyData.length > 0 ? dailyData : DAILY_FORECAST_DATA;

  const resolvedHigh = highToday ?? (activeDaily[0]?.high || Math.round(currentTemp + 3));
  const resolvedLow = lowToday ?? (activeDaily[0]?.low || Math.round(currentTemp - 5));
  const resolvedFeelsLike = feelsLike ?? (currentTemp + 1.8);

  const formatTemp = (celsius: number) => {
    if (temperatureUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32) + '°F';
    }
    return Math.round(celsius) + '°C';
  };

  const formatVal = (celsius: number) => {
    if (temperatureUnit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  // UV index category helper
  const getUvCategory = (uv: number) => {
    if (uv <= 2) return { label: 'Low', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Moderate', color: 'text-amber-300' };
    if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
    if (uv <= 10) return { label: 'Very High', color: 'text-rose-400' };
    return { label: 'Extreme', color: 'text-purple-400' };
  };

  const uvInfo = getUvCategory(uvIndex);

  // Weather icon mapping for Google Weather feel
  const getWeatherSymbol = (condName: string) => {
    const c = condName.toLowerCase();
    if (c.includes('thunder') || c.includes('storm')) return 'thunderstorm';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rainy';
    if (c.includes('clear') || c.includes('sunny')) return 'sunny';
    if (c.includes('partly') || c.includes('scattered')) return 'partly_cloudy_day';
    if (c.includes('fog') || c.includes('mist')) return 'foggy';
    if (c.includes('snow')) return 'ac_unit';
    return 'cloud';
  };

  const currentIcon = getWeatherSymbol(condition);

  return (
    <div className="flex flex-col w-full pb-8">
      {/* Observation Overview Card (Atmos Stealth Instrumentation Theme) */}
      <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038] p-4 shadow-sm relative">
        {/* Location & Time Stamp */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-[#c4c7c9] text-[18px]">
                {isGpsActive ? 'my_location' : 'location_on'}
              </span>
              <h1 className="font-geist text-[17px] sm:text-[19px] font-bold tracking-tight text-white uppercase">
                {locationName || station.name}
              </h1>
              {isGpsActive && (
                <span className="px-1.5 py-0.5 bg-[#0d0e10] text-[#c4c7c9] text-[9px] font-code-telemetry uppercase tracking-wider border border-[#444749] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  GPS ACTIVE
                </span>
              )}
            </div>
            <span className="font-code-telemetry text-[11px] text-[#8e9193] mt-0.5">
              TELEMETRY FEED // UPDATED {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0d0e10] px-2 py-1 border border-[#2b3038]">
            <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
            <span className="font-code-telemetry text-[10px] text-white font-medium">LIVE</span>
          </div>
        </div>

        {/* Big Temperature & Main Condition Display (Atmos Stealth Precision) */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <span className="font-code-telemetry text-[52px] sm:text-[60px] font-bold text-white tracking-tight leading-none">
              {formatVal(currentTemp)}°
            </span>
            <div className="flex flex-col">
              <span className="font-geist text-[16px] sm:text-[18px] font-semibold text-white leading-tight">
                {condition}
              </span>
              <span className="font-geist text-[12px] text-[#9ca3af] mt-0.5">
                Feels like {formatVal(resolvedFeelsLike)}°
              </span>
              <span className="font-code-telemetry text-[11px] text-[#c4c7c9] mt-0.5">
                HIGH {formatVal(resolvedHigh)}° // LOW {formatVal(resolvedLow)}°
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-[#0d0e10] border border-[#2b3038] flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px] sm:text-[42px] text-white">
                {currentIcon}
              </span>
            </div>
          </div>
        </div>

        {/* Synoptic Outlook Summary */}
        <div className="mt-3.5 pt-2.5 border-t border-[#2b3038]/60 flex flex-col gap-1.5 text-[12px] text-[#c4c7c9] leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#8e9193] text-[16px] mt-0.5 flex-shrink-0">
              terminal
            </span>
            <p className="flex-1 font-hanken">
              {synopticSummary ||
                `Current weather observations for ${locationName || station.name}. Barometric pressure steady at ${pressure} hPa with sustained surface winds at ${windSpeed} km/h.`}
            </p>
          </div>

          {groundingSources && groundingSources.length > 0 && (
            <div className="flex items-center gap-2 text-[10px] font-code-telemetry text-[#8e9193] pl-6 flex-wrap">
              <span>VERIFIED VIA:</span>
              {groundingSources.slice(0, 2).map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c4c7c9] hover:text-white underline truncate max-w-[200px]"
                  title={src.title}
                >
                  {src.title} ↗
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Tabs (Stealth Navigation) */}
      <div className="mx-4 mt-3 flex items-center gap-1 bg-[#151619] p-1 border border-[#2b3038]">
        <button
          type="button"
          onClick={() => setActiveTab('hourly')}
          className={`flex-1 py-1.5 px-3 text-[11px] font-geist font-bold uppercase tracking-wider cursor-pointer transition text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'hourly'
              ? 'bg-white text-black'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">schedule</span>
          <span>Hourly Forecast</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('daily')}
          className={`flex-1 py-1.5 px-3 text-[11px] font-geist font-bold uppercase tracking-wider cursor-pointer transition text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'daily'
              ? 'bg-white text-black'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">calendar_month</span>
          <span>7-Day Outlook</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-1.5 px-3 text-[11px] font-geist font-bold uppercase tracking-wider cursor-pointer transition text-center flex items-center justify-center gap-1.5 ${
            activeTab === 'details'
              ? 'bg-white text-black'
              : 'text-[#9ca3af] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">grid_view</span>
          <span>Sensors & Details</span>
        </button>
      </div>

      {/* TAB 1: 24-Hour Hourly Timeline Carousel */}
      {activeTab === 'hourly' && (
        <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038] p-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2b3038]/50">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-white text-[16px]">schedule</span>
              <span className="font-geist text-[11px] uppercase font-bold text-white tracking-wider">
                24-Hour Stepped Timeline
              </span>
            </div>
            <span className="font-code-telemetry text-[10px] text-[#8e9193]">
              TAP HOUR FOR SENSOR METRICS
            </span>
          </div>

          {/* Horizontal Hourly Sequence */}
          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {activeHourly.map((hr, index) => {
              const isSelected = selectedHour === index;
              const sym = getWeatherSymbol(hr.condition);
              return (
                <div
                  key={`${hr.time}-${index}`}
                  onClick={() => setSelectedHour(index)}
                  className={`flex-shrink-0 w-24 p-2.5 border transition-all cursor-pointer flex flex-col items-center text-center ${
                    isSelected
                      ? 'border-white bg-[#222428] ring-1 ring-white/20'
                      : 'border-[#2b3038] bg-[#0d0e10] hover:border-[#525866] hover:bg-[#141518]'
                  }`}
                >
                  <span className="font-code-telemetry text-[11px] font-semibold text-[#9ca3af] uppercase">
                    {hr.time}
                  </span>

                  <span className="material-symbols-outlined text-white text-[24px] my-1.5">
                    {sym}
                  </span>

                  <span className="font-code-telemetry text-[15px] font-bold text-white">
                    {formatVal(hr.temp)}°
                  </span>

                  {/* Precipitation % */}
                  <div className="flex items-center gap-1 text-[9px] font-code-telemetry mt-1.5 text-[#c4c7c9]">
                    <span className="material-symbols-outlined text-[11px] text-[#8e9193]">water_drop</span>
                    <span>{hr.pop}%</span>
                  </div>

                  <span className="font-geist text-[8px] text-[#8e9193] mt-1 truncate w-full">
                    {hr.windDir.split(' ')[1] || hr.windDir}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Hour Detailed Inspector */}
          {selectedHour !== null && activeHourly[selectedHour] && (
            <div className="mt-3 p-3 bg-[#0d0e10] border border-[#2b3038] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="font-code-telemetry font-bold text-white uppercase">
                  {activeHourly[selectedHour].time}:
                </span>
                <span className="text-[#c4c7c9] font-medium font-geist">
                  {activeHourly[selectedHour].condition}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#9ca3af] font-code-telemetry">
                <span>Dew Point: <strong className="text-white">{formatVal(activeHourly[selectedHour].dewPoint)}°</strong></span>
                <span>Wind: <strong className="text-white">{activeHourly[selectedHour].windSpeed} km/h</strong></span>
                <span>Pressure: <strong className="text-white">{activeHourly[selectedHour].pressure} hPa</strong></span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: 7-Day Forecast Matrix */}
      {activeTab === 'daily' && (
        <section className="mx-4 mt-2 bg-[#1b1c1e] border border-[#2b3038] p-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2b3038]/50">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-white text-[16px]">calendar_month</span>
              <span className="font-geist text-[11px] uppercase font-bold text-white tracking-wider">
                7-Day High & Low Projections
              </span>
            </div>
            <span className="font-code-telemetry text-[10px] text-[#8e9193]">
              MIN / MAX HORIZON
            </span>
          </div>

          <div className="flex flex-col divide-y divide-[#2b3038]/50 bg-[#0d0e10] border border-[#2b3038]">
            {activeDaily.map((d, index) => {
              const sym = getWeatherSymbol(d.condition);
              const minVal = formatVal(d.low);
              const maxVal = formatVal(d.high);
              const minLimit = 15;
              const maxLimit = 42;
              const barLeft = Math.max(0, Math.min(80, ((d.low - minLimit) / (maxLimit - minLimit)) * 100));
              const barWidth = Math.max(15, Math.min(85, ((d.high - d.low) / (maxLimit - minLimit)) * 100));

              return (
                <div
                  key={`${d.day}-${index}`}
                  className="p-3 flex items-center justify-between hover:bg-[#151619] transition-colors"
                >
                  {/* Day Label & Weather Icon */}
                  <div className="flex items-center gap-3 w-32">
                    <span className="material-symbols-outlined text-white text-[20px]">
                      {sym}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-geist text-[12px] uppercase font-bold text-white leading-tight">
                        {d.day}
                      </span>
                      <span className="font-code-telemetry text-[9px] text-[#8e9193]">
                        {d.date}
                      </span>
                    </div>
                  </div>

                  {/* Precipitation Probability % */}
                  <div className="w-16 flex items-center gap-1 text-[11px] font-code-telemetry text-[#c4c7c9]">
                    <span className="material-symbols-outlined text-[13px] text-[#8e9193]">water_drop</span>
                    <span>{d.pop}%</span>
                  </div>

                  {/* Condition Text */}
                  <div className="hidden sm:block flex-1 px-3 text-[11px] font-geist text-[#c4c7c9] truncate">
                    {d.condition}
                  </div>

                  {/* Tactical Temperature Range Bar */}
                  <div className="flex items-center gap-2 font-code-telemetry text-[12px] w-40 justify-end">
                    <span className="text-[#9ca3af] font-medium w-7 text-right">{minVal}°</span>
                    <div className="w-20 h-1.5 bg-[#222428] rounded-full relative overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-[#6b7280] via-[#c4c7c9] to-white rounded-full"
                        style={{
                          left: `${barLeft}%`,
                          width: `${barWidth}%`,
                        }}
                      />
                    </div>
                    <span className="text-white font-bold w-7 text-left">{maxVal}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Google Weather Atmospheric Details 6-Tile Grid */}
      <section className="mx-4 mt-3 bg-[#1b1c1e] border border-[#2b3038]/60 p-3">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2b3038]/50">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">grid_view</span>
            <span className="font-geist text-[11px] uppercase font-bold text-white tracking-wider">
              Current Conditions & Essential Details
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#8e9193]">
            SENSORS ONLINE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {/* 1. Humidity */}
          <div className="p-3 bg-[#0d0e10] border border-[#2b3038]/40 flex flex-col">
            <div className="flex items-center justify-between text-[#8e9193]">
              <span className="font-geist text-[10px] uppercase font-semibold">Humidity</span>
              <span className="material-symbols-outlined text-[16px]">humidity_percentage</span>
            </div>
            <span className="font-code-telemetry text-[20px] text-white font-bold mt-1">
              {humidity}%
            </span>
            <span className="font-geist text-[10px] text-[#9ca3af] mt-0.5">
              Dew point is {formatVal(dewPoint)}°
            </span>
          </div>

          {/* 2. Wind & Gusts */}
          <div className="p-3 bg-[#0d0e10] border border-[#2b3038]/40 flex flex-col">
            <div className="flex items-center justify-between text-[#8e9193]">
              <span className="font-geist text-[10px] uppercase font-semibold">Wind</span>
              <span className="material-symbols-outlined text-[16px]">air</span>
            </div>
            <span className="font-code-telemetry text-[20px] text-white font-bold mt-1">
              {windSpeed} <span className="text-[12px] font-normal text-[#9ca3af]">km/h</span>
            </span>
            <span className="font-geist text-[10px] text-[#9ca3af] mt-0.5">
              {windDirection} • Gusts to {peakGust} km/h
            </span>
          </div>

          {/* 3. UV Index */}
          <div className="p-3 bg-[#0d0e10] border border-[#2b3038]/40 flex flex-col">
            <div className="flex items-center justify-between text-[#8e9193]">
              <span className="font-geist text-[10px] uppercase font-semibold">UV Index</span>
              <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-code-telemetry text-[20px] text-white font-bold">
                {uvIndex.toFixed(1)}
              </span>
              <span className={`font-geist text-[11px] font-bold uppercase ${uvInfo.color}`}>
                {uvInfo.label}
              </span>
            </div>
            <span className="font-geist text-[10px] text-[#9ca3af] mt-0.5">
              {uvIndex > 5 ? 'Sun protection advised' : 'Safe solar exposure'}
            </span>
          </div>

          {/* 4. Barometric Pressure */}
          <div className="p-3 bg-[#0d0e10] border border-[#2b3038]/40 flex flex-col">
            <div className="flex items-center justify-between text-[#8e9193]">
              <span className="font-geist text-[10px] uppercase font-semibold">Pressure</span>
              <span className="material-symbols-outlined text-[16px]">speed</span>
            </div>
            <span className="font-code-telemetry text-[20px] text-white font-bold mt-1">
              {pressure} <span className="text-[12px] font-normal text-[#9ca3af]">hPa</span>
            </span>
            <span className="font-geist text-[10px] text-[#9ca3af] mt-0.5">
              Tendency: Steady
            </span>
          </div>

          {/* 5. Visibility */}
          <div className="p-3 bg-[#0d0e10] border border-[#2b3038]/40 flex flex-col">
            <div className="flex items-center justify-between text-[#8e9193]">
              <span className="font-geist text-[10px] uppercase font-semibold">Visibility</span>
              <span className="material-symbols-outlined text-[16px]">visibility</span>
            </div>
            <span className="font-code-telemetry text-[20px] text-white font-bold mt-1">
              {visibilityKm} <span className="text-[12px] font-normal text-[#9ca3af]">km</span>
            </span>
            <span className="font-geist text-[10px] text-[#9ca3af] mt-0.5">
              Clear line of sight
            </span>
          </div>

          {/* 6. Sunrise & Sunset */}
          <div className="p-3 bg-[#0d0e10] border border-[#2b3038]/40 flex flex-col">
            <div className="flex items-center justify-between text-[#8e9193]">
              <span className="font-geist text-[10px] uppercase font-semibold">Sun Timing</span>
              <span className="material-symbols-outlined text-[16px]">routine</span>
            </div>
            <div className="flex flex-col gap-0.5 mt-1 text-[11px] font-code-telemetry text-white">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-amber-300">wb_twilight</span>
                Sunrise: {sunrise}
              </span>
              <span className="flex items-center gap-1 text-[#c4c7c9]">
                <span className="material-symbols-outlined text-[13px] text-orange-400">nights_stay</span>
                Sunset: {sunset}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Stability & Sounding Matrix (For deep technical instrumentation) */}
      <section className="mx-4 mt-3 bg-[#1b1c1e] border border-[#2b3038]/60 p-3">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#2b3038]/50">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-white text-[16px]">equalizer</span>
            <span className="font-geist text-[11px] uppercase font-bold text-white tracking-wider">
              Convective & Atmospheric Soundings
            </span>
          </div>
          <span className="font-code-telemetry text-[10px] text-[#8e9193]">COORDS: {station.coordinates}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">CAPE INDEX</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              1,840 J/kg
            </span>
            <span className="font-geist text-[9px] text-emerald-400 mt-0.5">MODERATE</span>
          </div>

          <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">LIFTED INDEX</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              -4.2 LI
            </span>
            <span className="font-geist text-[9px] text-amber-400 mt-0.5">CONVECTIVE</span>
          </div>

          <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">ELEVATION</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5">
              {station.elevation}
            </span>
            <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">MSL DATUM</span>
          </div>

          <div className="p-2 bg-[#0d0e10] border border-[#2b3038]/30 flex flex-col">
            <span className="font-geist text-[9px] text-[#8e9193] uppercase">RADAR CLUSTER</span>
            <span className="font-code-telemetry text-[13px] text-white font-semibold mt-0.5 truncate">
              {station.cluster.split('//')[0] || 'STATION'}
            </span>
            <span className="font-geist text-[9px] text-[#8e9193] mt-0.5">LATENCY 12ms</span>
          </div>
        </div>
      </section>
    </div>
  );
};
