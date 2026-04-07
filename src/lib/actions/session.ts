import { db } from "$lib/db/db";
import type { SessionEntry } from "$lib/types";

export async function addSession(data: Omit<SessionEntry, "id">) {
  const id = crypto.randomUUID();
  await db.sessions.add({ ...data, id });
  return id;
}

export async function updateSession(id: string, data: Partial<SessionEntry>) {
  await db.sessions.update(id, data);
}

export async function deleteSession(id: string) {
  await db.sessions.delete(id);
}
