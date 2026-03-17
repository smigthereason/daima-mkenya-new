// lib/utils/sanity.ts
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique key for Sanity array items
 * Sanity requires _key property for each item in an array
 */
export function generateSanityKey(): string {
  return uuidv4().replace(/-/g, "").substring(0, 8);
}

/**
 * Adds _key properties to array items if they don't have them
 */
export function ensureArrayKeys<T extends Record<string, any>>(
  items: T[],
): T[] {
  return items.map((item) => {
    if (!item._key) {
      return { ...item, _key: generateSanityKey() };
    }
    return item;
  });
}
