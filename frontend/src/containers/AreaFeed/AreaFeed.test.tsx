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
import { wait } from "@testing-library/user-event/dist/utils";
import { IProps } from "../../components/PostModal/PostModal";


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

jest.mock("../../components/PostModal/PostModal", () => (props: IProps) => (
    <div>
        <button
            data-testid="spyModal"
            className="submitButton"
            onClick={props.postModalCallback}
        ></button>
    </div>
));

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
                    user_name: "user1",
                    content: "content1",
                    latitude: 37.44877599087201,
                    longitude: 126.95264777802309,
                    created_at: new Date().toLocaleDateString(),
                    reply_to_author: 1,
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
                    user_name: "user2",
                    content:
                        "content2",
                    latitude: 37.44877599087201,
                    longitude: 126.95264777802309,
                    created_at: new Date().toLocaleDateString(),
                    image: "/logo192.png",
                    reply_to_author: null,
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
    });
    it("should handle back button", async () => {
        const view = render(<AreaFeed />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const backBtn = view.container.querySelector('#back-button');
        fireEvent.click(backBtn!);
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith(`/`)
        );
    });
    it("should handle refresh button", async () => {
        const view = render(<AreaFeed />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const refreshBtn = view.container.querySelector('#refresh-button');
        fireEvent.click(refreshBtn!);
        await waitFor(() =>
            expect(mockedAxios.get).toHaveBeenCalled()
        );
    });

    it("should handle hashtag togglebutton", async () => {
        render(<AreaFeed />);
        await waitFor(() => screen.findByText("#hashtag1"));
        // eslint-disable-next-line testing-library/await-async-query
        const hashtag1Btn = screen.findByText("#hashtag1");
        fireEvent.click(await hashtag1Btn!);
        await waitFor(() =>
            expect(screen.queryByText("user2")).not.toBeInTheDocument()
        );
    });
    it("should handle only Photos button", async () => {
        render(<AreaFeed />);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const photosBtn = screen.getByRole('switch');
        fireEvent.click(photosBtn!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });

    it("should handle search", async () => {
        const {container} = render(<AreaFeed />);
        await screen.findByText("#hashtag1");
        // eslint-disable-next-line testing-library/no-node-access
        const newSearchBox = screen.getByRole('textbox');
        if (newSearchBox){
            fireEvent.change(newSearchBox, { target: { value: "t2" } });
        };
        await screen.findByDisplayValue('t2');
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const searchIcon = container.getElementsByClassName("MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-49 ForwardRef-searchIconButton-51")[0];
        fireEvent.click(searchIcon!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });

    it("should handle postlistcallback after adding post", async () => {
        render(<AreaFeed />);
        await waitFor(() => screen.findByText("user1"));
        const addPostButton = screen.getByText("Add Post");
        fireEvent.click(addPostButton!);
        const modalButton = screen.getByTestId("spyModal");
        fireEvent.click(modalButton);
        // refresh -> re-render
        await waitFor(() =>
            expect(mockedAxios.get).toHaveBeenCalledTimes(6)
        );
    })

    // it("should handle close search", async () => {
    //     const {container} = render(<AreaFeed />);
    //     await screen.findByText("user1");
    //     const searchInput = screen.getByRole("textbox");
    //     fireEvent.change(searchInput, {target: {value: "t2"}});
    //     await screen.findByDisplayValue("t2");
    //     // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    //     const searchIcon = container.getElementsByClassName("MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-68")[0];
    //     fireEvent.click(searchIcon!);
    //     await waitFor(() =>
    //         expect(screen.getByRole('textbox')).toHaveValue("")
    //     );
    // });

});
