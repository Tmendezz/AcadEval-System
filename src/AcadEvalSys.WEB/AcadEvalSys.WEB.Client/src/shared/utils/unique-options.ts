import { useMemo } from "react";

/**
 * Filters a list of options by excluding those whose ids are present in the provided set,
 * always preserving the current value if present.
 */
export function filterOptionsById<T extends { id: string }>(
  options: T[],
  excludedIds: Set<string>,
  currentId?: string
): T[] {
  if (!options || options.length === 0) return [];

  return options.filter((opt) => {
    if (currentId && opt.id === currentId) return true;
    return !excludedIds.has(opt.id);
  });
}

/**
 * Generic helper to build an exclusion set from a collection of records.
 */
export function buildExclusionSet<T>(
  items: T[],
  getId: (item: T) => string | undefined,
  ignorePredicate?: (item: T) => boolean
): Set<string> {
  const set = new Set<string>();
  for (const item of items) {
    if (ignorePredicate?.(item)) continue;
    const id = getId(item);
    if (id) set.add(id);
  }
  return set;
}

/**
 * React hook version to memoize filtered options.
 */
export function useFilteredOptionsById<T extends { id: string }>(
  options: T[],
  excludedIds: Set<string>,
  currentId?: string
) {
  return useMemo(
    () => filterOptionsById(options, excludedIds, currentId),
    [options, excludedIds, currentId]
  );
}
