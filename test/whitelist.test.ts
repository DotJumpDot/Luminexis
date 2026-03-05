/**
 * Luminexis - Whitelist tests
 */

import { isWhitelisted, validateWhitelist } from "../src/core/whitelist";

describe("whitelist", () => {
  describe("isWhitelisted", () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
    });

    it("should return false for null element", () => {
      expect(isWhitelisted(null, [".video"])).toBe(false);
    });

    it("should return false for non-Element target", () => {
      expect(isWhitelisted(window, [".video"])).toBe(false);
    });

    it("should return false for empty whitelist", () => {
      const element = document.createElement("div");
      expect(isWhitelisted(element, [])).toBe(false);
    });

    it("should detect matching element", () => {
      const element = document.createElement("div");
      element.className = "video";
      expect(isWhitelisted(element, [".video"])).toBe(true);
    });

    it("should detect matching parent", () => {
      const parent = document.createElement("div");
      parent.className = "video";
      const child = document.createElement("span");
      parent.appendChild(child);

      expect(isWhitelisted(child, [".video"])).toBe(true);
    });

    it("should return false for non-matching element", () => {
      const element = document.createElement("div");
      element.className = "other";
      expect(isWhitelisted(element, [".video"])).toBe(false);
    });
  });

  describe("validateWhitelist", () => {
    it("should return empty array for non-array input", () => {
      expect(validateWhitelist(null as unknown as unknown[])).toEqual([]);
      expect(validateWhitelist("string" as unknown as unknown[])).toEqual([]);
    });

    it("should filter out non-string items", () => {
      const input = [".video", 123, "", null, ".player"];
      expect(validateWhitelist(input as unknown[])).toEqual([".video", ".player"]);
    });

    it("should filter out empty strings", () => {
      expect(validateWhitelist([".video", "", ".player"])).toEqual([".video", ".player"]);
    });

    it("should return empty array for empty input", () => {
      expect(validateWhitelist([])).toEqual([]);
    });
  });
});
