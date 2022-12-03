import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
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
        const view = render(<Provider store={mockStore}><MyBadges /></Provider>);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const backBtn = view.container.querySelector("#back-button");
        fireEvent.click(backBtn!);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
        const mainbadge = screen.getByText("Set As Main Badge");
        fireEvent.click(mainbadge);
    });
});
