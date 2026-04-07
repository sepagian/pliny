import { z } from "zod";

export const applianceSchema = z.object({
  id: z.string().optional(),
  name: z
    .string("Nama perangkat wajib diisi")
    .min(2, "Nama perangkat harus >2 karakter")
    .max(256, "Nama perangkat maks <256 karakter"),
  watt: z.number().min(1, "Daya minimal 1 watt"),
  dailyHours: z.number().min(0).max(24).optional(),
  sessionBased: z.boolean().optional(),
});

export type ApplianceSchema = typeof applianceSchema;

export const logTopUpSchema = z.object({
  id: z.string().optional(),
  date: z.iso.date(),
  amount: z.number().min(1, "Jumlah minimal 1 kWh"),
});

export type LogTopUpSchema = typeof logTopUpSchema;

export const logMeterSchema = z.object({
  id: z.string().optional(),
  meter: z.number().min(1, "Angka meter tidak boleh negatif dan 0"),
});

export type LogMeterSchema = typeof logMeterSchema;

export const logSessionSchema = z.object({
  id: z.string().optional(),
  appliance: z.string().min(1, "Pilih perangkat"),
  duration: z.number().min(0.1, "Durasi minimal 0.1 jam"),
});

export type LogSessionSchema = typeof logSessionSchema;
