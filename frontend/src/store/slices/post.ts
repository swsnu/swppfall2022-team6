import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { HashtagType } from "./hashtag";
import axios from 'axios';

export type PostType = {
  id: number;
  user_name: string;
  content: string;
  image: string; // image url
  latitude: number;
  longitude: number;
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
      const newPost = {...action.payload};
      state.posts.push(newPost);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(addPost.rejected, (_state, action) =>{
      console.error(action.error); // addPost.pending 이면 로딩 중에 다른 작업 가능
    });
  }
});

export const fetchPosts = createAsyncThunk(
  "post/fetchPosts", 
  async (data: {lat:number, lng:number, radius:number}) => {
    const {lat, lng, radius} = data;
    const response = await axios.get<{posts: PostType[], top3_hashtags: HashtagType[]}>("/post/", {
      params: { latitude: lat, longitude: lng, radius: radius }
    });
    return response.data["posts"];
  }
);
export const fetchPost = createAsyncThunk(
  "post/fetchPost", 
  async (data: {id:number, lat:number, lng:number, radius:number}) => {
    const {id, lat, lng, radius} = data;
    const response = await axios.get<PostType[]>(`/post/${id}/`, {
      params: { latitude: lat, longitude: lng, radius: radius }
    });
    return response.data;
  }
);
export const fetchChainedPost = createAsyncThunk(
  "post/fetchChainedPost", 
  async (id:number) => {
    const response = await axios.get<PostType[]>(`/post/${id}/chain/`);
    return response.data;
  }
);
export const addPost = createAsyncThunk(
  "post/addPost",
  async(data:PostType, {dispatch}) => {
    const response = await axios.post("/post/", data,  {
      headers: {
          "Content-Type": "multipart/form-data",
      }
    });
    dispatch(postActions.addPost(response.data))
    return response.data;
  }
);

export const postActions = postSlice.actions;
export const selectPost = (state: RootState) => state.posts;
export default postSlice.reducer;