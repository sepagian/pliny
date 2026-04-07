export interface Appliance {
  dailyHours: number | undefined;
  id: string;
  name: string;
  sessionBased: boolean | undefined;
  watt: number;
}

interface BaseEntry {
  date?: string;
  id: string;
  kwh?: number;
  timestamp: string;
}

export interface TopupEntry extends BaseEntry {
  amount: number;
  type: "topup";
}

export interface MeterEntry extends BaseEntry {
  meter: number;
  type: "meter";
}

export interface SessionEntry extends BaseEntry {
  appliance: string;
  duration: number;
  type: "session";
}

export interface DailyEntry extends BaseEntry {
  kwh: number;
  type: "daily";
}

export type Entry = TopupEntry | MeterEntry | SessionEntry | DailyEntry;

export type EnrichedEntry = Entry & {
  computedBal: number;
};

export interface DailyStats {
  alwaysOnKwh: number;
  currentBal: number | null;
  daysLeft: number | null;
  firstTopup: TopupEntry | null;
  sessionAvgKwh: number;
  totalDaily: number;
}
