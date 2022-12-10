import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, {
    addHashtag,
    fetchHashfeedTop3Hashtags,
    fetchHashtag,
    fetchHashtags,
    fetchTop3Hashtags,
    HashtagState,
} from "./hashtag";

describe("report reducer", () => {
    type NewType = EnhancedStore<
        {
            hashtags: HashtagState;
        },
        AnyAction,
        [
            ThunkMiddleware<
                {
                    hashtags: HashtagState;
                },
                AnyAction,
                undefined
            >
        ]
    >;

    let store: NewType;
    const fakeHashtag = { id: 1, content: "hashtag1" };
    beforeAll(() => {
        store = configureStore({ reducer: { hashtags: reducer } });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            hashtags: [],
            top3: [],
        });
    });
    it("should handle addhashtag", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakeHashtag });
        await store.dispatch(addHashtag(fakeHashtag));
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    it("should handle fetchHashtags", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeHashtag] });
        await store.dispatch(fetchHashtags());
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    it("should handle fetchTop3Hashtags", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeHashtag] });
        await store.dispatch(fetchTop3Hashtags({ lat: 0, lng: 0, radius: 10 }));
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    it("should handle fetchHashfeedTop3Hashtags", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeHashtag] });
        await store.dispatch(fetchHashfeedTop3Hashtags(1));
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    it("should handle fetchHashtag", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeHashtag });
        await store.dispatch(fetchHashtag(1));
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    it("should handle error on addhashtag", async () => {
        const mockConsoleError = jest.fn();
        console.error = mockConsoleError;
        jest.spyOn(axios, "post").mockRejectedValue({
            response: { data: { title: ["error"] } },
        });
        await store.dispatch(addHashtag(fakeHashtag));
        expect(mockConsoleError).toBeCalled();
    });
});
