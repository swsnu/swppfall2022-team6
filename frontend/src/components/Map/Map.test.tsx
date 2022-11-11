import { render, screen } from "@testing-library/react";
import { AddressIProps } from "../SkimStatistics/SkimStatistics";
import MapComponent, { PositionType } from "./Map";

const initMarkPosition: PositionType = {
    lat: 37.44877599087201,
    lng: 126.95264777802309,
}; // 서울대 중심

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

jest.mock("react-kakao-maps-sdk", () => ({
    //...jest.requireActual("react-kakao-maps-sdk"),
    Map: () => (
        <div>
            <button onClick={() => {}}>Map</button>
        </div>
    ),
    Circle: () => <div>Circle</div>,
    MapMarker: () => <div>MapMarker</div>,
    CustomOverlayMap: () => <div>CustomOverlayMap</div>,
}));

jest.mock("../SkimStatistics/SkimStatistics", () => (props: AddressIProps) => (
    <div>SkimStatistics</div>
));

describe("<Map />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should render withour errors", async () => {
        const { container } = render(
            <MapComponent
                initPosition={initMarkPosition}
                radius={25}
                isOpen={true}
                setIsOpen={jest.fn()}
            />
        );
        expect(container).toBeTruthy();
        await screen.findByText("Map");
        //screen.debug();
    });
});
