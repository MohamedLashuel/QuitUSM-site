import { describe, expect, it } from "vitest";
import { matchesQuery, planView, statusMessage } from "../src/scripts/lib/blogFilter";

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

const titles = ["why we started", "boredom is good", "reading again", "phone-free bedroom"];
const plan = (query: string, limit: number) => planView(titles, (title) => title, query, limit);

describe("planView", () => {
  it("shows the first `limit` items for an empty query", () => {
    expect(plan("", 2)).toEqual({ visible: ["why we started", "boredom is good"], matchCount: 4, hasMore: true });
  });
  it("applies the limit to matches only", () => {
    expect(plan("e", 2).visible).toEqual(["why we started", "boredom is good"]);
    expect(plan("ing", 6)).toEqual({ visible: ["reading again"], matchCount: 1, hasMore: false });
  });
  it("reports no more items when matches exactly fill the limit", () => {
    expect(plan("", 4).hasMore).toBe(false);
  });
  it("returns no items when nothing matches", () => {
    expect(plan("zzz", 6)).toEqual({ visible: [], matchCount: 0, hasMore: false });
  });
});

describe("statusMessage", () => {
  it("builds status messages", () => {
    expect(statusMessage(0, 0)).toBe("No articles found");
    expect(statusMessage(1, 1)).toBe("Showing 1 of 1 article");
    expect(statusMessage(6, 8)).toBe("Showing 6 of 8 articles");
  });
});
