const STORAGE_KEY = 'na_play_counts';

/** How many plays before a game is automatically marked HOT */
export const HOT_THRESHOLD = 500;

export function getPlayCounts(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}'); }
  catch { return {}; }
}

export function incrementPlayCount(gameId: string): void {
  const counts = getPlayCounts();
  counts[gameId] = (counts[gameId] ?? 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

export function getPlayCount(gameId: string): number {
  return getPlayCounts()[gameId] ?? 0;
}

export function isAutoHot(gameId: string, counts: Record<string, number>): boolean {
  return (counts[gameId] ?? 0) >= HOT_THRESHOLD;
}

/** Sort games: 500+ plays first → manually hot → play count → original order */
export function sortByPopularity<T extends { id: string; isHot?: boolean }>(
  games: T[],
  counts: Record<string, number>
): T[] {
  return [...games].sort((a, b) => {
    const aCount = counts[a.id] ?? 0;
    const bCount = counts[b.id] ?? 0;
    const aHot = aCount >= HOT_THRESHOLD || !!a.isHot;
    const bHot = bCount >= HOT_THRESHOLD || !!b.isHot;
    if (aHot && !bHot) return -1;
    if (!aHot && bHot) return 1;
    return bCount - aCount;
  });
}
