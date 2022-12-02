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

interface BadgeType {
  id: number;
  title: string;
  image: string;
  description: string;
  is_fulfilled: boolean;
}
export interface UserState { users: UserType[]; currUser: UserType|null; userPosts: PostType[]; userBadges: BadgeType[]}

const initialState: UserState = { users: [], currUser: null,
  userPosts: [], userBadges: [] };

export type LoginFormType = {
  email: string;
  password: string;
};

export const checkApiResponseStatus = (status: number) => {
  if (status === 401) {
    alert('로그인 후 2시간 이상이 경과되었습니다. 다시 로그인 해 주세요.');
    sessionStorage.clear();
    window.location.reload();
  } else if (status === 403) {
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
    setUserBadges: (state, action: PayloadAction<BadgeType[]>) =>{
      state.userBadges = action.payload;
    },
  },
    // extraReducers: (builder) => {
    //   builder.addCase(fetchUserPosts.fulfilled, (state, action) => {
    //     state.userPosts = action.payload;
    //   });
    // }
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
  async (id: number, {dispatch}) => {
    axios
    .get<PostType[]>(`/user/${id}/post/`)
    .then((response) => {
      dispatch(userActions.setUserPosts(response.data));
    }).catch((error) => {
      checkApiResponseStatus(error.response.status);
    });
    // const response = await axios.get<PostType[]>(`/user/${id}/post/`);
    // return response.data;
  }
);
export const fetchUserBadges = createAsyncThunk(
  "user/fetchUserBadges",
  async (id: number, {dispatch}) => {
    axios
    .get<BadgeType[]>(`/user/${id}/badges/`)
    .then((response) => {
      dispatch(userActions.setUserBadges(response.data));
    }).catch((error) => {
      checkApiResponseStatus(error.response.status);
    });
  }
);
export const updateUserBadges = createAsyncThunk(
  "user/updateUserBadges",
  async (id: number, {dispatch}) => {
    axios
    .post<BadgeType[]>(`/user/${id}/badges/`)
    .then((response) => {
      dispatch(userActions.setUserBadges(response.data));
    }).catch((error) => {
      checkApiResponseStatus(error.response.status);
    });
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
      dispatch(fetchUserBadges(response.data.id));
      sessionStorage.setItem("isLoggedIn", "true");
      return response.data
    }).catch((error) => {
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
      dispatch(userActions.setLogout({}));
      window.sessionStorage.clear();
    }).catch((error) => {
      checkApiResponseStatus(error.response.status);
    });
  }
);
export const setRadius = createAsyncThunk(
  "user/setRadius",
  async (data: {user: UserType, radius: number}, { dispatch }) => {
    const {user, radius} = data;
    await axios.put(`/user/${user.id}/radius/`, {radius: radius})
    dispatch(userActions.setRadius(radius));
  }
);


export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default userSlice.reducer;
