/**
 * Luminexis - Time parsing utility
 * Parses human-readable time strings like '5m', '1h30m', '2d' into milliseconds
 */

import { ParsedTime } from "./types";

/**
 * Time multipliers for different units
 */
const TIME_UNITS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
};

/**
 * Parse a time string or number into milliseconds
 * @param time - Time string (e.g., '5m', '1h30m') or number (milliseconds)
 * @returns ParsedTime object with milliseconds and original value
 * @throws Error if format is invalid
 */
export function parseTime(time: string | number): ParsedTime {
  // If number, assume milliseconds
  if (typeof time === "number") {
    if (time < 0) {
      throw new Error("Time value cannot be negative");
    }
    return { milliseconds: time, original: time };
  }

  // If string, parse it
  if (typeof time !== "string" || time.length === 0) {
    throw new Error("Time must be a non-empty string or number");
  }

  // Check for simple number string (treat as milliseconds)
  if (/^\d+$/.test(time)) {
    const ms = parseInt(time, 10);
    return { milliseconds: ms, original: time };
  }

  // Parse complex time string like '1h30m', '2d', '5m'
  const regex = /^(\d+[smhdw])+$/i;
  if (!regex.test(time)) {
    throw new Error(
      `Invalid time format: "${time}". Use format like "30s", "5m", "1h", "2d", "1w", or "2h30m"`
    );
  }

  // Extract all time components
  const componentRegex = /(\d+)([smhdw])/gi;
  let totalMs = 0;
  let match;

  while ((match = componentRegex.exec(time)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();
    totalMs += value * TIME_UNITS[unit];
  }

  return { milliseconds: totalMs, original: time };
}

/**
 * Format milliseconds to human-readable string
 * @param ms - Milliseconds
 * @returns Human-readable string like "5m 30s"
 */
export function formatTime(ms: number): string {
  if (ms <= 0) return "0s";

  const weeks = Math.floor(ms / TIME_UNITS.w);
  ms -= weeks * TIME_UNITS.w;

  const days = Math.floor(ms / TIME_UNITS.d);
  ms -= days * TIME_UNITS.d;

  const hours = Math.floor(ms / TIME_UNITS.h);
  ms -= hours * TIME_UNITS.h;

  const minutes = Math.floor(ms / TIME_UNITS.m);
  ms -= minutes * TIME_UNITS.m;

  const seconds = Math.floor(ms / TIME_UNITS.s);

  const parts: string[] = [];
  if (weeks > 0) parts.push(`${weeks}w`);
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && parts.length < 2) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
}

/**
 * Validate that a time value is valid
 * @param time - Time to validate
 * @returns True if valid, false otherwise
 */
export function isValidTime(time: string | number): boolean {
  try {
    parseTime(time);
    return true;
  } catch {
    return false;
  }
}
