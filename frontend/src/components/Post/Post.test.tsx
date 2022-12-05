import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import Post from "./Post";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Post />", () => {
    let postJSX = (
            {image, reply_to_author}
            :{image:string, reply_to_author:string|null}
            = {image:"", reply_to_author:null}
        )=>(
        <Provider store={mockStore}>
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Post
                                user_name={"User Name"}
                                badge_id={1}
                                content={"Post Content"}
                                location={"User Loc"}
                                created_at={"2020-10-20 10:20:30"}
                                id={1}
                                image={image}
                                reply_to_author={reply_to_author}
                                isReplyList={0}
                                clickPost={jest.fn()}
                                toggleChain={jest.fn()}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render without errors", () => {
        render(postJSX());
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
        render(postJSX());
        const toggleChainButton = screen.queryAllByText("Show All");
        //The toggleChainButton should not be in the document when reply_to is 0
        expect(toggleChainButton).toHaveLength(0);
    });
    it("should render show all when there are replies, and chain is not open", () => {
        render(postJSX({image:"", reply_to_author:"SWPP"}));
        const username = screen.getByText("User Name");
        expect(username.classList.contains("reply_to_author")).not.toBe(null);
        expect(username.classList.contains("chain_open")).toBe(false);
        screen.getByText("Show All");
    });
    it("should render author of reply in post", () => {
        render(postJSX({image:"", reply_to_author:"SWPP"}));
        const chainAuthorUsername = screen.getByText("@SWPP");
        expect(chainAuthorUsername).toBeInTheDocument();
    });
    it("should open the chain properly", async () => {
        jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve({
                data: [
                    {
                        id: 2,
                        user_name: "SWPP2",
                        content: "CHAIN",
                        image: "",
                        latitude: 127,
                        longitude: 37,
                        created_at: "2020-10-21 10:20:30",
                        reply_to_author: "User Name",
                        hashtags: [],
                    },
                ],
            });
        });
        render(postJSX({image:"hi", reply_to_author:"SWPP"}));
        // const toggleChainButton = await waitFor(() =>
        //     screen.getByText("Show All")
        // );
        const toggleChainButton = await screen.findByText("Show All");
        fireEvent.click(toggleChainButton);
        expect(axios.get).toHaveBeenCalled();
        const chainPostContent = await screen.findByText("CHAIN");
        expect(chainPostContent).toBeInTheDocument();
        const chainDtText = screen.getByText("2020. 10. 21. 오전 10:20");
        expect(chainDtText).toBeInTheDocument();
        const newToggleChainButton = screen.getByText("Close All");
        expect(newToggleChainButton).toBeInTheDocument();

        const chainPostUser = screen.getByText("SWPP2");
        expect(chainPostUser).toBeInTheDocument();
        fireEvent.click(chainPostUser);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should open the chain if something is missing", async () => {
        jest.spyOn(axios, "get").mockImplementation(() => {
            return Promise.resolve({
                data: [
                    {
                        id: 2,
                        user_name: "SWPP2",
                        content: "",
                        image: "bye",
                        latitude: 127,
                        longitude: 37,
                        created_at: "2020-10-21 10:20:30",
                        reply_to_author: "User Name",
                        hashtags: [],
                    },
                ],
            });
        });
        render(postJSX({image:"hi", reply_to_author:"SWPP"}));
        const toggleChainButton = await screen.findByText("Show All");
        fireEvent.click(toggleChainButton);
        expect(axios.get).toHaveBeenCalled();

        const chainPostUser = await screen.findByText("SWPP2");
        const chainDtText = screen.getByText("2020. 10. 21. 오전 10:20");
        expect(chainPostUser).toBeInTheDocument();
        expect(chainDtText).toBeInTheDocument();
        const newToggleChainButton = screen.getByText("Close All");
        expect(newToggleChainButton).toBeInTheDocument();
    });
});
