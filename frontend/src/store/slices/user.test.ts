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
                        fetchUserPosts,
                        BadgeType,
                        fetchUserBadges,
                        updateUserMainBadge,
                        updateUserBadges,
                        updateUserAchievements,
                        Achievement} from "./user";

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

Object.defineProperty(window, 'location', {
  configurable: true,
  value: { reload: jest.fn() },
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
  const mockBadges: BadgeType[] = [
    { id: 1, title: "badge1", image: "", description: "achievement1", is_fulfilled: true, }, 
    { id: 2, title: "badge2", image: "", description: "achievement2", is_fulfilled: false, },
    { id: 3, title: "badge3", image: "", description: "achievement3", is_fulfilled: false, }
  ]

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
      userBadges: null,
      currUser: null,
      userPosts: [],
      mainBadge: null,
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
  it("should handle faulty login 403", async ()=>{
    const err = {response: {status: 403}};
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
  it("should handle fetchUserBadges", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockBadges });
    await waitFor(() => {
      store.dispatch(fetchUserBadges(1));
      expect(store.getState().users.userBadges).toEqual(mockBadges);
    }) 
  });
  it("should update main badge", async() => {
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    store.dispatch(updateUserBadges(1));
    expect(store.getState().users.currUser).toBeTruthy();
    const mainBadgeUser = {...fakeUser, main_badge: 2};
    jest.spyOn(axios, "post").mockResolvedValue({data: {mainBadgeUser}});
    await waitFor(() => {
      store.dispatch(updateUserMainBadge({user_id: fakeUser.id, main_badge: 2}));
      //expect(store.getState().users.currUser?.main_badge).toBe(2);
    });
  });
  it("should not update faulty main badge", async() => {
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    store.dispatch(updateUserBadges(1));
    await waitFor(() => {
      store.dispatch(updateUserMainBadge({user_id: fakeUser.id, main_badge: 9}));
      expect(window.alert).toHaveBeenCalled();
    });
  });
  it("should update achievements", async() => {
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    store.dispatch(updateUserBadges(1));
    await waitFor(() => {
      store.dispatch(updateUserAchievements({id: 1, type: Achievement.CLOUDY}));
      expect(store.getState().users.userBadges).toBe([
        { id: 1, title: "badge1", image: "", description: "achievement1", is_fulfilled: true, }, 
        { id: 2, title: "badge2", image: "", description: "achievement2", is_fulfilled: false, },
        { id: 3, title: "badge3", image: "", description: "achievement3", is_fulfilled: true, }
      ]);
    });
  });
});