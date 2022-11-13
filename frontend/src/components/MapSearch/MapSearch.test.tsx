import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from 'react-dom/test-utils';
import MapSearch from "./MapSearch";
import {mockSearchResultData} from "../../test-utils/mock";

const setStateMock = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router", ()=>({
  ...jest.requireActual("react-router"),
  useNavigate: ()=>mockNavigate,
}));

const renderComponent = () => {
  const view = render (
    <MapSearch 
      markerPosition={{lat:0, lng:0}} 
      setMarkerPosition={setStateMock} 
      showResults={false} 
      setShowResults={setStateMock}
      setIsOpen={setStateMock}
    />
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

    const {container} = renderComponent();
    // screen.debug(container);
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    // @ts-ignore
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const searchIcon = container.getElementsByClassName(
      "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-19 ForwardRef-searchIconButton-21"
    )[0];
    fireEvent.click(searchIcon!);
    expect(mockKeywordSearch).toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith("검색 중");
    // setImmediate( () => {
    //   // expect(wrapper.find('#promiseText').text()).toEqual('there is text!');
    //   screen.findAllByText("place");
    // })
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
    const {container} = renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const searchIcon = container.getElementsByClassName(
      "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-27 ForwardRef-searchIconButton-29"
    )[0];
    fireEvent.click(searchIcon!);

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
    const {container} = renderComponent();
    // screen.debug(container)

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    const searchIcon = container.getElementsByClassName(
      "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-35 ForwardRef-searchIconButton-37"
    )[0];
    fireEvent.click(searchIcon!);

    expect(mockKeywordSearch).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith("검색 결과 중 오류가 발생했습니다.");
  });
  // it("should handle search cancel", async ()=>{
  //   const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
  //     mockResultData, 
  //     "OK", 
  //     new kakao.maps.Pagination()
  //   ));
  //   (kakao.maps.services.Places as jest.Mock).mockReturnValue({
  //     keywordSearch: mockKeywordSearch,
  //   });
  //   const {container} = renderComponent();
  //   const searchInput = screen.getByRole("textbox");

  //   // screen.debug(searchInput);

  //   fireEvent.change(searchInput, {target: {value: "서울대"}});
  //   await screen.findByDisplayValue("서울대");

  //   // @ts-ignore
  //   // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  //   const searchIcon = container.getElementsByClassName(
  //     "MuiButtonBase-root MuiIconButton-root ForwardRef-iconButton-3"
  //   )[0];
  //   fireEvent.click(searchIcon!);
  //   expect(mockKeywordSearch).toHaveBeenCalled();
  //   await screen.findAllByText("place");
  // });

  // it("should search result: do nothing", async ()=>{
  //   const mockAlert = jest.fn();
  //   window.alert = mockAlert;
  //   const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
  //     mockResultData, 
  //     "ABC", 
  //     new kakao.maps.Pagination()
  //   ));
  //   (kakao.maps.services.Places as jest.Mock).mockReturnValue({
  //     keywordSearch: mockKeywordSearch,
  //   });
  //   renderComponent();
  //   const searchInput = screen.getByRole("textbox");
  //   fireEvent.change(searchInput, {target: {value: "서울대"}});
  //   await screen.findByDisplayValue("서울대");
  //   fireEvent.keyDown(searchInput, {key: "Enter"});
  //   expect(mockKeywordSearch).toHaveBeenCalled();
  // });
  
  // it("should handle click on search result", async ()=>{
  //   const mockKeywordSearch = jest.fn((searchQuery, callback, option)=>callback(
  //     mockResultData, 
  //     "OK", 
  //     new kakao.maps.Pagination()
  //   ));
  //   (kakao.maps.services.Places as jest.Mock).mockReturnValue({
  //     keywordSearch: mockKeywordSearch,
  //   });
  //   renderComponent();
  //   const searchInput = screen.getByRole("textbox");
  //   fireEvent.change(searchInput, {target: {value: "서울대"}});
  //   await screen.findByDisplayValue("서울대");
  //   fireEvent.keyDown(searchInput, {key: "Enter"});
  //   expect(mockKeywordSearch).toHaveBeenCalled();
  //   await screen.findByLabelText("Search Results");
  //   const searchResultItem = screen.getByText("place1");
  //   fireEvent.click(searchResultItem!)
  // });

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

  //   renderComponent();

  //   const searchInput = screen.getByRole("textbox");
  //   fireEvent.change(searchInput, {target: {value: "서울대"}});
  //   await screen.findByDisplayValue("서울대");

  //   fireEvent.keyDown(searchInput, {key: "Enter"});
  //   expect(mockKeywordSearch).toHaveBeenCalled();

  //   await screen.findByLabelText("Search Results");

  //   const links = screen.getAllByRole("link");
    
  //   fireEvent.click(links[0]!)
  //   expect(mockGotoFirst).toHaveBeenCalled();
  //   fireEvent.click(links[1]!)
  //   expect(mockGotoPage).toHaveBeenCalled();
  //   fireEvent.click(links[links.length-1]!)
  //   expect(mockGotoLast).toHaveBeenCalled();
  // });

  it("should do nothing when other key pressed", async ()=>{
    renderComponent();

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");

    fireEvent.keyDown(searchInput, {key: "A"});
  });
});

