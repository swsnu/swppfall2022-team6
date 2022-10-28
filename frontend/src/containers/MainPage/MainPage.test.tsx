import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { isJsxText } from "typescript";
import MainPage from "./MainPage";

const mockNavigate = jest.fn();
jest.mock("react-router", ()=>({
  ...jest.requireActual("react-router"),
  useNavigate: ()=>mockNavigate,
}));

// https://kooku0.github.io/blog/%EC%99%B8%EB%B6%80-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC-%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%BD%94%EB%93%9C-%EC%A7%9C%EA%B8%B0/

describe("<MainPage />", ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  });
  it("should render withour errors", ()=>{
    const {container} = render(<MainPage />);
    expect(container).toBeTruthy();
  });
  it("should handle MyPage button", async ()=>{
    render(<MainPage />);
    const myPageBtn = screen.getByRole("button", {name: "MyPage"});
    fireEvent.click(myPageBtn!);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/mypage`));
  });
  it("should handle findout button", async ()=>{
    render(<MainPage />);
    const findoutBtn = screen.getByRole("button", {name: "Find out"});
    fireEvent.click(findoutBtn!);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(`/areafeed`));
  });
  it("should handle report button", async ()=>{
    render(<MainPage />);
    const reportBtn = screen.getByRole("button", {name: "Report"});
    fireEvent.click(reportBtn!);
  });
  it("should handle input search query", async ()=>{
    render(<MainPage />);
    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, {target: {value: "서울대"}});
    await screen.findByDisplayValue("서울대");
    fireEvent.submit(searchInput);
  })
})