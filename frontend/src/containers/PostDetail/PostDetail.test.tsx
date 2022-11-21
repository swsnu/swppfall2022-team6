import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import PostDetail from "./PostDetail";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<PostDetail />", () => {
    let postDetailJSX = (
        <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={<PostDetail/>}/>
                    </Routes>
                </MemoryRouter>
            </Provider>
    )
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve({
                data: {
                    post: {
                        content: "CONTENT",
                        created_at: "2022-11-10T11:01:05.882000",
                        hashtags: [{ id: 1, content: "HASHTAG" }],
                        id: 1,
                        latitude: 37.44877599087201,
                        longitude: 126.95264777802309,
                        image: null,
                        reply_to_author: null,
                        user_name: "USERNAME",
                    },
                    replies: [
                        {
                            content: "REPLY",
                            created_at: "2022-11-10T11:01:15.882000",
                            hashtags: [],
                            id: 2,
                            image: null,
                            latitude: 37.44877599087201,
                            longitude: 126.95264777802309,
                            reply_to_author: "USERNAME",
                            user_name: "REPLYUSER",
                        },
                    ],
                },
            });
        });
    });
    it("should render without errors", async () => {
        const { container } = render(postDetailJSX);
        await waitFor(() => {
            expect(container).toBeTruthy();
        });
    });
    it("should handle back button", async () => {
        render(postDetailJSX);
        const backButton = await screen.findByRole("button", { name: "back" });
        fireEvent.click(backButton!);
        expect(mockNavigate).toHaveBeenCalled();
    });
    it("should handle postListCallBack", async () => {
        const mockAxios = jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve({
                data: {
                    post: {
                        content: "CONTENT",
                        created_at: "2022-11-10T11:01:05.882000",
                        hashtags: [{ id: 1, content: "HASHTAG" }],
                        id: 1,
                        latitude: 37.44877599087201,
                        longitude: 126.95264777802309,
                        image: null,
                        reply_to_author: null,
                        user_name: "USERNAME",
                    },
                    replies: [
                        {
                            content: "REPLY",
                            created_at: "2022-11-10T11:01:15.882000",
                            hashtags: [],
                            id: 2,
                            image: null,
                            latitude: 37.44877599087201,
                            longitude: 126.95264777802309,
                            reply_to_author: "USERNAME",
                            user_name: "REPLYUSER",
                        },
                    ],
                },
            });
        });
        render(postDetailJSX);
        const openModalButton = await screen.findByText("Add Reply");
        fireEvent.click(openModalButton);
        const textField = screen.getByTestId("textField");
        fireEvent.change(textField, { target: { value: "TEXT" } });
        const submitButton = screen.getByText("Submit!");
        fireEvent.click(submitButton);
        expect(mockAxios).toHaveBeenCalled();
        const newReply = screen.getByText("TEXT");
        expect(newReply).toBeInTheDocument();
    });
    it("should map hashtags", async () => {
        render(postDetailJSX);
        await waitFor(() => {
            const hashtag = screen.getByText("#HASHTAG");
            expect(hashtag).toBeInTheDocument();
        });
    });
});
