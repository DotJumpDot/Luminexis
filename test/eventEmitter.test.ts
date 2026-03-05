/**
 * Luminexis - Event emitter tests
 */

import { EventEmitter } from "../src/core/eventEmitter";

describe("EventEmitter", () => {
  let emitter: EventEmitter;

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  describe("on and emit", () => {
    it("should register and trigger listener", () => {
      const callback = jest.fn();
      emitter.on("idle", callback);
      emitter.emit("idle");
      expect(callback).toHaveBeenCalled();
    });

    it("should pass arguments to listeners", () => {
      const callback = jest.fn();
      emitter.on("warning", callback);
      emitter.emit("warning", 5000);
      expect(callback).toHaveBeenCalledWith(5000);
    });

    it("should support multiple listeners", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("idle", callback1);
      emitter.on("idle", callback2);
      emitter.emit("idle");
      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe("off", () => {
    it("should remove specific listener", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("idle", callback1);
      emitter.on("idle", callback2);
      emitter.off("idle", callback1);
      emitter.emit("idle");
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe("removeAllListeners", () => {
    it("should remove all listeners for specific event", () => {
      const callback = jest.fn();
      emitter.on("idle", callback);
      emitter.removeAllListeners("idle");
      emitter.emit("idle");
      expect(callback).not.toHaveBeenCalled();
    });

    it("should remove all listeners when no event specified", () => {
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      emitter.on("idle", callback1);
      emitter.on("active", callback2);
      emitter.removeAllListeners();
      emitter.emit("idle");
      emitter.emit("active");
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });
  });

  describe("listenerCount", () => {
    it("should return correct count", () => {
      expect(emitter.listenerCount("idle")).toBe(0);
      emitter.on("idle", jest.fn());
      expect(emitter.listenerCount("idle")).toBe(1);
      emitter.on("idle", jest.fn());
      expect(emitter.listenerCount("idle")).toBe(2);
    });
  });
});
