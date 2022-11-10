import { render } from "@testing-library/react";
import Map, { PositionType } from "./Map";

const initMarkPosition: PositionType = {
    lat: 37.44877599087201,
    lng: 126.95264777802309,
}; // 서울대 중심

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Map />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render withour errors", () => {
        const { container } = render(
            <Map initPosition={initMarkPosition} radius={25} isOpen={true} setIsOpen={jest.fn()}/>
        );
        expect(container).toBeTruthy();
    });
});
