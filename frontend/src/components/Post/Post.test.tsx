import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { MemoryRouter, Route, Routes } from "react-router";
import Post from "./Post";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Post />", () => {
    it("should render without errors", () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={""}
                                reply_to_author={null}
                                isReplyList={0}
                                clickPost={jest.fn()}
                                toggleChain={jest.fn()}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const username = screen.getByText("User Name");
        const postContent = screen.getByText("Post Content");
        const postLoc = screen.getByText("User Loc");
        const dtText = screen.getByText("2020. 10. 20. 오전 10:20");
        expect(username).toBeInTheDocument();
        expect(postContent).toBeInTheDocument();
        expect(postLoc).toBeInTheDocument();
        expect(dtText).toBeInTheDocument();
    });
    it("should not render toggleChainButton when there are no replies", () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={""}
                                reply_to_author={null}
                                isReplyList={1}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const toggleChainButton = screen.queryAllByText("Show All");
        //The toggleChainButton should not be in the document when reply_to is 0
        expect(toggleChainButton).toHaveLength(0);
    });
    it("should render show all when there are replies, and chain is not open", () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={""}
                                reply_to_author={"SWPP"}
                                isReplyList={0}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const username = screen.getByText("User Name");
        expect(username.classList.contains("reply_to_author")).not.toBe(null);
        expect(username.classList.contains("chain_open")).toBe(false);
        screen.getByText("Show All");
    });
    it("should render author of reply in post", () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={""}
                                reply_to_author={"SWPP"}
                                isReplyList={0}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const chainAuthorUsername = screen.getByText("@SWPP");
        expect(chainAuthorUsername).toBeInTheDocument();
    });
    it("should open the chain properly", () => {
        jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve({
                data: {
                    id: 2,
                    user_name: "SWPP2",
                    content: "CHAIN",
                    image: "",
                    longitude: 37,
                    created_at: "2020-10-21 10:20:30",
                    reply_to_author: "User Name",
                    hashtags: [],
                },
            });
        });
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={""}
                                reply_to_author={"SWPP"}
                                isReplyList={0}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const toggleChainButton = screen.getByText("Show All");
        fireEvent.click(toggleChainButton);
        // should edit after chain backend is implemented
        const chainPostContent = screen.getByText("Post Content");
        const chainPostLoc = screen.getByText("Location");
        const chainDtText = screen.getByText(new Date().toLocaleDateString());
        expect(chainPostContent).toBeInTheDocument();
        expect(chainPostLoc).toBeInTheDocument();
        expect(chainDtText).toBeInTheDocument();
        const newToggleChainButton = screen.getByText("Close All");
        expect(newToggleChainButton).toBeInTheDocument();
    });
    it("should navigate to the post on click", async () => {
        jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve([
                {
                    data: {
                        id: 2,
                        user_name: "SWPP2",
                        content: "CHAIN",
                        image: "",
                        longitude: 37,
                        created_at: "2020-10-21 10:20:30",
                        reply_to_author: "User Name",
                        hashtags: [],
                    },
                },
            ]);
        });
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={""}
                                reply_to_author={"SWPP"}
                                isReplyList={0}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const toggleChainButton = screen.getByText("Show All");
        fireEvent.click(toggleChainButton);
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
            const post = screen.getByText("ButtonSWPP2");
            fireEvent.click(post);
            expect(mockNavigate).toHaveBeenCalledTimes(1);
        });
    });
});
