import { beforeEach, describe, expect, it, vi } from "vitest";
import * as route from "./route";

vi.mock("@/lib/server/storyblocks-auth", async () => {
    return {
        signSearchResource: vi.fn(async (type: string) => ({
            hmac: "TEST_HMAC",
            expires: "9999999",
            resource: "/api/v2/images/search"
        }))
    }
});

const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe("api/storyblocks/[type] GET", () => {
    beforeEach(() => mockFetch.mockReset());

    it("returns results json", async () => {
        mockFetch.mockResolvedValueOnce(new Response(
            JSON.stringify({ results: [{ id: "1", title: "A", thumbnail: "a.jpg" }] }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        ));

        const req = new Request("http://localhost/api/storyblocks/images");
        const res = await (route as any).GET(req, { params: { type: "images" } });

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data.results[0].title).toBe("A");
        expect(mockFetch).toHaveBeenCalledOnce();
    });

    it("propagates Storyblocks error", async () => {
        mockFetch.mockResolvedValueOnce(new Response(
            JSON.stringify({ errors: "HMAC header is invalid" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        ));

        const req = new Request("http://localhost/api/storyblocks/videos");
        const res = await (route as any).GET(req, { params: { type: "videos" } });
        expect(res.status).toBe(401);
    });
});
