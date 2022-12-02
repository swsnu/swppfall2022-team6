import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Statistics from "./Statistics";
import React from "react";
import { getMockStore, mockStore } from "../../test-utils/mock";
import { Provider } from "react-redux";

jest.mock("react-minimal-pie-chart", () => ({
    PieChart: ({
        label,
    }: {
        label: ({
            x,
            y,
            dx,
            dy,
            dataEntry,
            dataIndex,
        }: {
            x: number;
            y: number;
            dx: number;
            dy: number;
            dataEntry: any;
            dataIndex: number;
        }) => React.SVGProps<SVGTextElement> | string;
    }) => <div>PieChart</div>,
}));

describe("<Statistics />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should successfully get reports", async () => {
        render(
            <Provider store={mockStore}>
                <Statistics />
            </Provider>
        );
        screen.getByText("PieChart");
    });
    it("should not show anything if no reports", async () => {
        const mymockStore = getMockStore({
            users: { users: [], currUser: null, userPosts: [], userBadges: []},
            posts: {
                posts: [],
            },
            reports: {
                reports: [],
            },
            hashtags: {
                hashtags: [],
                top3: [],
            },
            positions: {
                position: {
                    lat: 37.44877599087201,
                    lng: 126.95264777802309,
                },
            },
        });
        render(
            <Provider store={mymockStore}>
                <Statistics />
            </Provider>
        );
        screen.getByText("No Statistics!");
    });
});
