import { db } from "$lib/db/db";
import type { MeterEntry } from "$lib/types";

export async function addMeter(data: Omit<MeterEntry, "id">) {
  const id = crypto.randomUUID();
  await db.meters.add({ ...data, id });
  return id;
}

export async function updateMeter(id: string, data: Partial<MeterEntry>) {
  await db.meters.update(id, data);
}

export async function deleteMeter(id: string) {
  await db.meters.delete(id);
}
