import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "jest-canvas-mock";
import MainPage from "./MainPage";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));
console.log = jest.fn();

// const mockGeolocation = {
//   getCurrentPosition: jest.fn(),
// };

// (global.navigator as unknown as jest.Mock).mockReturnValue({
//   geolocation: mockGeolocation
// })

describe("<MainPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render withour errors", () => {
        const { container } = render(<MainPage />);
        expect(container).toBeTruthy();
    });
    it("should handle MyPage button", async () => {
        render(<MainPage />);
        const myPageBtn = screen.getByRole("button", { name: "MyPage" });
        fireEvent.click(myPageBtn!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(`/mypage`)
        );
    });
    it("should handle findout button", async () => {
        render(<MainPage />);
        const findoutBtn = screen.getByRole("button", { name: "Find out" });
        fireEvent.click(findoutBtn!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(`/areafeed`)
        );
    });
    it("should handle report button", async () => {
        render(<MainPage />);
        console.error = jest.fn();
        const reportBtn = screen.getByRole("button", { name: "Report" });
        fireEvent.click(reportBtn!);
    });
    it("should change slider properly", async () => {
        render(<MainPage />);
        const weatherSlider = screen.getByLabelText("Custom marks");
        fireEvent.change(weatherSlider, { target: { value: 1 } });
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

        render(<MainPage />);
        expect(spy).toHaveBeenCalled();
    });
});
