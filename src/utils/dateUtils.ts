import { WeatherDataPoint } from '../types/weather';

export const averageDailyValues = (data: WeatherDataPoint[]): Record<string, number> => {
  const daily: Record<string, { sum: number; count: number }> = {};
  data.forEach((point) => {
    const date = new Date(point.dt * 1000).toISOString().split('T')[0];
    if (!daily[date]) {
      daily[date] = { sum: 0, count: 0 };
    }
    daily[date].sum += point.main.temp;
    daily[date].count += 1;
  });
  const result: Record<string, number> = {};
  Object.keys(daily).forEach((date) => {
    result[date] = parseFloat((daily[date].sum / daily[date].count).toFixed(2));
  });
  return result;
};

export const findMinMaxAvg = (data: WeatherDataPoint[]): { min: number; max: number; avg: number } => {
  if (data.length === 0) return { min: 0, max: 0, avg: 0 };
  const temps = data.map((d) => d.main.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const avg = parseFloat((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2));
  return { min, max, avg };
};

export const sortByDateTime = (data: WeatherDataPoint[]): WeatherDataPoint[] => {
  return [...data].sort((a, b) => a.dt - b.dt);
};
