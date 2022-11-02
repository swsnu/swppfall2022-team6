import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import React from "react";
import ReportModal from "./ReportModal";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<ReportModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should handle form submit properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed/");
        });
    });
    it("should change photo properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const file = new File(["TEST"], "test.png", { type: "image/png" });
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const fileUploader = screen.getByTestId("fileUploader");
        fireEvent.change(fileUploader, { target: { files: null } });
        userEvent.upload(fileUploader, file);
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed/");
        });
    });
    it("should submit content if only exists", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed/");
        });
    });
    it("should close modal properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const closeButton = screen.getByTestId("closeButton");
        fireEvent.click(closeButton);
    });
    it("should select weather properly", async () => {
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const sunnyButton = screen.getByText("☀️ Sunny");
        fireEvent.click(sunnyButton);
        await waitFor(() => {
            expect(screen.getByTestId("weatherP")).toHaveTextContent("Sunny");
        });
        const cloudyButton = screen.getByText("☁️ Cloudy");
        fireEvent.click(cloudyButton);
        await waitFor(() => {
            expect(screen.getByTestId("weatherP")).toHaveTextContent("Cloudy");
        });
        const rainButton = screen.getByText("☔ Rain");
        fireEvent.click(rainButton);
        await waitFor(() => {
            expect(screen.getByTestId("weatherP")).toHaveTextContent("Rain");
        });
        const snowButton = screen.getByText("❄️ Snow");
        fireEvent.click(snowButton);
        await waitFor(() => {
            expect(screen.getByTestId("weatherP")).toHaveTextContent("Snow");
        });
    });
    it("should change slider properly", async () => {
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const weatherSlider = screen.getByLabelText("weather_degree");
        fireEvent.change(weatherSlider, { target: { value: 1 } });
        const windSlider = screen.getByLabelText("wind_degree");
        fireEvent.change(windSlider, { target: { value: 2 } });
        const happySlider = screen.getByLabelText("happy_degree");
        fireEvent.change(happySlider, { target: { value: 3 } });
        const humiditySlider = screen.getByLabelText("humidity_degree");
        fireEvent.change(humiditySlider, { target: { value: 4 } });
    });
    it("should change textfield properly", async () => {
        render(<ReportModal openReport={true} setOpenReport={jest.fn()} />);
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        await waitFor(() => screen.findByText("TEXT"));
    });
});
