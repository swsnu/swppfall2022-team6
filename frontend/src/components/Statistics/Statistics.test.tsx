import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "./Statistics";
import axios from "axios";
import React from "react";

jest.mock("react-chartjs-2", () => ({
    Bar: () => <div>Bar Chart</div>,
}));
jest.mock("react-minimal-pie-chart", () => ({
    PieChart: () => <div>Pie Chart</div>,
}));

describe("<Statistics />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render without errors", () => {
        render(<Statistics />);
        screen.getByText("Bar Chart");
        screen.getByText("Pie Chart");
    });
    it("should successfully get reports", async () => {
        axios.get = jest.fn().mockResolvedValue({
            data: {
                weather: "Sunny",
                weather_degree: 2,
                wind_degree: 1,
                happy_degree: 2,
                humidity_degree: 5,
                time: "",
            },
        });
        render(<Statistics />);
        await waitFor(async () => await screen.findByText("Bar Chart"));

        // await waitFor(async () => {
        //     await waitFor(() => screen.getByText("Bar Chart"));
        // });
    });
});
