import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, {
    addHashtag,
    //fetchHashfeedTop3Hashtags,
    fetchHashtag,
    fetchHashtags,
    hashtagSlice,
    //fetchTop3Hashtags,
    HashtagState,
} from "./hashtag";

const mockCheckApiResponseStatus = jest.fn();
const mockSetDefaultApiError = jest.fn();
jest.mock("./apierror", () => ({
  ApiErrorSource: {
    HASHTAG: 1,
  },
  checkApiResponseStatus: () => mockCheckApiResponseStatus,
  setDefaultApiError : () => mockSetDefaultApiError,
}))

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
        await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
    });
    it("should handle faulty addhashtag", async () => {
        const err = {response: {status: 401}};
        jest.spyOn(axios, "post").mockRejectedValueOnce(err);
        await store.dispatch(addHashtag(fakeHashtag));
        await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
    });
    it("should handle fetchHashtags", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeHashtag] });
        await store.dispatch(fetchHashtags());
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    // it("should handle fetchTop3Hashtags", async () => {
    //     axios.get = jest.fn().mockResolvedValue({ data: [fakeHashtag] });
    //     await store.dispatch(fetchTop3Hashtags({ lat: 0, lng: 0, radius: 10 }));
    //     expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    // });
    // it("should handle fetchHashfeedTop3Hashtags", async () => {
    //     axios.get = jest.fn().mockResolvedValue({ data: [fakeHashtag] });
    //     await store.dispatch(fetchHashfeedTop3Hashtags(1));
    //     expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    // });
    it("should handle fetchHashtag", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: fakeHashtag });
        await store.dispatch(fetchHashtag(1));
        expect(store.getState().hashtags.hashtags).toEqual([fakeHashtag]);
    });
    it("should handle faulty fetchHashtag", async () => {
        const err = {response: {status: 401}};
        jest.spyOn(axios, "get").mockRejectedValueOnce(err);
        await store.dispatch(fetchHashtag(1));
        await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
    });
    it("should handle addTop3Hashtag", async () => {
        axios.post = jest.fn().mockResolvedValue({ data: fakeHashtag });
        await store.dispatch(hashtagSlice.actions.addTop3Hashtags([fakeHashtag]));
        expect(store.getState().hashtags.top3).toEqual([fakeHashtag]);
    });
});
