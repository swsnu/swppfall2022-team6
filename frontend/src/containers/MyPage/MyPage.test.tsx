import { fireEvent, render, screen } from "@testing-library/react";
import MyPage from "./MyPage";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<MyPage />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render withour errors", async () => {
        render(<MyPage />);
        const backButton = screen.getByText("Back");
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const badgeButton = screen.getByText("See Badges");
        fireEvent.click(badgeButton);
        const logoutButton = screen.getByText("Log Out");
        fireEvent.click(logoutButton);
        const photosButton = screen.getByText("Only Photos");
        fireEvent.click(photosButton);
    });
});
