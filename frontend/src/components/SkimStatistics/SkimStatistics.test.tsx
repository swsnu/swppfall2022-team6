import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { PositionType } from "../../store/slices/position";
import SkimStatistics, { SmallStatistics } from "./SkimStatistics";
import { getMockStore, mockStore, mockStoreHashFeed1 } from "../../test-utils/mock";
import { Provider } from "react-redux";

const sampleCoord: PositionType = {
    lat: 37.45940728355063,
    lng: 126.95102476838396,
};
const mockResultData = [
    {
        address_name: "서울특별시 관악구 신림동",
    },
];
//console.log = jest.fn();
//console.error = jest.fn();

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

describe("<SkimStatistics />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.kakao = kakao as any;
    });
    it("should render without error", async () => {
        const mockCoord2RegionCode = jest.fn((lng, lat, callback) =>
            callback(mockResultData, "OK")
        );
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
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
        render(
            <Provider store={mockStore}>
                <SkimStatistics position={sampleCoord} radius={2} />
            </Provider>
        );
        await screen.findByText("☀️ Sunny");
    });
    it("should render no reports", async () => {
        const mockCoord2RegionCode = jest.fn((lng, lat, callback) =>
            callback(mockResultData, "OK")
        );
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
        axios.get = jest.fn().mockResolvedValue({
            data: [
            ],
        });
        render(
            <Provider store={mockStoreHashFeed1}>
                <SkimStatistics position={sampleCoord} radius={2} />
            </Provider>
        );
        await screen.findByText("No Statistics!");
    });
    it("should render SmallStatistics", async () => {
        const mockCoord2RegionCode = jest.fn((lng, lat, callback) =>
            callback(mockResultData, "OK")
        );
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
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
        render(
            <Provider store={mockStore}>
                <SkimStatistics position={sampleCoord} radius={2} />
            </Provider>
        );
        await screen.findByText("☀️ Sunny");
    });
});
