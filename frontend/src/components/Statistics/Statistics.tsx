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
    const [allReports, setAllReports] = useState<ReportType[]>([]);
    const [maxIndex, setMaxIndex] = useState<number>(0);

    useEffect(() => {
        axios
            .get("/report/", {
                params: { latitude: 30, longitude: 30, radius: 2 }, // modify to redux
            })
            .then((response) => {
                setAllReports(response.data);
            });
    }, []);

    useEffect(() => {
        const lenArray: number[] = [0, 0, 0, 0];
        allReports.forEach((report) => {
            if (report.weather === "Sunny") lenArray[0]++;
            else if (report.weather === "Cloudy") lenArray[1]++;
            else if (report.weather === "Rain") lenArray[2]++;
            else lenArray[3]++;
        });
        setMaxIndex(lenArray.indexOf(Math.max(...lenArray)));
    }, [allReports]);

    return (
        <div
            id="statistics-container"
            style={{ display: "flex", justifyContent: "space-around" }}
        >
            {allReports.length ? (
                <div>
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
                                        (report) => report.weather === "Cloudy"
                                    ).length,
                                    color: "#E3A454",
                                },
                                {
                                    title: "Rain",
                                    value: allReports.filter(
                                        (report) => report.weather === "Rain"
                                    ).length,
                                    color: "#76BEE3",
                                },
                                {
                                    title: "Snow",
                                    value: allReports.filter(
                                        (report) => report.weather === "Snow"
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
                                      Math.ceil(
                                          dataEntry.percentage
                                      ).toString() +
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
                                                    report.weather ===
                                                    labels[maxIndex]
                                            )
                                            .map(
                                                (report) =>
                                                    report.weather_degree
                                            )
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
                                                .map(
                                                    (report) =>
                                                        report.weather_degree
                                                ).length,
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
            ) : (
                <span>No Statistics!</span>
            )}
        </div>
    );
}

export default Statistics;
