import { buildStoryblocksUrl } from "./buildStoryblocksUrl";

describe("buildStoryblocksUrl", () => {
    it("builds Storyblocks search URL with params", () => {
        const url = buildStoryblocksUrl("images", " cat  ", 2, 30);
        expect(url).toContain("/images/search?");
        expect(url).toContain("keywords=cat");
        expect(url).toContain("page=2");
        expect(url).toContain("results_per_page=30");
    });
});