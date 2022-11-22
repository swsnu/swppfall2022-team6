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
    main_badge: number | null;
}
export interface UserState { users: UserType[]; currUser: UserType|null; }
const initialState: UserState = { 
  users: [{
    id: 100,
    email: "iluvswpp@swpp.com",
    password: "iluvswpp",
    username: "iluvswpp",
    logged_in: true,
    radius: 2,
    main_badge: null,
  }], 
  currUser: { //TODO: should change to null
    id: 100,
    email: "iluvswpp@swpp.com",
    password: "iluvswpp",
    username: "iluvswpp",
    logged_in: true,
    radius: 2,
    main_badge: null,
} }; 

//@ts-ignore
const userSlice = createSlice({
    //! userSlice type?
    name: "user",
    initialState,
    reducers: {
        setLogin: (state, action: PayloadAction<UserType>) => {
            state.currUser = action.payload;
        },
        setLogout: (state, _action) => {
            state.currUser = null;
        },
        setRadius: (
            state,
            action: PayloadAction<{ user: UserType; radius: number }>
        ) => {
            const targetUser = state.users.find(
                (user) => user.id === action.payload.user.id
            );
            //console.log("user at reducer")
            //console.log(action.payload.user)
            if (targetUser) {
                //console.log('Target exists')
                targetUser.radius = action.payload.radius;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload;
        });
    },
});
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
    const response = await axios.get<UserType[]>("/user/");
    return response.data;
});
export const setLogin = createAsyncThunk(
    "user/setLogin",
    async (user: UserType, { dispatch }) => {
        const response = await axios.post("/user/signin/", { id: user.id });
        dispatch(userActions.setLogin(response.data));
    }
);
export const setLogout = createAsyncThunk(
    "user/setLogout",
    async (user: UserType, { dispatch }) => {
        await axios.post("/user/signout/", { id: user.id });
        dispatch(userActions.setLogout({}));
    }
);
export const setRadius = createAsyncThunk(
    "user/setRadius",
    async (data: { user: UserType; radius: number }, { dispatch }) => {
        const { user, radius } = data;
        await axios.put(`/user/${user.id}/`, { radius: radius });
        dispatch(userActions.setRadius({ user, radius }));
    }
);

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default userSlice.reducer;
