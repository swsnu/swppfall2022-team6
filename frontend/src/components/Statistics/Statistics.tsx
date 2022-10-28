import React, { useEffect, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface ReportType {
    weather: number;
    weather_degree: number;
    wind_degree: number;
    happy_degree: number;
    humidity_degree: number;
    time: string;
}

export const Baroptions = {
    indexAxis: "y" as const,
    elements: {
        bar: {
            borderWidth: 2,
        },
    },
    responsive: false,
    x: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
    },
    plugins: {
        legend: {
            display: false,
        },
    },
};

const labels = ["Sunny", "Wind", "Happy", "Humidity"];

function Statistics() {
    const [allReports, setAllReports] = useState<ReportType[]>([
        {
            weather: 0,
            weather_degree: 2,
            wind_degree: 1,
            happy_degree: 2,
            humidity_degree: 5,
            time: "",
        },
        {
            weather: 1,
            weather_degree: 3,
            wind_degree: 1,
            happy_degree: 3,
            humidity_degree: 2,
            time: "",
        },
        {
            weather: 1,
            weather_degree: 4,
            wind_degree: 2,
            happy_degree: 4.2,
            humidity_degree: 5,
            time: "",
        },
    ]);
    const [maxIndex, setMaxIndex] = useState<number>(0);

    useEffect(() => {
        //axios.get("/report").then, instead mock
        const lenArray: number[] = [0, 0, 0, 0];
        lenArray[0] = allReports.filter(
            (report) => report.weather === 0
        ).length;
        lenArray[1] = allReports.filter(
            (report) => report.weather === 0
        ).length;
        lenArray[2] = allReports.filter(
            (report) => report.weather === 0
        ).length;
        lenArray[3] = allReports.filter(
            (report) => report.weather === 0
        ).length;
        setMaxIndex(lenArray.indexOf(Math.max(...lenArray)));
    }, [allReports]);

    return (
        <div
            id="statistics-container"
            style={{ display: "flex", justifyContent: "space-around" }}
        >
            <div
                id="piechart-container"
                style={{ width: "150px", height: "200px" }}
            >
                <PieChart
                    data={[
                        {
                            title: "Sunny",
                            value: allReports.filter(
                                (report) => report.weather === 0
                            ).length,
                            color: "#F6CB44",
                        },
                        {
                            title: "Cloudy",
                            value: allReports.filter(
                                (report) => report.weather === 1
                            ).length,
                            color: "#E3A454",
                        },
                        {
                            title: "Rain",
                            value: allReports.filter(
                                (report) => report.weather === 2
                            ).length,
                            color: "#76BEE3",
                        },
                        {
                            title: "Snow",
                            value: allReports.filter(
                                (report) => report.weather === 3
                            ).length,
                            color: "#654321",
                        },
                    ]}
                    lineWidth={18}
                    background="#f3f3f3"
                    lengthAngle={360}
                    rounded
                    animate
                    label={({ dataEntry, dataIndex }) =>
                        dataIndex === maxIndex
                            ? dataEntry.title +
                              " " +
                              Math.round(dataEntry.percentage).toString() +
                              "%"
                            : ""
                    }
                    labelStyle={{ fontSize: "13px", fill: "#33333" }}
                    labelPosition={0}
                    viewBoxSize={[100, 100]}
                />
            </div>
            <Bar
                options={Baroptions}
                data={{
                    labels,
                    datasets: [
                        {
                            label: "Statistics",
                            data: [
                                allReports
                                    .filter(
                                        (report) => report.weather === maxIndex
                                    )
                                    .map((report) => report.weather_degree)
                                    .reduce(
                                        (a: number, b: number) => a + b,
                                        0
                                    ) /
                                    allReports
                                        .filter(
                                            (report) =>
                                                report.weather === maxIndex
                                        )
                                        .map((report) => report.weather_degree)
                                        .length,
                                allReports.reduce(
                                    (a: number, b: ReportType) =>
                                        a + b.wind_degree,
                                    0
                                ) / allReports.length,
                                allReports.reduce(
                                    (a: number, b: ReportType) =>
                                        a + b.happy_degree,
                                    0
                                ) / allReports.length,
                                allReports.reduce(
                                    (a: number, b: ReportType) =>
                                        a + b.humidity_degree,
                                    0
                                ) / allReports.length,
                            ],
                            backgroundColor: [
                                "pink",
                                "lightblue",
                                "yellow",
                                "lightgreen",
                            ],
                        },
                    ],
                }}
                style={{ position: "relative", height: "200px" }}
            />
        </div>
    );
}

export default Statistics;
