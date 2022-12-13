import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { IProps } from "../PostModal/PostModal";
import PostList from "./PostList";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

jest.mock(
    "../Post/Post",
    () =>
        ({
            user_name,
            clickPost,
        }: {
            user_name: string;
            clickPost: () => void;
        }) =>
            (
                <div data-testid="spyPost">
                    <p id="user-name">{user_name}</p>
                    <button id="spy-button" onClick={clickPost}>
                        Button{user_name}
                    </button>
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

describe("<PostList />", () => {
    let postList: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        postList = (
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PostList
                                type={"Post"}
                                postListCallback={jest.fn()}
                                replyTo={0}
                                allPosts={[
                                    {
                                        id: 2,
                                        user_name: "SWPP2",
                                        badge_id: 1,
                                        content:
                                            "학교는 많이 춥네요ㅠㅠ\n겉옷 챙기시는게 좋을 것 같아요!",
                                        latitude: 37.44877599087201,
                                        longitude: 126.95264777802309,
                                        location: "관악구 봉천동",
                                        created_at:
                                            new Date().toLocaleDateString(),
                                        reply_to_author: "SWPP",
                                        image: "",
                                        hashtags: [],
                                    },
                                    {
                                        id: 1,
                                        user_name: "SWPP",
                                        badge_id: 1,
                                        content:
                                            "지금 설입은 맑긴 한데 바람이 많이 불어요\n겉옷을 안 챙겨 나왔는데 학교도 춥나요? 자연대 쪽에...",
                                        latitude: 37.44877599087201,
                                        longitude: 126.95264777802309,
                                        location: "관악구 봉천동",
                                        created_at:
                                            new Date().toLocaleDateString(),
                                        image: "",
                                        reply_to_author: "SWPP",
                                        hashtags: [],
                                    },
                                ]}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
    });
    it("should render PostList", () => {
        const { container } = render(postList);
        expect(container).toBeTruthy();
    });
    it("should render Posts", () => {
        render(postList);
        const first_post = screen.getByText("SWPP");
        const second_post = screen.getByText("SWPP2");
        expect(first_post).toBeInTheDocument();
        expect(second_post).toBeInTheDocument();
    });
    it("should render Add Post button", () => {
        render(postList);
        const addPostButton = screen.getByText("Add Post");
        expect(addPostButton).toBeInTheDocument();
    });
    it("should show modal properly", () => {
        render(postList);
        const modalbutton = screen.getByText("Add Post");
        fireEvent.click(modalbutton);
    });
    it("should close modal proplery", () => {
        const mockCallback = jest.fn();
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PostList
                                type={"Post"}
                                postListCallback={mockCallback}
                                replyTo={0}
                                allPosts={[]}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
        const modalbutton = screen.getByText("Add Post");
        fireEvent.click(modalbutton);
        const modalButton = screen.getByTestId("spyModal");
        fireEvent.click(modalButton);
        expect(mockCallback).toHaveBeenCalled();
    });
    it("should not show button when mypage", () => {
        render(
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PostList
                                type={"Mypage"}
                                postListCallback={jest.fn()}
                                replyTo={0}
                                allPosts={[]}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
    });
    it("should navigate when clicked post", () => {
        render(postList);
        const mockButton = screen.getByText("ButtonSWPP");
        fireEvent.click(mockButton);
        expect(mockNavigate).toHaveBeenCalled();
    });
});
