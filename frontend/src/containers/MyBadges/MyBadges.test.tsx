import { fireEvent, render, screen } from "@testing-library/react";
import MyBadges from "./MyBadges";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<MyBadges />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should change values", async () => {
        render(<MyBadges />);
        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const mainbadge = screen.getByText("Set As Main Badge");
        fireEvent.click(mainbadge);
    });
});
