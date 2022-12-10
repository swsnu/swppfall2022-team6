import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import "jest-canvas-mock";
import { IProps } from "../../components/PostModal/PostModal";
import { IProps as ReportProps } from "../../components/ReportModal/ReportModal";
import { Provider } from "react-redux";
import { mockStore, mockStoreHashFeed1 } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import HashFeed from "./HashFeed";
import { PostType } from "../../store/slices/post";
import { HashtagState } from "../../store/slices/hashtag";

jest.mock(
    "../../components/PostList/PostList",
    () =>
        ({
            postListCallback,
            allPosts,
        }: {
            postListCallback: () => void;
            allPosts: PostType[];
        }) =>
            (
                <div>
                    <button onClick={postListCallback}>Callback</button>
                    {allPosts
                        ? allPosts.map((a) => (
                              <div>
                                  <p>{a.user_name}</p>
                              </div>
                          ))
                        : null}
                </div>
            )
);

jest.mock("../../components/PostModal/PostModal", () => (props: IProps) => (
    <div>
        <button
            data-testid="spyModal"
            className="submitButton"
            onClick={props.postModalCallback}
        ></button>
    </div>
));
jest.mock(
    "../../components/ReportModal/ReportModal",
    () => (props: ReportProps) =>
        (
            <div>
                <button
                    data-testid="spyNavReportModal"
                    className="submitButton"
                    onClick={props.navReportCallback}
                ></button>
            </div>
        )
);
jest.mock("../../components/Loading/Loading", () => () => <div>Loading</div>);
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<HashFeed />", () => {
    let hashFeedJSX: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        hashFeedJSX = (
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<HashFeed />} />
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
                default:
                    return Promise.reject(new Error("not found"));
            }
        });
    });
    it("should render withour errors", async () => {
        const { container } = render(hashFeedJSX);
        await waitFor(() => {
            expect(container).toBeTruthy();
        });
    });
    it("should handle back button", async () => {
        const view = render(hashFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const backBtn = view.container.querySelector("#back-button");
        fireEvent.click(backBtn!);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });
    it("should handle refresh button", async () => {
        const view = render(hashFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const refreshBtn = view.container.querySelector("#refresh-button");
        fireEvent.click(refreshBtn!);
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalled());
    });

    it("should handle hashtag togglebutton", async () => {
        render(hashFeedJSX);
        await waitFor(() => screen.findByText("#hashtag2"));
        // eslint-disable-next-line testing-library/await-async-query
        const hashtag2Btn = screen.findByText("#hashtag2");
        fireEvent.click(await hashtag2Btn!);
        await waitFor(
            () => expect(mockNavigate).toHaveBeenCalled()
            //expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
    });
    it("should handle only Photos button", async () => {
        render(hashFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        await waitFor(() =>
            expect(screen.queryByText("Loading")).not.toBeInTheDocument()
        );
        const photosBtn = screen.queryByRole("checkbox");
        fireEvent.click(photosBtn!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });
    it("should handle search", async () => {
        const { container } = render(hashFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const newSearchBox = screen.getByRole("textbox");
        fireEvent.change(newSearchBox, { target: { value: "t2" } });
        await screen.findByDisplayValue("t2");
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const searchIcon = container.getElementsByClassName(
            "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-19 ForwardRef-searchIconButton-21"
        )[0];
        fireEvent.click(searchIcon!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });
    it("should handle cancel search", async () => {
        const { container } = render(hashFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const newSearchBox = screen.getByRole("textbox");
        fireEvent.change(newSearchBox, { target: { value: "t2" } });
        await screen.findByDisplayValue("t2");
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const searchIcon = container.getElementsByClassName(
            "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-27"
        )[1];
        fireEvent.click(searchIcon!);
        await waitFor(() =>
            expect(screen.queryByText("t2")).not.toBeInTheDocument()
        );
    });
    it("should handle postlistcallback after adding post", async () => {
        render(hashFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const addPostButton = screen.getByText("Callback");
        fireEvent.click(addPostButton!);
        // refresh -> re-render
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
    });
    it("should handle navReportCallback after submit", async () => {
        render(hashFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const report_button = screen.getByTestId("report-button");
        fireEvent.click(report_button!);
        const modalButton = screen.getByTestId("spyNavReportModal");
        fireEvent.click(modalButton);
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(2));
    });
    it("should handle window resize", async () => {
        render(hashFeedJSX);
        global.innerWidth = 500;
        await waitFor(() => global.dispatchEvent(new Event("resize")));
        await waitFor(() => screen.findByText("user1"));
        global.innerWidth = 1500;
        await waitFor(() => global.dispatchEvent(new Event("resize")));
        await waitFor(() => screen.findByText("user1"));
    });
    it("should handle undefined fetchData", async () => {
        axios.get = jest.fn().mockResolvedValue(undefined);
        render(hashFeedJSX);
        await waitFor(() => expect(mockNavigate).toBeCalled());
    });
    it("should show no hashtags if none", async () => {
        jest.clearAllMocks();
        const hashFeedJSX1 = (
            <Provider store={mockStoreHashFeed1}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<HashFeed />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );
        mockedAxios.get.mockImplementation((url: string) => {
            switch (true) {
                case url.includes("/post/"):
                    return Promise.resolve({
                        data: {
                            posts: mockStoreHashFeed1.getState().posts.posts,
                            top3_hashtags: mockStoreHashFeed1.getState().hashtags.top3,
                        },
                    });
                default:
                    return Promise.reject(new Error("not found"));
            }
        });
        render(hashFeedJSX1);
        await waitFor(() => screen.findByText("user1"));
    });
});
