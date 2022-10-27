import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "./Statistics";
import React from "react";

jest.mock("react-chartjs-2", () => ({
    Bar: () => <div>Bar Chart</div>,
}));

describe("<Statistics />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render without errors", () => {
        render(<Statistics />);
        screen.getByText("Bar Chart");
    });
    // it("should not show anything if no reports", () => {
    //     const mockedSetform = jest.fn();
    //     jest.spyOn(React, "useState").mockReturnValue([[], mockedSetform]);
    //     render(<Statistics />);
    // }); when implement axios
});
