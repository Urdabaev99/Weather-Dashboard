import React, { useEffect, useRef, useMemo } from "react";
import { averageDailyValues, sortByDateTime } from "../../utils/dateUtils";
import { toCelsius, toFahrenheit } from "../../utils/temperature";
import { WeatherDataPoint } from "../../types/weather";
import style from "./DataVisualization.module.scss";

interface Props {
    data: WeatherDataPoint[];
    unit: "metric" | "imperial";
}

const DataVisualization: React.FC<Props> = ({ data, unit }) => {
    const sortedData = useMemo(() => sortByDateTime(data), [data]);

    const tempsConverted = useMemo(
        () =>
            sortedData.map((d) =>
                unit === "metric"
                    ? toCelsius(d.main.temp)
                    : toFahrenheit(d.main.temp)
            ),
        [sortedData, unit]
    );

    const { min, max, avg } = useMemo(() => {
        if (tempsConverted.length === 0) return { min: 0, max: 0, avg: 0 };
        const minVal = Math.min(...tempsConverted);
        const maxVal = Math.max(...tempsConverted);
        const avgVal =
            tempsConverted.reduce((sum, v) => sum + v, 0) /
            tempsConverted.length;
        return {
            min: parseFloat(minVal.toFixed(2)),
            max: parseFloat(maxVal.toFixed(2)),
            avg: parseFloat(avgVal.toFixed(2)),
        };
    }, [tempsConverted]);

    const dailyAveragesConverted = useMemo(() => {
        const rawDaily = averageDailyValues(sortedData);
        const result: Record<string, number> = {};
        Object.entries(rawDaily).forEach(([date, avgInK]) => {
            result[date] =
                unit === "metric" ? toCelsius(avgInK) : toFahrenheit(avgInK);
        });
        return result;
    }, [sortedData, unit]);

    const svgRef = useRef<SVGSVGElement | null>(null);
    useEffect(() => {
        if (!svgRef.current || tempsConverted.length === 0) return;
        const svg = svgRef.current;

        const SVG_WIDTH = 760;
        const SVG_HEIGHT = 300;
        const LEFT_MARGIN = 50;
        const BOTTOM_MARGIN = 40;
        const TOP_MARGIN = 20;
        const RIGHT_MARGIN = 20;

        const chartWidth = SVG_WIDTH - LEFT_MARGIN - RIGHT_MARGIN;
        const chartHeight = SVG_HEIGHT - TOP_MARGIN - BOTTOM_MARGIN;

        const rawMin = Math.min(...tempsConverted);
        const rawMax = Math.max(...tempsConverted);
        const valueRange = rawMax - rawMin || 1;

        const points = tempsConverted.map((temp, i) => {
            const x =
                LEFT_MARGIN + (i / (tempsConverted.length - 1)) * chartWidth;
            const y =
                TOP_MARGIN +
                (chartHeight - ((temp - rawMin) / valueRange) * chartHeight);
            return { x, y };
        });

        const pathD = points
            .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
            .join(" ");
        const pathEl = svg.querySelector("path");
        if (pathEl) pathEl.setAttribute("d", pathD);

        const xAxisGroup = svg.querySelector(`.${style.xAxisLabels}`);
        if (xAxisGroup) {
            xAxisGroup.innerHTML = "";
            const uniqueDates: string[] = [];
            sortedData.forEach((d) => {
                const dateStr = new Date(d.dt * 1000)
                    .toISOString()
                    .split("T")[0];
                if (!uniqueDates.includes(dateStr)) uniqueDates.push(dateStr);
            });

            uniqueDates.forEach((dateStr, idxDate) => {
                const idx = sortedData.findIndex(
                    (d) =>
                        new Date(d.dt * 1000).toISOString().split("T")[0] ===
                        dateStr
                );
                const { x } = points[idx];

                const labelText = idxDate === 0 ? "0" : dateStr;

                const text = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );
                text.setAttribute("x", `${x}`);
                text.setAttribute("y", `${TOP_MARGIN + chartHeight + 20}`);
                text.setAttribute("class", style.axisLabel);
                text.setAttribute("text-anchor", "middle");
                text.textContent = labelText;
                xAxisGroup.appendChild(text);

                const tick = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );
                tick.setAttribute("x1", `${x}`);
                tick.setAttribute("y1", `${TOP_MARGIN + chartHeight}`);
                tick.setAttribute("x2", `${x}`);
                tick.setAttribute("y2", `${TOP_MARGIN + chartHeight + 5}`);
                tick.setAttribute("class", style.axisTick);
                xAxisGroup.appendChild(tick);
            });
        }

        const yAxisGroup = svg.querySelector(`.${style.yAxisLabels}`);
        if (yAxisGroup) {
            yAxisGroup.innerHTML = "";
            const ticksCount = 5;
            for (let i = 0; i <= ticksCount; i++) {
                const value =
                    i === 0 ? 0 : rawMin + (i / ticksCount) * valueRange;
                const y =
                    TOP_MARGIN +
                    (chartHeight -
                        (((i === 0 ? rawMin : value) - rawMin) / valueRange) *
                            chartHeight);

                const text = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );
                text.setAttribute("x", `${LEFT_MARGIN - 10}`);
                text.setAttribute("y", `${y + 4}`);
                text.setAttribute("class", style.axisLabel);
                text.setAttribute("text-anchor", "end");

                text.textContent = i === 0 ? "0" : value.toFixed(1);
                yAxisGroup.appendChild(text);

                const tick = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );
                tick.setAttribute("x1", `${LEFT_MARGIN - 5}`);
                tick.setAttribute("y1", `${y}`);
                tick.setAttribute("x2", `${LEFT_MARGIN}`);
                tick.setAttribute("y2", `${y}`);
                tick.setAttribute("class", style.axisTick);
                yAxisGroup.appendChild(tick);
            }
        }
    }, [sortedData, tempsConverted, unit]);

    return (
        <div className={style.dataVisualization}>
            <div className={style.statsSummary}>
                <div className={style.statsSummary__item}>
                    <div className={style.statsSummary__label}>Min Temp</div>
                    <div className={style.statsSummary__value}>
                        {min.toFixed(2)}
                    </div>
                </div>
                <div className={style.statsSummary__item}>
                    <div className={style.statsSummary__label}>Max Temp</div>
                    <div className={style.statsSummary__value}>
                        {max.toFixed(2)}
                    </div>
                </div>
                <div className={style.statsSummary__item}>
                    <div className={style.statsSummary__label}>Avg Temp</div>
                    <div className={style.statsSummary__value}>
                        {avg.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className={style.dailyAverages}>
                <h4 className={style.dailyAverages__title}>
                    Average daily ({unit === "metric" ? "°C" : "°F"})
                </h4>
                <table className={style.dailyAverages__table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>
                                Avg Temp ({unit === "metric" ? "°C" : "°F"})
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(dailyAveragesConverted).map(
                            ([date, avgTemp]) => (
                                <tr key={date}>
                                    <td>{date}</td>
                                    <td>{avgTemp.toFixed(2)}</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>

            <div className={style.chartContainer}>
                <h4 className={style.chartContainer__title}>
                    Average daily ({unit === "metric" ? "°C" : "°F"})
                </h4>
                <svg
                    ref={svgRef}
                    width="100%"
                    height="300"
                    viewBox="0 0 800 300"
                    className={style.chartSvg}
                >
                    <line
                        x1="50"
                        y1="20"
                        x2="50"
                        y2="260"
                        className={style.axisLine}
                    />
                    <line
                        x1="50"
                        y1="260"
                        x2="780"
                        y2="260"
                        className={style.axisLine}
                    />

                    <g className={style.xAxisLabels}></g>
                    <g className={style.yAxisLabels}></g>

                    <path
                        className={style.linePath}
                        fill="none"
                        stroke="#0d6efd"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
};

export default DataVisualization;
