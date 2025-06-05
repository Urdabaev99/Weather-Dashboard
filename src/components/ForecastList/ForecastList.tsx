import React from "react";
import { WeatherDataPoint } from "../../types/weather";
import { toCelsius, toFahrenheit } from "../../utils/temperature";
import style from "./ForecastList.module.scss";

interface Props {
    data: WeatherDataPoint[];
    unit: "metric" | "imperial";
    showIcons: boolean;
    showDescription: boolean;
}

const ForecastList: React.FC<Props> = ({
    data,
    unit,
    showIcons,
    showDescription,
}) => {
    if (data.length === 0) return <div>No forecast data</div>;

    const firstFive = data.slice(0, 5);

    return (
        <div className={style.forecastList}>
            <div className={style.forecastList__title}>Forecast for 5 days</div>
            <div className={style.forecastList__wrapper}>
                {firstFive.map((point) => {
                    const tempK = point.main.temp;
                    const temp =
                        unit === "metric"
                            ? toCelsius(tempK)
                            : toFahrenheit(tempK);
                    const date = new Date(point.dt * 1000).toLocaleString();
                    const icon = point.weather[0]?.icon;
                    const description = point.weather[0]?.description;
                    return (
                        <div
                            key={point.dt}
                            className={style.forecastList__item}
                        >
                            <div className={style.forecastList__date}>
                                {date}
                            </div>
                            <div className={style.forecastList__temp}>
                                {temp}°{unit === "metric" ? "C" : "F"}
                            </div>
                            {showDescription && (
                                <div className={style.forecastList__desc}>
                                    {description}
                                </div>
                            )}
                            {showIcons && icon && (
                                <img
                                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                                    alt=""
                                    className={style.forecastList__icon}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ForecastList;
