import { render } from "@testing-library/react";
import Loading from "./Loading";

describe("<MapSearch />", () => {
    it("should render withour errors", () => {
        const { container } = render(<Loading />);
        expect(container).toBeTruthy();
    });
});
