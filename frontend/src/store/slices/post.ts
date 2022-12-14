import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { hashtagActions, HashtagType } from "./hashtag";
import axios from "axios";
import { checkApiResponseStatus, setDefaultApiError, ApiErrorSource } from "./apierror";

export type PostType = {
    id: number;
    user_name: string;
    badge_id: number;
    content: string;
    image: string; // image url
    latitude: number;
    longitude: number;
    location: string;
    created_at: string;
    reply_to_author: string | null; // id of the chained post
    hashtags: Array<HashtagType>;
};

export interface PostState {
    posts: PostType[];
}
const initialState: PostState = {
    posts: [],
};

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        addPost: (state, action: PayloadAction<PostType>) => {
            const newPost = { ...action.payload };
            state.posts.push(newPost);
        },
        setPosts: (state, action: PayloadAction<PostType[]>) =>{
            state.posts = action.payload;
        },
        setHashPosts: (state, action: PayloadAction<PostType[]>) =>{
            state.posts = action.payload;
        },
    },
    // extraReducers: (builder) => {
    //     builder.addCase(fetchPosts.fulfilled, (state, action) => {
    //         state.posts = action.payload;
    //     });
    //     builder.addCase(fetchHashPosts.fulfilled, (state, action) => {
    //         state.posts = action.payload;
    //     });
    //     builder.addCase(addPost.rejected, (_state, action) => {
    //         console.error(action.error); // addPost.pending 이면 로딩 중에 다른 작업 가능
    //     });
    // },
});

export const fetchPosts = createAsyncThunk(
    "post/fetchPosts",
    async (data: { lat: number; lng: number; radius: number }, {dispatch, rejectWithValue}) => {
        const { lat, lng, radius } = data;
        await axios
        .get<{
            posts: PostType[];
            top3_hashtags: HashtagType[];
        }>("/post/", {
            params: { latitude: lat, longitude: lng, radius: radius },
        })
        .then(async (response) => {
            dispatch(postSlice.actions.setPosts(response.data['posts']));
            dispatch(hashtagActions.addTop3Hashtags(response.data["top3_hashtags"]));
            await dispatch(setDefaultApiError());
            return response.data['posts'];
        }).catch(async(error) => {
            await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.POST}));
            return rejectWithValue(error.response);
        });
        // const response = await axios.get<{
        //     posts: PostType[];
        //     top3_hashtags: HashtagType[];
        // }>("/post/", {
        //     params: { latitude: lat, longitude: lng, radius: radius },
        // });
        // dispatch(hashtagActions.addTop3Hashtags(response.data["top3_hashtags"]))
        // return response.data["posts"];
    }
);
export const fetchHashPosts = createAsyncThunk(
    "post/fetchHashPosts",
    async (id: number, {dispatch}) => {
        // const response = await axios.get<{
        //     posts: PostType[];
        //     top3_hashtags: HashtagType[];
        // }>(`/post/${id}/hashfeed/`);
        // dispatch(hashtagActions.addTop3Hashtags(response.data["top3_hashtags"]))
        // return response.data["posts"];
        await axios.get<{
            posts: PostType[];
            top3_hashtags: HashtagType[];
        }>(`/post/${id}/hashfeed/`)
        .then(async (response) => {
            dispatch(postSlice.actions.setHashPosts(response.data.posts));
            dispatch(hashtagActions.addTop3Hashtags(response.data["top3_hashtags"]));
            await dispatch(setDefaultApiError());
            return response.data['posts'];
        }).catch(async(error) => {
            await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.POST}));
        });
    }
);
export const fetchPost = createAsyncThunk(
    "post/fetchPost",
    async (data: { id: number; lat: number; lng: number; radius: number }, { dispatch }) => {
        const { id, lat, lng, radius } = data;
        await axios
        .get<PostType[]>(`/post/${id}/`, {
            params: { latitude: lat, longitude: lng, radius: radius },
        })
        .then(async (response) => {
            await dispatch(setDefaultApiError());
            return response.data;
        }).catch(async(error) => {
            await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.POST}));
        });
        // const response = await axios.get<PostType[]>(`/post/${id}/`, {
        //     params: { latitude: lat, longitude: lng, radius: radius },
        // });
        // return response.data;
    }
);
export const fetchChainedPost = createAsyncThunk(
    "post/fetchChainedPost",
    async (id: number, { dispatch }) => {
        // await axios
        // .get<PostType[]>(`/post/${id}/chain/`)
        // .then(async (response) => {
        //     await dispatch(setDefaultApiError());
        //     return response.data;
        // }).catch(async(error) => {
        //     await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.POST}));
        // });
        const response = await axios.get<PostType[]>(`/post/${id}/chain/`);
        return response.data;
    }
);
export const addPost = createAsyncThunk(
    "post/addPost",
    async (data: PostType, { dispatch }) => {
        await axios
        .post("/post/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(async (response) => {
            dispatch(postActions.addPost(response.data));
            await dispatch(setDefaultApiError());
            return response.data;
        }).catch(async(error) => {
            await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.POST}));
        });
        // const response = await axios.post("/post/", data, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        // });
        // dispatch(postActions.addPost(response.data));// update Attendance Achievement(login)
        // return response.data;
    }
);

export const postActions = postSlice.actions;
export const selectPost = (state: RootState) => state.posts;
export default postSlice.reducer;
