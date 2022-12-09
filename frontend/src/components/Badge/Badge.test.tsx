import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import Badge from "./Badge";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Badge />", () => {
    let badgeJSX = (
            {title, image, description, is_fulfilled, onClick}
            :{title: string, image: string, description: string, is_fulfilled: boolean, onClick: () => void}
            = {title: "badge1", image:"src1", description:"badge1", is_fulfilled: true, onClick: () => {}}
        )=>(
        <Provider store={mockStore}>
            <MemoryRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Badge
                                title={title}
                                image={image}
                                description={description}
                                is_fulfilled={is_fulfilled}
                                onClick = {onClick}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        </Provider>
    );
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render without errors", () => {
        render(badgeJSX());
        screen.getByText("badge1");
    });
    it("should render unfulfilled badges", () => {
        render(badgeJSX({title:"badge2", image:"", description:"desc2", is_fulfilled: false, onClick: ()=> {}}));
        screen.getByText("desc2");
    });
});
