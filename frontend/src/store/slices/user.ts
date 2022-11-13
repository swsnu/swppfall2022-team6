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
const initialState: UserState = { users: [], currUser: { //TODO: should change to null
  id: 100,
  email: "team6@swpp.com",
  password: "team6",
  username: "team6",
  logged_in: true,
  radius: 2,
  main_badge: null,
} }; 

export type LoginFormType = {
  username: UserType["username"];
  password: UserType["password"];
};

//@ts-ignore
const userSlice = createSlice({ //! userSlice type?
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<UserType>) => {
      state.currUser = action.payload;
    },
    setLogout: (state, _action) => {
      state.currUser = null;
    },
    setRadius: (state, action: PayloadAction<number>) =>{
      if(state.currUser)
        state.currUser.radius = action.payload;
    }
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
    const response = await axios.put(`/user/${user.id}/`, {...user, logged_in:true});
    dispatch(userActions.setLogin(response.data))
  }
);
export const setLogout = createAsyncThunk(
  "user/setLogout",
  async (user: UserType, { dispatch }) => {
    const response = await axios.put(`/user/${user.id}/`, {...user, logged_in:false});
    dispatch(userActions.setLogout({}));
  }
);
export const setRadius = createAsyncThunk(
  "user/setRadius",
  async (data: {user: UserType, radius: number}, { dispatch }) => {
    const {user, radius} = data;
    await axios.put(`/user/${user.id}/`, {...user, radius: radius})
    dispatch(userActions.setRadius(radius));
  }
);


export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default userSlice.reducer;