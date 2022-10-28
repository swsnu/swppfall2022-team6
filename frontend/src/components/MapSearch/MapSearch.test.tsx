import { fireEvent, render, screen, waitFor } from "@testing-library/react";
// import { shallow } from "enzyme";
import MapSearch from "./MapSearch";

const setStateMock = jest.fn();
const mockNavigate = jest.fn();
jest.mock("react-router", ()=>({
  ...jest.requireActual("react-router"),
  useNavigate: ()=>mockNavigate,
}));

const renderComponent = () => {
  const result = render (<MapSearch setMarkPosition={setStateMock}/>);
  return(result);
}

const mockResultData = [
  {
    id: 1,
    place_name: "place1",
    x: 1,
    y: 1,
  },
  {
    id: 2,
    place_name: "place2",
    x: 2,
    y: 2,
  },
  {
    id: 3,
    place_name: "place3",
    x: 3,
    y: 3,
  },
  {
    id: 4,
    place_name: "place4",
    x: 4,
    y: 4,
  },
  {
    id: 5,
    place_name: "place5",
    x: 5,
    y: 5,
  },
]

const kakao = {
  maps: {
    services: {
      Places: jest.fn(),
      Status: {
        OK: "OK",
        ZERO_RESULT: "ZERO_RESULT",
        ERROR: "ERROR",
      }},
    Pagination: jest.fn(),
  },
};
(kakao.maps.Pagination as jest.Mock).mockReturnValue({
  totalCount: 5,
  gotoFirst: jest.fn(),
  gotoPage: jest.fn(),
  gotoLast: jest.fn(),
});
const mockKeywordSearch = jest.fn((searchQuery, callback)=>callback(
    mockResultData, 
    "OK",
    new kakao.maps.Pagination,
));
(kakao.maps.services.Places as jest.Mock).mockReturnValue({
  keywordSearch: jest.fn(),
});

describe("<MapSearch />", ()=>{
  beforeEach(() => {
    jest.clearAllMocks();

    
    global.kakao = kakao as any;
  });

  it("should render withour errors", ()=>{
    const {container} = renderComponent();
    expect(container).toBeTruthy();
  });
  it("should handle input search query", async ()=>{
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
  });
  it("should search result", async ()=>{
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
  });
  it("should search result", async ()=>{
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
  });
});