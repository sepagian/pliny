import { liveQuery } from "dexie";
import { db } from "$lib/db/db";
import type {
  DailyEntry,
  MeterEntry,
  SessionEntry,
  TopupEntry,
} from "$lib/types";

let meterEntries = $state<MeterEntry[]>([]);
let sessionEntries = $state<SessionEntry[]>([]);
let topupEntries = $state<TopupEntry[]>([]);
let dailyEntries = $state<DailyEntry[]>([]);

export function useCombinedEntries() {
  return [
    ...meterEntries,
    ...sessionEntries,
    ...topupEntries,
    ...dailyEntries,
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function initMeterStore() {
  liveQuery(() => db.meters.toArray()).subscribe({
    next: (data) => (meterEntries = data),
    error: console.error,
  });
}

export function useMeterEntries() {
  return meterEntries;
}

export const meterEntriesStore = {
  get meterEntries() {
    return meterEntries;
  },
};

export function initSessionStore() {
  liveQuery(() => db.sessions.toArray()).subscribe({
    next: (data) => (sessionEntries = data),
    error: console.error,
  });
}

export function useSessionEntries() {
  return sessionEntries;
}

export const sessionEntriesStore = {
  get sessionEntries() {
    return sessionEntries;
  },
};

export function initTopupStore() {
  liveQuery(() => db.topups.toArray()).subscribe({
    next: (data) => (topupEntries = data),
    error: console.error,
  });
}

export function useTopupEntries() {
  return topupEntries;
}

export const topupEntriesStore = {
  get topupEntries() {
    return topupEntries;
  },
};

export function initDailyStore() {
  liveQuery(() => db.dailies.toArray()).subscribe({
    next: (data) => (dailyEntries = data),
    error: console.error,
  });
}

export function useDailyEntries() {
  return dailyEntries;
}

export const dailyEntriesStore = {
  get dailyEntries() {
    return dailyEntries;
  },
};
