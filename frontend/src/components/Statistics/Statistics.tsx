import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { PieChart } from "react-minimal-pie-chart";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export interface ReportType {
    weather: string;
    weather_degree: number;
    wind_degree: number;
    happy_degree: number;
    humidity_degree: number;
    time: string;
}

export interface dataType {
    weather: string;
    range: number;
}

const labels = ["Sunny", "Cloudy", "Rain", "Snow"];

function Statistics({ allReports }: { allReports: ReportType[] }) {
    const [maxIndex, setMaxIndex] = useState<number>(0);
    const [reportPerc, setReportPerc] = useState<number[]>([0, 0, 0, 0]);

    const barRef = useRef<SVGElement>();

    const displaylabels = [
        ["☀️ ", "☁️ ", "☔ ", "❄️ "][maxIndex] + labels[maxIndex],
        "💨 Wind",
        "🤗 Happy",
        "💧 Humidity",
    ];

    const data: dataType[] = [];
    for (let i = 0; i < reportPerc.length; i++) {
        data.push({
            weather: displaylabels[i],
            range: reportPerc[i],
        });
    }

    const [w, h] = [350, 140];
    const barHeight = 15;
    const svgElement = barRef.current as SVGElement;
    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 90 },
        width = w - margin.left - margin.right,
        height = h - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
        .select(svgElement)
        .call((g) => g.select("g").remove())
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const y = d3
        .scalePoint()
        .range([0, height])
        .domain(data.map((d) => d.weather));

    // .padding(.1)

    const x = d3.scaleLinear().domain([0, 5.5]).range([0, width]);

    svg.selectAll(".bar-background")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("rx", barHeight / 2)
        .attr("ry", barHeight / 2)
        //@ts-ignore
        .attr("y", (d) => {
            //@ts-ignore
            return y(d.weather) + (y.bandwidth() - barHeight) / 2;
        })
        .attr("height", barHeight)
        .attr("x", x(0))
        .attr("width", x(5))
        .attr("fill", "#EDF9FF");

    const bar = svg
        .selectAll(".bar-data")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        // .join(
        //   (enter)=>enter.append(".bar"),
        //   (update)=>update.attr("class", "bar"),
        //   (exit)=>exit.remove()
        // )
        .attr("rx", barHeight / 2)
        .attr("ry", barHeight / 2)
        //@ts-ignore
        .attr("y", (d) => {
            //@ts-ignore
            return y(d.weather) + (y.bandwidth() - barHeight) / 2;
        })
        .attr("x", x(0))
        .attr("height", barHeight)
        .attr("x", (d) => {
            return x(0);
        })
        .attr("width", 0)
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 150;
        })
        //@ts-ignores
        .attr("width", (d) => x(d.range))
        .attr("fill", "#3185E7")
        .attr("border", 0);

    // label은 다음에 찾아보는걸로..
    svg.selectAll(".text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        //@ts-ignore
        .attr("y", function (d) {
            //@ts-ignore
            return y(d.weather) + (y.bandwidth() + 10) / 2;
        })
        .attr("x", x(5.5))
        .text((d) => {
            return Math.round(d.range * 20) + "%";
        })
        .style("text-anchor", "middle")
        .style("font-family", "NanumGothic")
        .style("font-family", "sans-serif")
        .style("font-weight", "700")
        .style("font-size", "15px")
        .style("color", "rgba(0,0,0,50%)");

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("stroke-width", 0)
        .style("font-family", "NanumGothic")
        .style("font-family", "sans-serif")
        .style("font-weight", "700")
        .style("font-size", "15px")
        .style("color", "rgba(0,0,0,75%)");

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
            {allReports.length ? (
                <Row
                    style={{
                        margin: "20px",
                        width: "600px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Col
                        
                        id="piechart-container"
                        style={{ width: "150px", height: "150px", padding: "10px"}}
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
                    </Col>
                    <Col md className="bar-container">
                        {/* @ts-ignore */}
                        <svg ref={barRef} aria-label="BarChart" />
                    </Col>
                </Row>
            ) : (
                <span>No Statistics!</span>
            )}
        </Container>
    );
}

export default Statistics;
