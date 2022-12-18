import { AnyAction, configureStore, Dictionary, EnhancedStore } from "@reduxjs/toolkit";
import { waitFor } from "@testing-library/react";
import { ThunkMiddleware } from "redux-thunk";
import axios from "axios";
import reducer, {
    ApiErrorCode,
    ApiErrorSource,
    ApiErrorState,
    checkApiResponseStatus,
    setApiError,
    setDefaultApiError,
} from "./apierror";

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

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe("apierror reducer", () => {
    type NewType = EnhancedStore<
        {
            apiErrors: ApiErrorState;
        },
        AnyAction,
        [
            ThunkMiddleware<
                {
                    apiErrors: ApiErrorState;
                },
                AnyAction,
                undefined
            >
        ]
    >;

    let store: NewType;
    const initialApiError = {code: ApiErrorCode.NONE, msg: ""};
    const fakeApiError = {code: ApiErrorCode.TOKEN, msg: "token"};
    const fakeApiError2 = {code: ApiErrorCode.BAD_REQUEST, msg: "bad request"};
    beforeAll(() => {
        store = configureStore({ reducer: { apiErrors: reducer } });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should handle initial state", () => {
        expect(reducer(undefined, { type: "unknown" })).toEqual({
            apiError: {
                code: ApiErrorCode.NONE,
                msg: "",
            }
        });
    });
    it("should handle checkApiErrorStatus 401", async () => {
        await store.dispatch(checkApiResponseStatus({status: 401, source: ApiErrorSource.USER}));
    });
    it("should handle checkApiErrorStatus 403 from signin", async () => {
        await store.dispatch(checkApiResponseStatus({status: 403, source: ApiErrorSource.SIGNIN}));
    });
    it("should handle checkApiErrorStatus 403 from others", async () => {
        await store.dispatch(checkApiResponseStatus({status: 403, source: ApiErrorSource.POST}));
    });
    it("should handle checkApiErrorStatus 400 from signin", async () => {
        await store.dispatch(checkApiResponseStatus({status: 400, source: ApiErrorSource.SIGNIN}));
    });
    it("should handle checkApiErrorStatus 400 from signup", async () => {
        await store.dispatch(checkApiResponseStatus({status: 400, source: ApiErrorSource.SIGNUP}));
    });
    it("should handle checkApiErrorStatus 400 from others", async () => {
        await store.dispatch(checkApiResponseStatus({status: 400, source: ApiErrorSource.POST}));
    });
    it("should handle checkApiErrorStatus 500", async () => {
        await store.dispatch(checkApiResponseStatus({status: 500, source: ApiErrorSource.POST}));
    });
    it("should handle setApiError when token error", async () => {
        await store.dispatch(setApiError(fakeApiError));
        expect(store.getState().apiErrors.apiError).toEqual(fakeApiError);
        // await waitFor(() => expect(window.alert).toHaveBeenCalled());
        expect(window.location.reload).toHaveBeenCalled();
    });
    it("should handle setApiError when not token error", async () => {
        await store.dispatch(setApiError(fakeApiError2));
        expect(store.getState().apiErrors.apiError).toEqual(fakeApiError2);
        // expect(window.alert).not.toHaveBeenCalled();
        expect(window.location.reload).not.toHaveBeenCalled();
    });
    it("should handle setDefaultApiError", async () => {
        await store.dispatch(setDefaultApiError());
        expect(store.getState().apiErrors.apiError).toEqual(initialApiError);
    });
});
