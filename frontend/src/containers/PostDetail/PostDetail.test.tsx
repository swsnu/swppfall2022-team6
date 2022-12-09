import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import PostDetail from "./PostDetail";
import { IProps as ReportProps } from "../../components/ReportModal/ReportModal";
import { PositionType } from "../../store/slices/position";
import { PostType } from "../../store/slices/post";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));
jest.mock(
    "../../components/PostList/PostList",
    () =>
        ({ postListCallback }: { postListCallback: () => void }) =>
            (
                <div>
                    <button
                        data-testid="spyPostListModal"
                        className="submitButton"
                        onClick={postListCallback}
                    ></button>
                </div>
            )
);

const mockResultData = [
    {
        address_name: "서울특별시 관악구 신림동",
    },
];
const kakao = {
    maps: {
        services: {
            Geocoder: jest.fn(),
            Status: {
                OK: "OK",
                ZERO_RESULT: "ZERO_RESULT",
                ERROR: "ERROR",
            },
        },
    },
};

describe("<PostDetail />", () => {
    let postDetailJSX = (
        <Provider store={mockStore}>
            <MemoryRouter>
                <Routes>
                    <Route path="/" element={<PostDetail />} />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
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
        global.kakao = kakao as any;
        const mockCoord2RegionCode = jest.fn((lng, lat, callback) =>
            callback(mockResultData, "OK")
        );
        (kakao.maps.services.Geocoder as jest.Mock).mockReturnValue({
            coord2RegionCode: mockCoord2RegionCode,
        });
    });
    it("should render without errors", async () => {
        const { container } = render(postDetailJSX);
        await waitFor(() => {
            expect(container).toBeTruthy();
        });
    });
    it("should handle back button", async () => {
        const view = render(postDetailJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const backButton = view.container.querySelector("#back-button");
        fireEvent.click(backButton!);
        expect(mockNavigate).toHaveBeenCalled();
    });
    it("should map hashtags", async () => {
        render(postDetailJSX);
        await waitFor(() => {
            const hashtag = screen.getByText("#HASHTAG");
            expect(hashtag).toBeInTheDocument();
        });
    });
    it("should handle localstorage position", () => {
        Storage.prototype.getItem = jest.fn(() =>
            JSON.stringify({
                position: {
                    lat: 37.44877599087201,
                    lng: 126.95264777802309,
                },
            })
        );
        render(postDetailJSX);
        expect(Storage.prototype.getItem).toHaveBeenCalled();
    });
    it("should navigate to home when nonexisting id", async () => {
        axios.get = jest.fn().mockRejectedValue({});
        render(postDetailJSX);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });
    it("should handle postListCallback", async () => {
        render(postDetailJSX);
        await waitFor(() => screen.findByText("Replies"))
        const modalButton = screen.getByTestId("spyPostListModal");
        axios.get = jest.fn().mockRejectedValue({});
        fireEvent.click(modalButton);
        await waitFor(() => expect(mockNavigate).toHaveBeenCalled());
    });
});
