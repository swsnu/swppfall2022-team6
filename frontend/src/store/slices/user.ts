import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";

export interface UserType { 
  id: number; 
  email: string;
  password: string;
  username: string;
  logged_in: boolean;
  radius: number;
  main_badge: number|null;
}
export interface UserState { users: UserType[]; currUser: UserType|null; }
const initialState: UserState = { users: [], currUser: null }; 

export type LoginFormType = {
  username: UserType["username"];
  password: UserType["password"];
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<{user: UserType}>) => {
      state.currUser = action.payload.user;
    },
    setLogout: (state, _action) => {
      state.currUser = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
  }
})
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers", 
  async () => {
    const response = await axios.get<UserType[]>("/user/");
    return response.data;
  }
);
export const setLogin = createAsyncThunk(
  "user/setLogin",
  async (user: UserType, { dispatch }) => {
    const response = await axios.put(`/user/${user.id}`, {...user, logged_in:true});
    dispatch(userActions.setLogin({user: response.data}))
  }
);
export const setLogout = createAsyncThunk(
  "user/setLogout",
  async (user: UserType, { dispatch }) => {
    const response = await axios.put(`/user/${user.id}`, {...user, logged_in:false});
    dispatch(userActions.setLogout({user: response.data}));
  }
);

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default userSlice.reducer;