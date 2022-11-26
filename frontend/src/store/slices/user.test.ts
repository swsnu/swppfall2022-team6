import { AnyAction, configureStore, Dictionary, EnhancedStore } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import UserReducer, { fetchUsers,
                        setRadius,
                        UserState,
                        setLogin,
                        setLogout,
                        UserType,
                        fetchUserPosts} from "./user";

const localStorageMock = (() => {
  let store: Dictionary<string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock
});

window.alert = jest.fn();

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
      users: [],
      currUser: null,
      userPosts: []
    });
  });
  it("should handle fetchUsers", async ()=>{
    axios.get = jest.fn().mockResolvedValue({ data: [originUser, fakeUser] });
    await store.dispatch(fetchUsers());
    expect(store.getState().users.users).toEqual([originUser, fakeUser]);
  });
  it("should handle faulty fetchUsers 401", async ()=>{
    const err = {response: {status: 401}};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUsers());
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
  it("should fetch user posts", async()=>{
    const userposts = [{
      id: 1,
      user_name: "iluvswpp",
      content: "content",
      image: "",
      latitude: 0,
      longitude: 0,
      created_at: "2022-11-30",
      reply_to_author: null,
      hashtags: [],
    }]
    jest.spyOn(axios, "get").mockResolvedValue({data: userposts});
    await store.dispatch(fetchUserPosts(1));
    expect(store.getState().users.userPosts).toEqual(userposts);
  });
  it("should handle faulty fetch user posts 401", async()=>{
    const err = {response: {status: 401}};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUserPosts(1));
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
  it("should handle faulty fetch user posts 500", async()=>{
    const err = {response: {status: 500}};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUserPosts(1));
  });
  it("should handle login", async ()=>{
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    expect(store.getState().users.currUser).toBeTruthy();
  });
  it("should handle faulty login 400", async ()=>{
    const err = {response: {status: 400}};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  });
  it("should handle logout", async ()=>{
    jest.spyOn(axios, "post").mockResolvedValue({data: {msg: "logout complete"}});
    await store.dispatch(setLogout());
    expect(store.getState().users.currUser).toBeNull();
  });
  it("should handle faulty logout 401", async ()=>{
    const err = {response: {status: 401}};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    await store.dispatch(setLogout());
    await waitFor(() => expect(window.alert).toHaveBeenCalled());
  })
  it("should set radius", async()=>{
    // set curr_user to fakeuser
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    expect(store.getState().users.currUser).toBeTruthy();
    // change curr_user radius
    const radiusUser = {...fakeUser, radius: 1};
    jest.spyOn(axios, "put").mockResolvedValue({data: {radiusUser}});
    await store.dispatch(setRadius({user: fakeUser, radius: 1}));
    expect(store.getState().users.currUser?.radius).toBe(1)
  });
  it("should not set radius when not current user", async()=>{
    // set curr_user to null
    jest.spyOn(axios, "post").mockResolvedValue({data: {msg: "logout complete"}});
    await store.dispatch(setLogout());
    expect(store.getState().users.currUser).toBeNull();
    // set radius
    const radiusUser = {...fakeUser, radius: 1};
    jest.spyOn(axios, "put").mockResolvedValue({data: {radiusUser}});
    await store.dispatch(setRadius({user: fakeUser, radius: 1}));
  });
});