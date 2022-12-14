import {checkValidUserName, checkValidPassword, checkValidEmail, checkValidPasswordCheck} from "./SignUpUtils";

window.alert = jest.fn();

describe("<SignUpUtils />", () => {
    it("should return true for valid username", () => {
        const username = "validusername";
        const res = checkValidUserName(username);
        expect(res).toEqual(true);
    });
    it("should return false for invalid username", () => {
        const username = "iv";
        const res = checkValidUserName(username);
        expect(res).toEqual(false);
        const username2 = "한글아이디";
        const res2 = checkValidUserName(username2);
        expect(res2).toEqual(false);
    });
    it("should return true for valid password test", () => {
        const password = "passwordtest";
        const passwordCheck = "passwordtest"
        const res = checkValidPassword(password);
        expect(res).toEqual(true);
    });
    it("should return false for invalid password test", () => {
        const password = "passwordtest";
        const passwordCheck = "iv"
        const res = checkValidPassword(password);
        expect(res).toEqual(false);
        const password2 = "iv";
        const res2 = checkValidPassword(password2);
        expect(res2).toEqual(false);
    });
});