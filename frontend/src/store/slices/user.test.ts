import { AnyAction, configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, {
    fetchUsers,
    setLogin,
    setLogout,
    setRadius,
    UserState,
    UserType,
} from "./user";

describe("user reducer", () => {
    type NewType = EnhancedStore<
        {
            users: UserState;
        },
        AnyAction,
        [
            ThunkMiddleware<
                {
                    users: UserState;
                },
                AnyAction,
                undefined
            >
        ]
    >;

    let store: NewType;
    const fakeUser = {
        users: [
            {
                id: 1,
                password: "admin",
                username: "user1",
                email: "",
                logged_in: true,
                radius: 0.0,
                main_badge: 1,
            },
        ],
        currUser: {
            id: 1,
            password: "admin",
            username: "user1",
            email: "",
            logged_in: true,
            radius: 0.0,
            main_badge: 1,
        },
    };
    const fakeSingleUser = {
        id: 1,
        password: "admin",
        username: "user1",
        email: "",
        logged_in: true,
        radius: 0.0,
        main_badge: 1,
    };
    beforeAll(() => {
        store = configureStore({ reducer: { users: reducer } });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            users: [],
            currUser: {
                id: 100,
                email: "team6@swpp.com",
                password: "team6",
                username: "team6",
                logged_in: true,
                radius: 2,
                main_badge: null,
            },
        });
    });
    it("should handle fetchUsers", async () => {
        axios.get = jest.fn().mockResolvedValue({ data: [fakeUser] });
        await store.dispatch(fetchUsers());
        expect(store.getState().users.users).toEqual([fakeUser]);
    });
    it("should handle set login", async () => {
        axios.put = jest.fn().mockResolvedValue({
            data: { ...fakeSingleUser, logged_in: true },
        });
        await store.dispatch(setLogin(fakeSingleUser));
        expect(store.getState().users.currUser).toEqual(fakeSingleUser);
    });
    it("should handle set radius", async () => {
        axios.put = jest.fn().mockResolvedValue({
            data: { ...fakeSingleUser, radius: 30 },
        });
        await store.dispatch(setRadius({ user: fakeSingleUser, radius: 30 }));
        expect(store.getState().users.currUser).toEqual({
            ...fakeSingleUser,
            radius: 30,
        });
    });
    it("should handle set logout", async () => {
        axios.put = jest.fn().mockResolvedValue({
            data: { ...fakeSingleUser, logged_in: false },
        });
        await store.dispatch(setLogout(fakeSingleUser));
        expect(store.getState().users.currUser).toEqual(null);
    });
    it("should not set radius when currUser is null", async () => {
        axios.put = jest.fn().mockResolvedValue({
            data: { ...fakeSingleUser, radius: 30 },
        });
        await store.dispatch(setRadius({ user: fakeSingleUser, radius: 30 }));
        expect(store.getState().users.currUser).toEqual(null);
    });
});
