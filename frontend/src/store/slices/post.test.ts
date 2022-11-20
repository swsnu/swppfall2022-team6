import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, {
    addPost,
    fetchChainedPost,
    fetchPost,
    fetchPosts,
    PostState,
} from "./post";

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
        content: "CONTENT-t1",
        image: "",
        latitude: 0,
        longitude: 0,
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
    });
    it("should handle fetchPosts", async () => {
        axios.get = jest
            .fn()
            .mockResolvedValue({ data: { posts: [fakePost] } });
        await store.dispatch(fetchPosts({ lat: 0, lng: 0, radius: 10 }));
        expect(store.getState().posts.posts).toEqual([fakePost]);
    });
    it("should handle fetchPost", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakePost });
        await store.dispatch(fetchPost({ id: 1, lat: 0, lng: 0, radius: 10 }));
        expect(store.getState().posts.posts).toEqual([fakePost]);
    });
    it("should handle fetchChainedPost", async () => {
        axios.get = jest
            .fn()
            .mockResolvedValue({ data: { posts: [fakePost] } });
        await store.dispatch(fetchChainedPost(1));
        expect(store.getState().posts.posts).toEqual([fakePost]);
    });
    it("should handle error on addPost", async () => {
        const mockConsoleError = jest.fn();
        console.error = mockConsoleError;
        jest.spyOn(axios, "post").mockRejectedValue({
            response: { data: { title: ["error"] } },
        });
        await store.dispatch(addPost(fakePost));
        expect(mockConsoleError).toBeCalled();
    });
});
