import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import Post from "./Post";

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate,
}));

describe("<Post />", () => {
    it("should render without errors", () => {
      render(
        <MemoryRouter>
        <Routes>
            <Route
                path="/"
                element={
                  <Post 
                  user_name={"User Name"}
                  content={"Post Content"}
                  location={"User Loc"}
                  created_at ={"Date and Time"}
                  id = {1}
                  image={""}
                  reply_to={null}
                  />
                }
            />
          </Routes>
        </MemoryRouter>
      );
      const username = screen.getByText("User Name"); 
      const postContent = screen.getByText("Post Content"); 
      const postLoc = screen.getByText("User Loc");
      const dtText = screen.getByText("Date and Time");
      expect(username).toBeInTheDocument();
      expect(postContent).toBeInTheDocument();
      expect(postLoc).toBeInTheDocument();
      expect(dtText).toBeInTheDocument();
    });
    it("should not render toggleChainButton when there are no replies", () => {
        render(
        <MemoryRouter>
          <Routes>
              <Route
                  path="/"
                  element={
                  <Post 
                    user_name={"User Name"}
                    content={"Post Content"}
                    location={"User Loc"}
                    created_at ={"Date and Time"}
                    id = {1}
                    image={""}
                    reply_to={null}
                  />
                  }
            />
          </Routes>
        </MemoryRouter>
        );
          const toggleChainButton = screen.queryAllByText("Show All"); 
          //The toggleChainButton should not be in the document when reply_to is 0
          expect(toggleChainButton).toHaveLength(0);
    });
    it("should render show all when there are replies, and chain is not open", () => {
        render(        
        <MemoryRouter>
          <Routes>
            <Route
                path="/"
                element={
                <Post 
                  user_name={"User Name"}
                  content={"Post Content"}
                  location={"User Loc"}
                  created_at ={"Date and Time"}
                  id = {1}
                  image={""}
                  reply_to={1}
                />
                }
            />
          </Routes>
        </MemoryRouter>
        );
        const username = screen.getByText("User Name"); 
        expect(username.classList.contains("reply_to")).not.toBe(null);
        expect(username.classList.contains("chain_open")).toBe(false);
        screen.getByText("Show All");
    });
    it("should render author of reply in post", () => {
      render(        
      <MemoryRouter>
        <Routes>
          <Route
              path="/"
              element={
              <Post 
                user_name={"User Name"}
                content={"Post Content"}
                location={"User Loc"}
                created_at ={"Date and Time"}
                id = {1}
                image={""}
                reply_to={1}
              />
              }
          />
        </Routes>
      </MemoryRouter>
      );
        const chainAuthorUsername = screen.getByText("@WeatherFairy");
        expect(chainAuthorUsername).toBeInTheDocument();
  }); 
    it("should open the chain properly", () => {
      render(        
        <MemoryRouter>
          <Routes>
            <Route
                path="/"
                element={
                <Post 
                  user_name={"User Name"}
                  content={"Post Content"}
                  location={"User Loc"}
                  created_at ={"Date and Time"}
                  id = {1}
                  image={""}
                  reply_to={1}
                  />
                }
            />
          </Routes>
        </MemoryRouter>
      );
      const toggleChainButton = screen.getByText("Show All");
      fireEvent.click(toggleChainButton);
      // should edit after chain backend is implemented
      const chainPostContent = screen.getByText("Original Post..."); 
      const chainPostLoc = screen.getByText("Location");
      const chainDtText = screen.getByText(new Date().toLocaleDateString());
      expect(chainPostContent).toBeInTheDocument();
      expect(chainPostLoc).toBeInTheDocument();
      expect(chainDtText).toBeInTheDocument();
      const newToggleChainButton = screen.getByText("Close All");
      expect(newToggleChainButton).toBeInTheDocument();
    });
    it("should navigate to the post on click", () => {
      render(        
        <MemoryRouter>
          <Routes>
            <Route
                path="/"
                element={
                <Post 
                  user_name={"User Name"}
                  content={"Post Content"}
                  location={"User Loc"}
                  created_at ={"Date and Time"}
                  id = {1}
                  image={""}
                  reply_to={1}
                  />
                }
            />
          </Routes>
        </MemoryRouter>
      );
      const toggleChainButton = screen.getByText("Show All");
      fireEvent.click(toggleChainButton);
      const post = screen.getByText("WeatherFairy");
      fireEvent.click(post!);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
});
