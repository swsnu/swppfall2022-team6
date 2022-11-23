import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { PostType } from "./post";

export interface UserType {
  id: number;
  email: string;
  username: string;
  radius: number;
  main_badge: number|null;
}
export interface UserState { users: UserType[]; currUser: UserType|null; userPosts: PostType[];}

const initialState: UserState = { users: [], currUser: { //TODO: should change to null
  id: 100,
  email: "team6@swpp.com",
  username: "team6",
  radius: 2,
  main_badge: null,
  },
  userPosts: [] };

export type LoginFormType = {
  email: string;
  password: string;
};

export const checkApiResponseStatus = (status: number) => {
  if (status === 401) {
    alert('로그인 후 2시간 이상이 경과되었습니다. 다시 로그인 해 주세요.');
    sessionStorage.clear();
    window.location.reload();
  } else if (status === 400) {
    alert('이메일이나 비밀번호가 틀립니다.');
    // window.location.reload();
  }
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
    },
    setUsers: (state, action: PayloadAction<UserType[]>) =>{
      state.users = action.payload;
    },
    setUserPosts: (state, action: PayloadAction<PostType[]>) =>{
      state.userPosts = action.payload;
    },
  },
    extraReducers: (builder) => {
      builder.addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts = action.payload;
      });
    }
  // extraReducers: (builder) => {
  //   builder.addCase(fetchUsers.fulfilled, (state, action) => {
  //     state.users = action.payload;
  //   });
  // }
})
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { dispatch }) => {
    axios
    .get("/user/")
    .then((response) => {
      dispatch(userActions.setUsers(response.data));
    }).catch((error) => {
      checkApiResponseStatus(error.response.status);
    });
  }
);
export const fetchUserPosts = createAsyncThunk(
  "user/fetchUserPosts",
  async (id: number) => {
    axios
    .get<PostType[]>(`/user/${id}/post/`)
    .then((response) => {

    })
    const response = await axios.get<PostType[]>(`/user/${id}/post/`);
    return response.data;
  }
);
export const setLogin = createAsyncThunk(
  "user/setLogin",
  async (data: FormData, { dispatch }) => {
    axios
    .post("/user/signin/", data, {headers: {
          "Content-Type": "multipart/form-data",
          }}
    ).then(async (response) => {
      dispatch(userActions.setLogin(response.data));
      sessionStorage.setItem("isLoggedIn", "true");
      console.log("yes");
    }).catch((error) => {
      console.log("error");
      checkApiResponseStatus(error.response.status);
    });
  }
);
export const setLogout = createAsyncThunk(
  "user/setLogout",
  async (_, { dispatch }) => {
    await axios
    .post('/user/signout/')
    .then(() => {
      window.sessionStorage.clear();
      dispatch(userActions.setLogout({}));
    }).catch((error) => {
      checkApiResponseStatus(error.response.status);
    });
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
