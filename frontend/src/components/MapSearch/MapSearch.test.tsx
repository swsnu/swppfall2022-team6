import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { mockStore } from "../../test-utils/mock";
import { MemoryRouter, Route, Routes } from "react-router";
import MapSearch from "./MapSearch";
import {mockSearchResultData} from "../../test-utils/mock";

const setStateMock = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router", ()=>({
  ...jest.requireActual("react-router"),
  useNavigate: ()=>mockNavigate,
}));

const renderComponent = (showResults: boolean = false) => {
  const view = render (
    <Provider store={mockStore}>
        <MapSearch 
          markerPosition={{lat:0, lng:0}} 
          setMarkerPosition={setStateMock} 
          showResults={showResults} 
          setShowResults={setStateMock}
          setIsOpen={setStateMock}
        />
      </Provider>
    
  );
  return(view);
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
      new kakao.maps.Pagination()
      ));
      (kakao.maps.services.Places as jest.Mock).mockReturnValue({
        keywordSearch: mockKeywordSearch,
      });
      const mockConsoleLog = jest.fn();
      console.log = mockConsoleLog;
      renderComponent();

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, {target: {value: "서울대"}});
      await screen.findByDisplayValue("서울대");

      fireEvent.keyDown(searchInput, {key: 'Enter', code: 'Enter', charCode: 13})
      expect(mockKeywordSearch).toHaveBeenCalled();
      expect(mockConsoleLog).toHaveBeenCalledWith("검색 중"); 
  });

  it("should search result: zero result", async ()=>{
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "ZERO_RESULT", 
      new kakao.maps.Pagination()
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    fireEvent.keyDown(searchInput, {key: 'Enter', code: 'Enter', charCode: 13})

    expect(mockKeywordSearch).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith("검색 결과가 존재하지 않습니다.");
  });

  it("should search result: error", async ()=>{
    const mockAlert = jest.fn();
    window.alert = mockAlert;
    const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
      mockResultData, 
      "ERROR", 
      new kakao.maps.Pagination()
    ));
    (kakao.maps.services.Places as jest.Mock).mockReturnValue({
      keywordSearch: mockKeywordSearch,
    });
    renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.keyDown(searchInput, {key: 'Enter', code: 'Enter', charCode: 13})

    expect(mockKeywordSearch).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith("검색 결과 중 오류가 발생했습니다.");
  });

  // it("should handle click on pagination", async ()=>{
  //   const mockGotoFirst = jest.fn();
  //   const mockGotoPage = jest.fn();
  //   const mockGotoLast = jest.fn();
  //   (kakao.maps.Pagination as jest.Mock).mockReturnValue({
  //     totalCount: mockResultData.length,
  //     gotoFirst: mockGotoFirst,
  //     gotoPage: mockGotoPage,
  //     gotoLast: mockGotoLast,
  //   });
  //   const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
  //     mockResultData, 
  //     "OK", 
  //     new kakao.maps.Pagination()
  //   ));
  //   (kakao.maps.services.Places as jest.Mock).mockReturnValue({
  //     keywordSearch: mockKeywordSearch,
  //   });
  //   console.error = jest.fn()

  //   renderComponent(true);

  //   const searchInput = screen.getByRole("textbox");
  //   fireEvent.change(searchInput, {target: {value: "서울대"}});
  //   await screen.findByDisplayValue("서울대");
  //   console.log(searchInput)

  //   // fireEvent.keyDown(searchInput, {key: "Enter"});
  //   // expect(mockKeywordSearch).toHaveBeenCalled();


  //   // await screen.findByLabelText("Search Results");
  //   // await screen.findByText("place1");

  //   const links = screen.getAllByRole("link");
    
  //   fireEvent.click(links[0]!)
  //   expect(mockGotoFirst).toHaveBeenCalled();
  //   // fireEvent.click(links[1]!)
  //   // expect(mockGotoPage).toHaveBeenCalled();
  //   // fireEvent.click(links[links.length-1]!)
  //   // expect(mockGotoLast).toHaveBeenCalled();
  // });

  it("should do nothing when other key pressed", async ()=>{
    renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    fireEvent.keyDown(searchInput, {key: "A"});
  });
});

