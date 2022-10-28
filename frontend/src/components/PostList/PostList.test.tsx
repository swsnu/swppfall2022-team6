import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import PostList from "./PostList";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => mockNavigate,
}));

describe("<PostList />", () => {
    let postList: JSX.Element;
    beforeEach(() => {
      jest.clearAllMocks();
      postList = (
        <MemoryRouter>
            <Routes>
                <Route path="/" element={<PostList />} />
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
        const first_post = screen.getByText("WeatherFairy");
        const second_post = screen.getByText("Toothfairy");
        expect(first_post).toBeInTheDocument();
        expect(second_post).toBeInTheDocument();
    });
    it("should render Add Post button", () => {
        render(postList);
        const addPostButton = screen.getByText("Add Post");
        expect(addPostButton).toBeInTheDocument();
    });
    it("should navigate to post detail page when post is clicked", () => {
        render(postList);
        const first_post = screen.getByText("WeatherFairy");
        const second_post = screen.getByText("Toothfairy");
        fireEvent.click(first_post!);
        fireEvent.click(second_post!);
        expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
});