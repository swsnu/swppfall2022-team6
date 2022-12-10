import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { PostType } from "./post";

export type HashtagType = {
    id: number;
    content: string;
};

export interface HashtagState {
    hashtags: HashtagType[];
    top3: HashtagType[];
}
const initialState: HashtagState = {
    hashtags: [],
    top3: [],
};

export const hashtagSlice = createSlice({
    name: "hashtag",
    initialState,
    reducers: {
        addHashtag: (state, action: PayloadAction<HashtagType>) => {
            const newHashtag = { ...action.payload };
            state.hashtags.push(newHashtag);
        },
        addTop3Hashtags: (state, action:PayloadAction<HashtagType[]>) => {
            state.top3 = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHashtags.fulfilled, (state, action) => {
            state.hashtags = action.payload;
        });
        // builder.addCase(fetchTop3Hashtags.fulfilled, (state, action) => {
        //     state.top3 = action.payload;
        // });
        // builder.addCase(
        //     fetchHashfeedTop3Hashtags.fulfilled,
        //     (state, action) => {
        //         state.top3 = action.payload;
        //     }
        // );
        builder.addCase(addHashtag.rejected, (_state, action) => {
            console.error(action.error); // addHashtag.pending 이면 로딩 중에 다른 작업 가능
        });
    },
});

export const fetchHashtags = createAsyncThunk(
    "hashtag/fetchHashtags",
    async () => {
        const response = await axios.get<HashtagType[]>("/hashtag/");
        return response.data;
    }
);
// export const fetchTop3Hashtags = createAsyncThunk(
//     "hashtag/fetchTop3Hashtags",
//     async (data: { lat: number; lng: number; radius: number }) => {
//         const { lat, lng, radius } = data;
//         const response = await axios.get<{
//             posts: PostType[];
//             top3_hashtags: HashtagType[];
//         }>("/post/", {
//             params: { latitude: lat, longitude: lng, radius: radius },
//         });
//         return response.data["top3_hashtags"];
//     }
// );
// export const fetchHashfeedTop3Hashtags = createAsyncThunk(
//     "hashtag/fetchHashfeedTop3Hashtags",
//     async (id: number) => {
//         const response = await axios.get<{
//             posts: PostType[];
//             top3_hashtags: HashtagType[];
//         }>(`/post/${id}/hashfeed/`);
//         return response.data["top3_hashtags"];
//     }
// );
export const fetchHashtag = createAsyncThunk(
    "hashtag/fetchHashtag",
    async (id: number) => {
        const response = await axios.get<HashtagType[]>(`/hashtag/${id}/`);
        return response.data;
    }
);
export const addHashtag = createAsyncThunk(
    "hashtag/addHashtag",
    async (data: HashtagType, { dispatch }) => {
        const response = await axios.post<HashtagType>("/hashtag/", data);
        dispatch(hashtagActions.addHashtag(response.data));
        return response.data;
    }
);

export const hashtagActions = hashtagSlice.actions;
export const selectHashtag = (state: RootState) => state.hashtags;
export default hashtagSlice.reducer;
