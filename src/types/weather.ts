export interface WeatherDataPoint {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    feels_like: number;
  };
  weather: Array<{
    icon: string;
    description: string;
  }>;
}

export interface ForecastResponse {
  list: WeatherDataPoint[];
}

export type City = 'London' | 'New York' | 'Tokyo' | 'Sydney' | 'Cairo';
