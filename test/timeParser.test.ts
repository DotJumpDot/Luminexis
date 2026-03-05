/**
 * Luminexis - Time parser tests
 */

import { parseTime, formatTime, isValidTime } from "../src/core/timeParser";

describe("timeParser", () => {
  describe("parseTime", () => {
    it("should parse seconds", () => {
      expect(parseTime("30s").milliseconds).toBe(30000);
    });

    it("should parse minutes", () => {
      expect(parseTime("5m").milliseconds).toBe(300000);
    });

    it("should parse hours", () => {
      expect(parseTime("1h").milliseconds).toBe(3600000);
    });

    it("should parse days", () => {
      expect(parseTime("1d").milliseconds).toBe(86400000);
    });

    it("should parse weeks", () => {
      expect(parseTime("1w").milliseconds).toBe(604800000);
    });

    it("should parse compound time", () => {
      expect(parseTime("1h30m").milliseconds).toBe(5400000);
      expect(parseTime("2d12h").milliseconds).toBe(216000000);
    });

    it("should parse number as milliseconds", () => {
      expect(parseTime(5000).milliseconds).toBe(5000);
    });

    it("should parse numeric string as milliseconds", () => {
      expect(parseTime("5000").milliseconds).toBe(5000);
    });

    it("should throw error for negative numbers", () => {
      expect(() => parseTime(-1000)).toThrow();
    });

    it("should throw error for empty string", () => {
      expect(() => parseTime("")).toThrow();
    });

    it("should throw error for invalid format", () => {
      expect(() => parseTime("abc")).toThrow();
      expect(() => parseTime("1x")).toThrow();
    });
  });

  describe("formatTime", () => {
    it("should format seconds", () => {
      expect(formatTime(30000)).toBe("30s");
    });

    it("should format minutes", () => {
      expect(formatTime(300000)).toBe("5m");
    });

    it("should format hours", () => {
      expect(formatTime(3600000)).toBe("1h");
    });

    it("should format compound time", () => {
      expect(formatTime(5400000)).toBe("1h 30m");
    });

    it("should return 0s for zero", () => {
      expect(formatTime(0)).toBe("0s");
    });

    it("should return 0s for negative", () => {
      expect(formatTime(-1000)).toBe("0s");
    });
  });

  describe("isValidTime", () => {
    it("should return true for valid time strings", () => {
      expect(isValidTime("5m")).toBe(true);
      expect(isValidTime("1h30m")).toBe(true);
    });

    it("should return true for valid numbers", () => {
      expect(isValidTime(5000)).toBe(true);
    });

    it("should return false for invalid time", () => {
      expect(isValidTime("invalid")).toBe(false);
      expect(isValidTime("")).toBe(false);
    });
  });
});
