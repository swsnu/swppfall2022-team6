import { render, screen } from "@testing-library/react";
import Post from "./Post";

describe("<Post />", () => {
    it("should render without errors", () => {
      render(<Post 
        user_name={"User Name"}
        content={"Post Content"}
        location={"User Loc"}
        time ={"Date and Time"}
        id = {1}
        image={""}
        reply_to={1}
        chain_open={false}
        />);
      const username = screen.getByText("User Name"); 
      const postContent = screen.getByText("Post Content"); 
      const postLoc = screen.getByText("User Loc");
      const dtText = screen.getByText("Date and Time");
      screen.getByText("Show All"); 
      expect(username).toBeInTheDocument;
      expect(postContent).toBeInTheDocument;
      expect(postLoc).toBeInTheDocument;
      expect(dtText).toBeInTheDocument;
    });
    it("should not render toggleChainButton when there are no replies", () => {
        render(<Post 
            user_name={"User Name"}
            content={"Post Content"}
            location={"User Loc"}
            time ={"Date and Time"}
            id = {1}
            image={""}
            reply_to={0}
            chain_open={false}
            />);
          const username = screen.getByText("User Name"); 
          const postContent = screen.getByText("Post Content"); 
          const postLoc = screen.getByText("User Loc");
          const dtText = screen.getByText("Date and Time");
          const toggleChainButton = screen.getByText("Show All"); 
          expect(username).toBeInTheDocument;
          expect(postContent).toBeInTheDocument;
          expect(postLoc).toBeInTheDocument;
          expect(dtText).toBeInTheDocument;
          //The toggleChainButton should not be in the document when reply_to is 0
          expect(toggleChainButton).not.toBeInTheDocument;
    });
    it("should render show all when there are replies, and chain is not open", () => {
        render(<Post 
            user_name={"User Name"}
            content={"Post Content"}
            location={"User Loc"}
            time ={"Date and Time"}
            id = {1}
            image={""}
            reply_to={1}
            chain_open={false}
            />);
          const username = screen.getByText("User Name"); 
          const postContent = screen.getByText("Post Content"); 
          const postLoc = screen.getByText("User Loc");
          const dtText = screen.getByText("Date and Time");
          expect(username).toBeInTheDocument;
          expect(postContent).toBeInTheDocument;
          expect(postLoc).toBeInTheDocument;
          expect(dtText).toBeInTheDocument;
          expect(username.classList.contains("reply_to")).not.toBe(0);
          expect(username.classList.contains("chain_open")).toBe(false);
          screen.getByText("Show All");
    });
    it("should render show all when there are replies", () => {
        render(<Post 
            user_name={"User Name"}
            content={"Post Content"}
            location={"User Loc"}
            time ={"Date and Time"}
            id = {1}
            image={""}
            reply_to={1}
            chain_open={true}
            />);
          const username = screen.getByText("User Name"); 
          const postContent = screen.getByText("Post Content"); 
          const postLoc = screen.getByText("User Loc");
          const dtText = screen.getByText("Date and Time");
          expect(username).toBeInTheDocument;
          expect(postContent).toBeInTheDocument;
          expect(postLoc).toBeInTheDocument;
          expect(dtText).toBeInTheDocument;
          expect(username.classList.contains("reply_to")).not.toBe(0);
          expect(username.classList.contains("chain_open")).toBe(true);
          screen.getByText("Close All");
    });
});