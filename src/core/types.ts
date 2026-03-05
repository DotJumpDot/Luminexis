/**
 * Luminexis - Type definitions
 */

/**
 * Configuration options for Luminexis
 */
export interface LuminexisOptions {
  /** Idle timeout duration (e.g., '5m', '1h', or milliseconds) */
  timeout?: string | number;
  /** Warning time before idle trigger (e.g., '30s' before timeout) */
  warning?: string | number;
  /** Events that reset the idle timer */
  events?: string[];
  /** CSS selectors for elements that don't reset idle */
  whitelist?: string[];
  /** Start monitoring immediately on create */
  immediate?: boolean;
}

/**
 * Event names supported by Luminexis
 */
export type LuminexisEvent = "idle" | "active" | "warning" | "tick";

/**
 * Event callback types
 */
export type EventCallback<T extends LuminexisEvent> = T extends "warning"
  ? (remainingMs: number) => void
  : T extends "tick"
    ? (idleTime: number) => void
    : () => void;

/**
 * Internal timer state
 */
export interface TimerState {
  idle: boolean;
  running: boolean;
  startTime: number;
  lastActiveTime: number;
  idleStartTime: number | null;
  warningFired: boolean;
}

/**
 * Parsed time value
 */
export interface ParsedTime {
  milliseconds: number;
  original: string | number;
}
