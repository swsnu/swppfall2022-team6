import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import NavigationBar from "./NavigationBar";
import { getMockStore, mockStore } from "../../test-utils/mock";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<NavigationBar />", () => { 
    let navbar: JSX.Element;
    beforeEach(() => {
        navbar = (
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <NavigationBar 
                                navReportCallback={jest.fn()}
                            />
                        } />
                    </Routes>
                </MemoryRouter>
            </Provider>
        )
    });
    it("should render properly", () => {
        const { container } = render(navbar);
        expect(container).toBeTruthy();
    });
    it("should navigate to main page when home button is clicked", async () => {
        render(navbar);
        screen.debug();
        const home_button = screen.getByTestId("home-button");
        fireEvent.click(home_button!);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });
    it("should nagivate to mypage when user button is clicked", async () => {
        render(navbar);
        const user_button = screen.getByTestId("user-button");
        fireEvent.click(user_button!);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/mypage"));
    });
    it("should open ReportModal when report button is clicked", () => {
        render(navbar);
        const report_button = screen.getByTestId("report-button");
        fireEvent.click(report_button!);
        const snow_text = screen.getByText("❄️ Snow");
        expect(snow_text).toBeInTheDocument();
    });
    it("should get current location if navigator avaliable", async () => {
        const mockGeolocation = {
            ...navigator.geolocation,
            getCurrentPosition: jest.fn().mockImplementation((success) =>
                Promise.resolve(
                    success({
                        coords: {
                            latitude: 10,
                            longitude: 10,
                        },
                    })
                )
            ),
        };
        // @ts-ignore
        navigator.geolocation = mockGeolocation;
        const spy = jest.spyOn(navigator.geolocation, "getCurrentPosition");
        render(navbar);
        expect(spy).toHaveBeenCalled();
    });
})