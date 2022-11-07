import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import "jest-canvas-mock";
import AreaFeed from "./AreaFeed";
import PostList from "../../components/PostList/PostList";
import { MemoryRouter, Route, Routes } from "react-router";
import { postProps } from "../../components/Post/Post";
import {PostType} from "./AreaFeed";
import { formControlUnstyledClasses } from "@mui/base";


jest.mock("react-chartjs-2", () => ({
    Bar: () => <div>BarChart</div>,
}));
jest.mock("react-minimal-pie-chart", () => ({
    PieChart: () => <div>PieChart</div>,
}));
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));
jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>;


describe("<AreaFeed />", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        const report = [
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
        ];

        const post = {
            posts: [
                {
                    id: 2,
                    user: 2,
                    content: "content1",
                    latitude: 37.44877599087201,
                    longitude: 126.95264777802309,
                    created_at: new Date().toLocaleDateString(),
                    reply_to: 1,
                    image: "",
                    hashtags: [
                        {
                            id: 1,
                            content: "hashtag1",
                        },
                        {
                            id: 2,
                            content: "hashtag2",
                        },
                        {
                            id: 3,
                            content: "hashtag3",
                        }
                    ]
                },
                {
                    id: 1,
                    user: 1,
                    content:
                        "content2",
                    latitude: 37.44877599087201,
                    longitude: 126.95264777802309,
                    created_at: new Date().toLocaleDateString(),
                    image: "",
                    reply_to: null,
                    hashtags: []
                },
            ],
            top3_hashtags: [
                "hashtag1",
                "hashtag2",
                "hashtag3",
            ]
        };

        const weather ={
            weather: [{id: 800, main: 'Clear', description: 'clear sky', icon: '01d'}],
            main: {
                temp: 283.76
            }
        };

        mockedAxios.get.mockImplementation((url: string) => {
            switch (true) {
                case url.includes('/post/'):
                    return Promise.resolve({data: post})
                case url.includes('/report/'):
                    return Promise.resolve({data: report})
                case url.includes('https://api.openweathermap.org/data/2.5/'):
                    return Promise.resolve({data: weather})
                default:
                return Promise.reject(new Error('not found'))
            }
        })

    });

    it("should render withour errors", async() => {
        const { container } = render(<AreaFeed />);
        await waitFor(() => {expect(container).toBeTruthy() });
        await waitFor(() => screen.findByText("hashtag1"));
        //eslint-disable-next-line testing-library/no-debugging-utils
        screen.debug();
    });
    it("should handle back button", async () => {
        render(<AreaFeed />);
        const backBtn = screen.getByRole("button", { name: "Back" });
        fireEvent.click(backBtn!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(`/`)
        );
    });
    it("should handle refresh button", async () => {
        render(<AreaFeed />);
        const refreshBtn = screen.getByRole("button", { name: "Refresh" });
        fireEvent.click(refreshBtn!);
        await waitFor(() =>
            expect(mockedAxios.get).toHaveBeenCalled()
        );
        // //eslint-disable-next-line testing-library/no-debugging-utils
        // screen.debug();
    });

    it("should handle 3 hashtag button", async () => {
        render(<AreaFeed />);
        await waitFor(() => screen.findByText("hashtag1"));
        const hashtag1Btn = screen.getByRole("button", { name: "hashtag1" });
        const hashtag2Btn = screen.getByRole("button", { name: "hashtag2" });
        const hashtag3Btn = screen.getByRole("button", { name: "hashtag3" });
        fireEvent.click(hashtag1Btn!);
        await waitFor(() =>
            expect(screen.queryByText("WeatherFairy")).not.toBeInTheDocument()
        );
        await screen.findByText("Toothfairy");
        fireEvent.click(hashtag2Btn!);
        await waitFor(() =>
            expect(screen.queryByText("WeatherFairy")).not.toBeInTheDocument()
        );
        await screen.findByText("Toothfairy");
        fireEvent.click(hashtag3Btn!);
        await waitFor(() =>
            expect(screen.queryByText("WeatherFairy")).not.toBeInTheDocument()
        );
        await screen.findByText("Toothfairy");
    });
    it("should handle only Photos button", async () => {
        render(<AreaFeed />);
        const photosBtn = screen.getByRole("button", { name: "Only Photos" });
        // //eslint-disable-next-line testing-library/no-debugging-utils
        // screen.debug();
        fireEvent.click(photosBtn!);
        await waitFor(() =>
            expect(screen.queryByText("WeatherFairy")).not.toBeInTheDocument()
        );
        await waitFor(() =>
            expect(screen.queryByText("Toothfairy")).not.toBeInTheDocument()
        );
    });
    it("should handle search-box container", async () => {
        render(<AreaFeed />);
        await waitFor(() => screen.findByText("hashtag1"));
        // eslint-disable-next-line testing-library/no-node-access
        const newSearchBox = document.getElementById("search-box");
        if (newSearchBox){
            fireEvent.change(newSearchBox, { target: { value: "t2" } });
        };
        await screen.findByDisplayValue('t2');
        if (newSearchBox){
            fireEvent.keyPress(newSearchBox, { key: 'Enter', keyCode: 13 });
        };
        await waitFor(() =>
            expect(screen.queryByText("Toothfairy")).not.toBeInTheDocument()
        );
        await screen.findByText("WeatherFairy");
    });
    it("should handle faulty key press in search-box container", async () => {
        render(<AreaFeed />);
        await waitFor(() => screen.findByText("hashtag1"));
        // eslint-disable-next-line testing-library/no-node-access
        const newSearchBox = document.getElementById("search-box");
        if (newSearchBox){
            fireEvent.change(newSearchBox, { target: { value: "t2" } });
        };
        await screen.findByDisplayValue('t2');
        if (newSearchBox){
            fireEvent.keyPress(newSearchBox, {key: "0",
            code: "Digit0",
            keyCode: 48,
            charCode: 48 });
        }
        await new Promise((r) => setTimeout(r, 2000));
        await screen.findByText("Toothfairy");
    });

});
