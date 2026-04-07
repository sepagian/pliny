import { db } from "$lib/db/db";
import type { TopupEntry } from "$lib/types";

export async function addTopup(data: Omit<TopupEntry, "id">) {
  const id = crypto.randomUUID();
  await db.topups.add({ ...data, id });
  return id;
}

export async function updateTopup(id: string, data: Partial<TopupEntry>) {
  await db.topups.update(id, data);
}

export async function deleteTopup(id: string) {
  await db.topups.delete(id);
}
