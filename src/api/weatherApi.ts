import { ForecastResponse, City } from "../types/weather";

const API_KEY = import.meta.env.VITE_API_KEY;
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const fetchWeather = async (city: City): Promise<ForecastResponse> => {
    if (USE_MOCK) {
        const { fetchMockWeather } = await import("./mockWeatherApi");
        return fetchMockWeather(city);
    }
    if (!API_KEY) {
        throw new Error("API key is missing. Set VITE_API_KEY in .env");
    }
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`
    );
    if (!response.ok) {
        throw new Error(
            `Error fetching weather for ${city}: ${response.statusText}`
        );
    }
    const data = (await response.json()) as ForecastResponse;
    return data;
};
