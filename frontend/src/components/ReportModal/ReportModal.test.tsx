import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import React from "react";
import ReportModal from "./ReportModal";
import userEvent from "@testing-library/user-event";
import { getMockStore, mockStore, mockStoreHashFeed1 } from "../../test-utils/mock";
import { Provider } from "react-redux";
import { UserState } from "../../store/slices/user";
import { ApiErrorCode } from "../../store/slices/apierror";
import { MemoryRouter, Route, Routes } from "react-router";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

const mockResultData = [
    {
        address_name: "서울특별시 관악구 신림동",
    },
];
const kakao = {
    maps: {
        services: {
            Geocoder: jest.fn(),
            Status: {
                OK: "OK",
                ZERO_RESULT: "ZERO_RESULT",
                ERROR: "ERROR",
            },
        },
    },
};

describe("<ReportModal />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.kakao = kakao as any;
        const mockCoord2RegionCode = jest.fn((lng, lat, callback) =>
            callback(mockResultData, "OK")
        );
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
    });
    it("should handle form submit properly", async () => {
        axios.post = jest.fn().mockResolvedValue({});
        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
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
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed");
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
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed");
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
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed");
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
                        username: "user1",
                        email: "",
                        radius: 0.0,
                        main_badge: 1,
                    },
                ],
                currUser: null,
                userPosts: [],
                userBadges: [
                    {
                        id: 1,
                        title: "badge1",
                        image: "src1",
                        description: "badge1",
                        is_fulfilled: true,
                    },
                    {
                        id: 2,
                        title: "badge2",
                        image: "src2",
                        description: "badge2",
                        is_fulfilled: false,
                    }
                    ,
                    {
                        id: 3,
                        title: "badge3",
                        image: "src3",
                        description: "badge3",
                        is_fulfilled: true,
                    },
                    {
                        id: 4,
                        title: "badge4",
                        image: "src4",
                        description: "badge4",
                        is_fulfilled: false,
                    }
                    ,
                    {
                        id: 5,
                        title: "badge5",
                        image: "src5",
                        description: "badge5",
                        is_fulfilled: true,
                    }
                ],
                mainBadge: null,
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
                findPosition: {
                    lat: 37.44877599087201,
                    lng: 126.95264777802309,
                },
                currPosition: {
                    lat: 37.44877599087201,
                    lng: 126.95264777802309,
                },
            },
            apiErrors: {
                apiError: {
                    code: ApiErrorCode.TOKEN,
                    msg: ""
                }
            },
        });
        axios.post = jest.fn().mockResolvedValue({});
        render(
            <Provider store={mymockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
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
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed");
        });
    });
    it("should close modal when submitted on areafeed page", async () => {
        const mockCallback = jest.fn();
        const areafeedRoute = "/areafeed";
        render(
            <Provider store={mockStore}>
                <MemoryRouter initialEntries={[areafeedRoute]}>
                    <ReportModal
                        openReport={true}
                        setOpenReport={jest.fn()}
                        isNavbarReport={true}
                        navReportCallback={mockCallback}
                    />
                </MemoryRouter>
            </Provider>
        );
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(mockCallback).toHaveBeenCalled();
        });
    })
    it("should handle achievements", async () => {
        axios.post = jest.fn().mockResolvedValue({data:"payload"});
        axios.put = jest.fn().mockResolvedValue({})
        render(
            <Provider store={mockStoreHashFeed1}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <ReportModal
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
            expect(mockNavigate).toHaveBeenCalledWith("/areafeed");
        });
    });
});
