import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStore, mockStore2 } from "../../test-utils/mock";
import MyBadges from "./MyBadges";

const myBadgesJSX = (
    <Provider store={mockStore}>
        <MyBadges />
    </Provider>
);
const myBadgesJSX2 = (
    <Provider store={mockStore2}>
        <MyBadges />
    </Provider>
);
jest.mock(
    "../../components/Badge/Badge",
    () =>
        ({
            title,
            image,
            description,
            is_fulfilled,
            onClick
        }: {
            title: string;
            image: string;
            description: string;
            is_fulfilled: boolean;
            onClick: () => void;
        }) =>
            (
                <div>
                    <button onClick={onClick}>{`CallBack ${title}`}</button>
                </div>
            )
);
const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<MyBadges />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render withour errors", async () => {
        const view = render(myBadgesJSX);
        expect(view).toBeTruthy();
    });
    it("should handle back button", ()=>{
        const view = render(myBadgesJSX);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const backBtn = view.container.querySelector("#back-button");
        fireEvent.click(backBtn!);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
    it("should handle onClickBadge button", async()=>{
        render(myBadgesJSX);
        await waitFor(() => screen.findByText("CallBack badge3"));
        const badgeButton = screen.getByText("CallBack badge3");
        fireEvent.click(badgeButton!);
        const setBtn = await waitFor(() => screen.findByText("Set As Main Badge"));
        fireEvent.click(badgeButton!);
        await waitFor(() => expect(setBtn).not.toBeInTheDocument());
    });
    it("should handle onClickBadge button for unfulfilled", async()=>{
        render(myBadgesJSX);
        await waitFor(() => screen.findByText("CallBack badge2"));
        const unfulfilledBadgeButton = screen.getByText("CallBack badge2");
        fireEvent.click(unfulfilledBadgeButton!);
    });
    it("should handle setAsMainBadge", async()=>{
        const view = render(myBadgesJSX);
        await waitFor(() => screen.findByText("CallBack badge3"));
        const badgeButton = screen.getByText("CallBack badge3");
        fireEvent.click(badgeButton!);
        const setBtn = await waitFor(() => screen.findByText("Set As Main Badge"));
        fireEvent.click(setBtn!);
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
        const mainBadge = view.container.querySelector("img");
        await waitFor(() => expect(mainBadge?.src).toContain("src3"));
    });
    it("should handle faulty setAsMainBadge", async()=>{
        render(myBadgesJSX2);
        await waitFor(() => screen.findByText("CallBack badge3"));
        const badgeButton = screen.getByText("CallBack badge3");
        fireEvent.click(badgeButton!);
        const setBtn = await waitFor(() => screen.findByText("Set As Main Badge"));
        fireEvent.click(setBtn!);
    });
});
