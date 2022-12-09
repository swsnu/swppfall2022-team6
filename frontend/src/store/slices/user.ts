import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { PostType } from "./post";

export interface UserType {
    id: number;
    email: string;
    username: string;
    radius: number;
    main_badge: number | null;
}
export interface UserState {
    users: UserType[];
    currUser: UserType | null;
    userPosts: PostType[];
}

export interface BadgeType {
  id: number;
  title: string;
  image: string;
  description: string;
  is_fulfilled: boolean;
}

export enum Achievement {
  FIRST_REPORT = 2,
  CLOUDY,
  EARLY,
  REPLY,
  ATTENDANCE,
}
export interface UserState { users: UserType[]; currUser: UserType|null; userPosts: PostType[]; userBadges: BadgeType[]; mainBadge: BadgeType|null}


const initialUser = sessionStorage.getItem("user");
const initialUserBadges = sessionStorage.getItem("userbadges");

const initialState: UserState = {
    users: [],
    currUser: initialUser ? JSON.parse(initialUser) : null,
    userPosts: [],
    userBadges: initialUserBadges ? JSON.parse(initialUserBadges) : null,
    mainBadge: initialUser && initialUserBadges
      ?  JSON.parse(initialUserBadges)
          .find((badge: BadgeType) => badge.id === JSON.parse(initialUser).main_badge)
      : null
};

export type LoginFormType = {
    email: string;
    password: string;
};

export const checkApiResponseStatus = (status: number) => {
    if (status === 401) {
        alert("로그인 후 2시간 이상이 경과되었습니다. 다시 로그인 해 주세요.");
        sessionStorage.clear();
        window.location.reload();
    } else if (status === 403) {
        alert("이메일이나 비밀번호가 틀립니다.");
        // window.location.reload();
    }
};

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
          state.mainBadge = state.userBadges.find(badge => badge.id === state.currUser?.main_badge) ?? null;
        },
        setUserMainBadge: (state, action: PayloadAction<UserType>) =>{
          const new_main_badge = state.userBadges.find(badge => badge.id === action.payload.main_badge)
          if (new_main_badge && state.currUser) {
            state.mainBadge = new_main_badge
            state.currUser.main_badge = new_main_badge.id
          }
        }
      },
});

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (_, { dispatch }) => {
        axios
            .get("/user/")
            .then((response) => {
                dispatch(userActions.setUsers(response.data));
            })
            .catch((error) => {
                checkApiResponseStatus(error.response.status);
            });
    }
);
export const fetchUserPosts = createAsyncThunk(
    "user/fetchUserPosts",
    async (id: number, { dispatch }) => {
        axios
            .get<PostType[]>(`/user/${id}/post/`)
            .then((response) => {
                dispatch(userActions.setUserPosts(response.data));
            })
            .catch((error) => {
                checkApiResponseStatus(error.response.status);
            });
        // const response = await axios.get<PostType[]>(`/user/${id}/post/`);
        // return response.data;
    }
);
export const updateUserMainBadge = createAsyncThunk(
  "user/updateUserMainBadge",
  async (data: {user_id: number, main_badge: number}, { dispatch }) => {
    axios
      .post(`/user/${data.user_id}/mainbadge/`, data)
      .then((response) => {
        dispatch(userActions.setUserMainBadge(response.data));
        sessionStorage.setItem("user", JSON.stringify(response.data));
      }).catch((error) => {
        checkApiResponseStatus(error.response.status);
      });
  }
);
export const fetchUserBadges = createAsyncThunk(
  "user/fetchUserBadges",
  async (id: number, {dispatch}) => {
    axios
    .get<BadgeType[]>(`/user/${id}/badges/`)
    .then((response) => {
      dispatch(userActions.setUserBadges(response.data));
      sessionStorage.setItem("userbadges", JSON.stringify(response.data));
      // update Attendance Achievement(login)
      const achievement_type: Achievement = Achievement.ATTENDANCE;
      if (!response.data[achievement_type-1].is_fulfilled){
        dispatch(updateUserAchievements({id: id, type: achievement_type}));
      }
    }).catch((error) => {
      checkApiResponseStatus(error.status);
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
      sessionStorage.setItem("userbadges", JSON.stringify(response.data));
    }).catch((error) => {
      checkApiResponseStatus(error.status);
    });
  }
);
export const updateUserAchievements = createAsyncThunk(
  "user/updateUserAchievements",
  async (data: {id: number, type: Achievement}) => {
    axios
    .put<BadgeType[]>(`/user/${data.id}/achievement/`, {badge_id: data.type})
    .catch((error) => {
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
      // set Current User
      await dispatch(userActions.setLogin(response.data));
      // set Current Userbadges & update Achievement
      dispatch(fetchUserBadges(response.data.id));
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("user", JSON.stringify(response.data));
      return response.data
    }).catch((error) => {
      console.log(error);
      checkApiResponseStatus(error.status);
    });
  }
);
export const setLogout = createAsyncThunk(
    "user/setLogout",
    async (_, { dispatch }) => {
        await axios
            .post("/user/signout/")
            .then(() => {
                dispatch(userActions.setLogout({}));
                window.sessionStorage.clear();
            })
            .catch((error) => {
                checkApiResponseStatus(error.status);
            });
    }
);
export const setRadius = createAsyncThunk(
    "user/setRadius",
    async (data: { user: UserType; radius: number }, { dispatch }) => {
        const { user, radius } = data;
        await axios.put(`/user/${user.id}/radius/`, { radius: radius });
        dispatch(userActions.setRadius(radius));
    }
);

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default userSlice.reducer;