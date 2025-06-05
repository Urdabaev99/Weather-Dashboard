import { useReducer, useEffect, useCallback } from "react";
import {
    weatherReducer,
    initialState,
} from "../reducers/weatherReducer";
import { fetchWeather } from "../api/weatherApi";
import { City } from "../types/weather";
import { throttle } from "../utils/throttle";

export const useWeatherData = () => {
    const [state, dispatch] = useReducer(weatherReducer, initialState);
    const { city } = state;

    const fetchData = useCallback(
        throttle(async () => {
            dispatch({ type: "FETCH_WEATHER" });
            try {
                const data = await fetchWeather(city as City);
                const sorted = data.list;
                dispatch({ type: "FETCH_SUCCESS", payload: sorted });
            } catch (error: any) {
                dispatch({ type: "FETCH_ERROR", payload: error.message });
            }
        }, 5000),
        [city]
    );

    useEffect(() => {
        fetchData();
    }, [city, fetchData]);

    const changeCity = (newCity: City) => {
        dispatch({ type: "CHANGE_CITY", payload: newCity });
    };

    const toggleUnit = () => {
        dispatch({ type: "TOGGLE_UNIT" });
    };

    const clearError = () => {
        dispatch({ type: "CLEAR_ERROR" });
    };

    return {
        state,
        changeCity,
        toggleUnit,
        clearError,
        fetchData,
    };
};
