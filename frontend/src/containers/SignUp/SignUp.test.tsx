import { Dictionary } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import SignUp from "./SignUp";

const signUpJSX = (
  <Provider store={mockStore}>
      <SignUp />
  </Provider>
);
const utils = require('./SignUpUtils');

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

window.alert = jest.fn();
// jest.mock('axios');


describe("<SignUp />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should change values", async () => {
        const view =  render(signUpJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const email = view.container.querySelector('#email');
        if(email){
          fireEvent.change(email, { target: { value: "test@test.com" } });
        }
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const username = view.container.querySelector('#username');
        if(username){
          fireEvent.change(username, { target: { value: "test" } });
        };
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const password = view.container.querySelector('#password');
        if(password){
          fireEvent.change(password, { target: { value: "passtest" } });
        }
        await screen.findByDisplayValue("passtest");
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const passwordCheck = view.container.querySelector('#passwordCheck');
        if(passwordCheck){
          fireEvent.change(passwordCheck, { target: { value: "passtest2" } });
        }
        await screen.findByDisplayValue("passtest2");
    });
    it("should sign up", async () => {
        render(signUpJSX);
        const res = {isValid: true, message: ""};
        // const res = { data: {msg: "signup complete"}};
        // jest.spyOn(axios, "post").mockResolvedValue(res);
        const isValidUserName = jest.spyOn(utils, 'checkValidUserName');
        isValidUserName.mockImplementation(() => {return res});
        const isValidEmail = jest.spyOn(utils, 'checkValidEmail');
        isValidEmail.mockImplementation(() => {return res});
        const isValidPassword = jest.spyOn(utils, 'checkValidPassword');
        isValidPassword.mockImplementation(() => {return res});
        const isValidPasswordCheck = jest.spyOn(utils, 'checkValidPasswordCheck');
        isValidPasswordCheck.mockImplementation(() => {return res});
        const signup = screen.getByText("Sign up");
        fireEvent.click(signup!);
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
    it("should not sign up when all input faulty", async () => {
      render(signUpJSX);
      const res = {isValid: true, message: ""};
      const res2 = {isValid: false, message: ""};
      // const res = { data: {msg: "signup complete"}};
      // jest.spyOn(axios, "post").mockResolvedValue(res);
      const isValidUserName = jest.spyOn(utils, 'checkValidUserName');
      isValidUserName.mockImplementation(() => res2);
      const isValidEmail = jest.spyOn(utils, 'checkValidEmail');
      isValidEmail.mockImplementation(() => res2);
      const isValidPassword = jest.spyOn(utils, 'checkValidPassword');
      isValidPassword.mockImplementation(() => res2);
      const isValidPasswordCheck = jest.spyOn(utils, 'checkValidPasswordCheck');
      isValidPasswordCheck.mockImplementation(() => res2);
      const signup = screen.getByText("Sign up");
      fireEvent.click(signup!);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    it("should not sign up when some input faulty", async () => {
      render(signUpJSX);
      const res = {isValid: true, message: ""};
      const res2 = {isValid: false, message: ""};
      // const res = { data: {msg: "signup complete"}};
      // jest.spyOn(axios, "post").mockResolvedValue(res);
      const isValidUserName = jest.spyOn(utils, 'checkValidUserName');
      isValidUserName.mockImplementation(() => res);
      const isValidEmail = jest.spyOn(utils, 'checkValidEmail');
      isValidEmail.mockImplementation(() => res);
      const isValidPassword = jest.spyOn(utils, 'checkValidPassword');
      isValidPassword.mockImplementation(() => res);
      const isValidPasswordCheck = jest.spyOn(utils, 'checkValidPasswordCheck');
      isValidPasswordCheck.mockImplementation(() => res2);
      const signup = screen.getByText("Sign up");
      fireEvent.click(signup!);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    it("should not sign up when some input faulty2", async () => {
      render(signUpJSX);
      const res = {isValid: true, message: ""};
      const res2 = {isValid: false, message: ""};
      // const res = { data: {msg: "signup complete"}};
      // jest.spyOn(axios, "post").mockResolvedValue(res);
      const isValidUserName = jest.spyOn(utils, 'checkValidUserName');
      isValidUserName.mockImplementation(() => res);
      const isValidEmail = jest.spyOn(utils, 'checkValidEmail');
      isValidEmail.mockImplementation(() => res);
      const isValidPassword = jest.spyOn(utils, 'checkValidPassword');
      isValidPassword.mockImplementation(() => res2);
      const isValidPasswordCheck = jest.spyOn(utils, 'checkValidPasswordCheck');
      isValidPasswordCheck.mockImplementation(() => res);
      const signup = screen.getByText("Sign up");
      fireEvent.click(signup!);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
    // it("should not sign up on status code 400(integrity error)", async () => {
    //     render(<SignUp />);
    //     const err = {response: {status: 400}};
    //     jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    //     const isValidUserName = jest.spyOn(utils, 'isValidUserName');
    //     isValidUserName.mockImplementation(() => true);
    //     const isValidPassword = jest.spyOn(utils, 'isValidPassword');
    //     isValidPassword.mockImplementation(() => true);
    //     const signup = screen.getByText("Sign up");
    //     fireEvent.click(signup);
    //     await waitFor(() => expect(window.alert).toHaveBeenCalledWith('해당 username 또는 email로 이미 가입된 사용자입니다'));
    // });
    // it("should not sign up on other status code", async () => {
    //     render(<SignUp />);
    //     const err = {response: {status: 500}};
    //     jest.spyOn(axios, "post").mockRejectedValueOnce(err);
    //     const isValidUserName = jest.spyOn(utils, 'isValidUserName');
    //     isValidUserName.mockImplementation(() => true);
    //     const isValidPassword = jest.spyOn(utils, 'isValidPassword');
    //     isValidPassword.mockImplementation(() => true);
    //     const signup = screen.getByText("Sign up");
    //     fireEvent.click(signup);
    //     expect(window.alert).not.toHaveBeenCalled();
    // });
    it("should sign in", async () => {
        render(signUpJSX);
        const signin = screen.getByText("Sign In");
        fireEvent.click(signin);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should navigate to mainpage when user is already signed in", async () => {
        window.sessionStorage.setItem('isLoggedIn', "true");
        render(signUpJSX);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
      });
});
