import type { Appliance } from "$lib/types";

export function toKwh(watt: number, hours: number): number {
  return (watt * (hours ?? 0)) / 1000;
}

export function calcDailyKwh(appliance: Appliance): number {
  return toKwh(appliance.watt, appliance.dailyHours ?? 0);
}

export function calcMonthlyKwh(appliance: Appliance): number {
  return calcDailyKwh(appliance) * 30;
}

export function calcMonthlyCost(appliance: Appliance, ratePerKwh: number): number {
  return calcMonthlyKwh(appliance) * ratePerKwh;
}
