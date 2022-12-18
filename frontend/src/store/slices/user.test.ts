import { AnyAction, configureStore, Dictionary, EnhancedStore } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import axios from "axios";
import { ThunkMiddleware } from "redux-thunk";
import UserReducer, { fetchUsers,
                        setRadius,
                        UserState,
                        setSignUp,
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
  let store: Dictionary<UserType|BadgeType[]> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: UserType|BadgeType[]) {
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

const mockCheckApiResponseStatus = jest.fn();
const mockSetDefaultApiError = jest.fn();
jest.mock("./apierror", () => ({
  ApiErrorSource: {
    USER: 1,
  },
  checkApiResponseStatus: () => mockCheckApiResponseStatus,
  setDefaultApiError : () => mockSetDefaultApiError,
}))

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
    { id: 3, title: "badge3", image: "", description: "achievement3", is_fulfilled: false, },
    { id: 4, title: "badge4", image: "", description: "achievement4", is_fulfilled: true, },
    { id: 5, title: "badge5", image: "", description: "achievement5", is_fulfilled: false, },
    { id: 6, title: "badge6", image: "", description: "achievement6", is_fulfilled: false, }
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
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty fetchUsers 401", async ()=>{
    const err = {response: {status: 401}};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUsers());
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty fetchUsers 401 faulty err", async ()=>{
    const err = {status: 401};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUsers());
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
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
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty fetch user posts 401", async()=>{
    const err = {response: {status: 401}};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUserPosts(1));
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty fetch user posts 401 faulty err", async()=>{
    const err = {status: 401};
    jest.spyOn(axios, "get").mockRejectedValueOnce(err);
    await store.dispatch(fetchUserPosts(1));
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  });
  it("should handle signup", async ()=>{
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = {"email": fakeUser.email, "username": fakeUser.username, "password": "password", "passwordCheck": "password"};
    await store.dispatch(setSignUp(formData));
    expect(window.alert).toHaveBeenCalled();
    // await waitFor (() => expect(store.getState().users.currUser).toBeTruthy());
    // await waitFor(() => expect(store.getState().users.userBadges).toHaveLength(6));
    // await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty signup 403", async ()=>{
    const err = {response: {status: 403}};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    const formData = {"email": fakeUser.email, "username": fakeUser.username, "password": "password", "passwordCheck": "password"};
    await store.dispatch(setSignUp(formData));
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty signup 403 faulty err", async ()=>{
    const err = {status: 403};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    const formData = {"email": fakeUser.email, "username": fakeUser.username, "password": "password", "passwordCheck": "password"};
    await store.dispatch(setSignUp(formData));
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  });
  it("should handle login", async ()=>{
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    jest.spyOn(axios, "get").mockResolvedValueOnce({data: mockBadges})
    jest.spyOn(axios, "put").mockResolvedValue({});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    expect(store.getState().users.currUser).toBeTruthy();
    await waitFor(() => expect(store.getState().users.userBadges).toHaveLength(6));
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty login 403", async ()=>{
    const err = {response: {status: 403}};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty login 403 faulty err", async ()=>{
    const err = {status: 403};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  });
  it("should handle logout", async ()=>{
    jest.spyOn(axios, "post").mockResolvedValue({data: {msg: "logout complete"}});
    await store.dispatch(setLogout());
    expect(store.getState().users.currUser).toBeNull();
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty logout 401", async ()=>{
    const err = {response: {status: 401}};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    await store.dispatch(setLogout());
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  })
  it("should handle faulty logout 401 faulty err", async ()=>{
    const err = {status: 401};
    jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    await store.dispatch(setLogout());
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
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
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
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
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty set radius 401", async ()=>{
    // set curr_user to fakeuser
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    expect(store.getState().users.currUser).toBeTruthy();
    // faulty set radius
    const err = {response: {status: 401}};
    jest.spyOn(axios, "put").mockRejectedValueOnce(err);
    await store.dispatch(setRadius({user: fakeUser, radius: 1}));
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty set radius 401 faulty err", async ()=>{
    // set curr_user to fakeuser
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    expect(store.getState().users.currUser).toBeTruthy();
    // faulty set radius
    const err = {status: 401};
    jest.spyOn(axios, "put").mockRejectedValueOnce(err);
    await store.dispatch(setRadius({user: fakeUser, radius: 1}));
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  })
  it("should handle fetchUserBadges", async () => {
    axios.get = jest.fn().mockResolvedValue({ data: mockBadges });
    await waitFor(() => {
      store.dispatch(fetchUserBadges(1));
      expect(store.getState().users.userBadges).toEqual(mockBadges);
    })
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty fetchUserBadges", async () => {
    axios.get = jest.fn().mockRejectedValue({response: {status: 401}});
    await waitFor(() => {
      store.dispatch(fetchUserBadges(1));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty fetchUserBadges faulty err", async () => {
    axios.get = jest.fn().mockRejectedValue({status: 401});
    await waitFor(() => {
      store.dispatch(fetchUserBadges(1));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  });
  it("should handle updateUserBadges", async () => {
    axios.post = jest.fn().mockResolvedValue({ data: mockBadges });
    await waitFor(() => {
      store.dispatch(updateUserBadges(1));
      expect(store.getState().users.userBadges).toEqual(mockBadges);
    })
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty updateUserBadges 401", async () => {
    axios.post = jest.fn().mockRejectedValue({response: {status: 401}});
    await waitFor(() => {
      store.dispatch(updateUserBadges(1));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty updateUserBadges 401 faulty err", async () => {
    axios.post = jest.fn().mockRejectedValue({status: 401});
    await waitFor(() => {
      store.dispatch(updateUserBadges(1));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  });
  it("should handle updateUserAchievement", async () => {
    axios.put = jest.fn().mockResolvedValue({ data: {} });
    await waitFor(() => {
      store.dispatch(updateUserAchievements({id: fakeUser.id, type: 2}));
    })
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty updateUserAchievement 401", async () => {
    axios.put = jest.fn().mockRejectedValue({response: {status: 401}});
    await waitFor(() => {
      store.dispatch(updateUserAchievements({id: fakeUser.id, type: 2}));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty updateUserAchievement 401 faulty err", async () => {
    axios.put = jest.fn().mockRejectedValue({status: 401});
    await waitFor(() => {
      store.dispatch(updateUserAchievements({id: fakeUser.id, type: 2}));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
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
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should not update main badge when no currUser", async() => {
    jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
    const formData = new FormData();
    formData.append("email", fakeUser.email);
    formData.append("password", "password");
    await store.dispatch(setLogin(formData));
    store.dispatch(updateUserBadges(1));
    await waitFor(() => {
      store.dispatch(updateUserMainBadge({user_id: fakeUser.id, main_badge: 9}));
      // expect(window.alert).toHaveBeenCalled();
    });
    await waitFor(() => expect(mockSetDefaultApiError).toHaveBeenCalled());
  });
  it("should handle faulty updateMainBadge 401", async () => {
    axios.post = jest.fn().mockRejectedValue({response: {status: 401}});
    await waitFor(() => {
      store.dispatch(updateUserMainBadge({user_id: fakeUser.id, main_badge: 2}));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).toHaveBeenCalled());
  });
  it("should handle faulty updateMainBadge 401 faulty err", async () => {
    axios.post = jest.fn().mockRejectedValue({status: 401});
    await waitFor(() => {
      store.dispatch(updateUserMainBadge({user_id: fakeUser.id, main_badge: 2}));
    })
    await waitFor(() => expect(mockCheckApiResponseStatus).not.toHaveBeenCalled());
  });
  // it("should update achievements", async() => {
  //   jest.spyOn(axios, "post").mockResolvedValue({data: fakeUser});
  //   const formData = new FormData();
  //   formData.append("email", fakeUser.email);
  //   formData.append("password", "password");
  //   await store.dispatch(setLogin(formData));
  //   store.dispatch(updateUserBadges(1));
  //   await waitFor(() => {
  //     store.dispatch(updateUserAchievements({id: 1, type: Achievement.CLOUDY}));
  //     expect(store.getState().users.userBadges).toBe([
  //       { id: 1, title: "badge1", image: "", description: "achievement1", is_fulfilled: true, },
  //       { id: 2, title: "badge2", image: "", description: "achievement2", is_fulfilled: false, },
  //       { id: 3, title: "badge3", image: "", description: "achievement3", is_fulfilled: true, }
  //     ]);
  //   });
  // });
});