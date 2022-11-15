import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";

import { IProps } from "../SkimStatistics/SkimStatistics";
import MapComponent from "./Map";
import { PositionType } from "../../store/slices/position";

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

jest.mock("../SkimStatistics/SkimStatistics", () => (props: IProps) => (
    <div>SkimStatistics</div>
));

describe("<Map />", () => {
    let mapJSX: JSX.Element;
    beforeEach(() => {
        jest.clearAllMocks();
        mapJSX = (
            <Provider store={mockStore}>
                <MemoryRouter>
                    <Routes>
                        <Route path="/" element={
                            <MapComponent
                                markerPosition={initMarkPosition}
                                setMarkerPosition={jest.fn()}
                                radius={25}
                                isOpen={true}
                                setIsOpen={jest.fn()}
                            />
            }/>
                    </Routes>
                </MemoryRouter>
            </Provider>
        )
    });
    it("should render withour errors", async () => {
        const { container } = render(mapJSX);
        expect(container).toBeTruthy();
        await screen.findByText("Map");
        //screen.debug();
    });
});
