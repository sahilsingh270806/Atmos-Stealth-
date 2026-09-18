import { StationInfo, HourlyForecast, DailyForecast, DayThermalPoint } from '../types';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface GroundedWeatherResponse {
  success: boolean;
  source: string;
  model?: string;
  location: string;
  summary: string;
  temp: number;
  feelsLike?: number;
  dewPoint: number;
  humidity: number;
  pressure: number;
  pressureTendency?: string;
  windSpeed: number;
  windDirection: string;
  peakGust: number;
  uvIndex?: number;
  visibilityKm?: number;
  sunrise?: string;
  sunset?: string;
  highToday?: number;
  lowToday?: number;
  condition: string;
  alert?: string | null;
  groundingSources: GroundingSource[];
  notice?: string;
  timestamp: string;
  error?: string;
}

export interface UnifiedWeatherResponse {
  success: boolean;
  source: string;
  station: StationInfo;
  location: string;
  current: {
    temp: number;
    feelsLike?: number;
    dewPoint: number;
    humidity: number;
    pressure: number;
    pressureTendency: string;
    windSpeed: number;
    windDirection: string;
    peakGust: number;
    uvIndex?: number;
    visibilityKm?: number;
    sunrise?: string;
    sunset?: string;
    highToday?: number;
    lowToday?: number;
    condition: string;
    alert?: string | null;
  };
  summary: string;
  synopticOutlook: string;
  hourly?: HourlyForecast[];
  daily?: DailyForecast[];
  thermal7D?: DayThermalPoint[];
  groundingSources: GroundingSource[];
  isGps?: boolean;
  timestamp: string;
  error?: string;
}

export async function queryUnifiedWeather(params: {
  query?: string;
  lat?: number;
  lon?: number;
}): Promise<UnifiedWeatherResponse> {
  const response = await fetch('/api/weather/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchSearchGroundedWeather(
  location: string,
  query?: string
): Promise<GroundedWeatherResponse> {
  const response = await fetch('/api/weather/live-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ location, query }),
  });

  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }

  return response.json();
}
