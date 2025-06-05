import { WeatherDataPoint, City } from "../types/weather";

export interface WeatherState {
    city: City;
    unit: "metric" | "imperial";
    data: WeatherDataPoint[];
    error: string | null;
    loading: boolean;
    appStart?: number;
}

export type WeatherAction =
    | { type: "FETCH_WEATHER" }
    | { type: "FETCH_SUCCESS"; payload: WeatherDataPoint[] }
    | { type: "FETCH_ERROR"; payload: string }
    | { type: "CHANGE_CITY"; payload: City }
    | { type: "TOGGLE_UNIT" }
    | { type: "CLEAR_ERROR" };

export const initialState: WeatherState = {
    city: "London",
    unit: "metric",
    data: [],
    error: null,
    loading: false,
};

export const weatherReducer = (
    state: WeatherState,
    action: WeatherAction
): WeatherState => {
    switch (action.type) {
        case "FETCH_WEATHER":
            return { ...state, loading: true, error: null };
        case "FETCH_SUCCESS":
            return { ...state, loading: false, data: action.payload };
        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload };
        case "CHANGE_CITY":
            return { ...state, city: action.payload, error: null };
        case "TOGGLE_UNIT":
            return {
                ...state,
                unit: state.unit === "metric" ? "imperial" : "metric",
            };
        case "CLEAR_ERROR":
            return { ...state, error: null };
        default:
            return state;
    }
};
