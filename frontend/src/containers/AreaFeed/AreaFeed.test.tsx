import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import "jest-canvas-mock";
import AreaFeed from "./AreaFeed";
import { IProps } from "../../components/PostModal/PostModal";
import { IProps as ReportProps } from "../../components/ReportModal/ReportModal";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import { PostType } from "../../store/slices/post";

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
// const mockDispatch = jest.fn();
// jest.mock("react-redux", ()=>({
//   ...jest.requireActual("react-redux"),
//   useDispatch: ()=>mockDispatch,
console.error = jest.fn();
// }));
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock(
    "../../components/PostList/PostList",
    () =>
        ({
            type,
            postListCallback,
            replyTo,
            allPosts,
        }: {
            type: string;
            postListCallback: () => void;
            replyTo: number;
            allPosts: PostType[];
        }) =>
            (
                <div>
                    {allPosts.map((a) => (
                        <div>
                            {/* <p>{a.content}</p> */}
                            <p>{a.user_name}</p>
                        </div>
                    ))}
                    <button onClick={postListCallback}>Callback</button>
                </div>
            )
);
jest.mock("../../components/ReportModal/ReportModal", () => (props: ReportProps) => (
    <div>
        <button
            data-testid="spyNavReportModal"
            className="submitButton"
            onClick={props.navReportCallback}
        ></button>
    </div>
));

describe("<AreaFeed />", () => {
    let areaFeedJSX: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        const weather = {
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            main: {
                temp: 283.76,
            },
        };
        areaFeedJSX = (
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<AreaFeed />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        mockedAxios.get.mockImplementation((url: string) => {
            switch (true) {
                case url.includes("/post/"):
                    return Promise.resolve({
                        data: {
                            posts: mockStore.getState().posts.posts,
                            top3_hashtags: mockStore.getState().hashtags.top3,
                        },
                    });
                case url.includes("/report/"):
                    return Promise.resolve({
                        data: mockStore.getState().reports.reports,
                    });
                case url.includes("https://api.openweathermap.org/data/2.5/"):
                    return Promise.resolve({ data: weather });
                default:
                    return Promise.reject(new Error("not found"));
            }
        });
    });

    it("should render withour errors", async () => {
        const { container } = render(areaFeedJSX);
        await waitFor(() => {
            expect(container).toBeTruthy();
        });
    });
    it("should handle back button", async () => {
        const view = render(areaFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const backBtn = view.container.querySelector("#back-button");
        fireEvent.click(backBtn!);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });
    it("should handle refresh button", async () => {
        const view = render(areaFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const refreshBtn = view.container.querySelector("#refresh-button");
        fireEvent.click(refreshBtn!);
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    });

    // it("should handle hashtag togglebutton", async () => {
    //     render(areaFeedJSX);
    //     await waitFor(() => screen.findByText("#hashtag1"));
    //     // eslint-disable-next-line testing-library/await-async-query
    //     const hashtag1Btn = screen.findByText("#hashtag1");
    //     fireEvent.click(await hashtag1Btn!);
    //     await waitFor(() =>
    //         expect(screen.queryByText("user2")).not.toBeInTheDocument()
    //     );
    // });
    it("should handle hashtag button", async () => {
        render(areaFeedJSX);
        await waitFor(() => screen.findByText("#hashtag1"));
        // eslint-disable-next-line testing-library/await-async-query
        const hashtag1Btn = screen.findByText("#hashtag1");
        fireEvent.click(await hashtag1Btn!);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });
    it("should handle only Photos button", async () => {
        render(areaFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        await waitFor(() =>
            expect(screen.queryByText("Loading")).not.toBeInTheDocument()
        );
        const photosBtn = screen.getByRole("switch");
        fireEvent.click(photosBtn!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });

    it("should handle search", async () => {
        const { container } = render(areaFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const newSearchBox = screen.getByRole("textbox");
        fireEvent.change(newSearchBox, { target: { value: "t2" } });
        await screen.findByDisplayValue("t2");
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const searchIcon = container.getElementsByClassName(
            "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-22 ForwardRef-searchIconButton-24"
        )[0];
        fireEvent.click(searchIcon!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });

    it("should handle postlistcallback after adding post", async () => {
        render(areaFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const addPostButton = screen.getByText("Callback");
        fireEvent.click(addPostButton);
        // refresh -> re-render
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(8));
    });
    it("should handle navReportCallback after submit", async () => {
        render(areaFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const report_button = screen.getByTestId("report-button");
        fireEvent.click(report_button!);
        const modalButton = screen.getByTestId("spyNavReportModal");
        fireEvent.click(modalButton);
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(8));
    });

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
