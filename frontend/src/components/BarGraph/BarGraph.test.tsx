import { render } from "@testing-library/react";
import BarGraph from "./BarGraph";

describe("<MapSearch />", () => {
    it("should render withour errors", () => {
        const { container } = render(
            <BarGraph
                width={1}
                height={1}
                margin={{ top: 1, bottom: 1, left: 1, right: 1 }}
                data={[{ weather: "weather", range: 1 }]}
                barHeight={15}
                fontWeight={700}
                fontSize={15}
                fontColor={"black"}
            />
        );
        expect(container).toBeTruthy();
    });
});
