import type { EnrichedEntry, Entry } from "$lib/types";
import { fmt } from "./format";

function formatDateLocal(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function generateDateRange(startDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const today = new Date();
  today.setDate(today.getDate() - 1);
  start.setHours(0, 0, 0, 0);

  while (start <= today) {
    dates.push(formatDateLocal(start));
    start.setDate(start.getDate() + 1);
  }

  return dates;
}

export function generateDailyEntries(
  dates: string[],
  dailyKwh: number
): Entry[] {
  return dates.map((date) => ({
    id: `daily-${date}`,
    date,
    timestamp: `${date}T23:59:59`,
    type: "daily" as const,
    kwh: dailyKwh,
  }));
}

function updateBalance(entry: Entry, currentBal: number | null): number | null {
  if (entry.type === "topup") {
    return (currentBal ?? 0) + entry.amount;
  }
  if (entry.type === "meter") {
    return entry.meter;
  }
  if (entry.type === "session" && currentBal !== null) {
    const kwh = entry.kwh ?? 0;
    return currentBal - kwh;
  }
  return currentBal;
}

export function computeEnrichedEntries(
  entries: Entry[],
  alwaysOnKwhPerDay: number
): EnrichedEntry[] {
  const firstEntryDate = entries
    .map((e) => e.date)
    .filter((d): d is string => !!d)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

  const dateRange = firstEntryDate ? generateDateRange(firstEntryDate) : [];

  const dailyEntries =
    alwaysOnKwhPerDay > 0 && dateRange.length > 0
      ? generateDailyEntries(dateRange, alwaysOnKwhPerDay)
      : [];

  const allEntries = [...entries, ...dailyEntries].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );

  const enriched: EnrichedEntry[] = [];
  let runningBal: number | null = null;

  for (const entry of allEntries) {
    if (entry.type === "daily" && runningBal !== null) {
      const dailyEntry = entry;
      runningBal -= dailyEntry.kwh ?? 0;
    }
    runningBal = updateBalance(entry, runningBal);
    enriched.push({
      ...entry,
      computedBal: runningBal === null ? 0 : fmt(runningBal),
    });
  }

  return enriched.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function computeCurrentBalance(
  entries: Entry[],
  alwaysOnKwhPerDay: number
): number | null {
  const enriched = computeEnrichedEntries(entries, alwaysOnKwhPerDay);
  return enriched.length > 0 ? enriched[0].computedBal : null;
}
