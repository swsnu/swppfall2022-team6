import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "./Statistics";
import axios from "axios";
import React from "react";

jest.mock("react-minimal-pie-chart", () => ({
    PieChart: () => <div>PieChart</div>,
}));

describe("<Statistics />", () => {
    const data = [
        {
            weather: "Sunny",
            weather_degree: 2,
            wind_degree: 1,
            happy_degree: 2,
            humidity_degree: 5,
            time: "",
        },
        {
            weather: "Cloudy",
            weather_degree: 2,
            wind_degree: 1,
            happy_degree: 2,
            humidity_degree: 5,
            time: "",
        },
        {
            weather: "Rain",
            weather_degree: 2,
            wind_degree: 1,
            happy_degree: 2,
            humidity_degree: 5,
            time: "",
        },
        {
            weather: "Snow",
            weather_degree: 2,
            wind_degree: 1,
            happy_degree: 2,
            humidity_degree: 5,
            time: "",
        },
    ];
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should successfully get reports", async () => {
        const { container } = render(<Statistics allReports={data} />);
        const barChart = container.getElementsByClassName("bar");
        //console.log(barChart);
        //screen.getByText("BarChart");
        screen.getByText("PieChart");
    });
    it("should not show anything if no reports", async () => {
        render(<Statistics allReports={[]} />);
        screen.getByText("No Statistics!");
    });
});
