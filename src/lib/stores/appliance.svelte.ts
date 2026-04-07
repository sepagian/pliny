import { liveQuery } from "dexie";
import { db } from "$lib/db/db";
import type { Appliance } from "$lib/types";

let appliances = $state<Appliance[]>([]);

export function initApplianceStore() {
  liveQuery(() => db.appliances.toArray()).subscribe({
    next: (data) => (appliances = data),
    error: console.error,
  });
}

export function useAppliances() {
  return appliances;
}

export const applianceStore = {
  get appliances() {
    return appliances;
  },
};
