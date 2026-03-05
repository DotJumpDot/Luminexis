/**
 * Luminexis - Main test suite
 */

import Luminexis from "../src/Luminexis";

// Mock timers for consistent testing
jest.useFakeTimers();

describe("Luminexis", () => {
  let luminexis: Luminexis;

  afterEach(() => {
    if (luminexis) {
      luminexis.destroy();
    }
    jest.clearAllTimers();
  });

  describe("Constructor", () => {
    it("should create instance with default options", () => {
      luminexis = new Luminexis();
      expect(luminexis).toBeInstanceOf(Luminexis);
      expect(luminexis.isRunning()).toBe(false);
      expect(luminexis.isIdle()).toBe(false);
    });

    it("should create instance with custom timeout string", () => {
      luminexis = new Luminexis({ timeout: "1m" });
      const info = luminexis.getInfo();
      expect(info.timeout).toBe(60000);
    });

    it("should create instance with custom timeout number", () => {
      luminexis = new Luminexis({ timeout: 30000 });
      const info = luminexis.getInfo();
      expect(info.timeout).toBe(30000);
    });

    it("should throw error for invalid timeout format", () => {
      expect(() => {
        new Luminexis({ timeout: "invalid" });
      }).toThrow();
    });

    it("should throw error if warning >= timeout", () => {
      expect(() => {
        new Luminexis({ timeout: "1m", warning: "2m" });
      }).toThrow("Warning time must be less than timeout");
    });

    it("should auto-start with immediate option", () => {
      luminexis = new Luminexis({ immediate: true });
      expect(luminexis.isRunning()).toBe(true);
    });
  });

  describe("Basic Controls", () => {
    it("should start monitoring", () => {
      luminexis = new Luminexis();
      luminexis.start();
      expect(luminexis.isRunning()).toBe(true);
    });

    it("should stop monitoring", () => {
      luminexis = new Luminexis();
      luminexis.start();
      luminexis.stop();
      expect(luminexis.isRunning()).toBe(false);
    });

    it("should reset idle state", () => {
      luminexis = new Luminexis({ timeout: "1s", immediate: true });

      // Fast forward past timeout
      jest.advanceTimersByTime(1000);
      expect(luminexis.isIdle()).toBe(true);

      // Reset should clear idle
      luminexis.reset();
      expect(luminexis.isIdle()).toBe(false);
    });
  });

  describe("Idle Detection", () => {
    it("should trigger idle after timeout", () => {
      const idleCallback = jest.fn();
      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("idle", idleCallback);

      jest.advanceTimersByTime(1000);

      expect(idleCallback).toHaveBeenCalled();
      expect(luminexis.isIdle()).toBe(true);
    });

    it("should not trigger idle before timeout", () => {
      const idleCallback = jest.fn();
      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("idle", idleCallback);

      jest.advanceTimersByTime(500);

      expect(idleCallback).not.toHaveBeenCalled();
      expect(luminexis.isIdle()).toBe(false);
    });

    it("should emit active event when returning from idle", () => {
      const activeCallback = jest.fn();
      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("active", activeCallback);

      // Go idle
      jest.advanceTimersByTime(1000);
      expect(luminexis.isIdle()).toBe(true);

      // Reset (simulate activity)
      luminexis.reset();
      expect(activeCallback).toHaveBeenCalled();
    });
  });

  describe("Warning Event", () => {
    it("should emit warning before idle", () => {
      const warningCallback = jest.fn();
      luminexis = new Luminexis({
        timeout: "1m",
        warning: "10s",
        immediate: true,
      });
      luminexis.on("warning", warningCallback);

      // Advance to warning time
      jest.advanceTimersByTime(50000); // 50s elapsed, 10s remaining

      expect(warningCallback).toHaveBeenCalledWith(10000);
    });
  });

  describe("Time Getters", () => {
    it("should return 0 idle time when not idle", () => {
      luminexis = new Luminexis({ immediate: true });
      expect(luminexis.getIdleTime()).toBe(0);
    });

    it("should return remaining time until idle", () => {
      luminexis = new Luminexis({ timeout: "1m", immediate: true });
      jest.advanceTimersByTime(30000);

      const remaining = luminexis.getRemainingTime();
      expect(remaining).toBe(30000);
    });

    it("should return 0 remaining time when idle", () => {
      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      jest.advanceTimersByTime(1000);

      expect(luminexis.getRemainingTime()).toBe(0);
    });
  });

  describe("setTimeout", () => {
    it("should update timeout dynamically", () => {
      luminexis = new Luminexis({ timeout: "1m", immediate: true });
      luminexis.setTimeout("30s");

      const info = luminexis.getInfo();
      expect(info.timeout).toBe(30000);
    });

    it("should adjust warning if needed when setting timeout", () => {
      luminexis = new Luminexis({
        timeout: "10m",
        warning: "5m",
        immediate: true,
      });

      // Set timeout to 1m, warning (5m) would be invalid
      luminexis.setTimeout("1m");

      const info = luminexis.getInfo();
      expect(info.warning).toBeLessThan(60000);
    });
  });

  describe("getInfo", () => {
    it("should return complete info object", () => {
      luminexis = new Luminexis({
        timeout: "5m",
        warning: "30s",
        immediate: true,
      });

      const info = luminexis.getInfo();

      expect(info).toHaveProperty("timeout", 300000);
      expect(info).toHaveProperty("timeoutFormatted", "5m");
      expect(info).toHaveProperty("warning", 30000);
      expect(info).toHaveProperty("warningFormatted", "30s");
      expect(info).toHaveProperty("isIdle", false);
      expect(info).toHaveProperty("isRunning", true);
      expect(info).toHaveProperty("idleTime", 0);
      expect(info).toHaveProperty("events");
      expect(info).toHaveProperty("whitelist");
    });
  });

  describe("Event Management", () => {
    it("should support multiple listeners", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("idle", callback1);
      luminexis.on("idle", callback2);

      jest.advanceTimersByTime(1000);

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it("should remove specific listener", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("idle", callback1);
      luminexis.on("idle", callback2);
      luminexis.off("idle", callback1);

      jest.advanceTimersByTime(1000);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe("Tick Event", () => {
    it("should emit tick events while idle", () => {
      const tickCallback = jest.fn();
      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("tick", tickCallback);

      jest.advanceTimersByTime(1000); // Go idle
      jest.advanceTimersByTime(5000); // 5 seconds of idle

      // Should have ticked 5 times
      expect(tickCallback).toHaveBeenCalledTimes(5);
    });
  });

  describe("Destroy", () => {
    it("should cleanup all resources", () => {
      const idleCallback = jest.fn();
      luminexis = new Luminexis({ timeout: "1s", immediate: true });
      luminexis.on("idle", idleCallback);

      luminexis.destroy();

      expect(luminexis.isRunning()).toBe(false);

      jest.advanceTimersByTime(2000);
      expect(idleCallback).not.toHaveBeenCalled();
    });
  });
});
