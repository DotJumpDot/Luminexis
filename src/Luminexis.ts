/**
 * Luminexis ✨
 * A lightweight, zero-dependency user idle detection library
 * with warnings, auto-logout support, and cross-tab synchronization.
 *
 * @author DotJumpDot
 * @license MIT
 */

import { LuminexisOptions, LuminexisEvent, EventCallback, TimerState } from "./core/types";
import { parseTime, formatTime } from "./core/timeParser";
import { EventEmitter } from "./core/eventEmitter";
import { isWhitelisted, validateWhitelist } from "./core/whitelist";

/**
 * Default events that trigger activity detection
 */
const DEFAULT_EVENTS: string[] = [
  "mousedown",
  "mousemove",
  "keydown",
  "touchstart",
  "scroll",
  "click",
  "wheel",
];

/**
 * Luminexis - User idle detection class
 */
class Luminexis extends EventEmitter {
  private timeout: number;
  private warning: number | null;
  private events: string[];
  private whitelist: string[];
  private state: TimerState;
  private timeoutId: number | null;
  private warningId: number | null;
  private tickId: number | null;
  private boundHandler: (event: Event) => void;

  /**
   * Create a new Luminexis instance
   * @param options - Configuration options
   */
  constructor(options: LuminexisOptions = {}) {
    super();

    // Parse timeout (default: 5 minutes)
    const parsedTimeout = parseTime(options.timeout ?? "5m");
    this.timeout = parsedTimeout.milliseconds;

    // Parse warning (default: null)
    this.warning = options.warning ? parseTime(options.warning).milliseconds : null;

    // Validate warning is less than timeout
    if (this.warning && this.warning >= this.timeout) {
      throw new Error("Warning time must be less than timeout");
    }

    // Set events (default or custom)
    this.events = Array.isArray(options.events) ? options.events : DEFAULT_EVENTS;

    // Validate and set whitelist
    this.whitelist = validateWhitelist(options.whitelist ?? []);

    // Initialize state
    this.state = {
      idle: false,
      running: false,
      startTime: Date.now(),
      lastActiveTime: Date.now(),
      idleStartTime: null,
      warningFired: false,
    };

    // Timer references
    this.timeoutId = null;
    this.warningId = null;
    this.tickId = null;

    // Bind event handler
    this.boundHandler = this.handleActivity.bind(this);

    // Auto-start if immediate option is set
    if (options.immediate) {
      this.start();
    }
  }

  /**
   * Start monitoring user activity
   */
  start(): void {
    if (this.state.running) {
      return;
    }

    this.state.running = true;
    this.state.lastActiveTime = Date.now();

    // Attach event listeners
    this.attachListeners();

    // Start timers
    this.resetTimers();
  }

  /**
   * Stop monitoring (pause without resetting)
   */
  stop(): void {
    if (!this.state.running) {
      return;
    }

    this.state.running = false;
    this.detachListeners();
    this.clearTimers();
  }

  /**
   * Reset the idle timer manually
   */
  reset(): void {
    this.state.lastActiveTime = Date.now();
    this.state.warningFired = false;

    if (this.state.idle) {
      this.state.idle = false;
      this.state.idleStartTime = null;
      this.emit("active");
    }

    if (this.state.running) {
      this.resetTimers();
    }
  }

  /**
   * Check if user is currently idle
   * @returns True if idle
   */
  isIdle(): boolean {
    return this.state.idle;
  }

  /**
   * Check if monitoring is running
   * @returns True if running
   */
  isRunning(): boolean {
    return this.state.running;
  }

  /**
   * Get current idle time in milliseconds
   * @returns Idle time in ms
   */
  getIdleTime(): number {
    if (!this.state.idle) {
      return 0;
    }
    return Date.now() - (this.state.idleStartTime ?? Date.now());
  }

  /**
   * Get remaining time until idle in milliseconds
   * @returns Remaining time in ms
   */
  getRemainingTime(): number {
    if (this.state.idle) {
      return 0;
    }

    const elapsed = Date.now() - this.state.lastActiveTime;
    return Math.max(0, this.timeout - elapsed);
  }

  /**
   * Change the timeout duration
   * @param timeout - New timeout (e.g., '5m', '1h')
   */
  setTimeout(timeout: string | number): void {
    const parsed = parseTime(timeout);
    this.timeout = parsed.milliseconds;

    // Validate warning still valid
    if (this.warning && this.warning >= this.timeout) {
      this.warning = Math.floor(this.timeout * 0.8); // 80% of new timeout
    }

    if (this.state.running) {
      this.resetTimers();
    }
  }

  /**
   * Get current configuration info
   * @returns Configuration object
   */
  getInfo(): {
    timeout: number;
    timeoutFormatted: string;
    warning: number | null;
    warningFormatted: string | null;
    isIdle: boolean;
    isRunning: boolean;
    idleTime: number;
    remainingTime: number;
    events: string[];
    whitelist: string[];
  } {
    return {
      timeout: this.timeout,
      timeoutFormatted: formatTime(this.timeout),
      warning: this.warning,
      warningFormatted: this.warning ? formatTime(this.warning) : null,
      isIdle: this.state.idle,
      isRunning: this.state.running,
      idleTime: this.getIdleTime(),
      remainingTime: this.getRemainingTime(),
      events: [...this.events],
      whitelist: [...this.whitelist],
    };
  }

  /**
   * Cleanup and remove all listeners (for SPA navigation)
   */
  destroy(): void {
    this.stop();
    this.removeAllListeners();
  }

  /**
   * Handle user activity events
   * @param event - DOM Event
   */
  private handleActivity(event: Event): void {
    // Check if target element is whitelisted
    if (isWhitelisted(event.target, this.whitelist)) {
      return;
    }

    this.reset();
  }

  /**
   * Attach event listeners to document
   */
  private attachListeners(): void {
    this.events.forEach((eventName) => {
      document.addEventListener(eventName, this.boundHandler, true);
    });
  }

  /**
   * Detach event listeners from document
   */
  private detachListeners(): void {
    this.events.forEach((eventName) => {
      document.removeEventListener(eventName, this.boundHandler, true);
    });
  }

  /**
   * Reset and restart all timers
   */
  private resetTimers(): void {
    this.clearTimers();

    const remaining = this.getRemainingTime();

    // Set warning timer if configured
    if (this.warning && !this.state.warningFired) {
      const warningDelay = Math.max(0, remaining - this.warning);
      this.warningId = window.setTimeout(() => {
        this.state.warningFired = true;
        const remainingAtWarning = this.getRemainingTime();
        this.emit("warning", remainingAtWarning);
      }, warningDelay);
    }

    // Set idle timer
    this.timeoutId = window.setTimeout(() => {
      this.triggerIdle();
    }, remaining);
  }

  /**
   * Clear all timers
   */
  private clearTimers(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.warningId !== null) {
      clearTimeout(this.warningId);
      this.warningId = null;
    }

    if (this.tickId !== null) {
      clearInterval(this.tickId);
      this.tickId = null;
    }
  }

  /**
   * Trigger idle state
   */
  private triggerIdle(): void {
    this.state.idle = true;
    this.state.idleStartTime = Date.now();

    this.emit("idle");

    // Start tick interval for UI updates
    this.tickId = window.setInterval(() => {
      this.emit("tick", this.getIdleTime());
    }, 1000);
  }
}

export default Luminexis;
export { LuminexisOptions, LuminexisEvent, EventCallback };
