import { fireEvent, render, screen } from "@testing-library/react";
import SignUp from "./SignUp";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<SignUp />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should change values", async () => {
        render(<SignUp />);
        const email = screen.getByLabelText("Email :");
        fireEvent.change(email, { target: { value: "test@test.com" } });
        await screen.findByDisplayValue("test@test.com");
        const password = screen.getByLabelText("Password :");
        fireEvent.change(password, { target: { value: "passtest" } });
        await screen.findByDisplayValue("passtest");
        const username = screen.getByLabelText("Username :");
        fireEvent.change(username, { target: { value: "swpp" } });
        await screen.findByDisplayValue("swpp");
    });
    it("should sign in", async () => {
        render(<SignUp />);
        const signin = screen.getByText("Sign In");
        fireEvent.click(signin);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should sign up", async () => {
        render(<SignUp />);
        const signup = screen.getByText("Sign Up");
        fireEvent.click(signup);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});
