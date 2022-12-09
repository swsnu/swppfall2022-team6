import { useRef } from "react";
import * as d3 from "d3";

import { dataType } from "../Statistics/Statistics";

const BarGraph = ({
    width, 
    height,
    margin,
    data,
    barHeight=15,
    fontWeight=700,
    fontSize=15,
    fontColor="black",

  }:{
    width: number,
    height: number,
    margin: {top:number, bottom: number, left: number, right: number},
    data: dataType[],
    barHeight?: number,
    fontWeight?: number,
    fontSize?: number,
    fontColor?: string,
  })=>{

  const barRef = useRef<SVGElement>();
  const svgElement = barRef.current as SVGElement;

const svg = d3
  .select(svgElement)
  .call((g) => g.select("g").remove())
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear().domain([0, 5.5]).range([0, width]);
const y = d3
    .scalePoint()
    .range([0, height])
    .domain(data.map((d) => d.weather));

// .padding(.1)

svg.selectAll(".bar-background")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("ry", barHeight / 2)
    .attr("rx", barHeight / 2)
    //@ts-ignore
    .attr("x", x(0))
    .attr("width", x(5))
    .attr("height", barHeight)
    .attr("y", (d) => {
        //@ts-ignore
        return y(d.weather) + (y.bandwidth() - barHeight) / 2;
    })
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
    .attr("y", (d) => {
        //@ts-ignore
        return y(d.weather) + (y.bandwidth() - barHeight) / 2;
    })
    .attr("ry", barHeight / 2)
    .attr("x", x(0))
    .attr("rx", barHeight / 2)
    //@ts-ignore
    .attr("height", barHeight)
    .attr("width", 0)
    .attr("x", (d) => {
        return x(0);
    })
    .transition()
    .duration(750)
    .delay(function (d, i) {
        return i * 150;
    })
    //@ts-ignores
    .attr("fill", "#3185E7")
    .attr("width", (d) => x(d.range))
    .attr("border", 0);

// label은 다음에 찾아보는걸로..
svg.selectAll(".text")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", x(5.5))
    //@ts-ignore
    .attr("y", function (d) {
        //@ts-ignore
        return y(d.weather) + (y.bandwidth() + 10) / 2;
    })
    .text((d) => {
        return Math.round(d.range * 20) + "%";
    })
    .style("font-weight", fontWeight)
    .style("font-size", fontSize)
    .style("color", fontColor)
    .style("font-family", "NanumGothic")
    .style("font-family", "sans-serif")
    .style("text-anchor", "middle");

svg.append("g")
    .call(d3.axisLeft(y))
    .style("font-weight", fontWeight)
    .style("stroke-width", 0)
    .style("font-family", "NanumGothic")
    .style("font-family", "sans-serif")
    .style("font-size", fontSize)
    .style("color", fontColor);

    return (
      // @ts-ignore
      <svg ref={barRef} style={{
        width: `${width + 130}px`,
        height: `${height + 40}px`,
      }}/>
    );
}

export default BarGraph;