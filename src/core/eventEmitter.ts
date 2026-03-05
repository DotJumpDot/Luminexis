/**
 * Luminexis - Simple event emitter implementation
 */

import { LuminexisEvent, EventCallback } from "./types";

/**
 * Simple typed event emitter
 */
export class EventEmitter {
  private listeners: Map<LuminexisEvent, Set<EventCallback<LuminexisEvent>>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Register an event listener
   * @param event - Event name
   * @param callback - Event callback
   */
  on<T extends LuminexisEvent>(event: T, callback: EventCallback<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback<LuminexisEvent>);
  }

  /**
   * Remove an event listener
   * @param event - Event name
   * @param callback - Event callback to remove
   */
  off<T extends LuminexisEvent>(event: T, callback: EventCallback<T>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback as EventCallback<LuminexisEvent>);
    }
  }

  /**
   * Emit an event to all listeners
   * @param event - Event name
   * @param args - Arguments to pass to listeners
   */
  emit<T extends LuminexisEvent>(event: T, ...args: Parameters<EventCallback<T>>): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        (callback as (...args: unknown[]) => void)(...args);
      });
    }
  }

  /**
   * Remove all listeners for an event or all events
   * @param event - Optional event name to clear, or all if not provided
   */
  removeAllListeners(event?: LuminexisEvent): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Get count of listeners for an event
   * @param event - Event name
   * @returns Number of listeners
   */
  listenerCount(event: LuminexisEvent): number {
    return this.listeners.get(event)?.size || 0;
  }
}
