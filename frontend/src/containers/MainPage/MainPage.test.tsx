import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "jest-canvas-mock";
import MainPage from "./MainPage";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../components/Map/Map", ()=>(props: any)=><div>MapSearch</div>);
jest.mock("../../components/MapSearch/MapSearch", ()=>(props: any)=><div>MapSearch</div>);
jest.mock("../../components/ReportModal/ReportModal", ()=>(props: any)=><div>MapSearch</div>);
console.log = jest.fn();

const kakao = {
    maps: {
      services: {
        Geocoder: jest.fn(),
        Status: {
          OK: "OK",
          ZERO_RESULT: "ZERO_RESULT",
          ERROR: "ERROR",
        }},
    },
  };

describe("<MainPage />", () => {
    beforeEach(() => {
        const mockCoord2RegionCode = jest.fn((lng, lat, callback)=>callback(
            [{
                address_name: "서울특별시 관악구 신림동"
            }],
            "OK",
        ));
        jest.clearAllMocks();
        global.kakao = kakao as any;
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
    });
    it("should render without errors", () => {
        const { container } = render(<MainPage />);
        expect(container).toBeTruthy();
    });
    it("should not set address if kakao API error", () => {
        const mockCoord2RegionCodeError = jest.fn((lng, lat, callback)=>callback(
            [{
                address_name: ""
            }],
            "ERROR",
        ));
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCodeError,
        });
        render(<MainPage />);
    });
    it("should handle MyPage button", async () => {
        render(<MainPage />);
        const myPageBtn = screen.getByLabelText("mypage-button");
        fireEvent.click(myPageBtn!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(`/mypage`)
        );
    });
    it("should handle findout button", async () => {
        render(<MainPage />);
        const findoutBtn = screen.getByLabelText("findout-button");
        fireEvent.click(findoutBtn!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(`/areafeed`)
        );
    });
    it("should handle report button", async () => {
        render(<MainPage />);
        console.error = jest.fn();
        const reportBtn = screen.getByRole("button", { name: "Report!" });
        fireEvent.click(reportBtn!);
    });
    it("should close search result if background clicked", async () => {
        render(<MainPage />);
        console.error = jest.fn();
        const backGrounds = screen.getAllByLabelText("background");
        for(let i=0; i<backGrounds.length; i++){
            fireEvent.click(backGrounds[i]!);
        }
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
