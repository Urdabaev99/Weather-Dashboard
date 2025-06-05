import type { ForecastResponse, City } from '../types/weather';

import forecastLondon from './mockData/forecast-london.json';
import forecastNewYork from './mockData/forecast-newyork.json';
import forecastTokyo from './mockData/forecast-tokyo.json';
import forecastSydney from './mockData/forecast-sydney.json';
import forecastCairo from './mockData/forecast-cairo.json';

const mockData: Record<City, ForecastResponse> = {
  London: forecastLondon,
  'New York': forecastNewYork,
  Tokyo: forecastTokyo,
  Sydney: forecastSydney,
  Cairo: forecastCairo
};

export const fetchMockWeather = async (city: City): Promise<ForecastResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockData[city]), 500);
  });
};
