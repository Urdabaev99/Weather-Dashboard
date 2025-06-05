import React, { useContext, useState, useEffect, useRef } from "react";
import CitySelector from "../CitySelector/CitySelector";
import WeatherDisplay from "../WeatherDisplay/WeatherDisplay";
import ForecastList from "../ForecastList/ForecastList";
import DataVisualization from "../DataVisualization/DataVisualization";
import SettingsPanel from "../SettingsPanel/SettingsPanel";
import ErrorBoundary from "../ErrorBoundary";
import { useWeatherData } from "../../hooks/useWeatherData";
import { ThemeContext } from "../../context/ThemeContext";
import ThemeToggle from "../UI/ToggleTheme/ThemeToggle";
import { classNames } from "../../utils/classNames";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import style from "./WeatherWidget.module.scss";
import SettingButton from "../UI/SettingButton/SettingButton";
import "./WeatherWidget.scss";

const WeatherWidget: React.FC = () => {
    const { state, changeCity, toggleUnit, clearError, fetchData } =
        useWeatherData();
    const { city, data, unit, loading, error } = state;
    const { darkMode } = useContext(ThemeContext);

    const [activeTab, setActiveTab] = useState<
        "current" | "forecast" | "stats"
    >("current");

    const [showIcons, setShowIcons] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [openSettings, setOpenSettings] = useState(false);

    const nodeRef = useRef<HTMLDivElement>(null);
    const tabRef = useRef<HTMLDivElement>(null);

    const [refreshInterval, setRefreshInterval] = useState(5000000);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData();
        }, refreshInterval);
        return () => clearInterval(intervalId);
    }, [refreshInterval, fetchData]);

    return (
        <div className={classNames(style.weatherWidget, { darkMode })}>
            <CSSTransition
                nodeRef={nodeRef}
                in={openSettings}
                timeout={300}
                classNames="settingPanel__animation"
                unmountOnExit
            >
                <div ref={nodeRef} className="settingPanel__animation">
                    <SettingsPanel
                        unit={unit}
                        toggleUnit={toggleUnit}
                        refreshInterval={refreshInterval}
                        setRefreshInterval={setRefreshInterval}
                        showIcons={showIcons}
                        toggleShowIcons={() => setShowIcons((prev) => !prev)}
                        showDescription={showDescription}
                        toggleShowDescription={() =>
                            setShowDescription((prev) => !prev)
                        }
                        onCloseSettingPanel={setOpenSettings}
                    />
                </div>
            </CSSTransition>

            <div className={style.weatherWidget__header}>
                <CitySelector selectedCity={city} onChangeCity={changeCity} />
                <div className={style.weatherWidget__headerActions}>
                    <ThemeToggle />
                    <SettingButton onOpenSettingPanel={setOpenSettings} />
                </div>
            </div>

            <div className={style.weatherWidget__tabs}>
                <button
                    className={classNames(style.weatherWidget__tab, {
                        [style.active]: activeTab === "current",
                    })}
                    onClick={() => setActiveTab("current")}
                >
                    Current Weather
                </button>
                <button
                    className={classNames(style.weatherWidget__tab, {
                        [style.active]: activeTab === "forecast",
                    })}
                    onClick={() => setActiveTab("forecast")}
                >
                    Forecast
                </button>
                <button
                    className={classNames(style.weatherWidget__tab, {
                        [style.active]: activeTab === "stats",
                    })}
                    onClick={() => setActiveTab("stats")}
                >
                    Statistics
                </button>
            </div>

            <ErrorBoundary>
                {error && <div style={{ color: "red" }}>Error: {error}</div>}
                {state.loading && (
                    <div>
                        <span className="loader"></span>
                    </div>
                )}
                {!loading && !error && (
                    <SwitchTransition mode="out-in">
                        <CSSTransition
                            key={activeTab}
                            nodeRef={tabRef}
                            timeout={300}
                            classNames="tab"
                            unmountOnExit
                        >
                            <div
                                ref={tabRef}
                                className={style.weatherWidget__content}
                            >
                                {activeTab === "current" && (
                                    <WeatherDisplay
                                        selectedCity={city}
                                        data={data[0]}
                                        unit={unit}
                                        showIcons={showIcons}
                                        showDescription={showDescription}
                                    />
                                )}
                                {activeTab === "forecast" && (
                                    <ForecastList
                                        data={data}
                                        unit={unit}
                                        showIcons={showIcons}
                                        showDescription={showDescription}
                                    />
                                )}
                                {activeTab === "stats" && (
                                    <DataVisualization
                                        data={data}
                                        unit={unit}
                                    />
                                )}
                            </div>
                        </CSSTransition>
                    </SwitchTransition>
                )}
            </ErrorBoundary>
        </div>
    );
};

export default WeatherWidget;
