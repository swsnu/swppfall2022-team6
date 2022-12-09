import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { PieChart } from "react-minimal-pie-chart";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import report, { ReportType, selectReport } from "../../store/slices/report";
import { useSelector } from "react-redux";
import BarGraph from "../BarGraph/BarGraph";
export interface dataType {
    weather: string;
    range: number;
}

const labels = ["Sunny", "Cloudy", "Rain", "Snow"];


function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
}

function Statistics() {
    const reportState = useSelector(selectReport);
    const [maxIndex, setMaxIndex] = useState<number>(0);
    const [reportPerc, setReportPerc] = useState<number[]>([0, 0, 0, 0]);
    const [windowSize, setWindowSize] = useState(getWindowSize());
    
    const PieLabel = ({ x, y, dx, dy, dataEntry }: {
        x: number;
        y: number;
        dx: number;
        dy: number;
        dataEntry: any;
    }) => {
        return (
            <text
                x={x} y={y}
                dx={dx} dy={dy}
                dominantBaseline="central"
                textAnchor="middle"
            >
                <tspan x={x} y={y - 5} dx={dx} dy={dy} style={{ fontSize: "25px" }}>
                    {dataEntry.title}
                </tspan>
                <br />
                <tspan
                    x={x} y={y + 13}
                    dx={dx} dy={dy}
                    style={{ fontSize: windowSize.innerWidth>1000?"13px":"11px" }}
                >
                    {Math.ceil(dataEntry.percentage) + "%"}
                </tspan>
            </text>
        );
    };

    const displaylabels = [
        ["☀️ ", "☁️ ", "☔ ", "❄️ "][maxIndex] + labels[maxIndex],
        "💨 Wind",
        "😖 Discomfort",
        "💧 Humidity",
    ];

    const data: dataType[] = [];
    for (let i = 0; i < reportPerc.length; i++) {
        data.push({
            weather: displaylabels[i],
            range: reportPerc[i],
        });
    }

    const [w, h] = window.innerWidth>1000? [350, 140]: window.innerWidth>600?[350, 120]: [250, 120];
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 90 },
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    useEffect(()=>{
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [])
    useEffect(() => {
        const lenArray: number[] = [0, 0, 0, 0];
        reportState.reports.forEach((report) => {
            if (report.weather === "Sunny") lenArray[0]++;
            else if (report.weather === "Rain") lenArray[2]++;
            else if (report.weather === "Cloudy") lenArray[1]++;
            else lenArray[3]++;
        });
        setMaxIndex(lenArray.indexOf(Math.max(...lenArray)));
    }, [reportState.reports]);

    useEffect(() => {
        if (reportState.reports.length) {
            const perc1 =
                reportState.reports
                    .filter((report) => report.weather === labels[maxIndex])
                    .map((report) => report.weather_degree)
                    .reduce((a: number, b: number) => a + b, 0) /
                reportState.reports.filter(
                    (report) => report.weather === labels[maxIndex]
                ).length;
            const perc2 =
                reportState.reports.reduce(
                    (a: number, b: ReportType) => a + b.wind_degree,
                    0
                ) / reportState.reports.length;
            const perc3 =
                reportState.reports.reduce(
                    (a: number, b: ReportType) => a + b.happy_degree,
                    0
                ) / reportState.reports.length;
            const perc4 =
                reportState.reports.reduce(
                    (a: number, b: ReportType) => a + b.humidity_degree,
                    0
                ) / reportState.reports.length;
            setReportPerc([perc1, perc2, perc3, perc4]);
        }
    }, [maxIndex, reportState.reports]);

    return (
        <Container
            id="statistics-container"
            style={{
                display: "flex",
                // flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
                fontFamily: "NanumGothic",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "140%",
                fontSize: "10px",
                fill: "#33333",
                // whiteSpace: "pre-wrap",
                // height: "20vh",
                // width: "100%",
            }}
        >
            {reportState.reports.length ? (
                <div
                    style={{
                        margin: "20px",
                        display: "flex",
                        flexDirection: window.innerWidth>1000?"column":"row",
                        alignItems: "center",
                        textAlign: "center",
                        justifyContent: "space-between",
                        gap: window.innerWidth>1000?"30px":"0px",
                    }}
                >
                    <div
                        id="piechart-container"
                        style={{
                            width: "150px",
                            height: "150px",
                            paddingBottom: "10px",
                        }}
                    >
                        <PieChart
                            data={[
                                {
                                    title: "☀️",
                                    value: reportState.reports.filter(
                                        (report) => report.weather === "Sunny"
                                    ).length,
                                    color: "#FBD679",
                                },
                                {
                                    title: "☁️",
                                    value: reportState.reports.filter(
                                        (report) => report.weather === "Cloudy"
                                    ).length,
                                    color: "#C18BEC",
                                },
                                {
                                    title: "☔",
                                    value: reportState.reports.filter(
                                        (report) => report.weather === "Rain"
                                    ).length,
                                    color: "#C5E8FC",
                                },
                                {
                                    title: "❄️",
                                    value: reportState.reports.filter(
                                        (report) => report.weather === "Snow"
                                    ).length,
                                    color: "#F5F5F5",
                                },
                            ]}
                            lineWidth={window.innerWidth>1000?40:35}
                            background="#f3f3f3"
                            lengthAngle={360}
                            animate
                            label={({ x, y, dx, dy, dataEntry, dataIndex }) =>
                                dataIndex === maxIndex ? (
                                    <PieLabel
                                        key={dataIndex}
                                        x={x}
                                        y={y}
                                        dx={dx}
                                        dy={dy}
                                        dataEntry={dataEntry}
                                    />
                                ) : (
                                    ""
                                )
                            }
                            labelStyle={{
                                fontFamily: "NanumGothic",
                                fontSize: "18px",
                                color: "rgba(0,0,0,0.75)",
                            }}
                            labelPosition={0}
                            radius={window.innerWidth>1000?50:35}
                        />
                    </div>
                    <div className="bar-container">
                        <BarGraph 
                            width={width} 
                            height={height} 
                            margin={margin}
                            data={data}
                            fontSize={window.innerWidth>1000? 15: 12}
                            barHeight={window.innerWidth>1000? 15: 12}
                        />
                        <div className="total-reports" style={{
                            textAlign: "right",
                            width: "100%",
                            fontSize: "12px",
                            fontWeight: "500",
                            marginTop: "10px",
                            paddingRight: "30px",
                        }}>
                            Total {reportState.reports.length} Reports
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className="no-stat" 
                    style={{
                        display: "flex",
                        flexDirection: window.innerWidth>1000?"column":"row",
                        alignItems: "center",
                        padding: window.innerWidth>1000?"30px":"10px",
                        gap: "20px",
                    }}
                >
                    <span style={{
                        fontSize: window.innerWidth>1000?"120px":"100px",
                        height: "140px", 
                        paddingTop: "70px"
                    }}>😵</span>
                    <span style={{
                        fontSize: window.innerWidth>1000?"20px":"16px",
                        lineHeight: "140%"
                    }}>
                        <strong style={{fontWeight: "900"}}>No Statistics</strong> <br/>
                        for this location yet!
                    </span>
                </div>
            )}
        </Container>
    );
}

export default Statistics;
