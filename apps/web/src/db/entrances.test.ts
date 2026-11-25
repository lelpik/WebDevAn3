import { describe, expect, test } from "bun:test";

describe("search", () => {
  test("a quote is text, not SQL", () => {
    expect(searchEntrances("x' OR 1=1 --")).toEqual([]);
  });
});