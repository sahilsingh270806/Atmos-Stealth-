export type TimeHorizon = '24H' | '7D' | '30D' | 'SEASON' | 'ALL';

export type ActiveTab = 'forecast' | 'radar' | 'analytics' | 'alerts';

export interface StationInfo {
  id: string;
  name: string;
  cluster: string;
  coordinates: string;
  elevation: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  ttl: string;
  latency: string;
}

export interface DayThermalPoint {
  day: string;
  date: string;
  temp: number;
  dewPoint: number;
  isPeak?: boolean;
  isTrough?: boolean;
}

export interface HydrometeorDay {
  dayLabel: string;
  fullDate: string;
  value: number;
  isPeak?: boolean;
}

export interface WeatherAlert {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  title: string;
  category: string;
  timestamp: string;
  metric: string;
  threshold: string;
  details: string;
  acknowledged: boolean;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  dewPoint: number;
  pressure: number;
  pop: number; // probability of precip %
  windSpeed: number;
  windDir: string;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  precipMm: number;
  pop: number;
  wind: string;
  waveHeight: string;
  condition: string;
  icon: string;
}
