import { Dictionary } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import SignIn from "./SignIn";

const signInJSX = (
  <Provider store={mockStore}>
      <SignIn />
  </Provider>
);

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
    Navigate: (props: any) => {
      mockNavigate(props.to);
      return null;
    },
}));

const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useDispatch: () => mockDispatch,
}));

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

describe("<SignIn />", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        jest.restoreAllMocks();
        // jest.clearAllMocks();
    });
    it("should change values", async () => {
        const view = render(signInJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const email = view.container.querySelector('#email-input');
        if(email){
          fireEvent.change(email, { target: { value: "test@test.com" } });
        }
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const password = view.container.querySelector('#password-input');
        if(password){
          fireEvent.change(password, { target: { value: "passtest" } });
        }
        await screen.findByDisplayValue("passtest");
    });
    it("should sign in", async () => {
        render(signInJSX);
        const signin = screen.getByText("Sign In");
        fireEvent.click(signin);
        expect(mockDispatch).toHaveBeenCalledTimes(1);
        // const val = window.sessionStorage.getItem('isLoggedIn')
        // expect(val).toEqual("true");
        // expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should sign up", async () => {
        render(signInJSX);
        const signup = screen.getByText("Sign Up");
        fireEvent.click(signup);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should navigate to mainpage when user is already signed in", async () => {
      window.sessionStorage.setItem('isLoggedIn', "true");
      render(signInJSX);
      // eslint-disable-next-line testing-library/no-debugging-utils
      // screen.debug();
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});
