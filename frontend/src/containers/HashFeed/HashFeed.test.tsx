import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import "jest-canvas-mock";
import { IProps } from "../../components/PostModal/PostModal";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import HashFeed from "./HashFeed";

jest.mock("../../components/PostModal/PostModal", () => (props: IProps) => (
    <div>
        <button
            data-testid="spyModal"
            className="submitButton"
            onClick={props.postModalCallback}
        ></button>
    </div>
));
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
        await waitFor(() => screen.findByText("#hashtag1"));
        // eslint-disable-next-line testing-library/await-async-query
        const hashtag1Btn = screen.findByText("#hashtag1");
        fireEvent.click(await hashtag1Btn!);
        await waitFor(() =>
            expect(screen.queryByText("user2")).not.toBeInTheDocument()
        );
    });
    it("should handle only Photos button", async () => {
        render(hashFeedJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const photosBtn = screen.getByRole("switch");
        fireEvent.click(photosBtn!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });

    it("should handle search", async () => {
        const { container } = render(hashFeedJSX);
        const newSearchBox = screen.getByRole("textbox");
        fireEvent.change(newSearchBox, { target: { value: "t2" } });
        await screen.findByDisplayValue("t2");
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const searchIcon = container.getElementsByClassName(
            "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-49 ForwardRef-searchIconButton-51"
        )[0];
        fireEvent.click(searchIcon!);
        await waitFor(() =>
            expect(screen.queryByText("user1")).not.toBeInTheDocument()
        );
        await screen.findByText("user2");
    });

    it("should handle postlistcallback after adding post", async () => {
        render(hashFeedJSX);
        await waitFor(() => screen.findByText("user1"));
        const addPostButton = screen.getByText("Add Post");
        fireEvent.click(addPostButton!);
        const modalButton = screen.getByTestId("spyModal");
        fireEvent.click(modalButton);
        // refresh -> re-render
        await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(4));
    });
});
