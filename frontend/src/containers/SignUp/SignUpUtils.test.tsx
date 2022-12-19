import {ValidType, checkValidUserName, checkValidPassword, checkValidEmail, checkValidPasswordCheck} from "./SignUpUtils";

window.alert = jest.fn();

describe("<SignUpUtils />", () => {
    it("should return true for valid username", () => {
        const username = "validusername";
        const res = checkValidUserName(username);
        expect(res.isValid).toEqual(true);
    });
    it("should return false for invalid username", () => {
        const username = "iv";
        const res = checkValidUserName(username);
        expect(res.isValid).toEqual(false);
        const username2 = "한글아이디";
        const res2 = checkValidUserName(username2);
        expect(res2.isValid).toEqual(false);
    });
    it("should return true for valid email", () => {
        const email = "valid@email.com";
        const res = checkValidEmail(email);
        expect(res.isValid).toEqual(true);
    });
    it("should return true for invalid email", () => {
        const email = "invalid";
        const res = checkValidEmail(email);
        expect(res.isValid).toEqual(false);
    });
    it("should return true for valid password test", () => {
        const password = "passwordtest";
        const res = checkValidPassword(password);
        expect(res.isValid).toEqual(true);
    });
    it("should return false for invalid password test", () => {
        const password = "iv";
        const res = checkValidPassword(password);
        expect(res.isValid).toEqual(false);
    });
    it("should return true for valid passwordCheck test", () => {
        const password = "passwordtest";
        const passwordCheck = "passwordtest";
        const res = checkValidPasswordCheck(password, passwordCheck);
        expect(res.isValid).toEqual(true);
    });
    it("should return false for invalid passwordCheck test", () => {
        const password = "passwordtest";
        const passwordCheck = "passwordtest2";
        const res = checkValidPasswordCheck(password, passwordCheck);
        expect(res.isValid).toEqual(false);
    });
});