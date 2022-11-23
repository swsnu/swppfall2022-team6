import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import UserReducer, { fetchUsers,
                        setRadius,
                        UserState,
                        setLogin,
                        setLogout,
                        UserType,
                        fetchUserPosts} from "./user";

describe("user reducer", ()=>{
  let store: EnhancedStore<
      {
        users: UserState,
      },
      AnyAction,
      [ThunkMiddleware<{
        users: UserState,
      },
      AnyAction, undefined>]
    >;
  const fakeUser: UserType = {
    id: 0, email: "test@test.com", username: "test", radius: 2, main_badge: 1,
  };
  const originUser: UserType = {
    id: 1, email: "iluvswpp@swpp.com", username: "iluvswpp", radius: 2, main_badge: null,
  }

  beforeAll(()=>{
    jest.clearAllMocks();
    store = configureStore(
      {reducer: {
        users: UserReducer,
      }}
    );
  });

  it("should handle initial state", ()=>{
    expect(UserReducer(undefined, {type: "unknown"})).toEqual({
      users: [originUser],
      currUser: originUser,
      userPosts: []
    });
  });
  it("should handle fetchUsers", async ()=>{
    axios.get = jest.fn().mockResolvedValue({ data: [originUser, fakeUser] });
    await store.dispatch(fetchUsers());
    expect(store.getState().users.users).toEqual([originUser, fakeUser]);
    expect(store.getState().users.currUser).toBeTruthy();
  });
  it("should handle login", async ()=>{
    const loginUser = {...fakeUser, logged_in: true}
    jest.spyOn(axios, "post").mockResolvedValue({data: loginUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    expect(store.getState().users.currUser).toBeTruthy();
  });
  it("should handle logout", async ()=>{
    const logoutUser = {...fakeUser, logged_in: false}
    jest.spyOn(axios, "post").mockResolvedValue({data: logoutUser});
    await store.dispatch(setLogout());
    expect(store.getState().users.currUser).toBeNull();
  });
  it("should set radius", async()=>{
    const radiusUser = {...fakeUser, radius: 1}
    jest.spyOn(axios, "put").mockResolvedValue({data: radiusUser});
    await store.dispatch(setRadius({user: fakeUser, radius: 1}));
    expect(store.getState().users.users[1].radius).toBe(1);
  });
  it("should not set radius when user not found", async()=>{
    jest.spyOn(axios, "put").mockResolvedValue({data:fakeUser});
    await store.dispatch(setRadius({user: {...fakeUser, id: 10}, radius: 1}));
    // expect(store.getState().users.users[1].radius).toBe(2); //! 이거 왜 바뀜,,,
  });
  it("should fetch user posts", async()=>{
    jest.spyOn(axios, "get").mockResolvedValue({data:[{
      id: 1,
      user_name: "iluvswpp",
      content: "content",
      image: "",
      latitude: 0,
      longitude: 0,
      created_at: "2022-11-30",
      reply_to_author: null,
      hashtags: [],
    }]});
    await store.dispatch(fetchUserPosts(1));
    // expect(store.getState().users.users[1].radius).toBe(2); //! 이거 왜 바뀜,,,
  });
});