import { db } from "$lib/db/db";
import type { Appliance } from "$lib/types";

export async function addAppliance(data: Omit<Appliance, "id">) {
  const id = crypto.randomUUID();
  await db.appliances.add({ ...data, id });
  return id;
}

export async function updateAppliance(id: string, data: Partial<Appliance>) {
  await db.appliances.update(id, data);
}

export async function deleteAppliance(id: string) {
  await db.appliances.delete(id);
}
