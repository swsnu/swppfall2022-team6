import { fireEvent, render, screen } from "@testing-library/react";
import SignIn from "./SignIn";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<SignIn />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
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
