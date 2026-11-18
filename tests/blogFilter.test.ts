import { describe, expect, it } from "vitest";
import { countMatches, hasMore, matchesQuery, statusMessage, visibility } from "../src/scripts/lib/blogFilter";

const texts = ["why we started", "boredom is good", "reading again", "phone-free bedroom"];

describe("matchesQuery", () => {
  it("matches everything for an empty query", () => {
    expect(matchesQuery("anything", "   ")).toBe(true);
  });
  it("is case-insensitive", () => {
    expect(matchesQuery("boredom is good", "BOREDOM")).toBe(true);
  });
  it("requires every term to match, in any order", () => {
    expect(matchesQuery("boredom is good", "good boredom")).toBe(true);
    expect(matchesQuery("boredom is good", "good phone")).toBe(false);
  });
});

describe("visibility", () => {
  it("limits visible items", () => {
    expect(visibility(texts, "", 2)).toEqual([true, true, false, false]);
  });
  it("applies the limit to matches only", () => {
    expect(visibility(texts, "e", 2)).toEqual([true, true, false, false]);
    expect(visibility(texts, "ing", 6)).toEqual([false, false, true, false]);
  });
});

describe("counts and status", () => {
  it("counts matches", () => {
    expect(countMatches(texts, "o")).toBe(2);
  });
  it("reports whether more items remain", () => {
    expect(hasMore(7, 6)).toBe(true);
    expect(hasMore(6, 6)).toBe(false);
  });
  it("builds status messages", () => {
    expect(statusMessage(0, 0)).toBe("No articles found");
    expect(statusMessage(1, 1)).toBe("Showing 1 of 1 article");
    expect(statusMessage(6, 8)).toBe("Showing 6 of 8 articles");
  });
});
