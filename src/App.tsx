/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { StationInfo, TimeHorizon, ActiveTab, HourlyForecast, DailyForecast } from './types';
import { STATIONS, THERMAL_DATA_7D, HYDROMETEOR_DATA_7D } from './data/mockData';
import { Header } from './components/Header';
import { TimeHorizonBar } from './components/TimeHorizonBar';
import { ThermalChart } from './components/ThermalChart';
import { BarometricChart } from './components/BarometricChart';
import { HydrometeorChart } from './components/HydrometeorChart';
import { WindVectorCard } from './components/WindVectorCard';
import { SensorHealthGrid } from './components/SensorHealthGrid';
import { ForecastView } from './components/ForecastView';
import { RadarView } from './components/RadarView';
import { AlertsView } from './components/AlertsView';
import { BottomNav } from './components/BottomNav';
import { FilterModal } from './components/FilterModal';
import { ExportModal } from './components/ExportModal';
import { ProfileModal } from './components/ProfileModal';
import { UnifiedLocationBar } from './components/UnifiedLocationBar';
import { queryUnifiedWeather, GroundedWeatherResponse } from './services/groundingService';

export default function App() {
  const [currentStation, setCurrentStation] = useState<StationInfo>(STATIONS[0]);
  const [activeHorizon, setActiveHorizon] = useState<TimeHorizon>('7D');
  // Default to forecast screen as requested
  const [activeTab, setActiveTab] = useState<ActiveTab>('forecast');

  // Location & Telemetry Mode
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationStatusMessage, setLocationStatusMessage] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Dynamic Meteorological Telemetry
  const [groundedData, setGroundedData] = useState<GroundedWeatherResponse | null>(null);
  const [hourlyData, setHourlyData] = useState<HourlyForecast[] | undefined>(undefined);
  const [dailyData, setDailyData] = useState<DailyForecast[] | undefined>(undefined);
  const [synopticOutlook, setSynopticOutlook] = useState<string | undefined>(undefined);
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);

  // Modals state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter units persisted in localStorage across browser sessions
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(() => {
    try {
      const saved = localStorage.getItem('tempUnit') || localStorage.getItem('atmos_temp_unit');
      if (saved === 'C' || saved === 'F') return saved;
    } catch {
      // Graceful fallback
    }
    return 'C';
  });

  const [pressureUnit, setPressureUnit] = useState<'hPa' | 'inHg'>(() => {
    try {
      const saved = localStorage.getItem('pressureUnit') || localStorage.getItem('atmos_pressure_unit');
      if (saved === 'hPa' || saved === 'inHg') return saved;
    } catch {
      // Graceful fallback
    }
    return 'hPa';
  });

  const [windUnit, setWindUnit] = useState<'km/h' | 'kt'>(() => {
    try {
      const saved = localStorage.getItem('windUnit') || localStorage.getItem('atmos_wind_unit');
      if (saved === 'km/h' || saved === 'kt') return saved;
    } catch {
      // Graceful fallback
    }
    return 'km/h';
  });

  // Automatically write user preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tempUnit', tempUnit);
      localStorage.setItem('atmos_temp_unit', tempUnit);
    } catch {
      // ignore
    }
  }, [tempUnit]);

  useEffect(() => {
    try {
      localStorage.setItem('pressureUnit', pressureUnit);
      localStorage.setItem('atmos_pressure_unit', pressureUnit);
    } catch {
      // ignore
    }
  }, [pressureUnit]);

  useEffect(() => {
    try {
      localStorage.setItem('windUnit', windUnit);
      localStorage.setItem('atmos_wind_unit', windUnit);
    } catch {
      // ignore
    }
  }, [windUnit]);

  // Unified weather applicator
  const applyWeatherResult = useCallback((res: any, isFromGps: boolean) => {
    if (!res || !res.success) return;

    const current = res.current || {};
    if (res.station) {
      setCurrentStation({
        ...res.station,
        temperatureC: current.temp ?? res.station.temperatureC ?? 27.8,
        dewPointC: current.dewPoint ?? res.station.dewPointC ?? 23.4,
        pressureHpa: current.pressure ?? res.station.pressureHpa ?? 1005.8,
        pressureTendency: current.pressureTendency ?? res.station.pressureTendency ?? 'STEADY MARITIME TENDENCY',
        windSpeedKmh: current.windSpeed ?? res.station.windSpeedKmh ?? 14.2,
        windDirection: current.windDirection ?? res.station.windDirection ?? '180° S',
        precipitationRate: current.precipMm !== undefined ? `${current.precipMm} mm/h` : (res.station.precipitationRate ?? '4.2 mm/h'),
      });
    }

    if (res.hourly) {
      setHourlyData(res.hourly);
    }
    if (res.daily) {
      setDailyData(res.daily);
    }
    if (res.synopticOutlook) {
      setSynopticOutlook(res.synopticOutlook);
    }

    // Build GroundedWeatherResponse structure for the search panel & badges
    setGroundedData({
      success: true,
      source: res.source,
      location: res.location || res.station?.name || 'Local Station',
      summary: res.synopticOutlook || res.summary || '',
      temp: current.temp ?? 29.4,
      feelsLike: current.feelsLike ?? Number(((current.temp ?? 29.4) + 1.8).toFixed(1)),
      dewPoint: current.dewPoint ?? 23.8,
      humidity: current.humidity ?? 76,
      pressure: current.pressure ?? 1005.8,
      pressureTendency: current.pressureTendency ?? '-1.8 hPa / 3hr',
      windSpeed: current.windSpeed ?? 14.2,
      windDirection: current.windDirection ?? '180° S',
      peakGust: current.peakGust ?? 22.0,
      uvIndex: current.uvIndex ?? 5.2,
      visibilityKm: current.visibilityKm ?? 10,
      sunrise: current.sunrise ?? '05:45 AM',
      sunset: current.sunset ?? '06:15 PM',
      highToday: current.highToday,
      lowToday: current.lowToday,
      condition: current.condition ?? 'Scattered Cloud Field',
      alert: current.alert ?? null,
      groundingSources: res.groundingSources || [],
      timestamp: res.timestamp || new Date().toISOString(),
    });

    setIsGpsActive(isFromGps);
    if (isFromGps) {
      setPermissionError(null);
      setLocationStatusMessage(`GPS Fix Locked: ${res.location}`);
    } else {
      setLocationStatusMessage(`Station Selected: ${res.location}`);
    }
  }, []);

  // Detect GPS Location
  const handleDetectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermissionError('Geolocation is not supported by your browser or device.');
      setLocationStatusMessage('Geolocation not supported by device. Using standard station.');
      return;
    }

    setIsLocating(true);
    setIsGroundingLoading(true);
    setPermissionError(null);
    setLocationStatusMessage('Requesting GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const res = await queryUnifiedWeather({ lat, lon });
          applyWeatherResult(res, true);
        } catch {
          setLocationStatusMessage('GPS telemetry query failed. Falling back to regional station.');
        } finally {
          setIsLocating(false);
          setIsGroundingLoading(false);
        }
      },
      async (err) => {
        console.warn('Geolocation access declined or timed out:', err.message);
        setIsLocating(false);
        setPermissionError(
          'Location access was denied or unavailable. Tap "Allow Location Access" to retry, or pick any city from the search bar above.'
        );
        // Seamless fallback to Haldia Port or baseline
        try {
          const res = await queryUnifiedWeather({ query: 'Haldia Port' });
          applyWeatherResult(res, false);
          setLocationStatusMessage('Location permission declined. Displaying Haldia Port baseline.');
        } catch {
          // ignore
        } finally {
          setIsGroundingLoading(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 120000,
      }
    );
  }, [applyWeatherResult]);

  // Search by text query (City, Region, Port)
  const handleSearchLocation = useCallback(
    async (query: string) => {
      if (!query || !query.trim()) return;
      setIsGroundingLoading(true);
      setPermissionError(null);
      setLocationStatusMessage(`Querying regional telemetry for "${query}"...`);

      try {
        const res = await queryUnifiedWeather({ query: query.trim() });
        applyWeatherResult(res, false);
      } catch {
        setLocationStatusMessage(`Could not resolve meteorological data for "${query}".`);
      } finally {
        setIsGroundingLoading(false);
      }
    },
    [applyWeatherResult]
  );

  // Initial load: Attempt Geolocation first; if already attempted, avoid duplicate
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      handleDetectLocation();
    }
  }, [handleDetectLocation]);

  // Dynamically calibrate 7-day thermal oscillation and hydrometeor accumulation to the active station
  const stationThermalData = useMemo(() => {
    const baseTemp = currentStation.temperatureC ?? 27.8;
    const baseDew = currentStation.dewPointC ?? (baseTemp - 4.5);
    const dayOffsets = [
      { day: '15 MON', date: '15 OCT', dTemp: +1.6, dDew: +0.8 },
      { day: '16 TUE', date: '16 OCT', dTemp: -0.2, dDew: +0.1 },
      { day: '17 WED', date: '17 OCT', dTemp: -3.8, dDew: -0.6, isTrough: true },
      { day: '18 THU', date: '18 OCT', dTemp: +5.3, dDew: +1.7, isPeak: true },
      { day: '19 FRI', date: '19 OCT', dTemp: -1.0, dDew: +1.4 },
      { day: '20 SAT', date: '20 OCT', dTemp: +1.1, dDew: -0.2 },
      { day: '21 SUN', date: '21 OCT', dTemp: 0.0, dDew: 0.0 },
    ];

    return dayOffsets.map((d) => ({
      day: d.day,
      date: d.date,
      temp: parseFloat((baseTemp + d.dTemp).toFixed(1)),
      dewPoint: parseFloat((baseDew + d.dDew).toFixed(1)),
      isPeak: d.isPeak,
      isTrough: d.isTrough,
    }));
  }, [currentStation.temperatureC, currentStation.dewPointC]);

  const stationHydrometeorData = useMemo(() => {
    const precipMatch = (currentStation.precipitationRate || '4.2').match(/([\d.]+)/);
    const basePrecip = precipMatch ? parseFloat(precipMatch[1]) : 4.2;
    const multipliers = [0.5, 0.0, 3.4, 1.6, 11.5, 4.3, 1.0];
    return [
      { dayLabel: 'M', fullDate: '15 OCT', value: parseFloat((basePrecip * multipliers[0]).toFixed(1)) },
      { dayLabel: 'T', fullDate: '16 OCT', value: 0.0 },
      { dayLabel: 'W', fullDate: '17 OCT', value: parseFloat((basePrecip * multipliers[2]).toFixed(1)) },
      { dayLabel: 'T', fullDate: '18 OCT', value: parseFloat((basePrecip * multipliers[3]).toFixed(1)) },
      { dayLabel: 'F', fullDate: '19 OCT', value: parseFloat((basePrecip * multipliers[4]).toFixed(1)), isPeak: true },
      { dayLabel: 'S', fullDate: '20 OCT', value: parseFloat((basePrecip * multipliers[5]).toFixed(1)) },
      { dayLabel: 'S', fullDate: '21 OCT', value: parseFloat(basePrecip.toFixed(1)) },
    ];
  }, [currentStation.precipitationRate]);

  return (
    <div className="min-h-screen bg-[#121315] text-[#e3e2e5] font-hanken flex flex-col antialiased selection:bg-white selection:text-black">
      {/* Fixed Top Header with Geolocation & Manual Station Selector */}
      <Header
        currentStation={currentStation}
        onSelectStation={(s) => {
          handleSearchLocation(s.name);
        }}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLocateMe={handleDetectLocation}
        onSearchQuery={handleSearchLocation}
        isGpsActive={isGpsActive}
        isLocating={isLocating}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-14 pb-20 flex flex-col">
        {/* Single Unified Commercial Location & Search Console */}
        <UnifiedLocationBar
          currentLocationName={currentStation.name}
          isGpsActive={isGpsActive}
          isLocating={isLocating}
          onSearch={handleSearchLocation}
          onRequestGps={handleDetectLocation}
          permissionError={permissionError}
          isLoadingWeather={isGroundingLoading}
        />

        {/* Forecast Tab (Default landing screen per user request) */}
        {activeTab === 'forecast' && (
          <ForecastView
            station={currentStation}
            temperatureUnit={tempUnit}
            hourlyData={hourlyData}
            dailyData={dailyData}
            synopticSummary={synopticOutlook}
            currentTemp={groundedData?.temp}
            feelsLike={groundedData?.feelsLike}
            condition={groundedData?.condition}
            humidity={groundedData?.humidity}
            dewPoint={groundedData?.dewPoint}
            pressure={groundedData?.pressure}
            windSpeed={groundedData?.windSpeed}
            windDirection={groundedData?.windDirection}
            peakGust={groundedData?.peakGust}
            uvIndex={groundedData?.uvIndex}
            visibilityKm={groundedData?.visibilityKm}
            sunrise={groundedData?.sunrise}
            sunset={groundedData?.sunset}
            highToday={groundedData?.highToday}
            lowToday={groundedData?.lowToday}
            locationName={currentStation.name}
            isGpsActive={isGpsActive}
            groundingSources={groundedData?.groundingSources}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="flex flex-col w-full animate-in fade-in duration-150">
            {/* Station Header & Horizon Control */}
            <TimeHorizonBar
              currentStation={currentStation}
              activeHorizon={activeHorizon}
              onChangeHorizon={setActiveHorizon}
              onOpenFilter={() => setIsFilterOpen(true)}
              onOpenExport={() => setIsExportOpen(true)}
            />

            {/* Section 1: Thermal Oscillation & Dew Point */}
            <ThermalChart
              data={stationThermalData}
              temperatureUnit={tempUnit}
              stationName={currentStation.name}
            />

            {/* Section 2: Barometric Tendency // Gradient */}
            <BarometricChart
              pressureUnit={pressureUnit}
              currentPressure={currentStation.pressureHpa}
              pressureTendency={currentStation.pressureTendency}
              stationName={currentStation.name}
            />

            {/* Section 3: Hydrometeor Accumulation // 7-Day */}
            <HydrometeorChart
              data={stationHydrometeorData}
              stationName={currentStation.name}
            />

            {/* Section 4: Wind Vector & Gust Profile */}
            <WindVectorCard
              windSpeedUnit={windUnit}
              windSpeed={currentStation.windSpeedKmh}
              windDirection={currentStation.windDirection}
              stationName={currentStation.name}
            />

            {/* Section 5: Station Sensor Health // Telemetry */}
            <SensorHealthGrid
              station={currentStation}
              onDownloadTelemetry={() => setIsExportOpen(true)}
            />
          </div>
        )}

        {/* Radar Tab */}
        {activeTab === 'radar' && <RadarView station={currentStation} />}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && <AlertsView station={currentStation} />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        alertsCount={4}
      />

      {/* Interactive Modals */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        tempUnit={tempUnit}
        setTempUnit={setTempUnit}
        pressureUnit={pressureUnit}
        setPressureUnit={setPressureUnit}
        windUnit={windUnit}
        setWindUnit={setWindUnit}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        station={currentStation}
        timeHorizon={activeHorizon}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        station={currentStation}
      />
    </div>
  );
}
