import { render } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import React from "react";
import "@testing-library/jest-dom";

test("renders learn react link", () => {
    render(<App />);
});
