import { render } from "@testing-library/react";
import App from "./App";
import React from "react";

jest.mock("./containers/MainPage/MainPage", () => () => <div>MainPage</div>);
test("renders learn react link", () => {
    render(<App />);
});
