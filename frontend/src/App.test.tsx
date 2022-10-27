import { render } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import React from "react";
import "@testing-library/jest-dom";

test("renders learn react link", () => {
    render(
        <Provider store={store}>
            <App />
        </Provider>
    );
});
