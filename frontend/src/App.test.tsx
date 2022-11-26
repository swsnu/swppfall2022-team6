import { render } from "@testing-library/react";
import App from "./App";
import React from "react";

jest.mock("./containers/MainPage/MainPage", () => () => <div>MainPage</div>);
jest.mock("./containers/SignUp/SignUp", () => () => <div>SignUp</div>);
jest.mock("./containers/SignIn/SignIn", () => () => <div>SignIn</div>);
jest.mock("./containers/MyPage/MyPage", () => () => <div>MyPage</div>);
jest.mock("./containers/MyBadges/MyBadges", () => () => <div>MyBadges</div>);
jest.mock("./containers/PostDetail/PostDetail", () => () => <div>PostDetail</div>);
jest.mock("./containers/AreaFeed/AreaFeed", () => () => <div>AreaFeed</div>);
jest.mock("./containers/HashFeed/HashFeed", () => () => <div>HashFeed</div>);
jest.mock("./PrivateRoute");

test("renders learn react link", () => {
    render(<App />);
});
