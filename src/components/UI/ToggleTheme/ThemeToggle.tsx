import React, { useContext } from "react";
import cls from "./ThemeToggle.module.scss";
import { classNames } from "../../../utils/classNames";
import MoonIcon from "../../../shared/icons/MoonIcon";
import SunIcon from "../../../shared/icons/SunIcon";
import { ThemeContext } from "../../../context/ThemeContext";

const ThemeToggle: React.FC = () => {
    const { darkMode, toggleTheme } = useContext(ThemeContext);

    return (
        <div className={cls.themeToggle}>
            <div className={cls.themeToggle__wrapper}>
                <button
                    onClick={() => {
                        if (!darkMode) {
                            toggleTheme();
                        }
                    }}
                    className={classNames(
                        cls.themeToggle__btn,
                        { [cls.active]: darkMode },
                        ["themeToggle__moon"]
                    )}
                >
                    <MoonIcon className={cls.themeToggle__svg} />
                </button>

                <div className={cls.themeToggle__track}>
                    <button
                        onClick={toggleTheme}
                        className={classNames(cls.themeToggle__toggle, {
                            [cls.active]: !darkMode,
                        })}
                    />
                </div>

                <button
                    onClick={() => {
                        if (darkMode) {
                            toggleTheme();
                        }
                    }}
                    className={classNames(cls.themeToggle__btn, {
                        [cls.active]: !darkMode,
                    })}
                >
                    <SunIcon className={cls.themeToggle__svg} />
                </button>
            </div>
        </div>
    );
};

export default ThemeToggle;
