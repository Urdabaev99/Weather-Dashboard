import React from "react";
import style from "./SettingsPanel.module.scss";
import CloseIcon from "../../shared/icons/CloseIcon";
import { classNames } from "../../utils/classNames";

interface SettingsPanelProps {
    unit: "metric" | "imperial";
    toggleUnit: () => void;
    refreshInterval: number;
    setRefreshInterval: (interval: number) => void;
    showIcons: boolean;
    toggleShowIcons: () => void;
    showDescription: boolean;
    toggleShowDescription: () => void;
    onCloseSettingPanel: (open: boolean) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    unit,
    toggleUnit,
    refreshInterval,
    setRefreshInterval,
    showIcons,
    toggleShowIcons,
    showDescription,
    toggleShowDescription,
    onCloseSettingPanel,
}) => {
    const currentSec = refreshInterval / 1000;

    const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sec = Number(e.target.value);
        setRefreshInterval(sec * 1000);
    };

    return (
        <div className={style.settingsPanel}>
            <div className={style.settingsPanel__wrapper}>
                <div className={style.settingsPanel__header}>
                    <h4 className={style.settingsPanel__title}>Settings</h4>
                    <button
                        onClick={() => onCloseSettingPanel(false)}
                        className={style.settingsPanel__close}
                    >
                        <CloseIcon className={style.settingsPanel__icon} />
                    </button>
                </div>
                <div className={style.settingsPanel__metric}>
                    <div className={style.settingsPanel__metric__title}>
                        Units of measurement:
                    </div>
                    <div
                        className={classNames(
                            style.settingsPanel__metric__btns,
                            {
                                [style.active]: unit === "imperial",
                            }
                        )}
                    >
                        <button
                            className={classNames(
                                style.settingsPanel__metric__btn,
                                {
                                    [style.active]: unit === "metric",
                                }
                            )}
                            onClick={toggleUnit}
                        >
                            °C
                        </button>
                        <button
                            className={classNames(
                                style.settingsPanel__metric__btn,
                                {
                                    [style.active]: unit === "imperial",
                                }
                            )}
                            onClick={toggleUnit}
                        >
                            °F
                        </button>
                    </div>
                </div>
                <div className={style.settingsPanel__refresh}>
                    <div className={style.settingsPanel__refresh__title}>
                        Refresh Rate
                    </div>
                    <div className={style.settingsPanel__refresh__info}>
                        <p className={style.settingsPanel__refresh__text}>
                            Update every:
                        </p>
                        <p className={style.settingsPanel__refresh__text}>
                            {currentSec}s
                        </p>
                    </div>
                    <input
                        type="range"
                        min={5}
                        max={60}
                        step={5}
                        value={currentSec}
                        onChange={handleRangeChange}
                        className={style.settingsPanel__refresh__range}
                    />
                </div>
                <div className={style.settingsPanel__display}>
                    <div className={style.settingsPanel__display__title}>
                        Display Options
                    </div>
                    <div className={style.settingsPanel__display__info}>
                        <label
                            className={style.settingsPanel__display__checkboxs}
                        >
                            <input
                                type="checkbox"
                                checked={showIcons}
                                onChange={toggleShowIcons}
                                className={
                                    style.settingsPanel__display__checkbox
                                }
                            />
                            <p className={style.settingsPanel__display__text}>
                                Show icons
                            </p>
                        </label>
                    </div>
                    <div>
                        <label
                            className={style.settingsPanel__display__checkboxs}
                        >
                            <input
                                className={
                                    style.settingsPanel__display__checkbox
                                }
                                type="checkbox"
                                checked={showDescription}
                                onChange={toggleShowDescription}
                            />
                            <p>Show description</p>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
