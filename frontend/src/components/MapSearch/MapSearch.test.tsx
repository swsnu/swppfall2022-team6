import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import MapSearch from "./MapSearch";
import {mockSearchResultData} from "../../test-utils/mock";

const setStateMock = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router", ()=>({
  ...jest.requireActual("react-router"),
  useNavigate: ()=>mockNavigate,
}));

const renderComponent = () => {
  const result = render (<MapSearch markPosition={{lat:0, lng:0}} setMarkPosition={setStateMock}/>);
  return(result);
}

const mockResultData = mockSearchResultData();

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
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "OK", 
      new kakao.maps.Pagination
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
    expect(mockKeywordSearch).toHaveBeenCalled();
    await screen.findByLabelText("Search Results");
  });

  it("should search result: zero result", async ()=>{
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "ZERO_RESULT", 
      new kakao.maps.Pagination
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
    expect(mockKeywordSearch).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalled();
  });

  it("should search result: error", async ()=>{
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "ERROR", 
      new kakao.maps.Pagination
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
    expect(mockKeywordSearch).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalled();
  });

  it("should search result: do nothing", async ()=>{
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "ABC", 
      new kakao.maps.Pagination
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
    expect(mockKeywordSearch).toHaveBeenCalled();
  });
  
  it("should handle click on search result", async ()=>{
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "OK", 
      new kakao.maps.Pagination
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: "Enter"});
    expect(mockKeywordSearch).toHaveBeenCalled();
    await screen.findByLabelText("Search Results");
    const searchResultItem = screen.getByLabelText("Search Result List Item");
    fireEvent.click(searchResultItem.lastChild!)
  });

  it("should handle click on pagination", async ()=>{
    const mockGotoFirst = jest.fn();
    const mockGotoPage = jest.fn();
    const mockGotoLast = jest.fn();
    (kakao.maps.Pagination as jest.Mock).mockReturnValue({
      totalCount: mockResultData.length,
      gotoFirst: mockGotoFirst,
      gotoPage: mockGotoPage,
      gotoLast: mockGotoLast,
    });
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "OK", 
      new kakao.maps.Pagination
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });

    renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    fireEvent.keyDown(searchInput, {key: "Enter"});
    expect(mockKeywordSearch).toHaveBeenCalled();

    await screen.findByLabelText("Search Results");

    const links = screen.getAllByRole("link");
    
    fireEvent.click(links[0]!)
    expect(mockGotoFirst).toHaveBeenCalled();
    fireEvent.click(links[1]!)
    expect(mockGotoPage).toHaveBeenCalled();
    fireEvent.click(links[links.length-1]!)
    expect(mockGotoLast).toHaveBeenCalled();
  });

  it("should do nothing when other key pressed", async ()=>{
    renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    fireEvent.keyDown(searchInput, {key: "A"});
  });
});

