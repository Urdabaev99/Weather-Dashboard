import React from "react";
import { WeatherDataPoint } from "../../types/weather";
import { toCelsius, toFahrenheit } from "../../utils/temperature";
import style from "./WeatherDisplay.module.scss";

interface Props {
    data: WeatherDataPoint | undefined;
    unit: "metric" | "imperial";
    showIcons: boolean;
    showDescription: boolean;
    selectedCity: string;
}

const WeatherDisplay: React.FC<Props> = ({
    data,
    unit,
    showIcons,
    showDescription,
    selectedCity,
}) => {
    if (!data) return <div>No data available</div>;
    const tempK = data.main.temp;
    const temp = unit === "metric" ? toCelsius(tempK) : toFahrenheit(tempK);
    const description = data.weather[0]?.description;
    const feelsLikeK = data.main.feels_like;
    const icon = data.weather[0]?.icon;

    return (
        <div className={style.weatherDisplay}>
            <h1 className={style.weatherDisplay__city}>{selectedCity}</h1>
            <div className={style.weatherDisplay__content}>
                <div className={style.weatherDisplay__icon}>
                    {showIcons && icon && (
                        <img
                            src={`https://openweathermap.org/img/wn/${icon}.png`}
                            alt=""
                        />
                    )}
                </div>
                <div className={style.weatherDisplay__info}>
                    <div className={style.weatherDisplay__temp}>
                        {temp}°{unit === "metric" ? "C" : "F"}
                    </div>
                    <div className={style.weatherDisplay__desc}>
                        {showDescription && <div>{description}</div>}
                    </div>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default WeatherDisplay;
