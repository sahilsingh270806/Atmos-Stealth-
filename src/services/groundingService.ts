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
  dewPoint: number;
  humidity: number;
  pressure: number;
  pressureTendency?: string;
  windSpeed: number;
  windDirection: string;
  peakGust: number;
  condition: string;
  alert?: string | null;
  groundingSources: GroundingSource[];
  notice?: string;
  timestamp: string;
  error?: string;
}

export async function fetchSearchGroundedWeather(
  location: string,
  query?: string
): Promise<GroundedWeatherResponse> {
  const response = await fetch("/api/weather/live-search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location, query }),
  });

  if (!response.ok) {
    throw new Error(`Server returned HTTP ${response.status}`);
  }

  return response.json();
}
