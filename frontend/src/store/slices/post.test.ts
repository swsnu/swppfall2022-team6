import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, {
    addPost,
    fetchChainedPost,
    fetchHashPosts,
    fetchPost,
    fetchPosts,
    PostState,
} from "./post";

const mockCheckApiResponseStatus = jest.fn();
const mockSetDefaultApiError = jest.fn();
jest.mock("./apierror", () => ({
  ApiErrorSource: {
    POST: 1,
  },
  checkApiResponseStatus: () => mockCheckApiResponseStatus,
  setDefaultApiError : () => mockSetDefaultApiError,
}))

describe("post reducer", () => {
    type NewType = EnhancedStore<
        {
            posts: PostState;
        },
        AnyAction,
        [
            ThunkMiddleware<
                {
                    posts: PostState;
                },
                AnyAction,
                undefined
            >
        ]
    >;

    let store: NewType;
    const fakePost = {
        id: 1,
        user_name: "user1",
        badge_id: 1,
        content: "CONTENT-t1",
        image: "",
        latitude: 0,
        longitude: 0,
        location: "Location",
        created_at: "2022-11-20T8:43:28UTC+9",
        reply_to_author: null,
        hashtags: [{ id: 1, content: "hashtag1" }],
    };
    beforeAll(() => {
        store = configureStore({ reducer: { posts: reducer } });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            posts: [],
        });
    });
    it("should handle addPost", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakePost });
        await store.dispatch(addPost(fakePost));
        expect(store.getState().posts.posts).toEqual([fakePost]);
        await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
    });
    it("should handle faulty addPost 401", async () => {
        const err = {response: {status: 401}};
        jest.spyOn(axios, "post").mockRejectedValueOnce(err);
        await store.dispatch(addPost(fakePost));
        expect(store.getState().posts.posts).toEqual([fakePost]);
        await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
    });
    it("should handle fetchPosts", async () => {
        axios.get = jest
            .fn()
            .mockResolvedValue({ data: { posts: [fakePost] } });
        await store.dispatch(fetchPosts({ lat: 0, lng: 0, radius: 10 }));
        expect(store.getState().posts.posts).toEqual([fakePost]);
        await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
    });
    it("should handle faulty fetchPosts 401", async () => {
        const err = {response: {status: 401}};
        jest.spyOn(axios, "get").mockRejectedValueOnce(err);
        await store.dispatch(fetchPosts({ lat: 0, lng: 0, radius: 10 }));
        await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
    });
    it("should handle fetchhashPosts", async () => {
        axios.get = jest
            .fn()
            .mockResolvedValue({ data: { posts: [fakePost] } });
        await store.dispatch(fetchHashPosts(1));
        expect(store.getState().posts.posts).toEqual([fakePost]);
        await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
    });
    it("should handle faulty fetchhashPosts", async () => {
        const err = {response: {status: 401}};
        jest.spyOn(axios, "get").mockRejectedValueOnce(err);
        await store.dispatch(fetchHashPosts(1));
        await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
    });
    it("should handle fetchPost", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakePost });
        await store.dispatch(fetchPost({ id: 1, lat: 0, lng: 0, radius: 10 }));
        expect(store.getState().posts.posts).toEqual([fakePost]);
        await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
    });
    it("should handle faulty fetchPost 401", async () => {
        const err = {response: {status: 401}};
        jest.spyOn(axios, "get").mockRejectedValueOnce(err);
        await store.dispatch(fetchPost({ id: 1, lat: 0, lng: 0, radius: 10 }));
        await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
    });
    it("should handle fetchChainedPost", async () => {
        axios.get = jest
            .fn()
            .mockResolvedValue({ data: { posts: [fakePost] } });
        await store.dispatch(fetchChainedPost(1));
        expect(store.getState().posts.posts).toEqual([fakePost]);
    });
});
