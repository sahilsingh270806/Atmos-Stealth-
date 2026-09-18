/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { StationInfo, TimeHorizon, ActiveTab } from './types';
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
import { SearchGroundingPanel } from './components/SearchGroundingPanel';
import { fetchSearchGroundedWeather, GroundedWeatherResponse } from './services/groundingService';

export default function App() {
  const [currentStation, setCurrentStation] = useState<StationInfo>(STATIONS[0]);
  const [activeHorizon, setActiveHorizon] = useState<TimeHorizon>('7D');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');

  // Grounding state
  const [groundedData, setGroundedData] = useState<GroundedWeatherResponse | null>(null);
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);

  // Modals state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Filter units
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [pressureUnit, setPressureUnit] = useState<'hPa' | 'inHg'>('hPa');
  const [windUnit, setWindUnit] = useState<'km/h' | 'kt'>('km/h');

  // Load grounded data for station
  const loadGroundedData = useCallback(async (customLocation?: string) => {
    setIsGroundingLoading(true);
    try {
      const loc = customLocation || `${currentStation.name}, West Bengal coastal radar zone`;
      const data = await fetchSearchGroundedWeather(loc);
      setGroundedData(data);
    } catch (err) {
      console.error('Failed to load grounded weather:', err);
    } finally {
      setIsGroundingLoading(false);
    }
  }, [currentStation.name]);

  useEffect(() => {
    loadGroundedData();
  }, [loadGroundedData]);

  return (
    <div className="min-h-screen bg-[#121315] text-[#e3e2e5] font-hanken flex flex-col antialiased selection:bg-white selection:text-black">
      {/* Fixed Top Header */}
      <Header
        currentStation={currentStation}
        onSelectStation={(s) => {
          setCurrentStation(s);
        }}
        onOpenFilter={() => setIsFilterOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-14 pb-20 flex flex-col">
        {/* Google Search Grounding Ingest Console Bar (Visible across screens) */}
        <SearchGroundingPanel
          groundedData={groundedData}
          isLoading={isGroundingLoading}
          onRefresh={(custom) => loadGroundedData(custom)}
        />

        {/* Analytics Tab (Exact Screen from User's Screenshot & HTML) */}
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
              data={THERMAL_DATA_7D}
              temperatureUnit={tempUnit}
            />

            {/* Section 2: Barometric Tendency // Gradient */}
            <BarometricChart
              pressureUnit={pressureUnit}
            />

            {/* Section 3: Hydrometeor Accumulation // 7-Day */}
            <HydrometeorChart
              data={HYDROMETEOR_DATA_7D}
            />

            {/* Section 4: Wind Vector & Gust Profile */}
            <WindVectorCard
              windSpeedUnit={windUnit}
            />

            {/* Section 5: Station Sensor Health // Telemetry */}
            <SensorHealthGrid
              onDownloadTelemetry={() => setIsExportOpen(true)}
            />
          </div>
        )}

        {/* Forecast Tab */}
        {activeTab === 'forecast' && (
          <ForecastView station={currentStation} />
        )}

        {/* Radar Tab */}
        {activeTab === 'radar' && (
          <RadarView station={currentStation} />
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <AlertsView />
        )}
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
