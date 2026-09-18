import { StationInfo, DayThermalPoint, HydrometeorDay, WeatherAlert, HourlyForecast, DailyForecast } from '../types';

export const STATIONS: StationInfo[] = [
  {
    id: 'haldia-09',
    name: 'Haldia Port',
    cluster: 'HALDIA PORT // SENSOR CLUSTER 09',
    coordinates: '22.0667° N, 88.0698° E',
    elevation: '6.2m MSL',
    status: 'ONLINE',
    ttl: '10m',
    latency: '14ms',
  },
  {
    id: 'paradip-rig',
    name: 'Paradip Oceanic Rig',
    cluster: 'PARADIP DEEP // BUOY CLUSTER 04',
    coordinates: '20.2644° N, 86.6872° E',
    elevation: '0.0m MSL',
    status: 'ONLINE',
    ttl: '8m',
    latency: '18ms',
  },
  {
    id: 'sagar-island',
    name: 'Sagar Island Estuary',
    cluster: 'SAGAR ISLE // TIDE ARRAY 02',
    coordinates: '21.6500° N, 88.0800° E',
    elevation: '3.1m MSL',
    status: 'ONLINE',
    ttl: '12m',
    latency: '11ms',
  },
  {
    id: 'vizag-cluster',
    name: 'Visakhapatnam Deep',
    cluster: 'VIZAG NAVAL // CLUSTER 11',
    coordinates: '17.6868° N, 83.2185° E',
    elevation: '45.0m MSL',
    status: 'STANDBY',
    ttl: '15m',
    latency: '22ms',
  },
];

export const TIMEFRAME_LABELS: Record<string, string> = {
  '24H': '21 OCT 00:00 — 21 OCT 23:59 UTC',
  '7D': '15 OCT 00:00 — 21 OCT 23:59 UTC',
  '30D': '22 SEP 00:00 — 21 OCT 23:59 UTC',
  'SEASON': 'POST-MONSOON CONVECTIVE CYCLE (OCT—DEC)',
  'ALL': 'ARCHIVE CYCLE 2024.1 — 2024.10 UTC',
};

export const THERMAL_DATA_7D: DayThermalPoint[] = [
  { day: '15 MON', date: '15 OCT', temp: 29.4, dewPoint: 24.2 },
  { day: '16 TUE', date: '16 OCT', temp: 27.6, dewPoint: 23.5 },
  { day: '17 WED', date: '17 OCT', temp: 24.0, dewPoint: 22.8, isTrough: true },
  { day: '18 THU', date: '18 OCT', temp: 33.1, dewPoint: 25.1, isPeak: true },
  { day: '19 FRI', date: '19 OCT', temp: 26.8, dewPoint: 24.8 },
  { day: '20 SAT', date: '20 OCT', temp: 28.9, dewPoint: 23.2 },
  { day: '21 SUN', date: '21 OCT', temp: 27.8, dewPoint: 23.4 },
];

export const HYDROMETEOR_DATA_7D: HydrometeorDay[] = [
  { dayLabel: 'M', fullDate: '15 OCT', value: 2.1 },
  { dayLabel: 'T', fullDate: '16 OCT', value: 0.0 },
  { dayLabel: 'W', fullDate: '17 OCT', value: 14.4 },
  { dayLabel: 'T', fullDate: '18 OCT', value: 6.8 },
  { dayLabel: 'F', fullDate: '19 OCT', value: 48.5, isPeak: true },
  { dayLabel: 'S', fullDate: '20 OCT', value: 18.2 },
  { dayLabel: 'S', fullDate: '21 OCT', value: 4.2 },
];

export const HOURLY_FORECAST_DATA: HourlyForecast[] = [
  { time: '00:00 UTC', temp: 25.8, dewPoint: 23.4, pressure: 1005.8, pop: 45, windSpeed: 14.2, windDir: '180° S', condition: 'Convective Trough', icon: 'cyclone' },
  { time: '03:00 UTC', temp: 25.2, dewPoint: 23.6, pressure: 1005.2, pop: 65, windSpeed: 18.5, windDir: '175° S', condition: 'Maritime Showers', icon: 'rainy' },
  { time: '06:00 UTC', temp: 27.4, dewPoint: 24.0, pressure: 1004.9, pop: 85, windSpeed: 24.0, windDir: '185° S', condition: 'Squall Line Influx', icon: 'thunderstorm' },
  { time: '09:00 UTC', temp: 31.2, dewPoint: 25.0, pressure: 1004.4, pop: 90, windSpeed: 32.5, windDir: '180° S', condition: 'Peak Convective Burst', icon: 'thunderstorm' },
  { time: '12:00 UTC', temp: 32.8, dewPoint: 24.8, pressure: 1004.2, pop: 70, windSpeed: 28.0, windDir: '190° SSW', condition: 'Severe Precipitation', icon: 'rainy' },
  { time: '15:00 UTC', temp: 29.5, dewPoint: 24.2, pressure: 1005.0, pop: 50, windSpeed: 22.0, windDir: '195° SSW', condition: 'Scattered Storm Cells', icon: 'storm' },
  { time: '18:00 UTC', temp: 27.2, dewPoint: 23.9, pressure: 1006.1, pop: 30, windSpeed: 16.4, windDir: '200° SSW', condition: 'Post-Frontal Mist', icon: 'foggy' },
  { time: '21:00 UTC', temp: 26.1, dewPoint: 23.5, pressure: 1006.8, pop: 20, windSpeed: 12.8, windDir: '190° S', condition: 'Stable Maritime Deck', icon: 'air' },
];

export const DAILY_FORECAST_DATA: DailyForecast[] = [
  { day: 'TODAY', date: '21 OCT', high: 33.1, low: 24.0, precipMm: 4.2, pop: 45, wind: '180° S // 22 KT', waveHeight: '1.8m Moderate', condition: 'Convective Trough', icon: 'thunderstorm' },
  { day: '22 TUE', date: '22 OCT', high: 31.8, low: 24.5, precipMm: 12.6, pop: 60, wind: '175° S // 26 KT', waveHeight: '2.4m Rough', condition: 'Maritime Squall', icon: 'rainy' },
  { day: '23 WED', date: '23 OCT', high: 30.2, low: 23.8, precipMm: 34.0, pop: 85, wind: '160° SSE // 34 KT', waveHeight: '3.2m Very Rough', condition: 'Depression Vector', icon: 'cyclone' },
  { day: '24 THU', date: '24 OCT', high: 28.5, low: 23.0, precipMm: 22.1, pop: 75, wind: '190° SSW // 28 KT', waveHeight: '2.8m Rough', condition: 'Heavy Showers', icon: 'thunderstorm' },
  { day: '25 FRI', date: '25 OCT', high: 29.8, low: 22.5, precipMm: 6.4, pop: 35, wind: '210° SW // 18 KT', waveHeight: '1.9m Moderate', condition: 'Scattered Marine Cells', icon: 'air' },
  { day: '26 SAT', date: '26 OCT', high: 31.4, low: 22.0, precipMm: 1.0, pop: 15, wind: '225° SW // 12 KT', waveHeight: '1.2m Slight', condition: 'Maritime High Deck', icon: 'partly_cloudy_day' },
  { day: '27 SUN', date: '27 OCT', high: 32.0, low: 22.4, precipMm: 0.0, pop: 10, wind: '210° SW // 10 KT', waveHeight: '0.9m Calm', condition: 'Clear Maritime Horizon', icon: 'sunny' },
];

export const WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: 'ALT-104',
    severity: 'CRITICAL',
    title: 'BAROMETRIC TROUGH CRITICAL INFLUX',
    category: 'CYCLONIC MONITORING',
    timestamp: '21 OCT 11:42 UTC',
    metric: '1004.2 hPa (-2.4 hPa/3h)',
    threshold: '< 1004.0 hPa CRITICAL',
    details: 'Rapid central core pressure reduction verified by primary and secondary quartz resonators. Deep cyclonic threshold proximate.',
    acknowledged: false,
  },
  {
    id: 'ALT-103',
    severity: 'WARNING',
    title: 'PEAK GUST FLUX EXCEEDS 40 KM/H',
    category: 'ANEMOMETRY ADVISORY',
    timestamp: '21 OCT 09:15 UTC',
    metric: '42.8 km/h S Vector (180°)',
    threshold: '> 40.0 km/h GALE GATE',
    details: 'Low-level maritime wind shear entering Haldia navigation channel. Pilot vessel boarding restrictions in effect.',
    acknowledged: true,
  },
  {
    id: 'ALT-102',
    severity: 'WARNING',
    title: 'CONVECTIVE PRECIPITATION BURST',
    category: 'HYDROMETEOR RATE',
    timestamp: '19 OCT 14:20 UTC',
    metric: '22.4 mm/h Max Rate',
    threshold: '> 20.0 mm/h BURST',
    details: 'Single-event accumulator registered 48.5mm total 24h flux. Ground drainage saturation at 94%.',
    acknowledged: true,
  },
  {
    id: 'ALT-101',
    severity: 'ADVISORY',
    title: 'SOLAR RADIATION FLUX ANOMALY',
    category: 'RADIOMETRY DRIFT',
    timestamp: '18 OCT 13:00 UTC',
    metric: '7.4 UVI Peak (Sigma +1.4)',
    threshold: '> 7.0 UVI MARGIN',
    details: 'Thermal oscillation dev +1.8°C above 30-year regional baseline. Calibration delta verified at 0.2%.',
    acknowledged: false,
  },
];
