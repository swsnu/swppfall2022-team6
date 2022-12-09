import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../store";
import { PostType } from "../../store/slices/post";
import { mockStore, mockStore2 } from "../../test-utils/mock";
import MyPage from "./MyPage";

const myPageJSX = (
    <Provider store={mockStore}>
        <MyPage />
    </Provider>
);
const myPageJSX2 = (
    <Provider store={mockStore2}>
        <MyPage />
    </Provider>
);
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
                    {allPosts.map((p, i) => (
                        <div key={i}>{p.content}</div>
                    ))}
                    <button onClick={postListCallback}>Callback</button>
                </div>
            )
);

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
    Navigate: (props: any) => {
      mockNavigate(props.to);
      return null;
    },
}));
const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

describe("<MyPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render withour errors", async () => {
        const view = render(myPageJSX);
        expect(view).toBeTruthy();
        await screen.findByText("user1");
        expect(mockDispatch).toHaveBeenCalled();
    });
    it("should navigate to signin when currUser null", ()=>{
        render(myPageJSX2);
        expect(mockNavigate).toHaveBeenCalled();
    });
    it("should handle back button", ()=>{
        render(myPageJSX);
        const backButton = screen.getByLabelText("back-button");
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should handle See Badges button", ()=>{
        render(myPageJSX);
        const badgeButton = screen.getByText("See Badges");
        fireEvent.click(badgeButton!);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should handle Log Out button", async ()=>{
        render(myPageJSX);
        const logoutButton = screen.getByText("Log Out");
        fireEvent.click(logoutButton!);
        expect(mockDispatch).toHaveBeenCalledTimes(4);
    });
    it("should handle Only Photos button", async () => {
        render(myPageJSX);
        const photosBtn = screen.getByRole("checkbox");
        await screen.findByText("CONTENT-t1");
        fireEvent.click(photosBtn);
        await waitFor(() =>
            expect(screen.queryByText("CONTENT-t1")).not.toBeInTheDocument()
        );
        fireEvent.click(photosBtn);
        await screen.findByText("CONTENT-t1");
        const cbBtn = screen.getByText("Callback");
        fireEvent.click(cbBtn);
    });

});
