import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import React from "react";
import ReportModal from "./ReportModal";
import userEvent from "@testing-library/user-event";
import { getMockStore, mockStore } from "../../test-utils/mock";
import { Provider } from "react-redux";
import { UserState } from "../../store/slices/user";
import { MemoryRouter, Route, Routes } from "react-router";

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
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed/");
        });
    });
    it("should change photo properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        const file = new File(["TEST"], "test.png", { type: "image/png" });
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
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
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
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
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const closeButton = screen.getByTestId("closeButton");
        fireEvent.click(closeButton);
    });
    it("should select weather properly", async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
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
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
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
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        await waitFor(() => screen.findByText("TEXT"));
    });
    it("should show nothing if openReport is false", async () => {
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={false}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        expect(() => screen.getByText("📷 Add Photo")).toThrow();
    });
    it("should handle null current user", async () => {
        const mymockStore = getMockStore({
            users: {
                users: [
                    {
                        id: 1,
                        password: "admin",
                        username: "user1",
                        email: "",
                        logged_in: true,
                        radius: 0.0,
                        main_badge: 1,
                    },
                ],
                currUser: null,
                userPosts: [],
            },
            posts: {
                posts: [],
            },
            reports: {
                reports: [],
            },
            hashtags: {
                hashtags: [],
                top3: [],
            },
            positions: {
                position: {
                    lat: 37.44877599087201,
                    lng: 126.95264777802309,
                },
            },
        });
        axios.post = jest.fn().mockResolvedValue({});
        render(
            <Provider store={mymockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
                                currPosition={{ lat: 0, lng: 0 }}
                                openReport={true}
                                setOpenReport={jest.fn()}
                                isNavbarReport={false}
                                navReportCallback={() => {}}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed/");
        });
    });
});
