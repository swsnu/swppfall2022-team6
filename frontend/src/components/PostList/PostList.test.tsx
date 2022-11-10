import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { postProps } from "../Post/Post";
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
                                allPosts={[]}
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
    // it("should navigate to post detail page when post is clicked", () => {
    //     render(postList);
    //     const first_post = screen.getByText("SWPP");
    //     const second_post = screen.getByText("SWPP2");
    //     fireEvent.click(first_post!);
    //     fireEvent.click(second_post!);
    //     expect(mockNavigate).toHaveBeenCalledTimes(2);
    // });
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
