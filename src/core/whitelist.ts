/**
 * Luminexis - Whitelist utility for excluding elements from activity detection
 */

/**
 * Check if an element or its parents match any of the whitelist selectors
 * @param element - Element to check
 * @param whitelist - Array of CSS selectors
 * @returns True if element is whitelisted
 */
export function isWhitelisted(element: EventTarget | null, whitelist: string[]): boolean {
  if (!element || !(element instanceof Element) || whitelist.length === 0) {
    return false;
  }

  // Check if the element itself matches any whitelist selector
  for (const selector of whitelist) {
    if (element.matches(selector)) {
      return true;
    }

    // Check if any parent matches
    if (element.closest(selector)) {
      return true;
    }
  }

  return false;
}

/**
 * Validate whitelist selectors
 * @param whitelist - Array of CSS selectors
 * @returns Valid selectors only
 */
export function validateWhitelist(whitelist: unknown[]): string[] {
  if (!Array.isArray(whitelist)) {
    return [];
  }

  return whitelist.filter((item): item is string => typeof item === "string" && item.length > 0);
}
