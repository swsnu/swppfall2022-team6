import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Map, {PositionType} from "./Map";

const initMarkPosition: PositionType = {lat: 37.44877599087201, lng: 126.95264777802309}; // 서울대 중심

const mockNavigate = jest.fn();
jest.mock("react-router", ()=>({
  ...jest.requireActual("react-router"),
  useNavigate: ()=>mockNavigate,
}));

const renderComponent = () => {
  const result = render (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Map initPosition={initMarkPosition} radius={25}/>}/>
      </Routes>
    </MemoryRouter>
  );
  return(result);
}

describe("<Map />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  it("should render withour errors", ()=>{
    const {container} = renderComponent();
    expect(container).toBeTruthy();
  });
})