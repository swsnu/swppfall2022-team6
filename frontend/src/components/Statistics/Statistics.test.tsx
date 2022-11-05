import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "./Statistics";
import axios from "axios";
import React from "react";

jest.mock("react-chartjs-2", () => ({
    Bar: () => <div>BarChart</div>,
}));
jest.mock("react-minimal-pie-chart", () => ({
    PieChart: () => <div>PieChart</div>,
}));

describe("<Statistics />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should successfully get reports", async () => {
        axios.get = jest.fn().mockResolvedValue({
            data: [
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
            ],
        });
        render(<Statistics />);
        await waitFor(async () => await screen.findByLabelText("BarChart"));
        await waitFor(async () => await screen.findByText("PieChart"));
    });
    it("should not show anything if no reports", async () => {
        axios.get = jest.fn().mockResolvedValue({
            data: [],
        });
        render(<Statistics />);
        await waitFor(async () => await screen.findByText("No Statistics!"));
    });
});
