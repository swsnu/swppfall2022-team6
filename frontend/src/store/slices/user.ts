import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import axios from "axios";
import { PostType } from "./post";
import { SignUpFormType } from "../../containers/SignUp/SignUp";
import { checkApiResponseStatus, setDefaultApiError, ApiErrorSource } from "./apierror";

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
            .then(async(response) => {
                dispatch(userActions.setUsers(response.data));
                await dispatch(setDefaultApiError());
            })
            .catch(async(error) => {
              if(error.response){
                await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
              }
            });
    }
);
export const fetchUserPosts = createAsyncThunk(
    "user/fetchUserPosts",
    async (id: number, { dispatch }) => {
        axios
            .get<PostType[]>(`/user/${id}/post/`)
            .then(async(response) => {
                dispatch(userActions.setUserPosts(response.data));
                await dispatch(setDefaultApiError());
            })
            .catch(async(error) => {
              if(error.response){
                await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
              }
            });
        // const response = await axios.get<PostType[]>(`/user/${id}/post/`);
        // return response.data;
    }
);
export const updateUserMainBadge = createAsyncThunk(
  "user/updateUserMainBadge",
  async (data: {user_id: number, main_badge: number}, { dispatch }) => {
    await axios
      .post(`/user/${data.user_id}/mainbadge/`, data)
      .then(async(response) => {
        dispatch(userActions.setUserMainBadge(response.data));
        sessionStorage.setItem("user", JSON.stringify(response.data));
        await dispatch(setDefaultApiError());
      }).catch(async(error) => {
        if(error.response){
          await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
        }
      });
    }
);

export const fetchUserBadges = createAsyncThunk(
  "user/fetchUserBadges",
  async (id: number, {dispatch}) => {
    axios
    .get<BadgeType[]>(`/user/${id}/badges/`)
    .then(async(response) => {
      dispatch(userActions.setUserBadges(response.data));
      sessionStorage.setItem("userbadges", JSON.stringify(response.data));
      // update Attendance Achievement(login)
      const achievement_type: Achievement = Achievement.ATTENDANCE;
      if (!response.data[achievement_type-1].is_fulfilled){
        dispatch(updateUserAchievements({id: id, type: achievement_type}));
      }
      await dispatch(setDefaultApiError());
    }).catch(async(error) => {
      if(error.response){
        await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
      }
    });
  }
);
export const updateUserBadges = createAsyncThunk(
  "user/updateUserBadges",
  async (id: number, {dispatch}) => {
    await axios
    .post<BadgeType[]>(`/user/${id}/badges/`)
    .then(async(response) => {
      dispatch(userActions.setUserBadges(response.data));
      sessionStorage.setItem("userbadges", JSON.stringify(response.data));
      await dispatch(setDefaultApiError());
    }).catch(async(error) => {
      if(error.response){
        await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
      }
    });
  }
);
export const updateUserAchievements = createAsyncThunk(
  "user/updateUserAchievements",
  async (data: {id: number, type: Achievement}, {dispatch}) => {
    await axios
    .put<BadgeType[]>(`/user/${data.id}/achievement/`, {badge_id: data.type})
    .then(async() => {
      await dispatch(setDefaultApiError());
    })
    .catch(async(error) => {
      if(error.response){
        await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
      }
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
      await dispatch(setDefaultApiError());
      return response.data
    }).catch(async(error) => {
      if(error.response){
        await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.SIGNIN}));
      }
    });
  }
);
export const setSignUp = createAsyncThunk(
  "user/setSignUp",
  async (data: SignUpFormType, { dispatch }) => {
    axios
    .post("/user/signup/", data)
    .then(async (response) => {
      const formData = new FormData();
      formData.append("email", data.email ?? "");
      formData.append("password", data.password ?? "");
      alert("회원가입을 축하드립니다");
      await dispatch(setLogin(formData));
      return response.data
    }).catch(async(error) => {
      if(error.response){
        console.log(error.response);
        await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.SIGNUP}));
      }
    });
  }
);
export const setLogout = createAsyncThunk(
    "user/setLogout",
    async (_, { dispatch }) => {
        await axios
            .post("/user/signout/")
            .then(async() => {
                dispatch(userActions.setLogout({}));
                window.sessionStorage.clear();
                await dispatch(setDefaultApiError());
            })
            .catch(async(error) => {
              if(error.response){
                await dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
              }
            });
    }
);
export const setRadius = createAsyncThunk(
    "user/setRadius",
    async (data: { user: UserType; radius: number }, { dispatch }) => {
        const { user, radius } = data;
        await axios
          .put(`/user/${user.id}/radius/`, { radius: radius })
          .then(async() => {
            dispatch(userActions.setRadius(radius));
            await dispatch(setDefaultApiError());
          })
          .catch((error) => {
            if(error.response){
              dispatch(checkApiResponseStatus({status: error.response.status, source: ApiErrorSource.USER}));
            }
          });
    }
);

export const userActions = userSlice.actions;
export const selectUser = (state: RootState) => state.users;
export default userSlice.reducer;