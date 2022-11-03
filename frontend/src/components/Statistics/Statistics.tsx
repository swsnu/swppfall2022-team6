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
    scales: {
        x: {
            min: 0,
            max: 5,
            ticks: { stepSize: 1, display: false },
            grid: {
                drawBorder: false,
                display: false,
            },
        },
        y: {
            ticks: {
                color: "black",
                font: {
                    family: "NanumGothic",
                    weight: "700",
                    lineHeight: "140%",
                    size: 10,
                },
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: { enabled: false },
    },
};

const labels = ["Sunny", "Cloudy", "Rain", "Snow"];

function Statistics() {
    const [allReports, setAllReports] = useState<ReportType[]>([]);
    const [maxIndex, setMaxIndex] = useState<number>(0);
    const [reportPerc, setReportPerc] = useState<number[]>([0, 0, 0, 0]);

    const displaylabels = [
        ["☀️ ", "☁️ ", "☔ ", "❄️ "][maxIndex] + labels[maxIndex],
        "💨 Wind",
        "🤗 Happy",
        "💧 Humidity",
    ];

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

    useEffect(() => {
        if (allReports.length) {
            setReportPerc([
                allReports
                    .filter((report) => report.weather === labels[maxIndex])
                    .map((report) => report.weather_degree)
                    .reduce((a: number, b: number) => a + b, 0) /
                    allReports.filter(
                        (report) => report.weather === labels[maxIndex]
                    ).length,
                allReports.reduce(
                    (a: number, b: ReportType) => a + b.wind_degree,
                    0
                ) / allReports.length,
                allReports.reduce(
                    (a: number, b: ReportType) => a + b.happy_degree,
                    0
                ) / allReports.length,
                allReports.reduce(
                    (a: number, b: ReportType) => a + b.humidity_degree,
                    0
                ) / allReports.length,
            ]);
        }
    }, [maxIndex, allReports]);

    return (
        <div
            id="statistics-container"
            style={{
                display: "flex",
                justifyContent: "space-around",
                fontFamily: "NanumGothic",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "140%",
                fontSize: "10px",
                fill: "#33333",
                whiteSpace: "pre-wrap",
            }}
        >
            {allReports.length ? (
                <div style={{ display: "flex" }}>
                    <div
                        id="piechart-container"
                        style={{ width: "150px", height: "200px" }}
                    >
                        <PieChart
                            data={[
                                {
                                    title: "☀️ Sunny",
                                    value: allReports.filter(
                                        (report) => report.weather === "Sunny"
                                    ).length,
                                    color: "#FBD679",
                                },
                                {
                                    title: "☁️ Cloudy",
                                    value: allReports.filter(
                                        (report) => report.weather === "Cloudy"
                                    ).length,
                                    color: "#C18BEC",
                                },
                                {
                                    title: "☔ Rain",
                                    value: allReports.filter(
                                        (report) => report.weather === "Rain"
                                    ).length,
                                    color: "#C5E8FC",
                                },
                                {
                                    title: "❄️ Snow",
                                    value: allReports.filter(
                                        (report) => report.weather === "Snow"
                                    ).length,
                                    color: "#F5F5F5",
                                },
                            ]}
                            lineWidth={40}
                            background="#f3f3f3"
                            lengthAngle={360}
                            animate
                            label={({ dataEntry, dataIndex }) =>
                                dataIndex === maxIndex
                                    ? dataEntry.title +
                                      "\n" +
                                      Math.ceil(
                                          dataEntry.percentage
                                      ).toString() +
                                      "%"
                                    : ""
                            }
                            labelPosition={0}
                            viewBoxSize={[100, 100]}
                        />
                    </div>
                    <Bar
                        options={Baroptions}
                        data={{
                            labels: displaylabels,
                            datasets: [
                                {
                                    label: "Statistics",
                                    data: reportPerc,
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
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            fontSize: "14px",
                        }}
                    >
                        <div>{Math.ceil(20 * reportPerc[0]).toString()}</div>
                        <div>{Math.ceil(20 * reportPerc[1]).toString()}</div>
                        <div>{Math.ceil(20 * reportPerc[2]).toString()}</div>
                        <div>{Math.ceil(20 * reportPerc[3]).toString()}</div>
                    </div>
                </div>
            ) : (
                <span>No Statistics!</span>
            )}
        </div>
    );
}

export default Statistics;
