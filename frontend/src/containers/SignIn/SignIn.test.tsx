import { Dictionary } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import SignIn from "./SignIn";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
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

// describe('getUserInfo', () => {
//   beforeEach(() => {
//     window.sessionStorage.clear();
//     jest.restoreAllMocks();
//   });
//   it('should get user info from session storage', () => {
//     const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
//     window.sessionStorage.setItem('userInfo', JSON.stringify({ userId: 1, userEmail: 'example@gmail.com' }));
//     const actualValue = getUserInfo();
//     expect(actualValue).toEqual({ userId: 1, userEmail: 'example@gmail.com' });
//     expect(getItemSpy).toBeCalledWith('userInfo');
//   });

//   it('should get empty object if no user info in session storage', () => {
//     const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
//     const actualValue = getUserInfo();
//     expect(actualValue).toEqual({});
//     expect(window.sessionStorage.getItem).toBeCalledWith('userInfo');
//     expect(getItemSpy).toBeCalledWith('userInfo');
//   });
// });

describe("<SignIn />", () => {
    beforeEach(() => {
        window.sessionStorage.clear();
        jest.restoreAllMocks();
        // jest.clearAllMocks();
    });
    it("should change values", async () => {
        render(<SignIn />);
        const email = screen.getByLabelText("Email :");
        fireEvent.change(email, { target: { value: "test@test.com" } });
        await screen.findByDisplayValue("test@test.com");
        const password = screen.getByLabelText("Password :");
        fireEvent.change(password, { target: { value: "passtest" } });
        await screen.findByDisplayValue("passtest");
    });
    it("should sign in", async () => {
        render(<SignIn />);
        const signin = screen.getByText("Sign In");
        fireEvent.click(signin);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should sign up", async () => {
        render(<SignIn />);
        const signup = screen.getByText("Sign Up");
        fireEvent.click(signup);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});
