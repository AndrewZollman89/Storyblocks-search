import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import Home from "./page";

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("Home page search flow", () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    it("searches and shows results", async () => {
        mockFetch.mockResolvedValueOnce(
            new Response(
                JSON.stringify({ results: [{ id: "r1", title: "Sky", thumbnail: "t.jpg" }] }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            )
        );

        render(<Home />);
        const user = userEvent.setup();

        await user.type(screen.getByRole("textbox"), "sky");
        await user.keyboard("{Enter}");

        expect(await screen.findByText("Sky")).toBeInTheDocument();
    });

    it("shows empty state", async () => {
        mockFetch.mockResolvedValueOnce(
            new Response(JSON.stringify({ ok: true, results: [] }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            })
        );

        render(<Home />);
        const user = userEvent.setup();
        await user.type(screen.getByRole("textbox"), "zzz");
        await user.keyboard("{Enter}");

        expect(await screen.findByText(/No results found/i)).toBeInTheDocument();
    });

    it("shows error message when API fails", async () => {
        mockFetch.mockResolvedValueOnce(
            new Response(JSON.stringify({ error: "Oops" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            })
        );

        render(<Home />);
        const user = userEvent.setup();
        await user.type(screen.getByRole("textbox"), "fail");
        await user.keyboard("{Enter}");

        expect(await screen.findByText(/Fail/i)).toBeInTheDocument();
    });
});
