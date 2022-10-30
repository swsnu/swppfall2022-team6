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
import axios from "axios";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface ReportType {
    weather: string;
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
            weather: "Sunny",
            weather_degree: 2,
            wind_degree: 1,
            happy_degree: 2,
            humidity_degree: 5,
            time: "",
        },
    ]);
    const [maxIndex, setMaxIndex] = useState<number>(0);

    useEffect(() => {
        axios
            .get("/report/", {
                params: { latitude: 30, longitude: 30, radius: 2 }, // modify to redux
            })
            .then((response) => {
                setAllReports(response.data);
            })
            .then(() => {
                const lenArray: number[] = [0, 0, 0, 0];
                lenArray[0] = allReports.filter(
                    (report) => report.weather === "Sunny"
                ).length;
                lenArray[1] = allReports.filter(
                    (report) => report.weather === "Wind"
                ).length;
                lenArray[2] = allReports.filter(
                    (report) => report.weather === "Happy"
                ).length;
                lenArray[3] = allReports.filter(
                    (report) => report.weather === "Humidity"
                ).length;
                setMaxIndex(lenArray.indexOf(Math.max(...lenArray)));
            });
    }, []);

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
                                (report) => report.weather === "Sunny"
                            ).length,
                            color: "#F6CB44",
                        },
                        {
                            title: "Cloudy",
                            value: allReports.filter(
                                (report) => report.weather === "Wind"
                            ).length,
                            color: "#E3A454",
                        },
                        {
                            title: "Rain",
                            value: allReports.filter(
                                (report) => report.weather === "Happy"
                            ).length,
                            color: "#76BEE3",
                        },
                        {
                            title: "Snow",
                            value: allReports.filter(
                                (report) => report.weather === "Humidity"
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
                              Math.ceil(dataEntry.percentage).toString() +
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
                                        (report) =>
                                            report.weather === labels[maxIndex]
                                    )
                                    .map((report) => report.weather_degree)
                                    .reduce(
                                        (a: number, b: number) => a + b,
                                        0
                                    ) /
                                    allReports
                                        .filter(
                                            (report) =>
                                                report.weather ===
                                                labels[maxIndex]
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
