import { Dictionary } from "@reduxjs/toolkit";
import PrivateRoute from "./PrivateRoute";

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

describe("<PrivateRoute />", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        jest.clearAllMocks();
    });
    it("should navigate to SignIn if user not logged in", async () => {
        PrivateRoute();
    });
    it("should navigate to outlet if user logged in", async () => {
        window.sessionStorage.setItem('isLoggedIn', "true");
        PrivateRoute();
      });
});
