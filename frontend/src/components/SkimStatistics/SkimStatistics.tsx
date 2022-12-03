import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { PositionType } from "../../store/slices/position";
import { dataType } from "../Statistics/Statistics";
import "./SkimStatistics.scss";
import { fetchReports, ReportType, selectReport } from "../../store/slices/report";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";

export interface IProps {
    position: PositionType;
    radius: number;
}
const labels = ["Sunny", "Cloudy", "Rain", "Snow"];

export const SmallStatistics = (props: IProps) => {
    const {position, radius} = props;
    const reportState = useSelector(selectReport);
    // const [allReports, setAllReports] = useState<ReportType[]>([]);
    const [maxIndex, setMaxIndex] = useState<number>(0);
    const [reportPerc, setReportPerc] = useState<number[]>([0, 0, 0, 0]);

    const dispatch = useDispatch<AppDispatch>();
    const svgRef = useRef<SVGElement>();

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
    const svgElement = svgRef.current as SVGElement;
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

    svg.selectAll(".bar-data")
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
        dispatch(fetchReports({
            ...position, radius,
        }));
    }, []);

    useEffect(() => {
        const lenArray: number[] = [0, 0, 0, 0];
        Array.from(reportState.reports).forEach((report) => {
            if (report.weather === "Sunny") lenArray[0]++;
            else if (report.weather === "Cloudy") lenArray[1]++;
            else if (report.weather === "Rain") lenArray[2]++;
            else lenArray[3]++;
        });
        setMaxIndex(lenArray.indexOf(Math.max(...lenArray)));
    }, [reportState.reports]);
    useEffect(() => {
        if (reportState.reports.length) {
            setReportPerc([
                reportState.reports
                    .filter((report) => report.weather === labels[maxIndex])
                    .map((report) => report.weather_degree)
                    .reduce((a: number, b: number) => a + b, 0) /
                    reportState.reports.filter(
                        (report) => report.weather === labels[maxIndex]
                    ).length,
                reportState.reports.reduce(
                    (a: number, b: ReportType) => a + b.wind_degree,
                    0
                ) / reportState.reports.length,
                reportState.reports.reduce(
                    (a: number, b: ReportType) => a + b.happy_degree,
                    0
                ) / reportState.reports.length,
                reportState.reports.reduce(
                    (a: number, b: ReportType) => a + b.humidity_degree,
                    0
                ) / reportState.reports.length,
            ]);
        }
    }, [maxIndex, reportState.reports]);

    return (
        <div className="stats-container">
            {/* @ts-ignore */}
            <svg ref={svgRef} />
        </div>
    );
};


export const Address = ({position}:{position: PositionType}) => {
    const geocoder = new kakao.maps.services.Geocoder();
    const [address, setAddress] = useState<string>("");
    useEffect(() => {
        geocoder.coord2RegionCode(
            position.lng,
            position.lat,
            (result, status) => {
                if (
                    status === kakao.maps.services.Status.OK &&
                    !!result[0].address_name
                ) {
                    setAddress(result[0].address_name);
                }
            }
        );
    }, []);

    return (
        <div className="address-container">
            <p className="address">{address}</p>
        </div>
    );
};

const SkimStatistics = (props: IProps) => {
    return (
        <div className="skim-stats">
            <Address position={props.position} />
            <SmallStatistics position={props.position} radius={props.radius}/>
        </div>
    );
};
export default SkimStatistics;
