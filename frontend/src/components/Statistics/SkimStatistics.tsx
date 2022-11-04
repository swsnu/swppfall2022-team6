import React, {useState, useEffect, useRef} from 'react';
import * as d3 from 'd3';
import axios from "axios";
import { PositionType } from "../Map/Map"
import "./SkimStatistics.scss"

export interface ReportType {
  weather: string;
  weather_degree: number;
  wind_degree: number;
  happy_degree: number;
  humidity_degree: number;
  time: string;
}
const labels = ["Sunny", "Cloudy", "Rain", "Snow"];

interface dataType {
  weather: string;
  range: number;
}


const SmallStatistics = ()=>{
  const [allReports, setAllReports] = useState<ReportType[]>([]);
  const [maxIndex, setMaxIndex] = useState<number>(0);
  const [reportPerc, setReportPerc] = useState<number[]>([0, 0, 0, 0]);

  const svgRef = useRef<SVGElement>(); 

  
    axios
      .get("/report/", {
          params: { latitude: 30, longitude: 30, radius: 2 }, // modify to redux
      })
      .then((response) => {
          setAllReports(response.data);
      });
    const displaylabels = [
        ["☀️ ", "☁️ ", "☔ ", "❄️ "][maxIndex] + labels[maxIndex],
        "💨 Wind",
        "🤗 Happy",
        "💧 Humidity",
    ];

    const data: dataType[] = []
    for(let i=0; i<reportPerc.length; i++){
      data.push({
        weather: displaylabels[i],
        range: reportPerc[i],
      })
    }

    const [w, h] = [400, 140];
    const barHeight = 15;
    const svgElement = svgRef.current as SVGElement;
    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 20, bottom: 30, left: 90},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select(svgElement)
    .call(g => g.select("g").remove())
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    const y = d3.scalePoint() 
      .range([ 0, height ])
      .domain(data.map(d=>d.weather));

      // .padding(.1)

    const x = d3.scaleLinear()
      .domain([0, 5.5]) 
      .range([ 0, width]) 

    svg.selectAll(".bar-background")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr('rx', barHeight/2)
      .attr('ry', barHeight/2)
      //@ts-ignore
      .attr("y", d=>{return y(d.weather)+(y.bandwidth()-barHeight)/2})
      .attr("height", barHeight)
      //@ts-ignore
      .attr("x", x(0)) 
      //@ts-ignore
      .attr("width", x(5))
      .attr("fill", "#EDF9FF");

    svg.selectAll(".bar-data")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      // .join(
      //   (enter)=>enter.append(".bar"),
      //   (update)=>update.attr("class", "bar"),
      //   (exit)=>exit.remove() 
      // )
      .attr('rx', barHeight/2)
      .attr('ry', barHeight/2)
      //@ts-ignore
      .attr("y", d=>{return y(d.weather)+(y.bandwidth()-barHeight)/2}) 
      .attr("height", barHeight)
      .attr("x", x(0)) 
      //@ts-ignore
      .attr("width", d=>x(d.range))
      .attr("fill", "#3185E7") 
      .attr("border", 0);
    
    // label은 다음에 찾아보는걸로..
    svg.selectAll(".text")
      .data(data)
    .enter().append("text")
      .attr("class", "label")
      //@ts-ignore
      .attr("y", function(d) { return y(d.weather) + (y.bandwidth()+10)/2; })
      .attr("x", x(5.5))
      .text(d=>{ return Math.round(d.range*20)+"%" })
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
    <div className='stats-container'>
      {/* @ts-ignore */}
      <svg  ref={svgRef}/>
    </div>
  )
}

interface AddressIProps{
  position: PositionType;
}

const Address = (props: AddressIProps)=>{
  const { position } = props;
  const geocoder = new kakao.maps.services.Geocoder();
  const [address, setAddress] = useState<string>("");
  geocoder.coord2RegionCode(
    position.lng, position.lat, 
    (result, status)=>{
      if(status == kakao.maps.services.Status.OK && !!result[0].address_name){
        setAddress(result[0].address_name)
      }
    } 
  ); 
  // useEffect(()=>{
  // }, []);

  return (
    <div className="address-container"> 
      <p className="address">
        {address}
      </p>
    </div>
  )
}

const SkimStatistics = (props: AddressIProps)=>{

  return (
    <div className="skim-stats">
      <Address position={props.position}/>
      <SmallStatistics/>
    </div>
  )
}
export default SkimStatistics;