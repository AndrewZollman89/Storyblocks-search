import { render, screen } from "@testing-library/react";
import React from "react";
import Loading from "./Loading";

describe("Loading", () => {
    it("is announced politely and marked busy", () => {
        render(<Loading label="Loading..." />);
        const el = screen.getByText("Loading...").parentElement!;
        expect(el).toHaveAttribute("aria-live", "polite");
        expect(el).toHaveAttribute("aria-busy", "true");
    });
});
