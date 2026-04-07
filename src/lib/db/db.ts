import { Dexie, type EntityTable } from "dexie";
import type { Appliance, DailyEntry, MeterEntry, SessionEntry, TopupEntry } from "$lib/types";

export const db = new Dexie("plinyDB") as Dexie & {
  appliances: EntityTable<Appliance, "id">;
  topups: EntityTable<TopupEntry, "id">;
  meters: EntityTable<MeterEntry, "id">;
  sessions: EntityTable<SessionEntry, "id">;
  dailies: EntityTable<DailyEntry, "id">;
};

db.version(1).stores({
  appliances: "id, name",
  topups: "id, date, timestamp",
  meters: "id, date, timestamp",
  sessions: "id, date, timestamp, appliance",
  dailies: "id, date, timestamp",
});
