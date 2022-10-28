import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "./Statistics";
import React from "react";

jest.mock("react-chartjs-2", () => ({
    Bar: () => <div>Bar Chart</div>,
}));
jest.mock("react-minimal-pie-chart", () => ({
    PieChart: () => <div>Pie Chart</div>,
}));
const mockRegister = jest.fn();
jest.mock("chart.js", () => ({
    ...jest.requireActual("chart.js"),
    register: () => mockRegister,
}));

describe("<Statistics />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render without errors", () => {
        const { container } = render(<Statistics />);
        expect(container.querySelector("#statistics-container")).toBeTruthy();
        screen.getByText("Bar Chart");
        screen.getByText("Pie Chart");
        // expect(mockRegister).toHaveBeenCalled();
    });
    // it("should not show anything if no reports", () => {
    //     const mockedSetform = jest.fn();
    //     jest.spyOn(React, "useState").mockReturnValue([[], mockedSetform]);
    //     render(<Statistics />);
    // }); when implement axios
});
