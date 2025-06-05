import React, { useState, useEffect, useRef } from "react";
import { City } from "../../types/weather";
import { debounce } from "../../utils/debounce";
import style from "./CitySelector.module.scss";
import SearchIcon from "../../shared/icons/SearchIcon";
import { classNames } from "../../utils/classNames";
import { CSSTransition } from "react-transition-group";
import ArrowIcon from "../../shared/icons/ArrowIcon";
import "./AnimatedBox.scss";

interface CitySelectorProps {
    selectedCity: City;
    onChangeCity: (city: City) => void;
}

const cities: City[] = ["London", "New York", "Tokyo", "Sydney", "Cairo"];

const CitySelector: React.FC<CitySelectorProps> = ({
    selectedCity,
    onChangeCity,
}) => {
    const defaultCity = selectedCity || ("London" as City);

    const [search, setSearch] = useState<string>("");
    const [filtered, setFiltered] = useState<City[]>(cities);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const nodeRef = useRef<HTMLDivElement>(null);

    const handleSearch = (value: string) => {
        if (value.trim() === "") {
            setFiltered(cities);
            setError(null);
            return;
        }
        const result = cities.filter((c) =>
            c.toLowerCase().includes(value.toLowerCase())
        );
        if (result.length === 0) {
            setError("City not found");
        } else {
            setError(null);
        }
        setFiltered(result);
    };

    const debouncedSearch = debounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch(search);
    }, [search]);

    useEffect(() => {
        setFiltered(cities);
        setError(null);
    }, [defaultCity]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={style.citySelector} ref={containerRef}>
            <div
                className={style.citySelector__current}
                onClick={() => {
                    setOpen((prev) => !prev);
                    setSearch("");
                    setFiltered(cities);
                    setError(null);
                }}
            >
                <p className={style.citySelector__title}>{defaultCity}</p>
                <ArrowIcon
                    className={classNames(style.citySelector__arrow, {
                        [style.open]: open,
                    })}
                />
            </div>

            <CSSTransition
                nodeRef={nodeRef}
                in={open}
                timeout={300}
                classNames="citySelector__animation"
                unmountOnExit
            >
                <div
                    ref={nodeRef}
                    className={classNames(style.citySelector__wrapper, {
                        [style.open]: open,
                    })}
                >
                    <div className={style.citySelector__search}>
                        <input
                            className={style.citySelector__input}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search city"
                            onFocus={() => setOpen(true)}
                        />
                        <SearchIcon
                            className={style.citySelector__searchIcon}
                        />
                    </div>

                    <div className={style.citySelector__dropdown}>
                        {error && (
                            <div className={style.citySelector__error}>
                                {error}
                            </div>
                        )}
                        <ul className={style.citySelector__options}>
                            {filtered.map((c) => (
                                <li
                                    key={c}
                                    className={`${style.citySelector__option} ${
                                        c === defaultCity ? style.active : ""
                                    }`}
                                    onClick={() => {
                                        onChangeCity(c);
                                        setSearch("");
                                        setError(null);
                                        setOpen(false);
                                    }}
                                >
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default CitySelector;
